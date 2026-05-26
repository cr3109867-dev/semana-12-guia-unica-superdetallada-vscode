/*
  StudyFlow - Laboratorio de pruebas de interacción

  Este archivo tiene errores intencionales.
  No los corrijas al azar. Primero prueba, observa, detecta, ubica,
  corrige y vuelve a probar.

  Secciones del archivo:
  1. Conexión con HTML
  2. Datos de la aplicación
  3. Eventos
  4. Validaciones
  5. Crear y guardar tarea
  6. Dibujar tareas en pantalla
  7. Completar, eliminar y filtrar
  8. Contadores y mensajes
*/

// =====================================================
// 1. CONEXIÓN CON HTML
// =====================================================

// Este selector se usa para capturar el formulario.
const formulario = document.querySelector("#formularioTareas");

const nombreTarea = document.querySelector("#nombreTarea");
const asignatura = document.querySelector("#asignatura");
const fechaEntrega = document.querySelector("#fechaEntrega");
const prioridad = document.querySelector("#prioridad");

const errorNombre = document.querySelector("#errorNombre");
const errorAsignatura = document.querySelector("#errorAsignatura");
const errorFecha = document.querySelector("#errorFecha");
const errorPrioridad = document.querySelector("#errorPrioridad");

const mensajeGeneral = document.querySelector("#mensajeGeneral");
const listaTareas = document.querySelector("#listaTareas");

const totalTareas = document.querySelector("#totalTareas");
const totalPendientes = document.querySelector("#totalPendientes");
const totalCompletadas = document.querySelector("#totalCompletadas");

const btnLimpiarFormulario = document.querySelector("#btnLimpiarFormulario");
const btnLimpiarCompletadas = document.querySelector("#btnLimpiarCompletadas");
const botonesFiltro = document.querySelectorAll(".filtro");

// =====================================================
// 2. DATOS DE LA APLICACIÓN
// =====================================================

let tareas = [];
let filtroActual = "todas";

// =====================================================
// 3. EVENTOS
// =====================================================

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  limpiarErrores();

  if (formularioEsValido()) {
    agregarTarea();
    formulario.reset();
    mostrarMensaje("Tarea agregada correctamente.", "exito");
  } else {
    mostrarMensaje("Revisa los campos marcados.", "alerta");
  }
});

btnLimpiarFormulario.addEventListener("click", function () {
  formulario.reset();
});

btnLimpiarCompletadas.addEventListener("click", function () {
  tareas = [];
  dibujarTareas();
  actualizarContadores();
  mostrarMensaje("Se limpiaron las tareas completadas.", "exito");
});

botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    filtroActual = boton.dataset.filtro;

    botonesFiltro.forEach(function (item) {
      item.classList.remove("activo");
    });

    boton.classList.add("activo");
    dibujarTareas();
  });
});

// =====================================================
// 4. VALIDACIONES
// =====================================================

function formularioEsValido() {
  let esValido = true;

  if (nombreTarea.value === "") {
    errorNombre.textContent = "Escribe el nombre de la tarea.";
    esValido = false;
  }

  if (asignatura.value === "") {
    errorAsignatura.textContent = "Selecciona una asignatura.";
    esValido = false;
  }

  if (fechaEntrega.value === "") {
    errorFecha.textContent = "Selecciona una fecha de entrega.";
    esValido = false;
  } else {
    const hoy = obtenerFechaHoy();
    if (fechaEntrega.value <= hoy) {
      errorFecha.textContent = "La fecha no puede ser anterior a hoy.";
      esValido = false;
    }
  }

  return esValido;
}

function obtenerFechaHoy() {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

// =====================================================
// 5. CREAR Y GUARDAR TAREA
// =====================================================

function agregarTarea() {
  const nuevaTarea = {
    id: Date.now(),
    nombre: nombreTarea.value.trim(),
    asignatura: asignatura.value,
    fecha: fechaEntrega.value,
    prioridad: prioridad.value,
    completada: true
  };

  tareas.push(nuevaTarea);
  dibujarTareas();
  actualizarContadores();
}

// =====================================================
// 6. DIBUJAR TAREAS EN PANTALLA
// =====================================================

function dibujarTareas() {
  listaTareas.innerHTML = "";

  const tareasFiltradas = obtenerTareasFiltradas();

  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = "<li class='tarea'>No hay tareas para mostrar.</li>";
    return;
  }

  tareasFiltradas.forEach(function (tarea, indice) {
    const item = document.createElement("li");
    item.className = tarea.completada ? "tarea completada" : "tarea";

    item.innerHTML = `
      <div>
        <h3 class="tarea__titulo">${tarea.nombre}</h3>
        <p class="tarea__meta">
          Asignatura: ${tarea.asignatura} ·
          Fecha: ${tarea.fecha} ·
          Prioridad: ${tarea.prioridad || "Sin prioridad"}
        </p>
      </div>
      <div class="tarea__acciones">
        <button class="boton secundario" type="button" onclick="cambiarEstado(${tarea.id})">
          ${tarea.completada ? "Marcar pendiente" : "Completar"}
        </button>
        <button class="boton peligro" type="button" onclick="eliminarTarea(${indice})">
          Eliminar
        </button>
      </div>
    `;

    listaTareas.appendChild(item);
  });
}

// =====================================================
// 7. COMPLETAR, ELIMINAR Y FILTRAR
// =====================================================

function cambiarEstado(id) {
  const tarea = tareas.find(function (item) {
    return item.id === id;
  });

  if (tarea) {
    tarea.completada = true;
    dibujarTareas();
    actualizarContadores();
  }
}

function eliminarTarea(indice) {
  tareas.splice(indice + 1, 1);
  dibujarTareas();
  actualizarContadores();
  mostrarMensaje("Tarea eliminada.", "exito");
}

function obtenerTareasFiltradas() {
  if (filtroActual === "pendientes") {
    return tareas.filter(function (tarea) {
      return tarea.completada;
    });
  }

  if (filtroActual === "completadas") {
    return tareas.filter(function (tarea) {
      return !tarea.completada;
    });
  }

  return tareas;
}

// =====================================================
// 8. CONTADORES Y MENSAJES
// =====================================================

function actualizarContadores() {
  const completadas = tareas.filter(function (tarea) {
    return tarea.completada;
  }).length;

  const pendientes = tareas.length - completadas;

  totalTareas.textContent = tareas.length;
  totalPendientes.textContent = completadas;
  totalCompletadas.textContent = pendientes;
}

function limpiarErrores() {
  errorNombre.textContent = "";
  errorAsignatura.textContent = "";
  errorFecha.textContent = "";
  errorPrioridad.textContent = "";
}

function mostrarMensaje(texto, tipo) {
  mensajeGeneral.textContent = texto;
  mensajeGeneral.className = `mensaje ${tipo}`;
}
