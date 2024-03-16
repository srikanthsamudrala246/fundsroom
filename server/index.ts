import express from "express";
import cors from "cors"

const app = express()
app.use(express.json());

const port = 3001;
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/action', require('./routes/action'))

app.get("/",(req,res)=>{
    res.send("Hello");
})

app.listen(port,()=>{
    console.log(`Connected to localhost on port ${port}`);
})



