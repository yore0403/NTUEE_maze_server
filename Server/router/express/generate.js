/*
TODO: 
    genetate a map output as csv
    at the same time print out map in text, return map, csv file name
*/
const express = require('express')
const {spawn} = require('child_process');
const stdin = process.stdin;
const fs = require("fs");


module.exports = ({io})=>{
    console.log('generate');
    return (req, res) => {
    
        const python = spawn('python3', ['./Maze/generateMap.py','gen']); // create csv
        python.stdout.on('data', function (data) {
            console.log('generateMap: Pipe data from python script ...');
            dataToSend = JSON.parse(data)
            res.json(dataToSend)
            console.log(dataToSend);

            python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
        });


    });

    }

}

