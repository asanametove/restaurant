var http = require('http');
var fs = require("fs");

var host = "127.0.0.1";
var port = 8080;
var server;
var rsrvJson = __dirname + "/data/reservations.json";
var menuJson = __dirname + "/data/menu.json";
var eventsJson = __dirname + "/data/events.json";

// run server
if (!module.parent) {
    server = new http.Server();
    server.listen(port, host);
    server.on("request", accept);
    console.log("Server is running");
}
else {
    exports.accept = accept;
}

function accept(req, res) {
    // Header for allow XHR
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Access only to reservation page
    if (req.url.match(/^\/reservation*/)) {
        // Make reservation
        if(req.method == "POST") {
            setReservation(req, res);
        // return all reservations
        } else if (req.method == "GET"){
            sendFile(rsrvJson, req, res);
        }
    } else if (req.url.match(/^\/menu*/)) {
        sendFile(menuJson, req, res);
    } else if (req.url.match(/^\/events*/)) {
        sendFile(eventsJson, req, res);
    } else {
        res.statusCode = 404;
        res.end("Page not found");
    };
}

// translate POST string to Object
function objectFromUrlString(string) {
    var result = {};
    var props = string.split('&');
    props.forEach( function (prop) {
        var pair = prop.split('=');

        result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    } );
    return result;
}

function setReservation(req, res) {
    var content = '';
    req.on('data', function(chunk) {
        content += chunk.toString();
    });
    req.on('end', function() {
        fs.readFile(rsrvJson, function (err, data) {
            var msg;
            if (err) {
                msg = "Internal Server Error";
                res.statusCode = 500;
                //throw err;
            } else {
                res.statusCode = 200;
                msg = "Reservation completed";
                var reservations = JSON.parse(data);
                reservations.push(objectFromUrlString(content));
                fs.writeFile(rsrvJson, JSON.stringify(reservations), function (err) {
                    if (err)  {
                        res.statusCode = 500;
                        msg = "Internal Server Error";
                        //throw err;
                    }
                });
            }
            res.end(msg);
        });
    });
}

function sendFile(file, req, res) {
    fs.readFile(file, function (err, data) {
        if (err) {
            var msg = "Internal Server Error";
            res.statusCode = 500;
            res.end(msg);
            //throw Error(msg);
        } else {
            res.statusCode = 200;
            res.end(data);
        }
    });
}

