/*
TODO: 
    genetate a map.csv
    send the csv to /generate
*/

const express = require('express')
const {spawn} = require('child_process');
const stdin = process.stdin;
const fs = require("fs");
const path = require('path');


module.exports = ({io})=>{
    console.log('keyboardInputxx');
    return (req, res) => {

        var rawdata = req.headers.raw;
        


        var rows = rawdata.split("/");
        // The file's text will be printed here
        let data = {};
        for (var row of rows.slice(1)) { 
            let dt = row.split(",");

            let nd_int = parseInt(dt[0]);

            console.log(dt);
            if(dt[0]!=''){
                data[nd_int] = {};
                for(var i=1;i<5;i++){
                    if(dt[i]!='')
                        data[nd_int][i] = [parseInt(dt[i]),parseInt(dt[i+4])]  
                }
                console.log(data);
    
            }


             
        }


        
            console.log(req.headers.hash);

 
        fs.writeFile("./data/csv_"+req.headers.hash+'.json', JSON.stringify(data), function(err) {
            if (err) {
                console.log(err);
            }
        });
        const pykey = spawn('python3', ['./Maze/loadMap.py',"./data/csv_"+req.headers.hash+'.json']);
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


