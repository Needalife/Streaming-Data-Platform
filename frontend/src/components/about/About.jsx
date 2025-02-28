import { useState, useEffect, useRef } from "react";
import { FaGithub, FaLinkedin, FaWifi } from "react-icons/fa";
import {
  SiReact,
  SiTailwindcss,
  SiGo,
  SiMongodb,
  SiSocketdotio,
  SiRedis,
  SiDocker,
  SiPython,
} from "react-icons/si";

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
      // Compare scrollHeight with clientHeight to determine if text is overflowing.
      setIsOverflowing(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [text]);

  return (
    <p
      ref={ref}
      className={`text-gray-500 text-justify mb-3 ${isOverflowing ? `line-clamp-${lines}` : ""
        }`}
    >
      {text}
    </p>
  );
};

const About = () => {
  const [activeTab, setActiveTab] = useState("project");

  const teamData = {
    leader: {
      name: "Vally Nguyen",
      role: "Team Leader",
      summary:
        "100+ years of experience in project management and team leadership",
      description:
        "With over 100+ years of experience (give or take a few centuries), Vally is our fearless captain—equal parts strategy guru and pun aficionado. When Vally isn’t busy orchestrating project triumphs, you can catch them leading impromptu interpretive dances at team meetings or negotiating peace between feuding office coffee machines. Their legendary ability to juggle flaming rubber chickens (metaphorically, of course) and dispense dad jokes with impeccable timing makes every day an adventure in innovation. Vally’s unique blend of wisdom, whimsy, and just a pinch of ancient mystique keeps the team laughing while they code their way to glory.",
      image:
        "https://wallpapers.com/images/high/giga-chad-sticks-and-stones-yc8k7c062j9c8d6p.webp",
      github: "https://github.com/Needalife",
      linkedin: "https://linkedin.com",
    },
    frontend: {
      name: "Sean Nguyen",
      role: "Frontend Developer",
      skills: ["React", "Tailwind CSS", "JavaScript"],
      description:
        "Sean is our brilliant frontend magician who transforms mundane interfaces into dazzling, interactive works of art. Rumor has it that one of his buttons was so mesmerizing it sparked an accidental office disco, complete with spontaneous dance-offs and confetti. Armed with a mastery of React and Tailwind CSS—and a quirky obsession with pixel-perfect puns—Sean’s work is as clean and captivating as a freshly buffed superhero costume. His creative process often involves debating whether semicolons should have secret powers, all while his code practically sings, ensuring every user’s experience is both beautiful and amusing.",
      image:
        "https://wallpapers.com/images/high/giga-chad-adonis-in-the-shadows-vsguqibogyzcai6h.webp",
      github: "https://github.com/Seanvt8903",
      linkedin: "https://linkedin.com/in/tuandungnguyen8903/",
    },
    backend: [
      {
        name: "Phuoc Le",
        role: "Backend Developer",
        specialization: "Database Architecture & API Design",
        description:
          "Phuoc is our backend wizard, navigating the labyrinth of code with the finesse of a modern-day digital Indiana Jones. His database schemas are so elegantly designed that even SQL queries shed tears of joy, and his APIs deliver data like a smooth jazz radio station at midnight. When not deciphering the arcane mysteries of server logs, Phuoc can be found armed with a seemingly endless supply of energy drinks and an inexplicable collection of quirky action figures. Legend even has it that he once debugged a critical issue by whispering sweet nothings to his code—a testament to his blend of genius and humor.",
        image:
          "https://wallpapers.com/images/high/handsome-giga-chad-hmsvijj0ji4dhedr.webp",
        github: "https://github.com/LeTranTrongPhuoc",
        linkedin: "https://linkedin.com",
      },
      {
        name: "Cuong Vo",
        role: "Backend Developer",
        specialization: "System Architecture & Cloud Infrastructure",
        description:
          "Cuong is our resident cloud architect, turning the realm of system design into a symphony of scalable marvels. He doesn’t just build infrastructure; he crafts digital operas that play out across the skies. With an offbeat sense of humor and a love for obscure tech memes, Cuong can juggle cloud APIs as effortlessly as he cracks witty one-liners during a system outage. His legendary debugging prowess is matched only by his ability to transform a routine server hiccup into a full-blown comedy act—leaving everyone laughing (and sometimes scratching their heads) as he works his magic. Whether it’s coaxing servers into compliance or inspiring awe with his coffee-fueled insights, Cuong keeps the team both grounded and endlessly entertained.",
        image:
          "https://wallpapers.com/images/high/smiling-giga-chad-2uzbwfl2i4sbu16m.webp",
        github: "https://github.com/voduycuong",
        linkedin: "https://linkedin.com/in/vo-duy-cuong/",
      },
    ],
  };

  // ProjectTab now fills the screen similar to the Member layout.
  const ProjectTab = () => {
    const { width, height } = useWindowDimensions();
    const isMobile = width < 768 || height < 700;

    if (isMobile) {
      return (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Transactions Real-Time Tracking
          </h2>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Project Overview
              </h3>
              <p className="text-gray-600">
                A comprehensive real-time transaction tracking system designed to
                monitor and analyze financial transactions across multiple platforms.
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
                  <SiReact size={32} className="text-blue-500" />
                  <span className="mt-1 text-xs">React</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiTailwindcss size={32} className="text-teal-500" />
                  <span className="mt-1 text-xs">Tailwind</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiGo size={32} className="text-blue-600" />
                  <span className="mt-1 text-xs">Golang</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiMongodb size={32} className="text-green-500" />
                  <span className="mt-1 text-xs">MongoDB</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiSocketdotio size={32} className="text-gray-600" />
                  <span className="mt-1 text-xs">Socket.io</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiRedis size={32} className="text-red-500" />
                  <span className="mt-1 text-xs">Redis</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiDocker size={32} className="text-blue-400" />
                  <span className="mt-1 text-xs">Docker</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiPython size={32} className="text-yellow-500" />
                  <span className="mt-1 text-xs">Python</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Project Goals & Solutions
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  To provide a robust, scalable solution for real-time transaction tracking while ensuring security and performance.
                </p>
                <p className="text-gray-600">
                  Addressed the challenge of monitoring and analyzing high-volume transactions across multiple platforms in real-time.
                </p>
              </div>
            </div>
          </section>
        </div>
      );
    } else {
      return (
        <div
          className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all"
          style={{ height: "calc(100vh - 16rem)" }}
        >
          <div className="p-6 flex-1 overflow-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Transactions Real-Time Tracking
            </h2>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Project Overview
                </h3>
                <p className="text-gray-600">
                  A comprehensive real-time transaction tracking system designed to
                  monitor and analyze financial transactions across multiple platforms.
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
                    <SiReact size={48} className="text-blue-500" />
                    <span className="mt-1 text-sm">React</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SiTailwindcss size={48} className="text-teal-500" />
                    <span className="mt-1 text-sm">Tailwind</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SiGo size={48} className="text-blue-600" />
                    <span className="mt-1 text-sm">Golang</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SiMongodb size={48} className="text-green-500" />
                    <span className="mt-1 text-sm">MongoDB</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <FaWifi size={48} className="text-gray-600" />
                    <span className="mt-1 text-sm">Websocket</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SiRedis size={48} className="text-red-500" />
                    <span className="mt-1 text-sm">Redis</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SiDocker size={48} className="text-blue-400" />
                    <span className="mt-1 text-sm">Docker</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SiPython size={48} className="text-yellow-500" />
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
                  <p className="text-gray-600">
                    To provide a robust, scalable solution for real-time transaction tracking while ensuring security and performance.
                  </p>
                  <p className="text-gray-600">
                    Addressed the challenge of monitoring and analyzing high-volume transactions across multiple platforms in real-time.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    }
  };

  // MemberCard (code remains unchanged from previous version)
  const MemberCard = ({ member }) => {
    const { width, height } = useWindowDimensions();
    const isMobile = width < 768 || height < 700;

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
            <p className="text-gray-500 text-justify mb-3">{member.summary}</p>
          )}
          {member.specialization && (
            <p className="text-gray-500 text-justify mb-3">{member.specialization}</p>
          )}
          {/* Omit description in mobile */}
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
              <p className="text-gray-500 text-justify mb-3">{member.summary}</p>
            )}
            {member.specialization && (
              <p className="text-gray-500 text-justify mb-3">{member.specialization}</p>
            )}
            {member.description && (
              <TruncatedDescription text={member.description} lines={3} />
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
        </div>
      );
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mt-6 mb-6">About us</h1>
      <div className="max-w mx-auto bg-white rounded-xl p-6 md:p-8 shadow-lg">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("project")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === "project"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Project
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === "members"
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
