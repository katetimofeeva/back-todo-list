const http = require("http");
const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
var koa = require('koa');
var app = new koa();
require("dotenv").config();

const port = process.env.PORT;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Request-Method": "*",
  "Access-Control-Allow-Methods": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type",
};

const mongoClient = new MongoClient(
  `mongodb+srv://mgk:${process.env.PASSWORD}@cluster0.og7kz.mongodb.net/${process.env.COLLECTION}?retryWrites=true&w=majority`
);

function run() {
  try {
    mongoClient.connect(() => {
      const db = mongoClient.db("todos");
      const collection = db.collection("todo");
      const userCollection = db.collection("user");
      console.log("connect");

      const server = http
      .createServer((request, response) => {
          console.log("server work");
          console.log(request.method);
          if (request.method === "OPTIONS") {
            response.writeHead(204, headers);
            response.end("OPTIONS end");

            return;
          }
          if (
            ["GET", "POST", "OPTIONS", "DELETE", "PUT"].indexOf(
              request.method
            ) > -1
          ) {
            response.writeHead(200, headers);
            console.log(request.url);
            if (request.method === "GET" && request.url === "/") {
              console.log("get");
              sendData(response, collection);
              return;
            }

            if (request.method === "POST" && request.url === "/") {
              console.log("POST add");
              let body = "";
              request.on("data", (chunk) => {
                body += chunk.toString();
                console.log(body)
              });
              request.on("end", () => {
                pushData(collection, body);
              });
            }

            if (request.method === "POST" && request.url === "/login") {
              console.log("post");
              let body = "";
              request.on("data", (chunk) => {
                body += chunk.toString();
                console.log(body);
              });
              request.on("end", () => {
                pushData(userCollection, body);
              });
            }

            if (request.method == "POST" && request.url === "/checked") {
              let body = "";
              request.on("data", (chunk) => {
                body += chunk.toString();
                console.log(body);
              });
              request.on("end", () => {
                const name = "checked";
                updateTask(collection, body, name);
              });
            }
            if (request.method == "POST" && request.url === "/completed") {
              let body = "";
              request.on("data", (chunk) => {
                body += chunk.toString();
              });

              request.on("end", () => {
                completedAllTask(collection, body);
              });
            }
            if (request.method == "POST" && request.url === "/delete") {
              console.log("delete");
              let id = "";

              request.on("data", (chunk) => {
                id += chunk.toString();
                console.log(id);
              });
              request.on("end", () => {
                deleteTask(id, collection);
              });
            }
            if (
              request.method == "POST" &&
              request.url === "/deleteAllCompleted"
            ) {
              console.log("deleteAll");
              let body = "";
              request.on("data", (chunk) => {
                body += chunk.toString();
                console.log(body);
              });
              request.on("end", () => {
                deleteAllCompletedTasks(collection);
              });
            }

            if (request.method == "POST" && request.url === "/edit") {
              let body = "";
              request.on("data", (chunk) => {
                body += chunk.toString();
                console.log(body)
              });
              request.on("end", () => {
                const name = "description";
                updateTask(collection, body, name);
              });
            }
          }

          response.end('{"end work server":"22"}');
        })
        .listen(port);
    });
  } catch (err) {
    console.log("error");
    console.log(err);
  }
}

run();
async function sendData(response, collection) {
  const res = await collection.find().toArray();
  response.end(JSON.stringify(res));
}

async function pushData(collection, body) {
  let item = JSON.parse(body);
  const results = await collection.insertOne(item);
  console.log(results);
}

async function completedAllTask(collection, body) {
  const data = JSON.parse(body);
  data.checked
    ? await collection.updateMany(
        { completed: false },
        { $set: { completed: data.checked } }
      )
    : await collection.updateMany(
        { completed: true },
        { $set: { completed: data.checked } }
      );
}

async function deleteTask(id, collection) {
   console.log(new ObjectId(id))
  await collection.deleteOne({ _id: new ObjectId(id) });
}

async function updateTask(collection, body, name) {
  const data = JSON.parse(body);
console.log(data)
  name === "description"
    ? await collection.updateOne(
        { _id: new ObjectId(data.id) },
        { $set: { description: data.description } }
      )
    : await collection.updateOne(
        { _id: new ObjectId(data.id) },
        { $set: { completed: data.checked } }
      );
}

async function deleteAllCompletedTasks(collection) {
  await collection.deleteMany({ completed: true });
}
