
window.addEventListener('DOMContentLoaded', async () => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };
    const loggedUser = getCookie('loggedUser');
    if (!loggedUser) {
        window.location.href = '/products';
        return;
    }
    await loadOrders();
});

async function loadOrders() {
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const ordersContainer = document.getElementById('orders-container');

    try {
        const response = await fetch('/api/orders/history');
        const result = await response.json();

        loadingState.classList.add('hidden');

        if (result.error) {
            console.error('Error:', result.error);
            emptyState.classList.remove('hidden');
            return;
        }

        if (!result.orders || result.orders.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        displayOrders(result.orders);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        loadingState.classList.add('hidden');
        emptyState.classList.remove('hidden');
    }
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = '';

    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersContainer.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow';

    const date = new Date(order.createdAt);
    const formattedDate = date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const statusBadge = getStatusBadge(order.status);

    card.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-900">Pedido #${order.id}</h3>
                    <p class="text-sm text-gray-600 mt-1">${formattedDate}</p>
                </div>
                ${statusBadge}
            </div>

            <div class="border-t border-gray-200 pt-4 mb-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Datos de Envío</h4>
                <div class="text-sm text-gray-600 space-y-1">
                    <p><span class="font-medium">Destinatario:</span> ${order.fullName || 'N/A'}</p>
                    <p><span class="font-medium">Email:</span> ${order.email || 'N/A'}</p>
                    <p><span class="font-medium">Teléfono:</span> ${order.phone || 'N/A'}</p>
                    <p><span class="font-medium">Dirección:</span> ${order.address || 'N/A'}</p>
                    <p><span class="font-medium">Provincia:</span> ${order.province || 'N/A'}</p>
                </div>
            </div>

            <div class="border-t border-gray-200 pt-4 mb-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Productos</h4>
                <div class="space-y-2">
                    ${order.items.map(item => `
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">${item.quantity}x ${item.coffeeName}</span>
                            <span class="font-medium text-gray-900">${item.totalPrice.toFixed(2)}€</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        <p>Subtotal: ${order.subtotal.toFixed(2)}€</p>
                        <p>IVA (21%): ${order.iva.toFixed(2)}€</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-600 mb-1">Total</p>
                        <p class="text-2xl font-bold text-primary-600">${order.total.toFixed(2)}€</p>
                    </div>
                </div>
            </div>

            ${order.creditCardType ? `
                <div class="border-t border-gray-200 pt-4 mt-4">
                    <p class="text-sm text-gray-600">
                        <span class="font-medium">Método de pago:</span> ${order.creditCardType}
                    </p>
                </div>
            ` : ''}
        </div>
    `;

    return card;
}

function getStatusBadge(status) {
    const badges = {
        'PENDING': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>',
        'PAYMENT': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">En Pago</span>',
        'CONFIRMED': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Confirmado</span>',
        'PROCESSING': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Procesando</span>',
        'SHIPPED': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Enviado</span>',
        'DELIVERED': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Entregado</span>',
        'CANCELED': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelado</span>'
    };

    return badges[status] || badges['PENDING'];
}
