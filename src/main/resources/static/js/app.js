const AppState = {
    templates: {
        coffeeCard: "",
        coffeeDetail: "",
        register: "",
        login: "",
        cart: ""
    },
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },
    setCookie(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },
    isUserLoggedIn() {
        return this.getCookie('loggedUser') !== null && this.getCookie('loggedUser') !== "";
    },
    setUser(username) {
        this.setCookie('loggedUserName', username, 7);
    },
    clearUser() {
        this.deleteCookie('loggedUser');
        this.deleteCookie('loggedUserName');
    },
    getUser() {
        return this.getCookie('loggedUserName') || "";
    }
}
const Utils = {
    showNotification(message, type = 'success') {
        const colors = {
            success: {
                bg: 'bg-primary-600',
                icon: '✓',
                iconBg: 'bg-white/20'
            },
            error: {
                bg: 'bg-red-600',
                icon: '✕',
                iconBg: 'bg-white/20'
            },
            warning: {
                bg: 'bg-amber-600',
                icon: '⚠',
                iconBg: 'bg-white/20'
            },
            info: {
                bg: 'bg-blue-600',
                icon: 'ℹ',
                iconBg: 'bg-white/20'
            }
        }
        const config = colors[type] || colors.success
        const notificationId = `notification-${Date.now()}`
        const $notification = $(`
            <div id="${notificationId}" class="transform translate-y-2 opacity-0 transition-all duration-300 mb-3">
                <div class="${config.bg} text-white rounded-lg shadow-2xl overflow-hidden">
                    <div class="flex items-center px-4 py-3 space-x-3">
                        <div class="${config.iconBg} rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <span class="text-white text-lg font-bold">${config.icon}</span>
                        </div>
                        <div class="flex-1 font-medium text-sm">
                            ${message}
                        </div>
                        <button onclick="Utils.closeNotification('${notificationId}')" 
                                class="text-white hover:bg-white/20 rounded p-1 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `)
        let $container = $('#notification-container')
        if (!$container.length) {
            $container = $('<div id="notification-container" class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end max-w-md"></div>')
            $('body').append($container)
        }
        $container.append($notification)
        requestAnimationFrame(() => {
            $notification.removeClass('translate-y-2 opacity-0')
        })
        setTimeout(() => {
            this.closeNotification(notificationId)
        }, 4000)
    },
    closeNotification(notificationId) {
        const $notification = $(`#${notificationId}`)
        if ($notification.length) {
            $notification.addClass('translate-y-2 opacity-0')
            setTimeout(() => {
                $notification.remove()
            }, 300)
        }
    },
    updateCartCount() {
        if (!AppState.isUserLoggedIn()) {
            $('#cart-count').text('0');
            return;
        }
        $.getJSON("api/cart/obtain")
            .done((cartItems) => {
                const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
                $('#cart-count').text(totalItems);
            })
            .fail(() => {
                $('#cart-count').text('0');
            });
    },
    showLoader($container) {
        $container.html(`
            <div class="flex items-center justify-center py-20">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600 mx-auto"></div>
                </div>
            </div>
        `)
    },
    showError($container, message) {
        $container.html(`
            <div class="col-span-full text-center py-16">
                <h3 class="text-xl font-medium text-red-600 mb-2">Error</h3>
                <p class="text-gray-600">${message}</p>
            </div>
        `)
    },
    updateNavigation(activeBtn) {
        const buttons = ['btn-login', 'btn-registro']
        buttons.forEach(btn => {
            const $btn = $(`#${btn}`)
            if ($btn.length) {
                if (btn === activeBtn) {
                    $btn.addClass("text-gray-900 font-semibold border-b-2 border-gray-900")
                    $btn.removeClass("text-gray-600")
                } else {
                    $btn.removeClass("text-gray-900 font-semibold border-b-2 border-gray-900")
                    $btn.addClass("text-gray-600")
                }
            }
        })
    }
}
const ProductsModule = {
    loadProducts() {
        const $contenedor = $("#contenedor")
        $contenedor.addClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")
        Utils.showLoader($contenedor)
        $.getJSON("api/coffee/obtain")
            .done((cafes) => {
                if (!cafes || cafes.length === 0) {
                    const noCoffeesTitle = (LANG === '_en') ? 'No coffees available' : 'No hay cafés disponibles';
                    const noCoffeesDesc = (LANG === '_en') ? 'We will soon have new coffees for you' : 'Pronto tendremos nuevos cafés para ti';
                    $contenedor.html(`
                        <div class="col-span-full text-center py-16">
                            <div class="text-6xl text-gray-300 mb-6">☕</div>
                            <h3 class="text-xl font-medium text-gray-600 mb-2">${noCoffeesTitle}</h3>
                            <p class="text-gray-500">${noCoffeesDesc}</p>
                        </div>
                    `)
                    return
                }
                let addToCart = (LANG  === '_en') ? 'Add to Cart' : 'Añadir al Carrito';
                let outOfStockText = (LANG  === '_en') ? 'Out of Stock' : 'Sin Stock';
                const cafesConVista = cafes.map(cafe => ({
                    id: cafe.id,
                    coffee_type: cafe.coffee_type,
                    price: cafe.price,
                    origin: cafe.origin,
                    altitude: cafe.altitude,
                    description: cafe.description,
                    stock: cafe.stock,
                    bitterness: cafe.bitterness_level,
                    bitterness_percentage: (cafe.bitterness_level / 5) * 100,
                    highStock: cafe.stock > 10,
                    lowStock: cafe.stock > 0 && cafe.stock <= 10,
                    outOfStock: cafe.stock <= 0,
                    buttonClass: cafe.stock > 0 ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                    buttonText: cafe.stock > 0 ? addToCart : outOfStockText
                }))
                const html = cafesConVista.map(cafe =>
                    Mustache.render(AppState.templates.coffeeCard, cafe)
                ).join('')
                $contenedor.html(html)
            })
            .fail((error) => {
                console.error('Error:', error)
                Utils.showError($contenedor, 'No se pudo conectar con el servidor')
            })
    },
    addToCart(nombreCafe, idCafe) {
        const loginRequired = (LANG === '_en') ? 'You must log in to purchase' : 'Debes iniciar sesión para comprar';
        const addedToCart = (LANG === '_en') ? 'added to cart!' : 'añadido al carrito!';
        const errorAdding = (LANG === '_en') ? 'Error adding to cart' : 'Error al agregar al carrito';

        if (!AppState.isUserLoggedIn()) {
            Utils.showNotification(loginRequired, 'error')
            return
        }
        $.ajax({
            url: `api/cart/add?productId=${idCafe}&quantity=1`,
            method: 'POST',
            contentType: 'application/json',
            success: (data) => {
                const [status, ...messageParts] = data.split(" ")
                const message = messageParts.join(" ")
                if (status === "ok") {
                    Utils.showNotification(`¡${nombreCafe} ${addedToCart}`, 'success')
                    Utils.updateCartCount()
                } else {
                    Utils.showNotification(`Error: ${message}`, 'error')
                }
            },
            error: (error) => {
                console.error('Error al agregar al carrito:', error)
                Utils.showNotification(errorAdding, 'error')
            }
        })
    }
}
const AuthModule = {
    showLogin() {
        const $contenedor = $("#contenedor")
        $contenedor.removeClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")
        $contenedor.html(AppState.templates.login)
        Utils.updateNavigation('btn-login')
        $("#login-form").on('submit', (e) => {
            e.preventDefault()
            this.handleLogin()
        })
        $("#btn-registro-link").on('click', (e) => {
            e.preventDefault()
            this.showRegister()
        })
    },
    handleLogin() {
        const email = $("#email").val();
        const password = $("#password").val();
        const fillAllFields = (LANG === '_en') ? 'Please complete all fields' : 'Por favor completa todos los campos';
        const welcome = (LANG === '_en') ? 'Welcome' : 'Bienvenido';
        const invalidCredentials = (LANG === '_en') ? 'Invalid email or password' : 'Usuario o contraseña incorrectos';
        const loginError = (LANG === '_en') ? 'Error logging in' : 'Error al iniciar sesión';

        if (!email || !password) {
            Utils.showNotification(fillAllFields, 'error');
            return;
        }

        $.ajax({
            url: "api/users/login",
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'text',
            data: { mail: email, password: password },
            success: (res) => {
                console.log('Login response:', res);
                const [status, ...messageParts] = res.split(" ");
                const message = messageParts.join(" ");

                if (status === "ok") {
                    AppState.setUser(message);
                    this.updateUIAfterLogin(message);
                    Utils.showNotification(`${welcome} ${message}!`, 'success');
                    $("#login-form")[0].reset();
                    const $contenedor = $("#contenedor");
                    $contenedor.addClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8");
                    ProductsModule.loadProducts();
                    Utils.updateNavigation(null);
                } else {
                    Utils.showNotification(message || invalidCredentials, 'error');
                }
            },
            error: (error) => {
                console.error('Error en el login:', error);
                Utils.showNotification(loginError, 'error');
            }
        });
    },
    showRegister() {
        const $contenedor = $("#contenedor")
        $contenedor.removeClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")
        $contenedor.html(AppState.templates.register)
        Utils.updateNavigation('btn-registro')
        $("#register-form").on('submit', (e) => {
            e.preventDefault()
            this.handleRegister()
        })
        $("#btn-login-link").on('click', (e) => {
            e.preventDefault()
            this.showLogin()
        })
    },
    handleRegister() {
        const nombre = $('input[name="nombre"]').val()
        const email = $('input[name="mail"]').val()
        const password = $('input[name="password"]').val()
        const confirmPassword = $('input[name="confirmPassword"]').val()

        const fillAllFields = (LANG === '_en') ? 'Please complete all fields' : 'Por favor completa todos los campos';
        const passwordMismatch = (LANG === '_en') ? 'Passwords do not match' : 'Las contraseñas no coinciden';
        const passwordLength = (LANG === '_en') ? 'Password must be at least 6 characters' : 'La contraseña debe tener al menos 6 caracteres';
        const registerSuccess = (LANG === '_en') ? 'User registered successfully' : 'Usuario registrado exitosamente';
        const registerError = (LANG === '_en') ? 'Error registering user' : 'Error al registrar usuario';

        if (!nombre || !email || !password || !confirmPassword) {
            Utils.showNotification(fillAllFields, 'error')
            return
        }
        if (password !== confirmPassword) {
            Utils.showNotification(passwordMismatch, 'error')
            return
        }
        if (password.length < 6) {
            Utils.showNotification(passwordLength, 'error')
            return
        }
        $.ajax({
            url: "api/users/register",
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'text',
            data: { username: nombre, mail: email, password: password },
            success: (res) => {
                console.log('Register response:', res);
                const [status, ...messageParts] = res.split(" ");
                const message = messageParts.join(" ");

                if (status === "OK") {
                    Utils.showNotification(registerSuccess, 'success')
                    $("#register-form")[0].reset()
                    setTimeout(() => this.showLogin(), 1500)
                } else {
                    Utils.showNotification(message || registerError, 'error')
                }
            },
            error: (error) => {
                console.error('Error:', error)
                Utils.showNotification(registerError, 'error')
            }
        })
    },
    logout() {
        const logoutSuccess = (LANG === '_en') ? 'Session closed successfully' : 'Sesión cerrada correctamente';

        AppState.clearUser();
        $("#user-info").addClass("hidden");
        $("#user-name").text("");
        $("#btn-login, #btn-registro").removeClass('hidden');
        $("#btn-login-mobile, #btn-registro-mobile").removeClass('hidden');
        $("#btn-orders").addClass('hidden');
        $("#btn-orders-mobile").addClass('hidden');
        Utils.showNotification(logoutSuccess, 'info');
        const $contenedor = $("#contenedor");
        $contenedor.addClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8");
        ProductsModule.loadProducts();
    },
    updateUIAfterLogin(userName) {
        $("#user-name").text(userName);
        $("#user-info").removeClass("hidden");
        $("#btn-login, #btn-registro").addClass('hidden');
        $("#btn-login-mobile, #btn-registro-mobile").addClass('hidden');
        $("#btn-orders").removeClass('hidden');
        $("#btn-orders-mobile").removeClass('hidden');
        Utils.updateCartCount();
        const $logoutBtn = $('#btn-logout');
        if ($logoutBtn.length) {
            $logoutBtn.off('click').on('click', () => this.logout());
        }
    }
}
const CartModule = {
    showCart() {
        const $contenedor = $("#contenedor")
        $contenedor.removeClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")
        Utils.updateNavigation(null)
        if (!AppState.isUserLoggedIn()) {
            const data = { notLoggedIn: true }
            $contenedor.html(Mustache.render(AppState.templates.cart, data))
            return
        }
        $contenedor.html(Mustache.render(AppState.templates.cart, { loading: true }))
        $.getJSON("api/cart/obtain")
            .done((cartItems) => {
                if (!cartItems || cartItems.length === 0) {
                    const data = { emptyCart: true }
                    $contenedor.html(Mustache.render(AppState.templates.cart, data))
                    return
                }
                const subtotal = cartItems.reduce((sum, item) =>
                    sum + (item.price * item.quantity), 0
                )
                const iva = subtotal * 0.21
                const total = subtotal + iva
                const items = cartItems.map(item => ({
                    coffeeId: item.coffeeId,
                    coffeeName: item.coffeeName || item.coffeeType,
                    origin: item.origin,
                    price: item.price,
                    quantity: item.quantity,
                    stock: item.stock,
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
                $contenedor.html(Mustache.render(AppState.templates.cart, data))
            })
            .fail((error) => {
                console.error('Error al cargar el carrito:', error)
                $contenedor.html(`
                    <div class="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                        <div class="text-6xl mb-4">⚠️</div>
                        <h3 class="text-xl font-bold text-red-800 mb-2">Error al cargar el carrito</h3>
                        <p class="text-red-600">${error.message || 'Error desconocido'}</p>
                        <button onclick="CartModule.showCart()" class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Reintentar
                        </button>
                    </div>
                `)
            })
    },
    removeFromCart(coffeeId) {
        const productRemoved = (LANG === '_en') ? 'Product removed from cart' : 'Producto eliminado del carrito';
        const removeError = (LANG === '_en') ? 'Error removing from cart' : 'Error al eliminar del carrito';

        $.ajax({
            url: `api/cart/remove?productId=${coffeeId}`,
            method: 'POST',
            contentType: 'application/json',
            success: (data) => {
                const [status, ...messageParts] = data.split(" ")
                const message = messageParts.join(" ")
                if (status === "ok") {
                    Utils.showNotification(productRemoved, 'success')
                    Utils.updateCartCount()
                    this.showCart()
                } else {
                    Utils.showNotification(`Error: ${message}`, 'error')
                }
            },
            error: (error) => {
                console.error('Error al eliminar del carrito:', error)
                Utils.showNotification(removeError, 'error')
            }
        })
    }
}

const CoffeeDetailModule = {
    currentCoffeeData: null,
    showDetail(coffeeId) {
        window.location.href = `/coffee-detail?id=${coffeeId}`
    },
    closeDetail() {
        $("#coffee-detail-modal").empty()
        $("body").css("overflow", "")
        this.currentCoffeeData = null
    },
    changeImage(coffeeId, imageNumber) {
        const imageUrl = `show-image${imageNumber === 1 ? '' : `-${imageNumber}`}?id=${coffeeId}`
        $(`#main-detail-image-${coffeeId}`).attr('src', imageUrl)
        $(`button[onclick*="changeDetailImage(${coffeeId}"]`).each(function(index) {
            if (index + 1 === imageNumber) {
                $(this).removeClass('border-gray-300').addClass('border-primary-500')
            } else {
                $(this).removeClass('border-primary-500').addClass('border-gray-300')
            }
        })
    },
    addToCartFromDetail(coffeeId, coffeeName, price) {
        const loginRequired = (LANG === '_en') ? 'You must log in to add products to cart' : 'Debes iniciar sesión para agregar productos al carrito';
        const addedToCart = (LANG === '_en') ? 'added to cart!' : 'añadido al carrito!';
        const addError = (LANG === '_en') ? 'Error adding to cart' : 'Error al agregar al carrito';

        if (!AppState.isUserLoggedIn()) {
            Utils.showNotification(loginRequired, 'error')
            this.closeDetail()
            AuthModule.showLogin()
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
                    Utils.showNotification(`¡${coffeeName} ${addedToCart}`, 'success')
                    Utils.updateCartCount()
                } else {
                    Utils.showNotification(`Error: ${message}`, 'error')
                }
            },
            error: (error) => {
                console.error('Error al agregar al carrito:', error)
                Utils.showNotification(addError, 'error')
            }
        })
    }
}

