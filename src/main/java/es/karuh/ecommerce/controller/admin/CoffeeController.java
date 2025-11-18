package es.karuh.ecommerce.controller.admin;

import es.karuh.ecommerce.model.Coffee;
import es.karuh.ecommerce.service.CoffeeService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@RequestMapping("admin")
public class CoffeeController {

    private final CoffeeService coffeeService;

	public CoffeeController(CoffeeService coffeeService) {
		this.coffeeService = coffeeService;
	}

	@GetMapping("/obtainCoffee")
    public String listCoffees(Model model) {
        model.addAttribute("coffees", coffeeService.getAllCoffees());
        return "admin/coffee";
    }

    @GetMapping("/editCoffee")
    public String editCoffee(@RequestParam("id") Integer id, Model model) {
        var coffee = coffeeService.getCoffeeById(id);
        model.addAttribute("coffee", coffee);
        return "admin/coffee-edit";
    }

    @GetMapping("/registerCoffee")
    public String registerCoffee(Model model) {
        model.addAttribute("coffee", new Coffee());
        return "admin/coffee-register";
    }

    @PostMapping("/deleteCoffee")
    public String deleteCoffee(@RequestParam("id") int id) {
        coffeeService.deleteCoffee(id);
        return "redirect:/admin/obtainCoffee";
    }

    @PostMapping("/saveCoffee")
    public String saveCoffee(@ModelAttribute("coffee") @Valid Coffee coffee, BindingResult res, Model model) throws IOException {
		if (res.hasErrors()) {
			return "admin/coffee-register";
		}
        model.addAttribute("coffee", coffee);
        coffeeService.registerCoffee(coffee);
        return "redirect:/admin/obtainCoffee";
    }

    @PostMapping("/saveEditCoffee")
    public String saveEditCoffee(@ModelAttribute("coffee") Coffee coffee, Model model) throws IOException {
        coffeeService.updateCoffee(coffee);
        return "redirect:/admin/obtainCoffee";
    }
}
