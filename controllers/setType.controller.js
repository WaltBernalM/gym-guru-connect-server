"use strict"

const SetType = require("../models/SetType.model")
const { populateSetTypeDB } = require("../utils/populateSetTypeDB")

const getAllSetTypes = async (req, res, next) => {
  try {
    console.log('getAllSetTypes')
    const allSetTypes = await SetType.find()

    if (allSetTypes.length === 0) {
      await populateSetTypeDB()
    }

    res.status(200).json({ allSetTypes })
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err })
  }
}

module.exports = { getAllSetTypes }