package es.karuh.ecommerce.setup;

import es.karuh.ecommerce.model.Cart;
import es.karuh.ecommerce.model.Coffee;
import es.karuh.ecommerce.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

		if (setupTable == null) {
			setupTable = new SetupTable();
		}
		setupTable.setCompleted(true);
		em.merge(setupTable);
	}
}
