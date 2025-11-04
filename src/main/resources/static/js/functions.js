const comprarCafe = (nombreCafe, idCafe) => {
    if (LOGGED_USER !== "") {
        // Usar Fetch API en lugar de jQuery
        fetch("api/cart/add?productId=" + idCafe + "&quantity=1", {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.text())
            .then(data => {
                const firstSpace = data.indexOf(" ");
                const status = data.substring(0, firstSpace);
                const message = data.substring(firstSpace + 1);

                if (status === "ok") {
                    alert(`¡${nombreCafe} añadido al carrito!\n\nGracias por elegir Onsen Coffee.`)
                } else {
                    alert('Error: ' + message)
                }
            })
            .catch(error => {
                console.error('Error al agregar al carrito:', error)
                alert('Error al agregar al carrito: ' + error.message)
            })
    } else {
        alert('Debes iniciar sesión para comprar')
    }
};

const obtenerCafes = () => {
    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = '<div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-onsen-600"></div></div>';

    fetch("api/coffee/obtain")
        .then(response => response.json())
        .then(cafes => {
            if (!cafes || cafes.length === 0) {
                contenedor.innerHTML = '<div class="col-span-full text-center py-16"><div class="text-6xl text-gray-300 mb-6">☕</div><h3 class="text-xl font-medium text-gray-600 mb-2">No hay cafés disponibles</h3><p class="text-gray-500">Pronto tendremos nuevos cafés para ti</p></div>';
                return;
            }

            const cafesConVista = cafes.map(cafe => {
                const stars = [];
                for (let j = 1; j <= 5; j++) {
                    stars.push({
                        class: j <= cafe.bitterness_level ? 'bg-onsen-500' : 'bg-gray-300'
                    });
                }

                return {
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
                    buttonClass: cafe.stock > 0 ? 'bg-onsen-600 text-white hover:bg-onsen-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                    buttonText: cafe.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock',
                    stars: stars
                };
            });

            let html = '';
            cafesConVista.forEach(cafe => {
                html += Mustache.render(COFFEE_CARD_TEMPLATE, cafe);
            });

            contenedor.innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
            contenedor.innerHTML = '<div class="col-span-full text-center py-16"><div class="text-red-500 text-lg font-medium">Error de conexión</div><p class="text-gray-600 mt-2">No se pudo conectar con el servidor</p></div>';
        });
};

const mostrarLogin = () => {
    const contenedor = document.getElementById("contenedor");
    contenedor.classList.remove("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8");
    contenedor.innerHTML = LOGIN_TEMPLATE;

    // Actualizar navegación activa
    const btnLoginNav = document.getElementById('btn-login');
    if (btnLoginNav) {
        btnLoginNav.classList.add("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
        btnLoginNav.classList.remove("text-gray-600");
    }
    document.getElementById('btn-productos')?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-productos')?.classList.add("text-gray-600");
    document.getElementById('btn-registro')?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-registro')?.classList.add("text-gray-600");

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append('mail', document.getElementById('email').value);
        formData.append('password', document.getElementById('password').value);

        fetch("api/users/login", {
            method: 'POST', headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }, body: formData
        })
            .then(response => response.text())
            .then(res => {
                const firstSpace = res.indexOf(" ");
                const status = res.substring(0, firstSpace);
                const message = res.substring(firstSpace + 1);

                if (status === "ok") {
                    LOGGED_USER = message;

                    // Actualizar UI para mostrar que el usuario está logueado
                    const userInfo = document.getElementById("user-info");
                    if (userInfo) {
                        userInfo.textContent = message;
                        userInfo.classList.remove("hidden");
                    }

                    // Ocultar login y registro
                    const btnLoginNav = document.getElementById('btn-login');
                    const btnRegistroNav = document.getElementById('btn-registro');
                    if (btnLoginNav) btnLoginNav.classList.add('hidden');
                    if (btnRegistroNav) btnRegistroNav.classList.add('hidden');

                    // Crear botón de logout
                    const logoutBtn = document.createElement('a');
                    logoutBtn.href = '#';
                    logoutBtn.id = 'btn-logout';
                    logoutBtn.className = 'inline-flex items-center text-gray-600 hover:text-red-600 pb-1 transition-colors';
                    logoutBtn.innerHTML = `
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Salir
                `;
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        cerrarSesion();
                    });

                    if (userInfo && userInfo.parentNode) {
                        userInfo.parentNode.insertBefore(logoutBtn, userInfo.nextSibling);
                    }

                    alert('¡Bienvenido ' + message + '!');
                    loginForm.reset();

                    // Volver a productos
                    contenedor.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8");
                    obtenerCafes();
                    document.getElementById('btn-productos')?.classList.add("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
                    document.getElementById('btn-productos')?.classList.remove("text-gray-600");
                } else {
                    alert(message);
                    LOGGED_USER = "";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al iniciar sesión: ' + error);
            });
    });

    document.getElementById('btn-registro')?.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarRegistro();
    });
};

