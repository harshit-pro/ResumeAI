

// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { FaBrain, FaTrash, FaPaperPlane, FaPlusCircle, FaEdit, FaSync, FaArrowUp, FaArrowDown } from "react-icons/fa";
// import { generateResume } from "../api/ResumeService";
// import { BiBook } from "react-icons/bi";
// import { useForm, useFieldArray } from "react-hook-form";
// import Resume from "../component/Resume";
// import { motion, AnimatePresence } from "framer-motion";
// import { RiFilePaper2Line } from "react-icons/ri";

// const GenerateResume = () => {
//   // Load data from localStorage or initialize with defaults
//   const [data, setData] = useState(() => {
//     const savedData = localStorage.getItem('resumeData');
//     return savedData ? JSON.parse(savedData) : {
//       personalInformation: { fullName: "Durgesh Kumar Tiwari" },
//       summary: "",
//       skills: [],
//       experience: [],
//       education: [],
//       certifications: [],
//       projects: [],
//       languages: [],
//       interests: [],
//       achievements: []
//     };
//   });

//   // Save data to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('resumeData', JSON.stringify(data));
//   }, [data]);

//   // Load current view from localStorage or default to 'generate'
//   const [currentView, setCurrentView] = useState(() => {
//     const savedView = localStorage.getItem('currentView');
//     return savedView || 'generate';
//   });

//   // Set initial UI states based on saved view
//   const [showPromptInput, setShowPromptInput] = useState(currentView === 'generate');
//   const [showFormUI, setShowFormUI] = useState(currentView === 'form');
//   const [showResumeUI, setShowResumeUI] = useState(currentView === 'resume');

//   // Update localStorage when view changes
//   useEffect(() => {
//     if (showPromptInput) {
//       localStorage.setItem('currentView', 'generate');
//     } else if (showFormUI) {
//       localStorage.setItem('currentView', 'form');
//     } else if (showResumeUI) {
//       localStorage.setItem('currentView', 'resume');
//     }
//   }, [showPromptInput, showFormUI, showResumeUI]);

//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { register, handleSubmit, control, reset } = useForm({
//     defaultValues: data,
//   });

//   useEffect(() => {
//     reset(data);
//   }, [data, reset]);

//   const experienceFields = useFieldArray({ control, name: "experience" });
//   const educationFields = useFieldArray({ control, name: "education" });
//   const certificationsFields = useFieldArray({ control, name: "certifications" });
//   const projectsFields = useFieldArray({ control, name: "projects" });
//   const languagesFields = useFieldArray({ control, name: "languages" });
//   const interestsFields = useFieldArray({ control, name: "interests" });
//   const achievementsFields = useFieldArray({ control, name: "achievements" });
//   const skillsFields = useFieldArray({ control, name: "skills" });

//   const onSubmit = (formData) => {
//     setData({ ...formData });
//     setShowFormUI(false);
//     setShowPromptInput(false);
//     setShowResumeUI(true);
//   };

//   const handleGenerate = async () => {
//     try {
//       setLoading(true);
//       const responseData = await generateResume(description);
  
//       if (!responseData) {
//         throw new Error("API response is empty.");
//       }
  
//       let parsedResponse = responseData;
//       if (typeof responseData === "string") {
//         try {
//           parsedResponse = JSON.parse(responseData);
//         } catch (parseError) {
//           console.error("Error parsing API response string:", parseError);
//           throw new Error("API returned invalid JSON.");
//         }
//       }
  
//       const candidate = parsedResponse?.candidates?.[0];
//       if (!candidate?.content?.parts?.[0]?.text) {
//         throw new Error("Candidate content parts are missing.");
//       }
  
//       const candidateText = candidate.content.parts[0].text;
  
//       if (!candidateText) {
//         throw new Error("Extracted text response is empty.");
//       }
  
//       let resumeData;
//       try {
//         resumeData = JSON.parse(candidateText);
//       } catch (parseError) {
//         throw new Error("AI response is not valid JSON. Try modifying the description.");
//       }
  
//       let finalResumeData = resumeData;
//       if (resumeData?.generated_text) {
//         try {
//           finalResumeData = JSON.parse(resumeData.generated_text);
//         } catch (parseError) {
//           throw new Error("Generated text is not valid JSON.");
//         }
//       }
  
