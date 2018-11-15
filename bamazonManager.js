//require mySQL and 
var mysql = require("mysql");
var inquirer = require("inquirer")
var Table = require('cli-table');
//Establish connection with the database
var connection =mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "Bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;

    whatYouLikeToDo();
});
//Prompt the managers for the action they would like to perform
var whatYouLikeToDo = function() {
	inquirer.prompt([
	{
		type: 'list',
		name: 'action',
		message: 'What would you like to do?',
		choices: [
			"View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"
		]
	}
	]).then(function(ans) {

		// Different functions called based on managers selection
		switch (ans.action) {
		    case "View Products for Sale":
		    	viewProducts();
		      	break;

		    case "View Low Inventory":
		    	viewLowInventory();
		      	break;

		    case "Add to Inventory":
		    	addInventory();
		      	break;

		    case "Add New Product":
		    	addProduct();
		      	break;
		}
	});
};

//View products available

	function viewProducts() {
		// var query = "Select * FROM products";
		connection.query('SELECT item_id, product_name, price, stock_quantity FROM products;', function(err, res) {
			var table = new Table({
				head: ['Product ID', 'Product Name', 'Price', 'Quantity']
			});
			for (var i = 0; i < res.length; i++) {
				table.push([res[i].item_id, res[i].product_name, '$' + res[i].price, res[i].stock_quantity])
			}
			console.log(table.toString());
			// Lets manager select new action.
			whatYouLikeToDo();
		});
	};
		
	//View low inventory 'list of all item that are under 5'
	function viewLowInventory() {
		connection.query('SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5', function(err, res){
			var table = new Table({
				head: ['Product ID', 'Product Name', 'Quantity']
			});
	
			for (var i =0; i < res.length; i++) {
				table.push([res[i].item_id, res[i].product_name, res[i].stock_quantity])
			}
	
			console.log(table.toString());
	
			whatYouLikeToDo();
		})
	}
	
	//Add to inventory 'if the manager will like to add more inventory'
	function addInventory() {
		inquirer.prompt([
			{
				name: "itemID",
				type: "input",
				message: "Enter Item ID that you would like to add stock to."
			},
			{
				name: "quantity",
				type: "input",
				message: "How many you would like to add?"
			}
		]).then(function(ans){
			connection.query("SELECT * FROM products", function(err, results){
				// "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", function(err, results ){
				var chosenItem;
				for (var i = 0; i < results.length; i++){
					if(results[i].item_id === parseInt(ans.itemID)){
						chosenItem = results[i];
					}
				}
	
				var updateStock = parseInt(chosenItem.stock_quantity) + parseInt(ans.quantity);
	
				console.log("Update stock: " + updateStock);
	
				// update stock
				connection.query("UPDATE products SET ? WHERE ?", [{
					stock_quantity: updateStock
				}, {
					item_id: ans.itemID
				}], function(err, res){
					if(err) {
						throw err;
					} else {
						whatYouLikeToDo();
					}
				});
			});
		});
	};
	//Add new product 'if the manager will like to add new product'
	
	function addProduct() {
		inquirer.prompt([{
			name: "products_name",
			type: "input",
			message: "What is the product you would like to add?"
		}, {
			name:"department_name",
			type:"input",
			message: "What is the department for this product?"
		}, {
			name: "price",
			type: "input",
			message: "What is the price for the product?"
		}, {
			name: "stock_quantity",
			type: "input",
			message: "How many stock do you like to start with?"
	
		}]).then(function(ans){
			connection.query("INSERT INTO products SET ?", {
				product_name: ans.product_name,
				departmant_name: ans.departmant_name,
				price: ans.price,
				stock_quantity: ans.stock_quantity
			}, function(err, err){
				if(err) {
					throw err;
				} else {
					console.log("You product was added successfully!");
					
					whatYouLikeToDo();
				}
			});
		});
	};
	