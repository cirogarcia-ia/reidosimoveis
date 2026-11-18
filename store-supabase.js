/* Rei dos Imóveis · dados no Supabase do cliente.
   Carregado depois de store.js. Se config.js tiver a URL e a chave pública do Supabase,
   este arquivo substitui o modo de demonstração (dados no navegador) pelo banco de dados. */
(function () {
  const C = window.REI_SUPABASE;
  if (!C || !C.url || !C.anonKey || !window.supabase) return;
  const sb = window.supabase.createClient(C.url, C.anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
  const INI = window.__REI_INICIAIS || { POSTS_INICIAIS: [], MATERIAIS_INICIAIS: [], CONFIG_INICIAL: {} };
  const PRIVADAS = ['iaUrl', 'iaChave'];
  const ehPainel = /admin/i.test(location.pathname) || !!window.REI_PAINEL;
  const agora = () => new Date().toISOString();
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

  let DB = { leads: [], posts: [], materiais: [], config: Object.assign({}, INI.CONFIG_INICIAL), emp: {}, imoveis: [] };
  let usuario = null;
  const ouvintes = [];
  const avisa = (ext) => ouvintes.forEach((f) => { try { f(ext); } catch (e) {} });
  const erro = (msg, e) => { console.error(msg, e); window.dispatchEvent(new CustomEvent('rei-erro', { detail: msg })); };

  /* fila: grava uma coisa de cada vez, na ordem em que o painel pediu */
  let fila = Promise.resolve();
  const enfileira = (fn, msg) => { fila = fila.then(fn).catch((e) => erro(msg || 'Não foi possível salvar. Confira a internet e tente de novo.', e)); return fila; };
  const ok = (r) => { if (r && r.error) throw r.error; return r; };

  /* fotos: data URL → arquivo no Storage (bucket "fotos") → link público */
  async function subir(dataUrl, pasta) {
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return dataUrl;
    const blob = await (await fetch(dataUrl)).blob();
    const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
    const caminho = `${pasta}/${uid()}.${ext}`;
    ok(await sb.storage.from('fotos').upload(caminho, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false }));
    return sb.storage.from('fotos').getPublicUrl(caminho).data.publicUrl;
  }
  async function subirCampos(obj, campos, pasta) { for (const k of campos) if (obj[k]) obj[k] = await subir(obj[k], pasta); }

  async function carregarPublico() {
    const [cfg, emp, posts, mats, ims] = await Promise.all([
      sb.from('config').select('dados').eq('id', 1).maybeSingle(),
      sb.from('emp_override').select('slug, dados'),
      sb.from('posts').select('dados').order('criado_em', { ascending: false }),
      sb.from('materiais').select('dados').order('criado_em', { ascending: true }),
      sb.from('imoveis_publicos').select('dados'),
    ]);
    const conf = (cfg.data && cfg.data.dados) || {};
    DB.config = Object.assign({}, INI.CONFIG_INICIAL, conf);
    DB.emp = Object.fromEntries((emp.data || []).map((r) => [r.slug, r.dados]));
    DB.posts = (posts.data || []).length || conf.semeado ? (posts.data || []).map((r) => r.dados) : INI.POSTS_INICIAIS;
    DB.materiais = (mats.data || []).length || conf.semeado ? (mats.data || []).map((r) => r.dados) : INI.MATERIAIS_INICIAIS;
    DB.imoveis = (ims.data || []).map((r) => r.dados);
  }
  async function ehEquipe() { const r = await sb.rpc('e_equipe'); return r.data === true; }
  let canal = null;
  async function carregarPainel() {
    const [leads, ims, priv] = await Promise.all([
      sb.from('leads').select('id, dados, criado_em').order('criado_em', { ascending: false }).limit(3000),
      sb.from('imoveis').select('dados').order('atualizado_em', { ascending: false }),
      sb.from('config_privada').select('dados').eq('id', 1).maybeSingle(),
    ]);
    DB.leads = (leads.data || []).map((r) => Object.assign({ id: r.id, criado_em: r.criado_em }, r.dados));
    DB.imoveis = (ims.data || []).map((r) => r.dados);
    Object.assign(DB.config, (priv.data && priv.data.dados) || {});
    if (!DB.config.semeado) { // primeira entrada: grava os posts e materiais que já estavam no site
      await enfileira(async () => {
        if (DB.posts.length) ok(await sb.from('posts').upsert(DB.posts.map((p) => ({ id: String(p.id), dados: p }))));
        if (DB.materiais.length) ok(await sb.from('materiais').upsert(DB.materiais.map((m) => ({ id: String(m.id), dados: m }))));
        DB.config.semeado = true; ok(await sb.from('config').upsert({ id: 1, dados: publico(DB.config) }));
      });
    }
    if (!canal) canal = sb.channel('leads-novos').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (p) => {
      const r = p.new; if (DB.leads.some((l) => l.id === r.id)) return;
      DB.leads.unshift(Object.assign({ id: r.id, criado_em: r.criado_em }, r.dados)); avisa(true);
    }).subscribe();
  }
  const publico = (c) => { const o = Object.assign({}, c); PRIVADAS.forEach((k) => delete o[k]); return o; };

  const pronto = (async () => {
    await carregarPublico();
    if (ehPainel) {
      const s = await sb.auth.getSession(); const u = s.data.session && s.data.session.user;
      if (u && await ehEquipe()) { usuario = u; await carregarPainel(); }
    }
  })().catch((e) => erro('Não foi possível carregar os dados do site.', e)).then(() => { window.Rei.carregado = true; avisa(false); });

  window.Rei = {
    modo: 'supabase', carregado: false, pronto,
    get db() { return DB; },
    aoMudar(f) { ouvintes.push(f); },
    salvar() {}, uid,
    sessao: () => !!usuario,
    usuario: () => (usuario ? usuario.email : ''),
    async entrar(email, senha) {
      const r = await sb.auth.signInWithPassword({ email, password: senha });
      if (r.error) return { erro: /invalid/i.test(r.error.message) ? 'E-mail ou senha incorretos.' : r.error.message };
      if (!(await ehEquipe())) { await sb.auth.signOut(); return { erro: 'Este e-mail não tem acesso ao painel. Peça para o administrador incluir você na equipe.' }; }
      usuario = r.data.user; await carregarPainel(); return { ok: true };
    },
    async sair() { await sb.auth.signOut(); usuario = null; DB.leads = []; },
    async enviarLead(dados) {
      const l = Object.assign({ id: uid(), criado_em: agora(), status: 'novo', lido: false, notas: [] }, dados);
      const d = Object.assign({}, l); delete d.id; delete d.criado_em;
      ok(await sb.from('leads').insert({ id: l.id, dados: d })); return l;
    },
    atualizarLead(id, mud) {
      const l = DB.leads.find((x) => x.id === id); if (!l) return;
      Object.assign(l, mud); avisa(false);
      const d = Object.assign({}, l); delete d.id; delete d.criado_em;
      enfileira(async () => ok(await sb.from('leads').update({ dados: d }).eq('id', id)));
      return l;
    },
    excluirLead(id) { DB.leads = DB.leads.filter((x) => x.id !== id); avisa(false); enfileira(async () => ok(await sb.from('leads').delete().eq('id', id))); },
    empOverride(slug) { return DB.emp[slug] || {}; },
    setEmp(slug, mud) {
      DB.emp[slug] = Object.assign({}, DB.emp[slug] || {}, mud); avisa(false);
      const o = DB.emp[slug];
      enfileira(async () => { await subirCampos(o, ['capa', 'bg'], 'empreendimentos'); ok(await sb.from('emp_override').upsert({ slug, dados: o })); });
    },
    setConfig(mud) {
      Object.assign(DB.config, mud); avisa(false);
      const c = DB.config;
      enfileira(async () => {
        await subirCampos(c, ['foto'], 'config');
        ok(await sb.from('config').upsert({ id: 1, dados: publico(c) }));
        if (PRIVADAS.some((k) => k in mud)) ok(await sb.from('config_privada').upsert({ id: 1, dados: Object.fromEntries(PRIVADAS.map((k) => [k, c[k] || ''])) }));
      });
    },
    salvarPost(p) {
      const i = DB.posts.findIndex((x) => x.id === p.id); if (i >= 0) DB.posts[i] = p; else DB.posts.unshift(p); avisa(false);
      enfileira(async () => { await subirCampos(p, ['capa'], 'blog'); ok(await sb.from('posts').upsert({ id: String(p.id), dados: p })); });
    },
    excluirPost(id) { DB.posts = DB.posts.filter((x) => x.id !== id); avisa(false); enfileira(async () => ok(await sb.from('posts').delete().eq('id', String(id)))); },
    salvarMaterial(m) {
      const i = DB.materiais.findIndex((x) => x.id === m.id); if (i >= 0) DB.materiais[i] = m; else DB.materiais.push(m); avisa(false);
      enfileira(async () => { await subirCampos(m, ['capa'], 'materiais'); ok(await sb.from('materiais').upsert({ id: String(m.id), dados: m })); });
    },
    excluirMaterial(id) { DB.materiais = DB.materiais.filter((x) => x.id !== id); avisa(false); enfileira(async () => ok(await sb.from('materiais').delete().eq('id', String(id)))); },
    proximoCodigo() { const n = DB.imoveis.reduce((m, i) => Math.max(m, parseInt(String(i.codigo || '').replace(/\D/g, ''), 10) || 0), 0) + 1; return 'RDI-' + String(n).padStart(3, '0'); },
    salvarImovel(im) {
      im.atualizado_em = agora(); if (!im.id) { im.id = uid(); im.criado_em = agora(); }
      const i = DB.imoveis.findIndex((x) => x.id === im.id); if (i >= 0) DB.imoveis[i] = im; else DB.imoveis.unshift(im);
      avisa(false);
      enfileira(async () => {
        for (let k = 0; k < (im.fotos || []).length; k++) im.fotos[k] = await subir(im.fotos[k], 'imoveis/' + im.id);
        ok(await sb.from('imoveis').upsert({ id: im.id, dados: im, estado: im.estado || 'conferencia', excluido: !!im.excluido }));
      }, 'Não foi possível salvar o imóvel. Se for uma mudança de etapa, ela pode não ser permitida.');
      return true;
    },
    excluirImovel(id) { const m = DB.imoveis.find((x) => x.id === id); if (m) { m.excluido = true; this.salvarImovel(m); } },
    substituir() {}, resetarDemo() {}
  };
})();
