package es.karuh.ecommerce.controller;

import es.karuh.ecommerce.setup.Setup;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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
}
