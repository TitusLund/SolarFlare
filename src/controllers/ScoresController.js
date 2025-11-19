const pool = require("../config/database.js")

// exports.validateInput = (req, res, next) => {
//         try {
            
    
//             res.status(200).json({
                
//             })
//         } catch (error) {
//             res.status(500).json({
//                 message: "Failed to fetch scores game",
//                 error: error.message,
//             });
//         }
// }

exports.getScores = (req, res) => {
    pool.query("SELECT username, score FROM cst326.scores ORDER BY score DESC", (err, results) => {
        if(err) {
            console.log("Db Error in get all scores")
            return res.status(500).json({error: "Database error"})
        }
        res.json(results)
    })
}