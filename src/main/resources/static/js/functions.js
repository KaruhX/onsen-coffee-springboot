const showNotification = (message, type = 'success') => {
    alert(message)
}

const updateNavigation = (activeBtn) => {
    const buttons = ['btn-productos', 'btn-login', 'btn-registro']
    buttons.forEach(btn => {
        const $btn = $(`#${btn}`)
        if (btn === activeBtn) {
            $btn.addClass("text-gray-900 font-semibold border-b-2 border-gray-900")
            $btn.removeClass("text-gray-600 font-medium")
        } else {
            $btn.removeClass("text-gray-900 font-semibold border-b-2 border-gray-900")
            $btn.addClass("text-gray-600 font-medium")
        }
    })
}

const comprarCafe = (nombreCafe, idCafe) => {
    if (LOGGED_USER !== "") {
        $.ajax({
            url: `api/cart/add?productId=${idCafe}&quantity=1`,
            method: 'POST',
            contentType: 'application/json',
            success: (data) => {
                const [status, ...messageParts] = data.split(" ")
                const message = messageParts.join(" ")

                if (status === "ok") {
                    alert(`¡${nombreCafe} añadido al carrito!`)
                } else {
                    alert(`Error: ${message}`)
                }
            },
            error: (error) => {
                console.error('Error al agregar al carrito:', error)
                alert('Error al agregar al carrito')
            }
        })
    } else {
        alert('Debes iniciar sesión para comprar')
    }
}

const obtenerCafes = () => {
    const $contenedor = $("#contenedor")
    $contenedor.html(`
        <div class="col-span-full flex items-center justify-center py-20">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-onsen-200 border-t-onsen-600 mx-auto mb-4"></div>
                <p class="text-gray-600 font-medium">Cargando cafés...</p>
            </div>
        </div>
    `)

    $.getJSON("api/coffee/obtain")
        .done((cafes) => {
            if (!cafes || cafes.length === 0) {
                $contenedor.html(`
                    <div class="col-span-full text-center py-20">
                        <div class="text-8xl mb-6">☕</div>
                        <h3 class="text-2xl font-bold text-gray-700 mb-3">No hay cafés disponibles</h3>
                        <p class="text-gray-500">Pronto tendremos nuevos cafés para ti</p>
                    </div>
                `)
                return
            }

            const cafesConVista = cafes.map(cafe => ({
                id: cafe.id,
                coffee_type: cafe.coffee_type,
                price: cafe.price,
                origin: cafe.origin,
                altitude: cafe.altitude,
                description: cafe.description,
                stock: cafe.stock,
                highStock: cafe.stock > 10,
                lowStock: cafe.stock > 0 && cafe.stock <= 10,
                outOfStock: cafe.stock <= 0,
                buttonClass: cafe.stock > 0 ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                buttonText: cafe.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock',
                stars: Array.from({length: 5}, (_, i) => ({
                    class: (i + 1) <= cafe.bitterness_level ? 'bg-gray-900' : 'bg-gray-200'
                }))
            }))

            const html = cafesConVista.map(cafe => Mustache.render(COFFEE_CARD_TEMPLATE, cafe)).join('')
            $contenedor.html(html)
        })
        .fail((error) => {
            console.error('Error:', error)
            $contenedor.html(`
                <div class="col-span-full text-center py-20">
                    <div class="text-8xl mb-6">⚠️</div>
                    <h3 class="text-2xl font-bold text-red-600 mb-3">Error de conexión</h3>
                    <p class="text-gray-600 mb-6">No se pudo conectar con el servidor</p>
                    <button onclick="obtenerCafes()" class="px-6 py-3 bg-onsen-600 text-white rounded-lg hover:bg-onsen-700 transition-colors">
                        Reintentar
                    </button>
                </div>
            `)
        })
}

