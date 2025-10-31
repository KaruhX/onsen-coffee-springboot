setTimeout(() => {
    obtenerCafes();
}, 500);

// Event listeners para navegación
document.addEventListener('DOMContentLoaded', () => {
    const btnProductos = document.getElementById('btn-productos');
    const btnLogin = document.getElementById('btn-login');
    const btnRegistro = document.getElementById('btn-registro');
    const btnCarrito = document.getElementById('btn-carrito');
    const contenedor = document.getElementById('contenedor');

    if (btnProductos) {
        btnProductos.addEventListener('click', (e) => {
            e.preventDefault();
            contenedor.innerHTML = '<div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-onsen-600"></div></div>';
            contenedor.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8");
            obtenerCafes();

            // Actualizar navegación activa
            btnProductos.classList.add("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnProductos.classList.remove("text-gray-600");
            btnRegistro?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnRegistro?.classList.add("text-gray-600");
            btnLogin?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnLogin?.classList.add("text-gray-600");
        });
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarLogin();

            // Actualizar navegación activa
            btnLogin.classList.add("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnLogin.classList.remove("text-gray-600");
            btnProductos?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnProductos?.classList.add("text-gray-600");
            btnRegistro?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnRegistro?.classList.add("text-gray-600");
        });
    }

    if (btnRegistro) {
        btnRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarRegistro();

            // Actualizar navegación activa
            btnRegistro.classList.add("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnRegistro.classList.remove("text-gray-600");
            btnProductos?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnProductos?.classList.add("text-gray-600");
            btnLogin?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnLogin?.classList.add("text-gray-600");
        });
    }
    if (btnCarrito) {
        btnCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarCarrito();

            // Actualizar navegación activa
            btnCarrito.classList.add("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnCarrito.classList.remove("text-gray-600");
            btnProductos?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnProductos?.classList.add("text-gray-600");
            btnLogin?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnLogin?.classList.add("text-gray-600");
            btnRegistro?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
            btnRegistro?.classList.add("text-gray-600");
        })
    }
});
