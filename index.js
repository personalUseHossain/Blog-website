require('dotenv').config()
const express = require('express');
const { allblogs, admin } = require('./database/schema');
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const cookie_parser = require('cookie-parser');
const { Collection } = require('mongoose');

//Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookie_parser());


function verifyUser(req, res, next) {
    const token = req.cookies.token;
    const verify = jwt.verify(token, process.env.SECRET_KEY)
    if (!verify) {
        res.redirect('/admin/index')
    }
    try {
        // const verify = jwt.verify(token, process.env.SECRET_KEY);
        if (verify) {
            next()
        }
    } catch (err) {
        res.send(err)
    }
}



//requireing database connection where the mongodb and schema is defined
require('./database/db')


//home route
app.get('/', async (req, res) => {
    const dbblogs = await allblogs.find();
    res.render('./home/index', { blogs: dbblogs })
})

//read one blog route
app.get('/find/:id', async (req, res) => {
    let findOne = await allblogs.find({ _id: req.params.id })
    findOne = findOne[0]
    res.render('./singleBlog/index', { findOne });
})


//admin login page
app.get('/admin/login', (req, res) => {
    res.render('./admin/index')
})


//admin login post
app.post('/admin/login', async (req, res) => {
    try {
        let adminData = await admin.find();
        adminData = adminData[0];
        const { username, password } = req.body;
        if (username === adminData.username && password === adminData.password) {
            const token = jwt.sign({ id: adminData._id }, process.env.SECRET_KEY);
            res.cookie('token', token, { httpOnly: true });
            let blogs = await allblogs.find();
            res.render('./adminblog/index', { adminblogs: blogs })
        } else {
            res.send('invalid user')

        }
    } catch (err) {
        console.log(err)
    }
})


//deleteing blog
app.get('/admin/delete/:id', verifyUser, async (req, res) => {

    const { id } = req.params;
    const result = await allblogs.deleteMany({ _id: id });
    res.send('delete successfull')

})


//edit blog
app.get('/admin/edit/:id', verifyUser, async (req, res) => {
    let updateblog = await allblogs.find({ _id: req.params.id });
    res.render('./editblogadmin/index', { updateblog })
})

//update blog post
app.post('/update/:id', verifyUser, async (req, res) => {
    // const updateblog = await allblogs.findById(req.params.id);
    const { heading, smallHeading, img, blog } = req.body;
    // const filter = { _id: req.params.id };
    // const update = {
    //     $set: {
    //         img: img,
    //         heading: heading,
    //         smallblog: smallHeading,
    //         bigblog: blog
    //     }
    // };
    const updateblogs = await allblogs.find()
    const result = await allblogs.updateOne({ _id: req.params.id }, {
        $set: {
            img: img,
            heading: heading,
            smallblog: smallHeading,
            bigblog: blog
        }
    })
    res.render('./adminblog/index', { adminblogs: updateblogs })


})


//addblog show page
app.get('/addblog', verifyUser, (req, res) => {
    res.render('./addblog/index')
})

//addblog post
app.post('/addblog', verifyUser, async (req, res) => {
    const blogs = await allblogs.find()
    const { heading, smallHeading, img, blog } = req.body;
    const addblog = new allblogs({
        img: img,
        heading: heading,
        smallblog: smallHeading,
        bigblog: blog
    })
    await addblog.save()
    res.render('./adminblog/index', { adminblogs: blogs })
})








app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

