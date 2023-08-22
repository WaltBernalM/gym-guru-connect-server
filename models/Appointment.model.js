const { Schema, model } = require("mongoose")

const appointmentSchema = new Schema(
  {
    traineeId: {
      type: Schema.Types.ObjectId,
      ref: "Trainee",
    },
    dateTime: {
      type: Object,
      default: {
        month: NaN, // from 1 to 12
        day: NaN, // from 1 to 31
        year: NaN, // full year
        hour: NaN, // Must be in seconds
        minutes: NaN, // must be in seconds
        length: 1800, // 30 minutes
      },
    },
  },
  {
    timestamps: true,
  }
)

const Appointment = model("Appointment", appointmentSchema)

module.exports = Appointment
