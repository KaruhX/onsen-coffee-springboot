package es.karuh.ecommerce.rest;

import es.karuh.ecommerce.service.CoffeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/coffee")
public class RestCoffee {
    @Autowired
    private CoffeeService cs;

    @RequestMapping("obtain")
    public List<Map<String,Object>> obtainAllCoffee() {
        return cs.getCoffeesJSON();
    }
}
