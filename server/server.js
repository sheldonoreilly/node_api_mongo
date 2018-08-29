var express = require("express");
var bodyParser = require("body-parser");

var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
//use middleware - .json returns a function used by express app
// to take incoming request json and set back a 'body' js obj on the request.
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then(
		doc => {
			res.send(doc);
		},
		e => {
			res.status(400).send(e);
		}
	);
});

app.get("/todos", (req, res) => {
	Todo.find()
		.then(todos => {
			console.log("todos :", todos);
			//better to send an object than an array - allows for futher customization of response
			res.send({ todos });
		})
		.catch(err => {
			res.status(400).send(err);
		});
});

//ObjectId("5b8600f3332c0b2409c2ceae")
app.get("/todos/:id", (req, res) => {
	//lets ensure that the param is a valid id
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(404).res.send();
	}

	Todo.findById(req.params.id)
		.then(todo => {
			if (todo) {
				res.send({ todo });
			} else {
				res.status(404).send();
			}
		})
		.catch(err => {
			res.status(400).send();
		});
});

app.listen(3000, () => {
	console.log("Started on port 3000");
});

//set app property to the app variable
module.exports = { app };
