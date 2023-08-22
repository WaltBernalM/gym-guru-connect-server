const { Schema, model } = require("mongoose")

const appointmentSchema = new Schema(
  {
    dayInfo: {
      type: String,
    },
    hour: {
      type: Number,
    },
    traineeId: {
      type: Schema.Types.ObjectId,
      ref: "Trainee",
      default: null
    },
  },
  {
    timestamps: true,
  }
)

appointmentSchema.virtual('isAvailable').get(() => !this.traineeId)

const Appointment = model("Appointment", appointmentSchema)
module.exports = Appointment