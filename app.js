const express = require('express')
const app = express()
const fs = require('fs')
const PORT = 3000
const isNullOrEmpty = require('check-is-empty-js');
const { error } = require('console');


app.set('view engine', 'pug')

app.use("/static", express.static("public"));
app.use(express.urlencoded({extended: false}))

//localhost:8000
app.get('/',(req, res) =>{
  res.render('home')
})



app.get('/create',(req, res) =>{
  res.render('create')
})

app.get('/films', (req, res)=>{
  fs.readFile('./data/reviews.json', (err, data)=>{
    if(err) throw err 
    const films = JSON.parse(data)
    res.render('films', {films: films})

  })
})

app.get('/films/:id', (req, res)=>{
  const id =req.params.id
  fs.readFile('./data/reviews.json', (err, data)=>{
    if(err) throw err

    const  films = JSON.parse(data)
    const film = films.filter(film => film.id == id)[0]

   res.render('films', {film: film})   
})
})

app.post('/create',(req, res) =>{
  const title = req.body.title
  const description = req.body.description
  const rating = req.body.rating
  const form = req.body;


  if(isNullOrEmpty(form.title) ||
    isNullOrEmpty(form.description) ||
    isNullOrEmpty(form.rating))
    res.render('create', {errornull:true})
  else if(form.description.length >= 130 ||  form.title.length >= 40)
      res.render('create', {errorlength:true})
  else{
  fs.readFile('./data/reviews.json', (err, data)=>{
    if(err) throw err
    
    const films = JSON.parse(data)
    films.push({
      id: id (),
      title: title, 
      description: description,
      rating:rating,
    })
    fs.writeFile('./data/reviews.json', JSON.stringify(films), err =>{
      if(err) throw err

      res.render('create', { success: true }) 
    })
  })
  }


})

app.get('/create',(req, res) =>{
  fs.readFile('./data/reviews.json', (err, data)=>{
    if(err) throw err

    const  films = JSON.parse(data)
    res.render('create', {create: create})

  })
})



app.get("/:id/update", (req, res) =>{
  const id = req.params.id
  fs.readFile("./data/reviews.json", (err, data) => {
    if(err) throw error
    
    const films = JSON.parse(data)
    const film = films.find(film => film.id == id)
    res.render('create', {title: film.title, description: film.description, rating: film.rating, id: id})
  })
})

app.post("/:id/update", (req, res) =>{
  const form = req.body;
  if (isNullOrEmpty(form.title) ||
        isNullOrEmpty(form.description) ||
        isNullOrEmpty(form.rating)
        ){
          fs.readFile("./data/reviews.json", (err, data) => {
            if (err) throw(err);
            
              res.render("create", {
                errornull: true,
                film: null
            });
        })
  }
  else if (form.description.length >= 130 || 
    form.title.length >= 40){
      fs.readFile("./data/reviews.json", (err, data) => {
        if (err) throw(err);
        
          res.render("create", {
            errorlength: true,
            film: null
        });
    })
    }
  else {
    const id = req.params.id;
    fs.readFile("./data/reviews.json", (err, data) => {
        if (err) throw err;
        
        const films = JSON.parse(data);
        const updated = films.filter(film => film.id != id)

        updated.push({
            id: id,
            title: form.title,
            description: form.description,
            rating: form.rating
        });
        
        fs.writeFile("./data/reviews.json", JSON.stringify(updated), (err) => {
            if (err) throw err;
            
            fs.readFile("./data/reviews.json", (err, data) => {
                if (err) throw err;
                
                res.render("films", {films: updated});
            });
         });
      });
  }
})



app.get('/:id/delete', (req, res) =>{
  const id = req.params.id

  fs.readFile('./data/reviews.json', (err, data)=>{
    if(err) throw err

    const  films = JSON.parse(data)
    const filteredreviews = films.filter(film => film.id != id)
    fs.writeFile('./data/reviews.json', JSON.stringify(filteredreviews), (err)=>{
      if(err) throw err

      res.render('films', {films: filteredreviews, deleted:true})
    })
  })
})
app.listen(PORT, (err) => {
  if(err) throw err
  console.log(`This app is running on port ${PORT}`)
})


function id () {
  return '_' + Math.random().toString(36).substr(2, 9);
};
