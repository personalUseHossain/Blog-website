const express = require('express');
const { allblogs, admin } = require('./database/schema')

const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());





require('./database/db')

app.get('/', async (req, res) => {
    const dbblogs = await allblogs.find();
    res.render('./home/index', { blogs: dbblogs })
})


app.get('/find/:id', async (req, res) => {
    let findOne = await allblogs.find({ _id: req.params.id })
    findOne = findOne[0]
    res.render('./singleBlog/index', { findOne });
})

app.get('/admin/login', (req, res) => {
    res.render('./admin/index')
})
app.post('/admin/login', async (req, res) => {
    try {
        let adminData = await admin.find();
        adminData = adminData[0]
        const { username, password } = req.body;
        if (username === adminData.username && password === adminData.password) {
            res.send('you login successfully admin')
        } else {
            res.send('invalid user')
        }
    } catch (err) {
        res.send('invalid user')
    }
})

// app.get('/blog/new', (req, res) => {
//     res.send('You are in new blog post page')
// })

// app.get('/blog/update', (req, res) => {
//     res.send('You are in update blog page')
// })


app.listen(5000, () => {
    console.log(`server is running on port ${port}`)
})