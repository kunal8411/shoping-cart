const Cart = require("../models/Cart");

const router = require("express").Router();

// CREATE

router.post("/", async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    let updatedcart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedcart);
  } catch (error) {
    res.status(401).json(error);
  }
});
// //DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Product deleted successfully....!");
  } catch (error) {
    res.status(500).json(error);
  }
});
// //GET USER CART
router.get("/find/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //GET ALL

router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET BU USER ID
router.get("/:userId", async (req, res) => {
  try {
    const carts = await Cart.aggregate([
      { $match: { userId: req.params.userId } },
      {
        $lookup: {
          as: "userData",
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
        },
      },
      {
        $unwind: {
          path: "$userData",
          includeArrayIndex: "index",
        },
      },
      {
        $addFields: {
          "userData.qty": "$products.quantity",
        },
      },
      {
        $project: {
          userData: 1,
          qty: { $arrayElemAt: ["$userData.qty", "$index"] },
        },
      },
    ]);
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE CART PRODUCT QUANTITY, IF ALREADY PRODUCT IS IN CART
router.put("/updateCart/increment/:userId/:productId", async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.params.userId,
      "products.productId": req.params.productId,
    });
    if (cartItems?.length > 0) {
      const carts = await Cart.findOneAndUpdate(
        {
          userId: req.params.userId,
          "products.productId": req.params.productId,
        },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
      res.status(200).json(carts);
    } else {
      let payload={
        productId:req.params.productId
      }
      let updatedcart = await Cart.findOneAndUpdate(
        { "userId":  req.params.userId}, 
        { $push: { products: payload } },
        { new: true }
      );
      res.status(200).json(updatedcart);
    }
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;
