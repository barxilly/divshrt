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

app.post('/add-url', async (req, res) => {
  // Get everything from add-url?from=XYZ&to=ABC
    const from = req.query.from;
    const to = req.query.to;
    if (!from || !to) {
      return res.status(400).send('Missing from or to parameter');
    }
    urls[from] = to;
    fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
    res.send(`URL added: ${from} -> ${to}`);

    // Stop the server gracefully
    setTimeout(() => {
      server.close(() => {
        console.log('Server stopped gracefully');
      });
    }, 100); // Give time for response to be sent

    // Start new server
    exec(`node index.js`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Server stderr: ${stderr}`);
        return;
      }
      console.log(`Server stdout: ${stdout}`);
    });
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});