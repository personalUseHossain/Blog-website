const express = require('express');
const { allblogs, admin } = require('./database/schema');
let islogin = false;

const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
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
        adminData = adminData[0];
        const { username, password } = req.body;
        if (username === adminData.username && password === adminData.password) {
            islogin = true;
            let blogs = await allblogs.find();
            res.render('./adminblog/index', { adminblogs: blogs })
        } else {
            res.send('invalid user')
        }
    } catch (err) {
        console.log(err)
    }
})

app.get('/admin/delete/:id', async (req, res) => {
    if (islogin) {
        const { id } = req.params;
        await allblogs.findOneAndDelete({ id });
        res.send('delete successfull')
    } else {
        res.render('./admin/index')
    }
})

app.get('/admin/edit/:id', async (req, res) => {
    if (islogin) {
        let updateblog = await allblogs.find({ _id: req.params.id });
        res.render('./editblogadmin/index', { updateblog })
    }
    else {
        res.render('./admin/index')
    }
})
app.post('/update/:id', async (req, res) => {
    if (islogin) {
        // const updateblog = await allblogs.findById(req.params.id);
        const { heading, smallHeading, img, blog } = req.body;
        console.log(heading)
        console.log(smallHeading)
        console.log(img)
        console.log(blog)

        const filter = { _id: req.params.id };
        const update = {
            $set: {
                img: img,
                heading: heading,
                smallblog: smallHeading,
                bigblog: blog
            }
        };
        const updateblogs = await allblogs.find()
        const result = await allblogs.findByIdAndUpdate(filter, update)
        console.log(result)
        res.render('./adminblog/index', { adminblogs: updateblogs })
    }
    else {
        res.render('./admin/index')
    }

})







app.listen(5000, () => {
    console.log(`server is running on port ${port}`)
})


