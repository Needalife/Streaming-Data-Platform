import React from "react";
import diagram from "../../../assets/diagram1.png";
import {
  SiReact,
  SiTailwindcss,
  SiGo,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiPython,
  SiApachekafka,
} from "react-icons/si";

const ProjectTab = () => {
  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden transition-all"
      style={{ height: "calc(100vh - 16rem)" }}
    >
      <div className="p-4 flex-1 overflow-auto">
        <h2 className="text-4xl font-bold leading-relaxed mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Transactions Real-Time Tracking
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Project Overview
            </h3>
            <p className="text-gray-600 text-justify">
              Our cutting-edge system monitors real-time financial transactions across platforms with high accuracy. Using cloud infrastructure and advanced analytics, it delivers instant insights, detects trends and anomalies, and empowers informed decisions with an intuitive interface and robust security.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Key Features
            </h3>
            <ul className="space-y-2 text-gray-600">
              {[
                "Real-time transaction monitoring",
                "Advanced analytics charts in dashboard",
                "Multi-platform integration",
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
              Technology Stack
            </h3>
            <div className="grid grid-cols-4 gap-3 justify-center items-center">
              <div className="flex flex-col items-center">
                <SiReact size={40} className="text-blue-500" />
                <span className="mt-1 text-sm">React</span>
              </div>
              <div className="flex flex-col items-center">
                <SiTailwindcss size={40} className="text-teal-500" />
                <span className="mt-1 text-sm">Tailwind</span>
              </div>
              <div className="flex flex-col items-center">
                <SiGo size={40} className="text-blue-600" />
                <span className="mt-1 text-sm">Golang</span>
              </div>
              <div className="flex flex-col items-center">
                <SiMongodb size={40} className="text-green-500" />
                <span className="mt-1 text-sm">MongoDB</span>
              </div>
              <div className="flex flex-col items-center">
                <SiApachekafka size={40} className="text-gray-600" />
                <span className="mt-1 text-sm">Kafka</span>
              </div>
              <div className="flex flex-col items-center">
                <SiRedis size={40} className="text-red-500" />
                <span className="mt-1 text-sm">Redis</span>
              </div>
              <div className="flex flex-col items-center">
                <SiDocker size={40} className="text-blue-400" />
                <span className="mt-1 text-sm">Docker</span>
              </div>
              <div className="flex flex-col items-center">
                <SiPython size={40} className="text-yellow-500" />
                <span className="mt-1 text-sm">Python</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Project Goals & Solutions
            </h3>
            <div className="space-y-3">
              <p className="text-gray-600 text-justify">
                Our goal is to revolutionize financial monitoring with a scalable, real-time solution that securely handles high volumes. Using advanced analytics, dynamic dashboards, and predictive modeling, we turn complex data into actionable insights for proactive decision-making and sustainable growth.
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden mt-4 mb-4">
        <img
          src={diagram}
          alt="Project Diagram"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
};

export default ProjectTab;
