package es.karuh.ecommerce.controller.admin;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/admin")
public class AdminLoginController {

    private static final String ADMIN_PASSWORD = "Nelson2000";

    @GetMapping("/login")
    public String showLoginPage(HttpSession session, Model model) {
        // Si ya está logueado, redirigir al panel de admin
        if (session.getAttribute("adminLoggedIn") != null &&
            (Boolean) session.getAttribute("adminLoggedIn")) {
            return "redirect:/admin/obtainCoffee";
        }
        return "admin/login-admin";
    }

    @PostMapping("/doLogin")
    public String doLogin(@RequestParam("password") String password,
                         HttpSession session,
                         Model model) {

        // Verificar contraseña de admin
        if (ADMIN_PASSWORD.equals(password)) {
            // Establecer atributos de sesión
            session.setAttribute("adminLoggedIn", true);
            session.setAttribute("adminUser", "Administrador");

            return "redirect:/admin/obtainCoffee";
        } else {
            model.addAttribute("error", "Contraseña incorrecta");
            return "admin/login-admin";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/admin/login";
    }
}

