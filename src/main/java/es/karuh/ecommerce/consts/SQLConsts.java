package es.karuh.ecommerce.consts;

public class SQLConsts {
	// Seleccionamos únicamente los campos que usa la plantilla de la tienda
	public static final String SQL_OBTAIN_JSON_COFFEE= "SELECT c.id, c.coffee_type, c.origin, c.altitude, c.bitterness_level, c.price, c.description, c.stock FROM coffee_products c";
}
