import Todo from "../../modelse/Todo.js";

export const addTask = async (ctx) => {
  try {
    console.log(ctx.request.body);
    const { description, completed } = ctx.request.body;

    await new Todo({ description, completed }).save();
    ctx.status = 200;
  } catch (err) {
    console.log(err, "error");
    ctx.status = 400;
    ctx.body = "error";
  }
};

export const getTodos = async (ctx) => {
  try {
    console.log("get");
 
    if (ctx.query.filter === 'completed') {
      ctx.body = await Todo.find({ completed: true });
      console.log(ctx.body)
    } else if(ctx.query.filter === 'active'){
      ctx.body = await Todo.find({ completed: false });
      console.log(ctx.body)
    }else {
      ctx.body = await Todo.find({});
      console.log(ctx.body)
    }
  } catch (err) {
    console.log(err, "error");
    ctx.status = 400;
    ctx.body = "error";
  }
};

export const deleteTask = async (ctx) => {
  try {
    console.log("delete");
    console.log(ctx.params);
    const { id } = ctx.params;
    const todo = await Todo.findByIdAndRemove(id);
  
    ctx.status = 200;
  } catch (err) {
    console.log(err, "error");
    ctx.status = 400;
    ctx.body = "error";
  }
};

export const updateTask = async (ctx) => {
  try {
    console.log("done");
    const { id, checked, description } = ctx.request.body;
    console.log(ctx.request.body);
    description
      ? await Todo.findByIdAndUpdate(id, { $set: { description: description } })
      : await Todo.findByIdAndUpdate(id, { $set: { completed: checked } });

    ctx.status = 200;
  } catch (err) {
    console.log(err, "error");
    ctx.status = 400;
    ctx.body = "error";
  }
};

export const completedAllTask = async (ctx) => {
  try {
    console.log("completedAll");
    const { checked } = ctx.request.body;
    console.log(ctx.request.body);
    checked
      ? await Todo.updateMany(
          { completed: false },
          { $set: { completed: checked } }
        )
      : await Todo.updateMany(
          { completed: true },
          { $set: { completed: checked } }
        );
    ctx.status = 200;
  } catch (err) {
    console.log(err, "error");
    ctx.status = 400;
    ctx.body = "error";
  }
};

export const deleteAll = async (ctx) => {
  try {
    console.log("deleteAll");

    await Todo.deleteMany({ completed: true }), (ctx.status = 200);
  } catch (err) {
    console.log(err, "error");
    ctx.status = 400;
    ctx.body = "error";
  }
};
