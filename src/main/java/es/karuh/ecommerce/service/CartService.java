package es.karuh.ecommerce.service;

public interface CartService {
	void addProduct(int userId, int productId, int quantity);

}
