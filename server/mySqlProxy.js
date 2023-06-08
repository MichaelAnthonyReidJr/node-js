const promisePool = require("./PromisePool").promisePool;

const SELECT_PERSON = "SELECT * FROM person WHERE person_id = ?";

exports.selectPersonById = async (personId) => {
  try {
    const [rows] = await promisePool.query(SELECT_PERSON, [personId]);
    return rows;

  } catch (e) {
    console.log(e);
  }
};
