const express = require('express');
const app = express();
const port = 4254;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const fs = require('fs');

if (!fs.existsSync('urls.json')) {
  fs.writeFileSync('urls.json', JSON.stringify({}));
}
const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

for (const [key, value] of Object.entries(urls)) {
  app.get(`/${key}`, (req, res) => {
    res.redirect(value);
  });
}

app.post('/add-url', express.json(), (req, res) => {
  const {short, long} = req.body;
  if (!short || !long) {
    return res.status(400).send('Short and long URLs are required');
  }
  const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));
  urls[short] = long;
  fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
  res.status(201).send(`URL added: ${short} -> ${long}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});