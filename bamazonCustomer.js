//require mySQL, table and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var amountOwed;
var currentDepartment;
var updateSales;

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

    displayItems();
});

//displays the available products

function displayItems(){
    connection.query('SELECT item_id, product_name, price FROM products WHERE stock_quantity;', function(err, res){
        // if(err) throw err;
        console.log('--------------------------');
        console.log('----Available Products----');

        // for (var i = 0; i < res.length; i++){
            // console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "Quantity: " + res[i].stock_quantity);
        // }

        var table = new Table({
            head: ['Product ID', 'Product Name', 'Price']
        });

        for(var i = 0; i < res.length; i++){
            table.push([res[i].item_id, res[i].product_name, '$'+ res[i].price]);
        }

        console.log(table.toString());

        placeOrder();
    });
}
// prompt for customer to enter item and quantity for purchase
function placeOrder() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'itemID',
            message: 'What is the ID of the product you would like to purchase?',
            //
            validate: function(value) {
                if(isNaN(value) === false) {
                    return true;
                }

                    return false;
                    // 'Please enter a valid Product ID'
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to purchase?',
            //
            validate: function(value) {
                if(isNaN(value) === false) {
                    return true;
                }

                    return false;
                    // 'Please enter a numerical valur'
            }
        }
        // if we dont have enough in stock to display "insufficient quantity"
    ]).then(function(ans){
        var query = "Select stock_quantity, price, product_sales, department_name FROM products WHERE ?";
        connection.query(query, {item_id: ans.itemID}, function(err, res){
            if(err) throw err;

            var available_stock = res[0].stock_quantity;
			var price_per_unit = res[0].price;
			var productSales = res[0].product_sales;
            var productDepartment = res[0].department_name;
            
            if (available_stock >= ans.quantity) {
                completeOrder(available_stock, price_per_unit, productSales, productDepartment, ans.itemID, ans.quantity);
            } else {
                console.log("There isn't enough stock left!");

                requestItem();
            }

        });
    });
};

//complete user request to order product

var completeOrder = function(availableStock, price, productSales, productDepartment, selectedProductID, selectedProductUnits) {
    
    var updateStockQuantity = availableStock - selectedProductUnits;

    var totalPrice = price * selectedProductUnits;

    var updatedProductSales = parseInt(productSales) + parseInt(totalPrice);

    var query = "UPDATE products SET ? WHERE ?";

    connection.query(query, [{
        stock_quantity: updateStockQuantity,
        product_sales: updatedProductSales
    }, {
        item_id: selectedProductID
    }], function(err, res) {
        if(err) throw err;

        console.log("Your order is complete.");

        console.log("Your payment is: " + totalPrice);

        updateDepartmentRevenue(updatedProductSales, productDepartment);
    });
};

// update total sales for department after completed the order

var updateDepartmentRevenue = function(updatedProductSales, productDepartment) {
    var query = "Select total_sales FROM departments WHERE ?";

    connection.query(query, {department_name: productDepartment}, function(err, res) {
        if(err) throw err;

        var departmentSales = res[0].total_sales;

        var updatedDepartmentSales = parseInt(departmentSales) + parseInt(updatedDepartmentSales);


        completeDepartmentSalesUpdate(updatedDepartmentSales, productDepartment);
    });
};

// completes update to total sales

var completeDepartmentSalesUpdate = function(updatedDepartmentSales, productDepartment) {

	var query = "UPDATE departments SET ? WHERE ?";
	connection.query(query, [{
		total_sales: updatedDepartmentSales
	}, {
		department_name: productDepartment
	}], function(err, res) {

		if (err) throw err;

		// Displays products so user can choose to make another purchase.
		displayItems();
	});
};
