const promisePool = require("./PromisePool").promisePool;

const SELECT_PERSON = "SELECT * FROM person WHERE person_id = ?";
const INSERT_PERSON = "INSERT into person (first_name, last_name) values (?,?)"

exports.selectPersonById = async (personId) => {
  try {
    const [rows] = await promisePool.query(SELECT_PERSON, [personId]);
    return rows;

  } catch (e) {
    console.log(e);
  }
};
exports.insertPerson = async (person) => {
  try{
    const [ rows ] = await promisePool.execute(INSERT_PERSON, [person.firstname, person.lastName]);
    return { personId: rows.insertId, ...person };
  }
  catch(e) {
    console.log(e);
  }
}
