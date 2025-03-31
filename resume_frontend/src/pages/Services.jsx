// import { Button } from "@/component/ui/button";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function Service() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center px-6 md:px-16 py-10">
//       {/* Hero Section */}
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.8 }}
//         className="max-w-4xl text-center mb-10"
//       >
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Revolutionize Your Resume with AI</h1>
//         <p className="mt-4 text-lg text-gray-600">
//           Create a professional resume in seconds using AI-driven insights and modern templates.
//         </p>
//       </motion.div>

//       {/* Features Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
//         {features.map((feature, index) => (
//           <motion.div 
//             key={index} 
//             initial={{ opacity: 0, y: 10 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ duration: 0.5, delay: index * 0.2 }}
//             className="p-6 bg-white shadow-lg rounded-2xl text-center border border-gray-200 hover:shadow-xl transition"
//           >
//             <div className="text-4xl mb-4">{feature.icon}</div>
//             <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
//             <p className="text-gray-600 mt-2">{feature.description}</p>
//           </motion.div>
//         ))}
//       </div>

//       {/* PDF Download & More Features */}
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.8, delay: 0.5 }}
//         className="mt-12 flex flex-col items-center space-y-4"
//       >
//         <Link to={"/generate-resume"} className="bg-primary text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg">
//           Get Started for Free
//         </Link>
//         <Button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg">
//           Download Resume as PDF
//         </Button>
//       </motion.div>

//       {/* Testimonials Section */}
//       <div className="mt-16 max-w-5xl text-center">
//         <h2 className="text-3xl font-bold text-gray-800">What Our Users Say</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//           {testimonials.map((testimonial, index) => (
//             <motion.div 
//               key={index} 
//               initial={{ opacity: 0, y: 10 }} 
//               animate={{ opacity: 1, y: 0 }} 
//               transition={{ duration: 0.5, delay: index * 0.2 }}
//               className="p-6 bg-white shadow-lg rounded-2xl border border-gray-200"
//             >
//               <p className="text-gray-600 italic">"{testimonial.quote}"</p>
//               <h4 className="mt-4 font-semibold text-gray-800">- {testimonial.name}</h4>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const features = [
//   { title: "AI-Powered Writing", description: "Generate bullet points tailored to your skills.", icon: "🤖" },
//   { title: "Beautiful Templates", description: "Choose from sleek, ATS-friendly designs.", icon: "🎨" },
//   { title: "Instant Formatting", description: "Effortlessly format your resume with one click.", icon: "⚡" },
//   { title: "PDF Download", description: "Export your resume as a high-quality PDF instantly.", icon: "📄" },
//   { title: "Live Editing", description: "Make real-time changes and see instant previews.", icon: "✏️" }
// ];

// const testimonials = [
//   { quote: "This AI resume builder saved me hours of work!", name: "John Doe" },
//   { quote: "A game-changer for job seekers. Super easy to use!", name: "Jane Smith" }
// ];



import { Button } from "@/component/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Wand2, LayoutTemplate, Zap, FileText, Edit3, CheckCircle } from "lucide-react";

export default function Services() {
  return (
    <div className="mt-10 min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center px-4 sm:px-8 py-12">
      {/* Hero Section with Particles */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl text-center mb-16 relative"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          AI-Powered Resume Revolution
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Transform your job search with our intelligent resume builder that analyzes, optimizes, and formats your resume for maximum impact.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Link 
            to="/generate-resume" 
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-full shadow-xl group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 ease-out"></span>
            <span className="absolute top-0 left-0 w-full bg-white opacity-5 filter blur-sm h-1/3"></span>
            <span className="absolute bottom-0 left-0 w-full h-1/3 bg-black opacity-5 filter blur-sm"></span>
            <span className="absolute bottom-0 left-0 w-full h-1/2 bg-white opacity-10 filter blur-md"></span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-15"></span>
            <span className="relative flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Create Your Resume Now
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl w-full px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
                <ul className="mt-4 space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* PDF Export Section
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-20 max-w-4xl w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Professional PDF Export</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Download your resume as a polished PDF with perfect formatting for ATS systems and recruiters.
          </p>
          <Button 
            variant="secondary" 
            className="bg-white text-blue-600 hover:bg-white/90 px-8 py-4 rounded-full font-semibold shadow-lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Download Resume as PDF
          </Button>
        </div>
      </motion.div> */}

      {/* Testimonials */}
      <div className="mt-24 max-w-7xl w-full px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Job Seekers Worldwide</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands who've transformed their job search with our AI-powered resume builder.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600">
                  {testimonial.initials}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              <div className="mt-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
     
    </div>
  );
}

const features = [
  {
    title: "AI Content Generation",
    description: "Our advanced AI writes compelling resume content tailored to your target job.",
    icon: <Wand2 className="w-6 h-6" />,
    benefits: [
      "ATS-optimized bullet points",
      "Industry-specific terminology",
      "Achievement-oriented phrasing"
    ]
  },
  {
    title: "Professional Templates",
    description: "Choose from designer-crafted templates that pass ATS scans with flying colors.",
    icon: <LayoutTemplate className="w-6 h-6" />,
    benefits: [
      "10+ modern designs",
      "One-click formatting",
      "Mobile-responsive layouts"
    ]
  },
  {
    title: "Instant Optimization",
    description: "Get real-time suggestions to improve your resume's impact and readability.",
    icon: <Zap className="w-6 h-6" />,
    benefits: [
      "Keyword density analysis",
      "Action verb suggestions",
      "Length optimization"
    ]
  },
  {
    title: "Live Editing",
    description: "See changes instantly with our WYSIWYG editor that requires no formatting skills.",
    icon: <Edit3 className="w-6 h-6" />,
    benefits: [
      "Real-time preview",
      "Drag-and-drop sections",
      "Undo/redo functionality"
    ]
  },
  {
    title: "Multi-Format Export",
    description: "Download your resume in multiple formats for different application needs.",
    icon: <FileText className="w-6 h-6" />,
    benefits: [
      "PDF with perfect margins",
      "Microsoft Word (.docx)",
      "Plain text version"
    ]
  },
  {
    title: "Job Matching",
    description: "Our AI compares your resume against job descriptions for better alignment.",
    icon: <CheckCircle className="w-6 h-6" />,
    benefits: [
      "Match score analysis",
      "Missing keyword detection",
      "Skill gap identification"
    ]
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    initials: "SJ",
    quote: "After using this builder, I got 3x more interview requests. The AI suggestions were spot-on!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    initials: "MC",
    quote: "The templates helped me stand out in a competitive tech job market. Landed my dream job!",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "HR Specialist",
    initials: "ER",
    quote: "I recommend this to all our candidates. The ATS optimization features are unmatched.",
    rating: 4
  },
  {
    name: "David Wilson",
    role: "Finance Manager",
    initials: "DW",
    quote: "Went from no responses to multiple offers in 2 weeks. The difference was incredible.",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Data Scientist",
    initials: "PP",
    quote: "The AI helped me translate technical skills into business impact statements.",
    rating: 5
  },
  {
    name: "James Thompson",
    role: "Career Coach",
    initials: "JT",
    quote: "This is now my go-to tool for helping clients revamp their resumes quickly.",
    rating: 4
  }
];
