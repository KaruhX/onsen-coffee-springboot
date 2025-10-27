package es.karuh.ecommerce.controller.admin;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AdminLogin {

	private final CoffeeController coffeeController;

	public AdminLogin(CoffeeController coffeeController) {
		this.coffeeController = coffeeController;
	}

	@RequestMapping("loginAdmin")
	public String loginAdmin() {
		return "admin/login-admin";
	}

	@RequestMapping("comprobarPassAdmin")
	public String comprobarPassAdmin(String pass, Model model, HttpServletRequest request) {
		if(pass.equals("Nelson2000")) {
			request.getSession().setAttribute("admin","ok");
			return coffeeController.listCoffees(model);
		}else {
			model.addAttribute("mensaje","Contraseña incorrecta");
			return "admin/login-admin";
		}
	}

	@RequestMapping("logoutAdmin")
	public String logoutAdmin(HttpServletRequest request){
		request.getSession().removeAttribute("admin");
		request.getSession().invalidate();
		return "redirect:/";
	}
}
