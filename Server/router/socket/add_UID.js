/**
 * @api {socket} add_UID addUID
 * @apiGroup Socket
 * @apiDescription 新增RFID UID
 * @apiparam {String} uid_str 16進制8位數
 * 
 * @apiSuccess (uid not found) {Socket.emit} UID_added "uid not found"
 * 
 * @apiSuccess (uid already visited) {Socket.emit} UID_added "uid already visited."
 * 
 * @apiSuccess (add points) {Socket.emit} UID_added "Add x pts at y sec"
 * @apiSuccess (add points) {Socket.broadcast} UID_added {point}
 */
const add_UID = ({uids,socket})=>{
    return (data) => {
        console.log("UID:",data.uid_str);
        //convert to upper case
        data.uid_str = data.uid_str.toUpperCase();
        // UID not found
        if (!uids[data.uid_str]) {
            socket.emit("UID_added", "uid not found.");
        } 
        // UID already visited
        else if (db.visited[data.uid_str]) {
            socket.emit("UID_added", "uid already visited.");
        } 
        // new valid UID
        else {
            db.status.point += uids[data.uid_str];
            db.status.last_eaten_time = db.time_remaining;
            db.visited[data.uid_str] = true;
            socket.emit(
                "UID_added",
                `Added ${uids[data.uid_str]} points at ${
                    db.time_remaining
                } seconds left.`
            )
            socket.broadcast.emit("UID_added", { point: db.status.point });
            console.log(
                `Added ${uids[data.uid_str]} points at ${
                    db.time_remaining
                } seconds left.`
            )
        }
    }
}

module.exports = add_UID