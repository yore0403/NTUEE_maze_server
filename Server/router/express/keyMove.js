const express = require('express')
const {spawn} = require('child_process');
// const app = express()
// const port = 3001
const stdin = process.stdin;
const fs = require("fs");

function checkCorrider(map,i,w) {
    let len = map.length
    let c = 0
    if((i+w)<len&&map[i+w]!=' ')
        c++
    if((i-w)>=0&&map[i-w]!=' ')
        c++
    if((i+1-1)%w!=0&&map[i+1-1]!=' ')
        c++
    if((i+w)<len&&map[i+w]!=' ')
        c++

}
module.exports = ({io})=>{
    return (req, res) => {    
        // let w = req.headers.width+1 
        // let h = req.headers.height
        // let map = decodeURIComponent((req.headers.map))
        // let ori = req.headers.orientation
        // let move = req.headers.move
        // console.log(req.headers.map)
        // console.log(map)
        // console.log("sdsd")
        // for(var i=0;i<map.length;i++){
        //     if(map[i]==/(>|<|ʌ|v)/){
        //         map[i-w] = 'ʌ'
                
        //         if(move=='f'){
        //             if((i-2*w)>=0 && map[i-w]!=' '){// road
        //                 map[i-2*w] = 'ʌ'
        //                 if((i-2*w)>=0)
        //             }

        //         }else if(move=='b'){
                    
        //         }else if(move=='r'){
                    
        //         }else if(move=='l'){
                    
        //         }
        //     }
        // }

        
        var filename = "./data/csv_"; //prefix
        filename = filename.concat(req.headers.hash, '.json');
        
        console.log(filename);

    const key = spawn('python3', ['./Maze/keyboardInput.py',filename,req.headers.nd_start,req.headers.orientation,req.headers.move,req.headers.explored]);
    key.stdout.on('data', function (data) {
        console.log('keyboardInput: Pipe data from python script ...');
        dataToSend = JSON.parse(data)
        res.json(dataToSend)
        console.log(dataToSend);
        key.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        });
    
    });

    }

}

