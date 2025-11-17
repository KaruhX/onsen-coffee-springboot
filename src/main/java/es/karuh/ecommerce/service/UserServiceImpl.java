package es.karuh.ecommerce.service;

import es.karuh.ecommerce.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserSerivce {
    @PersistenceContext
    private EntityManager em;

    @Override
    public void registerUser(User user) {
        try {
            em.persist(user);
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar usuario: " + e.getMessage());
        }
    }

    @Override
    public List<User> getAllUsers() {
        try {
            return em.createQuery("from User usuario", User.class).getResultList();
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener usuarios: " + e.getMessage());
        }
    }

    @Override
    public void deleteUser(int id) {
        try {
            User user = em.find(User.class, id);
            if (user != null) {
                em.remove(user);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar usuario: " + e.getMessage());
        }
    }

    @Override
    public User getUserByID(int id) {
        try {
            return em.find(User.class, id);
        } catch (Exception e) {
            throw new RuntimeException("Error al buscar usuario: " + e.getMessage());
        }
    }

    @Override
    public void updateUser(User user) {
        try {
            em.merge(user);
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar usuario: " + e.getMessage());
        }
    }

    @Override
    public User getUserByMailPassword(String mail, String password) {
        try {
            return em.createQuery("from User usuario where usuario.email = :mail and usuario.pass = :password", User.class)
                    .setParameter("mail", mail)
                    .setParameter("password", password)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Error al buscar usuario por email y contraseña: " + e.getMessage());
        }
    }

	@Override
	public User getUserByMail(String mail) {
        try {
            return em.createQuery("from User usuario where usuario.email = :mail", User.class)
                    .setParameter("mail", mail)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Error al buscar usuario por email: " + e.getMessage());
        }
	}
}
