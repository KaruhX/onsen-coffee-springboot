package es.karuh.ecommerce.rest;

import es.karuh.ecommerce.model.User;
import es.karuh.ecommerce.service.UserSerivce;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class RESTUser {
    @Autowired
    private UserSerivce us;

    @RequestMapping("obtain")
    public List<User> obtainAllUsers() {
        return us.getAllUsers();
    }

    @RequestMapping("register")
    public String registerUser(String username, String mail, String nombre,
                                               String direccion, String password) {
		if (us.getUserByMail(mail) != null) {
			return "error El correo ya está registrado";
		}
        System.out.println("Registering user: " + username + ", " + mail + ", " + nombre + ", " + direccion);
        us.registerUser(new User(username,mail, password));
        return "OK User registered successfully";
    }

    @RequestMapping("login")
    public String loginUser(String mail, String password) {
        User user = us.getUserByMailPassword(mail, password);
        if (user != null) {
            return "ok " + user.getNombre();
        } else {
            return "error Usuario o contraseña incorrectos";
        }
    }
}
