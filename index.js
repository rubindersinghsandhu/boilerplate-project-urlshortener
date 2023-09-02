require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//Add middleware
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let url_mapping = [];
// Project API endpoint

app.post('/api/shorturl', function(req, res) {
  const url = req.body['url']
  const isValidUrl = (/(?<=(http|https):\/\/)[^\/]+/).test(url);
  if(isValidUrl) {
    console.log("Valid url = " + isValidUrl);
    url_mapping.push(url);
    res.json({ original_url: url,
      short_url:  url_mapping.length - 1});
  } else{
    console.log("Not valid url");
    res.json({
      error: 'invalid url'
    })
  }
});

app.get('/api/shorturl/:id?', function(req, res) {
  if(req.params.id < url_mapping.length) {
    res.redirect(url_mapping[req.params.id]);
  } else {
    res.json({
      error: 'invalid url'
    })
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
