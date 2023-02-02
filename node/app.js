const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Blog = require('./models/blog');
const uri = 'mongodb://localhost:27017/?authSource=admin';

mongoose.set('strictQuery', false);
mongoose.connect(uri, 
  {
    useNewUrlParser: true,
    user: 'root',
    pass: '1234'
  })
  .then((result) => { 
    app.listen(3000);
    console.log('sucess')
  })
  .catch((err) => console.log(err)
);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About'});
});

app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1})
    .then((result) => {
      res.render('index', { title: 'All Blogs', blogs: result });
    })
})

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render('detail', { blog: result, title: 'Blog detail'})
    })
    .catch((result) => {
      console.log(err);
    });
})

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog'});
});

app.post('/blogs', (req, res)=>{
  const blog = new Blog(req.body);

  blog.save()
    .then((result) => {
      res.redirect('/blogs')
    })
    .catch((err) => {
      console.log(err)
    })
})

app.use((req, res) => {
  res.status(404).render('404', { title: '404'});
});
