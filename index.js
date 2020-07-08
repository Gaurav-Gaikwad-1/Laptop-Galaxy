const fs=require('fs');                                            //fs is file system
const http = require('http');
const url = require('url');


const json = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');               //here we use synchrous version bcoz it happens only once when we start the app
const laptopData = JSON.parse(json);   //laptopData is an array of 5 objects from data.json //parse converts a Javascript object Notation(JSON) string into an object

const server = http.createServer((req,res) => {                          //req ->request    res->response

    const pathName=url.parse(req.url , true).pathname;
    const id = url.parse(req.url, true).query.id;                    //console log this " url.parse(req.url, true) " there u will see query in that id   


    //PRODUCTS OVERVIEW
    if(pathName === '/products' || pathName === '/'){                          //this is routing
        res.writeHead(200, { 'Content-type': 'text/html' } );               //here 200 is Requst succesfull code 
        //res.end('this is a Products page');                                       //sending response to server
         
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8' , (err, data) => {                    //here we pass the filename ie template which we have created

            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/templates-card.html`, 'utf-8' , (err, data) => {                     
                const cardsOutput = laptopData.map( el => replaceTemplate(data, el)).join('');               //now this is in form of array so we make it in string by join method
                overviewOutput = overviewOutput.replace('{%CARDS%}',cardsOutput);
                res.end(overviewOutput);                                                     
            });  
                                                            //data contains the data in form of string from template-overview file
        });  
    } 
    //LAPTOP DETAILS
    else if( pathName === '/laptop' && id < laptopData.length){
        res.writeHead(200, { 'Content-type': 'text/html' } );               
       
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8' , (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data,laptop);                               //this function replaces all placeholder in string  with actual laptop data 
            res.end(output);                                                               //and prints this on screen
            
        });
    } 
    //URL NOT FOUND
    else {
        res.writeHead(404, { 'Content-type': 'text/html' } );               //here 404 is error processing server
        res.end('Page not Found');                                           
    }
    

    
    
});

server.listen(1337,'127.0.0.1', () => {                             //to see results go to this link instead of live server
      console.log('listening started');
});

function replaceTemplate(orginalHTML,laptop) {
    let output = orginalHTML.replace('{%PRODUCTNAME%}',laptop.productName);
    output = output.replace('{%IMAGE%}',laptop.image);
    output = output.replace('{%CPU%}',laptop.cpu);
    output = output.replace('{%RAM%}',laptop.ram);
    output = output.replace('{%STORAGE%}',laptop.storage);
    output = output.replace('{%SCREEN%}',laptop.screen);
    output = output.replace('{%PRICE%}',laptop.price);
    output = output.replace('{%DESCRIPTION%}',laptop.description);
    output = output.replace('{%ID%}',laptop.id);
    return output;

}