import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
};
