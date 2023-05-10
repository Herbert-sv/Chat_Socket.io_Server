const express =require('express')
const cors = require('cors')
const app = express()
const port = 4000 
const http= require('http').createServer(app)

app.use(cors())

const {createClient}=require('redis')
const {createAdapter}=require('@socket.io/redis-adapter')
const pubClient= createClient({host:'localhost', port:3000})
const subClient =pubClient.duplicate()
const socketIo= require('socket.io')(http,{cors:['http://localhost:3000','http://localhost:3001']})
socketIo.adapter(createAdapter(pubClient,subClient))

var users=0;
socketIo.on('connection',(socket)=>{ 
const text= " Welcome to Smith's warehouse!";
const user= socket.id;
users++
socket.data.user= socket.id;

if(socket.data.user.length > 0){

console.log("you have " + users + " clients on queue")
}

 
    console.log("Connected" + " " + user );
    socket.on('disconnect',(reason)=> {
   console.log("user disconnected" ,reason)});
   socket.send(text )
   socket.on('server',(data)=>
   {   
    console.log(data)
    socket.local.emit('msgoutserver', data)


    }); 
    socket.on('serveruser',(data)=>
   {   
    console.log(data)
    socket.local.emit('msgoutserveru', data)


    });

});






app.get('/', (req,res)=> 

{
res.send("hello world from node && express")
});


http.listen(port,()=> console.log("The app is running"))

