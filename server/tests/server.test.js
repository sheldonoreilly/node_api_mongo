const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");
const { Todo } = require("./../models/todo");

const todos = [
	{
		text: "First test todo"
	},
	{
		text: "Second test todo"
	}
];

beforeEach(done => {
	Todo.remove({})
		.then(() => {
			return Todo.insertMany(todos);
		})
		.then(() => {
			done();
		})
		.catch(err => {
			done(err);
		});
});

describe("POST /todos", () => {
	it("should create a todo", done => {
		const text = "Text test";

		request(app)
			.post("/todos")
			.send({ text })
			.expect(200)
			.expect(res => {
				console.log(res.body);
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				//use the model to find indivdual docs
				//no param to find - finds all
				Todo.find({ text: "Text test" })
					.then(todos => {
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should not create todo with invalid data", done => {
		request(app)
			.post("/todos")
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
			});

		Todo.find()
			.then(todos => {
				expect(todos.length).toBe(2);
				done();
			})
			.catch(err => {
				done(err);
			});
	});
});

describe("Test GET to todos", () => {
	it("test the GET of /todos", done => {
		request(app)
			.get("/todos")
			.expect(200)
			.expect(res => {
				res.body.todos.length.toBe(2);
			})
			.end(done());
	});
});
