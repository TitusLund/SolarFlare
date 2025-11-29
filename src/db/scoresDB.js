const pool = require("../config/database.js")

exports.isLeaderboardPos = async (scoreToCheck) => {
  try {
    const [results] = await pool.query(
      "SELECT score FROM cst326.scores ORDER BY score ASC LIMIT 1"
    );

    const lowestScore = results[0].score;
    
    let returnval = scoreToCheck > lowestScore;

    return returnval; // return true/false
  } catch (err) {
    console.log("Db Error in get lowest score", err);
    return false;
  }
};