const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const checkUserLoggedIn = () => {
    const user = getCookie('loggedUser');
    return user !== null && user !== "";
};

let currentStep = 1;
let cartItems = [];
let orderData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    cardHolder: '',
    cardNumber: '',
    cardType: ''
};

window.addEventListener('DOMContentLoaded', async () => {
    console.log('Checkout page loaded');

    if (!checkUserLoggedIn()) {
        console.log('User not logged in');
        showError('Debes iniciar sesión para hacer un pedido');
        setTimeout(() => window.location.href = '/products', 2000);
        return;
    }

    console.log('User logged in, loading cart...');
    await loadCart();
    console.log('Setting up event listeners...');
    setupEventListeners();
    console.log('Checkout initialized');
});

async function loadCart() {
    try {
        const response = await fetch('/api/cart/items');
        const result = await response.json();

        if (!result.items || result.items.length === 0) {
            showError('Tu carrito está vacío');
            setTimeout(() => window.location.href = '/products', 2000);
            return;
        }

        cartItems = result.items;
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        showError('Error al cargar el carrito');
    }
}

function setupEventListeners() {
    const btnNext1 = document.getElementById('btn-next-1');
    const btnNext2 = document.getElementById('btn-next-2');
    const btnBack1 = document.getElementById('btn-back-1');
    const btnConfirm = document.getElementById('btn-confirm');
    const btnBack2 = document.getElementById('btn-back-2');
    const cardNumber = document.getElementById('cardNumber');

    console.log('Setting up event listeners...');
    console.log('btn-next-1 found:', !!btnNext1);
    console.log('btn-next-2 found:', !!btnNext2);
    console.log('btn-back-1 found:', !!btnBack1);
    console.log('btn-confirm found:', !!btnConfirm);
    console.log('btn-back-2 found:', !!btnBack2);
    console.log('cardNumber found:', !!cardNumber);

    if (btnNext1) {
        btnNext1.addEventListener('click', handleStep1);
        console.log('Event listener added to btn-next-1');
    }

    if (btnNext2) {
        btnNext2.addEventListener('click', handleStep2);
        console.log('Event listener added to btn-next-2');
    }

    if (btnBack1) {
        btnBack1.addEventListener('click', () => goToStep(1));
        console.log('Event listener added to btn-back-1');
    }

    if (btnConfirm) {
        btnConfirm.addEventListener('click', handleStep3);
        console.log('Event listener added to btn-confirm');
    }

    if (btnBack2) {
        btnBack2.addEventListener('click', () => goToStep(2));
        console.log('Event listener added to btn-back-2');
    }

    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            e.target.value = value.match(/.{1,4}/g)?.join(' ') || value;
        });
        console.log('Event listener added to cardNumber');
    }
}

async function handleStep1(e) {
    if (e) e.preventDefault();
    
    console.log('handleStep1 called');

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const province = document.getElementById('province').value.trim();

    console.log('Form values:', { fullName, email, phone, address, province });

    if (!fullName || !email || !phone || !address || !province) {
        showError('Por favor completa todos los campos');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Por favor ingresa un email válido');
        return;
    }

    const phoneRegex = /^[0-9]{9,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showError('Por favor ingresa un teléfono válido (mínimo 9 dígitos)');
        return;
    }

    console.log('Validation passed, sending request...');
    showLoading('btn-next-1');

    try {
        const response = await fetch('/api/orders/step1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, phone, address, province })
        });

        console.log('Response status:', response.status);
        const result = await response.text();
        console.log('Response result:', result);

        if (result.startsWith('ok')) {
            orderData.fullName = fullName;
            orderData.email = email;
            orderData.phone = phone;
            orderData.address = address;
            orderData.province = province;
            console.log('Moving to step 2');
            goToStep(2);
        } else {
            showError(result.replace('error ', ''));
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error al procesar los datos');
    } finally {
        hideLoading('btn-next-1', 'Continuar al Pago →');
    }
}

