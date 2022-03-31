/*
TODO: 
    genetate a map.csv
    send the csv to /generate
*/

const express = require('express')
const {spawn} = require('child_process');
const stdin = process.stdin;
const fs = require("fs");


module.exports = ({io})=>{
    return (req, res) => {

        var filename = "./data/csv_"; //prefix
        filename = filename.concat(req.headers.hash, '.json');
        
        console.log(filename);
        // 1. filename 2. start 3. end 4. str

        const pykey = spawn('python3', ['./Maze/DFS.py',filename,req.headers.nd_start,req.headers.nd_end,req.headers.str]);
        pykey.stdout.on('data', function (data) {
            console.log('DFS: Pipe data from python script ...');
            dataToSend = JSON.parse(data);
            res.json(dataToSend);
            console.log(dataToSend);

            pykey.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}`);
            });        
        });

    
    }

    
}

// module.exports = ({io})=>{

//     console.log('keyboardInputxx');
//     return (req, res) => {    
//     const pykey = spawn('python3', ['./Maze/initKeyboard.py']);
//     pykey.stdout.on('data', function (data) {
//         console.log('keyboardInput: Pipe data from python script ...');
//         dataToSend = JSON.parse(data)
//         res.json(dataToSend)
//         console.log(dataToSend);
//         pykey.on('close', (code) => {
//             console.log(`child process close all stdio with code ${code}`);
//         });
    
//     });

//     }

// }


