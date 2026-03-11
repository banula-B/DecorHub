# DecorHub – E-Commerce Web Application

## Overview
DecorHub is a simple e-commerce web application developed as a university assignment. The system allows users to browse home decoration products and perform basic shopping cart operations. The application demonstrates full-stack development using Spring Boot, MySQL, HTML, CSS, and JavaScript with RESTful APIs connecting the frontend and backend.

---

## Features

### User Features
- View home decoration products
- User registration (Sign Up)
- User login (Sign In)
- Add products to cart
- Remove products from cart
- Update product quantity
- Place Orders
- View Order Details
- Cancel Orders

### Admin Features
- Add new products
- Edit product details (price, description, category, image)
- Delete products
- Manage product information

---

## Technologies Used

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Maven
- REST API

### Frontend
- HTML
- CSS
- JavaScript

### Database
- MySQL

---

## Project Structure

```
com.decorhub.decorhub

entity
repository
service
controller
```

---

## API Endpoints

### Product APIs

GET /products  
Get all products

POST /products  
Add a new product

PUT /products/{id}  
Update a product

DELETE /products/{id}  
Delete a product

---

### Authentication APIs

POST /auth/signup  
Register a new user

POST /auth/login  
Login user

---

## How to Run the Project

### 1. Clone the Repository

```
git clone https://github.com/banula-B/DecorHub.git
```

### 2. Create MySQL Database

Create a database named:

```
decorhub
```

### 3. Configure Database

Open `application.properties` and update:

```
spring.datasource.url=jdbc:mysql://localhost:3306/decorhub
spring.datasource.username=root
spring.datasource.password=yourpassword
```

### 4. Run the Application

```
mvn spring-boot:run
```

Server will start at:

```
http://localhost:8080
```

---

## Learning Objectives

This project demonstrates:

- Full stack web development
- REST API development with Spring Boot
- CRUD operations using MySQL
- Frontend and backend integration
- Basic authentication system
- GitHub project management

---

## Author

Banula Bimsara  
Faculty of Computing  
University of Sri Jayewardenepura  
B.Comp. Hons in Computer Science

---

## License

This project is developed for educational purposes.
