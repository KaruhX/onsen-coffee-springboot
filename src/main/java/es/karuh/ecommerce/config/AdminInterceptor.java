package es.karuh.ecommerce.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);

        // Verificar si la ruta requiere autenticación de admin
        String requestURI = request.getRequestURI();

        // Permitir acceso a la página de login de admin
        if (requestURI.contains("/admin/login")) {
            return true;
        }

        // Verificar si el usuario está autenticado como admin
        if (session != null && session.getAttribute("adminLoggedIn") != null &&
            (Boolean) session.getAttribute("adminLoggedIn")) {
            return true;
        }

        // Redirigir al login de admin si no está autenticado
        response.sendRedirect(request.getContextPath() + "/admin/login");
        return false;
    }
}

