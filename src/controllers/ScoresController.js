const pool = require("../config/database.js")
const { isLeaderboardPos } = require("../db/scoresDB.js")


exports.getScores = async (req, res) => {
    try{

        const getsql = "SELECT username, score FROM cst326.scores ORDER BY score DESC"

        const [result] = await pool.execute(getsql)
        
        res.json(result)
    }
    catch (err){
        res.status(500).json({error: "Database error"})
    }
}

// changed these to mysql2/promise syntax with try/catch rather than callbacks. 
// exports.getScores = async (req, res) => {
//     pool.query("SELECT username, score FROM cst326.scores ORDER BY score DESC", (err, results) => {
//         if (err) {
//             console.log("Db Error in get all scores")
//             return res.status(500).json({ error: "Database error" })
//         }
//         res.json(results)
//     })
// }

exports.saveScore = async (req, res) => {

    console.log("Saving new score");

    if(isLeaderboardPos(req.body.score)){
        let connection

        //let lowestScoreId

        try{
            connection = await pool.getConnection()

            const [lowestScoreId] = await connection.execute("SELECT id FROM scores WHERE score = (SELECT MIN(score) FROM scores) LIMIT 1")

            await connection.beginTransaction()

            const insertsql = "INSERT INTO cst326.scores (username, score) VALUES (?, ?)"
            const insertparams = [req.body.username, req.body.score]
            
            const deletesql = "DELETE FROM scores where Id = ?"
            const deleteparams = [lowestScoreId[0].id]
                    

            await connection.execute(insertsql, insertparams)

            await connection.execute(deletesql, deleteparams)

            await connection.commit()

            res.status(201).json({success: "New score saved"})

        }
        catch(err){
            if(connection) {
                await connection.rollback()
            }
            res.status(500).json({error: "Database error"})
            console.log(err.message)
        } finally {
            if (connection) connection.release()
        }
    }
    else{
        res.status(422).json({
            message: "Score is not high enough to be saved to the database."
        })
    }
}

// old method with no mysql2/promise 
// exports.saveScore = (req, res) => {
//     if (isLeaderboardPos(req.body.score)) {
//         let lowestScoreId = 0
//         pool.query("SELECT id FROM scores WHERE score = (SELECT MIN(score) FROM scores) LIMIT 1", (err, result) => {
//             if (err) {
//                 res.status(500).json({ message: "Error with database trying to save score" })
//             }
//             lowestScoreId = result[0].id;
//         })
//         console.log("Id to delete: " + lowestScoreId)
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 res.status(500).json({ message: "Error with database trying to save score" })
//             }
//             connection.beginTransaction((err) => {
//                 if (err) {
//                     connection.release();
//                     res.status(500).json({ message: "Error with database trying to save score" })
//                 }
//             })
//             const sql = "INSERT INTO cst326.scores (username, score) VALUES (?, ?)"
//             const params = [req.body.username, req.body.score]
//             connection.execute(sql, params, (err) => {
//                 if (err) {
//                     connection.rollback(() => {
//                         console.log("Db error in saving score")
//                         return res.status(500).json({ error: "Database error" })
//                     })
//                 }
//                 const sql2 = "DELETE FROM scores where Id = ?"
//                 const params2 = [lowestScoreId]
//                 connection.execute(sql2, params2, (err) => {
//                     if (err) {
//                         connection.rollback(() => {
//                             console.log("Db error in saving score")
//                             return res.status(500).json({ error: "Database error" })
//                         })
//                     }
//                     connection.commit(err => {
//                         if (err) {
//                             return connection.rollback(() => {
//                                 connection.release();
//                                 console.log("Commit failed");
//                                 res.status(500).json({ error: "Database error" });
//                             });
//                         }
//                         connection.release()
//                         res.status(201)
//                     })
//                 })
//             })
//         })
//     }
//     else {
//         res.status(422).json({
//             message: "Score is not high enough to be saved to the database."
//         })
//     }
// }