//       let resumeObj;
//       if (Array.isArray(finalResumeData)) {
//         if (finalResumeData.length === 0) {
//           throw new Error("Generated resume array is empty.");
//         }
//         resumeObj = finalResumeData[0];
//       } else if (typeof finalResumeData === "object" && finalResumeData !== null) {
//         resumeObj = finalResumeData;
//       } else {
//         throw new Error("Generated resume data is not in expected format.");
//       }
  
//       if (!resumeObj || typeof resumeObj !== "object") {
//         throw new Error("Parsed resume data is not a valid object.");
//       }
  
//       reset(resumeObj);
//       setData(resumeObj);
//       toast.success("Resume Generated Successfully!");
//       setShowFormUI(true);
//       setShowPromptInput(false);
//       setShowResumeUI(false);
//     } catch (error) {
//       toast.error(error.message || "Error Generating Resume!");
//     } finally {
//       setLoading(false);
//       setDescription("");
//     }
//   };

//   const handleClear = () => setDescription("");

//   const handleClearAll = () => {
//     if (window.confirm("Are you sure you want to clear all data and start over?")) {
//       localStorage.removeItem('resumeData');
//       localStorage.removeItem('currentView');
//       setData({
//         personalInformation: { fullName: "Durgesh Kumar Tiwari" },
//         summary: "",
//         skills: [],
//         experience: [],
//         education: [],
//         certifications: [],
//         projects: [],
//         languages: [],
//         interests: [],
//         achievements: []
//       });
//       setShowPromptInput(true);
//       setShowFormUI(false);
//       setShowResumeUI(false);
//       setDescription("");
//       toast.success("All data cleared successfully!");
//     }
//   };

//   const renderInput = (name, label, type = "text") => (
//     <motion.div 
//       className="form-control w-full mb-2"
//       whileHover={{ scale: 1.01 }}
//       transition={{ type: "spring", stiffness: 300 }}
//     >
//       <label className="label">
//         <span className="label-text">{label}</span>
//       </label>
//       <input 
//         type={type} 
//         {...register(name)} 
//         className="input input-bordered w-full focus:ring-2 focus:ring-accent" 
//       />
//     </motion.div>
//   );

//   const renderFieldArray = (fields, label, name, keys) => (
//     <motion.div 
//       className="form-control w-full mb-4 p-4 bg-base-100 rounded-xl shadow-sm"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//         <RiFilePaper2Line className="text-accent" /> {label}
//       </h3>
//       {fields.fields.map((field, index) => (
//         <motion.div 
//           key={field.id} 
//           className="p-4 bg-base-200 rounded-lg mb-4 shadow-inner"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           {keys.map((key) => (
//             <React.Fragment key={`${name}-${index}-${key}`}>
//               {renderInput(`${name}.${index}.${key}`, key)}
//             </React.Fragment>
//           ))}
//           <motion.button 
//             type="button" 
//             onClick={() => fields.remove(index)} 
//             className="btn btn-error btn-sm mt-2"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaTrash /> Remove
//           </motion.button>
//         </motion.div>
//       ))}
//       <motion.button
//         type="button"
//         onClick={() => fields.append(keys.reduce((acc, key) => ({ ...acc, [key]: "" }), {}))}
//         className="btn btn-secondary btn-sm mt-2"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <FaPlusCircle className="mr-1" /> Add {label}
//       </motion.button>
//     </motion.div>
//   );

//   // Scroll to top/bottom buttons
//   const ScrollButtons = () => {
//     const scrollToTop = () => {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const scrollToBottom = () => {
//       window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
//     };

//     return (
//       <div className="fixed right-6 bottom-6 flex flex-col gap-2 z-50">
//         <motion.button
//           onClick={scrollToTop}
//           className="btn btn-circle btn-sm btn-primary shadow-lg"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <FaArrowUp />
//         </motion.button>
//         <motion.button
//           onClick={scrollToBottom}
//           className="btn btn-circle btn-sm btn-primary shadow-lg"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <FaArrowDown />
//         </motion.button>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4">
//       <AnimatePresence mode="wait">
//         {showPromptInput && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//             className="bg-base-100 shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mt-10 relative overflow-hidden"
//           >
//             <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
//             <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
            
