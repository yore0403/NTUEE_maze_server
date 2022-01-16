// endgame function
const fs = require("fs");
/**
 * @api {socket} stop_game 結束遊戲
 * @apiGroup Socket
 * @apiDescription 結束遊戲
 * 
 * @apiSuccess {Socket.emit} game_end 
 * @apiSuccess {Socket.broadcast} game_end {history, gamemode}
 */
module.exports = endgame = ({socket,io}) => {
    clearInterval(db.cur_game_countdown);
    console.log("game ended");
    console.log(
        `Team ${db.current_team} got ${db.status.point} points at game${db.status.gamemode}.`
    );
    // update database in memory with the current game
    if (
        !db.history[db.status.gamemode][db.current_team] ||
        db.history[db.status.gamemode][db.current_team].point <
            db.status.point ||
        (db.history[db.status.gamemode][db.current_team].point ==
            db.status.point &&
            db.history[db.status.gamemode][db.current_team].last_eaten_time <
                db.status.point)
    ) {
        db.history[db.status.gamemode][db.current_team] = {
            point: db.status.point,
            last_eaten_time: db.status.last_eaten_time,
            time: new Date().toString().slice(0, 24),
        };
    }
    // broadcast "game_end" for clients to disconnect
    console.log(`gamemode ${db.status.gamemode}`)
    io.emit("game_end", {
        history: db.history[db.status.gamemode],
        gamemode: db.status.gamemode,
    });
    // reset the active game status
    db.current_team = null;
    db.cur_game_countdown = null;
    db.last_eaten_time = 0;
    db.time_remaining = GAME_TIME;
    db.status.gamemode = null;
    db.status.point = 0;
    db.status.current_sequence_index = 0;
    db.status.last_eaten_time = GAME_TIME;
    db.visited = {};
    // write database from memory into file ('./data/history.json)
    fs.writeFile("./data/history.json", JSON.stringify(db.history), (err) => {
        if (err) {
            console.log("history write error");
        } else {
            console.log("history filewrite complete");
        }
    });
}