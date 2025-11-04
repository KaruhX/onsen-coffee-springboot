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

	@PostMapping("/update")
	public String updateQuantity(@RequestParam("productId") int productId, @RequestParam("quantity") int quantity, HttpServletRequest req) {
		try {
			var userIdObj = req.getSession().getAttribute("userId");
			if (userIdObj == null) {
				return "error Usuario no autenticado";
			}

			int userId = (int) userIdObj;

			if (quantity <= 0) {
				return "error La cantidad debe ser mayor a 0";
			}

			cs.updateQuantity(userId, productId, quantity);
			return "ok Cantidad actualizada correctamente";
		} catch (Exception e) {
			return "error " + e.getMessage();
		}
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
		} catch (Exception e) {
			return "error " + e.getMessage();
		}
	}

	@PostMapping("/clear")
	public String clearCart(HttpServletRequest req) {
		try {
			var userIdObj = req.getSession().getAttribute("userId");
			if (userIdObj == null) {
				return "error Usuario no autenticado";
			}

			int userId = (int) userIdObj;

			cs.clearCart(userId);
			return "ok Carrito vaciado correctamente";
		} catch (Exception e) {
			return "error " + e.getMessage();
		}
	}

	@PostMapping("/checkout")
	public String checkout(HttpServletRequest req) {
		try {
			var userIdObj = req.getSession().getAttribute("userId");
			if (userIdObj == null) {
				return "error Usuario no autenticado";
			}

			int userId = (int) userIdObj;

			// Aquí podrías implementar la lógica de pedido real
			// Por ahora, simplemente vaciamos el carrito
			cs.clearCart(userId);

			return "ok Pedido procesado correctamente. ¡Gracias por tu compra!";
		} catch (Exception e) {
			return "error " + e.getMessage();
		}
	}
}
