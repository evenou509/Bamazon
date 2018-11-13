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
    connection.query('SELECT item_id, product_name, price, stock_quantity, FROM products;', function(err, res) {

        var table = new Table({
            head: ['Product ID', 'Product Name', 'Price','Quantity']
        });
        // if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, '$' + res[i].price, res[i].stock_quantity])
            console.log('---------------------------------')
            // console.log("Product ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
        }
        console.log(Table.toString());
        // Lets manager select new action.
        whatYouLikeToDo();
    });
};
    
    //View low inventory 'list of all item that are under 5'
    //Add to inventory 'if the manager will like to add more inventory'
    //Add new product 'if the manager will like to add new product'
