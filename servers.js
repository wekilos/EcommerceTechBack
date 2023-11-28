const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const fileupload = require("express-fileupload");

// const https = require('https');
const http = require("http");

const fs = require("fs");

const app = express();

app.use(fileupload());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
// app.use(upload.single("surat"));
app.use((req, res, next) => {
  // const allowedOrigins = ["http://localhost:3000"];
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //   res.setHeader("Access-Control-Allow-Origin", origin);
  // }
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  //  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // res.header('Access-Control-Allow-Credentials', true);
  //  res.header('Access-Control-Allow-Credentials', true);
  next();
});

const Routers = require("./server/routes/routes");

app.use("/api", Routers);

// This represents a unique chatroom.
// For this example purpose, there is only one chatroom;

app.use("/", (req, res) => {
  res.send("404 page not found!");
});

// FOR PORT 8080

// https uchin son achmaly
// var privateKey  = fs.readFileSync('/etc/letsencrypt/live/cynar.com.tm/private.key', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/cynar.com.tm/sum6.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

// your express configuration here

var httpServer = http.createServer(app, (req, res) => {
  // res.writeHead(301, { "Location":"https://" + req.headers['host'] + req.url});
  // res.end();
});

// htpps uchin son achmaly
// var httpsServer = https.createServer(credentials, app);

httpServer.listen(8181, () => {
  console.log("working http server on 8181 port");
});

// son achmaly
// httpsServer.listen(4443,()=>{
//   console.log("working https server on 4443 port")
// });

// const PORT = process.env.PORT || 8080;
//  app.listen(PORT, () => console.log("listening on *:",PORT));

global.rootPath = __dirname;
module.exports = {
  app,
};
