const express = require('express');
const path = require('path');
const app = express();
var port = process.env.PORT || 3000;

app.use('/style', express.static(path.resolve(__dirname, '../style')));
app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
app.use('/src', express.static(path.resolve(__dirname, '../src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// List
app.get('/pagination', (req, res) => {
  res.sendFile(path.join(__dirname, '/pagination/test.html'));
});
app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, '/calendar/test.html'));
});
app.get('/backtop', (req, res) => {
  res.sendFile(path.join(__dirname, '/backtop/test.html'));
});
app.get('/eventemitter', (req, res) => {
  res.sendFile(path.join(__dirname, '/eventemitter/test.html'));
});
app.get('/magnifier', (req, res) => {
  res.sendFile(path.join(__dirname, '/magnifier/test.html'));
});
app.get('/carousel', (req, res) => {
  res.sendFile(path.join(__dirname, '/carousel/test.html'));
});

app.listen(port, function() {
  console.log(`app listening on port http://127.0.0.1:${port}`);
});
