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
			throw new RuntimeException("Usuario no encontrado: " + userId);
		}

		Cart existingCart = null;
		for (Cart cart : user.getCarts()) {
			if (cart.getCoffee() != null && cart.getCoffee().getId() == productId) {
				existingCart = cart;
				break;
			}
		}

		if (existingCart != null) {
			existingCart.setQuantity(existingCart.getQuantity() + quantity);
			em.merge(existingCart);
		} else {
			Coffee coffee = em.find(Coffee.class, productId);
			if (coffee == null) {
				throw new RuntimeException("Producto no encontrado: " + productId);
			}

			Cart newCart = new Cart();
			newCart.setUser(user);
			newCart.setCoffee(coffee);
			newCart.setQuantity(quantity);
			em.persist(newCart);
		}
	}

	@Override
	public List<Map<String, Object>> obtain(int userId) {
		Query q = em.createNativeQuery(SQLConsts.SQL_OBTAIN_CART_PRODUCTS);
		q.setParameter(1, userId);
		@SuppressWarnings("unchecked")
		List<Object[]> results = q.getResultList();
		if (!results.isEmpty()) {
			return results.stream().map(row -> {
				Map<String, Object> map = new java.util.HashMap<>();
				map.put("userId", row[0]);
				map.put("coffeeType", row[1]);
				map.put("coffeeId", row[2]);
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
		return null;
	}

	@Override
	public void updateQuantity(int userId, int productId, int quantity) {
		User user = em.find(User.class, userId);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado: " + userId);
		}

		Cart existingCart = null;
		for (Cart cart : user.getCarts()) {
			if (cart.getCoffee() != null && cart.getCoffee().getId() == productId) {
				existingCart = cart;
				break;
			}
		}

		if (existingCart != null) {
			Coffee coffee = existingCart.getCoffee();
			if (coffee != null && quantity > coffee.getStock()) {
				throw new RuntimeException("Stock insuficiente. Disponible: " + coffee.getStock());
			}
			existingCart.setQuantity(quantity);
			em.merge(existingCart);
		} else {
			throw new RuntimeException("Producto no encontrado en el carrito");
		}
	}

	@Override
	public void removeProduct(int userId, int productId) {
		User user = em.find(User.class, userId);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado: " + userId);
		}

		Cart cartToRemove = null;
		for (Cart cart : user.getCarts()) {
			if (cart.getCoffee() != null && cart.getCoffee().getId() == productId) {
				cartToRemove = cart;
				break;
			}
		}

		if (cartToRemove != null) {
			user.getCarts().remove(cartToRemove);
			em.remove(cartToRemove);
		} else {
			throw new RuntimeException("Producto no encontrado en el carrito");
		}
	}

	@Override
	public void clearCart(int userId) {
		User user = em.find(User.class, userId);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado: " + userId);
		}

		List<Cart> carts = user.getCarts();
		for (Cart cart : carts) {
			em.remove(cart);
		}
		carts.clear();
	}
}
