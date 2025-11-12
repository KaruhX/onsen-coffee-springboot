package es.karuh.ecommerce.service;

import es.karuh.ecommerce.model.Order;

import java.util.List;

public interface OrderService {
    String createOrder(int userId, String note, String shippingAddress);

    // Paso 1: Crear orden con datos de envío
    String createOrderStep1(int userId, String fullName, String address, String province);

    // Paso 2: Agregar método de pago
    String addPaymentMethod(int userId, String creditCardTitular, String creditCardNumber, String creditCardType);

    // Paso 3: Confirmar orden
    String confirmOrder(int userId);

    // Obtener orden pendiente del usuario
    Order getPendingOrder(int userId);

    // Obtener todas las órdenes del usuario
    List<Order> getUserOrders(int userId);

	List<Order> getAllOrders();

	void updateOrderStatus(int orderId, Order.Status status);
}
