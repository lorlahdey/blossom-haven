//this file is the entry point for our api
import express from 'express';
import dotenv from "dotenv";
import path from 'path';
import { connectDB } from './config/db.js';
import productRoutes from "./routes/product.route.js"
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware to parse JSON requests in body
app.use(express.json())

// Middleware to enable CORS
// app.use(cors());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist'))); // static assets

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    })    
}

// Start server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
})
