const cors = require("cors");
const express = require("express");
const { body, check, param, validationResult } = require("express-validator");
const { promisePool } = require("./PromisePool.js");
const mySqlProxy = require("./mySqlProxy.js");
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

//Exercise 1 Hello World
app.get("/message", cors(corsOptions), async (req, res) => {
  // const result = await mySqlProxy.<YOUR FUNCTION HERE>
  // const id = req.params['id']                  // Read parameters from URL.
  // const personType = req.query['personType']   // Read query parameters from URL.
  // const body = req.body                        // Read request body.
  // res.send(<YOUR OBJECT HERE>)
  res.send({ message: "Hello World" });
});

//Exercise 2 Get Car
app.get(`/car/:id`, cors(corsOptions), async (req, res) => {
  const id = req.params.id;
  const [result] = await promisePool.query(
    "SELECT * FROM car WHERE car_id = ? ",
    [id]
  );
  res.send(result[0]);
});

//Exercise 3 Get Car for make
app.get("/cars", cors(corsOptions), async (req, res) => {
  const make = req.params.make;
  const [result] = await promisePool.query("SELECT * FROM car WHERE make = ?", [
    make,
  ]);
  res.send(result);
});

//Exercise 4 Post car
app.post("/cars/", cors(corsOptions), async (req, res) => {
  try {
    const newCAr = req.body;
    console.log(newCAr);
    const [result] = await promisePool.execute("INSERT INTO car(make, model, color, price) VALUES(?, ?, ?, ?)", [newCAr.make , newCar.model, newCar.color, newCar.price]);
    
    const newCarId = result.insertId;
    const [newCar] = await promisePool.query(
      "SELECT * FROM car WHERE car_id = ?",
      newCarId
    );
    //res.send("Car has been added")
    res.send(newCar[0]);
  } catch {
    res.status(500).send("Error.....adding car");
  }
});

//Exercise 5 Put Car
app.put("/cars/:id", cors(corsOptions), async (req, res) => {
  const carID = req.params.id;
  const [result] = await promisePool.query(
    "UPDATE car SET make =?, model =?, price = ?, color = ?",
    ["Mazda", "Mazda6", 30000, "silver"]
  );
  res.send({ message: result.info });
});

//Exercise 6 Delete Car
app.delete("/cars/:id", cors(corsOptions), async (req, res) => {
  const caRID = req.params.id;
  const [result] = await promisePool.query("DELETE FROM car WHERE car_id = ?", [
    caRID,
  ]);
  console.log("Deleted!");
  res.send(result);
});

//Exercise 7 Harden Car Endpoints
app.delete("cars/:id", cors(corsOptions), async (req, res) => {
  try {
    const caRID = req.params.id;
    const [result] = await promisePool.query(
      "DELETE FROM car WHERE car_id = ?",
      [caRID]
    );
    console.log("Deleted!");
    res.send(result);
  } catch {
    res.status(404).send("Error....File not found");
  }
  const caRID = req.params.id;
  const [result] = await promisePool.query("DELETE FROM car WHERE car_id = ?", [
    caRID,
  ]);
  console.log("Deleted!");
  res.send(result);
});

//TLMS - Express API Part II Using mySQLPrroxy
app.get("/person/:id", cors(corsOptions), async (req, res) => {
  const personID = req.params.id;
  const person = await mySqlProxy.selectPersonById(personID);
  res.send(person);
});
//TLMS - Express API Part III Using mySQLPrroxy
app.post("/person/", cors(corsOptions), async (req, res) => {
  const person1 = req.body;
  const addedPerson = await mySqlProxy.insertPerson(person1);
  res.send(addedPerson);
});

//Practice
app.get(`/person`, cors(corsOptions), async (req, res) => {
  const people = await promisePool.query("SELECT * FROM person");
  res.send(people);
});

app.listen(PORT, () => {
  console.log(`Express web API running on port: ${PORT}.`);
});
