/* Rei dos Imóveis · site */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const APP = $('#app');
  const EMP_BASE = window.REI_EMP || [];
  const HUBS = window.REI_HUBS || {};
  const CIDADES = ['Balneário Camboriú', 'Itajaí', 'Itapema', 'Porto Belo', 'Tijucas'];
  const ROT_CIDADE = { 'Itajaí': 'Praia Brava' };
  const TIPOS = ['Residencial', 'Comercial', 'Misto', 'Terreno'];
  const catDe = (e) => { const t = String(e.tipo || '').toLowerCase(); return /lote|terreno/.test(t) ? 'Terreno' : /misto/.test(t) ? 'Misto' : /comercial|loja|sala/.test(t) ? 'Comercial' : 'Residencial'; };
  const CIDADES_BUSCA = [['Itajaí', 'Praia Brava'], ['Balneário Camboriú', 'Balneário Camboriú'], ['Itapema', 'Itapema'], ['Porto Belo', 'Porto Belo']];
  const FASES = [['Pré-lançamento', 'Pré-lançamento'], ['Lançamento', 'Lançamento'], ['Em obras', 'Em obra'], ['Pronto', 'Pronto']];
  const ESTAGIOS = ['Pré-lançamento', 'Lançamento', 'Em obras', 'Pronto'];
  const OBJETIVOS = ['Investimento', 'Moradia', 'Prefiro conversar antes'];
  const FAIXAS = ['Até R$ 1 milhão', 'Até R$ 3 milhões', 'Até R$ 5 milhões', 'Acima de R$ 5 milhões', 'Prefiro conversar antes'];

  const I = {
    seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    cor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 8V3h10v5M7 17H4v-7a2 2 0 012-2h12a2 2 0 012 2v7h-3"/><path d="M7 14h10v7H7z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.36h-4v-4.75c0-1.13-.02-2.59-1.58-2.59-1.58 0-1.82 1.24-1.82 2.5v4.84h-4z"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/></svg>',
    ant: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 5l-7 7 7 7"/></svg>',
    prox: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5l7 7-7 7"/></svg>'
  };

  /* ---------- dados ---------- */
  const cfg = () => Rei.db.config;
  const brl = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const CIDADES_MENU = [['Balneário Camboriú', 'Balneário Camboriú'], ['Itajaí', 'Praia Brava · Itajaí'], ['Itapema', 'Itapema'], ['Porto Belo', 'Porto Belo'], ['Tijucas', 'Tijucas']];
  function cadParaEmp(m) {
    const specs = [m.area ? m.area + ' m²' : '', m.quartos ? m.quartos + (m.quartos == 1 ? ' quarto' : ' quartos') : '', m.suites ? m.suites + (m.suites == 1 ? ' suíte' : ' suítes') : '', m.vagas ? m.vagas + (m.vagas == 1 ? ' vaga' : ' vagas') : ''].filter(Boolean);
    return { slug: 'i-' + m.id, codigo: m.codigo, nome: m.titulo, local: [m.bairro, m.cidade].filter(Boolean).join(' · '), resumoCard: m.resumo || specs.join(' · ') || (m.descricao || '').slice(0, 140),
      capa: (m.fotos && m.fotos[0]) || 'coroa.png', cidade: m.cidade, bairro: m.bairro, tipo: m.tipo || 'Apartamento', estagio: m.situacao || 'Pronto', modelo: 'cad', grupo: m.construtora || '',
      precoTxt: m.valor ? (m.aPartir ? 'a partir de ' : '') + brl(m.valor) : 'Valor sob consulta', specs, cad: m, destaque: !!m.destaque, ativo: true };
  }
  function emps() {
    const cads = (Rei.db.imoveis || []).filter((m) => !m.excluido && (m.estado ? m.estado === 'publicado' : m.publicado !== false) && !['reservado', 'vendido', 'bloqueado'].includes(m.disp)).sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0)).map(cadParaEmp);
    return cads.concat(EMP_BASE.map((e) => { const o = Rei.empOverride(e.slug); const ed = {}; ['nome', 'local', 'resumoCard', 'titulo', 'resumo', 'tipo', 'capa', 'bg', 'estagio'].forEach((k) => { if (o[k]) ed[k] = o[k]; }); return Object.assign({}, e, ed, { aPartirDe: o.aPartirDe || '', ativo: o.ativo !== false }); }).filter((e) => e.ativo));
  }
  const achar = (slug) => emps().find((e) => e.slug === slug);
  const rotaDe = (e) => '#/imovel/' + e.slug;
  const regiao = (c) => ROT_CIDADE[c] || c;

  /* ---------- favoritos ---------- */
  function favs() { try { return JSON.parse(localStorage.getItem('rei_favs') || '[]'); } catch (e) { return MEMFAV; } }
  let MEMFAV = [];
  function setFavs(a) { MEMFAV = a; try { localStorage.setItem('rei_favs', JSON.stringify(a)); } catch (e) {} contaFav(); }
  function toggleFav(slug) { const f = favs(); const i = f.indexOf(slug); if (i >= 0) f.splice(i, 1); else f.push(slug); setFavs(f); toast(i >= 0 ? 'Removido dos favoritos' : 'Salvo nos favoritos'); return i < 0; }
  function contaFav() { const n = favs().length; const b = $('#favN'); b.hidden = !n; b.textContent = n; }

  /* ---------- utilidades ---------- */
  let tt;
  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2600); }
  const WA_PADRAO = '5547996392360';
  const WA_MSG = 'Olá! Vim pelo site da Rei dos Imóveis e quero informações sobre ';
  function waNum() { const d = String(cfg().whatsapp || cfg().telefone || '').replace(/\D/g, ''); return d.length >= 12 ? d : d.length >= 10 ? '55' + d : WA_PADRAO; }
  function waLink(msg) { return 'https://wa.me/' + waNum() + '?text=' + encodeURIComponent(msg || WA_MSG); }
  const VIDEO_HERO = 'qE2Sh48yUgQ'; // vídeo do YouTube pedido pelo cliente
  function videoHero() {
    const box = $('#heroVideo'); if (!box || matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData)) return;
    box.innerHTML = `<iframe src="https://www.youtube.com/embed/${VIDEO_HERO}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_HERO}&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}" title="" tabindex="-1" aria-hidden="true" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    // só mostra o vídeo quando o YouTube avisar que começou a tocar (evita aparecer tela de erro ou botão de play)
    const ifr = $('iframe', box);
    const ouvir = (e) => { if (!/^https:\/\/(www\.)?youtube\.com$/.test(e.origin)) return; let d; try { d = JSON.parse(e.data); } catch (er) { return; }
      const st = d && d.info && (d.info.playerState ?? (d.event === 'onStateChange' ? d.info : null));
      if (st === 1) { box.classList.add('on'); removeEventListener('message', ouvir); } };
    addEventListener('message', ouvir);
    ifr.addEventListener('load', () => { const cmd = (o) => ifr.contentWindow && ifr.contentWindow.postMessage(JSON.stringify(o), '*'); cmd({ event: 'listening', id: 1, channel: 'widget' }); cmd({ event: 'command', func: 'playVideo', args: [] }); });
  }
  function copiar(txt, msg) {
    const fim = () => toast(msg || 'Link copiado');
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(fim, () => { velho(txt); fim(); }); else { velho(txt); fim(); }
  }
  function velho(t) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); }
  function urlAtual() { return location.href; }
  function dataBR(s) { const d = new Date(s + (s.length === 10 ? 'T12:00:00' : '')); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }); }
  const telMask = (v) => { const d = v.replace(/\D/g, '').slice(0, 11); if (d.length <= 2) return d; if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`; if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`; return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`; };

  /* ---------- formulários ---------- */
  const opts = (arr, ph) => `<option value="">${ph || 'Selecione'}</option>` + arr.map((o) => `<option>${esc(o)}</option>`).join('');
  function camposForm(tipo) {
    const base = `<div class="cp-f"><label>Nome</label><input name="nome" autocomplete="name" required></div>
      <div class="g2"><div class="cp-f"><label>E-mail</label><input name="email" type="email" autocomplete="email" required></div>
      <div class="cp-f"><label>WhatsApp</label><input name="telefone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(00) 00000-0000" required></div></div>`;
    if (tipo === 'curto') return base;
    if (tipo === 'atendimento') return base + `<div class="g2"><div class="cp-f"><label>Objetivo</label><select name="objetivo">${opts(OBJETIVOS)}</select></div>
      <div class="cp-f"><label>Faixa de valor</label><select name="faixa">${opts(FAIXAS)}</select></div></div>
      <div class="cp-f"><label>Prefere contato por</label><select name="horario">${opts(['Ligação', 'Vídeo chamada', 'Combinar por WhatsApp'])}</select></div>
      <div class="cp-f"><label>Conte um pouco do que você procura (opcional)</label><textarea name="mensagem"></textarea></div>`;
    return base + `<div class="g2"><div class="cp-f"><label>Sua cidade</label><input name="cidade" autocomplete="address-level2"></div>
      <div class="cp-f"><label>Objetivo</label><select name="objetivo">${opts(OBJETIVOS)}</select></div></div>
      <div class="cp-f"><label>Faixa de valor</label><select name="faixa">${opts(FAIXAS)}</select></div>`;
  }
  function htmlForm({ titulo, dica, tipo, botao, campos }) {
    return `<form class="form js-form" data-tipo="${tipo}" novalidate>
      ${titulo ? `<h3>${titulo}</h3>` : ''}${dica ? `<p class="dica">${dica}</p>` : ''}
      <div class="erro-f" hidden></div>${camposForm(campos)}
      <button class="btn btn-escuro" type="submit">${botao}</button>
      <p class="priv">Seus dados ficam só com a Rei dos Imóveis e não são compartilhados com terceiros.</p></form>`;
  }
  function ligarForms(root, extra) {
    $$('.js-form', root).forEach((f) => {
      const tel = $('[name=telefone]', f); if (tel) tel.addEventListener('input', () => (tel.value = telMask(tel.value)));
      f.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const d = Object.fromEntries(new FormData(f).entries()); const er = $('.erro-f', f);
        const falha = (m) => { er.hidden = false; er.textContent = m; };
        if (!d.nome || d.nome.trim().length < 2) return falha('Informe seu nome.');
        if (d.email !== undefined && !/^\S+@\S+\.\S+$/.test(d.email)) return falha('Informe um e-mail válido.');
        if (d.telefone !== undefined && d.telefone.replace(/\D/g, '').length < 10) return falha('Informe seu WhatsApp com DDD.');
        er.hidden = true;
        const b = $('button[type=submit]', f); b.disabled = true; b.textContent = 'Enviando...';
        const info = Object.assign({ tipo: f.dataset.tipo, pagina: location.hash || '#/' }, typeof extra === 'function' ? extra(f) : extra || {}, d);
        await Rei.enviarLead(info);
        const sucesso = f.dataset.ok || 'Recebemos seus dados. A Rei dos Imóveis vai falar com você em breve.';
        const depois = f.dataset.depois ? `<a class="btn btn-ouro" style="margin-top:20px" href="${esc(f.dataset.depois)}" target="_blank" rel="noopener">${I.doc} Abrir o material</a>` : '';
        f.innerHTML = `<div class="ok-msg"><div class="ic">${I.ok}</div><h3>Tudo certo, ${esc(d.nome.trim().split(' ')[0])}!</h3><p>${esc(sucesso)}</p>${depois}</div>`;
      });
    });
  }
  function abrirModal({ titulo, dica, tipo, botao, campos = 'curto', extra, ok, depois }) {
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = htmlForm({ titulo, dica, tipo, botao, campos });
    const f = $('form', m); f.insertAdjacentHTML('afterbegin', `<button type="button" class="x" aria-label="Fechar">${I.x}</button>`);
    if (ok) f.dataset.ok = ok; if (depois) f.dataset.depois = depois;
    document.body.appendChild(m); requestAnimationFrame(() => m.classList.add('on'));
    const fechar = () => { m.classList.remove('on'); setTimeout(() => m.remove(), 300); document.removeEventListener('keydown', esc1); };
    const esc1 = (e) => { if (e.key === 'Escape') fechar(); };
    document.addEventListener('keydown', esc1);
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.x')) fechar(); });
    ligarForms(m, extra); setTimeout(() => $('input', m)?.focus(), 200);
  }

  /* ---------- lightbox ---------- */
  function lightbox(fotos, i) {
    const lb = document.createElement('div'); lb.className = 'lb';
    lb.innerHTML = `<button class="x" aria-label="Fechar">${I.x}</button><button class="ant" aria-label="Anterior">${I.ant}</button><button class="prox" aria-label="Próxima">${I.prox}</button><img alt=""><p></p>`;
    document.body.appendChild(lb); document.body.style.overflow = 'hidden';
    const mostra = () => { const f = fotos[i]; $('img', lb).src = f.src; $('img', lb).alt = f.legenda || ''; $('p', lb).textContent = (f.legenda || '') + (fotos.length > 1 ? `  ·  ${i + 1} de ${fotos.length}` : ''); };
    const fecha = () => { lb.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', k); };
    const k = (e) => { if (e.key === 'Escape') fecha(); if (e.key === 'ArrowRight') { i = (i + 1) % fotos.length; mostra(); } if (e.key === 'ArrowLeft') { i = (i - 1 + fotos.length) % fotos.length; mostra(); } };
    $('.x', lb).onclick = fecha; $('.ant', lb).onclick = () => { i = (i - 1 + fotos.length) % fotos.length; mostra(); }; $('.prox', lb).onclick = () => { i = (i + 1) % fotos.length; mostra(); };
    lb.addEventListener('click', (e) => { if (e.target === lb) fecha(); });
    let x0 = null; lb.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX)); lb.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) { i = (i + (dx < 0 ? 1 : -1) + fotos.length) % fotos.length; mostra(); } x0 = null; });
    if (fotos.length < 2) { $('.ant', lb).hidden = true; $('.prox', lb).hidden = true; }
    document.addEventListener('keydown', k); mostra();
  }

  /* ---------- peças ---------- */
  function cardEmp(e) {
    const on = favs().includes(e.slug);
    return `<a class="card-e" href="${rotaDe(e)}" data-r>
      <div class="ft"><img src="${esc(e.capa)}" alt="${esc(e.nome)}" loading="lazy"><span class="selo ${e.estagio === 'Pronto' ? 'ouro' : ''}">${esc(e.estagio === 'Pronto' ? 'Pronto para morar' : e.estagio)}</span>
      <button class="coracao ${on ? 'on' : ''}" data-fav="${e.slug}" aria-label="Favoritar ${esc(e.nome)}">${I.cor}</button></div>
      <div class="tx"><span class="loc">${esc(e.local)}</span><h3>${esc(e.nome)}</h3><p>${esc(e.resumoCard)}</p>
      <div class="rod"><span>${esc(e.tipo === 'Lote' ? 'Lotes' : e.tipo)}${e.precoTxt ? ' · ' + esc(e.precoTxt) : e.aPartirDe ? ' · a partir de ' + esc(e.aPartirDe) : ''}</span><b>Conhecer ${I.seta.replace('<svg', '<svg width="16" height="16"')}</b></div></div></a>`;
  }
  function ligarFavs(root) {
    $$('[data-fav]', root).forEach((b) => !b.dataset.lf && (b.dataset.lf = 1) && b.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); const on = toggleFav(b.dataset.fav); b.classList.toggle('on', on); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); if (location.hash === '#/favoritos') render(); }));
  }
  function cabecalho(titulo, sub, img, kick) {
    return `<section class="cab-pg">${img ? `<img src="${esc(img)}" alt="">` : ''}<div class="wrap"><span class="kick claro">${esc(kick || 'Rei dos Imóveis')}</span><h1>${titulo}</h1>${sub ? `<p>${sub}</p>` : ''}</div></section>`;
  }
  function cardPost(p) {
    return `<a class="card-b" href="#/blog/${esc(p.slug)}" data-r><div class="ft"><img src="${esc(p.capa)}" alt="" loading="lazy"></div><div class="tx"><small>${esc(p.categoria)} · ${dataBR(p.data)}</small><h3>${esc(p.titulo)}</h3><p>${esc(p.resumo)}</p></div></a>`;
  }
  function cardMat(m) {
    return `<a class="card-m" href="#/materiais/${esc(m.slug)}" data-r><div class="cp">${m.capa ? `<img src="${esc(m.capa)}" alt="">` : ''}<i></i><b>${esc(m.titulo)}</b></div><div><small>Material gratuito</small><h3>${esc(m.titulo)}</h3><p>${esc(m.resumo)}</p><span class="link-seta" style="margin-top:12px">Baixar grátis ${I.seta.replace('<svg', '<svg width="16" height="16"')}</span></div></a>`;
  }
  function blocoAtendimento(titulo) {
    return `<section class="sec escuro" id="atendimento"><div class="wrap atend">
      <div data-r><span class="kick">Atendimento personalizado</span><h2 class="h2">${titulo || 'O imóvel certo começa por <em>uma boa conversa</em>'}</h2>
        <p class="lead" style="margin-top:18px">Trabalhamos para entregar valorização, segurança, rentabilidade e oportunidades. Conte o que você procura e a Rei dos Imóveis prepara as opções certas para você.</p>
        <div class="passos">
          <div class="passo"><i>1</i><div><b>Você conta o seu objetivo</b><span>Investir, morar ou veranear, a faixa de valor e as regiões que te interessam.</span></div></div>
          <div class="passo"><i>2</i><div><b>Selecionamos as oportunidades</b><span>Empreendimentos no litoral catarinense que fazem sentido para o seu momento.</span></div></div>
          <div class="passo"><i>3</i><div><b>Você decide com informação</b><span>Material completo, condições de pagamento e visita, com acompanhamento até o fim.</span></div></div>
        </div></div>
      <div data-r>${htmlForm({ titulo: 'Agende seu atendimento', dica: 'Responda em menos de 1 minuto. Entramos em contato no horário que você preferir.', tipo: 'atendimento', botao: 'Quero meu atendimento', campos: 'atendimento' })}</div>
    </div></section>`;
  }

  /* ---------- páginas ---------- */
  function pgHome() {
    const E = emps(); const c = cfg();
    const dest = achar(c.destaque) || E[0];
    const slides = ['lagom-pereque', 'scenarium-brava-norte', 'gt-home-la-citta', 'porto-belo-golf'].map(achar).filter(Boolean);
    const conta = (cid) => E.filter((e) => e.cidade === cid).length;
    const imgReg = { 'Praia Brava': 'img/imagens_scenarium_hero.webp', 'Balneário Camboriú': 'img/midia_mw6xtaj7-a8b2313eb6907175.webp', 'Itapema': 'img/midia_muyzyurr-94cfe888b2be5693.webp', 'Porto Belo': 'img/midia_mw6xu2hh-524798b2017bd5d8.webp', 'Tijucas': 'img/midia_muyvd4fh-d3b34addfa8c3498.webp' };
    const regs = [['Praia Brava', 'Itajaí'], ['Balneário Camboriú', 'Balneário Camboriú'], ['Itapema', 'Itapema'], ['Porto Belo', 'Porto Belo'], ['Tijucas', 'Tijucas']];
    const destNums = (dest.ficha || []).filter(([k]) => /Área|Suítes|Pavimentos|Dormitórios|Unidades|Lotes/.test(k)).slice(0, 3);
    const lista = E.filter((e) => e.slug !== dest.slug).slice(0, 6);
    return `
    <section class="hero hero-v" id="hero">
      <div class="hero-slides"><img src="${esc((slides[0] || dest).capa)}" alt="" class="on"><div class="hero-video" id="heroVideo"></div></div>
      <div class="wrap">
        <h1 class="h-cond"><span><i>O imóvel é o último passo.</i></span><span><i>Tudo que importa acontece antes.</i></span></h1>
        <p class="sub">Cada escolha começa com seus objetivos. <b>Nós ajudamos você a encontrar o caminho.</b></p>
        <div class="acoes"><a href="${waLink()}" class="btn btn-ouro" target="_blank" rel="noopener">Iniciar Conversa ${I.seta}</a></div>
      </div>
    </section>
    <section class="busca"><div class="wrap"><form class="busca-box busca-3" id="buscaHome">
      <label class="campo-b"><span>Tipo</span><select name="tipo"><option value="">Todos</option>${TIPOS.map((t) => `<option>${t}</option>`).join('')}</select></label>
      <label class="campo-b"><span>Cidade</span><select name="cidade"><option value="">Todas</option>${CIDADES_BUSCA.map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></label>
      <label class="campo-b"><span>Fase</span><select name="estagio"><option value="">Todas</option>${FASES.map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></label>
      <button class="btn btn-escuro" type="submit">Buscar ${I.seta}</button></form></div></section>

    ${secEncontre(E)}
    <section class="sec" style="padding-top:20px"><div class="wrap">
      <div data-r style="margin-bottom:40px"><span class="kick">Empreendimento em destaque</span></div>
      <a class="destaque" href="${rotaDe(dest)}" data-r>
        <div class="ft"><img src="${esc(dest.capa)}" alt="${esc(dest.nome)}"></div>
        <div class="tx"><span class="loc">${esc(dest.local)} · ${esc(dest.estagio)}</span><h2>${esc(dest.nome)}</h2>
          ${dest.slogan ? `<div class="serif" style="font-style:italic;font-size:22px;color:var(--gold2)">${esc(dest.slogan)}</div>` : ''}
          <p>${esc(dest.resumo || dest.resumoCard)}</p>
          ${destNums.length ? `<dl class="nums">${destNums.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : '<div style="height:30px"></div>'}
          <span class="btn btn-ouro" style="align-self:flex-start">Conhecer o ${esc(dest.nome)} ${I.seta}</span></div></a>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:44px" data-r>
        <div><span class="kick">Portfólio</span><h2 class="h2">Empreendimentos <em>selecionados</em></h2></div>
        <a class="link-seta" href="#/empreendimentos">Ver todos os ${E.length} empreendimentos ${I.seta.replace('<svg', '<svg width="16" height="16"')}</a></div>
      <div class="tabs-home" role="tablist">${[['','Todos'],['Apartamento','Apartamentos'],['Lote','Lotes'],['Porto Belo','Porto Belo'],['Balneário Camboriú','Balneário Camboriú'],['Pronto','Prontos']].map(([v,t],i)=>`<button role="tab" class="${i?'':'on'}" data-hf="${v}">${t}</button>`).join('')}<i class="tab-ind"></i></div>
      <div class="grade" id="gradeHome">${lista.map(cardEmp).join('')}</div>
    </div></section>

    <section class="sec escuro"><div class="wrap">
      <div data-r><span class="kick">Onde atuamos</span><h2 class="h2">O melhor do <em>litoral catarinense</em></h2><p class="lead" style="margin-top:16px">Da Praia Brava a Porto Belo: as cidades que mais se valorizam no litoral de Santa Catarina.</p></div>
      <div class="regioes">${regs.map(([nome, cid]) => `<a class="reg" href="#/empreendimentos?cidade=${encodeURIComponent(cid)}" data-r><img src="${imgReg[nome]}" alt="" loading="lazy"><div><span>${conta(cid)} empreendimento${conta(cid) === 1 ? '' : 's'}</span><h3>${nome}</h3></div></a>`).join('')}</div>
    </div></section>

    <section class="sec"><div class="wrap quem">
      <div data-r>${retrato()}</div>
      <div data-r><span class="kick">Quem somos</span><h2 class="h2">Rei dos Imóveis: <em>o litoral</em> que a gente conhece de perto</h2>
        <p class="lead" style="margin-top:18px">Somos especialistas em imóveis de alto padrão no litoral catarinense. Acompanhamos de perto os lançamentos da Praia Brava, de Balneário Camboriú, Itapema e Porto Belo para apresentar a você as melhores oportunidades para investir no litoral.</p>
        <div class="pilares"><div class="pil"><b>Valorização</b><span>Empreendimentos nas regiões que mais crescem.</span></div><div class="pil"><b>Segurança</b><span>Incorporadoras sólidas e documentação conferida.</span></div><div class="pil"><b>Rentabilidade</b><span>Imóveis pensados também como investimento.</span></div><div class="pil"><b>Oportunidades</b><span>Pré-lançamentos e condições especiais.</span></div></div>
        <a class="btn btn-escuro" style="margin-top:30px" href="#/sobre-nos">Conheça a Rei dos Imóveis ${I.seta}</a></div>
    </div></section>

    <section class="sec cream" style="background:var(--cream)"><div class="wrap">
      <div data-r><span class="kick">Bairros planejados</span><h2 class="h2">Dois complexos que estão <em>mudando Porto Belo</em></h2></div>
      <div class="bairros">${['vivapark-porto-belo', 'all-resort-porto-belo'].map((k) => { const h = HUBS[k]; return `<a class="bp" href="#/${k}" data-r><img class="bg" src="${esc(h.bg)}" alt="" loading="lazy">${h.logo ? `<img class="lg" src="${esc(h.logo)}" alt="${esc(h.nome)}">` : ''}<h3>${esc(h.nome)}</h3><p>${esc(h.resumo)}</p><span class="link-seta" style="color:var(--gold2)">Conhecer ${I.seta.replace('<svg', '<svg width="16" height="16"')}</span></a>`; }).join('')}</div>
    </div></section>

    <section class="sec"><div class="wrap">
      <div class="duas-col" style="align-items:end;margin-bottom:40px" data-r><div><span class="kick">Materiais gratuitos</span><h2 class="h2">Conhecimento <em>antes</em> do investimento</h2></div><div style="text-align:right"><a class="link-seta" href="#/materiais">Ver todos os materiais ${I.seta.replace('<svg', '<svg width="16" height="16"')}</a></div></div>
      <div class="duas-col">${Rei.db.materiais.filter((m) => m.ativo !== false).slice(0, 2).map(cardMat).join('')}</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin:100px 0 40px" data-r><div><span class="kick">Blog</span><h2 class="h2">Últimos <em>artigos</em></h2></div><a class="link-seta" href="#/blog">Ver o blog ${I.seta.replace('<svg', '<svg width="16" height="16"')}</a></div>
      <div class="grade">${Rei.db.posts.slice(0, 3).map(cardPost).join('')}</div>
    </div></section>
    ${blocoAtendimento()}`;
  }
  function secEncontre(E) {
    const img = { 'Balneário Camboriú': 'img/midia_mw6xtaj7-a8b2313eb6907175.webp', 'Itajaí': 'img/imagens_scenarium_hero.webp', 'Itapema': 'img/midia_muyzyurr-94cfe888b2be5693.webp', 'Porto Belo': 'img/midia_mw6xu2hh-524798b2017bd5d8.webp', 'Tijucas': 'img/midia_muyvd4fh-d3b34addfa8c3498.webp' };
    const painel = (c, n, i) => {
      const L = E.filter((e) => e.cidade === c); const bairros = {}; L.forEach((e) => { const b = e.bairro || 'Outros bairros'; bairros[b] = (bairros[b] || 0) + 1; });
      const pr = L.filter((e) => e.estagio === 'Pronto').length, pl = L.length - pr;
      return `<div class="enc-pn ${i ? '' : 'on'}" data-pn="${i}" role="tabpanel"><div class="enc-ft"><img src="${img[c]}" alt="" loading="lazy"><b>${n}</b></div>
        <div class="enc-tx"><h3>Apartamentos ${c === 'Itajaí' ? 'na Praia Brava e em Itajaí' : 'em ' + n}</h3>
          <ul>${Object.entries(bairros).map(([b, q]) => `<li><a href="#/na-planta?cidade=${encodeURIComponent(c)}&q=${encodeURIComponent(b === 'Outros bairros' ? '' : b)}">${esc(b)} <small>${q}</small></a></li>`).join('') || '<li class="vz">Novas oportunidades em breve. Fale com a assessoria.</li>'}</ul>
          <div class="enc-bt"><a class="btn btn-escuro" href="#/na-planta?cidade=${encodeURIComponent(c)}">Na planta · ${pl}</a><a class="btn btn-borda" href="#/pronto-para-morar?cidade=${encodeURIComponent(c)}">Prontos para morar · ${pr}</a></div></div></div>`;
    };
    return `<section class="sec encontre"><div class="wrap">
      <div data-r class="enc-cab"><span class="kick">Por cidade e bairro</span><h2 class="h2">Encontre o seu <em>apartamento ideal</em></h2></div>
      <div class="enc-tabs" role="tablist" data-r>${CIDADES_MENU.map(([c, n], i) => `<button role="tab" class="${i ? '' : 'on'}" data-enc="${i}">${n}</button>`).join('')}</div>
      <div class="enc-box" data-r>${CIDADES_MENU.map(([c, n], i) => painel(c, n, i)).join('')}</div></div></section>`;
  }
  function ligarEncontre() { $$('[data-enc]').forEach((b) => b.addEventListener('click', () => { $$('[data-enc]').forEach((x) => x.classList.toggle('on', x === b)); $$('[data-pn]').forEach((p) => p.classList.toggle('on', p.dataset.pn === b.dataset.enc)); })); }
  function menusCidade() {
    const E = emps();
    const lista = (modo) => CIDADES_MENU.map(([c, n]) => { const q = E.filter((e) => e.cidade === c && (modo === 'pronto' ? e.estagio === 'Pronto' : e.estagio !== 'Pronto')).length;
      return `<a href="${modo === 'pronto' ? '#/pronto-para-morar' : '#/na-planta'}?cidade=${encodeURIComponent(c)}">${modo === 'pronto' ? 'Prontos em ' : 'Na planta em '}${n}<small>${q ? q + (q === 1 ? ' opção' : ' opções') : 'Consulte a assessoria'}</small></a>`; }).join('');
    if (!$('#ddPronto')) return;
    $('#ddPronto').innerHTML = lista('pronto') + `<a class="todos" href="#/pronto-para-morar">Ver todos os prontos ${I.seta}</a>`;
    $('#ddPlanta').innerHTML = lista('planta') + `<a class="todos" href="#/na-planta">Ver todos na planta ${I.seta}</a>`;
  }
  function pgCad(e) {
    const m = e.cad, F = (m.fotos || []).length ? m.fotos : [e.capa];
    const ficha = [['Área privativa', m.area && m.area + ' m²'], ['Área total', m.areaTotal && m.areaTotal + ' m²'], ['Quartos', m.quartos], ['Suítes', m.suites], ['Banheiros', m.banheiros], ['Vagas', m.vagas], ['Andar', m.andar], ['Entrega', m.entrega]].filter(([, v]) => v);
    const valores = [['Condomínio', m.condominio && brl(m.condominio) + '/mês'], ['IPTU', m.iptu && brl(m.iptu) + '/ano']].filter(([, v]) => v);
    const msg = `Olá! Tenho interesse no imóvel ${m.titulo} (${m.codigo}) que vi no site da Rei dos Imóveis.`;
    return `<section class="cad-top"><div class="wrap">
      <nav class="migalha"><a href="#/">Início</a> / <a href="${e.estagio === 'Pronto' ? '#/pronto-para-morar' : '#/na-planta'}">${e.estagio === 'Pronto' ? 'Pronto para morar' : 'Na planta'}</a> / <span>${esc(m.codigo)}</span></nav>
      <div class="cad-gal" data-n="${Math.min(F.length, 5)}">${F.slice(0, 5).map((f, i) => `<button class="g${i}" data-g="${i}" aria-label="Ver foto ${i + 1}"><img src="${esc(f)}" alt="" ${i ? 'loading="lazy"' : ''}>${i === 4 && F.length > 5 ? `<span>+${F.length - 5} fotos</span>` : ''}</button>`).join('')}</div>
      <div class="cad-grid">
        <div>
          <div class="cad-tags"><span class="selo ${e.estagio === 'Pronto' ? 'ouro' : ''}">${esc(e.estagio === 'Pronto' ? 'Pronto para morar' : e.estagio)}</span><span>${esc(m.tipo || '')}</span><span>Cód. ${esc(m.codigo)}</span></div>
          <h1 class="cad-h1">${esc(m.titulo)}</h1><p class="cad-loc">${esc([m.endereco, m.bairro, m.cidade].filter(Boolean).join(' · '))}</p>
          ${ficha.length ? `<div class="cad-ficha">${ficha.map(([k, v]) => `<div><b>${esc(String(v))}</b><span>${k}</span></div>`).join('')}</div>` : ''}
          ${m.descricao ? `<div class="cad-desc"><h2>Sobre o imóvel</h2>${m.descricao.split(/\n+/).map((t) => `<p>${esc(t)}</p>`).join('')}</div>` : ''}
          ${(m.caracteristicas || []).length ? `<div class="cad-car"><h2>Características</h2><ul>${m.caracteristicas.map((c) => `<li>${I.ok.replace('<svg', '<svg width="18" height="18"')}${esc(c)}</li>`).join('')}</ul></div>` : ''}
          ${m.video ? `<div class="cad-desc"><h2>Vídeo</h2><div class="cad-video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(ytId(m.video))}" title="Vídeo do imóvel" allowfullscreen loading="lazy"></iframe></div></div>` : ''}
        </div>
        <aside class="cad-lado"><div class="cad-preco"><span>${m.valor ? (m.aPartir ? 'A partir de' : 'Valor de venda') : 'Valor'}</span><b>${m.valor ? brl(m.valor) : 'Sob consulta'}</b>${valores.map(([k, v]) => `<small>${k}: ${v}</small>`).join('')}${m.financiamento || m.permuta ? `<div class="cad-aceita">${m.financiamento ? '<i>Aceita financiamento</i>' : ''}${m.permuta ? '<i>Aceita permuta</i>' : ''}</div>` : ''}
          <a class="btn btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener">Falar no WhatsApp</a></div>
          ${htmlForm({ titulo: 'Quero mais informações', dica: 'Deixe seus dados e a assessoria fala com você.', tipo: 'contato', botao: 'Enviar', campos: 'curto' })}</aside>
      </div></div></section>` + conhecaTambem(e);
  }
  const ytId = (u) => (String(u).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || [, String(u).trim()])[1];
  function ligarCad(e) { const F = (e.cad.fotos || []).length ? e.cad.fotos : [e.capa]; $$('.cad-gal [data-g]').forEach((b) => b.addEventListener('click', () => lightbox(F.map((src) => ({ src, legenda: e.nome })), +b.dataset.g))); ligarForms(APP, { empreendimento: e.nome + ' (' + e.codigo + ')', slug: e.slug }); }
  function retrato() {
    const c = cfg();
    return `<div class="retrato">${c.foto ? `<img class="foto" src="${esc(c.foto)}" alt="${esc(c.corretor)}">` : `<img class="emblema" src="coroa.png" alt="">`}
      <div class="assin"><b>${esc(c.corretor || 'Rei dos Imóveis')}</b><span>Rei dos Imóveis${c.creci ? ' · CRECI ' + esc(c.creci) : ' · Litoral SC'}</span></div></div>`;
  }
  function ligarHome() {
    const E0 = emps(); const dest = achar(cfg().destaque) || E0[0];
    const imgs = $$('.hero-slides img'); const dots = $$('#heroLeg .dots i'); const nomes = ['lagom-pereque', 'scenarium-brava-norte', 'gt-home-la-citta', 'porto-belo-golf'].map(achar).filter(Boolean);
    let i = 0;
    if (imgs.length > 1) {
      const t = setInterval(() => {
        if (!document.body.contains(imgs[0])) return clearInterval(t);
        imgs[i].classList.remove('on'); dots[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); dots[i].classList.add('on'); $('#heroLeg b').textContent = nomes[i].nome;
      }, 6000);
    }
    microHome(E0, dest); videoHero(); ligarEncontre();
    $('#buscaHome').addEventListener('submit', (e) => { e.preventDefault(); const p = new URLSearchParams(Object.entries(Object.fromEntries(new FormData(e.target))).filter(([, v]) => v)); location.hash = '#/empreendimentos' + (p.toString() ? '?' + p : ''); });
  }


  /* ---------- microinterações da home ---------- */
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  function contar(el) {
    const alvo = +el.dataset.conta; if (calmo) { el.textContent = alvo; return; }
    const t0 = performance.now(), dur = 1400;
    const passo = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  }
  function tilt(el, max = 5) {
    if (!fino || calmo) return;
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1100px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateY(-4px)`; el.style.setProperty('--mx', (x + 0.5) * 100 + '%'); el.style.setProperty('--my', (y + 0.5) * 100 + '%'); });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  }
  function ima(el) {
    if (!fino || calmo) return;
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  }
  function microHome(E, dest) {
    document.body.classList.add('home-on');
    // números contando
    const io2 = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { contar(en.target); io2.unobserve(en.target); } }), { threshold: 0.6 });
    $$('[data-conta]').forEach((el) => io2.observe(el)); observadores.push(io2);
    // parallax do topo
    const hero = $('#hero'), slides = $('.hero-slides', hero), txt = $('.wrap', hero);
    if (!calmo) {
      const sc = () => { if (!document.body.contains(hero)) return removeEventListener('scroll', sc); const y = Math.min(scrollY, innerHeight); slides.style.transform = `translateY(${y * 0.28}px)`; txt.style.transform = `translateY(${y * 0.12}px)`; txt.style.opacity = String(1 - y / (innerHeight * 0.9)); };
      addEventListener('scroll', sc, { passive: true });
      if (fino) hero.addEventListener('pointermove', (e) => { const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5; $$('img', slides).forEach((im) => (im.style.translate = `${x * -14}px ${y * -10}px`)); });
    }
    // destaque, bairros e regiões com inclinação leve e brilho seguindo o mouse
    $$('.destaque, .bp').forEach((el) => tilt(el, 3)); $$('.reg').forEach((el) => tilt(el, 6));
    $$('.hero .btn, .destaque .btn-ouro').forEach(ima);
    // filtro rápido do portfólio
    const ind = $('.tab-ind'); const moveInd = (b) => { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)`; };
    const btns = $$('[data-hf]'); requestAnimationFrame(() => moveInd(btns[0]));
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.toggle('on', x === b)); moveInd(b);
      const v = b.dataset.hf; const g = $('#gradeHome');
      const L = E.filter((e) => e.slug !== dest.slug || v).filter((e) => !v || e.tipo === v || e.cidade === v || e.estagio === v).slice(0, 6);
      g.classList.add('saindo');
      setTimeout(() => { g.innerHTML = L.length ? L.map(cardEmp).join('') : '<div class="vazio" style="grid-column:1/-1"><h3>Em breve</h3></div>'; ligarFavs(g); $$('.card-e', g).forEach((c, i) => { c.classList.add('vis'); c.style.setProperty('--i', i); tilt(c, 4); }); g.classList.remove('saindo'); g.classList.add('entrando'); setTimeout(() => g.classList.remove('entrando'), 700); }, 260);
    }));
    $$('#gradeHome .card-e').forEach((c) => tilt(c, 4));
  }
  // barra de progresso de leitura
  const barra = document.createElement('i'); barra.className = 'progresso'; document.body.appendChild(barra);
  addEventListener('scroll', () => { const h = document.documentElement.scrollHeight - innerHeight; barra.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }, { passive: true });

  function pgLista(params, cab, modo) {
    cab = cab || ['Apartamentos na planta', 'Pré-lançamentos, lançamentos e obras na Praia Brava, em Balneário Camboriú, Itapema, Porto Belo e Tijucas: apartamentos, casas e lotes de alto padrão no litoral catarinense.', 'img/midia_mw6xtaj7-a8b2313eb6907175.webp', 'Empreendimentos'];
    return cabecalho(cab[0], cab[1], cab[2], cab[3]) +
    `<section class="sec compacta"><div class="wrap">
      <div class="filtros">
        <input class="busca-txt" id="fQ" placeholder="Buscar por nome ou bairro" value="${esc(params.get('q') || '')}">
        <select class="sel-f" id="fCidade"><option value="">Todas as cidades</option>${CIDADES_BUSCA.concat(params.get('cidade') && !CIDADES_BUSCA.some(([v]) => v === params.get('cidade')) ? [[params.get('cidade'), params.get('cidade')]] : []).map(([c, n]) => `<option value="${esc(c)}" ${params.get('cidade') === c ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>
        <select class="sel-f" id="fTipo"><option value="">Todos os tipos</option>${TIPOS.map((t) => `<option ${params.get('tipo') === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
        <select class="sel-f" id="fEst" ${modo === 'pronto' ? 'hidden' : ''}><option value="">${modo === 'planta' ? 'Todas as fases da obra' : 'Todas as fases'}</option>${FASES.filter(([t]) => modo !== 'planta' || t !== 'Pronto').map(([t, n]) => `<option value="${t}" ${params.get('estagio') === t ? 'selected' : ''}>${n}</option>`).join('')}</select>
        <button class="chip" id="fLimpar">Limpar</button>
      </div>
      <div class="contagem" id="fCont"></div><div class="grade" id="fGrade"></div>
    </div></section>` + blocoAtendimento('Não achou o que procura? <em>A gente encontra</em>');
  }
  function ligarLista(modo) {
    const base = modo === 'pronto' ? '#/pronto-para-morar' : modo === 'planta' ? '#/na-planta' : '#/empreendimentos';
    const run = () => {
      const q = $('#fQ').value.trim().toLowerCase(), c = $('#fCidade').value, t = $('#fTipo').value, s = $('#fEst').value;
      const L = emps().filter((e) => (modo !== 'pronto' || e.estagio === 'Pronto') && (modo !== 'planta' || e.estagio !== 'Pronto') && (!c || e.cidade === c) && (!t || catDe(e) === t) && (!s || e.estagio === s) && (!q || [e.nome, e.local, e.bairro, e.cidade, e.grupo, e.codigo].join(' ').toLowerCase().includes(q)));
      $('#fCont').textContent = L.length + (L.length === 1 ? ' empreendimento encontrado' : ' empreendimentos encontrados');
      $('#fGrade').innerHTML = L.length ? L.map(cardEmp).join('') : `<div class="vazio" style="grid-column:1/-1"><h3>Nenhum empreendimento com esses filtros</h3><p>Tente outra combinação, ou fale com a gente: temos oportunidades que nem sempre estão no site.</p></div>`;
      ligarFavs($('#fGrade')); revelar();
      const p = new URLSearchParams(); if (q) p.set('q', q); if (c) p.set('cidade', c); if (t) p.set('tipo', t); if (s) p.set('estagio', s);
      history.replaceState && tentar(() => history.replaceState(null, '', base + (p.toString() ? '?' + p : '')));
    };
    ['#fQ', '#fCidade', '#fTipo', '#fEst'].forEach((s) => $(s).addEventListener(s === '#fQ' ? 'input' : 'change', run));
    $('#fLimpar').onclick = () => { $('#fQ').value = ''; $('#fCidade').value = ''; $('#fTipo').value = ''; $('#fEst').value = ''; run(); };
    run();
  }
  const tentar = (f) => { try { f(); } catch (e) {} };

  function ferramentas(e) {
    const on = favs().includes(e.slug);
    return `<div class="ferr"><button data-a="share">${I.share} Compartilhar</button><button data-a="fav" class="${on ? 'on' : ''}">${I.cor} <span>${on ? 'Favoritado' : 'Favoritar'}</span></button><button data-a="print">${I.print} Imprimir resumo</button><button data-a="copy">${I.link} Copiar link</button></div>`;
  }
  function ligarFerr(e, root) {
    $$('.ferr button', root).forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.a;
      if (a === 'share') { if (navigator.share) navigator.share({ title: e.nome + ' · Rei dos Imóveis', url: urlAtual() }).catch(() => {}); else copiar(urlAtual(), 'Link copiado para compartilhar'); }
      if (a === 'fav') { const on = toggleFav(e.slug); b.classList.toggle('on', on); $('span', b).textContent = on ? 'Favoritado' : 'Favoritar'; }
      if (a === 'print') window.print();
      if (a === 'copy') copiar(urlAtual());
    }));
  }
  function secMapa(e, titulo, texto, endereco) {
    if (!e.geo && !(e.entorno || []).length) return '';
    const pts = e.entorno || [];
    return `<section class="det-sec" id="localizacao"><div class="wrap">
      <span class="kick">Localização</span><h2 class="h2">${esc(titulo || 'Onde fica')}</h2>
      ${texto ? `<p class="lead" style="margin-top:14px">${esc(texto)}</p>` : ''}
      <div class="mapa-wrap"><div class="mapa" id="mapa"></div>
      <div><ul class="pontos">${pts.map((p) => `<li data-p="${p.n}"><i>${p.n}</i><div><b>${esc(p.nome)}</b>${p.desc ? `<small>${esc(p.desc)}</small>` : ''}</div><em>${esc(p.dist)}</em></li>`).join('')}</ul>
      ${endereco ? `<p style="margin-top:18px;font-size:14.5px;color:var(--muted)">${esc(endereco)}</p>` : ''}
      ${e.geo ? `<a class="link-seta" style="margin-top:14px" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${e.geo[0]},${e.geo[1]}">Abrir no Google Maps ${I.seta.replace('<svg', '<svg width="16" height="16"')}</a>` : ''}
      ${pts.length ? '<p style="font-size:12.5px;color:var(--muted2);margin-top:12px">Distâncias aproximadas, em linha reta.</p>' : ''}</div></div></div></section>`;
  }
  let mapaAtual = null;
  function ligarMapa(e) {
    const el = $('#mapa'); if (!el || !window.L) return;
    const pts = e.entorno || []; const centro = e.geo || (pts[0] ? [pts[0].lat, pts[0].lng] : null); if (!centro) return;
    mapaAtual = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView(centro, 14);
    const camada = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapaAtual);
    let falhou = false;
    camada.on('tileerror', () => { if (falhou) return; falhou = true; const m = mapaAtual; mapaAtual = null; tentar(() => m.remove());
      el.className = 'mapa-off'; el.style.setProperty('--bgimg', `url('${(e.capa || e.bg || '').replace(/'/g, '')}')`);
      el.innerHTML = `<span class="kick claro">Localização</span><b>${esc(e.nome)}</b><a class="btn btn-ouro" style="align-self:flex-start" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${centro[0]},${centro[1]}">Ver no Google Maps</a>`; });
    const grupo = [];
    if (e.geo) { const m = L.marker(e.geo, { icon: L.divIcon({ className: '', html: '<div class="pin principal"><img src="coroa.png" alt=""></div>', iconSize: [54, 54], iconAnchor: [27, 27] }) }).addTo(mapaAtual).bindPopup('<b>' + esc(e.nome) + '</b>'); grupo.push(m.getLatLng()); }
    const mk = {};
    pts.forEach((p) => { const m = L.marker([p.lat, p.lng], { icon: L.divIcon({ className: '', html: `<div class="pin">${p.n}</div>`, iconSize: [34, 34], iconAnchor: [17, 17] }) }).addTo(mapaAtual).bindPopup(`<b>${esc(p.nome)}</b><br>${esc(p.dist)}`); mk[p.n] = m; grupo.push(m.getLatLng()); });
    if (grupo.length > 1) mapaAtual.fitBounds(L.latLngBounds(grupo), { padding: [40, 40], maxZoom: 15 });
    $$('.pontos li').forEach((li) => li.addEventListener('click', () => { const m = mk[li.dataset.p]; if (m) { mapaAtual.setView(m.getLatLng(), 15); m.openPopup(); } }));
  }
  function secVideo(v, capa) {
    if (!v || !v.yt) return '';
    return `<div class="video" data-r><img src="${esc(capa || '')}" alt=""><a class="vbtn" href="https://www.youtube.com/watch?v=${esc(v.yt)}" target="_blank" rel="noopener"><span><i>${I.play}</i>${esc(v.titulo || 'Assista ao vídeo')}</span></a></div>`;
  }
  function ligarVideo() {}
  function secGaleria(fotos, id = 'galeria') {
    if (!fotos || !fotos.length) return '';
    const vis = fotos.slice(0, 12);
    return `<section class="det-sec alt" id="${id}"><div class="wrap"><span class="kick">Galeria</span><h2 class="h2">Imagens do <em>empreendimento</em></h2>
      <div class="galeria">${vis.map((f, i) => `<button data-g="${i}" aria-label="Ampliar imagem: ${esc(f.legenda)}"><img src="${esc(f.src)}" alt="${esc(f.legenda)}" loading="lazy"><span>${esc(f.legenda)}</span></button>`).join('')}</div>
      ${fotos.length > 12 ? `<div class="mais-fotos"><button class="btn btn-borda" data-g="12">Ver todas as ${fotos.length} imagens</button></div>` : ''}
      <p class="aviso-ilustr">Imagens meramente ilustrativas. Informações sujeitas a alteração pela incorporadora.</p></div></section>`;
  }
  function ligarGaleria(fotos, root) { $$('[data-g]', root).forEach((b) => b.addEventListener('click', () => lightbox(fotos, +b.dataset.g))); }
  function secContato(e) {
    return `<section class="det-sec escuro" id="contato"><div class="wrap contato-final">
      <div data-r><span class="kick">Fale com a Rei dos Imóveis</span><h2 class="h2">Quer saber mais sobre o <em>${esc(e.nome)}</em>?</h2>
      <p class="lead" style="margin-top:16px">Tabela atualizada, unidades disponíveis, condições de pagamento e visita. Deixe seus dados e a gente prepara a conversa certa antes de falar com você.</p>
      <div class="passos"><div class="passo"><i>${I.ok.replace('<svg', '<svg width="22" height="22"')}</i><div><b>Tabela e disponibilidade</b><span>As unidades e condições do momento.</span></div></div><div class="passo"><i>${I.ok.replace('<svg', '<svg width="22" height="22"')}</i><div><b>Atendimento sem compromisso</b><span>Tire todas as suas dúvidas antes de decidir.</span></div></div></div></div>
      <div data-r>${htmlForm({ titulo: 'Fale com a gente sobre o ' + esc(e.nome), dica: 'Os campos de objetivo e faixa de valor nos ajudam a preparar o atendimento certo.', tipo: 'contato', botao: 'Quero conversar sobre o ' + esc(e.nome), campos: 'completo' })}</div>
    </div></section>`;
  }
  function conhecaTambem(e) {
    const E = emps().filter((x) => x.slug !== e.slug);
    const prox = E.filter((x) => x.cidade === e.cidade).concat(E.filter((x) => x.cidade !== e.cidade)).slice(0, 3);
    return `<section class="det-sec"><div class="wrap"><div style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:40px"><div><span class="kick">Conheça também</span><h2 class="h2">Outros <em>empreendimentos</em></h2></div><a class="link-seta" href="#/empreendimentos">Ver todos ${I.seta.replace('<svg', '<svg width="16" height="16"')}</a></div><div class="grade">${prox.map(cardEmp).join('')}</div></div></section>`;
  }

  function pgEmp(e) {
    const nums = (e.ficha || []).filter(([k]) => /Área|Suítes|Pavimentos|Dormitórios|Unidades|Residências|Apartamentos|Áreas/.test(k)).slice(0, 3);
    const temPl = (e.tipologias || []).length, temDif = (e.diferenciais || []).length || (e.lazer || []).length;
    const sub = [['empreendimento', 'O empreendimento'], (e.fotos || []).length && ['galeria', 'Galeria'], temPl && ['plantas', 'Plantas'], temDif && ['diferenciais', 'Diferenciais'], e.geo && ['localizacao', 'Localização'], ['contato', 'Fale conosco']].filter(Boolean);
    const fichaHtml = (e.ficha || []).map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('');
    const pl = e.tipologias || [];
    return `
    <section class="det-hero"><img src="${esc((e.fotos && e.fotos[0] && e.fotos[0].src) || e.capa)}" alt="${esc(e.nome)}"><div class="wrap">
      <div class="chips-h">${(e.chips || []).map((c) => `<span>${esc(c)}</span>`).join('')}</div>
      ${e.slogan ? `<div class="slogan">${esc(e.slogan)}</div>` : ''}<h1>${esc(e.nome)}</h1><p class="res">${esc(e.resumo)}</p>
      ${nums.length ? `<dl class="nums">${nums.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : '<div style="height:28px"></div>'}
      <div class="acoes-h"><button class="btn btn-ouro" data-book>${I.doc} Receber o book do ${esc(e.nome)}</button>${ferramentas(e)}</div>
    </div></section>
    <nav class="subnav"><div class="wrap">${sub.map(([id, t], i) => `<a href="#sec-${id}" data-sub="${id}" class="${i ? '' : 'on'}">${t}</a>`).join('')}<button class="btn btn-escuro" data-book>Receber o book</button></div></nav>
    <section class="det-sec" id="empreendimento"><div class="wrap sobre">
      <div class="txt" data-r><span class="kick">O empreendimento</span><h2 class="h2">${esc(e.nome)}</h2>${(e.texto || []).map((p) => `<p>${esc(p)}</p>`).join('')}${secVideo(e.video, e.capa)}</div>
      <aside class="ficha" data-r><h4>Ficha técnica</h4>${fichaHtml}</aside>
    </div>
    <div class="print-only wrap" style="margin-top:20px">${pl.map((t) => `<p>${esc(t.nome)}: ${esc(t.areaPrivativa)}${t.suites ? ', ' + esc(t.suites) + ' suíte(s)' : ''}${t.vagas ? ', ' + esc(t.vagas) + ' vaga(s)' : ''}</p>`).join('')}<p style="margin-top:14px">Rei dos Imóveis · ${esc(location.href)}</p></div>
    </section>
    ${secGaleria(e.fotos)}
    ${temPl ? `<section class="det-sec" id="plantas"><div class="wrap"><span class="kick">Plantas</span><h2 class="h2">Tipologias e <em>plantas</em></h2>
      <div class="tabs" role="tablist">${pl.map((t, i) => `<button class="tab ${i ? '' : 'on'}" role="tab" data-pl="${i}">${esc(t.nome)}</button>`).join('')}</div><div id="plCont"></div></div></section>` : ''}
    ${temDif ? `<section class="det-sec alt" id="diferenciais"><div class="wrap"><span class="kick">Diferenciais</span><h2 class="h2">O que faz dele <em>único</em></h2>
      ${(e.diferenciais || []).length && (e.lazer || []).length ? `<div class="tabs"><button class="tab on" data-dl="dif">Diferenciais</button><button class="tab" data-dl="laz">Lazer</button></div>` : ''}
      <ul class="lista-dif" id="difLista"></ul></div></section>` : ''}
    ${secMapa(e, 'Onde fica', e.locTexto, e.endereco)}
    ${secContato(e)}${conhecaTambem(e)}`;
  }
  function ligarEmp(e) {
    const root = APP;
    $$('[data-book]', root).forEach((b) => b.addEventListener('click', () => abrirModal({ titulo: 'Receber o book do ' + esc(e.nome), dica: 'Deixe seus dados e a Rei dos Imóveis envia o material completo para você.', tipo: 'book', botao: 'Receber o material', extra: { empreendimento: e.nome, slug: e.slug }, ok: 'Recebemos seu pedido. O book do ' + e.nome + ' chega para você em breve.' })));
    ligarForms(root, { empreendimento: e.nome, slug: e.slug });
    ligarFerr(e, root); ligarGaleria(e.fotos || [], root); ligarVideo(root);
    const pl = e.tipologias || [];
    const mostraPl = (i) => { const t = pl[i]; $('#plCont').innerHTML = `<div class="planta"><div><h3>${esc(t.nome)}</h3><dl><div><dt>Área privativa</dt><dd>${esc(t.areaPrivativa || '—')}</dd></div>${t.suites ? `<div><dt>Suítes</dt><dd>${esc(t.suites)}</dd></div>` : ''}${t.vagas ? `<div><dt>Vagas</dt><dd>${esc(t.vagas)}</dd></div>` : ''}</dl><button class="btn btn-escuro" data-bookpl>Receber a tabela desta planta</button></div>${t.planta ? `<div class="img" data-zoom><img src="${esc(t.planta)}" alt="Planta ${esc(t.nome)}"></div>` : ''}</div>`;
      $('[data-zoom]', $('#plCont'))?.addEventListener('click', () => lightbox([{ src: t.planta, legenda: 'Planta · ' + t.nome }], 0));
      $('[data-bookpl]').onclick = () => abrirModal({ titulo: 'Tabela: ' + esc(t.nome), dica: e.nome + '. Deixe seus dados e enviamos a tabela e as unidades disponíveis.', tipo: 'tabela', botao: 'Receber a tabela', extra: { empreendimento: e.nome, slug: e.slug, tipologia: t.nome } });
      $$('[data-pl]').forEach((b) => b.classList.toggle('on', +b.dataset.pl === i)); };
    if (pl.length) { $$('[data-pl]').forEach((b) => (b.onclick = () => mostraPl(+b.dataset.pl))); mostraPl(0); }
    const lista = { dif: e.diferenciais || [], laz: e.lazer || [] };
    const mostraDif = (k) => { $('#difLista').innerHTML = lista[k].map((x) => `<li>${esc(x)}</li>`).join(''); $$('[data-dl]').forEach((b) => b.classList.toggle('on', b.dataset.dl === k)); };
    if ($('#difLista')) { $$('[data-dl]').forEach((b) => (b.onclick = () => mostraDif(b.dataset.dl))); mostraDif(lista.dif.length ? 'dif' : 'laz'); }
    ligarSubnav(); ligarMapa(e);
  }
  function ligarSubnav() {
    const links = $$('.subnav [data-sub]'); if (!links.length) return;
    links.forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); const el = document.getElementById(a.dataset.sub); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 128, behavior: 'smooth' }); }));
    const obs = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.dataset.sub === en.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
    links.forEach((a) => { const el = document.getElementById(a.dataset.sub); if (el) obs.observe(el); });
    observadores.push(obs);
  }

  /* complexos (lotes e bairros planejados) */
  function pgCx(e) {
    const secs = e.secoes || [];
    const nomes = { 'o-bairro': e.hub ? 'O complexo' : 'O empreendimento', pilares: 'Estrutura', produtos: 'Produtos', masterplan: 'Masterplan', galeria: 'Galeria', localizacao: 'Localização', cidade: 'A cidade', duvidas: 'Dúvidas' };
    const sub = secs.map((s) => [s.id, s.id === 'cidade' ? (s.titulo || 'A cidade') : nomes[s.id] || s.titulo]).concat([['contato', 'Fale conosco']]);
    const fotosGal = (secs.find((s) => s.id === 'galeria') || {}).fotos || [];
    const nome = e.nome;
    const html = secs.map((s) => {
      if (s.id === 'o-bairro' || s.id === 'cidade') return `<section class="det-sec ${s.id === 'cidade' ? 'alt' : ''}" id="${s.id}"><div class="wrap sobre"><div class="txt" data-r><span class="kick">${esc(s.kicker || nomes[s.id])}</span><h2 class="h2">${esc(s.titulo)}</h2>${(s.texto || []).map((p) => `<p>${esc(p)}</p>`).join('')}${s.id === 'o-bairro' ? secVideo(e.video, e.bg || e.capa) : ''}</div>
        ${(s.dados || []).length ? `<aside class="ficha" data-r><h4>Ficha</h4>${s.dados.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</aside>` : s.img ? `<div data-r style="border-radius:22px;overflow:hidden"><img src="${esc(s.img)}" alt=""></div>` : ''}</div></section>`;
      if (s.id === 'pilares') return `<section class="det-sec alt" id="pilares"><div class="wrap"><span class="kick">${esc(s.kicker || 'Estrutura')}</span><h2 class="h2">${esc(s.titulo)}</h2><div class="grupos">${(s.grupos || []).map((g) => `<div class="grupo" data-r>${g.img ? `<img src="${esc(g.img)}" alt="" loading="lazy">` : ''}<div class="in"><h3>${esc(g.titulo)}</h3><ul>${g.itens.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`).join('')}</div></div></section>`;
      if (s.id === 'produtos') return `<section class="det-sec" id="produtos"><div class="wrap"><span class="kick">${esc(s.kicker || 'Produtos')}</span><h2 class="h2">${esc(s.titulo)}</h2><div class="grade" style="margin-top:40px">${(s.cards || []).map((c) => {
          const alvo = c.link && achar(c.link);
          const inner = `<div class="ft"><img src="${esc(c.img)}" alt="" loading="lazy">${c.kicker ? `<span class="selo">${esc(c.kicker)}</span>` : ''}</div><div class="tx"><h3>${esc(c.titulo)}</h3><p>${esc(c.texto)}</p>${c.itens.length ? `<ul class="lista-dif" style="columns:1;margin-top:12px">${c.itens.map((x) => `<li style="font-size:14px;padding:9px 0 9px 26px">${esc(x)}</li>`).join('')}</ul>` : ''}<div class="rod"><span></span><b>${alvo ? 'Conhecer' : 'Receber o material'} ${I.seta.replace('<svg', '<svg width="16" height="16"')}</b></div></div>`;
          return alvo ? `<a class="card-e" data-r href="${rotaDe(alvo)}">${inner}</a>` : `<button class="card-e" data-r style="text-align:left" data-matcx="${esc(c.titulo)}">${inner}</button>`;
        }).join('')}</div></div></section>`;
      if (s.id === 'masterplan') return `<section class="det-sec alt" id="masterplan"><div class="wrap"><span class="kick">${esc(s.kicker || 'Implantação')}</span><h2 class="h2">Masterplan</h2><div class="masterplan"><div class="img" data-mp data-r><img src="${esc(s.img)}" alt="Masterplan ${esc(nome)}"></div>${(s.itens || []).length ? `<ol data-r>${s.itens.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}</div></div></section>`;
      if (s.id === 'galeria') return secGaleria(s.fotos);
      if (s.id === 'localizacao') return secMapa(e, 'Onde fica', s.texto, s.endereco);
      if (s.id === 'duvidas') return `<section class="det-sec" id="duvidas"><div class="wrap" style="max-width:900px"><span class="kick">Dúvidas</span><h2 class="h2">Perguntas <em>frequentes</em></h2><div class="faq" style="margin-top:30px">${(s.faq || []).map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></div></section>`;
      return '';
    }).join('');
    return `<section class="det-hero"><img src="${esc(e.bg || e.capa)}" alt="${esc(nome)}"><div class="wrap">
      ${e.logo ? `<img class="lg" src="${esc(e.logo)}" alt="${esc(nome)}">` : ''}
      <div class="chips-h">${(e.chips || []).map((c) => `<span>${esc(c)}</span>`).join('')}</div>
      ${e.hub ? '' : `<div class="slogan">${esc(nome)}</div>`}<h1 style="font-size:clamp(44px,6.4vw,90px)">${esc(e.titulo)}</h1><p class="res">${esc(e.resumo)}</p>
      ${(e.stats || []).length ? `<dl class="nums">${e.stats.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      <div class="acoes-h"><button class="btn btn-ouro" data-book>${I.doc} Receber a apresentação</button>${ferramentas(e)}</div></div></section>
      <nav class="subnav"><div class="wrap">${sub.map(([id, t], i) => `<a href="#sec-${id}" data-sub="${id}" class="${i ? '' : 'on'}">${esc(t)}</a>`).join('')}<button class="btn btn-escuro" data-book>Receber a apresentação</button></div></nav>
      ${html}${secContato(e)}${e.hub ? '' : conhecaTambem(e)}`;
  }
  function ligarCx(e) {
    const root = APP;
    $$('[data-book]', root).forEach((b) => b.addEventListener('click', () => abrirModal({ titulo: 'Receber a apresentação do ' + esc(e.nome), dica: 'Deixe seus dados e a Rei dos Imóveis envia o material completo para você.', tipo: 'book', botao: 'Receber o material', extra: { empreendimento: e.nome, slug: e.slug }, ok: 'Recebemos seu pedido. A apresentação do ' + e.nome + ' chega para você em breve.' })));
    $$('[data-matcx]', root).forEach((b) => b.addEventListener('click', () => abrirModal({ titulo: 'Receber o material: ' + esc(b.dataset.matcx), dica: e.nome + '. Deixe seus dados e enviamos o material e a tabela.', tipo: 'book', botao: 'Receber o material', extra: { empreendimento: e.nome + ' · ' + b.dataset.matcx, slug: e.slug } })));
    ligarForms(root, { empreendimento: e.nome, slug: e.slug }); ligarFerr(e, root); ligarVideo(root);
    const gal = ((e.secoes || []).find((s) => s.id === 'galeria') || {}).fotos || []; ligarGaleria(gal, root);
    const mp = (e.secoes || []).find((s) => s.id === 'masterplan'); $('[data-mp]', root)?.addEventListener('click', () => lightbox([{ src: mp.img, legenda: 'Masterplan · ' + e.nome }], 0));
    ligarSubnav(); ligarMapa(e);
  }

  function pgQuem() {
    const princ = [['Clareza', 'Informações transparentes e acessíveis para que cada decisão seja tomada com consciência.'], ['Estratégia', 'Oportunidades analisadas de acordo com os objetivos, as necessidades e o momento de cada comprador.'], ['Proximidade', 'Relações construídas com atenção, disponibilidade e respeito às particularidades de cada cliente.'], ['Conhecimento', 'Estudo contínuo do mercado, das regiões e dos empreendimentos para oferecer orientação consistente.'], ['Responsabilidade', 'A confiança do cliente está acima de qualquer negociação. Cada recomendação deve refletir esse compromisso.']];
    return cabecalho('Quem somos', 'Mais contexto para decisões mais seguras.', 'img/midia_mw6xu2hh-524798b2017bd5d8.webp', 'Sobre nós') +
    `<section class="sec"><div class="wrap sobre-txt">
      <div class="lado" data-r>${retrato()}
        <span class="kick" style="margin-top:34px">Onde atuamos</span>
        <div class="cidades-at">${['Praia Brava', 'Balneário Camboriú', 'Itajaí', 'Navegantes', 'Itapema', 'Porto Belo'].map((c) => `<span>${c}</span>`).join('')}</div></div>
      <div class="col" data-r>
        <p>Fundada por Ciro Garcia, a Rei dos Imóveis nasceu com uma maneira diferente de pensar e conduzir negócios imobiliários.</p>
        <p>Somos uma operação comercial coordenada, formada por corretores associados, que combina conhecimento de mercado, orientação estratégica e intermediação imobiliária. Não somos uma imobiliária convencional. Nossa atuação vai além da apresentação de empreendimentos: buscamos compreender o que cada comprador procura para conectar seus objetivos às oportunidades certas.</p>
        <p>Com mais de duas décadas de experiência no setor imobiliário, Ciro Garcia reúne conhecimentos em corretagem, construção civil, gestão comercial e desenvolvimento de equipes. Essa trajetória contribui para uma visão ampla do mercado, das regiões e dos diferentes aspectos que envolvem uma decisão imobiliária.</p>
        <p>Atuamos no segmento de alto padrão no litoral norte de Santa Catarina, Praia Brava, Balneário Camboriú, Itajaí, Navegantes, Itapema e Porto Belo, regiões que concentram alguns dos mercados imobiliários mais valorizados do país.</p>
        <p>Acreditamos que conhecer o mercado é fundamental, mas compreender quem está comprando é o que direciona uma boa escolha. Por isso, nosso trabalho começa antes da apresentação de qualquer imóvel: entendemos necessidades, preferências, expectativas e objetivos para selecionar alternativas coerentes com cada decisão.</p>
        <p>A partir daí, nossa estrutura comercial conduz a intermediação, conectando compradores, empreendimentos e profissionais para transformar escolhas bem orientadas em negócios.</p>
      </div></div>
      <div class="wrap"><blockquote class="citacao" data-r><q>O imóvel é o último passo. Tudo que importa acontece antes.</q><cite>— Ciro Garcia, fundador da Rei dos Imóveis</cite></blockquote></div></section>
    <section class="sec escuro"><div class="wrap jeito">
      <div data-r><span class="kick">Nosso jeito de atender</span><h2 class="h2">O ponto de partida é entender <em>o que você quer construir.</em></h2>
        <a class="btn btn-ouro" style="margin-top:34px" href="${waLink('Olá! Vim pela página Sobre nós da Rei dos Imóveis e gostaria de falar com a assessoria.')}" target="_blank" rel="noopener">Fale com nossa assessoria ${I.seta}</a></div>
      <div data-r>
        <p>Cada compra tem uma razão. Pode ser uma decisão patrimonial, um investimento, uma mudança de vida ou a busca por um lugar para aproveitar bons momentos.</p>
        <p>Antes de apresentar empreendimentos, procuramos compreender o que realmente importa para você. Com esse contexto, analisamos as alternativas disponíveis e direcionamos a busca para oportunidades que façam sentido para seus objetivos.</p>
        <p>Nosso papel é oferecer conhecimento, perspectiva e orientação durante a escolha, além de conduzir a intermediação comercial com proximidade, clareza e responsabilidade.</p>
        <p class="fecho">Porque uma boa decisão não depende de quantos imóveis você conhece, mas de encontrar aqueles que realmente fazem sentido.</p>
      </div></div></section>
    <section class="sec"><div class="wrap">
      <div data-r><span class="kick">Direção e princípios</span><h2 class="h2">O que orienta <em>cada recomendação.</em></h2></div>
      <div class="mv">
        <div data-r><h3>Missão</h3><p>Compreender objetivos, conectar pessoas a oportunidades imobiliárias e conduzir negócios por meio de conhecimento de mercado, orientação estratégica e intermediação responsável.</p></div>
        <div data-r><h3>Visão</h3><p>Ser referência em inteligência imobiliária, atendimento consultivo e desenvolvimento de negócios no litoral catarinense.</p></div>
      </div>
      <span class="kick" style="margin-top:80px" data-r>Nossos princípios</span>
      <ol class="princ">${princ.map(([t, d], i) => `<li data-r><i>0${i + 1}</i><b>${t}</b><span>${d}</span></li>`).join('')}</ol>
    </div></section>` + blocoAtendimento();
  }
  function pgMateriais() {
    const M = Rei.db.materiais.filter((m) => m.ativo !== false);
    return cabecalho('Materiais gratuitos', 'Estudos e projetos que ajudam a entender para onde o litoral catarinense está crescendo.', 'img/midia_mv91lfpj-0b4e79c565fe3e46.webp', 'Conhecimento antes do investimento') +
      `<section class="sec compacta"><div class="wrap"><div class="duas-col">${M.map(cardMat).join('') || '<div class="vazio"><h3>Novos materiais em breve</h3></div>'}</div></div></section>` + blocoAtendimento();
  }
  function pgMaterial(m) {
    return cabecalho(esc(m.titulo), esc(m.resumo), m.capa, 'Material gratuito') +
      `<section class="sec compacta"><div class="wrap atend" style="align-items:center"><div data-r><div class="card-m" style="grid-template-columns:1fr;max-width:340px;padding:14px"><div class="cp" style="aspect-ratio:3/4"><img src="${esc(m.capa)}" alt=""><i></i><b style="font-size:24px">${esc(m.titulo)}</b></div></div></div>
      <div data-r>${htmlForm({ titulo: 'Acesse o material', dica: 'Preencha seus dados para liberar o acesso. É gratuito.', tipo: 'material', botao: 'Liberar o material', campos: 'curto' })}</div></div></section>`;
  }
  function pgBlog() {
    const P = Rei.db.posts;
    const cats = [...new Set(P.map((p) => p.categoria))];
    return cabecalho('Blog', 'Mercado, investimento e as cidades do litoral catarinense: o que você precisa saber antes de decidir.', 'img/midia_mw6xu0xl-1b55785fef08dd23.webp', 'Conteúdos') +
      `<section class="sec compacta"><div class="wrap"><div class="filtros"><button class="chip on" data-cat="">Todos</button>${cats.map((c) => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="contagem">${P.length} artigo${P.length === 1 ? '' : 's'}</div><div class="grade" id="gBlog">${P.map(cardPost).join('')}</div></div></section>
      <section class="sec escuro compacta"><div class="wrap atend" style="align-items:center"><div data-r><span class="kick">Newsletter</span><h2 class="h2">Receba os novos artigos e os <em>pré-lançamentos</em></h2><p class="lead" style="margin-top:14px">Conteúdo sobre o litoral catarinense no seu e-mail, antes de todo mundo. Você pode cancelar quando quiser.</p></div>
      <div data-r><form class="form js-form" data-tipo="newsletter" data-ok="Inscrição confirmada. Você vai receber as novidades no seu e-mail." novalidate><div class="erro-f" hidden></div><div class="cp-f"><label>Nome</label><input name="nome" required></div><div class="cp-f"><label>E-mail</label><input name="email" type="email" required></div><button class="btn btn-escuro" type="submit">Assinar a newsletter</button></form></div></div></section>`;
  }
  function ligarBlog() {
    $$('[data-cat]').forEach((b) => b.addEventListener('click', () => { $$('[data-cat]').forEach((x) => x.classList.toggle('on', x === b)); const P = Rei.db.posts.filter((p) => !b.dataset.cat || p.categoria === b.dataset.cat); $('#gBlog').innerHTML = P.map(cardPost).join(''); revelar(); }));
    ligarForms(APP);
  }
  function pgPost(p) {
    const corpo = (p.corpo || []).map((b) => (b.startsWith('## ') ? `<h2>${esc(b.slice(3))}</h2>` : `<p>${esc(b)}</p>`)).join('');
    const outros = Rei.db.posts.filter((x) => x.id !== p.id).slice(0, 3);
    return `<section class="cab-pg" style="padding-bottom:120px"><img src="${esc(p.capa)}" alt=""><div class="wrap" style="max-width:860px"><span class="kick claro">${esc(p.categoria)} · ${dataBR(p.data)}</span><h1 style="font-size:clamp(40px,5vw,64px)">${esc(p.titulo)}</h1><p>${esc(p.resumo)}</p></div></section>
      <section class="sec compacta"><div class="wrap"><article class="artigo"><div class="capa"><img src="${esc(p.capa)}" alt=""></div>${corpo}
      <div style="margin-top:40px;display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-escuro" href="#/atendimento">Falar com a Rei dos Imóveis</a><button class="btn btn-borda" id="copPost">${I.link} Copiar link</button></div></article></div></section>
      ${outros.length ? `<section class="sec" style="padding-top:0"><div class="wrap"><span class="kick">Continue lendo</span><div class="grade" style="margin-top:30px">${outros.map(cardPost).join('')}</div></div></section>` : ''}`;
  }
  function pgFavoritos() {
    const F = favs(); const L = emps().filter((e) => F.includes(e.slug));
    return cabecalho('Favoritos', 'Os empreendimentos que você salvou ficam aqui, neste aparelho.', 'img/midia_mw6xu99x-055e81dc089d503f.webp', 'Sua seleção') +
      `<section class="sec compacta"><div class="wrap">${L.length ? `<div class="contagem">${L.length} salvo${L.length === 1 ? '' : 's'}</div><div class="grade">${L.map(cardEmp).join('')}</div>
      <div style="text-align:center;margin-top:40px"><button class="btn btn-ouro" id="enviarFavs">Receber informações dos meus favoritos</button></div>` : `<div class="vazio"><h3>Nenhum favorito ainda</h3><p>Toque no coração dos empreendimentos para salvar e comparar depois.</p><a class="btn btn-escuro" style="margin-top:22px" href="#/empreendimentos">Ver empreendimentos</a></div>`}</div></section>`;
  }
  function pgAtendimento() { return cabecalho('Atendimento personalizado', 'Conte o que você procura. A Rei dos Imóveis prepara as opções certas para o seu objetivo.', 'img/imagens_scenarium_hero.webp', 'Fale com a gente') + blocoAtendimento('Vamos encontrar <em>o seu imóvel</em>'); }
  function pgLegal(tipo) {
    const T = {
      privacidade: ['Política de Privacidade', `<p>Esta política explica como a Rei dos Imóveis trata os dados pessoais enviados por este site, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
        <h2>Quais dados coletamos</h2><p>Coletamos apenas os dados que você informa nos formulários: nome, e-mail, telefone e, quando preenchidos, cidade, objetivo, faixa de valor e mensagem. Os favoritos ficam salvos apenas no seu navegador.</p>
        <h2>Para que usamos</h2><p>Usamos os dados para responder ao seu pedido: enviar materiais, tabelas e informações sobre empreendimentos, agendar atendimentos e, se você assinar, enviar a newsletter.</p>
        <h2>Compartilhamento</h2><p>Seus dados não são vendidos nem compartilhados com terceiros para fins de marketing. Eles podem ser tratados por fornecedores de tecnologia que mantêm o site funcionando, sob dever de confidencialidade.</p>
        <h2>Seus direitos</h2><p>Você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados, e cancelar o recebimento de comunicações. Basta entrar em contato pelos nossos canais.</p>`],
      termos: ['Termos de Uso', `<p>Ao usar este site, você concorda com estes termos.</p><h2>Informações dos empreendimentos</h2><p>As informações, imagens e plantas são divulgadas pelas incorporadoras e têm caráter ilustrativo. Valores, disponibilidade e condições podem mudar sem aviso prévio e devem ser confirmados no atendimento e no memorial de incorporação.</p><h2>Conteúdo</h2><p>Os textos do blog e os materiais têm caráter informativo e não substituem uma análise individual do seu caso.</p><h2>Uso do site</h2><p>É proibido usar o site para fins ilícitos ou para enviar informações falsas nos formulários.</p>`],
      cookies: ['Política de Cookies', `<p>Este site usa o armazenamento do seu navegador para lembrar os empreendimentos que você favoritou. Não usamos cookies de publicidade.</p><h2>Como gerenciar</h2><p>Você pode apagar esses dados a qualquer momento nas configurações do seu navegador. Os favoritos salvos serão perdidos.</p>`]
    }[tipo];
    return cabecalho(T[0], '', null, 'Rei dos Imóveis') + `<section class="sec compacta"><div class="wrap legal" style="max-width:820px">${T[1]}</div></section>`;
  }

  /* ---------- rodapé ---------- */
  function rodape() {
    const c = cfg();
    $('#rodape').innerHTML = `<div class="wrap"><div class="cols">
      <div><a href="#/" class="marca"><img src="logo-claro.png" alt="Rei dos Imóveis"></a><p style="margin-top:18px;max-width:300px">Especialistas no m² mais valorizado do Brasil. Brava, Balneário Camboriú, Itapema e Porto Belo.</p>
        ${c.creci ? `<p style="margin-top:10px;font-size:13px">CRECI ${esc(c.creci)}</p>` : ''}
        <div class="redes"><a href="${esc(c.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a><a href="${esc(c.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">${I.yt}</a><a href="${esc(c.linkedin || 'https://www.linkedin.com/company/reidosim%C3%B3veis/home/')}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.li}</a></div></div>
      <div><h4>Navegue</h4><a href="#/pronto-para-morar">Pronto para morar</a><a href="#/empreendimentos">Apartamentos na planta</a><a href="#/vivapark-porto-belo">VivaPark Porto Belo</a><a href="#/all-resort-porto-belo">ALL WERT</a><a href="#/sobre-nos">Sobre nós</a><a href="#/blog">Blog</a><a href="#/materiais">Materiais</a><a href="#/atendimento">Atendimento</a></div>
      <div><h4>Links úteis</h4><a href="#/materiais/masterplan-de-porto-belo">Masterplan de Porto Belo</a><a href="#/materiais/projeto-itajai-2040">Projeto Itajaí 2040</a><a href="${esc(c.youtube)}" target="_blank" rel="noopener">Canal no YouTube</a>${c.telefone ? `<a href="tel:+55${c.telefone.replace(/\D/g, '')}">${esc(c.telefone)}</a>` : ''}${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}</div>
      <div><h4>Newsletter</h4><p>Receba informações exclusivas e os pré-lançamentos antes de todo mundo.</p>
        <form class="news js-news" novalidate><input name="nome" placeholder="Seu nome" aria-label="Seu nome"><input name="email" type="email" placeholder="Seu e-mail" aria-label="Seu e-mail"><button class="btn btn-ouro" type="submit">Assinar</button></form></div>
    </div><div class="base"><span>© ${new Date().getFullYear()} Rei dos Imóveis · Litoral SC</span><nav><a href="admin.html">Área do corretor</a><a href="#/privacidade">Privacidade</a><a href="#/termos">Termos de uso</a><a href="#/cookies">Cookies</a></nav></div></div>`;
    $('.js-news').addEventListener('submit', async (e) => {
      e.preventDefault(); const f = e.target; const d = Object.fromEntries(new FormData(f));
      if (!d.nome || !/^\S+@\S+\.\S+$/.test(d.email || '')) return toast('Preencha seu nome e um e-mail válido');
      await Rei.enviarLead({ tipo: 'newsletter', pagina: location.hash || '#/', nome: d.nome, email: d.email }); f.reset(); toast('Inscrição confirmada. Obrigado!');
    });
  }

  /* ---------- reveal + topo ---------- */
  const observadores = [];
  let io;
  function revelar() {
    if (!io) io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('vis'); en.target.classList.remove('pre'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    const h = innerHeight;
    $$('[data-r]:not(.vis)').forEach((el) => { if (el.getBoundingClientRect().top > h * 0.92 && !el.classList.contains('pre')) el.classList.add('pre'); io.observe(el); });
  }
  function topo() { $('#topo').classList.toggle('solido', scrollY > 40); }
  addEventListener('scroll', topo, { passive: true });

  /* ---------- roteador ---------- */
  function render() {
    observadores.splice(0).forEach((o) => o.disconnect()); document.body.classList.remove('home-on'); $$('.modal,.lb').forEach((x) => x.remove()); document.body.style.overflow = '';
    if (mapaAtual) { tentar(() => mapaAtual.remove()); mapaAtual = null; }
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = h.split('?'); const params = new URLSearchParams(qs || '');
    const parts = path.split('/').filter(Boolean);
    let html = '', depois = null, nav = '';
    if (!parts.length) { html = pgHome(); depois = ligarHome; nav = 'inicio'; }
    else if (parts[0] === 'empreendimentos' && !parts[1]) { html = pgLista(params); depois = ligarLista; nav = 'planta'; }
    else if (parts[0] === 'na-planta') { html = pgLista(params, ['Apartamentos na planta', 'Pré-lançamentos, lançamentos e obras no litoral catarinense: escolha a unidade antes de todo mundo.', 'img/midia_mw6xtaj7-a8b2313eb6907175.webp', 'Na planta'], 'planta'); depois = () => ligarLista('planta'); nav = 'planta'; }
    else if (parts[0] === 'pronto-para-morar') { html = pgLista(params, ['Pronto para morar', 'Imóveis entregues para você visitar, mudar logo ou alugar, no litoral catarinense.', 'img/midia_mw6xu2hh-524798b2017bd5d8.webp', 'Imóveis prontos'], 'pronto'); depois = () => ligarLista('pronto'); nav = 'pronto'; }
    else if ((parts[0] === 'imovel' || parts[0] === 'empreendimentos') && parts[1]) { const e = achar(parts[1]); if (e) { html = e.modelo === 'cad' ? pgCad(e) : e.modelo === 'cx' ? pgCx(e) : pgEmp(e); depois = () => (e.modelo === 'cad' ? ligarCad(e) : e.modelo === 'cx' ? ligarCx(e) : ligarEmp(e)); } }
    else if (HUBS[parts[0]]) { const e = HUBS[parts[0]]; html = pgCx(e); depois = () => ligarCx(e); }
    else if (achar(parts[0])) { const e = achar(parts[0]); html = e.modelo === 'cad' ? pgCad(e) : e.modelo === 'cx' ? pgCx(e) : pgEmp(e); depois = () => (e.modelo === 'cad' ? ligarCad(e) : e.modelo === 'cx' ? ligarCx(e) : ligarEmp(e)); }
    else if (parts[0] === 'quem-somos' || parts[0] === 'sobre-nos') { html = pgQuem(); nav = 'conteudos'; }
    else if (parts[0] === 'materiais' && parts[1]) { const m = Rei.db.materiais.find((x) => x.slug === parts[1]); if (m) { html = pgMaterial(m); depois = () => { const f = $('.js-form', APP); f.dataset.depois = m.link; f.dataset.ok = 'Acesso liberado. Bom proveito!'; ligarForms(APP, { material: m.titulo }); }; nav = 'materiais'; } }
    else if (parts[0] === 'materiais') { html = pgMateriais(); nav = 'materiais'; }
    else if (parts[0] === 'blog' && parts[1]) { const p = Rei.db.posts.find((x) => x.slug === parts[1]); if (p) { html = pgPost(p); depois = () => $('#copPost').addEventListener('click', () => copiar(urlAtual())); nav = 'blog'; } }
    else if (parts[0] === 'blog') { html = pgBlog(); depois = ligarBlog; nav = 'conteudos'; }
    else if (parts[0] === 'favoritos') { html = pgFavoritos(); depois = () => { const b = $('#enviarFavs'); if (b) b.onclick = () => abrirModal({ titulo: 'Receber informações dos favoritos', dica: favs().map((s) => achar(s)?.nome).filter(Boolean).join(', '), tipo: 'favoritos', botao: 'Enviar', campos: 'curto', extra: { empreendimento: favs().map((s) => achar(s)?.nome).filter(Boolean).join(', ') } }); }; }
    else if (parts[0] === 'atendimento') { html = pgAtendimento(); }
    else if (['privacidade', 'termos', 'cookies'].includes(parts[0])) { html = pgLegal(parts[0]); }
    if (!html) { html = cabecalho('Página não encontrada', 'O endereço pode ter mudado. Veja os empreendimentos ou volte ao início.', null, 'Erro 404') + `<section class="sec compacta"><div class="wrap" style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-escuro" href="#/">Ir para o início</a><a class="btn btn-borda" href="#/empreendimentos">Ver empreendimentos</a></div></section>`; }
    APP.innerHTML = html;
    $$('#nav [data-nav]').forEach((a) => a.classList.toggle('ativo', a.dataset.nav === nav)); $$('.js-wa').forEach((a) => (a.href = waLink())); menusCidade();
    $('#gaveta').classList.remove('aberta');
    window.scrollTo(0, 0); topo();
    if (depois) depois(); ligarFavs(APP); ligarForms(APP); revelar();
    const t = $('h1', APP); document.title = (parts.length && t ? t.textContent + ' | ' : '') + 'Rei dos Imóveis | Litoral SC';
  }
  // evita ligar formulários duas vezes
  const _lf = ligarForms;
  ligarForms = function (root, extra) { $$('.js-form', root).forEach((f) => { if (f.dataset.ligado) return; f.dataset.ligado = '1'; _lf({ querySelectorAll: () => [f] }, extra); }); };

  ['#buscaTopo', '#buscaGav'].filter((sel) => $(sel)).forEach((sel) => $(sel).addEventListener('submit', (e) => { e.preventDefault(); const q = e.target.q.value.trim(); location.hash = '#/empreendimentos' + (q ? '?q=' + encodeURIComponent(q) : ''); e.target.reset(); e.target.q.blur(); }));
  $('#burger').onclick = () => $('#gaveta').classList.add('aberta');
  $('#fecharG').onclick = () => $('#gaveta').classList.remove('aberta');
  addEventListener('hashchange', render);
  rodape(); contaFav(); render();
})();
