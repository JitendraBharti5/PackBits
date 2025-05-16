import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./route/user.route.js"
import cors from "cors";
import  logger  from "morgan";
import optionRoutes from './route/option.route.js';
import productRoute from "./route/product.route.js";
import { getProductQuantities,getSuggestions,getFoodItemById,getFoodItemByBarcode} from "./controller/product.controller.js";
import { getIngredientByName, searchIngredients } from'./controller/ingredient.controller.js';
import {testProductAgainstProfile } from "./controller/test.controller.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const PORT = process.env.PORT || 4000;
const URI = process.env.AtlasURI;

// connect to mongoDB
try {
    mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to mongoDB");
} catch (error) {
    console.log("Error: ", error);
}

// defining routes
app.use("/user", userRoute);
app.use("/options", optionRoutes);
app.use("/select", productRoute); //scan-image, suggestions, result/:id..
app.use("/ingredient/:name", getIngredientByName);
app.use("/search", searchIngredients);
app.use("/test/:id", testProductAgainstProfile);

{/**code for deploymrnt */}
if (process.env.NODE_ENV === "production") {
    const dirPath = path.resolve();
    app.use(express.static("./front/dist"));

    app.get("/ingredient/:name", (req, res) => {
        res.sendFile(path.resolve(dirPath, "./front/dist", "index.html"));
    });

    app.get("/test/:id", (req, res) => {
        res.sendFile(path.resolve(dirPath, "./front/dist", "index.html"));
    });
}



app.use(logger("tiny"));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});