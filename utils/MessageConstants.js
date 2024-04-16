const MessageConstants = {
  EXERCISE_REPS_RANGE_ERROR: "reps must be a integer number between 1 and 300",
  EXERCISE_INTENSITY_RANGE_ERROR: "intensity must be between 0.3 and 1",
  BASE_EXERCISE_NOT_FOUND_ERROR: "Base exercise not found in DB",
  CUSTOM_EXERCISE_NOT_FOUND_IN_TRAINEE_ERROR: "Custom Exercise not found in any Exercise Routine of Trainee",
  SET_TYPE_NOT_FOUND_IN_DB_ERROR: "setTypeId not found in DB",
  INTERNAL_SERVER_ERROR: "Internal Server Error"
}

module.exports = { MessageConstants }