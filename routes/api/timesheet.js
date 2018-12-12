const express = require('express');
const moment = require('moment');

const router = express.Router();

const Timesheet = require('../../models/Timesheet');
const ValidateTaskInput = require('../../utils/validation/task');
const dateFormat = 'MM-DD-YYYY';

// @route   GET api/timesheet
// @desc    Get all timesheets from a user
// @access  Private
router.get('/', (req, res) => {
  Timesheet.find({ user: req.user.id })
    .sort({ dateFormatted: -1 })
    .then(timesheets => res.json(timesheets))
    .catch(err =>
      res.status(404).json({ notimesheetfound: 'No timesheets found.' })
    );
});

// @route   POST api/timesheet
// @desc    Create a timesheet and/or task in a timesheet
// @access  Private
router.post('/', (req, res) => {
  const { errors, isValid } = ValidateTaskInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const now = moment().format(dateFormat);
  const newTask = {
    description: req.body.description,
    hours: req.body.hours
  };

  Timesheet.findOne({ dateFormatted: now, user: req.user.id }).then(
    timesheet => {
      if (timesheet) {
        timesheet.tasks.push(newTask);
        timesheet
          .save()
          .then(timesheet => res.json(timesheet))
          .catch(err => res.status(400).json(err));
      } else {
        const timesheet = new Timesheet({
          user: req.user.id,
          dateFormatted: now,
          tasks: [newTask]
        });

        timesheet
          .save()
          .then(timesheet => res.json(timesheet))
          .catch(err => res.status(400).json(err));
      }
    }
  );
});

// @route   DELETE api/timesheet/:id/task/:task_id
// @desc    Remove task from a post and possibly the entire timesheet if there's 0 task
// @access  Private
router.delete('/:id/task/:task_id', (req, res) => {
  const timesheetId = req.params.id;
  const taskId = req.params.task_id;

  Timesheet.findOne({ _id: timesheetId, user: req.user.id })
    .then(timesheet => {
      if (!timesheet) {
        return res
          .status(404)
          .json({ notimesheetfound: 'timesheet not found.' });
      }

      const index = timesheet.tasks.findIndex(task => task._id == taskId);

      if (index === -1) {
        return res.status(404).json({ notaskfound: 'task not found.' });
      }

      timesheet.tasks.splice(index, 1);

      if (timesheet.tasks.length === 0) {
        timesheet
          .remove()
          .then(() => res.json({ timesheetdelete: 'Timesheet was deleted.' }));
      } else {
        timesheet
          .save()
          .then(timesheet => res.json(timesheet))
          .catch(err => res.status(400).json(err));
      }
    })
    .catch(err =>
      res.status(404).json({ notimesheetfound: 'timesheet not found.' })
    );
});

module.exports = router;