//             <motion.div 
//               className="flex flex-col items-center mb-8"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <div className="relative">
//                 <FaBrain className="text-5xl text-accent mb-2 z-10 relative" />
//                 <div className="absolute inset-0 bg-accent/20 rounded-full blur-md -z-10"></div>
//               </div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mt-2">
//                 Smart Resume Creator
//               </h1>
//               <p className="text-lg opacity-80 mt-2">
//                 Let AI craft your perfect resume from description
//               </p>
//             </motion.div>

//             <div className="relative mb-8 group">
//               <motion.textarea
//                 disabled={loading}
//                 className="textarea textarea-bordered w-full h-64 text-lg p-4 bg-base-200/50 backdrop-blur-sm border-2 border-base-300 focus:border-accent transition-all duration-300 rounded-xl"
//                 placeholder=" "
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//               <motion.label 
//                 className="absolute left-4 top-4 text-base-content/50 pointer-events-none transition-all duration-300 group-focus-within:-translate-y-7 group-focus-within:scale-90 group-focus-within:text-accent group-focus-within:bg-base-100 group-focus-within:px-2 group-focus-within:rounded-lg"
//               >
//                 Describe your skills, experience and achievements...
//               </motion.label>
//             </div>

//             <div className="flex justify-center gap-6">
//               <motion.button
//                 disabled={loading}
//                 onClick={handleGenerate}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn btn-primary btn-lg rounded-full px-8 shadow-lg flex items-center gap-3 relative overflow-hidden"
//               >
//                 {loading ? (
//                   <span className="loading loading-spinner"></span>
//                 ) : (
//                   <>
//                     <FaPaperPlane />
//                     <span>Generate Resume</span>
//                   </>
//                 )}
//               </motion.button>

//               <motion.button
//                 disabled={loading}
//                 onClick={handleClear}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn btn-outline btn-lg rounded-full px-8 flex items-center gap-3"
//               >
//                 <FaTrash />
//                 <span>Clear</span>
//               </motion.button>
//             </div>

//             {loading && (
//               <motion.div
//                 animate={{ 
//                   y: [0, -10, 0],
//                   rotate: [0, 5, -5, 0]
//                 }}
//                 transition={{ 
//                   repeat: Infinity, 
//                   duration: 2,
//                   ease: "easeInOut"
//                 }}
//                 className="absolute -bottom-8 right-8 text-6xl opacity-10"
//               >
//                 <RiFilePaper2Line />
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {showFormUI && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-6xl mx-auto p-6"
//         >
//           <div className="bg-base-100 rounded-2xl shadow-xl p-8">
//             <div className="flex justify-between items-center mb-8">
//               <h1 className="text-3xl font-bold flex items-center gap-3">
//                 <BiBook className="text-accent" /> Resume Builder
//               </h1>
//               <div className="flex gap-2">
//                 <motion.button
//                   onClick={() => {
//                     setShowPromptInput(false);
//                     setShowFormUI(false);
//                     setShowResumeUI(true);
//                   }}
//                   className="btn btn-accent"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <FaEdit className="mr-2" /> Preview Resume
//                 </motion.button>
//                 <motion.button
//                   onClick={handleClearAll}
//                   className="btn btn-error"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <FaTrash className="mr-2" /> Clear All
//                 </motion.button>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {renderInput("personalInformation.fullName", "Full Name")}
//                 {renderInput("personalInformation.email", "Email", "email")}
//                 {renderInput("personalInformation.phoneNumber", "Phone Number", "tel")}
//                 {renderInput("personalInformation.location", "Location")}
//                 {renderInput("personalInformation.linkedin", "LinkedIn", "url")}
//                 {renderInput("personalInformation.gitHub", "GitHub", "url")}
//                 {renderInput("personalInformation.portfolio", "Portfolio", "url")}
//               </div>

//               <motion.div 
//                 className="bg-base-200 p-6 rounded-xl"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <h3 className="text-xl font-semibold mb-4">Professional Summary</h3>
//                 <textarea 
//                   {...register("summary")} 
//                   className="textarea textarea-bordered w-full focus:ring-2 focus:ring-accent" 
//                   rows={4}
//                 />
//               </motion.div>

//               {renderFieldArray(skillsFields, "Skills", "skills", ["title", "level"])}
//               {renderFieldArray(experienceFields, "Work Experience", "experience", ["jobTitle", "company", "location", "duration", "description"])}
//               {renderFieldArray(educationFields, "Education", "education", ["degree", "university", "Marks", "location", "graduationYear"])}
//               {renderFieldArray(certificationsFields, "Certifications", "certifications", ["title", "issuingOrganization", "year"])}
//               {renderFieldArray(projectsFields, "Projects", "projects", ["title", "description", "technologiesUsed", "githubLink", "LiveLink"])}
//               {renderFieldArray(achievementsFields, "Achievements", "achievements", ["title", "description", "link"])}
//               {renderFieldArray(languagesFields, "Languages", "languages", ["name"])}
//               {renderFieldArray(interestsFields, "Interests", "interests", ["name"])}

//               <div className="flex justify-end gap-4 mt-8">
//                 <motion.button
//                   type="button"
//                   onClick={() => {
//                     setShowPromptInput(true);
//                     setShowFormUI(false);
//                     setShowResumeUI(false);
//                   }}
//                   className="btn btn-outline"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <FaSync className="mr-2" /> Start Over
//                 </motion.button>
//                 <motion.button
//                   type="submit"
//                   className="btn btn-primary"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   Save & Preview
//                 </motion.button>
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       )}

