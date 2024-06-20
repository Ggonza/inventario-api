# Inventario API

Inventario API es una aplicación backend RESTful que permite la gestión de un inventario, incluyendo funcionalidades para registro y autenticación de usuarios, gestión de productos, y realización de compras.

## Tecnologías Usadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express.js**: Framework web para Node.js.
- **Sequelize**: ORM para Node.js que facilita el manejo de bases de datos SQL.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **bcrypt**: Biblioteca para el hashing de contraseñas.
- **jsonwebtoken**: Biblioteca para la generación y verificación de tokens JWT.
- **apidoc**: Generador de documentación de API.

## Requisitos Previos

- Node.js (v14.x o superior)
- Yarn (v1.x o superior)
- PostgreSQL

## Instalación

1. Clona este repositorio:
    ```sh
    git clone https://github.com/tu_usuario/inventario-api.git
    cd inventario-api
    ```

2. Instala las dependencias:
    ```sh
    yarn install
    ```

3. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto según los requerimientos, en este proyecto ya se encuentra el .env que se usó por si desean mantener esta configuración

4. Crea y sincroniza la base de datos:
    ```sh
    yarn sync
    ```
    se debe tener cuidado con este, ya que el ejecutarlo causa que se resetee la Base de datos.
## Ejecución

1. Inicia el servidor de desarrollo:
    ```sh
    yarn dev para development
    yarn start para un entoncer de pruebas
    ```

2. La API estará disponible en `http://localhost:3000`.

## Endpoints Principales

### Autenticación

#### Registro de Usuario

- **URL**: `/api/auth/register`
- **Método**: `POST`
- **Descripción**: Registra un nuevo usuario.
- **Headers**: 
  - `Content-Type: application/json`
- **Body**:
    ```json
    {
      "username": "ejemploUsuario",
      "password": "ejemploContrasena",
      "role": "ADMIN"
    }
    ```
    la logíca pensada es que un ADMIN tambien puede llegar a ser un CLIENT, por lo tanto este puede comprar, pero un cliente no puede agregar productos.


- **Respuesta**:
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": 1,
        "username": "ejemploUsuario",
        "role": "ADMIN",
        "createdAt": "2024-06-20T03:00:00.000Z",
        "updatedAt": "2024-06-20T03:00:00.000Z"
      }
    }
    ```

#### Inicio de Sesión

- **URL**: `/api/auth/login`
- **Método**: `POST`
- **Descripción**: Inicia sesión con un usuario registrado.
- **Headers**: 
  - `Content-Type: application/json`
- **Body**:
    ```json
    {
      "username": "ejemploUsuario",
      "password": "ejemploContrasena"
    }
    ```
- **Respuesta**:
    ```json
    {
      "message": "Logged in successfully",
      "token": "tu_token_jwt"
    }
    ```

### Productos

#### Crear Producto

- **URL**: `/api/products/new`
- **Método**: `POST`
- **Descripción**: Crea un nuevo producto en el inventario (solo para administradores).
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer tu_token_jwt`
- **Body**:
    ```json
    {
      "lotNumber": "L001",
      "name": "Producto Ejemplo",
      "price": 10.5,
      "quantity": 100,
      "entryDate": "2024-06-20"
    }
    ```
- **Respuesta**:
    ```json
    {
      "message": "Product created successfully",
      "product": {
        "id": 1,
        "lotNumber": "L001",
        "name": "Producto Ejemplo",
        "price": 10.5,
        "quantity": 100,
        "entryDate": "2024-06-20T00:00:00.000Z",
        "createdAt": "2024-06-20T03:00:00.000Z",
        "updatedAt": "2024-06-20T03:00:00.000Z"
      }
    }
    ```

### Compras

#### Crear Compra

- **URL**: `/api/purchases/newPurchase`
- **Método**: `POST`
- **Descripción**: Crea una nueva compra.
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer tu_token_jwt`
- **Body**:
    ```json
    {
      "clientId": 1,
      "products": [
        {
          "productId": 1,
          "quantity": 2
        },
        {
          "productId": 2,
          "quantity": 1
        }
      ]
    }
    ```
- **Respuesta**:
    ```json
    {
      "message": "Purchase created successfully",
      "purchase": {
        "id": 1,
        "clientId": 1,
        "total": 30.5,
        "createdAt": "2024-06-20T03:00:00.000Z",
        "updatedAt": "2024-06-20T03:00:00.000Z"
      },
      "products": [
        {
          "purchaseId": 1,
          "productId": 1,
          "quantity": 2,
          "createdAt": "2024-06-20T03:00:00.000Z",
          "updatedAt": "2024-06-20T03:00:00.000Z"
        },
        {
          "purchaseId": 1,
          "productId": 2,
          "quantity": 1,
          "createdAt": "2024-06-20T03:00:00.000Z",
          "updatedAt": "2024-06-20T03:00:00.000Z"
        }
      ]
    }
    ```

```sh
yarn apidoc
