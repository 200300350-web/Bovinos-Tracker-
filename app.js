// 1. CARGAR DATOS: Buscar en localStorage o iniciar vacío
const historialRegistros = JSON.parse(localStorage.getItem('bovinos_data')) || [];

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
        fecha: document.getElementById('fecha').value,
        mesero: document.getElementById('mesero').value,
        ventas: parseFloat(document.getElementById('ventas').value),
        encuestas: parseInt(document.getElementById('encuestas').value),
        rotacion: parseInt(document.getElementById('rotacion').value)
    };

    historialRegistros.push(nuevoRegistro);
    
    // 2. GUARDAR DATOS: Guardar permanentemente en el navegador
    localStorage.setItem('bovinos_data', JSON.stringify(historialRegistros));
    
    form.reset();
    alert('¡Registro guardado permanentemente!');
});

// Escuchar cambios en el filtro
filtroMes.addEventListener('change', actualizarDashboard);

// Lógica para procesar los datos
function actualizarDashboard() {
    const mesSeleccionado = filtroMes.value;

    const registrosFiltrados = historialRegistros.filter(reg => {
        if (mesSeleccionado === 'todos') return true;
        
        const fechaObj = new Date(reg.fecha + 'T00:00:00'); 
        let mesDelRegistro = (fechaObj.getMonth() + 1).toString();
        if (mesDelRegistro.length === 1) mesDelRegistro = '0' + mesDelRegistro; 

        return mesDelRegistro === mesSeleccionado;
    });

    const kpiVentas = document.getElementById('kpi-ventas');
    const kpiEncuestas = document.getElementById('kpi-encuestas');
    const kpiRotacion = document.getElementById('kpi-rotacion');
    const lista = document.getElementById('lista-registros');

    if (registrosFiltrados.length === 0) {
        kpiVentas.innerText = '$0';
        kpiEncuestas.innerText = '0 Encuestas';
        kpiRotacion.innerText = '0 Min';
        lista.innerHTML = '<li>No hay registros para este mes.</li>';
        return;
    }

    const totales = registrosFiltrados.reduce((acc, registro) => {
        return {
            ventas: acc.ventas + registro.ventas,
            encuestas: acc.encuestas + registro.encuestas,
            rotacion: acc.rotacion + registro.rotacion
        };
    }, { ventas: 0, encuestas: 0, rotacion: 0 });

    const promedioRotacion = (totales.rotacion / registrosFiltrados.length).toFixed(0);

    kpiVentas.innerText = `$${totales.ventas.toLocaleString()}`;
    kpiEncuestas.innerText = `${totales.encuestas} Encuestas`;
    kpiRotacion.innerText = `${promedioRotacion} Min`;

    lista.innerHTML = registrosFiltrados.map(reg => `
        <li>
            <strong>${reg.fecha} - ${reg.mesero}</strong><br>
            Ventas: $${reg.ventas} | Encuestas: ${reg.encuestas} | Rotación: ${reg.rotacion} min
        </li>
    `).join('');
}

// 3. INICIALIZAR: Mostrar datos previos al abrir la app
actualizarDashboard();