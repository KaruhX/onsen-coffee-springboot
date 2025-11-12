package es.karuh.ecommerce.service;

import java.util.List;
import java.util.Map;

public interface CartService {
	void addProduct(int userId, int productId, int quantity);
	List<Map<String, Object>> obtain(int userId);
	void removeProduct(int userId, int productId);
}
