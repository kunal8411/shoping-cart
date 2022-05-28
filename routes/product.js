const Products = require("../models/Products");
const router = require("express").Router();

//get All Products
router.get("/", async (req, res) => {
  console.log("i am called");
  try {
    const allProducts = await Products.find({});
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get value for single product
router.get("/find/:id", async (req, res) => {
  try {
    const singleProductDetails = await Products.findById(req.params.id);
    res.status(200).json(singleProductDetails);
  } catch (error) {
    res.status(500).json(error);
  }
});

//post
router.post("/", async (req, res) => {
  const newProduct = new Products(req.body);
  try {
    const saveWallet = await newProduct.save();
    res.status(200).json(saveWallet);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
