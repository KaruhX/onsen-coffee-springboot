package es.karuh.ecommerce.service;

import es.karuh.ecommerce.model.User;

import java.util.List;

public interface UserSerivce {
    void registerUser(User user);
    List<User> getAllUsers();
    void deleteUser(int id);
    User getUserByID(int id);
    void updateUser(User user);
    User getUserByMailPassword(String mail, String password);
	User getUserByMail(String mail);
}