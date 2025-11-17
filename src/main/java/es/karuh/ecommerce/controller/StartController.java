package es.karuh.ecommerce.controller;

import es.karuh.ecommerce.setup.Setup;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class StartController {

	private final Setup setup;
	public StartController(Setup setup) {
		this.setup = setup;
	}

	@RequestMapping()
    public String start() {
		setup.runSetup();
        return "index";
    }

	@GetMapping("/products")
	public String products() {
		return "products";
	}

	@GetMapping("/coffee-detail")
	public String coffeeDetail(@RequestParam("id") Integer id, Model model) {
		model.addAttribute("coffeeId", id);
		return "coffee-detail";
	}

	@GetMapping("/checkout")
	public String checkout() {
		return "order-checkout";
	}

	@GetMapping("/orders")
	public String orders() {
		return "order-history";
	}

	@GetMapping("/order-history")
	public String orderHistory() {
		return "order-history";
	}

}