const cerrarSesion = () => {
    LOGGED_USER = "";

    // Restaurar UI
    const userInfo = document.getElementById("user-info");
    if (userInfo) {
        userInfo.classList.add("hidden");
        userInfo.textContent = "";
    }

    // Remover botón de logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) logoutBtn.remove();

    // Mostrar login y registro
    const btnLoginNav = document.getElementById('btn-login');
    const btnRegistroNav = document.getElementById('btn-registro');
    if (btnLoginNav) btnLoginNav.classList.remove('hidden');
    if (btnRegistroNav) btnRegistroNav.classList.remove('hidden');

    alert('Sesión cerrada correctamente');

    // Volver a productos
    const contenedor = document.getElementById("contenedor");
    contenedor.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8");
    obtenerCafes();
    document.getElementById('btn-productos')?.classList.add("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-productos')?.classList.remove("text-gray-600");
};

const mostrarRegistro = () => {
    const contenedor = document.getElementById("contenedor");
    contenedor.classList.remove("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8");
    contenedor.innerHTML = REGISTER_TEMPLATE;

    // Actualizar navegación activa
    document.getElementById('btn-registro')?.classList.add("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-registro')?.classList.remove("text-gray-600");
    document.getElementById('btn-productos')?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-productos')?.classList.add("text-gray-600");
    document.getElementById('btn-login')?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-login')?.classList.add("text-gray-600");

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const password = document.querySelector('input[name="password"]').value;
        const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Validar longitud mínima de contraseña
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const formData = new URLSearchParams();
        formData.append('nombre', document.querySelector('input[name="nombre"]').value);
        formData.append('mail', document.querySelector('input[name="mail"]').value);
        formData.append('password', password);

        fetch("api/users/register", {
            method: 'POST', headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }, body: formData
        })
            .then(response => response.text())
            .then(res => {
                alert(res);
                if (res.includes('éxito') || res.includes('exitoso') || res.includes('correctamente')) {
                    registerForm.reset();
                    mostrarLogin();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al registrar usuario: ' + error);
            });
    });

    document.getElementById('btn-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarLogin();
    });
};

