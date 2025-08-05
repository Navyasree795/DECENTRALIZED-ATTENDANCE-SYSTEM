import React, { useState } from "react";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function App() {
  const [userType, setUserType] = useState(""); // 'teacher' or 'student'
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Please connect your wallet to continue.</p>
      </div>
    );
  }

  if (!userType) {
    return (
      <div className="flex flex-col items-center mt-24">
        <h2 className="mb-6 text-lg font-bold">Select Role:</h2>
        <button className="bg-blue-400 p-2 rounded mb-2" onClick={() => setUserType("teacher")}>
          Teacher
        </button>
        <button className="bg-green-400 p-2 rounded" onClick={() => setUserType("student")}>
          Student
        </button>
      </div>
    );
  }

  return userType === "teacher" ? (
    <TeacherDashboard students={["0x123...", "0x456..."]} />
  ) : (
    <StudentDashboard attendanceRecords={[]} />
  );
}

export default App;
