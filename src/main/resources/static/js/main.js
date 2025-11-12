setTimeout(() => {
    obtenerCafes()
}, 500)

document.addEventListener('DOMContentLoaded', () => {
    const $btnProductos = $('#btn-productos')
    const $btnLogin = $('#btn-login')
    const $btnRegistro = $('#btn-registro')
    const $btnCarrito = $('#btn-carrito')
    const $contenedor = $('#contenedor')

    if ($btnProductos.length) {
        $btnProductos.on('click', (e) => {
            e.preventDefault()
            $contenedor.html('<div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-onsen-600"></div></div>')
            $contenedor.addClass("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8")
            obtenerCafes()
            updateNavigation('btn-productos')
        })
    }

    if ($btnLogin.length) {
        $btnLogin.on('click', (e) => {
            e.preventDefault()
            mostrarLogin()
        })
    }

    if ($btnRegistro.length) {
        $btnRegistro.on('click', (e) => {
            e.preventDefault()
            mostrarRegistro()
        })
    }

    if ($btnCarrito.length) {
        $btnCarrito.on('click', (e) => {
            e.preventDefault()
            mostrarCarrito()
        })
    }
})

