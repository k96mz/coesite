var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
  let params = {
    active: { home: true }
  };

  res.render('index', params);
});

module.exports = router;
