import express from 'express';
import {sequelize} from "./db.js";
import router from "./routers/router.js";
import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import __dirname from "./__dirname.js";
import fileUpload from 'express-fileupload';
import cors from 'cors';

const port = process.env.PORT || 6000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

const connect = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("\x1b[35m", 'Соединение с БД было успешно установлено', "\x1b[0m");
        app.listen(port, process.env.HOST, () => {
            console.log("\x1b[35m", `Server started on port ${port}`, "\x1b[0m")
        });
    } catch (e) {
        console.log('Невозможно выполнить подключение к БД: ', e)
    }
}
connect();
