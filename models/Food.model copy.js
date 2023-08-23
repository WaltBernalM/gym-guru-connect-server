const { Schema, model } = require('mongoose')

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is a rqeuired property"],
    },
    calories: {
      type: Number, 
      required: [true, "calories is a required property"],
    },
    serving_size_g:{
      type: Number,
      required: [true, "serving_size_g is a required property"]
    },
    fat_total_g: {
      type: Number,
      required: [true, "fat_total_g is a required property"]
    },
    fat_saturated_g: {
      type: Number,
      required: [true, "fat_saturated_g is a required property"]
    },
    protein_g: {
      type: Number,
      required: [true, "protein_g is a required property"]
    },
    sodium_mg: {
      type: Number,
      required: [true, "sodium_mg is a required property"]
    },
    potassium_mg: {
      type: Number,
      required: [true, "potassium_mg is a required property"]
    },
    cholesterol_mg: {
      type: Number,
      required: [true, "cholesterol_mg is a required property"]
    },
    carbohydrates_total_g: {
      type: Number,
      required: [true, "carbohydrates_total_g is a required property"]
    },
    fiber_g: {
      type: Number,
      required: [true, "fiber_g is a required property"]
    },
    sugar_g: {
      type: Number,
      required: [true, "sugar_g is a required property"]
    }
  },
  { timestamps: true }
)

const Food = model("Food", foodSchema)
module.exports = Food