const mostrarCarrito = () => {
    const contenedor = document.getElementById("contenedor");
    contenedor.classList.remove("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8");
    contenedor.innerHTML = CART_TEMPLATE;

    // Actualizar navegación activa
    document.getElementById('btn-productos')?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-productos')?.classList.add("text-gray-600");
    document.getElementById('btn-login')?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-login')?.classList.add("text-gray-600");
    document.getElementById('btn-registro')?.classList.remove("text-onsen-600", "font-medium", "border-b-2", "border-onsen-600");
    document.getElementById('btn-registro')?.classList.add("text-gray-600");

    const cartContainer = document.getElementById("cart-container");

    if (LOGGED_USER === "") {
        cartContainer.innerHTML = `
            <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="text-8xl mb-6">🔒</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-3">Debes iniciar sesión</h3>
                <p class="text-gray-600 mb-8">Para ver tu carrito, primero inicia sesión o crea una cuenta</p>
                <div class="flex gap-4 justify-center">
                    <button onclick="mostrarLogin()" class="bg-onsen-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-onsen-700 transition-colors shadow-md">
                        Iniciar Sesión
                    </button>
                    <button onclick="mostrarRegistro()" class="bg-white text-onsen-600 border-2 border-onsen-600 px-8 py-3 rounded-lg font-semibold hover:bg-onsen-50 transition-colors">
                        Registrarse
                    </button>
                </div>
            </div>
        `;
    } else {
        cartContainer.innerHTML = '<div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-16 w-16 border-4 border-onsen-200 border-t-onsen-600"></div></div>';

        fetch("api/cart/obtain")
            .then(response => response.json())
            .then(cartItems => {
                if (!cartItems || cartItems.length === 0) {
                    cartContainer.innerHTML = `
                        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-12 text-center">
                            <div class="text-8xl mb-6">🛒</div>
                            <h3 class="text-2xl font-bold text-gray-800 mb-3">Tu carrito está vacío</h3>
                            <p class="text-gray-600 mb-8">¡Añade algunos cafés deliciosos para empezar!</p>
                            <button onclick="obtenerCafes(); document.getElementById('btn-productos').click();" class="bg-onsen-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-onsen-700 transition-colors shadow-md">
                                Ver Productos
                            </button>
                        </div>
                    `;
                    return;
                }

                // Calcular totales
                let subtotal = 0;
                cartItems.forEach(item => {
                    subtotal += (item.price * item.quantity);
                });
                const iva = subtotal * 0.21; // 21% IVA
                const total = subtotal + iva;

                let html = '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">';

                // Columna de items del carrito
                html += '<div class="lg:col-span-2 space-y-4">';

                cartItems.forEach(item => {
                    const itemTotal = (item.price * item.quantity).toFixed(2);
                    html += `
                        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
                            <div class="p-6">
                                <div class="flex flex-col md:flex-row gap-6">
                                    <!-- Imagen del producto -->
                                    <div class="flex-shrink-0">
                                        <div class="w-32 h-32 bg-gradient-to-br from-onsen-100 to-onsen-200 rounded-lg flex items-center justify-center shadow-inner">
                                            <img src="/coffee/thumbnail/${item.coffeeId}" alt="${item.coffeeType}" class="w-full h-full object-cover rounded-lg" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                            <div class="text-6xl" style="display:none;">☕</div>
                                        </div>
                                    </div>
                                    
                                    <!-- Información del producto -->
                                    <div class="flex-grow">
                                        <div class="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 class="text-xl font-bold text-gray-800 mb-1">${item.coffeeType}</h3>
                                                <p class="text-sm text-gray-600">
                                                    <span class="inline-flex items-center">
                                                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                                                        </svg>
                                                        ${item.origin || 'Origen desconocido'}
                                                    </span>
                                                    ${item.altitude ? `<span class="ml-3">📏 ${item.altitude}m</span>` : ''}
                                                </p>
                                            </div>
                                            <button onclick="eliminarDelCarrito(${item.coffeeId})" class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <p class="text-sm text-gray-600 mb-4 line-clamp-2">${item.description || ''}</p>
                                        
                                        <!-- Cantidad y Precio -->
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-3">
                                                <span class="text-sm text-gray-600 font-medium">Cantidad:</span>
                                                <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                    <button onclick="actualizarCantidad(${item.coffeeId}, ${item.quantity - 1})" class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors">
                                                        -
                                                    </button>
                                                    <span class="px-4 py-1 bg-white font-semibold text-gray-800 min-w-[3rem] text-center">${item.quantity}</span>
                                                    <button onclick="actualizarCantidad(${item.coffeeId}, ${item.quantity + 1})" class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors" ${item.quantity >= item.stock ? 'disabled' : ''}>
                                                        +
                                                    </button>
                                                </div>
                                                ${item.stock <= 10 ? `<span class="text-xs text-orange-600 font-medium">(Stock: ${item.stock})</span>` : ''}
                                            </div>
                                            
                                            <div class="text-right">
                                                <p class="text-sm text-gray-600">€${item.price.toFixed(2)} c/u</p>
                                                <p class="text-xl font-bold text-onsen-600">€${itemTotal}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                html += '</div>'; // Cierre columna items

                // Columna del resumen
                html += `
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                            <h3 class="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Resumen del Pedido</h3>
                            
                            <div class="space-y-3 mb-6">
                                <div class="flex justify-between text-gray-700">
                                    <span>Subtotal:</span>
                                    <span class="font-semibold">€${subtotal.toFixed(2)}</span>
                                </div>
                                <div class="flex justify-between text-gray-700">
                                    <span>IVA (21%):</span>
                                    <span class="font-semibold">€${iva.toFixed(2)}</span>
                                </div>
                                <div class="flex justify-between text-sm text-green-600">
                                    <span>Envío:</span>
                                    <span class="font-semibold">GRATIS</span>
                                </div>
                            </div>
                            
                            <div class="border-t-2 border-gray-200 pt-4 mb-6">
                                <div class="flex justify-between items-center">
                                    <span class="text-lg font-bold text-gray-800">Total:</span>
                                    <span class="text-2xl font-bold text-onsen-600">€${total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <button onclick="realizarPedido()" class="w-full bg-gradient-to-r from-onsen-600 to-onsen-700 text-white py-4 rounded-lg font-bold text-lg hover:from-onsen-700 hover:to-onsen-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                <div class="flex items-center justify-center">
                                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                    </svg>
                                    Finalizar Compra
                                </div>
                            </button>
                            
                            <button onclick="obtenerCafes(); document.getElementById('btn-productos').click();" class="w-full mt-3 bg-white text-onsen-600 border-2 border-onsen-600 py-3 rounded-lg font-semibold hover:bg-onsen-50 transition-colors">
                                Seguir Comprando
                            </button>
                            
                            <!-- Información adicional -->
                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <div class="flex items-start text-sm text-gray-600 mb-3">
                                    <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span>Envío gratuito en todos los pedidos</span>
                                </div>
                                <div class="flex items-start text-sm text-gray-600 mb-3">
                                    <svg class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    <span>Pago 100% seguro</span>
                                </div>
                                <div class="flex items-start text-sm text-gray-600">
                                    <svg class="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                                    </svg>
                                    <span>Devolución fácil en 30 días</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                html += '</div>'; // Cierre grid principal

                cartContainer.innerHTML = html;
            })
            .catch(error => {
                console.error('Error al cargar el carrito:', error);
                cartContainer.innerHTML = `
                    <div class="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                        <div class="text-6xl mb-4">⚠️</div>
                        <h3 class="text-xl font-bold text-red-800 mb-2">Error al cargar el carrito</h3>
                        <p class="text-red-600">${error.message}</p>
                        <button onclick="mostrarCarrito()" class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Reintentar
                        </button>
                    </div>
                `;
            });
    }
}

// ==================== FUNCIONES DEL CARRITO ====================

/**
 * Actualiza la cantidad de un producto en el carrito
 */
const actualizarCantidad = (coffeeId, newQuantity) => {
    if (newQuantity < 1) {
        if (confirm('¿Deseas eliminar este producto del carrito?')) {
            eliminarDelCarrito(coffeeId);
        }
        return;
    }

    fetch(`api/cart/update?productId=${coffeeId}&quantity=${newQuantity}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        const firstSpace = data.indexOf(" ");
        const status = data.substring(0, firstSpace);
        const message = data.substring(firstSpace + 1);

        if (status === "ok") {
            showNotification('Cantidad actualizada', 'success');
            mostrarCarrito(); // Recargar el carrito
        } else {
            showNotification('Error: ' + message, 'error');
        }
    })
    .catch(error => {
        console.error('Error al actualizar cantidad:', error);
        showNotification('Error al actualizar la cantidad', 'error');
    });
};

/**
 * Elimina un producto del carrito
 */
const eliminarDelCarrito = (coffeeId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
        return;
    }

    fetch(`api/cart/remove?productId=${coffeeId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        const firstSpace = data.indexOf(" ");
        const status = data.substring(0, firstSpace);
        const message = data.substring(firstSpace + 1);

        if (status === "ok") {
            showNotification('Producto eliminado del carrito', 'success');
            mostrarCarrito(); // Recargar el carrito
        } else {
            showNotification('Error: ' + message, 'error');
        }
    })
    .catch(error => {
        console.error('Error al eliminar del carrito:', error);
        showNotification('Error al eliminar del carrito', 'error');
    });
};

/**
 * Vacía todo el carrito
 */
const vaciarCarrito = () => {
    if (!confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
        return;
    }

    fetch('api/cart/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        const firstSpace = data.indexOf(" ");
        const status = data.substring(0, firstSpace);
        const message = data.substring(firstSpace + 1);

        if (status === "ok") {
            showNotification('Carrito vaciado correctamente', 'success');
            mostrarCarrito(); // Recargar el carrito
        } else {
            showNotification('Error: ' + message, 'error');
        }
    })
    .catch(error => {
        console.error('Error al vaciar el carrito:', error);
        showNotification('Error al vaciar el carrito', 'error');
    });
};

/**
 * Realiza el pedido (checkout)
 */
const realizarPedido = () => {
    // Mostrar modal de confirmación personalizado
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Confirmar Pedido!</h2>
                <p class="text-gray-600">¿Deseas proceder con la compra?</p>
            </div>
            
            <div class="space-y-3 mb-6">
                <button id="confirm-order-btn" class="w-full bg-gradient-to-r from-onsen-600 to-onsen-700 text-white py-3 rounded-lg font-semibold hover:from-onsen-700 hover:to-onsen-800 transition-all shadow-md">
                    Confirmar Pedido
                </button>
                <button id="cancel-order-btn" class="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Cancelar
                </button>
            </div>
            
            <p class="text-xs text-gray-500 text-center">
                Al confirmar, aceptas nuestros términos y condiciones
            </p>
        </div>
    `;

    document.body.appendChild(modal);

    // Animar entrada
    setTimeout(() => {
        modal.querySelector('div').style.opacity = '1';
    }, 10);

    // Botón confirmar
    document.getElementById('confirm-order-btn').addEventListener('click', () => {
        modal.remove();
        procesarPedido();
    });

    // Botón cancelar
    document.getElementById('cancel-order-btn').addEventListener('click', () => {
        modal.remove();
    });

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
};

/**
 * Procesa el pedido (envía la solicitud al backend)
 */
const procesarPedido = () => {
    // Mostrar loading
    const loadingModal = document.createElement('div');
    loadingModal.id = 'loading-modal';
    loadingModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]';
    loadingModal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-onsen-200 border-t-onsen-600 mx-auto mb-4"></div>
            <p class="text-gray-700 font-medium">Procesando tu pedido...</p>
        </div>
    `;
    document.body.appendChild(loadingModal);

    fetch('api/cart/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        loadingModal.remove();

        const firstSpace = data.indexOf(" ");
        const status = data.substring(0, firstSpace);
        const message = data.substring(firstSpace + 1);

        if (status === "ok") {
            // Mostrar modal de éxito
            mostrarModalExito(message);
        } else {
            showNotification('Error: ' + message, 'error');
        }
    })
    .catch(error => {
        loadingModal.remove();
        console.error('Error al procesar el pedido:', error);
        showNotification('Error al procesar el pedido', 'error');
    });
};

/**
 * Muestra modal de pedido exitoso
 */
const mostrarModalExito = (mensaje) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
            
            <h2 class="text-3xl font-bold text-gray-800 mb-3">¡Pedido Realizado!</h2>
            <p class="text-gray-600 mb-6">${mensaje || 'Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.'}</p>
            
            <div class="bg-onsen-50 border-2 border-onsen-200 rounded-lg p-4 mb-6">
                <p class="text-sm text-onsen-800 font-medium">
                    ☕ Gracias por confiar en Onsen Coffee
                </p>
            </div>
            
            <button onclick="this.closest('.fixed').remove(); obtenerCafes(); document.getElementById('btn-productos').click();" class="w-full bg-gradient-to-r from-onsen-600 to-onsen-700 text-white py-3 rounded-lg font-semibold hover:from-onsen-700 hover:to-onsen-800 transition-all shadow-md">
                Volver a la Tienda
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Animar entrada
    setTimeout(() => {
        modal.querySelector('div').style.opacity = '1';
    }, 10);
};

