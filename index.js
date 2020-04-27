const express = require('express')

const app = express();
var mysql = require('mysql')
var sbtsDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sbtsform",
});

const axios = require('axios');

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
});

app.post("/createForm", (req, res, next) => {
    console.log(req.body)
    // var sql=`CALL SP_Treportbytype ('${req.body.userId}','${req.body.fileTypeId}')`
    // var sql=`INSERT INTO table('${req.body.userId}', '${req.body.userId}') VALUES ('${req.body.userId}', '${req.body.userId}')`

    console.log(sql)
    sbtsDB.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).send({
            state: 1,
            data: result[0]
        });
    })
});