function comprarCafe(nombreCafe, idCafe) {
    ProductsModule.addToCart(nombreCafe, idCafe)
}
function obtenerCafes() {
    ProductsModule.loadProducts()
}
function mostrarLogin() {
    AuthModule.showLogin()
}
function mostrarRegistro() {
    AuthModule.showRegister()
}
function cerrarSesion() {
    AuthModule.logout()
}
function mostrarCarrito() {
    CartModule.showCart()
}
function deliminarDelCarrito(coffeeId) {
    CartModule.removeFromCart(coffeeId)
}
function showCoffeeDetail(coffeeId) {
    CoffeeDetailModule.showDetail(coffeeId)
}
function closeCoffeeDetail() {
    CoffeeDetailModule.closeDetail()
}
function changeDetailImage(coffeeId, imageNumber) {
    CoffeeDetailModule.changeImage(coffeeId, imageNumber)
}
function addToCartFromDetail(coffeeId, coffeeName, price) {
    CoffeeDetailModule.addToCartFromDetail(coffeeId, coffeeName, price)
}
function showNotification(message, type) {
    Utils.showNotification(message, type)
}
function updateNavigation(activeBtn) {
    Utils.updateNavigation(activeBtn)
}
function closeDetailIfOutside(event) {
    if (event.target === event.currentTarget) {
        CoffeeDetailModule.closeDetail()
    }
}
function setupNavigationListeners() {
    const $btnLogin = $('#btn-login')
    const $btnRegistro = $('#btn-registro')
    const $btnCarrito = $('#btn-carrito')
    if ($btnLogin.length) {
        $btnLogin.on('click', (e) => {
            e.preventDefault()
            AuthModule.showLogin()
        })
    }
    if ($btnRegistro.length) {
        $btnRegistro.on('click', (e) => {
            e.preventDefault()
            AuthModule.showRegister()
        })
    }
    if ($btnCarrito.length) {
        $btnCarrito.on('click', (e) => {
            e.preventDefault()
            CartModule.showCart()
        })
    }
    const $btnLoginMobile = $('#btn-login-mobile')
    const $btnRegistroMobile = $('#btn-registro-mobile')
    const $btnCarritoMobile = $('#btn-carrito-mobile')
    if ($btnLoginMobile.length) {
        $btnLoginMobile.on('click', (e) => {
            e.preventDefault()
            AuthModule.showLogin()
        })
    }
    if ($btnRegistroMobile.length) {
        $btnRegistroMobile.on('click', (e) => {
            e.preventDefault()
            AuthModule.showRegister()
        })
    }
    if ($btnCarritoMobile.length) {
        $btnCarritoMobile.on('click', (e) => {
            e.preventDefault()
            CartModule.showCart()
        })
    }
}
let LOGGED_USER = ""
let currentCoffeeData = null

