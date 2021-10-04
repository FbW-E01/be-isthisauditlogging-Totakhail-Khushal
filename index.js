import express from 'express'
import {Low, JSONFile} from 'lowdb'

// prepare mock database 
const adapter=new JSONFile("./data.json");
const db=new Low(adapter);
await db.read();
db.data=db.data||{logs:[] };



// express part

const app=express();


//middleware
const logginMiddleware =(req,res,next)=>{
    const datetime= new Date().toISOString()
    const url="/foo"
    // - **BONUS** Add an endpoint that returns all the entries in your access log.
    db.data.logs.push(`[${datetime}] ${req.url} accessed`)
    db.write();
    next();


    // **BONUS** Your endpoints should return a response slowly. Wait between 1 and 5 seconds before responding to requests. Those frontends are getting too fast anyways, we need to slow them down!
    const delayMS = Math.round(Math.random()*4000)+1000;
    setTimeout(next, delayMS);
    
}
app.use(logginMiddleware)


app.get("/foo",(req,res)=> {
    res.send("Foo")
})

app.get("/bar",(req,res)=>{
    res.send("Bar")
})

app.post("/foo",(req,res)=>{
    res.send("Foo POST")
})

app.post("/bar",(req,res)=>{
    res.send("Bar POST")
})





const port =8000;
app.listen (port,()=>{
    console.log("App listening on http://localhost:"+port);
})