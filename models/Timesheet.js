const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimesheetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  dateFormatted: {
    type: String,
    required: true
  },
  tasks: [
    {
      text: {
        type: String,
        required: true
      },
      hours: {
        type: Number,
        require: true
      }
    }
  ]
});

module.exports = Timesheet = mongoose.model('timesheets', TimesheetSchema);
