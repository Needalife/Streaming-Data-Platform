import React, { useState, useEffect, useRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import teamData from "./TeamData";

// Custom hook to get current window dimensions
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

// Custom component that conditionally truncates text if it overflows.
const TruncatedDescription = ({ text, lines = 3 }) => {
  const ref = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setIsOverflowing(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [text]);

  return (
    <p
      ref={ref}
      className={`text-gray-500 text-justify mb-3 ${
        isOverflowing ? `line-clamp-${lines}` : ""
      }`}
    >
      {text}
    </p>
  );
};

const MemberCard = ({ member }) => {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768 || height < 768;

  if (isMobile) {
    return (
      <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 transition-transform hover:scale-105">
        <img
          src={member.image}
          alt={member.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1518791841217-8f162f1e1131";
          }}
        />
        <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">
          {member.name}
        </h3>
        <p className="text-gray-600 text-center mb-2">{member.role}</p>
        {member.summary && (
          <p className="text-gray-500 text-center mb-3">{member.summary}</p>
        )}
        {member.specialization && (
          <p className="text-gray-500 text-center mb-3">{member.specialization}</p>
        )}
        {member.skills && (
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex justify-center space-x-4">
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800"
          >
            <FaGithub size={24} />
          </a>
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="hidden md:flex flex-col bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105"
        style={{ height: "calc(100vh - 20rem)" }}
      >
        <div className="h-1/2">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1518791841217-8f162f1e1131";
            }}
          />
        </div>
        <div className="h-1/2 p-6 flex flex-col">
          <h3 className="text-2xl font-semibold text-center mb-2 text-gray-800">
            {member.name}
          </h3>
          <p className="text-gray-600 text-center mb-2">{member.role}</p>
          {member.summary && (
            <p className="text-gray-500 text-center mb-3">{member.summary}</p>
          )}
          {member.skills && (
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {member.specialization && (
            <p className="text-gray-500 text-center mb-3">{member.specialization}</p>
          )}
          <div className="flex-1 overflow-auto">
            {member.description && (
              <TruncatedDescription text={member.description} lines={3} />
            )}
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              <FaGithub size={24} />
            </a>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    );
  }
};

const MemberTab = () => (
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

export default MemberTab;
