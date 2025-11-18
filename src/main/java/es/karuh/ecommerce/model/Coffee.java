package es.karuh.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

@Entity()
@Table(name = "coffee_products")
public class Coffee {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Size(min = 3, max = 50, message = "El nombre del tipo de café debe tener entre 3 y 50 caracteres.")
	@NotEmpty(message = "El nombre del tipo de café no puede estar vacío.")
	@Pattern(regexp = "[A-Za-zÁÉÍÓÚáéíóúÑñÜü\\s]+", message = "El nombre del tipo de café solo puede contener letras y espacios.")
	private String coffee_type;


	private String origin;
	private int altitude;
	private int bitterness_level;
	@NotNull(message = "El precio no puede estar vacío.")
	private double price;
	private String description;
	private int stock;
	@ManyToOne
	private Category category;

	@Transient
	private MultipartFile image;

	@Transient
	private MultipartFile image2;

	@Transient
	private MultipartFile image3;

	@Lob
	@Column(name = "coffee-image", columnDefinition = "LONGBLOB")
	private byte[] imageData;

	@Lob
	@Column(name = "coffee-image-2", columnDefinition = "LONGBLOB")
	private byte[] imageData2;

	@Lob
	@Column(name = "coffee-image-3", columnDefinition = "LONGBLOB")
	private byte[] imageData3;

	@Lob
	@Column(name = "thumbnail", columnDefinition = "LONGBLOB")
	private byte[] thumbnail;

	public Coffee() {
	}

	public Coffee(String coffee_type, String origin, int altitude, int bitterness_level, double price, String description, int stock) {
		this.coffee_type = coffee_type;
		this.origin = origin;
		this.altitude = altitude;
		this.bitterness_level = bitterness_level;
		this.price = price;
		this.description = description;
		this.stock = stock;
	}

	public Coffee(int id, String coffee_type, String origin, int altitude, int bitternessLevel, double price, String description, int stock) {
		this.id = id;
		this.coffee_type = coffee_type;
		this.origin = origin;
		this.altitude = altitude;
		this.bitterness_level = bitternessLevel;
		this.price = price;
		this.description = description;
		this.stock = stock;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public MultipartFile getImage() {
		return image;
	}

	public void setImage(MultipartFile image) {
		this.image = image;
	}

	public MultipartFile getImage2() {
		return image2;
	}

	public void setImage2(MultipartFile image2) {
		this.image2 = image2;
	}

	public MultipartFile getImage3() {
		return image3;
	}

	public void setImage3(MultipartFile image3) {
		this.image3 = image3;
	}

	public int getId() {
		return id;
	}

	public String getCoffee_type() {
		return coffee_type;
	}

	public String getOrigin() {
		return origin;
	}

	public int getAltitude() {
		return altitude;
	}

	public int getBitterness_level() {
		return bitterness_level;
	}

	public double getPrice() {
		return price;
	}

	public String getDescription() {
		return description;
	}

	public int getStock() {
		return stock;
	}

	public int id() {
		return id;
	}

	public Coffee setId(int id) {
		this.id = id;
		return this;
	}

	public Coffee setCoffee_type(String coffee_type) {
		this.coffee_type = coffee_type;
		return this;
	}

	public Coffee setOrigin(String origin) {
		this.origin = origin;
		return this;
	}

	public Coffee setAltitude(int altitude) {
		this.altitude = altitude;
		return this;
	}

	public Coffee setBitterness_level(int bitterness_level) {
		this.bitterness_level = bitterness_level;
		return this;
	}

	public Coffee setPrice(double price) {
		this.price = price;
		return this;
	}

	public Coffee setDescription(String description) {
		this.description = description;
		return this;
	}

	public int stock() {
		return stock;
	}

	public Coffee setStock(int stock) {
		this.stock = stock;
		return this;
	}

	public byte[] getImageData() {
		return imageData;
	}

	public void setImageData(byte[] imageData) {
		this.imageData = imageData;
	}

	public byte[] getImageData2() {
		return imageData2;
	}

	public void setImageData2(byte[] imageData2) {
		this.imageData2 = imageData2;
	}

	public byte[] getImageData3() {
		return imageData3;
	}

	public void setImageData3(byte[] imageData3) {
		this.imageData3 = imageData3;
	}

	public byte[] getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(byte[] thumbnail) {
		this.thumbnail = thumbnail;
	}

	@Override
	public String toString() {
		return "Coffee {" + "id=" + id + ", coffee_type='" + coffee_type + '\'' + ", origin='" + origin + '\'' + ", altitude=" + altitude + ", bitterness_level=" + bitterness_level + ", price=" + price + ", description='" + description + '\'' + ", stock=" + stock + '}';
	}

}
