import express from "express";
import { signup, login } from "../controller/user.controller.js";
import User from "../model/user.model.js";
import { update } from "../controller/update.controller.js";
const router = express.Router();
router.put('/update', update);
router.post("/signup", signup);
router.post("/login", login);
router.get('/:userId',async (req, res) => {
    try {
      const userId = req.params.userId;

    
      const user = await User.findById(userId).select('-password'); // exclude password
    
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  });
export default router;