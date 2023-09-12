const express = require('express');
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const cookieParser = require('cookie-parser');
require("colors");
var rfs = require("rotating-file-stream");
var morgan = require("morgan");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const logger = require("./middleware/logger");
const passport = require("passport");

var path = require("path");
const connectDB = require('./config/db');
const usersRoutes = require("./routes/auth");
const authRoute = require("./auth");
dotenv.config({ path: "./config/config.env" });

// create exrpess app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {pingTimeout: 60000, cors: { origin: "*" } });

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());
// connect to mongodb
app.use(
	cors({
		origin:[ "http://localhost:3000","http://127.0.0.1:3000","https://dome-6aa15.web.app"],
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);
connectDB();

app.use(logger);

app.use(bodyParser.json());
app.use(cookieParser());


app.use(express.static(path.join(__dirname, "public"))); 

// socket logic ------------------- //

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('message', (message) => {
    console.log('Received message:', message);
    io.emit('message', message);
  });
});

// app.use((req, res, next) => {
//   console.log('Session Data:', req.session);
//   next();
// });


// Morgan logger for set
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/users", usersRoutes);
app.use("/auth", authRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

server.listen(
    process.env.PORT,
    console.log(`Express server port: ${process.env.PORT.yellow.underline} `)
);
process.on("HunhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
