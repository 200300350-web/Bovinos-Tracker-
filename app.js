// Estructura de datos: Array para guardar los objetos de registro
const historialRegistros = [];

// Referencias al DOM
const btnRegistro = document.getElementById('btn-registro');
const btnDashboard = document.getElementById('btn-dashboard');
const vistaRegistro = document.getElementById('vista-registro');
const vistaDashboard = document.getElementById('vista-dashboard');
const form = document.getElementById('form-indicadores');

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

    // Crear objeto con los datos del formulario usando ES6
    const nuevoRegistro = {
        id: Date.now(),
        mesero: document.getElementById('mesero').value,
        ventas: parseFloat(document.getElementById('ventas').value),
        encuestas: parseInt(document.getElementById('encuestas').value),
        rotacion: parseInt(document.getElementById('rotacion').value),
        fecha: new Date().toLocaleDateString()
    };

    // Agregar al array
    historialRegistros.push(nuevoRegistro);
    
    // Limpiar formulario y dar feedback
    form.reset();
    alert('¡Registro guardado con éxito!');
});

// Lógica para procesar los datos y actualizar el Dashboard
const actualizarDashboard = () => {
    if (historialRegistros.length === 0) return;

    // Uso de métodos de arrays (reduce) para optimizar el cálculo de totales
    const totales = historialRegistros.reduce((acc, registro) => {
        return {
            ventas: acc.ventas + registro.ventas,
            encuestas: acc.encuestas + registro.encuestas,
            rotacion: acc.rotacion + registro.rotacion
        };
    }, { ventas: 0, encuestas: 0, rotacion: 0 });

    const promedioRotacion = (totales.rotacion / historialRegistros.length).toFixed(0);

    // Pintar KPIs en el DOM
    document.getElementById('kpi-ventas').innerText = `$${totales.ventas.toLocaleString()}`;
    document.getElementById('kpi-encuestas').innerText = totales.encuestas;
    document.getElementById('kpi-rotacion').innerText = `${promedioRotacion} Min`;

    // Pintar el historial mapeando el array
    const lista = document.getElementById('lista-registros');
    lista.innerHTML = historialRegistros.map(reg => `
        <li>
            <strong>${reg.fecha} - ${reg.mesero}</strong><br>
            Ventas: $${reg.ventas} | Encuestas: ${reg.encuestas} | Rotación: ${reg.rotacion} min
        </li>
    `).join('');
};
// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito: ', registration.scope);
            })
            .catch(err => {
                console.log('Fallo en el registro del ServiceWorker: ', err);
            });
    });
}