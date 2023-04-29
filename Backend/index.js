const connectToMongo = require('./db')
const express = require('express')
var cors = require("cors")



connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Avilable Routes Are
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// app.get('/', (req, res) => {
//   res.send('Hello login!')
// })

// app.get('/', (req, res)=>{
//   res.send('OK!')
// })
