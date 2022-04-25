import { escuelas } from '../buscador/db.js';

//Formulario principal
const formularioPrincipal = document.getElementById('miForm'); // seleccionamos por id
// Formulario por Categorías
const formulario = document.getElementById('formulario'); // seleccionamos por id
// Contenedor de los Resultados de Búsqueda
const contenedorBusqueda = document.querySelector('.contenedorBusqueda'); // seleccionamos por clase
// Contenedor para mostrar las categorías
const contenedorCategoria = document.querySelector('.mostrarCategoria');


eventListeners(); // Guardo todos los eventos
function eventListeners() {
  formularioPrincipal.addEventListener('submit', filtrarCursos);
  formulario.addEventListener('submit', validarInputCategorias);
  formulario.addEventListener('keyup', validarInputCategorias);
}
// Buscar Cursos
function filtrarCursos(e) { // Filtramos cursos según búsqueda
  e.preventDefault(); // Evitamos el enviado por defecto de submit
  let cursosExistentes = []

  const buscar = document.getElementById('search-form-widget').value; // obtenemos valor de input
  if(buscar === '') { // Validamos que el campo no este vacío
    mensajeError('Agrega un término de búsqueda'); // creamos una function para los errores
  } else {
    let successBuscar = buscar.toLowerCase(); // convertinos a minúsculas las palabras
    let busqueda = escuelas.flatMap(item => item.cursos);
    // segun lo que el usuario escriba filtramos con la propiedad -> usuario db.js
    let cursosExistente = busqueda.filter(curso => curso.usuario.toLowerCase().includes(successBuscar));
    cursosExistentes = [...cursosExistente]
    // insertamos los valores en nuestro Html
    insertarHTML(cursosExistentes);
  }
}
// Obtenemos el valor del input y validamos
function validarInputCategorias(e) {
  e.preventDefault();
  const buscar = document.getElementById('inputBusqueda').value;

  if(buscar === '') { // Validamos que el campo no este vacío
    mensajeError('Agrega una Categoría'); // creamos una function para los errores
    const parrafo = document.querySelector('.mostrarCategoria');
    clearHTML(parrafo); // limpiamos parrafo
    clearHTML(contenedorBusqueda); // limpiamos contenedor de búsqueda;
  } else {
    let successBuscar = buscar.toLowerCase(); // Convertimos todo a minúscula
    categorias(successBuscar); // mandamos los datos para filtrar por categoría
  }
}
// Buscar por categorías
function categorias(buscar) {
  // guardamos el filtrado de las categorías
  let categorias = escuelas.filter(category => category.categoria.toLowerCase().includes(buscar));
  mostrarCategoria(categorias) // agregamos al html las categorias
}
function mostrarCategoria(categorias) {
  //Limpiamos el contenedor para las categorias, evitando duplicados
  clearHTML(contenedorCategoria);
  // Recorremos los datos
  categorias.forEach(category => {
    const parrafo = document.createElement('p'); // creamos un párrafo para mostrar las categorías
    parrafo.innerHTML += `Categoría: ${category.categoria}`; // += hace como una suma parr obtener todas las categorias
    parrafo.id = category.id;
    parrafo.onclick = () => {
      escuelas.forEach(curso => {
        if(parrafo.id == curso.id) {
          insertarHTML(curso.cursos); // le pasamos el valor y agregamos al html
        } else {
          return;
        }
      });
    }
    contenedorCategoria.appendChild(parrafo); // lo agregamos al contenedor
  });
}
// Función para insertar en el HTML
function insertarHTML(datos) { // datos, es el valor que recibimos de las diferentes búsquedas
  //Limpiar HTML
  clearHTML(contenedorBusqueda); // para que no haya contenido duplicado cada que se busque
  // Recorremos los datos
  datos.forEach(dato => {
    const { nombre, precio, imagen, link } = dato;
    // creamos una card
    const card = document.createElement('div'); // y mas abajo aplicamos un poco de scripting
    card.classList.add('card');
    card.onmouseover = () => { // al sacar el mouse limpiamos el contenedor de la categoría
      const parrafo = document.querySelector('.mostrarCategoria');
      clearHTML(parrafo);
    }
    card.innerHTML = `
    <a href="${link}">
    <img src="./buscador/img/${imagen}.jpg">
    <div class="contenedor_card">
      <p>${nombre}</p>
      <p><span>Precio</span>: $${precio}</p>
    </div>
    </a>  
    `;
    contenedorBusqueda.appendChild(card); // los agregamos al contenedor
  });
}
// Mensaje de Error -> se lo muestra o no en el html (opcional)
function mensajeError(error) {
  console.log(error) // lo que desees agregar
}
// Limpiar nuestro HTML
function clearHTML(clear) { // clear es el argumento que pasaremos para limpiar y hacerlo dinámico
  while(clear.firstChild) { // mientras exista algo dentro del contenedor, lo eliminamos y agregamos lo nuevo
    clear.removeChild(clear.firstChild);
  }
}

