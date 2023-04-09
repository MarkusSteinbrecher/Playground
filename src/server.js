const express = require('express');
const app = express();
const { exec } = require('child_process');

app.use(express.static('static'));

app.get('/fetch-data', (req, res) => {
  exec('node fetch.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      res.status(500).send('Error executing the script');
    } else {
      console.log('Script executed successfully');
      res.send('Script executed successfully');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
