package es.karuh.ecommerce.rest;

import es.karuh.ecommerce.model.Order;
import es.karuh.ecommerce.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class RestOrders {

    private final OrderService orderService;

    public RestOrders(OrderService orderService) {
        this.orderService = orderService;
    }

	@PostMapping("paso3")
	public String paso3 (HttpServletRequest req) {
		var userIdObj = req.getSession().getAttribute("userId");
		if (userIdObj == null) {
			return "error Usuario no autenticado";
		}
		int userId = (int) userIdObj;

		return orderService.confirmOrder(userId);
	}

    @PostMapping("/create")
    public String createOrder(@RequestBody(required = false) Map<String, Object> body, HttpServletRequest req) {
        var userIdObj = req.getSession().getAttribute("userId");
        if (userIdObj == null) {
            return "error Usuario no autenticado";
        }
        int userId = (int) userIdObj;
        String note = null;
        String shippingAddress = null;
        if (body != null) {
            if (body.get("note") != null) note = body.get("note").toString();
            if (body.get("shippingAddress") != null) shippingAddress = body.get("shippingAddress").toString();
        }
        return orderService.createOrder(userId, note, shippingAddress);
    }

    @PostMapping("/step1")
    public String createOrderStep1(@RequestBody Map<String, String> body, HttpServletRequest req) {
        var userIdObj = req.getSession().getAttribute("userId");
        if (userIdObj == null) {
            return "error Usuario no autenticado";
        }
        int userId = (int) userIdObj;

        String fullName = body.get("fullName");
        String email = body.get("email");
        String phone = body.get("phone");
        String address = body.get("address");
        String province = body.get("province");

        if (fullName == null || email == null || phone == null || address == null || province == null) {
            return "error Datos incompletos";
        }

        return orderService.createOrderStep1(userId, fullName, email, phone, address, province);
    }

    @PostMapping("/step2")
    public String addPaymentMethod(@RequestBody Map<String, String> body, HttpServletRequest req) {
        var userIdObj = req.getSession().getAttribute("userId");
        if (userIdObj == null) {
            return "error Usuario no autenticado";
        }
        int userId = (int) userIdObj;

        String creditCardTitular = body.get("creditCardTitular");
        String creditCardNumber = body.get("creditCardNumber");
        String creditCardType = body.get("creditCardType");

        if (creditCardTitular == null || creditCardNumber == null || creditCardType == null) {
            return "error Datos de pago incompletos";
        }

        return orderService.addPaymentMethod(userId, creditCardTitular, creditCardNumber, creditCardType);
    }

    @PostMapping("/step3")
    public String confirmOrder(HttpServletRequest req) {
        var userIdObj = req.getSession().getAttribute("userId");
        if (userIdObj == null) {
            return "error Usuario no autenticado";
        }
        int userId = (int) userIdObj;

        return orderService.confirmOrder(userId);
    }

    @GetMapping("/pending")
    public Map<String, Object> getPendingOrder(HttpServletRequest req) {
        var userIdObj = req.getSession().getAttribute("userId");
        Map<String, Object> response = new HashMap<>();

        if (userIdObj == null) {
            response.put("error", "Usuario no autenticado");
            return response;
        }
        int userId = (int) userIdObj;

        Order order = orderService.getPendingOrder(userId);
        if (order == null) {
            response.put("order", null);
        } else {
            response.put("order", orderToMap(order));
        }

        return response;
    }

    @GetMapping("/history")
    public Map<String, Object> getOrderHistory(HttpServletRequest req) {
        var userIdObj = req.getSession().getAttribute("userId");
        Map<String, Object> response = new HashMap<>();

        if (userIdObj == null) {
            response.put("error", "Usuario no autenticado");
            return response;
        }
        int userId = (int) userIdObj;

        List<Order> orders = orderService.getUserOrders(userId);
        response.put("orders", orders.stream().map(this::orderToMap).toList());

        return response;
    }

    private Map<String, Object> orderToMap(Order order) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", order.getId());
        map.put("fullName", order.getFullName());
        map.put("email", order.getEmail());
        map.put("phone", order.getPhone());
        map.put("address", order.getAddress());
        map.put("province", order.getProvince());
        map.put("subtotal", order.getSubtotal());
        map.put("iva", order.getIva());
        map.put("total", order.getTotal());
        map.put("status", order.getStatus().toString());
        map.put("createdAt", order.getCreatedAt());
        map.put("creditCardType", order.getCreditCardType());

        List<Map<String, Object>> items = order.getItems().stream().map(item -> {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("coffeeName", item.getCoffee().getCoffee_type());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("unitPrice", item.getUnitPrice());
            itemMap.put("totalPrice", item.getTotalPrice());
            return itemMap;
        }).toList();

        map.put("items", items);
        return map;
    }
}
