const express = require('express')
const {spawn} = require('child_process');
// const app = express()
// const port = 3001
const stdin = process.stdin;
const fs = require("fs");


module.exports = ({io})=>{

    console.log('keyboardInputxxxx');
    return (req, res) => {    
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

