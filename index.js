const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const cors = require("cors")
let corspolicy = {
    // origin:'http://localhost:3000'
    origin:process.env.FRONTEND_URL
}

const app = express()

app.use(express.json());
app.use(
    cors({
      exposedHeaders: ['accesstoken','refreshtoken'],
    }),
  );
app.use(cors(corspolicy));

const db = module.exports = () => {

  try{
      mongoose.connect(process.env.DBURI
      ,   {user:process.env.DBUSERNAME, pass:process.env.DBPASSWORD,
          useNewUrlParser:true, useUnifiedTopology:true
          }
      )
      console.log("MongoDB Connection is Successful")
  }catch(error){
      console.log("MongoDB Connection is failed")
  }
}

db();

app.listen(process.env.PORT,()=>{
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})