let currentCoffeeData = null;

/**
 * Navega a la página de detalle del café
 */
const showCoffeeDetail = (coffeeId) => {
    window.location.href = `/coffee-detail?id=${coffeeId}`;
};

/**
 * Cierra el modal de detalle del café (legacy - ya no se usa)
 */
const closeCoffeeDetail = () => {
    const modalContainer = document.getElementById('coffee-detail-modal');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
    document.body.style.overflow = '';
    currentCoffeeData = null;
};

/**
 * Cierra el detalle si se hace clic fuera del contenido
 */
const closeDetailIfOutside = (event) => {
    if (event.target === event.currentTarget) {
        closeCoffeeDetail();
    }
};

/**
 * Cambia la imagen principal en la vista de detalle
 */
const changeDetailImage = (coffeeId, imageNumber) => {
    const mainImage = document.getElementById(`main-detail-image-${coffeeId}`);
    if (!mainImage) return;

    let imageUrl;
    switch(imageNumber) {
        case 1:
            imageUrl = `show-image?id=${coffeeId}`;
            break;
        case 2:
            imageUrl = `show-image-2?id=${coffeeId}`;
            break;
        case 3:
            imageUrl = `show-image-3?id=${coffeeId}`;
            break;
        default:
            imageUrl = `show-image?id=${coffeeId}`;
    }

    mainImage.src = imageUrl;

    // Actualizar bordes de las miniaturas
    const thumbnails = document.querySelectorAll(`button[onclick*="changeDetailImage(${coffeeId}"]`);
    thumbnails.forEach((thumb, index) => {
        if (index + 1 === imageNumber) {
            thumb.classList.remove('border-gray-300');
            thumb.classList.add('border-onsen-500');
        } else {
            thumb.classList.remove('border-onsen-500');
            thumb.classList.add('border-gray-300');
        }
    });
};

/**
 * Agrega un café al carrito desde la vista de detalle
 */
const addToCartFromDetail = (coffeeId, coffeeName, price) => {
    if (LOGGED_USER === "") {
        alert('Debes iniciar sesión para agregar productos al carrito');
        closeCoffeeDetail();
        mostrarLogin();
        return;
    }

    fetch("api/cart/add?productId=" + coffeeId + "&quantity=1", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        const firstSpace = data.indexOf(" ");
        const status = data.substring(0, firstSpace);
        const message = data.substring(firstSpace + 1);

        if (status === "ok") {
            // Mostrar notificación de éxito
            showNotification(`¡${coffeeName} añadido al carrito!`, 'success');

            // Opcional: cerrar el modal después de agregar
            // closeCoffeeDetail();
        } else {
            showNotification('Error: ' + message, 'error');
        }
    })
    .catch(error => {
        console.error('Error al agregar al carrito:', error);
        showNotification('Error al agregar al carrito', 'error');
    });
};

/**
 * Muestra notificaciones temporales
 */
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-[9999] px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${type === 'success' 
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
                }
            </svg>
            <span class="font-medium">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
};

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeCoffeeDetail();
    }
});
