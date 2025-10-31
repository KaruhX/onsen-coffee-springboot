package es.karuh.ecommerce.rest;


import es.karuh.ecommerce.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
