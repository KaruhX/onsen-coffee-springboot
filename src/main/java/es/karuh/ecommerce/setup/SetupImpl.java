package es.karuh.ecommerce.setup;

import es.karuh.ecommerce.model.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class SetupImpl implements Setup {

	@PersistenceContext
	private EntityManager em;

	private static final String ASSETS_PATH = "src/main/resources/static/assets/";

	@Override
	public void runSetup() {
		SetupTable setupTable = getOrCreateSetupTable();

		if (setupTable.isCompleted()) {
			System.out.println("Setup already completed. Skipping initialization.");
			return;
		}

		System.out.println("Starting database setup...");

		// Create and persist categories first
		List<Category> categories = createCategories();
		System.out.println("Persisting " + categories.size() + " categories...");
		for (Category category : categories) {
			em.persist(category);
			em.flush(); // Ensure category is persisted before using it
		}
		System.out.println("Categories created successfully!");

		List<Coffee> coffees = createCoffeeProducts(categories);
		List<User> users = createUsers();

		// Persist all entities
		persistEntities(coffees, users);

		// Create sample data
		createSampleCart(users.getFirst(), coffees.getFirst());
		createTestOrders(users.getFirst(), coffees);

		// Mark setup as completed
		setupTable.setCompleted(true);
		em.merge(setupTable);

		System.out.println("Database setup completed successfully!");
	}

	// ==================== Setup Helper Methods ====================

	private SetupTable getOrCreateSetupTable() {
		try {
			return em.createQuery("SELECT s FROM SetupTable s", SetupTable.class).getSingleResult();
		} catch (Exception e) {
			return new SetupTable();
		}
	}

	// ==================== Category Creation Methods ====================

	private List<Category> createCategories() {
		return List.of(
				new Category("Premium Origin", "Cafés excepcionales de origen único con características extraordinarias"),
				new Category("Special Edition", "Ediciones limitadas y cafés exóticos de regiones especiales"),
				new Category("Classic", "Cafés clásicos y populares de las mejores regiones cafeteras"),
				new Category("Dark Roast", "Cafés intensos con tueste oscuro y cuerpo robusto"),
				new Category("Light Roast", "Cafés suaves con tueste claro y perfiles aromáticos delicados")
		);
	}

	// ==================== Image Helper Methods ====================

	private byte[] loadImageFromAssets(String imageName) {
		try {
			String imagePath = ASSETS_PATH + imageName;
			File imageFile = new File(imagePath);
			if (imageFile.exists()) {
				return Files.readAllBytes(Paths.get(imagePath));
			} else {
				System.out.println("Image not found: " + imagePath + ", using default");
				return Files.readAllBytes(Paths.get(ASSETS_PATH + "default-coffee.jpg"));
			}
		} catch (IOException e) {
			System.err.println("Error loading image: " + imageName);
			return null;
		}
	}

	private byte[] createThumbnail(byte[] imageData) {
		try {
			BufferedImage originalImage = ImageIO.read(new java.io.ByteArrayInputStream(imageData));
			BufferedImage thumbnail = new BufferedImage(80, 80, BufferedImage.TYPE_INT_RGB);
			Graphics2D g = thumbnail.createGraphics();
			g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
			g.drawImage(originalImage, 0, 0, 80, 80, null);
			g.dispose();

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(thumbnail, "jpg", baos);
			return baos.toByteArray();
		} catch (IOException e) {
			System.err.println("Error creating thumbnail");
			return imageData;
		}
	}

	private void setImagesForCoffee(Coffee coffee, String imageName) {
		byte[] imageData = loadImageFromAssets(imageName);
		if (imageData != null) {
			coffee.setImageData(imageData);
			coffee.setImageData2(imageData);
			coffee.setImageData3(imageData);
			coffee.setThumbnail(createThumbnail(imageData));
		}
	}

	private Coffee createCoffee(String type, String origin, int altitude, int bitterness,
	                            double price, String description, int stock,
	                            Category category, String imageName) {
		Coffee coffee = new Coffee(type, origin, altitude, bitterness, price, description, stock);
		coffee.setCategory(category);
		setImagesForCoffee(coffee, imageName);
		return coffee;
	}

	// ==================== Coffee Creation Methods ====================

	private List<Coffee> createCoffeeProducts(List<Category> categories) {
		List<Coffee> coffees = new ArrayList<>();
		coffees.addAll(createPremiumOriginCoffees(categories.get(0)));
		coffees.addAll(createSpecialEditionCoffees(categories.get(1)));
		coffees.addAll(createClassicCoffees(categories.get(2)));
		coffees.addAll(createDarkRoastCoffees(categories.get(3)));
		coffees.addAll(createLightRoastCoffees(categories.get(4)));
		return coffees;
	}

	private List<Coffee> createPremiumOriginCoffees(Category category) {
		return List.of(
				createCoffee("Geisha Panamá Volcán Barú", "Panamá", 1800, 1, 28.50,
						"Café excepcional con notas florales de jazmín, bergamota y mango. Cultivado en las laderas del volcán Barú, es considerado uno de los mejores cafés del mundo.",
						8, category, "1.jpg"),
				createCoffee("Blue Mountain Jamaica", "Jamaica", 2100, 2, 32.00,
						"Café suave y equilibrado con baja acidez. Notas de chocolate suizo, frutos secos y un final dulce prolongado. Cultivado en las Montañas Azules de Jamaica.",
						5, category, "5.jpg"),
				createCoffee("Kona Extra Fancy Hawaii", "Estados Unidos (Hawaii)", 900, 2, 26.00,
						"Café cultivado en las laderas volcánicas de Hawái. Sabor rico y suave con notas de caramelo, especias y un toque de frutos tropicales.",
						6, category, "15.jpg")
		);
	}

	private List<Coffee> createSpecialEditionCoffees(Category category) {
		return List.of(
				createCoffee("Ethiopia Yirgacheffe Natural", "Etiopía", 2000, 1, 14.50,
						"Proceso natural que realza sus notas frutales. Aromas a arándanos, fresas, vino tinto y un toque floral de jazmín. Acidez brillante y vibrante.",
						15, category, "30.jpg"),
				createCoffee("Kenya AA Nyeri", "Kenia", 1800, 3, 13.00,
						"Café keniano de grado AA con acidez pronunciada y compleja. Notas de grosella negra, tomate cherry, cítricos y un final vinoso.",
						12, category, "1.jpg"),
				createCoffee("Yemen Mocha Port", "Yemen", 2200, 4, 22.00,
						"Café histórico de la cuna del café. Sabor complejo con notas de chocolate oscuro, especias, vino tinto y frutas secas. Perfil único e inigualable.",
						7, category, "5.jpg")
		);
	}

	private List<Coffee> createClassicCoffees(Category category) {
		return List.of(
				createCoffee("Colombia Supremo Huila", "Colombia", 1650, 3, 9.50,
						"Clásico colombiano con cuerpo medio y equilibrio perfecto. Notas de caramelo, chocolate con leche, y frutas rojas maduras. Acidez brillante y limpia.",
						30, category, "15.jpg"),
				createCoffee("Guatemala Antigua SHB", "Guatemala", 1550, 3, 10.50,
						"Café cultivado en suelo volcánico. Cuerpo completo con notas de chocolate amargo, especias dulces, y un toque ahumado característico de la región.",
						25, category, "30.jpg"),
				createCoffee("Costa Rica Tarrazú", "Costa Rica", 1700, 2, 11.00,
						"Café limpio y brillante con acidez cítrica. Notas de miel, almendra, cacao y un final dulce persistente. Perfil clásico centroamericano.",
						20, category, "1.jpg"),
				createCoffee("Brazil Santos NY2", "Brasil", 1100, 2, 8.00,
						"Café brasileño suave y dulce. Notas de chocolate, nuez, caramelo y un cuerpo cremoso. Ideal para espresso y bebidas con leche.",
						35, category, "5.jpg")
		);
	}

	private List<Coffee> createDarkRoastCoffees(Category category) {
		return List.of(
				createCoffee("Sumatra Mandheling", "Indonesia", 1200, 5, 12.50,
						"Café procesado húmedo con cuerpo pesado y terroso. Notas de cedro, tabaco, chocolate amargo y hierbas. Baja acidez y sabor intenso.",
						18, category, "15.jpg"),
				createCoffee("Sulawesi Toraja", "Indonesia", 1400, 4, 14.00,
						"Café exótico de Sulawesi con cuerpo denso. Notas de madera de cedro, frutas tropicales maduras, chocolate oscuro y especias.",
						10, category, "30.jpg"),
				createCoffee("Vietnam Robusta Premium", "Vietnam", 800, 5, 7.50,
						"Robusta de alta calidad con cuerpo intenso. Notas de cacao amargo, frutos secos tostados y un final persistente. Alto contenido de cafeína.",
						40, category, "1.jpg")
		);
	}

	private List<Coffee> createLightRoastCoffees(Category category) {
		return List.of(
				createCoffee("Rwanda Bourbon Red Mountain", "Ruanda", 1900, 2, 13.50,
						"Café africano suave con acidez brillante. Notas de frutas cítricas, té negro, caramelo y un final floral delicado.",
						14, category, "5.jpg"),
				createCoffee("El Salvador Pacamara", "El Salvador", 1500, 2, 12.00,
						"Variedad Pacamara con granos grandes. Sabor complejo con notas de frutas tropicales, chocolate blanco, flores y miel de abeja.",
						16, category, "15.jpg"),
				createCoffee("Honduras Marcala", "Honduras", 1400, 3, 9.00,
						"Café hondureño con perfil dulce y equilibrado. Notas de caramelo, almendra, vainilla y frutas secas. Cuerpo medio y acidez suave.",
						28, category, "30.jpg")
		);
	}

	// ==================== User Creation Methods ====================

	private List<User> createUsers() {
		return List.of(
				new User("Enner Valencia", "Nelson2000", "enner.valencia@example.com"),
				new User("María López García", "mariaSecure1", "maria.lopez@example.com"),
				new User("William Pacho", "williamPass456", "william.pacho@example.com"),
				new User("Ana Torres Ruiz", "anaPass789", "ana.torres@example.com"),
				new User("Carlos Ruiz Mendoza", "carlosR2025", "carlos.ruiz@example.com"),
				new User("Lucía Gómez Fernández", "lucia!G", "lucia.gomez@example.com"),
				new User("Diego Fernández Silva", "diego_fern", "diego.fernandez@example.com"),
				new User("Sofía Morales Castro", "sofiaLoveCoffee", "sofia.morales@example.com"),
				new User("Mateo Rojas Pérez", "mateoR#01", "mateo.rojas@example.com"),
				new User("Valeria Pérez Jiménez", "valeriaPwd", "valeria.perez@example.com")
		);
	}

	// ==================== Persistence Methods ====================

	private void persistEntities(List<Coffee> coffees, List<User> users) {
		System.out.println("Persisting " + users.size() + " users...");
		users.forEach(em::persist);

		System.out.println("Persisting " + coffees.size() + " coffee products...");
		coffees.forEach(em::persist);
	}

	private void createSampleCart(User user, Coffee coffee) {
		Cart sampleCart = new Cart();
		sampleCart.setUser(user);
		sampleCart.setCoffee(coffee);
		sampleCart.setQuantity(3);
		em.persist(sampleCart);
		System.out.println("Sample cart created for user: " + user.getNombre());
	}

	// ==================== Test Orders Creation ====================

	private void createTestOrders(User user, List<Coffee> coffees) {
		System.out.println("Creating test orders for user: " + user.getNombre());

		createOrder1(user, coffees); // Order from 5 days ago
		createOrder2(user, coffees); // Order from 2 days ago
		createOrder3(user, coffees); // Order from today

		System.out.println("Test orders created successfully!");
	}

	/**
	 * Order 1: Premium coffee order from 5 days ago
	 * Contains: Geisha Panama, Ethiopia Yirgacheffe, Blue Mountain Jamaica
	 */
	private void createOrder1(User user, List<Coffee> coffees) {
		Order order = new Order();
		order.setUser(user);
		order.setFullName("Enner Valencia");
		order.setAddress("Calle Principal 123, Apto 4B");
		order.setProvince("Madrid");
		order.setStatus(Order.Status.CONFIRMED);
		order.setCreatedAt(new Date(System.currentTimeMillis() - 86400000L * 5)); // 5 días atrás
		order.setCreditCardTitular("Enner Valencia");
		order.setCreditCardNumber("************1234");
		order.setCreditCardType("VISA");

		// Items for Order 1
		List<OrderItem> items = List.of(
				createOrderItem(order, coffees.get(0), 1, 28.50),  // Geisha Panamá
				createOrderItem(order, coffees.get(3), 2, 14.50),  // Ethiopia Yirgacheffe
				createOrderItem(order, coffees.get(1), 1, 32.00)   // Blue Mountain Jamaica
		);

		double subtotal = items.stream().mapToDouble(OrderItem::getTotalPrice).sum();
		order.setSubtotal(subtotal);
		order.setIva(subtotal * 0.21);
		order.setTotal(subtotal + order.getIva());

		em.persist(order);
		items.forEach(em::persist);
	}

	/**
	 * Order 2: Classic coffees order from 2 days ago
	 * Contains: Kenya AA, Colombia Supremo, Guatemala Antigua
	 */
	private void createOrder2(User user, List<Coffee> coffees) {
		Order order = new Order();
		order.setUser(user);
		order.setFullName("Enner Valencia");
		order.setAddress("Calle Principal 123, Apto 4B");
		order.setProvince("Madrid");
		order.setStatus(Order.Status.CONFIRMED);
		order.setCreatedAt(new Date(System.currentTimeMillis() - 86400000L * 2)); // 2 días atrás
		order.setCreditCardTitular("Enner Valencia");
		order.setCreditCardNumber("************1234");
		order.setCreditCardType("MASTERCARD");

		// Items for Order 2
		List<OrderItem> items = List.of(
				createOrderItem(order, coffees.get(4), 2, 13.00),  // Kenya AA
				createOrderItem(order, coffees.get(6), 1, 9.50),   // Colombia Supremo
				createOrderItem(order, coffees.get(7), 1, 10.50)   // Guatemala Antigua
		);

		double subtotal = items.stream().mapToDouble(OrderItem::getTotalPrice).sum();
		order.setSubtotal(subtotal);
		order.setIva(subtotal * 0.21);
		order.setTotal(subtotal + order.getIva());

		em.persist(order);
		items.forEach(em::persist);
	}

	/**
	 * Order 3: Mixed variety order from today
	 * Contains: Costa Rica Tarrazú, Brazil Santos, Sumatra Mandheling
	 */
	private void createOrder3(User user, List<Coffee> coffees) {
		Order order = new Order();
		order.setUser(user);
		order.setFullName("Enner Valencia");
		order.setAddress("Calle Principal 123, Apto 4B");
		order.setProvince("Madrid");
		order.setStatus(Order.Status.CONFIRMED);
		order.setCreatedAt(new Date()); // Hoy
		order.setCreditCardTitular("Enner Valencia");
		order.setCreditCardNumber("************5678");
		order.setCreditCardType("VISA");

		// Items for Order 3
		List<OrderItem> items = List.of(
				createOrderItem(order, coffees.get(8), 2, 11.00),  // Costa Rica Tarrazú
				createOrderItem(order, coffees.get(9), 3, 8.00),   // Brazil Santos
				createOrderItem(order, coffees.get(10), 1, 12.50)  // Sumatra Mandheling
		);

		double subtotal = items.stream().mapToDouble(OrderItem::getTotalPrice).sum();
		order.setSubtotal(subtotal);
		order.setIva(subtotal * 0.21);
		order.setTotal(subtotal + order.getIva());

		em.persist(order);
		items.forEach(em::persist);
	}

	/**
	 * Helper method to create an order item
	 */
	private OrderItem createOrderItem(Order order, Coffee coffee, int quantity, double unitPrice) {
		OrderItem item = new OrderItem();
		item.setOrder(order);
		item.setCoffee(coffee);
		item.setQuantity(quantity);
		item.setUnitPrice(unitPrice);
		item.setTotalPrice(unitPrice * quantity);
		return item;
	}
}
