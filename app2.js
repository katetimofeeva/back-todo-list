const http = require("http");
const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

// "test": "echo \"Error: no test specified\" && exit 1"
const port = 3030;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Request-Method": "*",
  "Access-Control-Allow-Methods": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type",
};

const mongoClient = new MongoClient(
  "mongodb+srv://mgk:StoikTUM@cluster0.og7kz.mongodb.net/todo_list?retryWrites=true&w=majority"

);

const server = http
  .createServer((request, response) => {
    console.log("server work");
    console.log(request.method);

    if (request.method === "OPTIONS") {
      response.writeHead(204, headers);
      response.end("OPTIONS end");
      console.log("yspex");
      return;
    }
    if (
      ["GET", "POST", "OPTIONS", "DELETE", "PUT"].indexOf(request.method) > -1
    ) {
      response.writeHead(200, headers);

      if (request.method === "POST" && request.url === "/") {
        console.log("post");
        let body = "";
        request.on("data", (chunk) => {
          body += chunk.toString();
        });
        request.on("end", () => {
          console.log(body);

          let todos = JSON.parse(body);

          console.log(todos);
          // const res = run(todos);
          // response.end(JSON.stringify(res));
          const end = sendData1(todos, response);
          console.log(end);
          
        });
         
      }

      if (request.method == "POST" && request.url === "/checked") {
        console.log("checked");
        let body = "";
        request.on("data", (chunk) => {
          body += chunk.toString();
          // let data = JSON.parse(body);
          // console.log(data.id, data.checked)
        });
        request.on("end", () => {
          let data = JSON.parse(body);

          completedeTack(data.id, data.checked);

          response.end("checked");
        });
      }
      if (request.method == "POST" && request.url === "/completed") {
        console.log("completedALL");
        let body = "";
        request.on("data", (chunk) => {
          body += chunk.toString();
      
        });
        request.on("end", () => {
          let data = JSON.parse(body);

          completedAllTack(data.checked);

          response.end("completed");
        });
      }

      if (request.method == "POST" && request.url === "/page") {
        console.log("marker");

        let body = "";
        request.on("data", (chunk) => {
          body += chunk.toString();
          // let data = JSON.parse(body);
          // console.log(data.marker);
        });
        request.on("end", () => {
          let data = JSON.parse(body);

          // changePage(data.marker);

          response.end("marker was change");
        });
      }

      if (request.method == "POST" && request.url === "/delete") {
        console.log("delete");
        let id = "";

        request.on("data", (chunk) => {
          id += chunk.toString();
        });
        request.on("end", () => {
          deleteTask(id);
        });
        return response.end("delete");
      }
    }
    if (request.method == "GET") {
      console.log("get");
      sendData(response);
      return;
    }

    response.end('{"end work server":"22"}');
  })
  .listen(port);

async function run(todo) {
  try {
    // Подключаемся к серверу

    await mongoClient.connect();
    console.log("connect");
    const db = mongoClient.db("todos");
    const collection = db.collection("todo");
    // const count = await collection.countDocuments();
    // console.log(`В коллекции todos ${count} документов`);
    const results = await collection.insertOne(todo);
    // const results2 = await collection.find().toArray();
    // console.log(results);
    // console.log(results2);
    return results;
    console.log(todo);
    // взаимодействие с базой данных
  } catch (err) {
    console.log("error");
    console.log(err);
  } 
}

async function completedeTack(id, completed) {
  try {
    // Подключаемся к серверу
    console.log(id);
    // console.log(completed)
    await mongoClient.connect();
    console.log("connect");
    const db = mongoClient.db("todos");
    const collection = db.collection("todo");
    const res = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: completed } }
    );
    console.log(res);
  } catch (err) {
    console.log("error");
    console.log(err);
  } 
}

async function completedAllTack(completed) {
  try {
    console.log(completed);
    await mongoClient.connect();
    console.log("connect");
    const db = mongoClient.db("todos");
    const collection = db.collection("todo");

    completed === true
      ? await collection.updateMany(
          { completed: false },
          { $set: { completed: completed } }
        )
      :await collection.updateMany(
        { completed: true },
        { $set: { completed: completed } }
      )
  } catch (err) {
    console.log("error");
    console.log(err);
  } 
}

async function run(todo) {
  try {
    // Подключаемся к серверу

    await mongoClient.connect();
    console.log("connect");
    const db = mongoClient.db("todos");
    const collection = db.collection("todo");
    // const count = await collection.countDocuments();
    // console.log(`В коллекции todos ${count} документов`);
    const results = await collection.insertOne(todo);
    const results2 = await collection.find().toArray();
    // console.log(results);
    // console.log(results2);
    console.log(todo);
    // взаимодействие с базой данных
  } catch (err) {
    console.log("error");
    console.log(err);
  }
}

async function changePage(marker) {
  try {
    await mongoClient.connect();
    console.log("connect");
    const db = mongoClient.db("todos");
    const collection = db.collection("todo");
    await collection.updateMany({}, { $set: { marker: marker } });
  } catch (err) {
    console.log("error");
    console.log(err);
  } 
}

async function get() {
  try {
    // Подключаемся к серверу

    await mongoClient.connect();
    console.log("connect");
    const db = mongoClient.db("todos");
    const collection = db.collection("todo");
    const res = await collection.find().toArray();
    // console.log(res)
    return res;
    // взаимодействие с базой данных
  } catch (err) {
    console.log("error");
    console.log(err);
  } 
}

async function sendData(response) {
  const res = await get();

  console.log(res);
  response.end(JSON.stringify(res));
}

async function sendData1(todos, response) {
  const res = await run(todos);
  console.log(res);
  return response.end(JSON.stringify(res));
}

async function deleteTask(id) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("todos");
    const collection = db.collection("todo");
    // const res = await collection.deleteOne({ _id: id});

    const res = await collection.deleteOne({ _id: new ObjectId(id) });
    // console.log(new ObjectId(id));
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  } 
}
