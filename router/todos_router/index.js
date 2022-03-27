import Router from "koa-router";

import { addTask, getTodos, deleteTask, updateTask, completedAllTask, deleteAll } from "./todos.js";

const router = new Router();

router.post("/todo", addTask);

router.delete("/delete/:id", deleteTask);

router.put("/todo/update", updateTask);

router.put('/todos/completeAll', completedAllTask)

router.delete("/todos/deleteAll", deleteAll)

router.get("/todos", getTodos);

export default router;
