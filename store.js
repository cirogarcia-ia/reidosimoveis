/* Rei dos Imóveis · camada de dados
   Hoje: modo demonstração (fica salvo no navegador).
   Na publicação: troca por Supabase (mesmas funções), sem mudar as páginas. */
(function () {
  const CHAVE = 'rei_db_v1';
  const agora = () => new Date().toISOString();
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const POSTS_INICIAIS = [
    {
      id: 'p1', slug: 'comprar-na-planta-passo-a-passo', categoria: 'Guia do comprador', data: '2026-11-10', capa: 'img/midia_mw6xu2hh-524798b2017bd5d8.webp',
      titulo: 'Comprar na planta: como funciona, passo a passo',
      resumo: 'Da reserva da unidade à entrega das chaves: as etapas de uma compra na planta e o que conferir em cada uma delas.',
      corpo: [
        'Comprar um imóvel na planta é adquirir uma unidade que ainda vai ser construída. Em vez de pagar o valor todo de uma vez, o comprador acompanha a obra pagando um fluxo combinado com a incorporadora. É o caminho mais comum nos lançamentos do litoral catarinense.',
        '## 1. Escolha da unidade e proposta',
        'Tudo começa pela escolha da planta, do andar e da posição solar. Com a unidade definida, é feita uma proposta com a condição de pagamento. Depois que a incorporadora aprova, a unidade fica reservada para você.',
        '## 2. Registro de incorporação',
        'Antes de assinar, vale conferir se o empreendimento tem o registro de incorporação no Cartório de Registro de Imóveis. É esse registro que autoriza a venda das unidades ainda na planta e reúne o memorial descritivo, as áreas e o prazo da obra.',
        '## 3. Contrato e fluxo de pagamento',
        'O contrato de compra e venda traz o preço, o prazo de entrega e o fluxo: entrada, parcelas mensais, reforços anuais e o saldo nas chaves. Durante a obra, as parcelas costumam ser corrigidas pelo INCC, o índice do custo da construção.',
        '## 4. Acompanhamento da obra',
        'Ao longo da construção, a incorporadora informa o andamento da obra. É o período em que o imóvel pode se valorizar, à medida que o prédio sai do papel e o entorno se desenvolve.',
        '## 5. Entrega das chaves',
        'Na entrega, o saldo é pago à vista, financiado no banco ou parcelado direto com a incorporadora, conforme o contrato. Depois vêm a vistoria da unidade, a escritura e o registro em seu nome.',
        'Cada empreendimento tem condições próprias. Fale com a Rei dos Imóveis para conhecer o fluxo de pagamento da unidade que você quer.'
      ]
    },
    {
      id: 'p2', slug: 'pre-lancamento-lancamento-obras-ou-pronto', categoria: 'Mercado imobiliário', data: '2026-11-08', capa: 'img/midia_mw02tpt9-6682c3812d9fd00e.webp',
      titulo: 'Pré-lançamento, lançamento, em obras ou pronto: o que muda',
      resumo: 'Cada fase de um empreendimento tem vantagens diferentes. Entenda o que muda em preço, prazo e escolha de unidades.',
      corpo: [
        'Um mesmo empreendimento passa por fases diferentes até ficar pronto. E a fase em que você compra muda bastante o preço, a variedade de unidades e o tempo até as chaves.',
        '## Pré-lançamento',
        'É quando o projeto começa a ser apresentado, antes da campanha oficial de vendas. Costuma ter a melhor variedade de plantas, andares e posições. É a fase de quem quer escolher primeiro e tem paciência para esperar a obra inteira.',
        '## Lançamento',
        'É o início oficial das vendas, com tabela publicada e material completo. Ainda há boa oferta de unidades, e o prazo de entrega costuma ser de alguns anos.',
        '## Em obras',
        'Com a obra andando, o comprador vê o prédio subindo e tem um prazo de entrega mais curto. Em geral sobram menos opções de unidades, e a tabela já acompanha o avanço da construção.',
        '## Pronto para morar',
        'O imóvel está entregue: dá para visitar a unidade real, mudar logo ou alugar. É a opção para quem precisa do imóvel agora ou quer renda de locação imediata.',
        'Não existe fase certa para todo mundo: depende do seu objetivo, do prazo e de como você quer pagar. A Rei dos Imóveis ajuda você a comparar as opções disponíveis em cada fase.'
      ]
    },
    {
      id: 'p3', slug: 'lote-ou-apartamento-no-litoral', categoria: 'Guia do comprador', data: '2026-11-05', capa: 'img/midia_mv91lboz-f0a141d3b928e135.webp',
      titulo: 'Lote em condomínio ou apartamento: como escolher no litoral',
      resumo: 'Construir a casa do seu jeito ou ter tudo pronto perto do mar? Pontos para pensar antes de decidir.',
      corpo: [
        'No litoral catarinense convivem dois tipos de produto muito procurados: os apartamentos em torres perto do mar e os lotes em condomínios e bairros planejados. A escolha depende de como você quer viver e investir.',
        '## Quando o apartamento faz mais sentido',
        'Para quem quer praticidade, segurança de prédio e lazer pronto, o apartamento é o caminho natural. Também costuma ser o produto mais fácil de alugar por temporada, principalmente perto da praia.',
        '## Quando o lote faz mais sentido',
        'O lote em condomínio atrai quem quer construir a casa do próprio jeito, ter mais espaço e contato com a natureza. Nos bairros planejados, a estrutura de clube, as áreas verdes e a segurança fazem parte do pacote.',
        '## O que comparar',
        'Vale olhar a localização, a estrutura entregue, a fase do empreendimento, as condições de pagamento e o custo total: no lote, conte também a construção da casa; no apartamento, o condomínio e a mobília.',
        'Quer comparar um apartamento e um lote que estão no seu radar? Fale com a Rei dos Imóveis e montamos essa comparação com você.'
      ]
    }
  ];

  const MATERIAIS_INICIAIS = [
    { id: 'm1', slug: 'masterplan-de-porto-belo', titulo: 'Masterplan de Porto Belo', resumo: 'O plano de desenvolvimento de Porto Belo, para entender para onde a cidade está crescendo.', capa: 'img/midia_mv91lfpj-0b4e79c565fe3e46.webp', link: 'https://drive.google.com/file/d/1TiUSvRyKWb5clnBqNg6SdsFFJlHvZxaG/view', ativo: true },
    { id: 'm2', slug: 'projeto-itajai-2040', titulo: 'Projeto Itajaí 2040: moderna e sustentável', resumo: 'O projeto de futuro de Itajaí, cidade da Praia Brava, apresentado em um só material.', capa: 'img/imagens_scenarium_hero.webp', link: 'https://bit.ly/ProjetoItajai2040-ModernaeSustentável', ativo: true }
  ];

  const CONFIG_INICIAL = {
    corretor: 'Ciro', creci: '', telefone: '', email: '',
    instagram: 'https://www.instagram.com/reidosimoveissc/',
    youtube: 'https://www.youtube.com/channel/UCypcUyak5TucZqVokRw4osA/featured',
    destaque: 'lagom-pereque', foto: ''
  };

  function ler() {
    let d = null;
    if (window.__DB0) { d = window.__DB0; window.__DB0 = null; }
    else     try { d = JSON.parse(localStorage.getItem(CHAVE) || 'null'); } catch (e) { d = null; }
    if (!d) d = {};
    d.leads = d.leads || [];
    d.posts = d.posts || POSTS_INICIAIS;
    d.materiais = d.materiais || MATERIAIS_INICIAIS;
    d.config = Object.assign({}, CONFIG_INICIAL, d.config || {});
    d.emp = d.emp || {};
    d.imoveis = d.imoveis || [];
    d.equipe = d.equipe || [];
    return d;
  }
  let DB = ler();
  const MEM_FALLBACK = { ok: true };
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(DB)); } catch (e) { MEM_FALLBACK.ok = false; }
    ouvintes.forEach((f) => { try { f(); } catch (e) {} });
  }
  const ouvintes = [];
  window.addEventListener('storage', (e) => { if (e.key === CHAVE) { DB = ler(); ouvintes.forEach((f) => { try { f(true); } catch (er) {} }); } });

  window.__REI_INICIAIS = { POSTS_INICIAIS, MATERIAIS_INICIAIS, CONFIG_INICIAL };
  window.Rei = {
    pronto: Promise.resolve(),
    get db() { return DB; },
    recarregar() { DB = ler(); },
    aoMudar(f) { ouvintes.push(f); },
    salvar,
    uid,
    enviarLead(dados) {
      const l = Object.assign({ id: uid(), criado_em: agora(), status: 'novo', lido: false, notas: [] }, dados);
      const cs = (DB.equipe || []).filter((e) => e.ativo !== false && e.papel === 'corretor').sort((a, b) => String(a.ultimo_lead || '').localeCompare(String(b.ultimo_lead || '')));
      if (cs.length && !l.corretor) { l.corretor = cs[0].email; cs[0].ultimo_lead = agora(); }
      DB.leads.unshift(l); salvar(); return Promise.resolve(l);
    },
    atualizarLead(id, mud) { const l = DB.leads.find((x) => x.id === id); if (l) { Object.assign(l, mud); salvar(); } return l; },
    excluirLead(id) { DB.leads = DB.leads.filter((x) => x.id !== id); salvar(); },
    empOverride(slug) { return DB.emp[slug] || {}; },
    setEmp(slug, mud) { DB.emp[slug] = Object.assign({}, DB.emp[slug] || {}, mud); salvar(); },
    setConfig(mud) { Object.assign(DB.config, mud); salvar(); },
    salvarPost(p) { const i = DB.posts.findIndex((x) => x.id === p.id); if (i >= 0) DB.posts[i] = p; else DB.posts.unshift(p); salvar(); },
    excluirPost(id) { DB.posts = DB.posts.filter((x) => x.id !== id); salvar(); },
    salvarMaterial(m) { const i = DB.materiais.findIndex((x) => x.id === m.id); if (i >= 0) DB.materiais[i] = m; else DB.materiais.push(m); salvar(); },
    excluirMaterial(id) { DB.materiais = DB.materiais.filter((x) => x.id !== id); salvar(); },
    proximoCodigo() { const n = DB.imoveis.reduce((m, i) => Math.max(m, parseInt(String(i.codigo || '').replace(/\D/g, ''), 10) || 0), 0) + 1; return 'RDI-' + String(n).padStart(3, '0'); },
    salvarImovel(im) {
      const antes = JSON.stringify(DB.imoveis);
      im.atualizado_em = agora(); if (!im.id) { im.id = uid(); im.criado_em = agora(); }
      const i = DB.imoveis.findIndex((x) => x.id === im.id); if (i >= 0) DB.imoveis[i] = im; else DB.imoveis.unshift(im);
      try { localStorage.setItem(CHAVE, JSON.stringify(DB)); } catch (e) { if (/quota/i.test(e.name + ' ' + e.message)) { DB.imoveis = JSON.parse(antes); return false; } }
      ouvintes.forEach((f) => { try { f(); } catch (e) {} }); return true;
    },
    excluirImovel(id) { DB.imoveis = DB.imoveis.filter((x) => x.id !== id); salvar(); },
    substituir(d) { DB = d; salvar(); },
    papel: () => 'administrador',
    cadastrarMembro(m) { const email = String(m.email || '').trim().toLowerCase(); if (!/^\S+@\S+\.\S+$/.test(email)) return Promise.resolve({ erro: 'E-mail inválido.' }); if (String(m.senha || '').length < 6) return Promise.resolve({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
      DB.equipe = DB.equipe.filter((x) => x.email !== email).concat({ email, nome: m.nome, papel: m.papel, telefone: m.telefone || '', ativo: true, criado_em: agora() }); salvar(); return Promise.resolve({ ok: true }); },
    atualizarMembro(email, mud) { const x = DB.equipe.find((e) => e.email === email); if (x) Object.assign(x, mud); salvar(); return Promise.resolve({ ok: true }); },
    resetarDemo() { try { localStorage.removeItem(CHAVE); } catch (e) {} DB = ler(); salvar(); }
  };
})();
