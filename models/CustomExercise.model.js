const { Schema, model } = require('mongoose')

const customExercise = new Schema(
  {
    intensity: {
      type: Number,
      required: [true, "intensity is a rqeuired property"],
    },
    series: {
      type: Number,
      required: [true, "series is a required property"],
      default: 5,
    },
    reps: {
      type: Number,
      required: [true, "reps is a required property"],
      default: 12,
    },
    exerciseData: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
    },
    setType: {
      type: Schema.Types.ObjectId,
      ref: "SetType"
    }
  },
  { timestamps: true }
)

const CustomExercise = model("CustomExercise", customExercise)
module.exports = CustomExercise