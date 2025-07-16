const form = document.getElementById('problem-form');
const painel = document.getElementById('painel-list');
const imgPreview = document.getElementById('img-preview');

// Define a cor da badge de status
function statusBadgeClass(status) {
  switch (status) {
    case 'urgente': return 'danger';
    case 'andamento': return 'info';
    case 'resolvido': return 'success';
    case 'pendente':
    default: return 'secondary';
  }
}

// Carrega os problemas do localStorage
function carregarProblemas() {
  const problemas = JSON.parse(localStorage.getItem('mt_problemas') || '[]');
  painel.innerHTML = '';

  problemas.forEach((p) => {
    const badgeClass = statusBadgeClass(p.status);
    const li = document.createElement('li');
    li.className = 'col-md-6 mb-3';
    li.innerHTML = `
      <div class="card-problema p-3 bg-white rounded shadow-sm">
        <h5>${p.nome} <small class="text-muted">(${p.depto || 'departamento não informado'})</small></h5>
        <p>${p.desc}</p>
        ${p.img ? `<img src="${p.img}" class="img-fluid rounded mt-2 mb-2" alt="Imagem Anexada">` : ''}
        <div>
          <span class="badge bg-${badgeClass}">${p.status || 'pendente'}</span>
        </div>
      </div>
    `;
    painel.appendChild(li);
  });
}

// Envia novo problema
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('input-nome').value.trim();
  const depto = document.getElementById('input-depto').value.trim();
  const desc = document.getElementById('input-desc').value.trim();
  const imgInput = document.getElementById('input-img');

  if (!nome || !depto || !desc) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    let problemas = JSON.parse(localStorage.getItem('mt_problemas') || '[]');
    problemas.push({
      nome,
      depto,
      desc,
      status: 'pendente',
      img: reader.result || ''
    });
    localStorage.setItem('mt_problemas', JSON.stringify(problemas));
    form.reset();
    imgPreview.src = '';
    carregarProblemas();
    alert('Problema registrado com sucesso!');
  };

  if (imgInput.files.length > 0) {
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    reader.onload();
  }
});

// Mostra preview da imagem antes de enviar
document.getElementById('input-img').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function () {
      imgPreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    imgPreview.src = '';
  }
});

// Carrega todos os comunicados do admin
function carregarComunicadosFuncionario() {
  const comunicados = JSON.parse(localStorage.getItem("mt_comunicados") || "[]");
  const container = document.getElementById("comunicados-funcionario");
  container.innerHTML = "<h3>Comunicados do Administrador</h3>";

  if (comunicados.length === 0) {
    container.innerHTML += `<p class="text-muted">Nenhum comunicado disponível.</p>`;
    return;
  }

  comunicados.forEach((c) => {
    const dataFormatada = new Date(c.data).toLocaleString('pt-BR');
    const div = document.createElement("div");
    div.className = "mb-3 p-3 border rounded bg-light shadow-sm";

    div.innerHTML = `
      <small class="text-muted">Publicado em: ${dataFormatada}</small>
      <p class="mt-2 mb-1">${c.texto || ''}</p>
      ${c.imagem ? `<img src="${c.imagem}" alt="Imagem do comunicado" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">` : ''}
    `;
    container.appendChild(div);
  });
}

// Atualiza a página quando dados forem modificados em outra aba
window.addEventListener('storage', function(event) {
  if (event.key === 'mt_comunicados') {
    carregarComunicadosFuncionario();
  }
  if (event.key === 'mt_problemas') {
    carregarProblemas();
  }
});

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  carregarComunicadosFuncionario();
  carregarProblemas();
});

// Clique na imagem para abrir em tela cheia
document.addEventListener('click', function (e) {
  if (e.target && e.target.tagName === 'IMG' && e.target.closest('.card-problema')) {
    abrirImagem(e.target);
  }
});

function abrirImagem(img) {
  const modal = document.getElementById('imagemModal');
  const imgExpandida = document.getElementById('imagemExpandida');
  modal.style.display = 'block';
  imgExpandida.src = img.src;
}

function fecharImagem() {
  document.getElementById('imagemModal').style.display = 'none';
}
