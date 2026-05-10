// Estructura de datos
const historialRegistros = [];

// Referencias al DOM
const btnRegistro = document.getElementById('btn-registro');
const btnDashboard = document.getElementById('btn-dashboard');
const vistaRegistro = document.getElementById('vista-registro');
const vistaDashboard = document.getElementById('vista-dashboard');
const form = document.getElementById('form-indicadores');
const filtroMes = document.getElementById('filtro-mes');

// Navegación entre vistas
const cambiarVista = (mostrarRegistro) => {
    if (mostrarRegistro) {
        vistaRegistro.classList.add('active-view');
        vistaRegistro.classList.remove('view');
        vistaDashboard.classList.add('view');
        vistaDashboard.classList.remove('active-view');
        btnRegistro.classList.add('active');
        btnDashboard.classList.remove('active');
    } else {
        vistaDashboard.classList.add('active-view');
        vistaDashboard.classList.remove('view');
        vistaRegistro.classList.add('view');
        vistaRegistro.classList.remove('active-view');
        btnDashboard.classList.add('active');
        btnRegistro.classList.remove('active');
        actualizarDashboard();
    }
};

btnRegistro.addEventListener('click', () => cambiarVista(true));
btnDashboard.addEventListener('click', () => cambiarVista(false));

// Manejo del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoRegistro = {
        id: Date.now(),
        fecha: document.getElementById('fecha').value, // Formato YYYY-MM-DD
        mesero: document.getElementById('mesero').value,
        ventas: parseFloat(document.getElementById('ventas').value),
        encuestas: parseInt(document.getElementById('encuestas').value),
        rotacion: parseInt(document.getElementById('rotacion').value)
    };

    historialRegistros.push(nuevoRegistro);
    form.reset();
    alert('¡Registro guardado con éxito!');
});

// Escuchar cambios en el filtro
filtroMes.addEventListener('change', actualizarDashboard);

// Lógica para procesar los datos
function actualizarDashboard() {
    const mesSeleccionado = filtroMes.value;

    // Filtrar los registros según el mes elegido
    const registrosFiltrados = historialRegistros.filter(reg => {
        if (mesSeleccionado === 'todos') return true;
        const mesDelRegistro = reg.fecha.split('-')[1]; // Extrae el "03", "04", etc.
        return mesDelRegistro === mesSeleccionado;
    });

    const kpiVentas = document.getElementById('kpi-ventas');
    const kpiEncuestas = document.getElementById('kpi-encuestas');
    const kpiRotacion = document.getElementById('kpi-rotacion');
    const lista = document.getElementById('lista-registros');

    // Si no hay registros para ese mes, mostrar todo en 0
    if (registrosFiltrados.length === 0) {
        kpiVentas.innerText = '$0';
        kpiEncuestas.innerText = '0 Encuestas';
        kpiRotacion.innerText = '0 Min';
        lista.innerHTML = '<li>No hay registros para este mes.</li>';
        return;
    }

    // Calcular totales del mes seleccionado
    const totales = registrosFiltrados.reduce((acc, registro) => {
        return {
            ventas: acc.ventas + registro.ventas,
            encuestas: acc.encuestas + registro.encuestas,
            rotacion: acc.rotacion + registro.rotacion
        };
    }, { ventas: 0, encuestas: 0, rotacion: 0 });

    const promedioRotacion = (totales.rotacion / registrosFiltrados.length).toFixed(0);

    // Pintar KPIs en el DOM
    kpiVentas.innerText = `$${totales.ventas.toLocaleString()}`;
    kpiEncuestas.innerText = `${totales.encuestas} Encuestas`;
    kpiRotacion.innerText = `${promedioRotacion} Min`;

    // Pintar el historial
    lista.innerHTML = registrosFiltrados.map(reg => `
        <li>
            <strong>${reg.fecha} - ${reg.mesero}</strong><br>
            Ventas: $${reg.ventas} | Encuestas: ${reg.encuestas} | Rotación: ${reg.rotacion} min
        </li>
    `).join('');
}