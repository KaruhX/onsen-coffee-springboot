const comprarCafe = (nombreCafe, idCafe) => {
    if (LOGGED_USER !== "") {
        $.post("api/cart/add", { coffeeId: idCafe, userMail: LOGGED_USER })
            .done(function(data) {
                alert(`¡${nombreCafe} añadido al carrito!\n\nGracias por elegir Onsen Coffee.`);
            })
    } else {
        alert('Debes iniciar sesión para comprar');
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
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
