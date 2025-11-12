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

        String requestURI = request.getRequestURI();

        if (requestURI.contains("/loginAdmin") || requestURI.contains("/comprobarPassAdmin")) {
            return true;
        }

        if (session != null && session.getAttribute("adminLoggedIn") != null &&
            (Boolean) session.getAttribute("adminLoggedIn")) {
            return true;
        }

        response.sendRedirect(request.getContextPath() + "/loginAdmin");
        return false;
    }
}

