package es.karuh.ecommerce.rest.data;

import java.util.List;
import java.util.Map;

public class OrderResume {
	private List<Map<String, Object>>  coffees;
	private String fullName;
	private String address;
	private String province;

	private String creditCardTitular;
	private String creditCardNumber;
	private String creditCardType;

	public List<Map<String, Object>> getCoffees() {
		return coffees;
	}

	public void setCoffees(List<Map<String, Object>> coffees) {
		this.coffees = coffees;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCreditCardTitular() {
		return creditCardTitular;
	}

	public void setCreditCardTitular(String creditCardTitular) {
		this.creditCardTitular = creditCardTitular;
	}

	public String getCreditCardNumber() {
		return creditCardNumber;
	}

	public void setCreditCardNumber(String creditCardNumber) {
		this.creditCardNumber = creditCardNumber;
	}

	public String getCreditCardType() {
		return creditCardType;
	}

	public void setCreditCardType(String creditCardType) {
		this.creditCardType = creditCardType;
	}
}
