package es.karuh.ecommerce.controller.admin;

import es.karuh.ecommerce.model.Order;
import es.karuh.ecommerce.service.OrderService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin/orders")
public class OrderController {

	private final OrderService os;

	public OrderController(OrderService os) {
		this.os = os;
	}

	@GetMapping("obtainOrders")
	public String obtainOrders(
			Model model,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "q", required = false) String query,
			@RequestParam(value = "sort", required = false, defaultValue = "desc") String sort
	) {
		List<Order> all = os.getAllOrders();

		List<Order> filtered = all;
		if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
			try {
				Order.Status st = Order.Status.valueOf(status.toUpperCase(Locale.ROOT));
				filtered = filtered.stream().filter(o -> o.getStatus() == st).collect(Collectors.toList());
			} catch (IllegalArgumentException ex) {

			}
		}

		if (query != null && !query.isBlank()) {
			String q = query.toLowerCase(Locale.ROOT);
			filtered = filtered.stream().filter(o ->
					(o.getFullName() != null && o.getFullName().toLowerCase(Locale.ROOT).contains(q)) ||
					(o.getUser() != null && o.getUser().getEmail() != null && o.getUser().getEmail().toLowerCase(Locale.ROOT).contains(q)) ||
					(o.getAddress() != null && o.getAddress().toLowerCase(Locale.ROOT).contains(q)) ||
					(o.getProvince() != null && o.getProvince().toLowerCase(Locale.ROOT).contains(q))
			).collect(Collectors.toList());
		}

		Comparator<Order> cmp = Comparator.comparing(o -> Objects.requireNonNullElse(o.getCreatedAt(), new java.util.Date(0L)));
		if ("asc".equalsIgnoreCase(sort)) {
			filtered = filtered.stream().sorted(cmp).collect(Collectors.toList());
		} else {
			filtered = filtered.stream().sorted(cmp.reversed()).collect(Collectors.toList());
		}

		long total = filtered.size();
		long pending = filtered.stream().filter(o -> o.getStatus() == Order.Status.PENDING).count();
		long processing = filtered.stream().filter(o -> o.getStatus() == Order.Status.PROCESSING).count();
		long delivered = filtered.stream().filter(o -> o.getStatus() == Order.Status.DELIVERED).count();

		model.addAttribute("orders", filtered);
		model.addAttribute("totalCount", total);
		model.addAttribute("pendingCount", pending);
		model.addAttribute("processingCount", processing);
		model.addAttribute("deliveredCount", delivered);
		model.addAttribute("selectedStatus", status == null ? "ALL" : status.toUpperCase(Locale.ROOT));
		model.addAttribute("q", query == null ? "" : query);
		model.addAttribute("sort", sort);

		return "admin/orders";
	}

	@PostMapping("updateStatus")
	public String updateStatus(@RequestParam("orderId") int orderId,
	                          @RequestParam("status") String status) {
		os.updateOrderStatus(orderId, Order.Status.valueOf(status));
		return "redirect:/admin/orders/obtainOrders";
	}
	@PostMapping("deleteOrder")
	public String deleteOrder(@RequestParam("orderId") int orderId, Model model) {
		String result = os.deleteOrder(orderId);

		if (result.startsWith("error")) {
			model.addAttribute("errorMessage", result.substring(6)); // Remover "error "
			return "redirect:/admin/orders/obtainOrders?error=" + result.substring(6);
		}

		return "redirect:/admin/orders/obtainOrders?success=Pedido eliminado correctamente";
	}
}
