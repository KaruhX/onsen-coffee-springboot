package es.karuh.ecommerce.rest;


import es.karuh.ecommerce.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class RestCart {

	private final CartService cs;

	public RestCart(CartService cs) {
		this.cs = cs;
	}

	@PostMapping("/add")
	public String addToCart(@RequestParam("productId") int productId, @RequestParam("quantity") int quantity, HttpServletRequest req) {
		try {
			var userIdObj = req.getSession().getAttribute("userId");
			if (userIdObj == null) {
				return "error Usuario no autenticado";
			}

			int userId = (int) userIdObj;

			if (quantity <= 0) {
				return "error La cantidad debe ser mayor a 0";
			}

			cs.addProduct(userId, productId, quantity);
			return "ok Producto añadido al carrito";
		} catch (Exception e) {
			return "error " + e.getMessage();
		}
	}

	@RequestMapping("/obtain")
	public List<Map<String, Object>> obtain(HttpServletRequest request) {
		var userId = (int) request.getSession().getAttribute("userId");
		return cs.obtain(userId);
	}

	@GetMapping("/items")
	public Map<String, Object> getCartItems(HttpServletRequest request) {
		var userIdObj = request.getSession().getAttribute("userId");
		if (userIdObj == null) {
			return Map.of("error", "Usuario no autenticado");
		}
		int userId = (int) userIdObj;
		List<Map<String, Object>> items = cs.obtain(userId);
		return Map.of("items", items);
	}

	@PostMapping("/remove")
	public String removeFromCart(@RequestParam("productId") int productId, HttpServletRequest req) {
		try {
			var userIdObj = req.getSession().getAttribute("userId");
			if (userIdObj == null) {
				return "error Usuario no autenticado";
			}

			int userId = (int) userIdObj;

			cs.removeProduct(userId, productId);
			return "ok Producto eliminado del carrito";
		} catch (RuntimeException e) {
			return "error " + e.getMessage();
		} catch (Exception e) {
			return "error Error al eliminar el producto";
		}
	}
}
