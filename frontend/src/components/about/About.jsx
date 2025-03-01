// src/components/About.jsx

import React, { useState } from "react";
import ProjectTab from "./sub_components/ProjectTab";
import MemberTab from "./sub_components/MembersTab";

const About = () => {
  const [activeTab, setActiveTab] = useState("project");

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mt-6 mb-6">About us</h1>
      <div className="max-w mx-auto bg-white rounded-xl p-6 md:p-8 shadow-lg">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("project")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "project"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Project
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "members"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Team Members
          </button>
        </div>
        <div className="transition-all duration-300">
          {activeTab === "project" ? <ProjectTab /> : <MemberTab />}
        </div>
      </div>
    </div>
  );
};

export default About;
