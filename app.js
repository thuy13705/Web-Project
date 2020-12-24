const express = require('express')
const path = require('path');
const app = express()
const port = 3000
app.set('views', './view/partials');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("header.ejs")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})