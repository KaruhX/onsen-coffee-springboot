package es.karuh.ecommerce.rest;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class RestCart {
	@RequestMapping("/add")
	public String addToCart(@RequestParam("productId") int productId, @RequestParam("quantity") int quantity, HttpServletRequest req) {
		int userId = req.getSession().getAttribute("userId") != null ? (int) req.getSession().getAttribute("userId") : 0;
		return "Producto " + productId + " agregado al carrito del usuario " + userId + " con cantidad " + quantity;
	}
}
