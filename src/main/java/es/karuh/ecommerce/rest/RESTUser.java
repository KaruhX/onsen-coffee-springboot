package es.karuh.ecommerce.rest;

import es.karuh.ecommerce.model.User;
import es.karuh.ecommerce.service.UserSerivce;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class RESTUser {

    private final UserSerivce us;

	public RESTUser(UserSerivce us) {
		this.us = us;
	}

	@GetMapping("obtain")
    public List<User> obtainAllUsers() {
        return us.getAllUsers();
    }

    @PostMapping("register")
    public String registerUser(String username, String mail, String password) {
		if (us.getUserByMail(mail) != null) {
			return "error El correo ya está registrado";
		}
        System.out.println("Registering user: " + username + ", " + mail);
        us.registerUser(new User(username, password, mail));
        return "OK User registered successfully";
    }

    @PostMapping("login")
    public String loginUser(String mail, String password, HttpServletRequest request, HttpServletResponse response) {
        var user = us.getUserByMailPassword(mail, password);
        if (user != null) {
            request.getSession().setAttribute("userId", user.getId());

            Cookie cookie = new Cookie("loggedUser", String.valueOf(user.getId()));
            cookie.setMaxAge(7 * 24 * 60 * 60);
            cookie.setPath("/");
            cookie.setHttpOnly(false);
            response.addCookie(cookie);

            return "ok " + user.getNombre();
        } else {
            return "error Usuario o contraseña incorrectos";
        }
    }
}
