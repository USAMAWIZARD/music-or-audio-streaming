server = require("express");
const bodyParser = require("body-parser");

require("ejs");
app = server();
socketlisten = app.listen(5000);
io = require("socket.io").listen(socketlisten);
app.set("view ejgine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(server.static(__dirname));
aknoledgement={}
roomowner = {};

io.on("connection", (socket) => {
  socket.on("joinroom", (userstream) => { 
      var clientdata=[]
      socket.nickname = userstream["username"];
      aknoledgement[socket.id]=0
    if(Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id)==undefined){
      console.log("not added in any room")
    }

    io.sockets.in(userstream["remotestreamid"]).emit("onuserjoin",[{"username":userstream["username"],"datarecived":aknoledgement[socket.id]}]);
  
    console.log("client data",clientdata)
   //send userdetails to new person in the room 
    io.in(userstream["remotestreamid"]).clients((err , clients) => {
 
        clients.forEach(client => {
        clientdata.push({"username": io.nsps['/'].connected[client].nickname,"datarecived":aknoledgement[socket.id]})
        });
        console.log(clientdata)
            socket.emit("onuserjoin",clientdata)

    });

    socket.join(userstream["remotestreamid"]);
    aknoledgement[socket.id]=0


  });

  socket.on("createroom", (roomadmin) => {
    roomid = Math.floor(Math.random() * (100000 - 10000)) + 10000;
    roomowner[socket.id] = roomid;
    socket.nickname=roomadmin
    socket.join(roomid);
    socket.emit("streamid", roomid);
  });
  socket.on("musicstreamer", (musicbuffer) => {
      if(roomowner[socket.id])
      {   
          roomowner[socket.id]
          io.sockets.in(roomowner[socket.id]).emit('onstream',musicbuffer);
      }

  });
  socket.on("acnoledgement",()=>{
    var roomid = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
    io.in(roomid).clients((err , clients) => {
      aknoledgement[socket.id]++

      clients.forEach(client => {
        if(aknoledgement[client]==4){
          console.log("all pak recived")
        }
  
      });
      io.sockets.in(roomid).emit('play');

  });
  socket.on("disconnect",()=>{
    delete aknoledgement[socket.id]
  })
  })

});

app.get("/", (req, res) => {
  res.render("joinstream.ejs");
});
