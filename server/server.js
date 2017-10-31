const express = require('express');
const path = require('path');

const app = express();
const port = 11111;
const public = path.join(__dirname, '../client');
const data = path.join(__dirname, 'data');
const reservation = path.join(data, 'reservations.json');

app.use(express.static(public));

// app.get('/reservation', function (req, res) {
//   res.sendFile(reservation);
// })

app.listen(port, function () {
  console.log(`Express listening on port ${port}`);
})
