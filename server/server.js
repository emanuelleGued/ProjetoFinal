import cors from "cors";
import express from 'express';
import * as index from './lambda/index.js';

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post('/data', async (req, res) => {
    // console.log(req.body)
    const response = await index.handler(req.body);
    res.send(response);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});