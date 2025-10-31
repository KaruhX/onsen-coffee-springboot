package es.karuh.ecommerce.service;

import es.karuh.ecommerce.model.Cart;
import es.karuh.ecommerce.model.Coffee;
import es.karuh.ecommerce.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
			user = em.merge(user);
			em.persist(newCart);
		}
	}
}

