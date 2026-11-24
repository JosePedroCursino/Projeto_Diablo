// dados base
const PONTOS_MAXIMOS = 83;
const NIVEL_MAX_SKILL = 15;

const SLOTS_GEAR = [
  "Arma Principal",
  "Arma Secundária / Escudo",
  "Elmo",
  "Peitoral",
  "Luvas",
  "Calças",
  "Botas",
  "Amuleto",
  "Anel 1",
  "Anel 2"
];

// banco de skills
const BANCO_CLASSES = {
  druida: {
    nome: "Druida",
    nodos: [
      {
        id: "nodo-basic",
        nome: "Basic",
        qtd: 5,
        skills: [
          {
            nome: "Storm Strike",
            resumo: "Aplica vulnerabilidade e gera espírito.",
            modEsq: ["Fierce Storm Strike", "Wild Storm Strike"],
            modDir: ["Enhanced Storm Strike A", "Enhanced Storm Strike B"],
            modFinal: ["Final Storm A", "Final Storm B", "Final Storm C"]
          },
          {
            nome: "Claw"
          }
        ]
      },
      {
        id: "nodo-core",
        nome: "Core",
        qtd: 6,
        skills: [
          { nome: "Pulverize" },
          { nome: "Landslide" },
          { nome: "Tornado" }
        ]
      },
      {
        id: "nodo-defensive",
        nome: "Defensive",
        qtd: 4,
        skills: []
      },
      {
        id: "nodo-companion",
        nome: "Companion",
        qtd: 3,
        skills: []
      },
      {
        id: "nodo-wrath",
        nome: "Wrath",
        qtd: 4,
        skills: []
      },
      {
        id: "nodo-ultimate",
        nome: "Ultimate",
        qtd: 4,
        skills: []
      }
    ]
  },
  bruxo: {
    nome: "Bruxo",
    nodos: [ 
      {
        id: "nodo-basic",
        nome: "Basic",
        qtd: 4,
        skills: [
          {
            nome: "",
            resumo: "",
            modEsq: ["",""],
            modDir: ["",""],
            modFinal: ["","",""],
          },
        ]
      },
      {
        id: "nodo-core",
        nome: "Core",
        qtd: 5,
        skills: [
          {
            nome: "",
            resumo: "",
            modEsq: ["",""],
            modDir: ["",""],
            modFinal: ["","",""],
          },
        ]
      },
      {
        id: "nodo-defensive",
        nome: "Defensive",
        qtd: 4,
        skills: [
          {
            nome: "",
            resumo: "",
            modEsq: ["",""],
            modDir: ["",""],
            modFinal: ["","",""],
          },
        ]
      },
      {
        id: "nodo-archfiend",
        nome: "Archfiend",
        qtd: 4,
        skills: [
          {
            nome: "",
            resumo: "",
            modEsq: ["",""],
            modDir: ["",""],
            modFinal: ["","",""],
          },
        ]
      },
      {
        id: "nodo-sigil",
        nome: "Sigil",
        qtd: 3,
        skills: [
          {
            nome: "",
            resumo: "",
            modEsq: ["",""],
            modDir: ["",""],
            modFinal: ["","",""],
          },
        ]
      },
      {
        id: "nodo-ultimate",
        nome: "Ultimate",
        qtd: 4,
        skills: [
          {
            nome: "",
            resumo: "",
            modEsq: ["",""],
            modDir: ["",""],
            modFinal: ["","",""],
          },
        ]
      },
    ]
  },
  base: {
    nome: "Modelo Base",
    nodos: [ 
      {
        id: "nodo-1",
        nome: "",
        qtd: 1,
        skills: [
          {
            nome: "",
            resumo: "",
            modEsq: ["",""],
            modDir: ["",""],
            modFinal: ["","",""],
          },
        ]
      },
    ]
  },
};

