//jshint esversion: 6

const express=require("express");
const bodyParser=require("body-parser");
const http = require("https");
const ejs = require("ejs");

var app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.listen(3000, (req,res)=>{
    console.log("Server Started  @ 3000");  // It will give getrequest to root directory
});

app.get("/", (req,res)=>{  //Root directory '/' , res=response 
    res.render('input');  //input file is being rendered here. render usually search views folder for the file.
});

app.post("/compile", (request,response)=>{   // When the form is submitted in input file the request will come here,
    let code = request.body.code;   //It will access code from the input file
    let language = request.body.language;  //Access language selection from input file
    let input = request.body.input; //Input for the code written (test cases)

    //-----------------------API Code------------------//
    const options = {   
        method: 'POST',
        hostname: 'online-code-compiler.p.rapidapi.com',
        port: null,
        path: '/v1/',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'faa982cc76msh0dfe7b6d3177c99p1ebe7ejsne186620530dc',
            'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
        }
    };
    
    const req = http.request(options, function (res) {
        const chunks = [];
    
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
    
        res.on('end', function () {
            const body = Buffer.concat(chunks);
            // console.log(body.toString());
            
            let bod = JSON.parse(body);

            if(bod.error)
            console.log("err");

            else
            response.render('output', {output: bod.output});  //sending the output from the API to the output file
        });
    });
    
    req.write(JSON.stringify({  //Here we are giving input to the API.
      language: language,
      version: 'latest',
      code: code,
      input: input
    }));
    req.end();
    //--------------------------------------//
})
