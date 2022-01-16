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

        const pykey = spawn('python3', ['./Maze/loadMap.py',filename]);
        pykey.stdout.on('data', function (data) {
            console.log('loadMap: Pipe data from python script ...');
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


