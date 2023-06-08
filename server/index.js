const cors = require("cors");
const express = require("express");
const { body, check, param, validationResult } = require("express-validator");
const { promisePool } = require("./PromisePool.js");
const mySqlProxy  = require('./mySqlProxy.js')
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
app.get('/person/:id', cors(corsOptions), async (req, res) => {
  const personID = req.params.id;
  const person = await mySqlProxy.selectPersonById(personID);
  res.send(person)
});

app.get(`/person`, cors(corsOptions), async (req, res) => {
   const people = await promisePool.query('SELECT * FROM person');
   res.send(people)
});
app.get('/cars', cors(corsOptions), async (req, res) => {
  const make = req.params.make;
  console.log(make);
  const [ result ]= await promisePool.query('SELECT * FROM car WHERE make = ?',  [ make ]);
  res.send(result);
});
app.put('/cars/:id', cors(corsOptions), async (req,res) => {
  const carID = req.params.id;
  const [ result ] = await promisePool.query('UPDATE car SET make =?, model =?, price = ?, color = ?'
  , ["Mazda", "Mazda6", 30000, "silver"]);
  res.send({"message": result.info})
});
app.delete('/cars/:id', cors(corsOptions), async(req, res) => {
  const caRID = req.params.id;
  const [ result ] = await promisePool.query('DELETE FROM car WHERE car_id = ?', [caRID])
  console.log("Deleted!")
  res.send(result);
});

app.post('/cars/', cors(corsOptions), async (req, res) => {
try{
  const [ result ]  = await promisePool.query('INSERT INTO car(make, model, color, price) VALUES(?, ?, ?, ?)'
  , ["Toyota","Corolla", "Gray", 30000]);
  
  const newCarId = result.insertId;
  const [ newCar ] = await promisePool.query('SELECT * FROM car WHERE car_id = ?', newCarId)
  //res.send("Car has been added")
  res.send(newCar[0]);
}
catch {
  res.status(500).send("Error.....adding car")
}
});

app.listen(PORT, () => {
    console.log(`Express web API running on port: ${PORT}.`)
});