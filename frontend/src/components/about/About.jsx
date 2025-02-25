import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const About = () => {
  const [activeTab, setActiveTab] = useState("project");

  const teamData = {
    leader: {
      name: "Vally Nguyen",
      role: "Team Leader",
      summary: "100+ years of experience in project management and team leadership",
      image: "https://wallpapers.com/images/high/giga-chad-sticks-and-stones-yc8k7c062j9c8d6p.webp",
      github: "https://github.com/Needalife",
      linkedin: "https://linkedin.com"
    },
    frontend: {
      name: "Sean Nguyen",
      role: "Frontend Developer",
      skills: ["React", "Tailwind CSS", "JavaScript"],
      image: "https://wallpapers.com/images/high/giga-chad-adonis-in-the-shadows-vsguqibogyzcai6h.webp",
      github: "https://github.com/Seanvt8903",
      linkedin: "https://linkedin.com/in/tuandungnguyen8903/"
    },
    backend: [
      {
        name: "Phuoc Le",
        role: "Backend Developer",
        specialization: "Database Architecture & API Design",
        image: "https://wallpapers.com/images/high/handsome-giga-chad-hmsvijj0ji4dhedr.webp",
        github: "https://github.com/LeTranTrongPhuoc",
        linkedin: "https://linkedin.com"
      },
      {
        name: "Cuong Vo",
        role: "Backend Developer",
        specialization: "System Architecture & Cloud Infrastructure",
        image: "https://wallpapers.com/images/high/smiling-giga-chad-2uzbwfl2i4sbu16m.webp",
        github: "https://github.com/voduycuong",
        linkedin: "https://linkedin.com/in/vo-duy-cuong/"
      }
    ]
  };

  const ProjectTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Transactions Real-Time Tracking</h2>
      
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Project Overview</h3>
          <p className="text-gray-600">A comprehensive real-time transaction tracking system designed to monitor and analyze financial transactions across multiple platforms.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Key Features</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Real-time transaction monitoring</li>
            <li>Advanced analytics dashboard</li>
            <li>Multi-platform integration</li>
            <li>Automated reporting system</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Technology Stack</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Frontend: React, Tailwind CSS</li>
            <li>Backend: Node.js, Express, Golang</li>
            <li>Database: MongoDB</li>
            <li>Real-time: Socket.io</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Project Goals</h3>
          <p className="text-gray-600">To provide a robust, scalable solution for real-time transaction tracking while ensuring security and performance.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Problem Statement Solved</h3>
          <p className="text-gray-600">Addressed the challenge of monitoring and analyzing high-volume transactions across multiple platforms in real-time.</p>
        </div>
      </section>
    </div>
  );

  const MemberCard = ({ member }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform hover:scale-105">
      <img
        src={member.image}
        alt={member.name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131";
        }}
      />
      <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">{member.name}</h3>
      <p className="text-gray-600 text-center mb-2">{member.role}</p>
      {member.summary && <p className="text-gray-500 text-center mb-3">{member.summary}</p>}
      {member.specialization && <p className="text-gray-500 text-center mb-3">{member.specialization}</p>}
      {member.skills && (
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {member.skills.map((skill) => (
            <span key={skill} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-center space-x-4">
        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
          <FaGithub size={24} />
        </a>
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
          <FaLinkedin size={24} />
        </a>
      </div>
    </div>
  );

  const MembersTab = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6">Our Team</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MemberCard member={teamData.leader} />
        <MemberCard member={teamData.frontend} />
        {teamData.backend.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto bg-white rounded-xl p-6 md:p-8 shadow-lg">
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
          {activeTab === "project" ? <ProjectTab /> : <MembersTab />}
        </div>
      </div>
    </div>
  );
};

export default About;