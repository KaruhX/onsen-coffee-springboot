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
        return "products";
    }

	@GetMapping("/coffee-detail")
	public String coffeeDetail(@RequestParam("id") Integer id, Model model) {
		model.addAttribute("coffeeId", id);
		return "coffee-detail";
	}
}
