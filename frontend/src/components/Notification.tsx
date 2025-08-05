import React from "react";

interface NotificationProps {
  type: "success" | "error";
  msg: string;
}

const Notification = ({ type, msg }: NotificationProps) => (
  <div
    className={`fixed top-4 right-4 px-4 py-2 rounded shadow ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`}
  >
    {msg}
  </div>
);
export default Notification;