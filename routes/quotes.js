var express = require('express');
var Joi = require('joi');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
const url = require('url');
// const config = require('./config');

var router = express.Router();
var app = express();

// app.set('superSecret', config.secretKey); // secret variable
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
// app.use(function(req, res, next) {
//     if (!req.headers.authorization) {
//       return res.status(403).json({ error: 'No credentials sent!' });
//     }
//     next();
//   });

var db;


/////////////////////////////////// CRUD VISUALIZATION ///////////////////////////////
// MongoClient.connect('mongodb://localhost:27017/star-wars-quotes', (err, client) => {
//     if (err) return console.log(err);
//     db = client.db('star-wars-quotes'); // whatever your database name is


//     app.set('view engine', 'ejs');

//     app.get('/',(req,res) => {
//         // res.sendFile(__dirname + '/views/index.ejs');
//         db.collection('quotes').find().toArray((err, result) => {
//             if (err) return console.log(err);
//             // renders index.ejs
//             res.render('index.ejs', {quotes: result});
//           });

//     });

//     app.post('/quotes', (req, res) => {
//         db.collection('quotes').save(req.body, (err, result) => {
//         if (err) return console.log(err);

//         console.log('saved to database');
//         res.redirect('/');
//         });
//     });



//   // set port variable using environment veriable
//     var port = process.env.PORT || 3000;


//     app.listen(port,()=>{
//     console.log(`Server is running into port no ${port} `);
//     });
// });



/////////////////////// WEB SERVICES ///////////////////////////////

MongoClient.connect('mongodb://localhost:27017/star-wars-quotes', async (err, client) => {
    if (err) return console.log(err);
    db = await client.db('star-wars-quotes'); // whatever your database name is
});

/////////////// get the list of docs //////////////////////////
// GET  http://localhost:3000/api/quotes
router.get('/quotes', async (req, res) => {


    await db.collection('tasks').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

////////////////////// Working with Query Strings ////////////////////////
// GET http://localhost:3000/api/quotes/query?name=indra&limit=3
router.get('/quotes/query', async (req, res) => {
    var nameQueryString;
    var mySort;
    if (req.query.name == "") {
        nameQueryString = {}
    } else {
        nameQueryString = { name: req.query.name };
    }

    // not worked
    // if (req.query.sort == "") {
    //     mySort = {};
    // } else {
    //     var sortQueryString = req.query.sort;
    //     var temp = JSON.parse({ sortQueryString: 1 });
    //     mySort = temp;
    // }
    //  not worked

    var limitQueryString = parseInt(req.query.limit);
    await db.collection('tasks').find(nameQueryString).limit(limitQueryString).sort({ name: 1 }).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

/////////////// get the result on perticular id //////////////////////////
// GET  http://localhost:3000/api/quotes/5b0d455281ed57057460975e
router.get('/quotes/:id', async (req, res) => {
    await db.collection('tasks').findOne({ _id: ObjectID(req.params.id) }, (err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });

});



/////////////// get the result on perticular id //////////////////////////
// POST  http://localhost:3000/api/quotes
// raw data { "name":"indra5", "quote":"hi indra" }
router.post('/quotes', async (req, res) => {
    await db.collection('tasks').save(req.body, (err, result) => {
        if (err) return console.log(err);

        console.log('saved to database');
        res.send(result);
    });
});


/////////////// get the result on perticular id //////////////////////////
// PUT  http://localhost:3000/api/quotes/5b0d355c4508db1e30f466f8
// raw data { "name":"deep", "quote":"hi" }
router.put('/quotes/:id', async (req, res) => {

    var paramsId = ObjectID(req.params.id);
    var myquery = { _id: paramsId };
    var newvalues = {
        $set: {
            name: req.body.name,
            quote: req.body.quote
        }
    };
    await db.collection('tasks').updateOne(myquery, newvalues, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});


//////////// delete document ///////////////

/////////// delete document using human generated id ////////////
// app.delete('/api/quotes/:id', (req, res) => {
//     db.collection('quotes').deleteOne({id: req.params.id}, (err, result) => {
//       if (err) throw err;
//       res.send('1 document deleted');
//     });
//   });

/////////// delete document using default auto generated generated id ////////////
// DELETE  http://localhost:3000/api/quotes/5b0d455281ed57057460975e
router.delete('/quotes/:id', async (req, res) => {
    await db.collection('tasks').deleteOne({ _id: ObjectID(req.params.id) }, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

module.exports = router;
