//require SQL, Inquirer and table 
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//Establish connection with the database
var connection =mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "Bamazon_db"
});

// if connection doesn't work, throws error

connection.connect(function(err) {
    if (err) throw err;

    whatYouLikeToDo();
});

//supervisor action

function whatYouLikeToDo(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ["View product sales by department", "Create new department"]
        }
    ]).then(function(ans){
        switch(ans.action){
            case "View product sales by department":
                viewDepartmentsales();
            
                break;
            
            case "Create new department":
                createDepartment();

                break;

        }
    });
};

// supervisor views product sales by department

function viewDepartmentsales(){
    connection.query("SELECT department_id AS department_id, department_name AS department_name," + "over_head_costs AS over_head_costs, product_sales AS product_sales," + "(product_sales - over_head_costs) AS total_profit FROM departments;", function(err, res){

        var table = new Table({
            head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']
        });

        for (var i = 0; i < res.length; i++){

            var product_sales = res[i].product_sales;
            if(product_sales === null){
                product_sales = 0;
            }

            table.push([res[i].department_id, res[i].department_name, "$" + res[i].over_head_costs, "$" + res[i].product_sales, "$" + (res[i].product_sales - res[i].over_head_costs)])
        }

        console.log(table.toString());

        whatYouLikeToDo();
    });
};

//supervisor create new department 

function createDepartment(){
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "What is the new department name?"
        }, {
            name: "over_head_costs",
            type: "input",
            message: "What are the overhead costs for this department?"
        }
    ]).then(function(ans){
        connection.query("INSERT INTO departments SET ?", {
            department_name: ans.department_name,
            over_head_costs: ans.over_head_costs
        }, function(err, res){
            if(err) {
                throw err;
            } else {
                console.log("Your was added successfully!");

                whatYouLikeToDo();
            }
        });
    });
};







