const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const Jwt = require("jsonwebtoken");

//signin
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    // password: req.body.password,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });
  try {
    let savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(501).json(error);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Wrong credentials");
    }
    // !user && return res.status(401).json("Wrong credentials");
    let hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    let originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      res.status(401).json("Wrong credentials");
    }

    const accessToken = Jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );
    const { password, ...others } = user._doc;
   return res.status(200).json({ ...others, accessToken });
  } catch (error) {
    return res.status(401).json(error);
  }
});

module.exports = router;
