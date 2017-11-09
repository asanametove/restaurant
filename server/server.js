const express = require('express');
const path = require('path');

const app = express();
const port = 11111;
const public = path.join(__dirname, '../client');
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const url = 'mongodb://localhost:27017/restaurant';

const api = [
  {
    url: '/reservation',
    collection: 'reservations'
  },
  {
    url: '/menu',
    collection: 'menu'
  },
  {
    url: '/events',
    collection: 'events'
  }
]

const sendCollection = (res, collection) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log(`Connection to DB opened. Try to read ${collection}.`);
    db.collection(collection).find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      res.send(docs);
    });
    db.close();
    console.log('Connection to DB closed.\n')
  });
}

app.use(express.static(public));

api.forEach(({ url, collection }) => {
  app.get(
    url, 
    (req, res) => sendCollection(res, collection)
  )
});

app.listen(port, function () {
  console.log(`Express listening on port ${port}`);
})
