const express = require('express');
const env = require('dotenv');
env.config();
const app = express();
const port = 4254;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const fs = require('fs');
const { exec } = require('child_process');

if (!fs.existsSync('urls.json')) {
  fs.writeFileSync('urls.json', JSON.stringify({}));
}
let urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

function setupRoutes() {
  // Clear existing dynamic routes (keep only / and /add-url)
  app._router.stack = app._router.stack.filter(layer => {
    if (!layer.route) return true;
    const path = layer.route.path;
    return path === '/' || path === '/add-url';
  });
  
  // Add URL redirect routes
  for (const [key, value] of Object.entries(urls)) {
    app.get(`/${key}`, (req, res) => {
      res.redirect(value);
    });
  }
}

// Initial setup of routes
setupRoutes();

app.post('/add-url', async (req, res) => {
  // Get everything from add-url?from=XYZ&to=ABC
    const from = req.query.from;
    const to = req.query.to;
    const key = req.query.key;
    if (key !== process.env.KEY) {
      console.log("Correct key:", process.env.KEY, "Provided key:", key);
        return res.status(403).send('Forbidden: Invalid key');
        }
    if (!from || !to) {
      return res.status(400).send('Missing from or to parameter');
    }
    urls[from] = to;
    fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
    
    // Recreate routes instead of restarting
    setupRoutes();
    
    res.send(`URL added: ${from} -> ${to}`);
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});