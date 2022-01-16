/*
TODO: 
    read map json file
    turn to csv and download
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

        const pykey = spawn('python3', ['./Maze/download.py',filename,req.headers.nd_start]);
        pykey.stdout.on('data', function (data) {
            console.log('keyboardInput: Pipe data from python script ...');
            // dataToSend = JSON.parse(data);
            // res.json(dataToSend);
            // console.log(dataToSend);
            res.send(data);


            pykey.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}`);
            });        
        });

    
    }

    
}