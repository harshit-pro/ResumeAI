// import { FaGithub, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
// import { PDFDownloadButton } from "./PDFResume";
// import { PiReadCvLogoFill } from "react-icons/pi";
// import './Resume.css';

// const Resume = ({ data }) => {


//   return (
//     <div className="colo max-w-3xl mx-auto shadow-lg rounded p-4 space-y-1 bg-base-100 text-base-content border border-gray-200 dark:border-gray-700">
//       {/* Header Section */}
//       <div className="text-center space-y-1">
//         <h1 className="text-2xl font-bold text-primary">
//           {data.personalInformation?.fullName || "Your Name"}
//         </h1>
//         <p className="text-sm text-gray-900">
//           {data.personalInformation?.location || "Location not specified"}
//         </p>
//         <div className="flex justify-center space-x-2 mt-1">
//           {data.personalInformation?.email && (
//             <a
//               href={`mailto:${data.personalInformation.email}`}
//               className="flex items-center text-secondary hover:underline text-xs"
//             >
//               <FaEnvelope className="mr-1" /> {data.personalInformation.email}
//             </a>
//           )}
//           {data.personalInformation?.phoneNumber && (
//             <p className="flex items-center text-gray-900 text-xs">
//               <FaPhone className="mr-1" /> {data.personalInformation.phoneNumber}
//             </p>
//           )}
//         </div>
//         <div className="flex justify-center space-x-2 mt-1">
//           {data.personalInformation?.gitHub && (
//             <a
//               href={data.personalInformation.gitHub}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center text-gray-900 hover:text-gray-700 text-xs"
//             >
//               <FaGithub className="mr-1" /> GitHub
//             </a>
//           )}
//           {data.personalInformation?.linkedIn && (
//             <a
//               href={data.personalInformation.linkedIn}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center text-blue-500 hover:text-blue-700 text-xs"
//             >
//               <FaLinkedin className="mr-1" /> LinkedIn
//             </a>
//           )}
//           {data.personalInformation?.portfolio && (
//             <a
//               href={data.personalInformation.portfolio}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center text-blue-500 hover:text-blue-700 text-xs"
//             >
//               <PiReadCvLogoFill className="mr-1" />Portfolio
//             </a>
//           )}
//         </div>
//       </div>

//       <div className="divider my-2"></div>

//       {/* Summary Section */}
//       {data.summary && (
//         <section>
//           <h2 className="text-xl font-semibold text-secondary">Summary</h2>
//           <p className="text-xs text-gray-700 dark:text-gray-300">
//             {data.summary}
//           </p>
//         </section>
//       )}

//       <div className="divider my-2"></div>

//       {/* Skills Section */}
//       {data.skills && data.skills.length > 0 && (
//         <section className="skills-section">
//           <h2 className="text-xl font-semibold text-secondary mt-0 mb-2">Skills</h2>
//           <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
//             {data.skills.map((skill, index) => (
//               <div
//                 key={index}
//                 className={`p-1 text-xs text-center rounded-md ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
//                   }`}
//               >
//                 {skill.title}
//               </div>
//             ))}
//           </div>
//         </section>
//       )}
    

//       <div className="divider my-2"></div>

//       {/* Projects Section */}
//       {data.projects && data.projects.length > 0 && (
//         <section>
//           <h2 className="text-xl font-semibold text-secondary">Projects</h2>
//           {data.projects.map((proj, index) => (
//             <div
//               key={index}
//               className="mb-2 p-2 rounded shadow-sm bg-base-200 border border-gray-300 dark:border-gray-700"
//             >
//               <h3 className="text-lg font-bold">{proj.title}</h3>
//               <p className="text-xs text-gray-600 dark:text-gray-300">{proj.description}</p>
//               <p className="text-xs text-gray-500 mt-2">
//                 🛠 Technologies:{" "}
//                 {Array.isArray(proj.technologiesUsed)
//                   ? proj.technologiesUsed.join(", ")
//                   : proj.technologiesUsed || ""}
//               </p>
//             </div>
//           ))}
//         </section>
//       )}

