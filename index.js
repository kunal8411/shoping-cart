const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const CryptoJs = require("crypto-js");
dotenv.config();

//import routes
const productRoute = require("./routes/product");
const authRouter = require("./routes/auth");
const stripe = require("./routes/stripe");
const carts = require("./routes/carts");

//cors config
var whitelist = ["http://localhost:5000"];
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connection successfull");
  })
  .catch((error) => {
    console.log("found this error->", error);
  });

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // callback(new Error("Not allowed by CORS")); //! to access apis from whitelist IP(s) only.
      callback(null, true); //! to access apis form anywhere.
    }
  },
};
 
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/product", productRoute);
app.use("/auth", authRouter);
app.use("/api/checkout", stripe);
app.use("/api/carts", carts);
app.listen(process.env.PORT || 5000, () => {
  console.log("server started on port 5000");
});
