package es.karuh.ecommerce.service;

import es.karuh.ecommerce.model.Coffee;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CoffeeService {
    List<Coffee> getAllCoffees();
    Coffee getCoffeeById(int id);
    void registerCoffee(Coffee coffee) throws IOException;
    void updateCoffee(Coffee coffee) throws IOException;
    void deleteCoffee(int id);
	List<Map<String,Object>> getCoffeesJSON();
}

