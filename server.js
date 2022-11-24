const express = require('express');
const uploadRouter = require('./router');

const app = express();

app.get('/', (_, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadRouter);

app.listen(3000, () => {
  console.log('Form running on port 3000');
});