//       {showResumeUI && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-4xl mx-auto"
//         >
//           <Resume data={data} />
//           <div className="flex justify-center gap-4 mt-8">
//             <motion.button
//               onClick={() => {
//                 setShowPromptInput(false);
//                 setShowFormUI(true);
//                 setShowResumeUI(false);
//               }}
//               className="btn btn-accent"
//               whileHover={{ scale: 1.05 }}
//             >
//               <FaEdit className="mr-2" /> Edit Resume
//             </motion.button>
//             <motion.button
//               onClick={() => {
//                 setShowPromptInput(true);
//                 setShowFormUI(false);
//                 setShowResumeUI(false);
//               }}
//               className="btn btn-primary"
//               whileHover={{ scale: 1.05 }}
//             >
//               <FaSync className="mr-2" /> Create New
//             </motion.button>
//           </div>
//         </motion.div>
//       )}

//       <ScrollButtons />
//     </div>
//   );
// };

// export default GenerateResume;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  FaBrain, 
  FaTrash, 
  FaPaperPlane, 
  FaPlusCircle, 
  FaEdit, 
  FaSync, 
  FaQuestionCircle,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { generateResume } from "../api/ResumeService";
import { BiBook } from "react-icons/bi";
import { useForm, useFieldArray } from "react-hook-form";
import Resume from "../component/Resume";
import { motion, AnimatePresence } from "framer-motion";
import { RiFilePaper2Line } from "react-icons/ri";