// construtor normalizado de skills
function normalizarModificadores(listaInformada, qtdEsperada, baseLabel, prefixoGrupo) {
  const resultado = [];
  const entrada = Array.isArray(listaInformada) ? listaInformada : [];

  for (let i = 0; i < qtdEsperada; i++) {
    const valor = entrada[i];
    resultado.push(valor ? valor : `${baseLabel} - ${prefixoGrupo} ${i + 1}`);
  }

  return resultado;
}

// gera skills baseadas no banco, preenche ids e chama o normalizador de skills
function gerarSkillsDoBanco(nodoConfig, prefixoClasse) {
  const skillsConfig = Array.isArray(nodoConfig.skills) ? nodoConfig.skills : [];
  const totalSkills = Number(nodoConfig.qtd) > 0 ? Number(nodoConfig.qtd) : skillsConfig.length;
  const listaSkills = [];

  for (let i = 0; i < totalSkills; i++) {
    const cfg = skillsConfig[i] || {};
    const indiceHumano = i + 1;
    const nomeSkill = cfg.nome ? cfg.nome : `${nodoConfig.nome} Skill ${indiceHumano}`;
    const resumoSkill = cfg.resumo ? cfg.resumo : `Descrição pendente para ${nomeSkill}.`;

    listaSkills.push({
      id: `${prefixoClasse}-${nodoConfig.id}-s${indiceHumano}`,
      nome: nomeSkill,
      resumo: resumoSkill,
      modEsq: normalizarModificadores(cfg.modEsq, 2, nomeSkill, "Mod Esq"),
      modDir: normalizarModificadores(cfg.modDir, 2, nomeSkill, "Mod Dir"),
      modFinal: normalizarModificadores(cfg.modFinal, 3, nomeSkill, "Mod Final")
    });
  }

  return listaSkills;
}

// monta as classes com as calsses passadas no banco de dados
function montarClassesData(banco) {
  const classesMontadas = {};

  for (const classeKey in banco) {
    const cfgClasse = banco[classeKey];
    const nodosOrdenados = Array.isArray(cfgClasse.nodos) ? cfgClasse.nodos : [];

    classesMontadas[classeKey] = {
      nome: cfgClasse.nome,
      arvores: nodosOrdenados.map((nodo) => ({
        id: nodo.id,
        nome: nodo.nome,
        skills: gerarSkillsDoBanco(nodo, classeKey)
      }))
    };
  }

  return classesMontadas;
}


// SEGUNDA ETAPA

// construir todas as classes
const CLASSES_DATA = montarClassesData(BANCO_CLASSES);

// fazer builds de exemplo
function montarBuildExemplo(config) {
  const classeKey = config.classeKey || "druida";
  const classeInfo = CLASSES_DATA[classeKey] || CLASSES_DATA.druida;
  const baseVazia = criarEstadoBuildVazio(classeKey);

  const skillsMontadas = { ...baseVazia.skills };
  if (config.skills) {
    for (const skillId in config.skills) {
      if (skillsMontadas[skillId]) {
        skillsMontadas[skillId] = {
          ...skillsMontadas[skillId],
          ...config.skills[skillId]
        };
      }
    }
  }

  const gearMontado = {
    ...baseVazia.gear,
    ...(config.gear || {})
  };

  return {
    id: config.id,
    titulo: config.titulo || "Build Sem Título",
    autor: config.autor || "Comunidade",
    classeKey,
    classeNome: classeInfo.nome,
    descricao: config.descricao || "",
    skills: skillsMontadas,
    gear: gearMontado
  };
}

// estado base do site
let usuarioLogado = false;
let editandoBuildId = null;

let estadoBuildAtual = criarEstadoBuildVazio("druida");

