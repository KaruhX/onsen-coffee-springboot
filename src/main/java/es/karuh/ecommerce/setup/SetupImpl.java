package es.karuh.ecommerce.setup;

import es.karuh.ecommerce.model.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class SetupImpl implements Setup {

	 @PersistenceContext
	 private EntityManager em;
	@Override
	public void runSetup() {
		SetupTable setupTable = null;
		try {
			setupTable = em.createQuery("SELECT s FROM SetupTable s", SetupTable.class).getSingleResult();
		} catch (Exception e) {
			System.out.println("Setup not found, creating a new one.");
		}
		if (setupTable != null && setupTable.isCompleted()) {
			return;
		}
		var listCoffees = List.of(
				new Coffee("Colombia Supremo", "Colombia", 1600, 3, 8.50, "Cuerpo medio, notas a chocolate y frutas rojas", 25),
				new Coffee("Ethiopia Yirgacheffe", "Etiopía", 2000, 2, 12.00, "Aromático, floral y cítrico", 18),
				new Coffee("Kenya AA", "Kenia", 1800, 4, 11.00, "Acidez brillante, sabor a frutos rojos", 20),
				new Coffee("Brazil Santos", "Brasil", 900, 2, 7.00, "Suave, con notas a nuez y caramelo", 30),
				new Coffee("Guatemala Antigua", "Guatemala", 1500, 3, 9.50, "Equilibrado, chocolate y especias", 22),
				new Coffee("Costa Rica Tarrazú", "Costa Rica", 1700, 3, 10.00, "Limpio, dulce y con acidez brillante", 16),
				new Coffee("Sumatra Mandheling", "Indonesia", 1200, 5, 13.00, "Cuerpo pesado, notas terrosas y cacao", 12),
				new Coffee("Panama Geisha", "Panamá", 1800, 1, 25.00, "Exquisito, floral y de alta fragancia", 6),
				new Coffee("Honduras Marcala", "Honduras", 1400, 2, 8.75, "Dulce, con toques a caramelo y frutos secos", 28),
				new Coffee("Yemen Mocha", "Yemen", 1900, 4, 18.00, "Intenso, notas a chocolate y frutas secas", 8)
		);

		var listUsers = List.of(
				new User("Enner Valencia", "Nelson2000", "a@example.com"),
				new User("María López", "mariaSecure1", "maria.lopez@example.com"),
				new User("William Pacho", "williamPass456", "william.pacho@example.com"),
				new User("Ana Torres", "anaPass789", "ana.torres@example.com"),
				new User("Carlos Ruiz", "carlosR2025", "carlos.ruiz@example.com"),
				new User("Lucía Gómez", "lucia!G", "lucia.gomez@example.com"),
				new User("Diego Fernández", "diego_fern", "diego.fernandez@example.com"),
				new User("Sofía Morales", "sofiaLoveCoffee", "sofia.morales@example.com"),
				new User("Mateo Rojas", "mateoR#01", "mateo.rojas@example.com"),
				new User("Valeria Pérez", "valeriaPwd", "valeria.perez@example.com")
		);

		Cart registerCart = new Cart();
		registerCart.setUser(listUsers.get(0));
		registerCart.setCoffee(listCoffees.get(0));
		registerCart.setQuantity(3);
		em.persist(registerCart);

		listUsers.forEach(em::persist);
		listCoffees.forEach(em::persist);

		createTestOrders(listUsers.get(0), listCoffees);

		if (setupTable == null) {
			setupTable = new SetupTable();
		}
		setupTable.setCompleted(true);
		em.merge(setupTable);
	}

	private void createTestOrders(User user, List<Coffee> coffees) {

		Order order1 = new Order();
		order1.setUser(user);
		order1.setFullName("Enner Valencia");
		order1.setAddress("Calle Principal 123");
		order1.setProvince("Madrid");
		order1.setSubtotal(37.50);
		order1.setIva(7.88);
		order1.setTotal(45.38);
		order1.setStatus(Order.Status.CONFIRMED);
		order1.setCreatedAt(new Date(System.currentTimeMillis() - 86400000L * 5)); // 5 días atrás
		order1.setCreditCardTitular("Enner Valencia");
		order1.setCreditCardNumber("************1234");
		order1.setCreditCardType("VISA");
		em.persist(order1);

		OrderItem item1_1 = new OrderItem();
		item1_1.setOrder(order1);
		item1_1.setCoffee(coffees.get(0)); // Colombia Supremo
		item1_1.setQuantity(2);
		item1_1.setUnitPrice(8.50);
		item1_1.setTotalPrice(17.00);
		em.persist(item1_1);

		OrderItem item1_2 = new OrderItem();
		item1_2.setOrder(order1);
		item1_2.setCoffee(coffees.get(1)); // Ethiopia Yirgacheffe
		item1_2.setQuantity(1);
		item1_2.setUnitPrice(12.00);
		item1_2.setTotalPrice(12.00);
		em.persist(item1_2);

		OrderItem item1_3 = new OrderItem();
		item1_3.setOrder(order1);
		item1_3.setCoffee(coffees.get(4)); // Guatemala Antigua
		item1_3.setQuantity(1);
		item1_3.setUnitPrice(9.50);
		item1_3.setTotalPrice(9.50);
		em.persist(item1_3);

		Order order2 = new Order();
		order2.setUser(user);
		order2.setFullName("Enner Valencia");
		order2.setAddress("Calle Principal 123");
		order2.setProvince("Madrid");
		order2.setSubtotal(22.00);
		order2.setIva(4.62);
		order2.setTotal(26.62);
		order2.setStatus(Order.Status.CONFIRMED);
		order2.setCreatedAt(new Date(System.currentTimeMillis() - 86400000L * 2)); // 2 días atrás
		order2.setCreditCardTitular("Enner Valencia");
		order2.setCreditCardNumber("************1234");
		order2.setCreditCardType("MASTERCARD");
		em.persist(order2);

		OrderItem item2_1 = new OrderItem();
		item2_1.setOrder(order2);
		item2_1.setCoffee(coffees.get(2)); // Kenya AA
		item2_1.setQuantity(2);
		item2_1.setUnitPrice(11.00);
		item2_1.setTotalPrice(22.00);
		em.persist(item2_1);

		Order order3 = new Order();
		order3.setUser(user);
		order3.setFullName("Enner Valencia");
		order3.setAddress("Calle Principal 123");
		order3.setProvince("Madrid");
		order3.setSubtotal(31.00);
		order3.setIva(6.51);
		order3.setTotal(37.51);
		order3.setStatus(Order.Status.CONFIRMED);
		order3.setCreatedAt(new Date()); // Hoy
		order3.setCreditCardTitular("Enner Valencia");
		order3.setCreditCardNumber("************5678");
		order3.setCreditCardType("VISA");
		em.persist(order3);

		OrderItem item3_1 = new OrderItem();
		item3_1.setOrder(order3);
		item3_1.setCoffee(coffees.get(5)); // Costa Rica Tarrazú
		item3_1.setQuantity(1);
		item3_1.setUnitPrice(10.00);
		item3_1.setTotalPrice(10.00);
		em.persist(item3_1);

		OrderItem item3_2 = new OrderItem();
		item3_2.setOrder(order3);
		item3_2.setCoffee(coffees.get(3)); // Brazil Santos
		item3_2.setQuantity(3);
		item3_2.setUnitPrice(7.00);
		item3_2.setTotalPrice(21.00);
		em.persist(item3_2);
	}
}
