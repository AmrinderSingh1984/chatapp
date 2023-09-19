const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
var path = require('path')


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'/client.html'))
})


users=[{
  n:"amrinder",
  id:"k884mmldlmL11MN",
  private_chats:[]
}]


main_chat=[]



io.on('connection', (socket) => {
  
  console.log('A user connected'+socket.id);
  
  io.sockets.emit("users",users)
  io.sockets.emit("main_msg",main_chat)
  
  socket.on("users_from_c",(u)=>{
    console.log(u);
    users=u
    io.sockets.emit("users",users)
  })
  socket.on("users_from_cc",(u)=>{
    users=u
    io.sockets.emit("users",users)
  })

  socket.on("send",(msg)=>{

    if(msg.sendto=="main"){
    main_chat.push(msg)
    io.sockets.emit("main_msg",main_chat)
    console.log(main_chat);
  }
})


  socket.on('disconnect' ,() => {
    for(let i=0;i<users.length;i++){
      if(users[i].id==socket.id){
        users.splice(i, 1);
      }
      console.log(users);
    }
    console.log('A user disconnected');


io.sockets.emit("users",users)


  });

  
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
