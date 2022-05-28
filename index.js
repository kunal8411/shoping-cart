const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser")
// const userRouter = require("./routes/user");
// const setupWallet = require("./routes/setupWallet");
// const transactAmount = require("./routes/transactAmount");
// const transactionHistory = require("./routes/transactionHistory");
// const walletHistory = require("./routes/walletHistory");
const cors = require("cors");
// const productRouter = require("./routes/product");
// const cartRouter = require("./routes/cart");
// const orderRouter = require("./routes/order");
const CryptoJs = require("crypto-js");
dotenv.config();


//cors config 
var whitelist=[
  "http://localhost:5000"
]
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
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// app.use("/setup", setupWallet);
// app.use("/transact", transactAmount);
// app.use("/transaction", transactionHistory);
// app.use("/wallet", walletHistory);

app.listen(process.env.PORT || 5000, () => {
  console.log("server started on port 5000");
});