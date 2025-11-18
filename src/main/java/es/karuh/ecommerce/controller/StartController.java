package es.karuh.ecommerce.controller;

import es.karuh.ecommerce.setup.Setup;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class StartController {

	private final MessageSource ms;

	private final Setup setup;
	public StartController(Setup setup, MessageSource ms) {
		this.setup = setup;
		this.ms = ms;
	}

	@RequestMapping()
    public String start() {
		var lang = ms.getMessage("lang", null, LocaleContextHolder.getLocale());
		setup.runSetup();
        return "index_" + lang;
    }

	@GetMapping("/products")
	public String products() {
		var lang = ms.getMessage("lang", null, LocaleContextHolder.getLocale());
		return "products_" + lang;
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
