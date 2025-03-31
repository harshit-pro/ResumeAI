import { Document, Page, View, Text, StyleSheet, Font, PDFDownloadLink, Link } from '@react-pdf/renderer';
import { FaLinkedin } from "react-icons/fa6";

// Register fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: '/fonts/OpenSans-Regular.ttf' },
    { src: '/fonts/OpenSans-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Open Sans',
    fontSize: 10,
    lineHeight: 1.2,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerLeft: {
    width: '60%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  location: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 5,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  threeColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8, // Space between items
  },
  skillItem: {
    width: '32%', // 3 columns (100% / 3)
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLine: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  link: {
    color: 'blue',
    textDecoration: 'underline',
  },
});

const PDFResume = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{data.personalInformation?.fullName}</Text>
          <Text style={styles.location}>{data.personalInformation?.location}</Text>

          {/* Contact Information */}
          <View style={{ marginTop: 1 }}>
            {/* Email & Phone Row */}
            <View style={styles.contactLine}>
              <Text>{data.personalInformation?.email}</Text>
              <Text>{data.personalInformation?.phoneNumber}</Text>
            </View>
            {/* Links Row */}
            <View style={styles.contactLine}>
              <Text style={styles.link} src={data.personalInformation?.gitHub}>
                GitHub
              </Text>
              <Text style={styles.link} src={data.personalInformation?.portfolio}>
                Portfolio
              </Text>
              {data.personalInformation?.linkedin && (
                <><FaLinkedin size={12} color="#0077b5" />
                  <Text style={styles.link} src={data.personalInformation.linkedin}>
                    LinkedIn
                  </Text></>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Summary Section */}
      {data.summary && (
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>SUMMARY</Text>
          <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
            {data.summary}
          </Text>
        </View>
      )}

         {/* Professional Experience */}
{data.experience && data.experience.length > 0 && (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.sectionTitle}>EXPERIENCE</Text>
    {data.experience.map((exp, index) => (
      <View key={index} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
            {exp.jobTitle} | {exp.company}
          </Text>
          <Text style={{ color: '#718096', fontSize: 10 }}>
            {exp.duration}
          </Text>
        </View>
        <Text style={{ color: '#718096', fontSize: 10, marginBottom: 3 }}>
          {exp.location}
        </Text>
        {/* Show the full description under duration & location */}
        {exp.description && (
          <Text style={{ fontSize: 10, color: '#4A5568', marginTop: 2 }}>
            {Array.isArray(exp.description)
              ? exp.description.join(" ") // Join array elements into a single string
              : exp.description} {/* If string, display as is */}
          </Text>
        )}
      </View>
    ))}
  </View>
)}

       {/* Education */}
       {data.education && data.education.length > 0 && (
        <View style={{ marginBottom: 4 }}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              {/* Degree Name on Left & University + Location on Right */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold' }}>{edu.degree}</Text>
                <Text style={{ textAlign: 'right', color: '#718096' }}>
                  {edu.university}, {edu.location}
                </Text>
              </View>
              {/* Marks & Graduation Year Below on Right */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Text style={{ textAlign: 'right', color: '#718096' }}>
                  Marks: {edu.Marks} | Graduated: {edu.graduationYear}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Technical Skills for PDF Resume */}
      {data.skills && data.skills.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 5
          }}>
            {data.skills.map((skill, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f3f4f6' : '#e5e7eb',
                  paddingVertical: 2,
                  paddingHorizontal: 4,
                  borderRadius: 5,
                  marginRight: 2,
                  marginBottom: 2,
                }}
              >
                <Text style={{ fontSize: 10 }}>{skill.title}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
   

      {/* Project Experience */}
      {data.projects && data.projects.length > 0 && (
        <View style={{ marginBottom: 5 }}>
          <Text style={styles.sectionTitle}>PROJECTS</Text>
          {data.projects.map((project, index) => (
            <View key={index} style={{ marginBottom: 6 }}>
              {/* Project Title and Links in Row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{project.title}</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {project.githubLink && (
                    <Link
                      src={project.githubLink}
                      style={{ color: '#4299e1', fontSize: 10, textDecoration: 'underline' }}
                    >
                      GitHub
                    </Link>
                  )}
                  {project.LiveLink && (
                    <Link
                      src={project.LiveLink}
                      style={{ color: '#4299e1', fontSize: 10, textDecoration: 'underline' }}
                    >
                      Live Link
                    </Link>
                  )}
                </View>
              </View>

              {/* Technologies Used */}
              <Text style={{ color: '#718096', fontSize: 10, marginTop: 3 }}>
                {Array.isArray(project.technologiesUsed)
                  ? project.technologiesUsed.join(' • ')
                  : project.technologiesUsed}
              </Text>

              {/* Project Description */}
              <View style={{ marginLeft: 10 }}>
                {project.description.split('\n').map((line, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <Text style={{ marginRight: 5 }}>•</Text>
                    <Text>{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

     
      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <View style={{ marginBottom: 6 }}>
          <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
          {data.certifications.map((cert, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{cert.title}</Text>
              <Text style={{ fontSize: 10 }}>{cert.issuingOrganization}</Text>
              <Text style={{ fontSize: 10, color: '#718096' }}>Year: {cert.year}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Achievements Section */}
{data.achievements && data.achievements.length > 0 && (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
    {data.achievements.map((achievement, index) => (
      <View key={index} style={{ marginBottom: 10 }}>
        {/* Title on the Left */}
        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{achievement.title}</Text>
        {/* Description on the Left */}
        {achievement.description && (
          <Text style={{ fontSize: 10, color: '#4A5568', marginTop: 2 }}>
            {achievement.description}
          </Text>
        )}
        {/* Link on the Right */}
        {achievement.link && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Link
              src={achievement.link}
              style={{ fontSize: 10, color: '#4299e1', textDecoration: 'underline' }}
            >
              View Achievement
            </Link>
          </View>
        )}
      </View>
    ))}
  </View>
)}


      {/* Languages and Interests Side by Side */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        {/* Languages Section (Left Side) */}
        {data.languages && data.languages.length > 0 && (
          <View style={{ width: '48%' }}>
            <Text style={styles.sectionTitle}>LANGUAGES</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {data.languages.map((lang, index) => (
                <Text key={index} style={{
                  backgroundColor: '#e2e8f0',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  fontSize: 10
                }}>
                  {lang.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Interests Section (Right Side) */}
        {data.interests && data.interests.length > 0 && (
          <View style={{ width: '48%', alignItems: 'flex-end' }}>
            <Text style={styles.sectionTitle}>INTERESTS</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {data.interests.map((interest, index) => (
                <Text key={index} style={{
                  backgroundColor: '#e2e8f0',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  fontSize: 10
                }}>
                  {interest.name}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>

    </Page>
  </Document>
);

export const PDFDownloadButton = ({ data }) => {
  if (!data || !data.personalInformation) {
    return (
      <button className="btn btn-disabled text-xs px-3 py-1">
        No Resume Data Available
      </button>
    );
  }

  return (
    <PDFDownloadLink
      target="_blank"
      document={<PDFResume data={data} />}
      fileName={`${data.personalInformation.fullName.replace(/\s+/g, '_')}_resume.pdf`}
    >
      {({ loading, error }) => {
        if (error) {
          console.error('PDF Generation Error:', error);
          return (
            <button className="btn btn-error text-xs px-3 py-1">
              Error Generating PDF
            </button>
          );
        }
        return (
          <button
            className="btn btn-primary text-xs px-3 py-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Generating PDF...
              </>
            ) : (
              'Download Professional PDF'
            )}
          </button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default PDFResume;
