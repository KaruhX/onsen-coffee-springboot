package es.karuh.ecommerce.consts;

public class SQLConsts {
	// Seleccionamos únicamente los campos que usa la plantilla de la tienda
	public static final String SQL_OBTAIN_JSON_COFFEE = "SELECT c.id, c.coffee_type, c.origin, c.altitude, c.bitterness_level, c.price, c.description, c.stock FROM coffee_products c";
	public static final String SQL_OBTAIN_CART_PRODUCTS = "SELECT "
			+ "cart.user_id, cp.coffee_type, cp.id AS coffee_id, cp.price, cp.description, cart.quantity, cp.origin, cp.altitude, cp.bitterness_level, cp.stock "
			+ "FROM cart "
			+ "INNER JOIN coffee_products cp ON cp.id = cart.coffee_id "
			+ "WHERE cart.user_id = ?";
}