const GenerateResume = () => {
  // Load data from localStorage or initialize with defaults
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('resumeData');
    return savedData ? JSON.parse(savedData) : {
      personalInformation: { fullName: "Durgesh Kumar Tiwari" },
      summary: "",
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      projects: [],
      languages: [],
      interests: [],
      achievements: []
    };
  });

  // View state management
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('currentView');
    return savedView || 'generate';
  });

  const [showPromptInput, setShowPromptInput] = useState(currentView === 'generate');
  const [showFormUI, setShowFormUI] = useState(currentView === 'form');
  const [showResumeUI, setShowResumeUI] = useState(currentView === 'resume');
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Help examples data
  const helpExamples = [
    {
      title: "Software Engineer Example",
      content: "I'm a full-stack developer with 5 years of experience specializing in React, Node.js, and MongoDB. At XYZ Corp, I led a team that built a customer portal that increased user engagement by 40%. I have a Bachelor's in Computer Science from ABC University. My skills include JavaScript, TypeScript, AWS, and CI/CD pipelines."
    },
    {
      title: "Marketing Professional Example",
      content: "Digital marketing specialist with 3 years of experience in SEO, content marketing, and social media strategy. Increased organic traffic by 120% at my current company through targeted SEO campaigns. Proficient in Google Analytics, SEMrush, and HubSpot. Strong copywriting skills with experience creating high-converting landing pages."
    },
    {
      title: "Project Manager Example",
      content: "Certified PMP with 7 years of experience managing IT projects in the healthcare sector. Successfully delivered 15+ projects on time and under budget using Agile methodologies. Expertise in JIRA, Scrum, and risk management. Strong leadership skills with experience managing cross-functional teams of up to 20 members."
    }
  ];

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(data));
    
    if (showPromptInput) {
      localStorage.setItem('currentView', 'generate');
    } else if (showFormUI) {
      localStorage.setItem('currentView', 'form');
    } else if (showResumeUI) {
      localStorage.setItem('currentView', 'resume');
    }
  }, [data, showPromptInput, showFormUI, showResumeUI]);

  const experienceFields = useFieldArray({ control, name: "experience" });
  const educationFields = useFieldArray({ control, name: "education" });
  const certificationsFields = useFieldArray({ control, name: "certifications" });
  const projectsFields = useFieldArray({ control, name: "projects" });
  const languagesFields = useFieldArray({ control, name: "languages" });
  const interestsFields = useFieldArray({ control, name: "interests" });
  const achievementsFields = useFieldArray({ control, name: "achievements" });
  const skillsFields = useFieldArray({ control, name: "skills" });

  const onSubmit = (formData) => {
    setData({ ...formData });
    setShowFormUI(false);
    setShowPromptInput(false);
    setShowResumeUI(true);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const responseData = await generateResume(description);
  
      if (!responseData) {
        throw new Error("API response is empty.");
      }
  
      let parsedResponse = responseData;
      if (typeof responseData === "string") {
        try {
          parsedResponse = JSON.parse(responseData);
        } catch (parseError) {
          console.error("Error parsing API response string:", parseError);
          throw new Error("API returned invalid JSON.");
        }
      }
  
      const candidate = parsedResponse?.candidates?.[0];
      if (!candidate?.content?.parts?.[0]?.text) {
        throw new Error("Candidate content parts are missing.");
      }
  
      const candidateText = candidate.content.parts[0].text;
  
      if (!candidateText) {
        throw new Error("Extracted text response is empty.");
      }
  
      let resumeData;
      try {
        resumeData = JSON.parse(candidateText);
      } catch (parseError) {
        throw new Error("AI response is not valid JSON. Try modifying the description.");
      }
  
      let finalResumeData = resumeData;
      if (resumeData?.generated_text) {
        try {
          finalResumeData = JSON.parse(resumeData.generated_text);
        } catch (parseError) {
          throw new Error("Generated text is not valid JSON.");
        }
      }
  
      let resumeObj;
      if (Array.isArray(finalResumeData)) {
        if (finalResumeData.length === 0) {
          throw new Error("Generated resume array is empty.");
        }
        resumeObj = finalResumeData[0];
      } else if (typeof finalResumeData === "object" && finalResumeData !== null) {
        resumeObj = finalResumeData;
      } else {
        throw new Error("Generated resume data is not in expected format.");
      }
  
      if (!resumeObj || typeof resumeObj !== "object") {
        throw new Error("Parsed resume data is not a valid object.");
      }
  
      reset(resumeObj);
      setData(resumeObj);
      toast.success("Resume Generated Successfully!");
      setShowFormUI(true);
      setShowPromptInput(false);
      setShowResumeUI(false);
    } catch (error) {
      toast.error(error.message || "Error Generating Resume!");
    } finally {
      setLoading(false);
      setDescription("");
    }
  };

  const handleClear = () => setDescription("");

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data and start over?")) {
      localStorage.removeItem('resumeData');
      localStorage.removeItem('currentView');
      setData({
        personalInformation: { fullName: "Durgesh Kumar Tiwari" },
        summary: "",
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        projects: [],
        languages: [],
        interests: [],
        achievements: []
      });
      setShowPromptInput(true);
      setShowFormUI(false);
      setShowResumeUI(false);
      setDescription("");
      toast.success("All data cleared successfully!");
    }
  };

  const renderInput = (name, label, type = "text") => (
    <motion.div 
      className="form-control w-full mb-2"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input 
        type={type} 
        {...register(name)} 
        className="input input-bordered w-full focus:ring-2 focus:ring-accent" 
      />
    </motion.div>
  );

  const renderFieldArray = (fields, label, name, keys) => (
    <motion.div 
      className="form-control w-full mb-4 p-4 bg-base-100 rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <RiFilePaper2Line className="text-accent" /> {label}
      </h3>
      {fields.fields.map((field, index) => (
        <motion.div 
          key={field.id} 
          className="p-4 bg-base-200 rounded-lg mb-4 shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {keys.map((key) => (
            <React.Fragment key={`${name}-${index}-${key}`}>
              {renderInput(`${name}.${index}.${key}`, key)}
            </React.Fragment>
          ))}
          <motion.button 
            type="button" 
            onClick={() => fields.remove(index)} 
            className="btn btn-error btn-sm mt-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash /> Remove
          </motion.button>
        </motion.div>
      ))}
      <motion.button
        type="button"
        onClick={() => fields.append(keys.reduce((acc, key) => ({ ...acc, [key]: "" }), {}))}
        className="btn btn-secondary btn-sm mt-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaPlusCircle className="mr-1" /> Add {label}
      </motion.button>
    </motion.div>
  );

  const HelpDialog = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowHelpDialog(false)}
    >
      <motion.div 
        className="bg-base-100 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary">How to Write a Good Description</h3>
          <button 
            onClick={() => setShowHelpDialog(false)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm mb-4">
            Provide a detailed description of your professional background, including:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
            <li>Your Personal details like name, address, email , phone-no</li>
            <li>Your job titles and years of experience or duration</li>
            <li>Key achievements and responsibilities</li>
            <li>Education and certifications</li>
            <li>Technical skills and tools you're proficient with</li>
            <li>Notable projects or accomplishments</li>
          </ul>
          <p className="text-sm">
            The more details you provide, the better your AI-generated resume will be!
          </p>
        </div>

        <h4 className="font-semibold mb-3">Example Descriptions:</h4>
        <div className="space-y-4">
          {helpExamples.map((example, index) => (
            <div key={index} className="bg-base-200 p-4 rounded-lg">
              <h5 className="font-medium text-accent mb-2">{example.title}</h5>
              <p className="text-sm">{example.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setShowHelpDialog(false)}
            className="btn btn-primary"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const HelpButton = () => {
    // Only show help button in generate view
    if (!showPromptInput) return null;
    
    return (
      <motion.button
        onClick={() => setShowHelpDialog(true)}
        className="fixed right-10 bottom-20 btn btn-circle btn-primary shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <FaQuestionCircle className="text-xxxl" />
        <span style={{color:"white"}}>Demo</span>
      </motion.button>
    );
  };

  const ScrollButtons = () => {
    // Only show scroll buttons in resume view
    if (!showFormUI) return null;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    return (
      <div className="fixed right-6 bottom-6 flex flex-col gap-2 z-50">
        <motion.button
          onClick={scrollToTop}
          className="btn btn-circle btn-sm btn-primary shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowUp />
        </motion.button>
        <motion.button
          onClick={scrollToBottom}
          className="btn btn-circle btn-sm btn-primary shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowDown />
        </motion.button>
      </div>
    );
  };

  return (
    <div className="mt-10 min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4">
      <HelpButton />
      {showHelpDialog && <HelpDialog />}
      <ScrollButtons />

      <AnimatePresence mode="wait">
        {showPromptInput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-base-100 shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mt-10 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
            
            <motion.div 
              className="flex flex-col items-center mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <FaBrain className="text-5xl text-accent mb-2 z-10 relative" />
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-md -z-10"></div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mt-2">
                Smart Resume Creator
              </h1>
              <p className="text-lg opacity-80 mt-2">
                Let AI craft your perfect resume from description
              </p>
            </motion.div>

            <div className="relative mb-8 group">
              <motion.textarea
                disabled={loading}
                className="textarea textarea-bordered w-full h-64 text-lg p-4 bg-base-200/50 backdrop-blur-sm border-2 border-base-300 focus:border-accent transition-all duration-300 rounded-xl"
                placeholder=" "
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <motion.label 
                className="absolute left-4 top-4 text-base-content/50 pointer-events-none transition-all duration-300 group-focus-within:-translate-y-7 group-focus-within:scale-90 group-focus-within:text-accent group-focus-within:bg-base-100 group-focus-within:px-2 group-focus-within:rounded-lg"
              >
                Describe your skills, experience and achievements...
              </motion.label>
            </div>

            <div className="flex justify-center gap-6">
              <motion.button
                disabled={loading}
                onClick={handleGenerate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-lg rounded-full px-8 shadow-lg flex items-center gap-3 relative overflow-hidden"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Generate Resume</span>
                  </>
                )}
              </motion.button>

              <motion.button
                disabled={loading}
                onClick={handleClear}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline btn-lg rounded-full px-8 flex items-center gap-3"
              >
                <FaTrash />
                <span>Clear</span>
              </motion.button>
            </div>

            {loading && (
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-8 right-8 text-6xl opacity-10"
              >
                <RiFilePaper2Line />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showFormUI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl mx-auto p-6"
        >
          <div className="bg-base-100 rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BiBook className="text-accent" /> Resume Builder
              </h1>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => {
                    setShowPromptInput(false);
                    setShowFormUI(false);
                    setShowResumeUI(true);
                  }}
                  className="btn btn-accent"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaEdit className="mr-2" /> Preview Resume
                </motion.button>
                <motion.button
                  onClick={handleClearAll}
                  className="btn btn-error"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaTrash className="mr-2" /> Clear All
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("personalInformation.fullName", "Full Name")}
                {renderInput("personalInformation.email", "Email", "email")}
                {renderInput("personalInformation.phoneNumber", "Phone Number", "tel")}
                {renderInput("personalInformation.location", "Location")}
                {renderInput("personalInformation.linkedin", "LinkedIn", "url")}
                {renderInput("personalInformation.gitHub", "GitHub", "url")}
                {renderInput("personalInformation.portfolio", "Portfolio", "url")}
              </div>

              <motion.div 
                className="bg-base-200 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-semibold mb-4">Professional Summary</h3>
                <textarea 
                  {...register("summary")} 
                  className="textarea textarea-bordered w-full focus:ring-2 focus:ring-accent" 
                  rows={4}
                />
              </motion.div>

              {renderFieldArray(skillsFields, "Skills", "skills", ["title", "level"])}
              {renderFieldArray(experienceFields, "Work Experience", "experience", ["jobTitle", "company", "location", "duration", "description"])}
              {renderFieldArray(educationFields, "Education", "education", ["degree", "university", "Marks", "location", "graduationYear"])}
              {renderFieldArray(certificationsFields, "Certifications", "certifications", ["title", "issuingOrganization", "year"])}
              {renderFieldArray(projectsFields, "Projects", "projects", ["title", "description", "technologiesUsed", "githubLink", "LiveLink"])}
              {renderFieldArray(achievementsFields, "Achievements", "achievements", ["title", "description", "link"])}
              {renderFieldArray(languagesFields, "Languages", "languages", ["name"])}
              {renderFieldArray(interestsFields, "Interests", "interests", ["name"])}

              <div className="flex justify-end gap-4 mt-8">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowPromptInput(true);
                    setShowFormUI(false);
                    setShowResumeUI(false);
                  }}
                  className="btn btn-outline"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaSync className="mr-2" /> Start Over
                </motion.button>
                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                >
                  Save & Preview
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {showResumeUI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl mx-auto"
        >
          <Resume data={data} />
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={() => {
                setShowPromptInput(false);
                setShowFormUI(true);
                setShowResumeUI(false);
              }}
              className="btn btn-accent"
              whileHover={{ scale: 1.05 }}
            >
              <FaEdit className="mr-2" /> Edit Resume
            </motion.button>
            <motion.button
              onClick={() => {
                setShowPromptInput(true);
                setShowFormUI(false);
                setShowResumeUI(false);
              }}
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
            >
              <FaSync className="mr-2" /> Create New
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GenerateResume;