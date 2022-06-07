const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    availableSizes: { type: Array, required: true },
    productDetails: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);