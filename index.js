server=require("express")
const bodyParser = require('body-parser');

require("ejs")
app=server()
socketlisten=app.listen(5000)
io = require("socket.io").listen(socketlisten)
app.set("view ejgine","ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(server.static(__dirname));
room={}
roomowner={}
io.on("connection",(socket)=>{
    socket.on("joinroom",(roomid)=>{
        console.log(roomid)
        room[roomid].push(socket.id)
        console.log(room)
    })

    socket.on("createroom",()=>{
        roomid=Math.floor(Math.random() * (100000 - 10000)) + 10000
        roomowner[roomid]=socket.id
        room[roomid]=[]
        socket.emit("streamid",roomid)
    })
})

app.get('/',(req,res)=>{
    res.render('joinstream.ejs')
})


