import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ error: false, success: true, data: products });
  } catch (error) {
    console.error("Error in fetching product:", error.message);
    res
      .status(500)
      .json({ error: true, success: false, message: "Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body; // data sent by user

  if (!product.name || !product.price || !product.image) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "please provide all fields",
    });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(200).json({ error: false, success: true, data: newProduct });
  } catch (error) {
    console.error("Error in create product:", error.message);
    res
      .status(500)
      .json({ error: true, success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params; // destructure to get items unique id

  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ error: true, success: false, message: "Invalid Product Id" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json({ error: false, success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error in updating product:", error.message);
    res
      .status(500)
      .json({ error: true, success: false, message: "Server Error" });
  }
}
export const deleteProduct = async (req, res) => {
  const { id } = req.params; // destructure to get items unique id

  // Validate the id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      // Product not found
      return res.status(404).json({
        error: true,
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ error: false, success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error in deleting product:", error.message);
    res.status(500).json({
      error: true,
      success: false,
      message: "An error occurred while deleting the product",
    });
  }
};