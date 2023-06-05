const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('You are in home page')
})

app.get('/:id', (req, res) => {
    res.send('You are in a single blog page')
})

app.get('/blog/new', (req, res) => {
    res.send('You are in new blog post page')
})

app.get('/blog/update', (req, res) => {
    res.send('You are in update blog page')
})


app.listen(5000, () => {
    console.log(`server is running on port ${port}`)
})