//        <div className="divider my-2"></div>
//       {/* Experience Section */}
//       {data.experience && data.experience.length > 0 && (
//         <section>
//           <h2 className="text-xl font-semibold text-secondary">Experience</h2>
//           {data.experience.map((exp, index) => (
//             <div
//               key={index}
//               className="mb-2 p-2 rounded shadow-sm bg-base-200 border border-gray-300 dark:border-gray-700"
//             >
//               <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
//               <p className="text-xs text-gray-500">{exp.company}, {exp.location}</p>
//               <p className="text-xs text-gray-400">🗓 {exp.duration}</p>
//               <p className="text-xs text-gray-600 dark:text-gray-300">{exp.description}</p>
//             </div>
//           ))}
//         </section>
//       )}



//       <div className="divider my-2"></div>

//       {/* Education Section */}
//       {data.education && data.education.length > 0 && (
//         <section>
//           <h2 className="text-xl font-semibold text-secondary">Education</h2>
//           {data.education.map((edu, index) => (
//             <div
//               key={index}
//               className="mb-2 p-2 rounded shadow-sm bg-base-200 border border-gray-300 dark:border-gray-700"
//             >
//               <h3 className="text-lg font-bold">{edu.degree}</h3>
//               <p className="text-xs text-gray-500">
//                 {edu.university}, {edu.location}
//               </p>
//               <p className="text-xs text-gray-500">
//                 Marks: {edu.Marks}
//               </p>
//               <p className="text-xs text-gray-400">🎓 Graduation Year: {edu.graduationYear}</p>
//             </div>
//           ))}
//         </section>
//       )}

//       <div className="divider my-2"></div>

//       {/* Certifications Section */}
//       {data.certifications && data.certifications.length > 0 && (
//         <section>
//           <h2 className="text-xl font-semibold text-secondary">Certifications</h2>
//           {data.certifications.map((cert, index) => (
//             <div
//               key={index}
//               className="mb-2 p-2 rounded shadow-sm bg-base-200 border border-gray-300 dark:border-gray-700"
//             >
//               <h3 className="text-lg font-bold">{cert.title}</h3>
//               <p className="text-xs text-gray-500">{cert.issuer}</p>
//               <p className="text-xs text-gray-400">{cert.year}</p>
//             </div>
//           ))}
//         </section>
//       )}
//       <div className="divider my-2"></div>

//       {/* Achievements Section */}
//       {data.achievements && data.achievements.length > 0 && (
//         <section>
//           <h2 className="text-xl font-semibold text-secondary">Achievements</h2>
//           {data.achievements.map((achievement, index) => (
//             <div
//               key={index}
//               className="mb-2 p-2 rounded shadow-sm bg-base-200 border border-gray-300 dark:border-gray-700"
//             >
//               <h3 className="text-lg font-bold">{achievement.title}</h3>
//               <p className="text-xs text-gray-500">{achievement.description}</p>
//               <p className="text-xs text-gray-400">{achievement.link}</p>
//             </div>
//           ))}
//         </section>
//       )}
//       <div className="divider my-2"></div>

//       {/* Languages Section */}
//       {data.languages && data.languages.length > 0 && (
//         <section>
//           <h2 className="text-xl font-semibold text-secondary">Languages</h2>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {data.languages.map((lang, index) => (
//               <span key={index} className="badge badge-outline badge-sm">
//                 {lang.name}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}


//       <div className="divider my-2"></div>

//       {/* Interests Section */}
//       {data.interests && data.interests.length > 0 && (
//         <section>
//           <h2 className="text-xl font-semibold text-secondary">Interests</h2>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {data.interests.map((interest, index) => (
//               <span key={index} className="badge badge-outline badge-sm">
//                 {interest.name}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       <section className="flex justify-center mt-4">
//         <PDFDownloadButton data={data} />
//       </section>
//     </div>
//   );
// };

// export default Resume;

import { FaGithub, FaLinkedin, FaPhone, FaEnvelope, FaExternalLinkAlt } from "react-icons/fa";
import { PiReadCvLogoFill } from "react-icons/pi";
import { PDFDownloadButton } from "./PDFResume";
import './Resume.css';

