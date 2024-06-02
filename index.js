const express = require('express')
require('dotenv').config();
const { handler } = require("./controller")
const axios = require('axios');

const app = express()
const port = process.env.PORT ?? 4040

app.use(express.json())

const setWebhook = async () => {
  const url = `https://api.telegram.org/bot${process.env.BOT_API_TOKEN}/setWebhook?url=${process.env.API_URL}`;

  const response = await axios.get(url);
  console.log(response.data)
};

// Set the webhook when the server starts
setWebhook();

app.get('*', async (req, res) => {
  res.send('Hi')
})
app.post('*', async (req, res) => {

  await handler(req)
  res.send("ok")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
