const { Schema, model } = require("mongoose");

const traineeSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: Object,
      required: [true, "Name and Last name are required."],
      default: {
        firstName: "",
        lastName: "",
      },
    },
    isTrainer: {
      type: Boolean,
      default: false
    },
    personalInfo: {
      type: Object,
      default: {
        age: "",
        height: NaN,
        weight: NaN,
        fatPercent: NaN,
        goal: "",
        comments: "",
      },
    },
    exercisePlan: {
      type: Object,
      default: {
        day1: {
          title: "",
          exercises: [],
        },
        day2: {
          title: "",
          exercises: [],
        },
        day3: {
          title: "",
          exercises: [],
        },
        day4: {
          title: "",
          exercises: [],
        },
        day5: {
          title: "",
          exercises: [],
        },
        day6: {
          title: "",
          exercises: [],
        },
      },
    },
    mealPlan: {
      type: Object,
      default: {
        portion1: {
          foods: [],
        },
        portion2: {
          foods: [],
        },
        portion3: {
          foods: [],
        },
        portion4: {
          foods: [],
        },
        portion5: {
          foods: [],
        },
        portion6: {
          foods: [],
        },
      },
    },
  },
  {
    timestamps: true,
  }
)

const Trainee = model("Trainee", traineeSchema);

module.exports = Trainee