const mostrarLogin = () => {
    const $contenedor = $("#contenedor")
    $contenedor.removeClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")
    $contenedor.html(LOGIN_TEMPLATE)

    updateNavigation('btn-login')

    $("#login-form").on('submit', (e) => {
        e.preventDefault()

        const email = $("#email").val()
        const password = $("#password").val()

        if (!email || !password) {
            alert('Por favor completa todos los campos')
            return
        }

        $.ajax({
            url: "api/users/login",
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'text',
            data: { mail: email, password: password },
            success: (res) => {
                console.log('Login response:', res);
                const [status, ...messageParts] = res.split(" ")
                const message = messageParts.join(" ")

                if (status === "ok") {
                    LOGGED_USER = message

                    $("#user-info").text(message).removeClass("hidden")
                    $("#btn-login, #btn-registro").addClass('hidden')

                    const $logoutBtn = $(`
                        <a href="#" id="btn-logout" class="inline-flex items-center text-gray-600 hover:text-red-600 pb-1 transition-colors">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Salir
                        </a>
                    `)

                    $logoutBtn.on('click', (e) => {
                        e.preventDefault()
                        cerrarSesion()
                    })

                    $("#user-info").after($logoutBtn)

                    alert(`¡Bienvenido ${message}!`)
                    $("#login-form")[0].reset()

                    $contenedor.addClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")
                    obtenerCafes()
                    updateNavigation('btn-productos')
                } else {
                    alert(message)
                }
            },
            error: (error) => {
                console.error('Error:', error)
                alert('Error al iniciar sesión')
            }
        })
    })
}

const mostrarRegistro = () => {
    const $contenedor = $("#contenedor")
    $contenedor.removeClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")
    $contenedor.html(REGISTER_TEMPLATE)

    updateNavigation('btn-registro')

    $("#register-form").on('submit', (e) => {
        e.preventDefault()

        const nombre = $('input[name="nombre"]').val()
        const email = $('input[name="mail"]').val()
        const password = $('input[name="password"]').val()
        const confirmPassword = $('input[name="confirmPassword"]').val()

        if (!nombre || !email || !password || !confirmPassword) {
            alert('Por favor completa todos los campos')
            return
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden')
            return
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres')
            return
        }

        $.ajax({
            url: "api/users/register",
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'text',
            data: { nombre, mail: email, password },
            success: (res) => {
                console.log('Register response:', res);
                alert(res)
                if (res.toLowerCase().includes('éxito') ||
                    res.toLowerCase().includes('exitoso') ||
                    res.toLowerCase().includes('correctamente')) {
                    $("#register-form")[0].reset()
                    setTimeout(() => mostrarLogin(), 1500)
                }
            },
            error: (error) => {
                console.error('Error:', error)
                alert('Error al registrar usuario')
            }
        })
    })
}

const cerrarSesion = () => {
    LOGGED_USER = ""

    $("#user-info").addClass("hidden").text("")
    $("#btn-logout").remove()
    $("#btn-login, #btn-registro").removeClass('hidden')

    alert('Sesión cerrada correctamente')

    const $contenedor = $("#contenedor")
    $contenedor.addClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")
    obtenerCafes()
    updateNavigation('btn-productos')
}

const mostrarCarrito = () => {
    const $contenedor = $("#contenedor")
    $contenedor.removeClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")

    updateNavigation(null)

    if (LOGGED_USER === "") {
        const data = { notLoggedIn: true }
        $contenedor.html(Mustache.render(CART_TEMPLATE, data))
        return
    }

    $contenedor.html(Mustache.render(CART_TEMPLATE, { loading: true }))

    $.getJSON("api/cart/obtain")
        .done((cartItems) => {
            if (!cartItems || cartItems.length === 0) {
                const data = { emptyCart: true }
                $contenedor.html(Mustache.render(CART_TEMPLATE, data))
                return
            }

            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            const iva = subtotal * 0.21
            const total = subtotal + iva

            const items = cartItems.map(item => ({
                ...item,
                lowStock: item.stock <= 10,
                priceFormatted: item.price.toFixed(2),
                itemTotalFormatted: (item.price * item.quantity).toFixed(2)
            }))

            const data = {
                hasItems: true,
                items,
                subtotalFormatted: subtotal.toFixed(2),
                ivaFormatted: iva.toFixed(2),
                totalFormatted: total.toFixed(2)
            }

            $contenedor.html(Mustache.render(CART_TEMPLATE, data))
        })
        .fail((error) => {
            console.error('Error al cargar el carrito:', error)
            $contenedor.html(`
                <div class="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                    <div class="text-8xl mb-6">⚠️</div>
                    <h3 class="text-2xl font-bold text-red-800 mb-3">Error al cargar el carrito</h3>
                    <p class="text-red-600 mb-6">${error.message || 'Error desconocido'}</p>
                    <button onclick="mostrarCarrito()" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Reintentar
                    </button>
                </div>
            `)
        })
}

