# ☕ Onsen Coffee - Ecommerce

<div align="center">

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?style=for-the-badge&logo=spring)
![Gradle](https://img.shields.io/badge/Gradle-8.x-blue?style=for-the-badge&logo=gradle)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![H2](https://img.shields.io/badge/H2-Database-yellow?style=for-the-badge)

Una aplicación de comercio electrónico moderna para la venta de café premium construida con Spring Boot y tecnologías web modernas.

[Características](#-características) •
[Tecnologías](#️-tecnologías-utilizadas) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Estructura](#-estructura-del-proyecto) •
[API](#-api-rest)

</div>

---

## 📋 Descripción

**Onsen Coffee** es una aplicación web de comercio electrónico desarrollada con Spring Boot que permite gestionar la venta de diferentes tipos de café premium. La aplicación cuenta con un sistema completo de gestión de productos, usuarios, carritos de compra y panel administrativo.

### 🎯 Características Principales

- ✅ **Gestión de Productos de Café**: CRUD completo de productos con información detallada (tipo, origen, altitud, nivel de amargor, precio, stock)
- ✅ **Sistema de Usuarios**: Registro, autenticación y gestión de perfiles de usuario
- ✅ **Carrito de Compras**: Funcionalidad completa de carrito con gestión de cantidades
- ✅ **Panel Administrativo**: Interfaz dedicada para administradores con gestión completa
- ✅ **API REST**: Endpoints RESTful para integración con frontend SPA
- ✅ **Gestión de Imágenes**: Soporte para múltiples imágenes por producto (hasta 3 + thumbnail)
- ✅ **Diseño Responsive**: Interfaz moderna con Tailwind CSS
- ✅ **Frontend Dinámico**: JavaScript vanilla con Mustache.js para renderizado de plantillas

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Java** | 21 | Lenguaje de programación principal |
| **Spring Boot** | 3.5.6 | Framework principal para el backend |
| **Spring Data JPA** | - | Persistencia de datos y manejo de entidades |
| **Hibernate** | - | ORM para mapeo objeto-relacional |
| **MySQL** | 8.0.33 | Base de datos principal (producción) |
| **H2 Database** | - | Base de datos en memoria (desarrollo/testing) |
| **Gradle** | 8.x | Sistema de construcción y gestión de dependencias |

### Frontend

| Tecnología | Descripción |
|------------|-------------|
| **Thymeleaf** | Motor de plantillas del lado del servidor |
| **Tailwind CSS** | Framework CSS para diseño responsive |
| **JavaScript (Vanilla)** | Lógica del cliente sin frameworks pesados |
| **Mustache.js** | Sistema de plantillas del lado del cliente |

### Herramientas de Desarrollo

- **Spring Boot DevTools**: Recarga automática durante el desarrollo
- **JUnit 5**: Framework de testing
- **H2 Console**: Interfaz web para inspeccionar la base de datos

---

## 📦 Instalación

### Requisitos Previos

- **Java JDK 21** o superior
- **Gradle 8.x** (o usar el wrapper incluido)
- **MySQL 8.0** (opcional, usa H2 por defecto)
- Un IDE como IntelliJ IDEA, Eclipse o VS Code

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd ecommerce
```

2. **Configurar la base de datos**

   **Opción A: Usar H2 (por defecto, ideal para desarrollo)**
   
   No requiere configuración adicional. La aplicación usará H2 en memoria automáticamente.

   **Opción B: Usar MySQL (para producción)**
   
   Edita `src/main/resources/application.properties`:

```properties
# Descomentar y configurar estas líneas
spring.datasource.url=jdbc:mysql://localhost:3306/onsen_coffee?createDatabaseIfNotExist=true
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update

# Comentar la configuración de H2
# spring.datasource.url=jdbc:h2:mem:onsen_coffee
# ...
```

3. **Construir el proyecto**

```bash
./gradlew build
```

4. **Ejecutar la aplicación**

```bash
./gradlew bootRun
```

O ejecutar el JAR generado:

```bash
java -jar build/libs/ecommerce-0.0.1-SNAPSHOT.jar
```

5. **Acceder a la aplicación**

Abre tu navegador en: `http://localhost:8080`

---

## 🚀 Uso

### Interfaz Pública

- **Página Principal** (`/`): Visualización de productos de café disponibles
- **Registro** (`/api/users/register`): Crear nueva cuenta de usuario
- **Login**: Iniciar sesión para realizar compras

### Panel Administrativo

Accede al panel de administración para:
- Gestionar productos de café (crear, editar, eliminar)
- Gestionar usuarios
- Ver y administrar pedidos
- Subir y gestionar imágenes de productos

### H2 Console (Desarrollo)

Si usas H2, puedes acceder a la consola de base de datos:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:onsen_coffee`
- Usuario: `sa`
- Contraseña: (dejar en blanco)

---

## 📁 Estructura del Proyecto

```
ecommerce/
├── src/
│   ├── main/
│   │   ├── java/es/karuh/ecommerce/
│   │   │   ├── EcommerceApplication.java       # Clase principal de Spring Boot
│   │   │   ├── config/                          # Configuración de la aplicación
│   │   │   │   ├── AdminInterceptor.java        # Interceptor para rutas admin
│   │   │   │   └── WebConfig.java               # Configuración web y CORS
│   │   │   ├── consts/                          # Constantes de la aplicación
│   │   │   ├── controller/                      # Controladores MVC
│   │   │   │   ├── StartController.java         # Controlador principal
│   │   │   │   ├── admin/                       # Controladores administrativos
│   │   │   │   │   ├── AdminLogin.java
│   │   │   │   │   ├── AdminLoginController.java
│   │   │   │   │   ├── CoffeeController.java    # Gestión de productos
│   │   │   │   │   └── UserController.java      # Gestión de usuarios
│   │   │   │   └── image/                       # Controlador de imágenes
│   │   │   ├── model/                           # Entidades JPA
│   │   │   │   ├── Cart.java                    # Carrito de compras
│   │   │   │   ├── Coffee.java                  # Producto de café
│   │   │   │   └── User.java                    # Usuario
│   │   │   ├── rest/                            # Controladores REST API
│   │   │   │   ├── RESTUser.java                # API de usuarios
│   │   │   │   ├── RestCart.java                # API del carrito
│   │   │   │   └── RestCoffee.java              # API de productos
│   │   │   ├── service/                         # Capa de servicios
│   │   │   │   ├── CoffeeService.java           # Interfaz de servicio
│   │   │   │   ├── CoffeeServiceImpl.java       # Implementación
│   │   │   │   ├── UserSerivce.java             # Interfaz de servicio
│   │   │   │   └── UserServiceImpl.java         # Implementación
│   │   │   └── setup/                           # Configuración inicial
│   │   └── resources/
│   │       ├── application.properties           # Configuración de la app
│   │       ├── static/                          # Recursos estáticos
│   │       │   ├── assets/                      # Imágenes
│   │       │   ├── js/                          # JavaScript
│   │       │   │   ├── functions.js             # Funciones auxiliares
│   │       │   │   ├── globals.js               # Variables globales
│   │       │   │   ├── main.js                  # Lógica principal
│   │       │   │   └── templates.js             # Plantillas Mustache
│   │       │   └── mustache-templates/          # Templates para renderizado
│   │       │       ├── coffee-card.html
│   │       │       ├── login.html
│   │       │       └── register.html
│   │       └── templates/                       # Plantillas Thymeleaf
│   │           ├── products.html                # Página de productos
│   │           ├── tienda.html                  # Página de tienda
│   │           ├── admin/                       # Vistas administrativas
│   │           └── fragments/                   # Fragmentos reutilizables
│   └── test/                                    # Tests unitarios
├── build.gradle.kts                             # Configuración de Gradle
├── gradlew                                      # Wrapper de Gradle (Unix)
├── gradlew.bat                                  # Wrapper de Gradle (Windows)
└── settings.gradle.kts                          # Configuración del proyecto
```

---

## 🔌 API REST

### Endpoints de Usuarios

#### Obtener todos los usuarios
```http
GET /api/users/obtain
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "carts": []
  }
]
```

#### Registrar usuario
```http
POST /api/users/register
```

**Parámetros:**
- `username`: Nombre de usuario
- `mail`: Correo electrónico
- `nombre`: Nombre completo
- `direccion`: Dirección
- `password`: Contraseña

**Respuesta:**
- `"OK User registered successfully"` si es exitoso
- `"error El correo ya está registrado"` si el email ya existe

### Endpoints de Café

#### Obtener todos los cafés
```http
GET /api/coffee/obtain
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "coffee_type": "Arábica",
    "origin": "Colombia",
    "altitude": 1500,
    "bitterness_level": 3,
    "price": 15.99,
    "description": "Café suave con notas cítricas",
    "stock": 50
  }
]
```

### Endpoints del Carrito

#### Agregar al carrito
```http
POST /api/cart/add
```

**Parámetros:**
- `productId`: ID del producto
- `quantity`: Cantidad a agregar

**Requiere**: Sesión activa de usuario

---

## 🗄️ Modelo de Datos

### Entidad User (Usuario)
- `id`: Identificador único (auto-generado)
- `nombre`: Nombre del usuario
- `email`: Correo electrónico (único)
- `pass`: Contraseña
- `carts`: Relación OneToMany con Cart

### Entidad Coffee (Café)
- `id`: Identificador único (auto-generado)
- `coffee_type`: Tipo de café
- `origin`: Origen del café
- `altitude`: Altitud de cultivo
- `bitterness_level`: Nivel de amargor (1-10)
- `price`: Precio
- `description`: Descripción del producto
- `stock`: Cantidad disponible
- `imageData`: Imagen principal (BLOB)
- `imageData2`: Segunda imagen (BLOB)
- `imageData3`: Tercera imagen (BLOB)
- `thumbnail`: Miniatura (BLOB)

### Entidad Cart (Carrito)
- `id`: Identificador único (auto-generado)
- `quantity`: Cantidad de productos
- `user`: Relación ManyToOne con User
- `coffee`: Relación ManyToOne con Coffee

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura en capas** (Layered Architecture):

1. **Capa de Presentación** (Controllers)
   - Controladores MVC para vistas Thymeleaf
   - REST Controllers para API JSON

2. **Capa de Lógica de Negocio** (Services)
   - Interfaces de servicios
   - Implementaciones con `@Service`

3. **Capa de Persistencia** (Models + JPA)
   - Entidades JPA con anotaciones
   - EntityManager para operaciones de BD

4. **Capa de Configuración** (Config)
   - Interceptores
   - Configuración de CORS y Web

### Patrón de Diseño Utilizado

- **DAO (Data Access Object)**: Implementado a través de servicios
- **MVC (Model-View-Controller)**: Para la estructura general
- **Dependency Injection**: Con Spring Framework
- **Repository Pattern**: A través de EntityManager

---

## ⚙️ Configuración

### application.properties

```properties
# Nombre de la aplicación
spring.application.name=ecommerce