const Resume = ({ data }) => {
  return (
    <div className="resume-container max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-800">
      {/* Compact Header */}
      <div className="header-section flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {data.personalInformation?.fullName || "Your Name"}
          </h1>
          <p className="text-xs text-gray-500">
            {data.personalInformation?.location || "Location"}
          </p>
        </div>
        
        <div className="contact-info flex flex-wrap gap-2 text-xs">
          {data.personalInformation?.email && (
            <a href={`mailto:${data.personalInformation.email}`} className="flex items-center gap-1 hover:text-blue-600">
              <FaEnvelope size={12} />
            </a>
          )}
          {data.personalInformation?.phoneNumber && (
            <a href={`tel:${data.personalInformation.phoneNumber}`} className="flex items-center gap-1 hover:text-blue-600">
              <FaPhone size={12} />
            </a>
          )}
          {data.personalInformation?.gitHub && (
            <a href={data.personalInformation.gitHub} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
              <FaGithub size={12} />
            </a>
          )}
          {data.personalInformation?.linkedIn && (
            <a href={data.personalInformation.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
              <FaLinkedin size={12} />
            </a>
          )}
          {data.personalInformation?.portfolio && (
            <a href={data.personalInformation.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
              <PiReadCvLogoFill size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Summary - Single line if possible */}
      {data.summary && (
        <div className="summary-section mb-4">
          <p className="text-xs text-gray-700 line-clamp-2">{data.summary}</p>
        </div>
      )}

      {/* Skills - Compact chips */}
      {data.skills?.length > 0 && (
        <div className="skills-section mb-4">
          <h2 className="section-title text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((skill, index) => (
              <span key={index} className="skill-chip px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                {skill.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience - Compact timeline */}
      {data.experience?.length > 0 && (
        <div className="experience-section mb-4">
          <h2 className="section-title text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Experience</h2>
          <div className="space-y-2">
            {data.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium">{exp.jobTitle}</h3>
                  <span className="text-xs text-gray-500">{exp.duration}</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600">{exp.company}, {exp.location}</p>
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education - Compact format */}
      {data.education?.length > 0 && (
        <div className="education-section mb-4">
          <h2 className="section-title text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Education</h2>
          <div className="space-y-1">
            {data.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{edu.degree}</h3>
                  <span className="text-xs text-gray-500">{edu.graduationYear}</span>
                </div>
                <p className="text-xs text-gray-600">{edu.university}</p>
                {edu.Marks && (
                  <p className="text-xs text-gray-500">Marks: {edu.Marks}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects - Compact cards */}
      {data.projects?.length > 0 && (
        <div className="projects-section mb-4">
          <h2 className="section-title text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Projects</h2>
          <div className="grid grid-cols-1 gap-2">
            {data.projects.map((proj, index) => (
              <div key={index} className="project-card p-2 border border-gray-100 rounded">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{proj.title}</h3>
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-0.5">
                      <FaExternalLinkAlt size={10} />
                    </a>
                  )}
                </div>
                {proj.technologiesUsed && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {Array.isArray(proj.technologiesUsed) 
                      ? proj.technologiesUsed.slice(0, 3).join(", ") 
                      : proj.technologiesUsed}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications - Single line */}
      {data.certifications?.length > 0 && (
        <div className="certifications-section mb-4">
          <h2 className="section-title text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Certifications</h2>
          <div className="space-y-1">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between">
                <p className="text-xs">{cert.title}</p>
                <span className="text-xs text-gray-500">{cert.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages & Interests - Combined in one row */}
      {(data.languages?.length > 0 || data.interests?.length > 0) && (
        <div className="misc-section flex flex-wrap gap-4 mb-4">
          {data.languages?.length > 0 && (
            <div>
              <h2 className="section-title text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Languages</h2>
              <div className="flex flex-wrap gap-1">
                {data.languages.map((lang, index) => (
                  <span key={index} className="text-xs">{lang.name}</span>
                ))}
              </div>
            </div>
          )}
          
          {data.interests?.length > 0 && (
            <div>
              <h2 className="section-title text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Interests</h2>
              <div className="flex flex-wrap gap-1">
                {data.interests.map((interest, index) => (
                  <span key={index} className="text-xs">{interest.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Download Button - Small and centered */}
      <div className="flex justify-center mt-4">
        <PDFDownloadButton data={data} className="text-xs py-1 px-3" />
      </div>
    </div>
  );
};

export default Resume;