import { config } from "dotenv";

config()
export const configAPP = {
    port: process.env.PORT,
    DB_HOST: `mongodb+srv://mgk:${process.env.PASSWORD}@cluster0.og7kz.mongodb.net/${process.env.COLLECTION}?retryWrites=true&w=majority`,
}