// builds exemplo
let buildsPublicas = [
  montarBuildExemplo({
    id: 1,
    titulo: "Druida Tempestade",
    autor: "PlayerUm",
    classeKey: "druida",
    descricao: "Build de druida da tempestade, tier S muito bão",
    skills: {
      "druida-nodo-basic-s1": {
        nivel: 5,
        esq: "Fierce Storm Strike",
        dir: "Enhanced Storm Strike B",
        final: "Final Storm A"
      }
    },
    gear: {
      "Arma Principal": "Cajado grande / Aspecto da tempestade"
    }
  }),
  montarBuildExemplo({
    id: 2,
    titulo: "Build Exemplo Druida Terra",
    autor: "PlayerDois",
    classeKey: "druida",
    descricao: "Outra build de exemplo para testar filtros por classe e texto.",
    skills: {
      "druida-nodo-core-s1": {
        nivel: 8,
        esq: "Pulverize - Mod Esq 1",
        dir: "Pulverize - Mod Dir 1",
        final: "Pulverize - Mod Final 2"
      }
    },
    gear: {
      "Elmo": "Visão de mephysto / Aspecto do urso"
    }
  })
];

let minhasBuilds = carregarBuildsSalvas();

// seletores de telas/quadros/paginas
const telas = document.querySelectorAll(".tela");
const botoesNav = document.querySelectorAll(".nav-btn");
const btnNavLogin = document.getElementById("btn-nav-login");

const formLogin = document.getElementById("form-login");
const inputUsuario = document.getElementById("login-usuario");
const inputSenha = document.getElementById("login-senha");
const msgLogin = document.getElementById("msg-login");

const campoBusca = document.getElementById("campo-busca");
const filtroClasse = document.getElementById("filtro-classe");
const gradeBuilds = document.getElementById("grade-builds");
const resumoBusca = document.getElementById("resumo-busca");

const formBuild = document.getElementById("form-build");
const nomeBuildInput = document.getElementById("nome-build");
const seletorClasse = document.getElementById("seletor-classe");
const containerArvores = document.getElementById("container-arvores");
const containerGear = document.getElementById("container-gear");
const descricaoBuildInput = document.getElementById("descricao-build");
const pontosRestantesEl = document.getElementById("pontos-restantes");
const btnResetPontos = document.getElementById("btn-reset-pontos");
const btnNovaBuild = document.getElementById("btn-nova-build");
const msgBuild = document.getElementById("msg-build");

const statusSessaoEl = document.getElementById("status-sessao");
const listaPerfilBuilds = document.getElementById("lista-perfil-builds");
const tooltipEl = document.getElementById("tooltip-flutuante");

// outras funções utilizadas

// - gerar build vazia com pontos zerados
function criarEstadoBuildVazio(classeKey) {
  const skillsMap = {};
  const classe = CLASSES_DATA[classeKey] || CLASSES_DATA.druida;

  for (const arvore of classe.arvores) {
    for (const skill of arvore.skills) {
      skillsMap[skill.id] = {
        nivel: 0,
        esq: "",
        dir: "",
        final: ""
      };
    }
  }

  const gearObj = {};
  for (const slot of SLOTS_GEAR) {
    gearObj[slot] = "";
  }

  return {
    titulo: "",
    classeKey,
    descricao: "",
    skills: skillsMap,
    gear: gearObj
  };
}