# Configuración de archivos
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# Base de datos H2 (desarrollo)
spring.datasource.url=jdbc:h2:mem:onsen_coffee
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Consola H2
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

---

## 🧪 Testing

Ejecutar los tests:

```bash
./gradlew test
```

Ver reporte de tests:
```bash
./gradlew test --info
```

---

## 🚀 Despliegue

### Construcción para Producción

1. **Generar JAR ejecutable:**
```bash
./gradlew bootJar
```

2. **El JAR se generará en:**
```
build/libs/ecommerce-0.0.1-SNAPSHOT.jar
```

3. **Ejecutar en producción:**
```bash
java -jar build/libs/ecommerce-0.0.1-SNAPSHOT.jar
```

### Variables de Entorno

Para producción, considera usar variables de entorno:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/onsen_coffee
export SPRING_DATASOURCE_USERNAME=usuario
export SPRING_DATASOURCE_PASSWORD=contraseña
```

---

## 📝 Características Técnicas Destacadas

### 1. Gestión de Imágenes BLOB
Los productos pueden almacenar hasta 3 imágenes de alta calidad más una miniatura en la base de datos como BLOB (Binary Large Object).

### 2. Arquitectura REST + MVC Híbrida
- Thymeleaf para renderizado del lado del servidor
- API REST para operaciones dinámicas del cliente
- JavaScript vanilla para interactividad sin dependencias pesadas

### 3. Transaccionalidad
Uso de `@Transactional` en la capa de servicios para garantizar la integridad de datos.

### 4. Manejo de Excepciones
Captura y manejo de excepciones personalizadas en toda la aplicación.

### 5. Session Management
Sistema de sesiones para mantener el estado de autenticación del usuario.

---

## 🔐 Seguridad

- Validación de usuarios en el servidor
- Verificación de correos duplicados
- Interceptores para rutas administrativas
- Sesiones para control de acceso

> **Nota:** Este es un proyecto educativo. Para producción, considera implementar:
> - Spring Security
> - Hash de contraseñas (BCrypt)
> - HTTPS/SSL
> - Protección CSRF
> - Rate limiting

---

## 🐛 Troubleshooting

### Error: Puerto 8080 ocupado
```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Error: Java version incompatible
Asegúrate de tener Java 21 o superior:
```bash
java -version
```

### Error de conexión a MySQL
Verifica que MySQL esté corriendo y las credenciales sean correctas.

---

## 📚 Recursos y Referencias

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Thymeleaf](https://www.thymeleaf.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gradle Build Tool](https://gradle.org/)

---

## 👨‍💻 Autor

**Karuh**

Proyecto desarrollado como parte del aprendizaje de Spring Boot y desarrollo web full-stack.

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

<div align="center">

**Hecho con ☕ y Spring Boot**

⭐ Si te gustó este proyecto, ¡dale una estrella!

</div>