const eliminarDelCarrito = (coffeeId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
        return
    }

    $.ajax({
        url: `api/cart/remove?productId=${coffeeId}`,
        method: 'POST',
        success: (data) => {
            alert('Producto eliminado del carrito')
            mostrarCarrito()
        },
        error: (error) => {
            console.error('Error al eliminar del carrito:', error)
            alert('Error al eliminar del carrito')
        }
    })
}

const showCoffeeDetail = (coffeeId) => {
    window.location.href = `/coffee-detail?id=${coffeeId}`
}

const changeDetailImage = (coffeeId, imageNumber) => {
    const imageUrl = `show-image${imageNumber === 1 ? '' : `-${imageNumber}`}?id=${coffeeId}`
    $(`#main-detail-image-${coffeeId}`).attr('src', imageUrl)

    $(`button[onclick*="changeDetailImage(${coffeeId}"]`).each(function(index) {
        if (index + 1 === imageNumber) {
            $(this).removeClass('border-gray-300').addClass('border-onsen-500 ring-2 ring-onsen-200')
        } else {
            $(this).removeClass('border-onsen-500 ring-2 ring-onsen-200').addClass('border-gray-300')
        }
    })
}

const addToCartFromDetail = (coffeeId, coffeeName, price) => {
    if (LOGGED_USER === "") {
        alert('Debes iniciar sesión para agregar productos al carrito')
        return
    }

    $.ajax({
        url: `api/cart/add?productId=${coffeeId}&quantity=1`,
        method: 'POST',
        contentType: 'application/json',
        success: (data) => {
            const [status, ...messageParts] = data.split(" ")
            const message = messageParts.join(" ")

            if (status === "ok") {
                alert(`¡${coffeeName} añadido al carrito!`)
            } else {
                alert(`Error: ${message}`)
            }
        },
        error: (error) => {
            console.error('Error al agregar al carrito:', error)
            alert('Error al agregar al carrito')
        }
    })
}

const setCheckoutLoading = (loading) => {
    const $btn = $('#btn-checkout')
    const $loading = $('#checkout-loading')
    if (loading) {
        $btn.prop('disabled', true).addClass('opacity-60 cursor-not-allowed')
        $loading.removeClass('hidden')
    } else {
        $btn.prop('disabled', false).removeClass('opacity-60 cursor-not-allowed')
        $loading.addClass('hidden')
    }
}

const step1 = () => {
}
const realizarPedido = () => {
    if (LOGGED_USER === "") {
        alert('Debes iniciar sesión para realizar un pedido')
        return
    }

    if (!confirm('¿Deseas confirmar y crear el pedido con los artículos de tu carrito?')) {
        return
    }

    setCheckoutLoading(true)

    $.ajax({
        url: 'api/orders/create',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ note: '', shippingAddress: null }),
        success: (res) => {

            setCheckoutLoading(false)
            if (!res) {
                alert('Respuesta inesperada del servidor al crear el pedido')
                return
            }

            const [status, ...rest] = res.split(' ')
            const message = rest.join(' ')

            if (status === 'ok') {
                alert('Pedido creado correctamente. ' + (message ? (`ID: ${message}`) : ''))

                mostrarCarrito()
            } else {
                alert('Error al crear el pedido: ' + message)
            }
        },
        error: (err) => {
            setCheckoutLoading(false)
            console.error('Error al crear pedido:', err)
            alert('Error al crear el pedido. Intenta de nuevo más tarde.')
        }
    })
}

