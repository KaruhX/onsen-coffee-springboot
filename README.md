# ☕ Onsen Coffee - E-commerce

<div align="center">

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?style=for-the-badge&logo=spring)
![H2 Database](https://img.shields.io/badge/H2-Database-blue?style=for-the-badge&logo=database)
![Thymeleaf](https://img.shields.io/badge/Thymeleaf-Template-green?style=for-the-badge&logo=thymeleaf)
![Gradle](https://img.shields.io/badge/Gradle-Build-02303A?style=for-the-badge&logo=gradle)

**Una aplicación E-commerce completa para la venta de café premium japonés** ☕🇯🇵

[Características](#-características) • [Tecnologías](#-tecnologías-utilizadas) • [Instalación](#-instalación) • [Uso](#-uso) • [API](#-api-endpoints) • [Estructura](#-estructura-del-proyecto)

</div>

---

## 📋 Descripción

**Onsen Coffee** es una aplicación web full-stack de comercio electrónico desarrollada con **Spring Boot** que permite la gestión completa de productos de café, usuarios y carritos de compra. El proyecto incluye tanto un panel de administración como una interfaz de usuario pública.

### ✨ Características

#### 🛒 Para Clientes
- 📱 Catálogo de cafés con información detallada (origen, altitud, nivel de amargor)
- 🖼️ Galería de imágenes con miniaturas optimizadas
- 🛍️ Carrito de compras funcional
- 👤 Sistema de registro y autenticación de usuarios
- 📦 Vista detallada de cada producto con múltiples imágenes
- 🔍 Búsqueda y filtrado de productos

#### 🔧 Para Administradores
- ➕ CRUD completo de productos de café
- 📸 Carga y gestión de múltiples imágenes por producto (hasta 3 imágenes)
- 🎯 Generación automática de miniaturas
- 👥 Gestión de usuarios
- 📊 Panel de control administrativo
- ✏️ Edición de información de productos (tipo, origen, precio, stock, etc.)

---

## 🚀 Tecnologías Utilizadas

### Backend
- **Java 21** - Lenguaje de programación
- **Spring Boot 3.5.6** - Framework principal
  - Spring Web MVC
  - Spring Data JPA
  - Spring Boot DevTools
- **Hibernate 6.6.29** - ORM para persistencia
- **H2 Database 2.3.232** - Base de datos embebida en disco
- **HikariCP** - Pool de conexiones

### Frontend
- **Thymeleaf 3.1.3** - Motor de plantillas del lado del servidor
- **Mustache.js** - Plantillas del lado del cliente
- **Onsen UI** - Framework CSS/JavaScript para UI
- **JavaScript Vanilla** - Lógica del cliente

### Build & Tools
- **Gradle (Kotlin DSL)** - Gestión de dependencias y build
- **Jakarta Persistence API** - Especificación JPA

---

## 📦 Instalación

### Prerrequisitos
- Java JDK 21 o superior
- Gradle (incluido en el proyecto con wrapper)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd ecommerce
```

2. **Dar permisos de ejecución al wrapper de Gradle** (Linux/Mac)
```bash
chmod +x gradlew
```

3. **Compilar el proyecto**
```bash
./gradlew build
```

4. **Ejecutar la aplicación**
```bash
./gradlew bootRun
```

O usando el JAR compilado:
```bash
java -jar build/libs/ecommerce-0.0.1-SNAPSHOT.jar
```

5. **Acceder a la aplicación**
- **Aplicación principal**: http://localhost:8080
- **Consola H2**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:file:./data/onsen_coffee`
  - Usuario: `sa`
  - Password: (vacío)

---

## 🎯 Uso

### Configuración de Base de Datos

La aplicación usa **H2 Database** en modo persistente. Los datos se almacenan en:
```
./data/onsen_coffee.mv.db
```

**Configuración en `application.properties`:**
```properties
spring.datasource.url=jdbc:h2:file:./data/onsen_coffee;AUTO_SERVER=TRUE
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

### Estructura de Base de Datos

#### Tabla: `coffee_products`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| coffee_type | VARCHAR | Tipo de café |
| origin | VARCHAR | País/región de origen |
| altitude | INT | Altitud de cultivo (metros) |
| bitterness_level | INT | Nivel de amargor (1-10) |
| price | DOUBLE | Precio del producto |
| description | TEXT | Descripción detallada |
| stock | INT | Cantidad disponible |
| coffee_image | LONGBLOB | Imagen principal |
| coffee_image_2 | LONGBLOB | Imagen secundaria |
| coffee_image_3 | LONGBLOB | Imagen terciaria |
| thumbnail | LONGBLOB | Miniatura (200x200px) |

#### Tabla: `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| nombre | VARCHAR | Nombre del usuario |
| pass | VARCHAR | Contraseña |
| email | VARCHAR (UNIQUE) | Email |
| domicilio | VARCHAR | Dirección |
| telefono | VARCHAR | Teléfono |

#### Tabla: `cart`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| user_id | INT (FK) | Referencia al usuario |
| coffee_id | INT (FK) | Referencia al café |
| quantity | INT | Cantidad en el carrito |

---

## 🌐 API Endpoints

### 🏠 Públicos

#### Página Principal
```http
GET /
```
Renderiza la página principal con el catálogo de cafés.

#### Productos
```http
GET /productos
```
Muestra todos los productos disponibles.

#### Obtener Cafés (JSON)
```http
GET /getCoffeesJSON
```
Retorna todos los cafés en formato JSON.

**Respuesta:**
```json
[
  {
    "id": 1,
    "coffeeType": "Arabica Premium",
    "origin": "Colombia",
    "altitude": 1800,
    "bitternessLevel": 5,
    "price": 15.99,
    "description": "Café suave con notas de chocolate",
    "stock": 100,
    "thumbnail": "base64..."
  }
]
```

#### Imagen de Café
```http
GET /coffee/image/{id}
```
Obtiene la imagen principal de un café específico.

```http
GET /coffee/image/{id}/{imageNumber}
```
Obtiene una imagen específica (1-3) de un café.

#### Miniatura
```http
GET /coffee/thumbnail/{id}
```
Obtiene la miniatura del café.

### 🔐 Carrito de Compras

#### Agregar al Carrito
```http
POST /cart/add
```
**Body:**
```json
{
  "userId": 1,
  "coffeeId": 1,
  "quantity": 2
}
```

#### Obtener Carrito
```http
GET /cart/{userId}
```
Retorna los productos en el carrito del usuario.

### 👨‍💼 Panel de Administración

#### Dashboard Admin
```http
GET /admin
```

#### Gestión de Cafés
```http
GET /admin/coffees          # Listar todos
GET /admin/coffees/new      # Formulario de creación
POST /admin/coffees         # Crear nuevo café
GET /admin/coffees/edit/{id} # Formulario de edición
POST /admin/coffees/update  # Actualizar café
GET /admin/coffees/delete/{id} # Eliminar café
```

#### Gestión de Usuarios
```http
GET /admin/users            # Listar todos
GET /admin/users/new        # Formulario de creación
POST /admin/users           # Crear nuevo usuario
GET /admin/users/edit/{id}  # Formulario de edición
POST /admin/users/update    # Actualizar usuario
GET /admin/users/delete/{id} # Eliminar usuario
```

---

## 📁 Estructura del Proyecto

```
ecommerce/
├── src/
│   ├── main/
│   │   ├── java/es/karuh/ecommerce/
│   │   │   ├── config/          # Configuraciones
│   │   │   ├── consts/          # Constantes y queries SQL
│   │   │   ├── controller/      # Controladores REST y MVC
│   │   │   │   ├── StartController.java
│   │   │   │   ├── CartController.java
│   │   │   │   └── AdminController.java
│   │   │   ├── model/           # Entidades JPA
│   │   │   │   ├── Coffee.java
│   │   │   │   ├── User.java
│   │   │   │   └── Cart.java
│   │   │   ├── service/         # Lógica de negocio
│   │   │   │   ├── CoffeeService.java
│   │   │   │   ├── CoffeeServiceImpl.java
│   │   │   │   ├── CartService.java
│   │   │   │   └── CartServiceImpl.java
│   │   │   └── utils/           # Utilidades
│   │   │       └── ImageUtil.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       │   ├── assets/      # Imágenes estáticas
│   │       │   ├── js/          # JavaScript
│   │       │   │   ├── main.js
│   │       │   │   ├── functions.js
│   │       │   │   ├── globals.js
│   │       │   │   └── templates.js
│   │       │   └── mustache-templates/
│   │       │       ├── coffee-card.html
│   │       │       ├── coffee-detail.html
│   │       │       ├── cart.html
│   │       │       ├── login.html
│   │       │       └── register.html
│   │       └── templates/       # Plantillas Thymeleaf
│   │           ├── products.html
│   │           ├── coffee-detail.html
│   │           ├── admin/
│   │           │   ├── coffee.html
│   │           │   ├── coffee-register.html
│   │           │   ├── coffee-edit.html
│   │           │   ├── user.html
│   │           │   ├── user-register.html
│   │           │   └── user-edit.html
│   │           └── fragments/
│   │               ├── general.html
│   │               └── public-header.html
│   └── test/
│       └── java/
├── data/                        # Base de datos H2
│   └── onsen_coffee.mv.db
├── build.gradle.kts
├── settings.gradle.kts
├── gradlew
├── gradlew.bat
└── README.md
```

---

## 🔧 Configuración Avanzada

### Cambiar Puerto del Servidor
```properties
server.port=8090
```

### Configurar Tamaño Máximo de Archivos
```properties
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

### Modo de Actualización de Base de Datos
```properties
# create: Crea las tablas desde cero (borra datos existentes)
# update: Actualiza las tablas sin borrar datos
# validate: Solo valida el esquema
# none: No hace nada
spring.jpa.hibernate.ddl-auto=update
```

### Mostrar SQL en Consola
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## 🎨 Características Técnicas Destacadas

### 📸 Procesamiento de Imágenes
- **Carga múltiple**: Hasta 3 imágenes por producto
- **Miniaturas automáticas**: Generación de thumbnails 200x200px
- **Formato**: JPEG con calidad optimizada
- **Almacenamiento**: BLOB en base de datos

### 🔄 Arquitectura en Capas
```
Controller → Service → Repository/EntityManager → Database
```

### 🛡️ Transacciones
- Uso de `@Transactional` para operaciones CRUD
- Gestión automática de commit/rollback

### 📊 Consultas SQL Nativas
- Queries optimizadas en `SQLConsts.java`
- Joins eficientes para carrito de compras

---

## 🐛 Solución de Problemas

### Base de Datos Bloqueada
Si encuentras el error "Database may be already in use":
```bash
# Cerrar todas las conexiones activas
pkill -9 java

# Eliminar archivo de bloqueo
rm -f data/onsen_coffee.mv.db.lock
```

### Puerto en Uso
```bash
# Verificar qué usa el puerto 8080
lsof -i :8080

# Cambiar puerto en application.properties
server.port=8090
```

### Problemas de Compilación
```bash
# Limpiar proyecto
./gradlew clean

# Reconstruir
./gradlew build --refresh-dependencies
```

---

## 📝 Variables de Entorno

Para producción, se recomienda usar variables de entorno:

```bash
export SPRING_DATASOURCE_URL=jdbc:h2:file:./data/onsen_coffee
export SPRING_DATASOURCE_USERNAME=sa
export SPRING_DATASOURCE_PASSWORD=
export SERVER_PORT=8080
```

---

## 🚦 Estado del Proyecto

🟢 **Activo** - En desarrollo continuo

### Próximas Características
- [ ] Sistema de autenticación con JWT
- [ ] Carrito persistente en sesión
- [ ] Proceso de checkout y pago
- [ ] Sistema de valoraciones y comentarios
- [ ] Búsqueda avanzada con filtros
- [ ] Panel de estadísticas para admin
- [ ] API REST completa documentada con Swagger
- [ ] Tests unitarios y de integración

---

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 📧 Contacto

**Autor**: Karuh  
**Proyecto**: Onsen Coffee E-commerce  
**Framework**: Spring Boot 3.5.6  

---

<div align="center">

**¡Disfruta de tu café! ☕✨**

Hecho con ❤️ y ☕ por Karuh

</div>

