const router = require('express').Router();
const cors = require('cors');
const fs = require("fs");

module.exports = ({ io, PORT })=>{

    router.use(cors({origin:'http://localhost:4000'}))
    router.get("/maze", require('./maze')({io})); //click call this
    router.get("/download", require('./download')({io})); //click call this
    router.get("/downloadZIP", require('./downloadZIP')({io})); //click call this
    router.get("/upload", require('./upload')({io})); //click call this
    router.get("/loadMap", require('./loadMap')({io})); //click call this
    router.get('/keyBoard',require('./keyBoard')({io}));
    router.get('/DFScheck',require('./DFS')({io}));
    router.get("/info", (req, res) => {
        res.json({
            ip: require('./getIP')(PORT)
        });
    });
    // router.get('/keyBoard/Redo',require('./Undo')({io}));
    router.get('/keyBoard/Move',require('./keyMove')({io}));
    router.get('/string',require('./string')({io}));
    router.get('/string/Move',require('./stringMove')({io}));
    router.get('/hash/remove',function(req, res) {
        console.log('req.session/remove');
        var filename = "./data/csv_"; //prefix
        filename = filename.concat(req.headers.hash, '.json');
        console.log(filename);

        fs.stat(filename, function (err, stats) {
            if (err) {
                return console.error("err");
            }
            fs.unlink(filename,function(err){
                 if(err) return console.log(err);
                 console.log('file deleted successfully');
            });  
         });
        // fs.rm(filename, function() {console.log('Error: remove file failed.');} );
    });



    return router
}