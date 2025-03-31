import { Button } from "@/component/ui/button";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaCode, FaRobot, FaServer } from "react-icons/fa";
import { SiSpringboot, SiTailwindcss, SiReact } from "react-icons/si";

export default function About() {
  return (
    <div className="mt-18 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 md:px-8 py-12 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className=" fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 0.1
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Hello, I'm <span className="text-white">Harshit Mishra</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Full Stack Developer & AI Enthusiast crafting intelligent applications with modern technologies
        </motion.p>
      </motion.div>

      {/* About Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-sm relative overflow-hidden z-10"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl"></div>
        
        <div className="relative z-10">
          <motion.h2 
            className="text-2xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            About Me
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 text-base md:text-lg leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            I'm a passionate full-stack developer with expertise in building AI-powered applications. 
            With a strong foundation in modern web technologies, I create solutions that enhance 
            productivity and deliver exceptional user experiences.
          </motion.p>

          {/* Tech Stack */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-full">
                <SiReact className="text-blue-400 mr-2" size={20} />
                <span>React</span>
              </div>
              <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-full">
                <SiSpringboot className="text-green-400 mr-2" size={20} />
                <span>Spring Boot</span>
              </div>
              <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-full">
                <SiTailwindcss className="text-cyan-400 mr-2" size={20} />
                <span>Tailwind CSS</span>
              </div>
              <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-full">
                <FaRobot className="text-purple-400 mr-2" size={20} />
                <span>AI/ML</span>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex justify-center space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <a 
              href="https://github.com/harshit-pro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-700/50 hover:bg-gray-600/70 rounded-full transition-all duration-300 group"
            >
              <FaGithub className="text-gray-300 group-hover:text-white transition-colors" size={20} />
              <span className="ml-2 text-gray-300 group-hover:text-white transition-colors">GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/harshit-mishra-3133751ab/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-700/50 hover:bg-gray-600/70 rounded-full transition-all duration-300 group"
            >
              <FaLinkedin className="text-gray-300 group-hover:text-blue-400 transition-colors" size={20} />
              <span className="ml-2 text-gray-300 group-hover:text-blue-400 transition-colors">LinkedIn</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="mt-12 relative z-10"
      >
        <Button 
          className="relative overflow-hidden group px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-500 hover:to-purple-500"
        >
          <span className="relative z-10">Get Started with AI Resume Builder</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Button>
      </motion.div>
    </div>
  );
}