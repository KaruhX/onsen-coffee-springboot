package es.karuh.ecommerce.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
@Controller
public class CustomErrorController implements ErrorController {
	private static final Logger lg = LoggerFactory.getLogger(CustomErrorController.class);

	@RequestMapping("/error")
	public String handleError(HttpServletRequest request, Model model) {String requestUri = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);

		if (requestUri != null && requestUri.startsWith("/api/")) {
			return null;
		}

		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		var errorMessage = "Ha ocurrido un error inesperado";

		if (status != null) {
			int statusCode = Integer.parseInt(status.toString());

			if (statusCode == HttpStatus.NOT_FOUND.value()) {
				errorMessage = "Página no encontrada (Error 404)";
			} else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
				errorMessage = "Error interno del servidor (Error 500)";
			} else if (statusCode == HttpStatus.FORBIDDEN.value()) {
				errorMessage = "Acceso denegado (Error 403)";
			} else if (statusCode == HttpStatus.BAD_REQUEST.value()) {
				errorMessage = "Solicitud incorrecta (Error 400)";
			} else {
				errorMessage = "Error " + statusCode;
			}

			lg.error("Error HTTP {}: {}", statusCode, errorMessage);
		}

		model.addAttribute("errorMessage", errorMessage);
		return "error";
	}

	@ExceptionHandler(Throwable.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public String exception(final Throwable throwable, final Model model) {
		lg.error("Exception caught: ", throwable);
		String errorMessage = (throwable != null ? throwable.getMessage() : "Error desconocido");
		model.addAttribute("errorMessage", errorMessage);
		return "error";
	}
}
