import "dotenv/config";
import express from "express";

import session from "express-session";
import MongoStore from "connect-mongo";
import { saveSessionToLocal } from "./middleware";

import "./config/db";
import rootRouter from "./routers/rootRouter";

const app = express();

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`✅ ${PORT}번 포트에 서버 연결됨`);
});

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
        }),
    })
);
app.use(saveSessionToLocal);

app.use("/", rootRouter);
