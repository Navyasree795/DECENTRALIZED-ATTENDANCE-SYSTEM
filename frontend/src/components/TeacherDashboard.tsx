import React, { useState } from "react";
import { markAttendance } from "../utils/aptos";

interface TeacherDashboardProps {
  students: string[];
}

export default function TeacherDashboard({ students }: TeacherDashboardProps) {
  const [date, setDate] = useState("");
  const [presentMap, setPresentMap] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {};
    students.forEach((s) => {
      initial[s] = null;
    });
    return initial;
  });

  const handleMark = async (student: string, isPresent: boolean) => {
    try {
      await markAttendance(student, date, isPresent);
      setPresentMap((prev) => ({ ...prev, [student]: isPresent }));
      alert(`Marked ${student} as ${isPresent ? "Present" : "Absent"}`);
    } catch (e) {
      console.error(e);
      alert(`Failed to mark attendance for ${student}`);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Teacher Dashboard</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {students.map((student) => (
        <div key={student} className="mb-2 flex items-center justify-between border p-2 rounded">
          <div>{student}</div>
          <div>
            <button
              className={`mr-2 px-3 py-1 rounded ${
                presentMap[student] === true ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
              disabled={presentMap[student] !== null}
              onClick={() => handleMark(student, true)}
            >
              Present
            </button>
            <button
              className={`px-3 py-1 rounded ${
                presentMap[student] === false ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
              disabled={presentMap[student] !== null}
              onClick={() => handleMark(student, false)}
            >
              Absent
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
