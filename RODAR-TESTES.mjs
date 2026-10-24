/**
 * Testes de integração da API — Plataforma de Bolsas e Mentorias
 *
 * Requisitos:
 *   - Node.js 18+
 *   - Backend iniciado e PostgreSQL disponível
 *   - Uma conta administradora existente na base de dados
 *
 * Execução:
 *   BASE_URL=http://localhost:3000 \
 *   ADMIN_EMAIL=admin@exemplo.com \
 *   ADMIN_PASSWORD='SenhaAdmin123!' \
 *   node testes-api.mjs
 *
 * O script cria contas de teste e não apaga registos da BD.
 */



const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

let passed = 0;
let failed = 0;

let candidateToken = "";
let mentorToken = "";
let otherMentorToken = "";
let adminToken = "";

let candidateId;
let mentorId;
let bolsaId;
let mentoriaId;
let solicitacaoId;
let pagamentoId;

const marca = `${Date.now()}`;
const candidateEmail = `candidato.${marca}@teste.local`;
const mentorEmail = `mentor.${marca}@teste.local`;
const otherMentorEmail = `outro.mentor.${marca}@teste.local`;
const otherCandidateEmail = `outro.candidato.${marca}@teste.local`;
const password = "SenhaTeste123!";

function verificar(condicao, mensagem) {
  if (condicao) {
    passed++;
    console.log(`PASSOU ${passed + failed}. ${mensagem}`);
  } else {
    failed++;
    console.error(`FALHOU ${passed + failed}. ${mensagem}`);
  }
}

async function pedido(
  metodo,
  caminho,
  { token, body, esperado, descricao } = {}
) {
  let resposta;
  let texto = "";

  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: metodo,
      headers: {
        ...(body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
      ...(body !== undefined
        ? { body: JSON.stringify(body) }
        : {}),
    });

    texto = await resposta.text();
  } catch (erro) {
    throw new Error(
      `Não foi possível contactar ${BASE_URL}. ` +
      `Confirma se o backend está iniciado. ${erro}`
    );
  }

  let dados = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = { texto };
    }
  }

  if (esperado !== undefined) {
    verificar(
      resposta.status === esperado,
      `${descricao || `${metodo} ${caminho}`} — ` +
      `esperado HTTP ${esperado}, recebido HTTP ${resposta.status}` +
      `${texto ? `; resposta: ${texto.slice(0, 220)}` : ""}`
    );
  }

  return {
    status: resposta.status,
    dados,
    texto,
  };
}

function temPropriedade(objeto, propriedade) {
  return (
    objeto !== null &&
    typeof objeto === "object" &&
    Object.prototype.hasOwnProperty.call(objeto, propriedade)
  );
}

