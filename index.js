const express = require('express')

const app = express();
var mysql = require('mysql')
var sbtsDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sbtsform",
});

var cors = require('cors')
app.use(cors())




var bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const axios = require('axios');



let server = app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
});
let io = require('socket.io')(server);
app.post("/createForm", (req, res, next) => {
    console.log(req.body)
    var values = Object.values(req.body)
    var columns = Object.keys(req.body).join();
    var sql = `INSERT INTO ttform (${columns}) VALUES ?`;

    console.log(sql)
    sbtsDB.query(sql,[[values]], function (err, result, fields) {
        if (err) throw err;
        io.emit('createdForm', result)
        res.status(200).send({
            state: 1,
            data: result
        });
        // console.log(result)

    })

});

app.get('/getformData', (req, res) => {
    var sql="SELECT * FROM ttform "
    sbtsDB.query(sql, function (err, result, fields) {
        if (err) {
            return res.status(200).send({
                state: 1,
                data: []
            });
        }
        res.status(200).send({
            state: 1,
            data: result
        });
    })
});

app.post('/submitForm', (req, res) => {
// console.log(req.body)
    req.body.forEach(item => {
        var setValue=item
            ,where={
            id:item.id,
        }
        var contacts = item.contactnames
        if(contacts){
            var contacts=JSON.parse(item.contactnames)
            console.log(contacts)
            for (i = 0; i<contacts.length; i++){
                var body =  contacts[i]

                console.log(body)
                var values = Object.values(body)
                var columns = Object.keys(body).join();
                var sql = `INSERT INTO ttform (${columns}) VALUES ?`;

                console.log(sql)
                sbtsDB.query(sql,[[values]], function (err, result, fields) {
                    if (err) throw err;
                    io.emit('createdForm', result)

                    // console.log(result)

                })
            }
        }


        var sql=mysql.format("UPDATE ttform SET ? WHERE ?",[setValue,where])
        // console.log(sql)
        sbtsDB.query(sql,function (err, result) {
            if (err) throw err;
            console.log("Number of records deleted: " + result.affectedRows);

        });

        var sql=mysql.format("UPDATE ttform SET contactnames = NULL;")

        sbtsDB.query(sql,function (err, result) {
            if (err) throw err;
            console.log("Number of records deleted: " + result.affectedRows);

        });
    });
    return res.status(200).send({
        state: 1,
    });
})
