function voltarParaInicio() {
  window.location.href = 'inicio.html';
}

function entrarComoUsuario() {
  localStorage.removeItem('admin');
  window.location.href = 'index.html';
}

function entrarComoAdmin() {
  localStorage.setItem('admin', 'true');
  window.location.href = 'admin.html';
}
