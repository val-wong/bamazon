var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mySQL:" + connection.threadId);
});

connection.query("SELECT * FROM products", function(err, res) {
  if (err) throw err;
  for (var i = 0; i < res.length; i++) {
    console.log("ID:" + res[i].item_id + " -- Product Name: " + res[i].product_name + " -- Price: $" + res[i].price);
  }
  inquirer.prompt([{
      type: "input",
      message: "What is the ID of the product that you want to buy?",
      name: "productId"
    },
    {
      type: "input",
      message: "How many units of the product would you like to buy?",
      name: "productQuantity"
    }
  ]).then(function(answer) {
    connection.query("SELECT * FROM products WHERE ?",[{item_id:parseInt(answer.productId)}], function(err,res){
      if(err) throw err;
      if(res[0].stock_quantity < parseInt(answer.productQuantity)){
        console.log('Insufficient quantity');
      } else{
      // NOTE: have our update function to deplete stock.
      connection.query("UPDATE products SET ? WHERE ?",
      [{
        stock_quantity: res[0].stock_quantity - parseInt(answer.productQuantity)
      },
      {
        item_id: res[0].item_id
      }], function(err){
        if(err) throw err;
        console.log("updated");
      })
        console.log("You just bought " + answer.productQuantity + " " + res[0].product_name + " costing you $" + (parseInt(answer.productQuantity) * res[0].price));
      }

    })
    // console.log("You bought " +answer.productQuantity + " of " +answer.productId);
  });
});
