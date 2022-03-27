import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema } = pkg;

const todoSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
 
});

const Todo = mongoose.model("todo", todoSchema);

 
export default Todo;
 
