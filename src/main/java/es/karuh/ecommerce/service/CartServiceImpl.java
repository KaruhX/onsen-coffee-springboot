package es.karuh.ecommerce.service;

import es.karuh.ecommerce.consts.SQLConsts;
import es.karuh.ecommerce.model.Cart;
import es.karuh.ecommerce.model.Coffee;
import es.karuh.ecommerce.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CartServiceImpl implements CartService {

	@PersistenceContext
	private EntityManager em;

	@Override
	public void addProduct(int userId, int productId, int quantity) {
		User user = em.find(User.class, userId);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado");
		}

		Coffee coffee = em.find(Coffee.class, productId);
		if (coffee == null) {
			throw new RuntimeException("Producto no encontrado");
		}

		if (coffee.getStock() < quantity) {
			throw new RuntimeException("Stock insuficiente");
		}

		// Buscar si ya existe en el carrito (incluso si está marcado como removed)
		List<Cart> existingCarts = em.createQuery(
			"SELECT c FROM Cart c WHERE c.user.id = :userId AND c.coffee.id = :coffeeId", Cart.class)
			.setParameter("userId", userId)
			.setParameter("coffeeId", productId)
			.getResultList();

		if (!existingCarts.isEmpty()) {
			Cart existingCart = existingCarts.get(0);

			// Si estaba removido, restaurarlo
			if (existingCart.isRemoved()) {
				existingCart.setRemoved(false);
				existingCart.setQuantity(quantity);
			} else {
				// Si no estaba removido, incrementar cantidad
				int newQuantity = existingCart.getQuantity() + quantity;

				if (coffee.getStock() < newQuantity) {
					throw new RuntimeException("Stock insuficiente para la cantidad solicitada");
				}
				existingCart.setQuantity(newQuantity);
			}

			em.merge(existingCart);
		} else {
			// Crear nuevo cart
			Cart newCart = new Cart();
			newCart.setUser(user);
			newCart.setCoffee(coffee);
			newCart.setQuantity(quantity);
			newCart.setRemoved(false);
			em.persist(newCart);
		}

		em.flush();
	}

	@Override
	public List<Map<String, Object>> obtain(int userId) {
		Query q = em.createNativeQuery(SQLConsts.SQL_OBTAIN_CART_PRODUCTS);
		q.setParameter(1, userId);
		@SuppressWarnings("unchecked")
		List<Object[]> results = q.getResultList();

		if (results.isEmpty()) {
			return List.of();
		}

		return results.stream().map(row -> {
			Map<String, Object> map = new java.util.HashMap<>();
			
			// Convertir explícitamente coffeeId a String para Mustache
			Object coffeeIdObj = row[2];
			String coffeeIdStr = coffeeIdObj != null ? coffeeIdObj.toString() : "0";
			
			map.put("userId", row[0]);
			map.put("coffeeType", row[1]);
			map.put("coffeeName", row[1]);
			map.put("coffeeId", coffeeIdStr);
			map.put("price", row[3]);
			map.put("description", row[4]);
			map.put("quantity", row[5]);
			map.put("origin", row[6]);
			map.put("altitude", row[7]);
			map.put("bitternessLevel", row[8]);
			map.put("stock", row[9]);
			
			return map;
		}).collect(java.util.stream.Collectors.toList());
	}

	@Override
	public void removeProduct(int userId, int productId) {
		// Marcar como removido en lugar de eliminar (soft delete)
		int updated = em.createQuery(
			"UPDATE Cart c SET c.removed = true WHERE c.user.id = :userId AND c.coffee.id = :coffeeId")
			.setParameter("userId", userId)
			.setParameter("coffeeId", productId)
			.executeUpdate();

		if (updated == 0) {
			throw new RuntimeException("Producto no encontrado en el carrito");
		}

		em.flush();
	}
}