Object.defineProperty(window, 'LOGGED_USER', {
    get: () => AppState.getCookie('loggedUser') || "",
    set: (value) => {
        if (value) {
            AppState.setCookie('loggedUser', value, 7)
        } else {
            AppState.deleteCookie('loggedUser')
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar LANG si no está definida
    if (typeof LANG === 'undefined') {
        window.LANG = '';
    }

    const langPath = LANG === '_en' ? '-en' : '';
    const templatePromises = [
        fetch(`mustache-templates${langPath}/coffee-card.html`).then(r => r.text()),
        fetch(`mustache-templates${langPath}/coffee-detail.html`).then(r => r.text()),
        fetch(`mustache-templates${langPath}/register.html`).then(r => r.text()),
        fetch(`mustache-templates${langPath}/login.html`).then(r => r.text()),
        fetch(`mustache-templates${langPath}/cart.html`).then(r => r.text())
    ]
    Promise.all(templatePromises)
        .then(([coffeeCard, coffeeDetail, register, login, cart]) => {
            AppState.templates.coffeeCard = coffeeCard
            AppState.templates.coffeeDetail = coffeeDetail
            AppState.templates.register = register
            AppState.templates.login = login
            AppState.templates.cart = cart
            setTimeout(() => {
                ProductsModule.loadProducts()
            }, 500)
        })
        .catch(error => {
            console.error('Error cargando templates:', error)
            const errorMsg = (LANG === '_en') ? 'Error loading application' : 'Error al cargar la aplicación';
            Utils.showNotification(errorMsg, 'error')
        })
    setupNavigationListeners()

    if (AppState.isUserLoggedIn()) {
        const username = AppState.getUser()
        AuthModule.updateUIAfterLogin(username)
    }
})


