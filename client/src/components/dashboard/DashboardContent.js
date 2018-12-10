import React from 'react';
import TimesheetForm from '../timesheet/TimesheetForm';
import Timesheet from '../timesheet/Timesheet';

export default function DashboardContent() {
  return (
    <div className="dashboard-content-container">
      <TimesheetForm />
      <Timesheet />
    </div>
  );
}
