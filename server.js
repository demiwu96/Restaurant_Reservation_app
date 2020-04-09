const express = require("express");
const path = require("path");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// reservation list and waitlist
let reservationlist = [
    {
        routeName: "exampleReservation",
        firstName: "First",
        lastName: "Last",
        number: 1234567899,
        people: 2
    }
];
let waitlist = [
    {
        routeName: "exampleWaitlist",
        firstName: "First",
        lastName: "Last",
        number: 1234567899,
        people: 4
    }
];

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/reservation", function (req, res) {
    res.sendFile(path.join(__dirname, "public/add.html"));
});

app.get("/checktable", function (req, res) {
    res.sendFile(path.join(__dirname, "public/table.html"));
});

app.get("/api/reservationlist", function (req, res) {
    return res.json(reservationlist);
});

app.get("/api/waitlist", function (req, res) {
    return res.json(waitlist);
});

app.get("/api/reservationlist/:name", function (req, res) {
    var chosen = req.params.name;
    for (var i = 0; i < reservationlist.length; i++) {
        if (chosen === reservationlist[i].routeName) {
            return res.json(reservationlist[i]);
        }
    }
    return res.json("No reservation record for this person");
});

// Add new reservation, if more than 5, add to waitlist
app.post("/api/reservationlist", function (req, res) {
    var newCustomer = req.body;
    newCustomer.routeName = newCustomer.firstName;

    if (reservationlist.length == 5) {
        waitlist.push(newCustomer);
        return res.json(false);
    } else {
        reservationlist.push(newCustomer);
        return res.json(true);
    };
});

// cancel table reservation
app.post("/api/cancelreservation", function (req, res) {
    var indexData = req.body;
    reservationlist.splice(indexData.index, 1);
    if (reservationlist.length < 5) {
        for (var i = 0; i < waitlist.length; i++) {
            reservationlist.push(waitlist[i]);
            waitlist = waitlist.slice(i + 1);
        }
    }
    res.end("Successful!");
});

// cancel waitlist reservation
app.post("/api/cancelwaitlist", function (req, res) {
    var indexData = req.body;
    waitlist.splice(indexData.index, 1);
    res.end("Successful!");
});

// clear all reservation
app.get("/api/clearall", function (req, res) {
    reservationlist = [];
    waitlist = [];
    res.end("Successful!");
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
