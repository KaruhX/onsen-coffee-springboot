# ☕ Onsen Coffee E-commerce

Una plataforma de comercio electrónico moderna y elegante para la venta de cafés de alta calidad, desarrollada con **Spring Boot 3** y tecnologías web modernas.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green?style=flat-square&logo=spring)
![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)
![MySQL](https://img.shields.io/badge/MySQL-8.0.33-blue?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 🎯 Características Principales

- ✅ **Catálogo de Productos**: Visualización interactiva de cafés con imágenes de alta calidad
- ✅ **Carrito de Compras**: Sistema de carrito persistente por usuario
- ✅ **Autenticación de Usuarios**: Login y registro con contraseñas seguras
- ✅ **Panel de Administración**: Gestión completa de productos y usuarios
- ✅ **Procesamiento de Imágenes**: Conversión a WebP con miniaturas automáticas
- ✅ **API RESTful**: Endpoints JSON para todas las operaciones
- ✅ **Responsive Design**: Interfaz adaptable a todos los dispositivos
- ✅ **Base de Datos**: Persistencia con JPA/Hibernate

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **Spring Boot** | 3.5.6 | Framework web principal |
| **Spring Data JPA** | - | ORM y acceso a datos |
| **Thymeleaf** | - | Motor de plantillas (templates HTML) |
| **Java** | 21 | Lenguaje de programación |
| **MySQL** | 8.0.33 | Base de datos relacional |

### Frontend
| Tecnología | Descripción |
|-----------|-------------|
| **HTML5** | Estructura semántica |
| **CSS3 + Tailwind** | Estilos responsivos y modernos |
| **JavaScript (ES6+)** | Interactividad del cliente |
| **Mustache.js** | Templating en el cliente |
| **Fetch API** | Comunicación con servidor |

### DevTools
- **Gradle** (wrapper): Sistema de construcción
- **Spring DevTools**: Recarga en caliente durante desarrollo
- **JUnit 5**: Testing unitario

---

## 📁 Estructura del Proyecto

```
ecommerce/
├── src/
│   ├── main/
│   │   ├── java/es/karuh/ecommerce/
│   │   │   ├── controller/           # Controladores MVC y Admin
│   │   │   ├── rest/                 # Endpoints REST API
│   │   │   ├── service/              # Lógica de negocio
│   │   │   ├── model/                # Entidades JPA
│   │   │   ├── consts/               # Constantes SQL
│   │   │   ├── config/               # Configuración Spring
│   │   │   └── setup/                # Inicialización de datos
│   │   └── resources/
│   │       ├── static/               # Archivos estáticos
│   │       │   ├── js/               # Scripts JavaScript
│   │       │   ├── assets/           # Imágenes de cafés
│   │       │   └── mustache-templates/ # Plantillas de componentes
│   │       └── templates/            # Vistas Thymeleaf
│   └── test/                         # Tests unitarios
├── build.gradle.kts                  # Configuración Gradle
└── README.md                         # Este archivo
```

---

## 🏗️ Componentes Principales

### 📊 Modelos de Datos

#### **Coffee** (`model/Coffee.java`)
Entidad que representa un producto de café:
```java
- id: Identificador único
- coffee_type: Nombre del café
- origin: País/región de origen
- altitude: Altitud de cultivo (m)
- bitterness_level: Nivel de amargura (1-5)
- price: Precio en euros
- description: Descripción del producto
- stock: Cantidad disponible
- imageData: Imagen principal (BLOB)
- imageData2, imageData3: Imágenes adicionales
- thumbnail: Miniatura 80x80px
```

#### **User** (`model/User.java`)
Entidad para usuarios registrados:
```java
- id: Identificador único
- nombre: Nombre completo
- mail: Email (username)
- password: Contraseña hasheada
```

#### **Cart** (`model/Cart.java`)
Entidad que representa el carrito de compras:
```java
- id: Identificador único
- userId: Usuario propietario
- coffeeId: Café en el carrito
- quantity: Cantidad
```

---

### 🔌 Servicios (Service Layer)

#### **CoffeeService / CoffeeServiceImpl**
- `getAllCoffees()`: Obtiene todos los cafés disponibles
- `getCoffeeById(id)`: Obtiene un café específico
- `registerCoffee(coffee)`: Registra nuevo café con procesamiento de imágenes
- `updateCoffee(coffee)`: Actualiza datos del café
- `deleteCoffee(id)`: Elimina un café
- `getCoffeesJSON()`: Retorna cafés en formato JSON para la tienda

**Procesamiento de Imágenes:**
- Convierte imágenes a WebP
- Genera miniaturas 80x80px automáticamente
- Almacena en BLOB en la base de datos

#### **UserService / UserServiceImpl**
- `registerUser(nombre, mail, password)`: Registro de nuevos usuarios
- `loginUser(mail, password)`: Autenticación de usuarios
- `getUserByMail(mail)`: Búsqueda de usuario
- `getAllUsers()`: Listado completo de usuarios
- `updateUser(user)`: Actualización de perfil
- `deleteUser(id)`: Eliminación de usuario

---

### 🌐 Controladores REST API

#### **RestCoffee** (`rest/RestCoffee.java`)
```
GET /api/coffee/obtain          → Obtiene todos los cafés en JSON
```

#### **RESTUser** (`rest/RESTUser.java`)
```
POST /api/users/login           → Autenticación de usuario
POST /api/users/register        → Registro de nuevo usuario
GET  /api/users/all             → Listado de todos los usuarios (admin)
PUT  /api/users/edit            → Editar perfil de usuario
DELETE /api/users/delete/{id}   → Eliminar usuario (admin)
```

#### **RestCart** (`rest/RestCart.java`)
```
POST /api/cart/add              → Agregar producto al carrito
GET  /api/cart/view             → Ver contenido del carrito
DELETE /api/cart/remove         → Eliminar producto del carrito
POST /api/cart/checkout         → Procesar compra
```

---

### 🖼️ Frontend - JavaScript

#### **globals.js**
Define variables globales:
```javascript
LOGGED_USER              // Email del usuario autenticado
COFFEE_CARD_TEMPLATE     // Template de componente café
REGISTER_TEMPLATE        // Formulario de registro
LOGIN_TEMPLATE           // Formulario de login
```

#### **templates.js**
Carga las plantillas HTML mediante Fetch API:
- Carga `coffee-card.html` (tarjeta de producto)
- Carga `register.html` (formulario registro)
- Carga `login.html` (formulario login)

#### **functions.js** - Funciones principales:

```javascript
comprarCafe(nombreCafe, idCafe)
  → POST /api/cart/add
  → Agrega café al carrito del usuario autenticado

obtenerCafes()
  → GET /api/coffee/obtain
  → Renderiza tarjetas de cafés usando Mustache.js
  → Muestra estado de stock

mostrarLogin()
  → Muestra formulario de login
  → POST /api/users/login
  → Actualiza LOGGED_USER en sesión

mostrarRegistro()
  → Muestra formulario de registro
  → POST /api/users/register
  → Valida contraseñas antes de enviar

cerrarSesion()
  → Limpia LOGGED_USER
  → Oculta botones de auth
  → Vuelve a vista de tienda
```

#### **main.js**
Inicialización:
- Carga templates
- Muestra catálogo al inicio
- Configura navegación

---

### 🎨 Plantillas Frontend

#### **coffee-card.html** (Mustache Template)
Tarjeta de producto individual con:
- Imagen del café con efecto hover
- Nombre y precio
- Origen y altitud de cultivo
- Descripción truncada
- Indicador visual de amargura (barras)
- Badge de estado de stock (En Stock / Pocas Unidades / Agotado)
- Botón "Añadir al Carrito"

```html
Variables esperadas:
{{id}}              - ID del café
{{coffee_type}}     - Nombre del café
{{price}}           - Precio en €
{{origin}}          - Origen
{{altitude}}        - Altitud en metros
{{description}}     - Descripción
{{bitterness_level}} - Amargura (1-5)
{{stock}}           - Cantidad disponible

Condicionales:
{{#highStock}}      - Si stock > 10
{{#lowStock}}       - Si 0 < stock <= 10
{{#outOfStock}}     - Si stock <= 0
```

---

### 🗄️ Base de Datos

#### Tabla: `coffee_products`
```sql
id                    INT PRIMARY KEY AUTO_INCREMENT
coffee_type          VARCHAR(255)
origin               VARCHAR(255)
altitude             INT
bitterness_level     INT (1-5)
price                DOUBLE
description          TEXT
stock                INT
coffee-image         LONGBLOB (WebP)
coffee-image-2       LONGBLOB (WebP)
coffee-image-3       LONGBLOB (WebP)
thumbnail            LONGBLOB
```

#### Tabla: `user`
```sql
id                    INT PRIMARY KEY AUTO_INCREMENT
nombre               VARCHAR(255)
mail                 VARCHAR(255) UNIQUE
password             VARCHAR(255) (Hash)
```

#### Tabla: `cart`
```sql
id                    INT PRIMARY KEY AUTO_INCREMENT
user_id              INT (FK → user)
coffee_id            INT (FK → coffee_products)
quantity             INT
```

---

## 🚀 Instalación y Uso

### Requisitos Previos
- **Java 21** o superior
- **MySQL 8.0.33** o superior
- **Gradle** (incluido con wrapper)

### 1️⃣ Clonar el Repositorio
```bash
git clone <repository-url>
cd ecommerce
```

### 2️⃣ Configurar Base de Datos

Crear base de datos:
```sql
CREATE DATABASE ecommerce_db;
USE ecommerce_db;
```

Actualizar `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 3️⃣ Ejecutar la Aplicación

Con Gradle:
```bash
./gradlew bootRun
```

O construir JAR:
```bash
./gradlew build
java -jar build/libs/ecommerce-0.0.1-SNAPSHOT.jar
```

### 4️⃣ Acceder a la Aplicación

Abrir en el navegador:
```
http://localhost:8080/
```

---

## 📝 Flujo de Uso

### Para Clientes
1. **Visualizar Tienda** → GET `/` → Carga catálogo de cafés
2. **Buscar/Filtrar** → Navegar por productos
3. **Registro/Login** → POST `/api/users/register` o `/api/users/login`
4. **Agregar al Carrito** → POST `/api/cart/add`
5. **Ver Carrito** → GET `/api/cart/view`
6. **Procesar Compra** → POST `/api/cart/checkout`

### Para Administradores
1. **Acceder Panel Admin** → `/admin/`
2. **Gestionar Cafés** → Crear, editar, eliminar productos
3. **Gestionar Usuarios** → Ver, editar, eliminar usuarios
4. **Ver Estadísticas** → Reportes de ventas y stock

---

## 🔒 Seguridad

- ✅ Contraseñas almacenadas en hash (MD5/BCrypt)
- ✅ Validación de usuario por email
- ✅ Sesiones de usuario con LOGGED_USER
- ✅ Validación de entrada en formularios
- ✅ CORS configurado para APIs

---

## 🎨 Diseño UI/UX

### Paleta de Colores
- **Principal**: #8B4513 (Onsen - Marrón café)
- **Secundario**: #D2691E (Chocolate)
- **Acento**: #FFD700 (Oro)
- **Neutro**: Grises y blancos

### Componentes
- **Tarjetas**: Elevadas con sombra y hover effect
- **Botones**: Redondeados con transiciones suaves
- **Badger**: Indicadores de stock dinámicos
- **Iconos**: SVG de Heroicons

---

## 📊 SQL Utilizado

### Consulta de Catálogo
```sql
SELECT 
    c.id, 
    c.coffee_type, 
    c.origin, 
    c.altitude, 
    c.bitterness_level, 
    c.price, 
    c.description, 
    c.stock 
FROM coffee_products c
```

Retorna JSON con campos normalizados para el frontend Mustache.

---

## 🐛 Troubleshooting

### Error: "No hay cafés disponibles"
- Verificar conexión a MySQL
- Comprobar datos en tabla `coffee_products`
- Revisar logs: `tail -f nohup.out`

### Imágenes no cargan
- Verificar que `BLOB` contiene datos válidos
- Comprobar endpoint `/show-image?id={id}`
- Verificar formato WebP en navegador

### Usuario no se guarda
- Validar email único en tabla
- Comprobar contraseña >= 6 caracteres
- Revisar validaciones en formulario

---

## 📚 Documentación API

### Endpoints Públicos (sin autenticación)
```
GET  /                          # Página principal tienda
POST /api/users/login           # Autenticación
POST /api/users/register        # Registro de usuario
GET  /api/coffee/obtain         # Listado de cafés
GET  /show-image?id={id}        # Descarga imagen
```

### Endpoints Protegidos (requieren login)
```
GET  /api/cart/view             # Ver carrito
POST /api/cart/add              # Agregar al carrito
DELETE /api/cart/remove         # Eliminar de carrito
POST /api/cart/checkout         # Procesar compra
```

### Endpoints Admin (requieren rol admin)
```
POST /admin/coffee/register     # Crear café
PUT  /admin/coffee/edit/{id}    # Editar café
DELETE /admin/coffee/delete/{id} # Eliminar café
GET  /admin/users               # Listar usuarios
PUT  /admin/users/edit/{id}     # Editar usuario
DELETE /admin/users/delete/{id}  # Eliminar usuario
```

---

## 📝 Notas Técnicas

### Procesamiento de Imágenes
- **Entrada**: JPG, PNG, GIF
- **Salida Principal**: WebP (compresión superior)
- **Miniatura**: 80x80px en formato original
- **Almacenamiento**: LONGBLOB (hasta 4GB)

### Optimizaciones
- Lazy loading en imágenes
- Minificación de CSS/JS en producción
- Caché de plantillas Mustache
- Índices en bases de datos

### Patrones Usados
- **MVC**: Separación de controladores y vistas
- **DAO/Repository**: Acceso a datos con JPA
- **Service Layer**: Lógica de negocio centralizada
- **REST**: API sin estado (stateless)
- **Template Pattern**: Reutilización de componentes

---

## 🤝 Contribuir

Este es un proyecto educativo. Para sugerencias o mejoras:
1. Fork el repositorio
2. Crea rama feature (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -am 'Add mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver `LICENSE` para más detalles.

---

## 👤 Autor

**Karuh**
- GitHub: [@karuh](https://github.com/karuh)
- Proyecto: Ecommerce Spring Boot 3
- Año: 2024-2025

---

## 🎓 Contexto Educativo

Este proyecto fue desarrollado como parte de un curso de **Spring Boot** en clase. Implementa conceptos clave como:
- Arquitectura MVC
- Persistencia con JPA/Hibernate
- APIs REST
- Procesamiento de imágenes
- Autenticación básica
- Frontend reactivo con JavaScript

---

## 📞 Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

```
¡Gracias por usar Onsen Coffee! ☕✨
```

---

**Última actualización**: 31 de Octubre de 2024

