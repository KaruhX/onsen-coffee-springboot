package es.karuh.ecommerce.service;

import es.karuh.ecommerce.model.Order;

import java.util.List;

public interface OrderService {
    String createOrder(int userId, String note, String shippingAddress);

    String createOrderStep1(int userId, String fullName, String email, String phone, String address, String province);

    String addPaymentMethod(int userId, String creditCardTitular, String creditCardNumber, String creditCardType);

    String confirmOrder(int userId);

    Order getPendingOrder(int userId);

    List<Order> getUserOrders(int userId);

	List<Order> getAllOrders();

	void updateOrderStatus(int orderId, Order.Status status);

	String deleteOrder(int orderId);
}