async function main() {
  console.log(`\nTestes da API: ${BASE_URL}\n`);

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "Define ADMIN_EMAIL e ADMIN_PASSWORD de uma conta administradora. " +
      "O registo público não permite criar administradores."
    );

    process.exit(2);
  }

  // 1. Saúde da API e rota inexistente.

  const saude = await pedido("GET", "/saude", {
    esperado: 200,
    descricao: "API disponível",
  });

  verificar(
    saude.dados?.estado === "ativo",
    "GET /saude devolve estado ativo"
  );

  await pedido("GET", "/rota-que-nao-existe", {
    esperado: 404,
    descricao: "Rota inexistente devolve 404",
  });

  // 2. Registo de utilizadores.

  const candidato = await pedido(
    "POST",
    "/api/autenticacao/registar",
    {
      body: {
        nomeCompleto: "Candidato de Teste",
        email: candidateEmail,
        palavraPasse: password,
        tipo: "candidato",
      },
      esperado: 201,
      descricao: "Registo de candidato",
    }
  );

  candidateId = candidato.dados?.utilizador?.id;

  verificar(
    Number.isInteger(candidateId),
    "Registo devolve ID do candidato"
  );

  verificar(
    !temPropriedade(candidato.dados?.utilizador, "palavraPasseHash"),
    "Resposta de registo não expõe hash da palavra-passe"
  );

  const mentor = await pedido(
    "POST",
    "/api/autenticacao/registar",
    {
      body: {
        nomeCompleto: "Mentor de Teste",
        email: mentorEmail,
        palavraPasse: password,
        tipo: "mentor",
      },
      esperado: 201,
      descricao: "Registo de mentor",
    }
  );

  mentorId = mentor.dados?.utilizador?.id;

  verificar(
    Number.isInteger(mentorId),
    "Registo devolve ID do mentor"
  );

  await pedido("POST", "/api/autenticacao/registar", {
    body: {
      nomeCompleto: "Outro Mentor",
      email: otherMentorEmail,
      palavraPasse: password,
      tipo: "mentor",
    },
    esperado: 201,
    descricao: "Registo de segundo mentor",
  });

  await pedido("POST", "/api/autenticacao/registar", {
    body: {
      nomeCompleto: "Outro Candidato",
      email: otherCandidateEmail,
      palavraPasse: password,
      tipo: "candidato",
    },
    esperado: 201,
    descricao: "Registo de segundo candidato",
  });

  await pedido("POST", "/api/autenticacao/registar", {
    body: {
      nomeCompleto: "Email Repetido",
      email: candidateEmail,
      palavraPasse: password,
      tipo: "candidato",
    },
    esperado: 409,
    descricao: "Email duplicado é rejeitado",
  });

  await pedido("POST", "/api/autenticacao/registar", {
    body: {
      nomeCompleto: "Tentativa Admin",
      email: `admin.publico.${marca}@teste.local`,
      palavraPasse: password,
      tipo: "administrador",
    },
    esperado: 400,
    descricao: "Registo público não permite criar administrador",
  });

  await pedido("POST", "/api/autenticacao/registar", {
    body: {
      nomeCompleto: "X",
      email: "email-invalido",
      palavraPasse: "123",
      tipo: "candidato",
    },
    esperado: 400,
    descricao: "Dados inválidos no registo são rejeitados",
  });

  // 3. Login, tokens e perfil.
  // Confirma se a rota corresponde à implementada no teu backend.

  const loginCandidato = await pedido(
    "POST",
    "/api/autenticacao/iniciarSessao",
    {
      body: {
        email: candidateEmail,
        palavraPasse: password,
      },
      esperado: 200,
      descricao: "Login de candidato",
    }
  );

  candidateToken = loginCandidato.dados?.token || "";

  verificar(
    typeof candidateToken === "string" &&
    candidateToken.length > 20,
    "Login devolve JWT"
  );

  verificar(
    loginCandidato.dados?.utilizador?.tipo === "candidato",
    "Login devolve papel candidato"
  );

  verificar(
    !temPropriedade(loginCandidato.dados?.utilizador, "palavraPasseHash"),
    "Login não expõe hash"
  );

  const loginMentor = await pedido(
    "POST",
    "/api/autenticacao/iniciarSessao",
    {
      body: {
        email: mentorEmail,
        palavraPasse: password,
      },
      esperado: 200,
      descricao: "Login de mentor",
    }
  );

  mentorToken = loginMentor.dados?.token || "";

  const loginOutroMentor = await pedido(
    "POST",
    "/api/autenticacao/iniciarSessao",
    {
      body: {
        email: otherMentorEmail,
        palavraPasse: password,
      },
      esperado: 200,
      descricao: "Login do segundo mentor",
    }
  );

  otherMentorToken = loginOutroMentor.dados?.token || "";

  const loginAdmin = await pedido(
    "POST",
    "/api/autenticacao/iniciarSessao",
    {
      body: {
        email: ADMIN_EMAIL,
        palavraPasse: ADMIN_PASSWORD,
      },
      esperado: 200,
      descricao: "Login de administrador existente",
    }
  );

  adminToken = loginAdmin.dados?.token || "";

  verificar(
    loginAdmin.dados?.utilizador?.tipo === "administrador",
    "Token de administrador tem papel administrador"
  );

  await pedido("POST", "/api/autenticacao/iniciarSessao", {
    body: {
      email: candidateEmail,
      palavraPasse: "PalavraPasseErrada123!",
    },
    esperado: 401,
    descricao: "Palavra-passe errada é rejeitada",
  });

  const perfil = await pedido(
    "GET",
    "/api/autenticacao/perfil",
    {
      token: candidateToken,
      esperado: 200,
      descricao: "Perfil com token válido",
    }
  );

  verificar(
    perfil.dados?.utilizador?.id === candidateId,
    "Perfil corresponde ao candidato autenticado"
  );

  await pedido("GET", "/api/autenticacao/perfil", {
    esperado: 401,
    descricao: "Perfil sem token é rejeitado",
  });

  // 4. Bolsas: permissões, criação e publicação.

  const bolsasInicial = await pedido("GET", "/api/bolsas", {
    esperado: 200,
    descricao: "Listagem pública de bolsas",
  });

  verificar(
    Array.isArray(bolsasInicial.dados?.bolsas),
    "Listagem pública contém array bolsas"
  );

  await pedido("POST", "/api/bolsas", {
    token: candidateToken,
    body: {
      titulo: "Bolsa teste",
      descricao: "Descrição suficientemente longa para a validação.",
      instituicao: "Instituição Teste",
      pais: "Angola",
      requisitos: "Ensino médio concluído",
    },
    esperado: 403,
    descricao: "Candidato não pode criar bolsa",
  });

  const criacaoBolsa = await pedido(
    "POST",
    "/api/bolsas",
    {
      token: adminToken,
      body: {
        titulo: `Bolsa de teste ${marca}`,
        descricao: "Oportunidade de teste para validar o fluxo de publicação de bolsas.",
        instituicao: "Instituição de Teste",
        pais: "Angola",
        requisitos: "Ensino médio concluído",
        prazoCandidatura: "2027-12-31",
        ligacaoOficial: "https://example.org/bolsa-teste",
      },
      esperado: 201,
      descricao: "Administrador cria bolsa",
    }
  );

  bolsaId = criacaoBolsa.dados?.bolsa?.id;

  verificar(
    criacaoBolsa.dados?.bolsa?.estado === "rascunho",
    "Bolsa nova começa como rascunho"
  );

  if (bolsaId) {
    await pedido("GET", `/api/bolsas/${bolsaId}`, {
      esperado: 404,
      descricao: "Visitante não vê bolsa em rascunho",
    });

    const publicar = await pedido(
      "PATCH",
      `/api/bolsas/${bolsaId}/publicar`,
      {
        token: adminToken,
        esperado: 200,
        descricao: "Administrador publica bolsa",
      }
    );

    verificar(
      publicar.dados?.bolsa?.estado === "publicada",
      "Estado da bolsa passa a publicada"
    );

    const detalheBolsa = await pedido(
      "GET",
      `/api/bolsas/${bolsaId}`,
      {
        esperado: 200,
        descricao: "Visitante consulta bolsa publicada",
      }
    );

    verificar(
      detalheBolsa.dados?.bolsa?.id === bolsaId,
      "Detalhe devolve a bolsa correta"
    );

    await pedido("PATCH", `/api/bolsas/${bolsaId}`, {
      token: adminToken,
      body: { pais: "Portugal" },
      esperado: 200,
      descricao: "Administrador atualiza bolsa",
    });

    const listaAdmin = await pedido(
      "GET",
      "/api/bolsas/administracao",
      {
        token: adminToken,
        esperado: 200,
        descricao: "Administrador lista bolsas de todos os estados",
      }
    );

    verificar(
      Array.isArray(listaAdmin.dados?.bolsas),
      "Painel administrativo devolve array bolsas"
    );

    const retirar = await pedido(
      "PATCH",
      `/api/bolsas/${bolsaId}/retirarPublicacao`,
      {
        token: adminToken,
        esperado: 200,
        descricao: "Administrador retira publicação",
      }
    );

    verificar(
      retirar.dados?.bolsa?.estado === "rascunho",
      "Bolsa volta a rascunho"
    );

    await pedido("GET", `/api/bolsas/${bolsaId}`, {
      esperado: 404,
      descricao: "Bolsa retirada deixa de ser pública",
    });

    await pedido(
      "PATCH",
      `/api/bolsas/${bolsaId}/publicar`,
      {
        token: adminToken,
        esperado: 200,
        descricao: "Administrador publica novamente para concluir teste",
      }
    );
  }

  await pedido("GET", "/api/bolsas/administracao", {
    token: candidateToken,
    esperado: 403,
    descricao: "Candidato não acede à administração das bolsas",
  });

  await pedido("POST", "/api/bolsas", {
    token: adminToken,
    body: {
      titulo: "X",
      descricao: "curta",
      instituicao: "A",
      pais: "A",
      requisitos: "A",
    },
    esperado: 400,
    descricao: "Dados inválidos para criar bolsa são rejeitados",
  });

  // 5. Mentorias: permissões, criação, listagem e edição.

  await pedido("POST", "/api/mentorias", {
    token: candidateToken,
    body: {
      titulo: "Mentoria indevida",
      descricao: "Tentativa de candidato",
      preco: "1000.00",
    },
    esperado: 403,
    descricao: "Candidato não pode criar mentoria",
  });

  const criacaoMentoria = await pedido(
    "POST",
    "/api/mentorias",
    {
      token: mentorToken,
      body: {
        titulo: `Mentoria teste ${marca}`,
        descricao: "Mentoria de teste para verificar o fluxo completo.",
        preco: "15000.00",
      },
      esperado: 201,
      descricao: "Mentor cria mentoria",
    }
  );

  mentoriaId = criacaoMentoria.dados?.mentoria?.id;

  verificar(
    criacaoMentoria.dados?.mentoria?.mentorId === mentorId,
    "Mentoria fica associada ao mentor autenticado"
  );

  verificar(
    criacaoMentoria.dados?.mentoria?.preco === "15000.00",
    "Preço da mentoria é devolvido como texto decimal"
  );

  const listaMentorias = await pedido("GET", "/api/mentorias", {
    esperado: 200,
    descricao: "Visitante lista mentorias ativas",
  });

  verificar(
    Array.isArray(listaMentorias.dados?.mentorias),
    "Listagem de mentorias contém array"
  );

  if (mentoriaId) {
    await pedido("GET", `/api/mentorias/${mentoriaId}`, {
      esperado: 200,
      descricao: "Visitante consulta mentoria ativa",
    });

    await pedido("PATCH", `/api/mentorias/${mentoriaId}`, {
      token: otherMentorToken,
      body: { titulo: "Alteração indevida" },
      esperado: 404,
      descricao: "Outro mentor não pode editar mentoria alheia",
    });

    const editarMentoria = await pedido(
      "PATCH",
      `/api/mentorias/${mentoriaId}`,
      {
        token: mentorToken,
        body: {
          descricao: "Descrição atualizada durante o teste.",
        },
        esperado: 200,
        descricao: "Mentor proprietário edita mentoria",
      }
    );

    verificar(
      editarMentoria.dados?.mentoria?.descricao ===
      "Descrição atualizada durante o teste.",
      "Descrição foi atualizada"
    );
  }

  await pedido("POST", "/api/mentorias", {
    token: mentorToken,
    body: {
      titulo: "Mentoria inválida",
      descricao: "Preço inválido",
      preco: "-10",
    },
    esperado: 400,
    descricao: "Preço negativo é rejeitado",
  });

  // 6. Solicitações e pagamentos.

  if (mentoriaId) {
    const criacaoSolicitacao = await pedido(
      "POST",
      "/api/solicitacoesMentoria",
      {
        token: candidateToken,
        body: { mentoriaId },
        esperado: 201,
        descricao: "Candidato solicita mentoria",
      }
    );

    solicitacaoId = criacaoSolicitacao.dados?.solicitacao?.id;
    pagamentoId = criacaoSolicitacao.dados?.pagamento?.id;

    verificar(
      criacaoSolicitacao.dados?.solicitacao?.estado === "pendente",
      "Solicitação começa pendente"
    );

    verificar(
      criacaoSolicitacao.dados?.pagamento?.estado === "pendente",
      "Pagamento é criado automaticamente como pendente"
    );

    verificar(
      criacaoSolicitacao.dados?.pagamento?.valor === "15000.00",
      "Pagamento guarda o preço da mentoria"
    );

    verificar(
      criacaoSolicitacao.dados?.pagamento?.solicitacaoId === solicitacaoId,
      "Pagamento referencia a solicitação criada"
    );

    await pedido("POST", "/api/solicitacoesMentoria", {
      token: candidateToken,
      body: { mentoriaId },
      esperado: 409,
      descricao: "Solicitação ativa duplicada é rejeitada",
    });

    const minhas = await pedido(
      "GET",
      "/api/solicitacoesMentoria/minhas",
      {
        token: candidateToken,
        esperado: 200,
        descricao: "Candidato consulta as próprias solicitações",
      }
    );

    verificar(
      Array.isArray(minhas.dados?.solicitacoes),
      "Resposta de solicitações contém array"
    );

    verificar(
      minhas.dados?.solicitacoes?.some(
        s => s.id === solicitacaoId
      ),
      "Candidato encontra a sua solicitação"
    );

    const recebidas = await pedido(
      "GET",
      "/api/solicitacoesMentoria/recebidas",
      {
        token: mentorToken,
        esperado: 200,
        descricao: "Mentor consulta solicitações recebidas",
      }
    );

    verificar(
      recebidas.dados?.solicitacoes?.some(
        s => s.id === solicitacaoId
      ),
      "Mentor encontra a solicitação da sua mentoria"
    );

    await pedido(
      "GET",
      "/api/solicitacoesMentoria/minhas",
      {
        token: mentorToken,
        esperado: 403,
        descricao: "Mentor não usa a rota de solicitações de candidato",
      }
    );

    await pedido(
      "GET",
      "/api/solicitacoesMentoria/recebidas",
      {
        token: candidateToken,
        esperado: 403,
        descricao: "Candidato não usa a rota de solicitações recebidas",
      }
    );

    await pedido(
      "PATCH",
      `/api/solicitacoesMentoria/${solicitacaoId}/estado`,
      {
        token: otherMentorToken,
        body: { estado: "aceite" },
        esperado: 403,
        descricao: "Mentor alheio não pode aceitar solicitação",
      }
    );

    await pedido(
      "PATCH",
      `/api/solicitacoesMentoria/${solicitacaoId}/estado`,
      {
        token: candidateToken,
        body: { estado: "aceite" },
        esperado: 403,
        descricao: "Candidato não pode aceitar a própria solicitação",
      }
    );

    const aceitar = await pedido(
      "PATCH",
      `/api/solicitacoesMentoria/${solicitacaoId}/estado`,
      {
        token: mentorToken,
        body: { estado: "aceite" },
        esperado: 200,
        descricao: "Mentor proprietário aceita solicitação",
      }
    );

    verificar(
      aceitar.dados?.solicitacao?.estado === "aceite",
      "Estado passa a aceite"
    );

    await pedido(
      "PATCH",
      `/api/solicitacoesMentoria/${solicitacaoId}/estado`,
      {
        token: mentorToken,
        body: { estado: "recusada" },
        esperado: 409,
        descricao: "Transição de aceite para recusada é rejeitada",
      }
    );

    const pagamentos = await pedido(
      "GET",
      "/api/pagamentos/meus",
      {
        token: candidateToken,
        esperado: 200,
        descricao: "Candidato consulta os próprios pagamentos",
      }
    );

    verificar(
      Array.isArray(pagamentos.dados?.pagamentos),
      "Resposta de pagamentos contém array"
    );

    verificar(
      pagamentos.dados?.pagamentos?.some(
        p => p.id === pagamentoId
      ),
      "Candidato encontra o pagamento criado"
    );

    await pedido("GET", "/api/pagamentos/meus", {
      token: mentorToken,
      esperado: 403,
      descricao: "Mentor não acede à rota de pagamentos do candidato",
    });
  }

  // 7. Verificar persistência dos dados.

  if (bolsaId) {
    const finalBolsa = await pedido(
      "GET",
      `/api/bolsas/${bolsaId}`,
      {
        esperado: 200,
        descricao: "Bolsa publicada continua persistida",
      }
    );

    verificar(
      finalBolsa.dados?.bolsa?.pais === "Portugal",
      "Alteração da bolsa persiste"
    );
  }

  if (mentoriaId) {
    const finalMentoria = await pedido(
      "GET",
      `/api/mentorias/${mentoriaId}`,
      {
        esperado: 200,
        descricao: "Mentoria continua persistida",
      }
    );

    verificar(
      finalMentoria.dados?.mentoria?.id === mentoriaId,
      "Mentoria persiste na base de dados"
    );
  }

  console.log(
    `\nResultado: ${passed} verificações passaram; ` +
    `${failed} falharam.`
  );

  if (failed > 0) {
    process.exitCode = 1;
  } else {
    console.log("TESTE CONCLUÍDO: os fluxos cobertos passaram.");
  }
}

main().catch(erro => {
  console.error("\nExecução interrompida:", erro.message || erro);
  
});

