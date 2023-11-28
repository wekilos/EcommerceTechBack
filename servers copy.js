const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const PORT = process.env.PORT || 8181;
const helmet = require("helmet");
// const https = require('https');
const http = require("http");

const fs = require("fs");

const app = express();

app.use(fileupload());
app.use(require("helmet")());
app.use("/uploads", express.static("uploads"));
app.use("/itda", express.static("C:/q/"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
const limiter = require("express-rate-limit")({
  message: "Too many requests from this IP, please try again in an hour",
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// app.use("/", limiter);

app.use(cors({ origin: "*" }));
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );

// app.use(upload.single("surat"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Cross-Origin-Resource-Policy", "*");

  res.setHeader("Allow", "GET, POST, OPTIONS,PUTCH, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
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

httpServer.listen(PORT, () => {
  console.log(`working http server on ${PORT} port`);
});

// son achmaly
// httpsServer.listen(4443,()=>{
//   console.log("working https server on 4443 port")
// });

//  app.listen(PORT, () => console.log("listening on *:",PORT));

global.rootPath = __dirname;
module.exports = {
  app,
};