async function handleStep2(e) {
    if (e) e.preventDefault();

    const cardHolder = document.getElementById('cardHolder').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardType = document.getElementById('cardType').value;

    if (!cardHolder || !cardNumber || !cardType) {
        showError('Por favor completa todos los campos de pago');
        return;
    }

    if (cardNumber.length < 13 || cardNumber.length > 19) {
        showError('Número de tarjeta inválido');
        return;
    }

    showLoading('btn-next-2');

    try {
        const response = await fetch('/api/orders/step2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creditCardTitular: cardHolder,
                creditCardNumber: cardNumber,
                creditCardType: cardType
            })
        });

        const result = await response.text();

        if (result.startsWith('ok')) {
            orderData.cardHolder = cardHolder;
            orderData.cardNumber = cardNumber;
            orderData.cardType = cardType;
            loadConfirmationData();
            goToStep(3);
        } else {
            showError(result.replace('error ', ''));
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error al procesar el pago');
    } finally {
        hideLoading('btn-next-2', 'Continuar →');
    }
}

async function handleStep3(e) {
    if (e) e.preventDefault();

    showLoading('btn-confirm');

    try {
        const response = await fetch('/api/orders/step3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.text();

        if (result.startsWith('ok')) {
            const orderId = result.split(' ')[1];
            showSuccess(orderId);
        } else {
            showError(result.replace('error ', ''));
            hideLoading('btn-confirm', 'Confirmar Pedido ✓');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error al confirmar el pedido');
        hideLoading('btn-confirm', 'Confirmar Pedido ✓');
    }
}

function loadConfirmationData() {

    document.getElementById('confirm-name').textContent = orderData.fullName;
    document.getElementById('confirm-email').textContent = orderData.email;
    document.getElementById('confirm-phone').textContent = orderData.phone;
    document.getElementById('confirm-addr').textContent = orderData.address;
    document.getElementById('confirm-prov').textContent = orderData.province;

    document.getElementById('confirm-card-type').textContent = orderData.cardType;
    document.getElementById('confirm-card-holder').textContent = orderData.cardHolder;

    const lastFour = orderData.cardNumber.slice(-4);
    document.getElementById('confirm-card-number').textContent = `•••• •••• •••• ${lastFour}`;

    const itemsContainer = document.getElementById('confirm-items');
    itemsContainer.innerHTML = '';

    let subtotal = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center text-sm';
        itemDiv.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="font-medium text-gray-700">${item.quantity}x</span>
                <span class="text-gray-900">${item.coffeeName}</span>
            </div>
            <span class="font-semibold text-gray-900">${itemTotal.toFixed(2)}€</span>
        `;
        itemsContainer.appendChild(itemDiv);
    });

    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    document.getElementById('confirm-subtotal').textContent = subtotal.toFixed(2) + '€';
    document.getElementById('confirm-iva').textContent = iva.toFixed(2) + '€';
    document.getElementById('confirm-total').textContent = total.toFixed(2) + '€';
}

function goToStep(step) {

    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-success').classList.add('hidden');

    document.getElementById(`step-${step}`).classList.remove('hidden');

    updateProgressBar(step);

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar(step) {
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById(`step-circle-${i}`);
        const text = document.getElementById(`step-text-${i}`);
        const line = document.getElementById(`step-line-${i}`);

        if (i < step) {

            circle.className = 'flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-semibold text-sm';
            text.className = 'text-sm font-medium text-primary-600';
            if (line) line.className = 'h-1 bg-primary-600 rounded';
        } else if (i === step) {

            circle.className = 'flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-semibold text-sm';
            text.className = 'text-sm font-semibold text-primary-600';
            if (line) line.className = 'h-1 bg-gray-200 rounded';
        } else {

            circle.className = 'flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-500 font-semibold text-sm';
            text.className = 'text-sm text-gray-500';
            if (line) line.className = 'h-1 bg-gray-200 rounded';
        }
    }
}

function showSuccess(orderId) {
    document.getElementById('order-number').textContent = orderId;
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-success').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');

    if (!errorAlert || !errorMessage) {
        console.error('Error alert elements not found');
        alert(message);
        return;
    }

    errorMessage.textContent = message;
    errorAlert.classList.remove('hidden');
    setTimeout(() => errorAlert.classList.add('hidden'), 5000);
}

function showLoading(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) {
        console.error('Button not found:', buttonId);
        return;
    }
    button.disabled = true;
    button.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
}

function hideLoading(buttonId, text) {
    const button = document.getElementById(buttonId);
    if (!button) {
        console.error('Button not found:', buttonId);
        return;
    }
    button.disabled = false;
    button.innerHTML = text;
}

