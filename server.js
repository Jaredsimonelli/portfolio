const express = require('express');
const path = require('path');

const app = express();

// Serve static Angular build output from docs
app.use(express.static(path.join(__dirname, 'docs')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(process.env.PORT || 8080);
