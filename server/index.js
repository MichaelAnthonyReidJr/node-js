const cors = require("cors");
const express = require("express");
const { body, check, param, validationResult } = require("express-validator");
const { promisePool } = require("./PromisePool.js");
const PORT = 80;
const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

// Middleware...
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your endpoints here..
app.get("/message", cors(corsOptions), async (req, res) => {
  // const result = await mySqlProxy.<YOUR FUNCTION HERE>
  // const id = req.params['id']                  // Read parameters from URL.
  // const personType = req.query['personType']   // Read query parameters from URL.
  // const body = req.body                        // Read request body.
  // res.send(<YOUR OBJECT HERE>)
  res.send({ message: "Hello World" });
});
app.get(`/car/:id`, cors(corsOptions), async (req, res) => {
  const id = req.params.id; 
  const [ result ] = await promisePool.query("SELECT * FROM car WHERE car_id = ? ", [id]);
  res.send( result [0]);
 });

app.get(`/person`, cors(corsOptions), async (req, res) => {
   const people = await promisePool.query('SELECT * FROM person');
   res.send(people)
});

app.listen(PORT, () => {
    console.log(`Express web API running on port: ${PORT}.`)
})