package es.karuh.ecommerce.service;

import es.karuh.ecommerce.consts.SQLConsts;
import es.karuh.ecommerce.model.Coffee;
import jakarta.persistence.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CoffeeServiceImpl implements CoffeeService {
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Coffee> getAllCoffees() {
        return em.createQuery("FROM Coffee c", Coffee.class).getResultList();
    }

    @Override
    public Coffee getCoffeeById(int id) {
        return em.find(Coffee.class, id);
    }

	@Override
	public void deleteCoffee(int id) {
		Coffee coffee = em.find(Coffee.class, id);
		if (coffee != null) {
			em.remove(coffee);
		}
	}



	@Override
	public void registerCoffee(Coffee coffee) throws IOException {
		// Procesar imagen principal
		if (coffee.getImage() != null && !coffee.getImage().isEmpty()) {
			BufferedImage originalImage = ImageIO.read(coffee.getImage().getInputStream());
			ByteArrayOutputStream outputStream1 = new ByteArrayOutputStream();
			ImageIO.write(originalImage, "webp", outputStream1);
			coffee.setImageData(outputStream1.toByteArray());

			// Generar miniatura 80x80 en formato original
			BufferedImage thumbnail = resizeImage(originalImage, 80, 80);
			ByteArrayOutputStream thumbnailStream = new ByteArrayOutputStream();
			String format = getImageFormat(coffee.getImage().getOriginalFilename());
			ImageIO.write(thumbnail, format, thumbnailStream);
			coffee.setThumbnail(thumbnailStream.toByteArray());
		}

		// Procesar imagen 2 si existe
		if (coffee.getImage2() != null && !coffee.getImage2().isEmpty()) {
			BufferedImage image2 = ImageIO.read(coffee.getImage2().getInputStream());
			ByteArrayOutputStream outputStream2 = new ByteArrayOutputStream();
			ImageIO.write(image2, "webp", outputStream2);
			coffee.setImageData2(outputStream2.toByteArray());
		} else if (coffee.getImageData() != null) {
			// Si no hay imagen 2, copiar la imagen principal
			coffee.setImageData2(coffee.getImageData());
		}

		// Procesar imagen 3 si existe
		if (coffee.getImage3() != null && !coffee.getImage3().isEmpty()) {
			BufferedImage image3 = ImageIO.read(coffee.getImage3().getInputStream());
			ByteArrayOutputStream outputStream3 = new ByteArrayOutputStream();
			ImageIO.write(image3, "webp", outputStream3);
			coffee.setImageData3(outputStream3.toByteArray());
		} else if (coffee.getImageData() != null) {
			// Si no hay imagen 3, copiar la imagen principal
			coffee.setImageData3(coffee.getImageData());
		}

		em.persist(coffee);
	}

	@Override
	public void updateCoffee(Coffee coffee) throws IOException {
		// Procesar imagen principal si se proporciona una nueva
		if (coffee.getImage() != null && !coffee.getImage().isEmpty()) {
			BufferedImage originalImage = ImageIO.read(coffee.getImage().getInputStream());
			ByteArrayOutputStream outputStream1 = new ByteArrayOutputStream();
			ImageIO.write(originalImage, "webp", outputStream1);
			coffee.setImageData(outputStream1.toByteArray());

			// Actualizar miniatura 80x80 en formato original
			BufferedImage thumbnail = resizeImage(originalImage, 80, 80);
			ByteArrayOutputStream thumbnailStream = new ByteArrayOutputStream();
			String format = getImageFormat(coffee.getImage().getOriginalFilename());
			ImageIO.write(thumbnail, format, thumbnailStream);
			coffee.setThumbnail(thumbnailStream.toByteArray());
		}

		// Procesar imagen 2 si se proporciona una nueva
		if (coffee.getImage2() != null && !coffee.getImage2().isEmpty()) {
			BufferedImage image2 = ImageIO.read(coffee.getImage2().getInputStream());
			ByteArrayOutputStream outputStream2 = new ByteArrayOutputStream();
			ImageIO.write(image2, "webp", outputStream2);
			coffee.setImageData2(outputStream2.toByteArray());
		}

		// Procesar imagen 3 si se proporciona una nueva
		if (coffee.getImage3() != null && !coffee.getImage3().isEmpty()) {
			BufferedImage image3 = ImageIO.read(coffee.getImage3().getInputStream());
			ByteArrayOutputStream outputStream3 = new ByteArrayOutputStream();
			ImageIO.write(image3, "webp", outputStream3);
			coffee.setImageData3(outputStream3.toByteArray());
		}

		em.merge(coffee);
	}

	private BufferedImage resizeImage(BufferedImage original, int width, int height) {
		BufferedImage resized = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D graphics = resized.createGraphics();
		graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
		graphics.drawImage(original, 0, 0, width, height, null);
		graphics.dispose();
		return resized;
	}

	private String getImageFormat(String filename) {
		String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
		return switch (extension) {
			case "png" -> "png";
			case "gif" -> "gif";
			default -> "jpg";
		};
	}

	@Override
	public List<Map<String, Object>> getCoffeesJSON() {
		Query query = em.createNativeQuery(SQLConsts.SQL_OBTAIN_JSON_COFFEE, Tuple.class);
		List<Tuple> tuples = query.getResultList();

		List<Map<String, Object>> resultado = new ArrayList<>();
		for (Tuple tuple : tuples) {
			Map<String, Object> fila = new HashMap<>();
			for (TupleElement<?> element : tuple.getElements()) {
				String normalizedAlias = element.getAlias().toLowerCase();
				fila.put(normalizedAlias, tuple.get(element));
			}
			resultado.add(fila);
		}
		return resultado;
	}

}
