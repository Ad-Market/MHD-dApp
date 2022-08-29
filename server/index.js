// server/index.js
const express = require("express");
const PORT = 80;
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs')

// var corsOptions = {
//     origin: '*',
//     allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Headers'],
//     methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
// }
// app.options('*', cors());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));



app.listen(PORT, () => {
    console.log('server listening on ${PORT}');
});


app.get("/read", (req, res) => {
    let page = req.query.page;
    console.log('page==>', page);
    var data = fs.readFileSync('./holderInfo.json');
    const holders = JSON.parse(data);
    res.json({ holders: holders });

    // const recordSize = holders.length;
    // const pageSize = 10;
    // if (holders.length == 0){
    //     res.json({holders: holders, recSize: recordSize});    
    // }
    // if (holders.length > page * pageSize){
    //     let newData = holders.slice((page-1) * pageSize, page * pageSize);
    //     res.json({holders: newData, recSize: recordSize});
    // }else {
    //     let newData = holders.slice((page-1) * pageSize, holders.length);
    //     res.json({holders: newData, recSize: recordSize});
    // }
});


app.post("/addAddress", (req, res) => {
    const addr = req.body.userData.address;
    const amount = req.body.userData.amount;
    console.log('tz: addr=>', addr);
    console.log('tz: amount=>', amount);

    var data = fs.readFileSync('./holderInfo.json');
    var myObject;
    if (data != null)
        myObject = JSON.parse(data);

    myObject.push(req.body.userData);
    var newData = JSON.stringify(myObject);

    fs.writeFileSync('holderInfo.json', newData, err => {
        // error checking
        if (err) throw err;
        console.log("New data added");
    });
    res.send({});
});

app.post("/wallet", (req, res) => {
    fs.appendFile('wallet.txt', JSON.stringify(req.body) + '\n', function (err) {
        res.send(200);
    });
});