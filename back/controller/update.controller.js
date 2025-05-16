import User from "../model/user.model.js";

export const update = async (req, res) => {
  try {
    const {
      userId,
      fullname,
      age,
      vegNonVeg,
      allergies,
      preconditions,
    } = req.body;

    const updatedFields = {};

    if (fullname !== undefined) updatedFields.fullname = fullname;
    if (age !== undefined) updatedFields.age = age;
    if (vegNonVeg !== undefined) updatedFields.vegNonVeg = vegNonVeg;
    if (allergies !== undefined) updatedFields.allergies = allergies;
    if (preconditions !== undefined) updatedFields.preconditions = preconditions;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Profile update success");
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
