const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost:27017/TodoApp");
mongoose.connect("mongodb://SheldonO:Dolphins01_@ds233228.mlab.com:33228/todoapi");

module.exports = { mongoose };
