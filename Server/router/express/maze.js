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
    console.log('maze');
    return (req, res) => {

        
        console.log(req.headers.hash);

        var filename = "./data/csv_"; //prefix
        filename = filename.concat(req.headers.hash, '.json');
        
        console.log(filename);
        const gen = spawn('python3', ['./Maze/generateMap.py',filename,req.headers.width,req.headers.height]); // generate a csv

        gen.stdout.on('data', function (data) { // data: csv
            console.log('generate: Pipe data from python script ...');
            dataToSend = JSON.parse(data); // csv from generate map
            console.log(dataToSend);
            // save csv at local directory


            // fs.writeFile(filename, JSON.stringify(dataToSend), (err) => {
            //     if (err) {
            //         console.log("history write error");
            //     } else {
            //         console.log("history filewrite complete");
            //     }
            // });

            // convert datatosend
            // filename = "../csv/gen.csv";
             
            console.log(filename);
            const layout = spawn('python3', ['./Maze/printMap.py',filename]); // csv to maze TODO: change to input csv
            layout.stdout.on('data', function (data) {
                console.log('map: Pipe data from python script ...');
                console.log("dd");
                

                dataToSend = JSON.parse(data); // map

                res.json(dataToSend);
                console.log("map");
                console.log(dataToSend);
    
                layout.on('close', (code) => {
                    console.log(`printMap process close all stdio with code ${code}`);
                });
            })
            gen.on('close', (code) => {
                console.log(`generate process close all stdio with code ${code}`);
            });


        })
    }

}

