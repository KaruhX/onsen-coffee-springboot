package es.karuh.ecommerce.controller.image;

import es.karuh.ecommerce.service.CoffeeService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

@Controller
public class ShowProductImage {
    private final CoffeeService coffeeService;

    public ShowProductImage(CoffeeService coffeeService) {
        this.coffeeService = coffeeService;
    }

    @RequestMapping("show-image")
    public void showImage(@RequestParam("id") Integer id, HttpServletResponse response) throws IOException {
        var coffee = coffeeService.getCoffeeById(id);
        byte[] info = (coffee != null) ? coffee.getImageData() : null;
		if (info == null || info.length == 0) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		response.setContentType("image/webp");
		response.getOutputStream().write(info);
		response.getOutputStream().close();
    }

    @RequestMapping("show-image-2")
    public void showImage2(@RequestParam("id") Integer id, HttpServletResponse response) throws IOException {
        var coffee = coffeeService.getCoffeeById(id);
        byte[] info = (coffee != null) ? coffee.getImageData2() : null;
		if (info == null || info.length == 0) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		response.setContentType("image/webp");
		response.getOutputStream().write(info);
		response.getOutputStream().close();
    }

    @RequestMapping("show-image-3")
    public void showImage3(@RequestParam("id") Integer id, HttpServletResponse response) throws IOException {
        var coffee = coffeeService.getCoffeeById(id);
        byte[] info = (coffee != null) ? coffee.getImageData3() : null;
		if (info == null || info.length == 0) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		response.setContentType("image/webp");
		response.getOutputStream().write(info);
		response.getOutputStream().close();
    }

    @RequestMapping("show-thumbnail")
    public void showThumbnail(@RequestParam("id") Integer id, HttpServletResponse response) throws IOException {
        var coffee = coffeeService.getCoffeeById(id);

        byte[] info = null;

        if (coffee != null) {
            info = coffee.getThumbnail();
            if (info == null || info.length == 0) {
                info = coffee.getImageData();
            }
        }

        // Si no hay imagen, cargar imagen por defecto
        if (info == null || info.length == 0) {
            var defaultImage = getClass().getResourceAsStream("/static/assets/default-coffee.jpg");
            if (defaultImage != null) {
                info = defaultImage.readAllBytes();
                defaultImage.close();
            }
        }
		if (info == null || info.length == 0) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        response.setContentType("image/jpeg");
        response.getOutputStream().write(info);
        response.getOutputStream().flush();
    }
}
