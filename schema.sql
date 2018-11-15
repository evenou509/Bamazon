
DROP DATABASE IF EXISTS Bamazon_db;


CREATE DATABASE Bamazon_db;

USE Bamazon_db;

CREATE TABLE products(
	item_id MEDIUMINT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    
    primary key(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)

VALUE ("Donna Sorrento women Dress", "Clothing", 23.98, 50),
    ("George Men Long Sleeve Shirt", "Clothing", 9.87, 20),
    ("Xbox one", "Electronics", 299.00, 100),
    ("PlayStation 4", "Electronics", 298.99, 100),
    ("Google Home Mini", "Electronics", 189.00, 10),
    ("Microwave", "Home & Kitchen", 59.88, 20),
    ("Coffee Maker", "Home & Kitchen", 19.98, 15),
    ("Sofas Bed", "Furniture", 189.00, 10),
    ("Leather Sofas", "Furniture", 399.99, 10),
    ("13 Hours (Blu-Ray)", "Movie", 189.00, 10);



CREATE TABLE Departments(
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    product_sales DECIMAL(10,2) NOT NULL,

    primary key(department_id)
);

INSERT INTO Departments(department_name, over_head_costs, total_sales)

VALUE ("Clothing", 500, 800),
     ("Electronics", 1000, 3000),
      ("Home & Kitchen", 1000, 3500),
       ("Furniture", 1200, 2000),
        ("Movie", 300, 500);