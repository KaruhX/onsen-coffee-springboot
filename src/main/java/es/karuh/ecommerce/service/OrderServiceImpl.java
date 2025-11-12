package es.karuh.ecommerce.service;

import es.karuh.ecommerce.consts.SQLConsts;
import es.karuh.ecommerce.model.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public String createOrderStep1(int userId, String fullName, String address, String province) {
        User user = em.find(User.class, userId);
        if (user == null) {
            return "error Usuario no encontrado";
        }

        // Obtener items del carrito
        Query q = em.createNativeQuery(SQLConsts.SQL_OBTAIN_CART_PRODUCTS);
        q.setParameter(1, userId);
        @SuppressWarnings("unchecked")
        List<Object[]> results = q.getResultList();

        if (results == null || results.isEmpty()) {
            return "error Carrito vacío";
        }

        // Validar stock
        for (Object[] row : results) {
            int stock = ((Number) row[9]).intValue();
            int quantity = ((Number) row[5]).intValue();
            if (stock < quantity) {
                return "error Stock insuficiente";
            }
        }

        // Verificar si ya existe una orden pendiente
        Order existingOrder = getPendingOrder(userId);
        if (existingOrder != null) {
            // Actualizar orden existente
            existingOrder.setFullName(fullName);
            existingOrder.setAddress(address);
            existingOrder.setProvince(province);
            existingOrder.setStatus(Order.Status.PENDING);
            recalculateOrderTotals(existingOrder, results);

            // Actualizar items
            updateOrderItems(existingOrder, results);

            em.merge(existingOrder);
            em.flush();
            return "ok " + existingOrder.getId();
        }

        // Calcular totales
        double subtotal = calculateSubtotal(results);
        double iva = subtotal * 0.21;
        double total = subtotal + iva;

        // Crear nueva orden
        Order order = new Order();
        order.setUser(user);
        order.setFullName(fullName);
        order.setAddress(address);
        order.setProvince(province);
        order.setSubtotal(subtotal);
        order.setIva(iva);
        order.setTotal(total);
        order.setStatus(Order.Status.PENDING);
        order.setCreatedAt(new Date());
        em.persist(order);
        em.flush();

        // Crear order items
        for (Object[] row : results) {
            int coffeeId = ((Number) row[2]).intValue();
            double price = ((Number) row[3]).doubleValue();
            int quantity = ((Number) row[5]).intValue();

            Coffee coffee = em.find(Coffee.class, coffeeId);
            if (coffee == null) continue;

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setCoffee(coffee);
            item.setQuantity(quantity);
            item.setUnitPrice(price);
            item.setTotalPrice(price * quantity);
            em.persist(item);
        }

        em.flush();
        return "ok " + order.getId();
    }

    @Override
    public String addPaymentMethod(int userId, String creditCardTitular, String creditCardNumber, String creditCardType) {
        Order order = getPendingOrder(userId);
        if (order == null) {
            return "error No hay orden pendiente";
        }

        String obfuscatedNumber = obfuscateCreditCard(creditCardNumber);

        order.setCreditCardTitular(creditCardTitular);
        order.setCreditCardNumber(obfuscatedNumber);
        order.setCreditCardType(creditCardType);
        order.setStatus(Order.Status.PAYMENT);

        em.merge(order);
        em.flush();
        return "ok " + order.getId();
    }

    @Override
    public String confirmOrder(int userId) {
        Order order = getPendingOrder(userId);
        if (order == null) {
            return "error No hay orden pendiente";
        }

        if (order.getCreditCardNumber() == null || order.getCreditCardNumber().isEmpty()) {
            return "error Debe agregar un método de pago";
        }

        // Validar stock nuevamente antes de confirmar
        for (OrderItem item : order.getItems()) {
            Coffee coffee = em.find(Coffee.class, item.getCoffee().getId());
            if (coffee.getStock() < item.getQuantity()) {
                return "error Stock insuficiente para " + coffee.getCoffee_type();
            }
        }

        // Decrementar stock
        for (OrderItem item : order.getItems()) {
            Coffee coffee = em.find(Coffee.class, item.getCoffee().getId());
            coffee.setStock(coffee.getStock() - item.getQuantity());
            em.merge(coffee);
        }

        order.setStatus(Order.Status.CONFIRMED);
        em.merge(order);

        // Limpiar carrito
        clearUserCart(userId);

        em.flush();
        return "ok " + order.getId();
    }

    @Override
    public Order getPendingOrder(int userId) {
        User u = em.find(User.class, userId);
        if (u == null) return null;

        List<Order> orders = em.createQuery(
                "SELECT o FROM Order o WHERE o.user = :user AND (o.status = :pending OR o.status = :payment) ORDER BY o.createdAt DESC",
                Order.class)
                .setParameter("user", u)
                .setParameter("pending", Order.Status.PENDING)
                .setParameter("payment", Order.Status.PAYMENT)
                .setMaxResults(1)
                .getResultList();

        return orders.isEmpty() ? null : orders.get(0);
    }

    @Override
    public List<Order> getUserOrders(int userId) {
        User u = em.find(User.class, userId);
        if (u == null) return List.of();

        return em.createQuery(
                "SELECT o FROM Order o WHERE o.user = :user AND o.status = :confirmed ORDER BY o.createdAt DESC",
                Order.class)
                .setParameter("user", u)
                .setParameter("confirmed", Order.Status.CONFIRMED)
                .getResultList();
    }


	@Override
    public String createOrder(int userId, String note, String shippingAddress) {
        // Método legacy para compatibilidad
        User user = em.find(User.class, userId);
        if (user == null) {
            return "error Usuario no encontrado";
        }

        Query q = em.createNativeQuery(SQLConsts.SQL_OBTAIN_CART_PRODUCTS);
        q.setParameter(1, userId);
        @SuppressWarnings("unchecked")
        List<Object[]> results = q.getResultList();

        if (results == null || results.isEmpty()) {
            return "error Carrito vacío";
        }

        // Validar stock
        for (Object[] row : results) {
            int stock = ((Number) row[9]).intValue();
            int quantity = ((Number) row[5]).intValue();
            if (stock < quantity) {
                return "error Stock insuficiente";
            }
        }

        double subtotal = calculateSubtotal(results);
        double iva = subtotal * 0.21;
        double total = subtotal + iva;

        Order order = new Order();
        order.setUser(user);
        order.setSubtotal(subtotal);
        order.setIva(iva);
        order.setAddress(shippingAddress);
        order.setTotal(total);
        order.setStatus(Order.Status.CONFIRMED);
        order.setCreatedAt(new Date());
        em.persist(order);

        // Crear items y decrementar stock
        for (Object[] row : results) {
            int coffeeId = ((Number) row[2]).intValue();
            double price = ((Number) row[3]).doubleValue();
            int quantity = ((Number) row[5]).intValue();

            Coffee coffee = em.find(Coffee.class, coffeeId);
            if (coffee == null) continue;

            coffee.setStock(coffee.getStock() - quantity);
            em.merge(coffee);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setCoffee(coffee);
            item.setQuantity(quantity);
            item.setUnitPrice(price);
            item.setTotalPrice(price * quantity);
            em.persist(item);
        }

        clearUserCart(userId);
        em.flush();
        return "ok " + order.getId();
    }

	@Override
	public List<Order> getAllOrders() {
		return em.createQuery(
				"SELECT o FROM Order o ORDER BY o.createdAt DESC",
				Order.class)
				.getResultList();
	}

	@Override
	public void updateOrderStatus(int orderId, Order.Status status) {
		Order order = em.find(Order.class, orderId);
		if (order != null) {
			order.setStatus(status);
			em.merge(order);
		}
	}

	private String obfuscateCreditCard(String cardNumber) {
        String cleaned = cardNumber.replaceAll("[^0-9]", "");

        if (cleaned.length() < 4) {
            return "************";
        }
        String lastFour = cleaned.substring(cleaned.length() - 4);
        return "************" + lastFour;
    }

    private double calculateSubtotal(List<Object[]> cartItems) {
        double subtotal = 0.0;
        for (Object[] row : cartItems) {
            double price = ((Number) row[3]).doubleValue();
            int quantity = ((Number) row[5]).intValue();
            subtotal += price * quantity;
        }
        return subtotal;
    }

    private void recalculateOrderTotals(Order order, List<Object[]> cartItems) {
        double subtotal = calculateSubtotal(cartItems);
        double iva = subtotal * 0.21;
        double total = subtotal + iva;

        order.setSubtotal(subtotal);
        order.setIva(iva);
        order.setTotal(total);
    }

    private void updateOrderItems(Order order, List<Object[]> cartItems) {
        // Eliminar items existentes
        em.createQuery("DELETE FROM OrderItem oi WHERE oi.order.id = :orderId")
                .setParameter("orderId", order.getId())
                .executeUpdate();

        // Crear nuevos items
        for (Object[] row : cartItems) {
            int coffeeId = ((Number) row[2]).intValue();
            double price = ((Number) row[3]).doubleValue();
            int quantity = ((Number) row[5]).intValue();

            Coffee coffee = em.find(Coffee.class, coffeeId);
            if (coffee == null) continue;

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setCoffee(coffee);
            item.setQuantity(quantity);
            item.setUnitPrice(price);
            item.setTotalPrice(price * quantity);
            em.persist(item);
        }
    }

    private void clearUserCart(int userId) {
        em.createQuery("UPDATE Cart c SET c.removed = true WHERE c.user.id = :userId AND c.removed = false")
                .setParameter("userId", userId)
                .executeUpdate();
    }
}

