/*
TODO: 
    read map json file
    turn to csv and download
*/

const express = require('express')
const {spawn} = require('child_process');
const stdin = process.stdin;
const fs = require("fs");
const jszip = require("jszip");
const util = require('util');

module.exports = ({io})=>{
    return (req, res) => {
        var zip = new jszip();
        var dirname = "./data/checklist"; //prefix
        const files = [];
        fs.readdir(dirname, function(err, items) {
        if (items){
            for (var i=0; i<items.length; i++) {
                files.push(items[i])
            }
        }
        
        var checklists = zip.folder("checklist");
       

        async function a () {
            var arr = {};
            for (const [i,element] of files.entries()){
            const readFile = util.promisify(fs.readFile);
            const data = await readFile(dirname+'/'+element,"utf8")

                    if (err) throw err;
                    console.log(element);
                    arr[i]=(data);

            }
            return arr;
        }
                    
        
        const sequence = async () => {
            await a().then(async output2 => {
                console.log(output2);
                res.set('Content-type','application/json');
                // dataToSend = JSON.parse(output2)
                res.send(output2)
            })
            
        }
        sequence()

    })
}

}

    //         // checklists.file("maze11.csv",data.toString())
    //         // checklists.file('a.txt','hello')
    //         // checklists.generateAsync({type:"blob"}).then(function(content) {
    //         //     saveAs(content, "example.zip");
    //         // });