// - carregar builds salvas (depois de logado)
function carregarBuildsSalvas() {
  try {
    const salvo = localStorage.getItem("sanctuary_minhas_builds");
    if (!salvo) return [];
    const parsed = JSON.parse(salvo);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

// - salva a build atual (tbm logado)
function salvarBuildsNoStorage() {
  try {
    localStorage.setItem("sanctuary_minhas_builds", JSON.stringify(minhasBuilds));
  } catch (e) {
  }
}

// calculadora de pontos
function calcularPontosGastos() {
  let total = 0;

  for (const chave in estadoBuildAtual.skills) {
    const skill = estadoBuildAtual.skills[chave];
    total += Number(skill.nivel) || 0;

    if (skill.esq) total += 1;
    if (skill.dir) total += 1;
    if (skill.final) total += 1;
  }

  return total;
}

// atualizador do contador de pontos (usa a calculadora de cima)
function atualizarContadorPontos() {
  const gastos = calcularPontosGastos();
  const restantes = PONTOS_MAXIMOS - gastos;
  pontosRestantesEl.textContent = restantes;
}

// adiciona e remove o oculta e chama os render de cada página
function mostrarTela(nomeTela) {
  for (const tela of telas) {
    tela.classList.add("oculta");
  }

  const alvo = document.getElementById(`tela-${nomeTela}`);
  if (alvo) {
    alvo.classList.remove("oculta");
  }

  for (const btn of botoesNav) {
    btn.classList.toggle("ativo", btn.dataset.tela === nomeTela);
  }

  if (nomeTela === "busca") {
    renderizarBuscaBuilds();
  } else if (nomeTela === "builder") {
    renderizarBuilder();
  } else if (nomeTela === "perfil") {
    renderizarPerfil();
  }
}

// tooltip que segue o mouse
function mostrarTooltip(htmlConteudo, clientX, clientY) {
  tooltipEl.innerHTML = htmlConteudo;
  tooltipEl.classList.remove("oculta");
  posicionarTooltip(clientX, clientY);
}

// faz o tooltip seguir o mouse
function posicionarTooltip(clientX, clientY) {
  const offset = 16;
  tooltipEl.style.left = `${clientX + offset}px`;
  tooltipEl.style.top = `${clientY + offset}px`;
}

// remove o tooltip quando sai do local
function esconderTooltip() {
  tooltipEl.classList.add("oculta");
}

// evento de quando o mouse está em cima de uma caixa que tem tooltip
document.addEventListener("mousemove", (event) => {
  if (!tooltipEl.classList.contains("oculta")) {
    posicionarTooltip(event.clientX, event.clientY);
  }
});

// login usando senha (padrão login e password)
formLogin.addEventListener("submit", (event) => {
  event.preventDefault();

  const usuarioDigitado = inputUsuario.value.trim();
  const senhaDigitada = inputSenha.value;

  if (usuarioDigitado === "" || senhaDigitada === "") {
    msgLogin.textContent = "Preencha login e senha.";
    return;
  }

  if (usuarioDigitado === "login" && senhaDigitada === "password") {
    usuarioLogado = true;
    btnNavLogin.textContent = "Logado (login)";
    msgLogin.textContent = "Login realizado com sucesso!";
    mostrarTela("perfil");
  } else {
    msgLogin.textContent = "Credenciais inválidas. Use login: login e senha: password.";
  }
});

// botões de tela no canto superior
for (const btn of botoesNav) {
  btn.addEventListener("click", () => {
    mostrarTela(btn.dataset.tela);
  });
}

// filtros de classes
function preencherFiltroClasses() {
  const classesIgnoradasNoFiltro = ["base"];

  const opcoes = [
    { value: "todas", label: "Todas as classes" },
    ...Object.entries(CLASSES_DATA)
      .filter(([key]) => !classesIgnoradasNoFiltro.includes(key))
      .map(([key, info]) => ({
        value: key,
        label: info.nome
      }))
  ];

  filtroClasse.innerHTML = opcoes
    .map((op) => `<option value="${op.value}">${op.label}</option>`)
    .join("");
}

function obterTodasBuilds() {
  return [...minhasBuilds, ...buildsPublicas];
}

// pesquisa por nome da build
function filtrarBuilds() {
  const termo = campoBusca.value.trim().toLowerCase();
  const classeSelecionada = filtroClasse.value;

  return obterTodasBuilds().filter((build) => {
    const bateClasse = classeSelecionada === "todas" || build.classeKey === classeSelecionada;
    const textoBusca = `${build.titulo} ${build.autor} ${build.descricao} ${build.classeNome}`.toLowerCase();
    const bateTexto = termo === "" || textoBusca.includes(termo);
    return bateClasse && bateTexto;
  });
}

// criar card de builds no perfil caso exista alguma
function criarCardBuild(build, ehDoPerfil) {
  const acoesHtml = ehDoPerfil
    ? `<button type="button" class="btn-primario btn-abrir-build" data-id="${build.id}" data-origem="perfil">Abrir Build</button>
       <button type="button" class="btn-secundario btn-excluir-build" data-id="${build.id}">Excluir</button>`
    : `<button type="button" class="btn-primario btn-abrir-build" data-id="${build.id}" data-origem="publica">Ver / Carregar Build</button>`;

  return `
    <article class="card-build">
      <span class="tag-classe">${build.classeNome}</span>
      <h3>${build.titulo}</h3>
      <p><strong>Autor:</strong> ${build.autor}</p>
      <p>${build.descricao || "Sem descrição."}</p>
      <div class="acoes-card">
        ${acoesHtml}
      </div>
    </article>
  `;
}

//atualiza cards de busca e dá quantidade de itens encontrados
function renderizarBuscaBuilds() {
  const filtradas = filtrarBuilds();
  resumoBusca.textContent = `${filtradas.length} build(s) encontrada(s)`;

  if (filtradas.length === 0) {
    gradeBuilds.innerHTML = `<p class="dica-login">Nenhuma build encontrada com esses filtros.</p>`;
    return;
  }

  gradeBuilds.innerHTML = filtradas.map((b) => criarCardBuild(b, false)).join("");
}

// eventos de filtros
campoBusca.addEventListener("input", renderizarBuscaBuilds);
filtroClasse.addEventListener("change", renderizarBuscaBuilds);

// rederiza a página de builds
// (o botão final cria uma cópia, não modifica a build original se ela não for acessada direto pelo perfil)
function renderizarBuilder() {
  const classeKey = estadoBuildAtual.classeKey;
  const classe = CLASSES_DATA[classeKey] || CLASSES_DATA.druida;

  seletorClasse.value = classeKey;
  nomeBuildInput.value = estadoBuildAtual.titulo;
  descricaoBuildInput.value = estadoBuildAtual.descricao;
  atualizarContadorPontos();

  containerArvores.innerHTML = classe.arvores
    .map((arvore) => {
      const skillsHtml = arvore.skills
        .map((skill) => {
          const dadosSkill = estadoBuildAtual.skills[skill.id] || {
            nivel: 0,
            esq: "",
            dir: "",
            final: ""
          };

          const esqHtml = skill.modEsq
            .map(
              (mod, idx) => `
              <label class="mod-item">
                <input
                  type="radio"
                  name="mod-esq-${skill.id}"
                  value="${mod}"
                  data-skill-id="${skill.id}"
                  data-grupo="esq"
                  ${dadosSkill.esq === mod ? "checked" : ""}
                />
                <span>${mod || `Esq ${idx + 1}`}</span>
              </label>
            `
            )
            .join("");

          const dirHtml = skill.modDir
            .map(
              (mod, idx) => `
              <label class="mod-item">
                <input
                  type="radio"
                  name="mod-dir-${skill.id}"
                  value="${mod}"
                  data-skill-id="${skill.id}"
                  data-grupo="dir"
                  ${dadosSkill.dir === mod ? "checked" : ""}
                />
                <span>${mod || `Dir ${idx + 1}`}</span>
              </label>
            `
            )
            .join("");

          const finalHtml = skill.modFinal
            .map(
              (mod, idx) => `
              <label class="mod-item">
                <input
                  type="radio"
                  name="mod-final-${skill.id}"
                  value="${mod}"
                  data-skill-id="${skill.id}"
                  data-grupo="final"
                  ${dadosSkill.final === mod ? "checked" : ""}
                />
                <span>${mod || `Final ${idx + 1}`}</span>
              </label>
            `
            )
            .join("");

          return `
            <div class="skill-card" data-tooltip-skill="${skill.id}">
              <div class="skill-topo">
                <span class="skill-nome">${skill.nome}</span>
                <div class="skill-controles-lvl">
                  <button type="button" class="btn-lvl btn-diminuir" data-skill-id="${skill.id}">-</button>
                  <span class="skill-lvl-valor">Lvl ${dadosSkill.nivel}/${NIVEL_MAX_SKILL}</span>
                  <button type="button" class="btn-lvl btn-aumentar" data-skill-id="${skill.id}">+</button>
                </div>
              </div>

              <div class="modificadores-wrap">
                <div class="mod-coluna">
                  <span class="mod-coluna-titulo">Modificador Esquerdo (1 de 2)</span>
                  <div class="mod-opcoes">${esqHtml}</div>
                </div>

                <div class="mod-coluna">
                  <span class="mod-coluna-titulo">Modificador Direito (1 de 2)</span>
                  <div class="mod-opcoes">${dirHtml}</div>
                </div>

                <div class="mod-coluna mod-finais">
                  <span class="mod-coluna-titulo">Modificador Principal Final (1 de 3)</span>
                  <div class="mod-opcoes">${finalHtml}</div>
                </div>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <article class="arvore-box">
          <h3>${arvore.nome}</h3>
          ${skillsHtml}
        </article>
      `;
    })
    .join("");

  containerGear.innerHTML = SLOTS_GEAR.map((slot) => {
    const valorAtual = estadoBuildAtual.gear[slot] || "";
    return `
      <div class="slot-gear" data-tooltip-gear="${slot}">
        <span class="slot-gear-titulo">${slot}</span>
        <input
          type="text"
          class="input-gear"
          data-slot="${slot}"
          value="${valorAtual}"
          placeholder="Preencher ${slot}..."
        />
      </div>
    `;
  }).join("");

  anexarEventosBuilder();
}

// busca descrição da skill no banco de dados
function buscarDefinicaoSkill(skillId) {
  for (const key in CLASSES_DATA) {
    for (const arvore of CLASSES_DATA[key].arvores) {
      const encontrada = arvore.skills.find((s) => s.id === skillId);
      if (encontrada) return encontrada;
    }
  }
  return null;
}

// aciona aumento e diminuição de níveis de skills, pontos de modificadores, gera os tooltips e salva texo
function anexarEventosBuilder() {
  const botoesAumentar = containerArvores.querySelectorAll(".btn-aumentar");
  for (const btn of botoesAumentar) {
    btn.addEventListener("click", () => {
      const skillId = btn.dataset.skillId;
      const atual = estadoBuildAtual.skills[skillId];
      const gastos = calcularPontosGastos();

      if (gastos >= PONTOS_MAXIMOS) {
        msgBuild.textContent = "Você atingiu o limite de pontos de habilidade.";
        return;
      }

      if (atual.nivel < NIVEL_MAX_SKILL) {
        atual.nivel += 1;
        msgBuild.textContent = "";
        renderizarBuilder();
      }
    });
  }

  const botoesDiminuir = containerArvores.querySelectorAll(".btn-diminuir");
  for (const btn of botoesDiminuir) {
    btn.addEventListener("click", () => {
      const skillId = btn.dataset.skillId;
      const atual = estadoBuildAtual.skills[skillId];

      if (atual.nivel > 0) {
        atual.nivel -= 1;
        msgBuild.textContent = "";
        renderizarBuilder();
      }
    });
  }

  const radiosMod = containerArvores.querySelectorAll("input[type='radio']");
  for (const radio of radiosMod) {
    radio.addEventListener("click", (event) => {
      event.preventDefault();

      const skillId = radio.dataset.skillId;
      const grupo = radio.dataset.grupo;
      const atualSkill = estadoBuildAtual.skills[skillId];
      const jaMarcado = atualSkill[grupo] === radio.value;

      if (jaMarcado) {
        atualSkill[grupo] = "";
        msgBuild.textContent = "";
        renderizarBuilder();
        return;
      }

      const jaTinhaOutroNoGrupo = Boolean(atualSkill[grupo]);
      const gastosAtuais = calcularPontosGastos();
      const custoLiquido = jaTinhaOutroNoGrupo ? 0 : 1;

      if (gastosAtuais + custoLiquido > PONTOS_MAXIMOS) {
        msgBuild.textContent = "Sem pontos disponíveis para selecionar esse modificador.";
        return;
      }

      atualSkill[grupo] = radio.value;
      msgBuild.textContent = "";
      renderizarBuilder();
    });
  }

  const cardsSkill = containerArvores.querySelectorAll(".skill-card");
  for (const card of cardsSkill) {
    const skillId = card.dataset.tooltipSkill;
    const def = buscarDefinicaoSkill(skillId);

    card.addEventListener("mouseenter", (event) => {
      const estadoSkill = estadoBuildAtual.skills[skillId];
      const html = `
        <strong>${def ? def.nome : "Skill"}</strong><br/>
        <span>Nível: ${estadoSkill.nivel} / ${NIVEL_MAX_SKILL}</span><br/>
        <span>Esq: ${estadoSkill.esq || "—"}</span><br/>
        <span>Dir: ${estadoSkill.dir || "—"}</span><br/>
        <span>Final: ${estadoSkill.final || "—"}</span><br/>
        <p style="margin-top:6px;">${def ? def.resumo : ""}</p>
      `;
      mostrarTooltip(html, event.clientX, event.clientY);
    });

    card.addEventListener("mouseleave", esconderTooltip);
  }

  const inputsGear = containerGear.querySelectorAll(".input-gear");
  for (const inp of inputsGear) {
    inp.addEventListener("input", () => {
      const slot = inp.dataset.slot;
      estadoBuildAtual.gear[slot] = inp.value;
    });
  }

  const slotsGearEl = containerGear.querySelectorAll(".slot-gear");
  for (const slotEl of slotsGearEl) {
    const nomeSlot = slotEl.dataset.tooltipGear;
    slotEl.addEventListener("mouseenter", (event) => {
      const conteudo = estadoBuildAtual.gear[nomeSlot] || "Não preenchido ainda.";
      mostrarTooltip(`<strong>${nomeSlot}</strong><br/><span>${conteudo}</span>`, event.clientX, event.clientY);
    });
    slotEl.addEventListener("mouseleave", esconderTooltip);
  }
}

// evento selecionar nova classe
seletorClasse.addEventListener("change", () => {
  const novaClasse = seletorClasse.value;
  estadoBuildAtual = criarEstadoBuildVazio(novaClasse);
  estadoBuildAtual.titulo = nomeBuildInput.value;
  estadoBuildAtual.descricao = descricaoBuildInput.value;
  renderizarBuilder();
});

// botão reset de pontos
btnResetPontos.addEventListener("click", () => {
  for (const chave in estadoBuildAtual.skills) {
    estadoBuildAtual.skills[chave].nivel = 0;
    estadoBuildAtual.skills[chave].esq = "";
    estadoBuildAtual.skills[chave].dir = "";
    estadoBuildAtual.skills[chave].final = "";
  }
  msgBuild.textContent = "Pontos e modificadores zerados.";
  renderizarBuilder();
});

// botão adcionar build
btnNovaBuild.addEventListener("click", () => {
  editandoBuildId = null;
  estadoBuildAtual = criarEstadoBuildVazio(seletorClasse.value);
  msgBuild.textContent = "Nova build limpa.";
  renderizarBuilder();
});

// botão salvar build (está criando cópias quando não aberto pelo perfil)
formBuild.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!usuarioLogado) {
    msgBuild.textContent = "Faça login primeiro (use login: login e senha: password).";
    return;
  }

  const titulo = nomeBuildInput.value.trim();
  if (titulo === "") {
    msgBuild.textContent = "Digite um nome para a build antes de salvar.";
    return;
  }

  const classeKey = seletorClasse.value;
  const classeNome = CLASSES_DATA[classeKey].nome;
  const descricao = descricaoBuildInput.value.trim();

  if (editandoBuildId !== null) {
    minhasBuilds = minhasBuilds.map((b) =>
      b.id === editandoBuildId
        ? {
            ...b,
            titulo,
            classeKey,
            classeNome,
            descricao,
            skills: JSON.parse(JSON.stringify(estadoBuildAtual.skills)),
            gear: { ...estadoBuildAtual.gear }
          }
        : b
    );
    msgBuild.textContent = "Build atualizada no seu perfil!";
  } else {
    const novoId = Date.now();
    const copiaSkills = JSON.parse(JSON.stringify(estadoBuildAtual.skills));
    const copiaGear = { ...estadoBuildAtual.gear };

    const novaBuild = {
      id: novoId,
      titulo,
      autor: "login",
      classeKey,
      classeNome,
      descricao,
      skills: copiaSkills,
      gear: copiaGear
    };

    minhasBuilds.unshift(novaBuild);
    editandoBuildId = novoId;
    msgBuild.textContent = "Nova build salva no seu perfil!";
  }

  salvarBuildsNoStorage();
  renderizarPerfil();
});

// perfil logado
function renderizarPerfil() {
  statusSessaoEl.textContent = usuarioLogado
    ? "Sessão ativa: usuário 'login'"
    : "Você não está logado (acesse a aba Login para salvar builds)";

  if (minhasBuilds.length === 0) {
    listaPerfilBuilds.innerHTML = `<p class="dica-login">Você ainda não salvou nenhuma build.</p>`;
    return;
  }

  listaPerfilBuilds.innerHTML = minhasBuilds.map((b) => criarCardBuild(b, true)).join("");
}

// carrega a build selecionada na pagina de edição
function carregarBuildNoEditor(build, ehMinhaBuild) {
  editandoBuildId = ehMinhaBuild ? build.id : null;
  estadoBuildAtual = criarEstadoBuildVazio(build.classeKey);
  estadoBuildAtual.titulo = build.titulo;
  estadoBuildAtual.descricao = build.descricao || "";

  if (build.skills) {
    for (const skillId in build.skills) {
      if (estadoBuildAtual.skills[skillId]) {
        estadoBuildAtual.skills[skillId] = {
          ...estadoBuildAtual.skills[skillId],
          ...build.skills[skillId]
        };
      }
    }
  }

  if (build.gear) {
    estadoBuildAtual.gear = {
      ...estadoBuildAtual.gear,
      ...build.gear
    };
  }

  msgBuild.textContent = `Carregada: "${build.titulo}"`;
  mostrarTela("builder");
}

// salva ou exclui a build
function tratarCliqueListaBuilds(event, origem) {
  const btnAbrir = event.target.closest(".btn-abrir-build");
  if (btnAbrir) {
    const id = Number(btnAbrir.dataset.id);
    const fonte = origem === "perfil" ? minhasBuilds : obterTodasBuilds();
    const build = fonte.find((item) => item.id === id);
    if (build) {
      carregarBuildNoEditor(build, origem === "perfil");
    }
    return;
  }

  const btnExcluir = event.target.closest(".btn-excluir-build");
  if (btnExcluir) {
    const id = Number(btnExcluir.dataset.id);
    minhasBuilds = minhasBuilds.filter((item) => item.id !== id);
    if (editandoBuildId === id) {
      editandoBuildId = null;
    }
    salvarBuildsNoStorage();
    renderizarPerfil();
  }
}

// trata se a build é publica ou do perfil
gradeBuilds.addEventListener("click", (e) => tratarCliqueListaBuilds(e, "publica"));
listaPerfilBuilds.addEventListener("click", (e) => tratarCliqueListaBuilds(e, "perfil"));

// eventos de mouse:
gradeBuilds.addEventListener("mouseover", (event) => {
  const card = event.target.closest(".card-build");
  if (card) card.classList.add("destaque");
});

gradeBuilds.addEventListener("mouseout", (event) => {
  const card = event.target.closest(".card-build");
  if (card) card.classList.remove("destaque");
});

document.addEventListener(
  "focus",
  (event) => {
    if (event.target.matches("input, select, textarea")) {
      event.target.classList.add("campo-ativo");
    }
  },
  true
);

document.addEventListener(
  "blur",
  (event) => {
    if (event.target.matches("input, select, textarea")) {
      event.target.classList.remove("campo-ativo");
    }
  },
  true
);

// renders
preencherFiltroClasses();
renderizarBuscaBuilds();
renderizarBuilder();
renderizarPerfil();