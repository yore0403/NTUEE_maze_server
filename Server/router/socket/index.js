module.exports = ({socket,uids,io})=>{
    socket.on("add_UID", require('./add_UID')({uids,socket}))
    // on "start_game"
    socket.on("start_game", require('./start_game')({uids,socket,io}))
    // on "stop_game"
    socket.on("stop_game", ()=>{
        require('./endgame')({socket,io})
    })
}