import express from 'express';
import scoreRoutes from './routers/ScoresRouter.js'
import dotenv from "dotenv"

const app = express()
dotenv.config();


app.use("/scores", scoreRoutes)


app.listen(3000, () => {
    console.log("Listening at port 3000")
})