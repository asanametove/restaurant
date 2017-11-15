const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

const config = require('../dev.webpack.config');

const port = 11111;
const api = [
  {
    url: 'api/reservation',
    collection: 'reservations'
  },
  {
    url: 'api/menu',
    collection: 'menu'
  },
  {
    url: 'api/events',
    collection: 'events'
  }
]
const compiler = webpack(config);
const app = express();
const publicPath = path.join(__dirname, '../client/dist');
const dbUrl = 'mongodb://localhost:27017/restaurant';

const sendCollection = (res, collection) => {
  MongoClient.connect(dbUrl, (err, db) => {
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

app.use(webpackDevMiddleware(compiler, {noInfo: true}));

app.use(require("webpack-hot-middleware")(compiler));

//app.use(express.static(publicPath));

api.forEach(({ url, collection }) => {
  app.get(
    url,
    (req, res) => sendCollection(res, collection)
  )
});

app.get('*', function(req, res){
  res.sendFile(`${publicPath}/index.html`);
});

app.listen(port, function () {
  console.log(`Express listening on port ${port}`);
})
