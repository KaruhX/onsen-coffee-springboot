package es.karuh.ecommerce.controller.admin;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AdminLoginController {

	@GetMapping("/loginAdmin")
	public String loginAdmin() {
		return "admin/login-admin";
	}

	@PostMapping("/comprobarPassAdmin")
	public String comprobarPassAdmin(@RequestParam("pass") String pass, Model model, HttpServletRequest request) {
		if (pass != null && (pass.equals("Nelson2000") || pass.equals("1234"))) {
			request.getSession().setAttribute("adminLoggedIn", true);
			return "redirect:/admin/obtainCoffee";
		} else {
			model.addAttribute("mensaje", "Contraseña incorrecta");
			return "admin/login-admin";
		}
	}

	@GetMapping("/logoutAdmin")
	public String logoutAdmin(HttpServletRequest request) {
		request.getSession().removeAttribute("adminLoggedIn");
		request.getSession().invalidate();
		return "redirect:/";
	}
}
