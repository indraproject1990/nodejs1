var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var quotes = require('./routes/quotes');
var index = require('./routes/index');
var tasks = require('./routes/tasks');

var app = express();

var port = process.env.PORT || 3000;

// view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

// set static folder
app.use(express.static(path.join(__dirname,'client')));

// body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/',index);
app.use('/api',quotes);
app.use('/api',tasks);

// set port variable using environment veriable
app.listen(port, () => {
    console.log(`Server is running into port no ${port} `);
});