//server.js
const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient



MongoClient.connect('mongodb+srv://patmack16:Ajn46868@cluster0-ksmgo.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority',{useUnifiedTopology:
true})
.then(client =>{
 
  console.log('Connected to the DATABASE')
  
  const db = client.db('star-wars-quotes')

  const quotesCollection = db.collection('quotes')

  //*****************MIDDLEWARE******************8 */
  
  app.set('view engine', 'ejs')
 
  app.use(bodyParser.urlencoded({extended: true}))
  
  app.use(express.static('public'))

  app.use(bodyParser.json())

  //************ROUTES ********************* */
  app.get('/', (req, res) => {
     db.collection('quotes').find().toArray()
    .then(results=>{
      console.log(results)
      res.render('index.ejs',{quotes:results})
    // ...
  })
  .catch(error=>console.error(error))
})
app.put('/quotes', (req, res) => {
  quotesCollection.findOneAndUpdate(
    {name: 'Yoda' },
   {
     $set: {
       name: req.body.name,
       quote: req.body.quote
     }
   },
   {
    upsert: true
  }
    )
    .then(result =>res.json('Success'))
    
    .catch(error => console.error(error))
  })

  app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
    .then(result => {
      res.redirect('/')
      
    })
    .catch(error => console.error(error))
})
app.delete('/quotes', (req, res)=>{
  quotesCollection.deleteOne(
    {name: req.body.name},
    
  )
  .then(result => {
    if(result.deletedCount===0){
      return res.json('There aint no more Vader Quotes')
    }
    res.json('Deleted Darth Vader`s quote')
  })
  .catch(error => console.error(error))
})

})
    
    app.listen(3000, function(){
      console.log('listening on 3000')
  })

  
