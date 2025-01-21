const express = require('express');
const app = express();

const port = 3000;

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!!!!!!!');
});

app.get('/hello', (req, res) => {
  res.send('Hello, From hello route!');
});

// Export the app (for testing)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
