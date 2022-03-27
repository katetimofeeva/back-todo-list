import Koa from "koa";
import cors from "koa2-cors";
import koaBody from "koa-body";

import Mongoose from "./lib/mongoose_config.js";
import router from "./router/todos_router/index.js";

const port = process.env.PORT;
const app = new Koa();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Request-Method": "*",
  "Access-Control-Allow-Methods": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type",
};

Mongoose();
app.use(cors());
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log("server work");
});

