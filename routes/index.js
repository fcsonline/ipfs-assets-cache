var express = require('express');
var request = require('request');
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('localhost', 5001);
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var url = req.query.q;
  var db = req.app.get('db');
  var hash = db[url];

  if (hash) {
    return res.send(200, hash);
  }

  request(url, function (error, response, body) {
    var file;

    if (!error && response.statusCode == 200) {
      file = new Buffer(body);

      ipfs.add(file, function (error, ipfs_res) {
        if (error || !ipfs_res) return console.error(error);

        hash = ipfs_res[0].Hash;

        db[url] = hash;

        return res.send(200, hash);
      });
    }
  });
});

module.exports = router;
