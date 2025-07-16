// Carrega comunicados e problemas ao iniciar
function carregarTudo() {
  carregarComunicados();
  carregarProblemas();
}

// Salva um novo comunicado (texto + imagem opcional)
function salvarNoticia() {
  const texto = document.getElementById("campo-noticia").value.trim();
  const file = document.getElementById("imagem-noticia").files[0];

  if (!texto && !file) {
    alert("Por favor, escreva uma mensagem ou envie uma imagem.");
    return;
  }

  const comunicados = JSON.parse(localStorage.getItem("mt_comunicados") || "[]");
  const novoComunicado = { texto, data: new Date().toISOString(), imagem: "" };

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      novoComunicado.imagem = e.target.result;
      comunicados.unshift(novoComunicado);
      localStorage.setItem("mt_comunicados", JSON.stringify(comunicados));
      carregarComunicados();
    };
    reader.readAsDataURL(file);
  } else {
    comunicados.unshift(novoComunicado);
    localStorage.setItem("mt_comunicados", JSON.stringify(comunicados));
    carregarComunicados();
  }

  // Limpa campos
  document.getElementById("campo-noticia").value = "";
  document.getElementById("imagem-noticia").value = "";
  alert("Comunicado salvo com sucesso!");
}

// Exibe comunicados no container "lista-comunicados"
function carregarComunicados() {
  const comunicados = JSON.parse(localStorage.getItem("mt_comunicados") || "[]");
  const container = document.getElementById("lista-comunicados");
  container.innerHTML = "";

  if (comunicados.length === 0) {
    container.innerHTML = `<p class="text-muted">Nenhum comunicado foi publicado ainda.</p>`;
    return;
  }

  comunicados.forEach((c, i) => {
    const dataFormatada = new Date(c.data).toLocaleString('pt-BR');
    container.innerHTML += `
      <div class="mb-3 p-3 border rounded bg-light position-relative">
        <small class="text-muted">Publicado em: ${dataFormatada}</small>
        <p class="mt-2 mb-1">${c.texto || ''}</p>
        ${c.imagem ? `<img src="${c.imagem}" class="noticia-img" alt="Imagem do comunicado">` : ''}
        <div class="mt-2">
          ${c.imagem ? `<button class="btn btn-sm btn-outline-danger me-2" onclick="removerImagemNoticia(${i})">Remover imagem</button>` : ''}
          <button class="btn btn-sm btn-danger" onclick="excluirComunicado(${i})">Excluir comunicado</button>
        </div>
      </div>
    `;
  });
}

// Remove imagem de um comunicado específico
function removerImagemNoticia(index) {
  const comunicados = JSON.parse(localStorage.getItem("mt_comunicados") || "[]");
  if (comunicados[index]) {
    comunicados[index].imagem = "";
    localStorage.setItem("mt_comunicados", JSON.stringify(comunicados));
    carregarComunicados();
  }
}

// Exclui um comunicado do storage
function excluirComunicado(index) {
  if (confirm("Tem certeza que deseja excluir este comunicado?")) {
    const comunicados = JSON.parse(localStorage.getItem("mt_comunicados") || "[]");
    comunicados.splice(index, 1);
    localStorage.setItem("mt_comunicados", JSON.stringify(comunicados));
    carregarComunicados();
  }
}

// Apaga todos os comunicados
function apagarTodosComunicados() {
  if (confirm("Deseja apagar todos os comunicados?")) {
    localStorage.removeItem("mt_comunicados");
    carregarComunicados();
  }
}

// Carrega problemas registrados e exibe no painel
function carregarProblemas() {
  const lista = document.getElementById('painel-list');
  const filtro = document.getElementById('filtro-status') ? document.getElementById('filtro-status').value : 'todos';
  const problemas = JSON.parse(localStorage.getItem('mt_problemas') || '[]');
  lista.innerHTML = '';

  problemas.forEach((p, i) => {
    if (filtro !== 'todos' && p.status !== filtro) return;
    const dataFormatada = p.data ? new Date(p.data).toLocaleString('pt-BR') : 'Data não disponível';

    const statusSelect = `
      <select class="form-select mt-2" onchange="atualizarStatus(${i}, this.value)">
        <option value="grave" ${p.status === 'grave' ? 'selected' : ''}>Grave</option>
        <option value="urgente" ${p.status === 'urgente' ? 'selected' : ''}>Urgente</option>
        <option value="andamento" ${p.status === 'andamento' ? 'selected' : ''}>Em andamento</option>
        <option value="resolvido" ${p.status === 'resolvido' ? 'selected' : ''}>Resolvido</option>
        <option value="pendente" ${p.status === 'pendente' ? 'selected' : ''}>Pendente</option>
      </select>`;

    lista.innerHTML += `
      <li class="col-md-6 col-lg-4 d-flex">
        <div class="card-problema w-100">
          <h5 class="mb-1">${p.nome} <small class="text-muted">(${p.depto || 'sem setor'})</small></h5>
          <p class="mb-1">${p.desc}</p>
          <p class="text-muted">Enviado em: ${dataFormatada}</p>
          <span class="badge bg-secondary">Status: ${p.status || 'pendente'}</span>
          ${p.img ? `
            <div>
              <img src="${p.img}" class="img-fluid mt-3 rounded" alt="Imagem">
              <button class="btn btn-sm btn-danger mt-2" onclick="removerImagem(${i})">Remover imagem</button>
            </div>` : ''}
          ${statusSelect}
          <button class="btn btn-sm btn-outline-danger mt-2" onclick="excluirProblema(${i})">Excluir problema</button>
        </div>
      </li>`;
  });
}

// Atualiza status do problema e salva no localStorage
function atualizarStatus(index, novoStatus) {
  const problemas = JSON.parse(localStorage.getItem('mt_problemas') || '[]');
  problemas[index].status = novoStatus;
  localStorage.setItem('mt_problemas', JSON.stringify(problemas));
  carregarProblemas();
}

// Remove imagem de um problema
function removerImagem(index) {
  const problemas = JSON.parse(localStorage.getItem('mt_problemas') || '[]');
  if (problemas[index] && problemas[index].img) {
    problemas[index].img = '';
    localStorage.setItem('mt_problemas', JSON.stringify(problemas));
    carregarProblemas();
    alert("Imagem removida com sucesso!");
  }
}

// Exclui um problema do storage
function excluirProblema(index) {
  if (confirm("Tem certeza que deseja excluir este problema?")) {
    let problemas = JSON.parse(localStorage.getItem('mt_problemas') || '[]');
    problemas.splice(index, 1);
    localStorage.setItem('mt_problemas', JSON.stringify(problemas));
    carregarProblemas();
    alert("Problema excluído com sucesso!");
  }
}

// Exibe imagem ampliada
function abrirModalImagem(src) {
  const modal = document.getElementById("modal-imagem");
  const imagem = document.getElementById("imagem-ampliada");
  imagem.src = src;
  modal.style.display = "flex";
}

// Fecha o modal ao clicar fora da imagem
function fecharModalImagem() {
  document.getElementById("modal-imagem").style.display = "none";
}

// Evento: ao clicar em uma imagem de problema
document.addEventListener("click", function (e) {
  if (e.target.tagName === "IMG" && e.target.closest(".card-problema")) {
    abrirModalImagem(e.target.src);
  }
});
