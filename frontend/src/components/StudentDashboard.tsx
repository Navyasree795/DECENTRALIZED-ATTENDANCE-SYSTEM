import React from "react";

interface StudentDashboardProps {
  attendanceRecords: { date: string; present: boolean }[];
}

export default function StudentDashboard({ attendanceRecords }: StudentDashboardProps) {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Student Dashboard</h2>

      {attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <ul>
          {attendanceRecords.map(({ date, present }) => (
            <li
              key={date}
              className={`p-2 mb-1 rounded ${
                present ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {date}: {present ? "Present" : "Absent"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
