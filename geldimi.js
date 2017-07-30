var express = require("express");
var ejs = require("ejs");
var path = require("path");
var bodyParser = require('body-parser');
var fs = require('fs');
var winston = require('winston');
var app = express();

var fileListGelmedi = {};
var fileListGeldi = {};
winston.add(winston.transports.File, { filename: './geldimi.log' });

var cssPath = path.resolve(__dirname, "css");
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(cssPath));
app.use(express.static(publicPath));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));


app.use(function(req, res, next){
    winston.info(req.connection.remoteAddress);
    next();
});

app.get("/", function (req, res) {
    res.render("index", {"resimlink": "/fnormal.jpg", "resimsayi": -1, "geldimi": undefined});
});


app.post("/", function (req, res) {

    fs.readFile('./geldimibilgi.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        if (data == 'gelmedi') {
            gelmedi(req, res);
        }
        else {
            geldi(req, res);
        }
    });


});

function gelmedi(req, res) {
    var resimsayi = req.body.resimsayi;
    resimsayi++;
    if (fileListGelmedi[resimsayi] == undefined) {
        resimsayi = 0;
    }

    res.render("index", {
        "resimlink": "/gelmedi/fgelmedi" + resimsayi + ".jpg",
        "resimsayi": resimsayi,
        "geldimi": false
    });
}

function geldi(req, res) {
    var resimsayi = req.body.resimsayi;
    resimsayi++;
    if (fileListGeldi[resimsayi] == undefined) {
        resimsayi = 0;
    }

    res.render("index", {
        "resimlink": "/geldi/fgeldi" + resimsayi + ".jpg",
        "resimsayi": resimsayi,
        "geldimi": true
    });
}


app.get("/geldi", function (req, res) {
    fs.writeFile("./geldimibilgi.txt", "geldi", function (err) {
        if (err) {
            return console.log(err);
        }
        res.send("ok");
    });
});

app.get("/gelmedi", function (req, res) {
    fs.writeFile("./geldimibilgi.txt", "gelmedi", function (err) {
        if (err) {
            return console.log(err);
        }
        res.send("ok");
    });
});

app.listen(3000, function () {
    fs.readdir("./public/gelmedi", function (err, files) {
        fileListGelmedi = files;
    });
    fs.readdir("./public/geldi", function (err, files) {
        fileListGeldi = files;
    });
});

