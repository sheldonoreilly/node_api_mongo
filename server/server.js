var express = require("express");
var bodyParser = require("body-parser");

var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();

// if deployed use env port 'or' 3000 for local
const port = process.env.PORT || 3000;
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

app.get("/todos/:id", (req, res) => {
	//lets ensure that the param is a valid id
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(404).send();
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

app.delete("/todos/:id", (req, res) => {
	//get the incoming id
	const id = req.params.id;
	//validate the id
	//if ! then return 404
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id)
		.then(deletedDoc => {
			//ensure that a doc did exist
			//if so return it else return 404
			if (deletedDoc) {
				res.send({ deletedDoc });
			} else {
				res.status(404).send();
			}
		})
		.catch(err => {
			res.status(400).send();
		});
});

app.listen(port, () => {
	console.log(`Starting on port ${port}`);
});

//set app property to the app variable
module.exports = { app };
