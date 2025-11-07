// Validaciones y lógica
function validarFormulario(){
  const nombre = document.getElementById('nombre').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const password = document.getElementById('password').value;
  const acepta = document.getElementById('acepta').checked;

  const regexTelefono = /^\d{3}\s\d{2}\s\d{2}\s\d{2}$/;
  if(!regexTelefono.test(telefono)){
    alert('El formato del teléfono no es válido. Ejemplo: 555 12 34 56');
    return false;
  }
  if(password.length < 8){
    alert('La contraseña debe tener al menos 8 caracteres');
    return false;
  }
  if(!acepta){
    alert('Debe aceptar los términos de protección de datos');
    return false;
  }

  // Si quisieras usar los datos más adelante, podrías guardarlos en localStorage o similar.
  alert('Cuenta creada correctamente. Puedes empezar a agregar libros al pedido.');
  return false; // evita recarga (es un examen)
}

// Calcula total con IVA y muestra en campo resultado
function calcularTotal(){
  const precioInput = document.getElementById('precio');
  const ivaSelect = document.getElementById('iva');
  const resultado = document.getElementById('resultado');

  const precio = parseFloat(precioInput.value);
  const iva = parseFloat(ivaSelect.value);

  if(isNaN(precio) || precio < 0){
    alert('Ingresa un precio válido (número mayor o igual a 0)');
    return;
  }

  const total = precio + precio * iva;
  resultado.value = total.toFixed(2) + ' MXN';
  // pequeño feedback visual
  resultado.style.backgroundColor = '#e6ffee';
  setTimeout(()=> resultado.style.backgroundColor = '', 900);
}

// Array para llevar lista de pedidos
let pedidos = [];

function agregarAlPedido(){
  const libro = document.getElementById('libro').value;
  const precioVal = parseFloat(document.getElementById('precio').value);
  const ivaVal = parseFloat(document.getElementById('iva').value);

  if(!libro){
    alert('Selecciona un libro antes de agregarlo.');
    return;
  }
  if(isNaN(precioVal) || precioVal < 0){
    alert('Ingresa un precio válido antes de agregar.');
    return;
  }

  const total = parseFloat((precioVal + precioVal * ivaVal).toFixed(2));
  const ivaText = (ivaVal === 0.10) ? '10%' : '21%';
  const item = { libro, precio: precioVal.toFixed(2), iva: ivaText, total: total.toFixed(2) };
  pedidos.push(item);
  actualizarTabla();
  limpiarCamposLibro();
}

// Actualiza la tabla y total general
function actualizarTabla(){
  const tbody = document.querySelector('#tablaPedidos tbody');
  tbody.innerHTML = '';

  let suma = 0;
  pedidos.forEach((p, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.libro}</td>
      <td>${p.precio} MXN</td>
      <td>${p.iva}</td>
      <td>${p.total} MXN</td>
      <td><button onclick="quitar(${index})" class="btn small">Quitar</button></td>
    `;
    tbody.appendChild(tr);
    suma += parseFloat(p.total);
  });

  document.getElementById('totalGeneral').textContent = suma.toFixed(2) + ' MXN';
}

// Quitar un item
function quitar(i){
  pedidos.splice(i,1);
  actualizarTabla();
}

// limpia campos de selección de libro (no toca formulario de cuenta)
function limpiarCamposLibro(){
  document.getElementById('libro').value = '';
  document.getElementById('precio').value = '';
  document.getElementById('resultado').value = '';
  document.getElementById('iva').value = '0.21';
}

// pequeñas mejoras visuales para botones de quitar
document.addEventListener('click', function(e){
  if(e.target && e.target.matches('.btn.small')){
    e.target.style.background = '#ff6b6b';
    e.target.style.color = '#fff';
    e.target.style.border = 'none';
    setTimeout(()=>{ if(e.target) e.target.style.background = ''; }, 200);
  }
});