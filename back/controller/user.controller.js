import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password, age, vegNonVeg } = req.body;
    console.log(fullname);

    if (!fullname || !email || !password || !age || !vegNonVeg) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (age < 1 || age > 120) {
      return res.status(400).json({ message: "Invalid age. Must be between 1 and 120." });
    }

    if (!["veg", "nonveg"].includes(vegNonVeg)) {
      return res.status(400).json({ message: "Invalid food preference. Must be 'veg' or 'nonveg'." });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const createdUser = new User({
      fullname,
      email,
      password: hashPassword,
      age,
      vegNonVeg,
    });

    await createdUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
        age: createdUser.age,
        vegNonVeg: createdUser.vegNonVeg,
      },
    });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        age: user.age,
        vegNonVeg: user.vegNonVeg,
      },
    });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
