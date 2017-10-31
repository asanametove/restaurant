const express = require('express');
const path = require('path');

const app = express();
const port = 11111;
const public = path.join(__dirname, '../client');
const dataFolder = path.join(__dirname, 'data');

const api = [
  {
    url: '/reservation',
    file: path.join(dataFolder, 'reservations.json')
  },
  {
    url: '/menu',
    file: path.join(dataFolder, 'menu.json')
  },
  {
    url: '/events',
    file: path.join(dataFolder, 'events.json')
  }
]

app.use(express.static(public));

api.forEach(({ url, file }) => {
  app.get(
    url, 
    (req, res) => res.sendFile(file)
  )
});

app.listen(port, function () {
  console.log(`Express listening on port ${port}`);
})
