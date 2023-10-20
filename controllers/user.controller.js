"use strict"
const User = require("../models/User.model")

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params

    const userInDB = await User.findById(userId)
      .select("-password")
      .populate({
        path: "exercisePlan",
        populate: {
          path: "exerciseList",
          populate: {
            path: "exerciseData",
          },
        },
      })
      .populate({
        path: "nutritionPlan",
        populate: {
          path: "foodList",
        },
      })

    const clonedUser = JSON.parse(JSON.stringify(userInDB))
    clonedUser.exercisePlan.sort((a, b) => a.day - b.day)
    clonedUser.nutritionPlan.sort(
      (a, b) => a.portionNumber - b.portionNumber
    )

    res.status(200).json(clonedUser)
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

module.exports = {getUser}