package es.karuh.ecommerce.controller.admin;

import es.karuh.ecommerce.model.User;
import es.karuh.ecommerce.service.UserSerivce;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("admin")
public class UserController {

    private final UserSerivce userService;

    public UserController(UserSerivce userService) {
        this.userService = userService;
    }

    @GetMapping("/userAdminList")
    public String listUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "admin/user";
    }

    @GetMapping("/editUser")
    public String editUser(@RequestParam("id") Integer id, Model model) {
        User user = userService.getUserByID(id);
        if (user == null) {
            user = new User();
        }
        model.addAttribute("user", user);
        return "admin/user-edit";
    }

    @GetMapping("/registerUser")
    public String registerUser(Model model) {
        model.addAttribute("user", new User());
        return "admin/user-register";
    }

    @PostMapping("/deleteUser")
    public String deleteUser(@RequestParam("id") int id) {
        userService.deleteUser(id);
        return "redirect:/admin/userAdminList";
    }

    @PostMapping("/saveUser")
    public String saveUser(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("user", user);
        userService.registerUser(user);
        return "redirect:/admin/userAdminList";
    }

    @PostMapping("/saveEditUser")
    public String saveEditUser(@ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin/userAdminList";
    }
}
