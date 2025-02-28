import React from 'react';
import Image from 'next/image';

const Introduction: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Page Title */}
      <h1 style={styles.title}>Welcome to WheyBetter!</h1>

      {/* Overview Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>Overview</h2>
        <p style={styles.paragraph}>
          WheyBetter is a web application that helps you analyze and categorize 
          ingredients based on nutritional data. Below, you'll learn how to use 
          the main features, including uploading ingredient images, interpreting 
          the dashboard, and ensuring correct labeling.
        </p>
      </section>

      {/* How to Use Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>How to Use the App</h2>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            <strong>Upload an Image:</strong> Drag and drop an image of the 
            ingredient list or click on the upload area to select a file. 
            (See the “Protein Analysis Form” on the right side of the screen.)
          </li>
          <li style={styles.listItem}>
            <strong>Review Your Dashboard:</strong> Once the image is uploaded, 
            the app will process it and display:
            <ul style={styles.subList}>
              <li>Radial Chart Score</li>
              <li>Calorie/Nutrition Breakdown</li>
              <li>Ingredient Summary</li>
            </ul>
          </li>
          <li style={styles.listItem}>
            <strong>Check Labels &amp; Scores:</strong> Make sure each 
            ingredient is correctly identified. You can see acceptable labels below.
          </li>
        </ol>
      </section>

      {/* Acceptable/Unacceptable Labels Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>Acceptable Labels</h2>
        <p style={styles.paragraph}>
          Below are examples of the types of labels that the system can process 
          effectively.
        </p>
      
        <div style={styles.imageContainer}>
          <div style={styles.imageBox}>
            
            <Image
              src="/acceptable.png"
              alt="Acceptable label example"
              width={300}
              height={200}
              style={styles.image}
            />
          </div>
          <div style={styles.imageBox}>
  
            <Image
              src="/acceptablemtech.png"
              alt="Acceptable label example"
              width={300}
              height={200}
              style={styles.image}
            />
          </div>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>Troubleshooting</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            If you get an error when uploading an image, make sure the file 
            format is PNG or JPG.
          </li>
          <li style={styles.listItem}>
            Double-check that your ingredients text is clear and legible. 
            Blurry images might cause misclassifications.
          </li>
        </ul>
      </section>

      {/* Footer Note */}
      {/* <footer style={styles.footer}>
        <p style={styles.footerText}>
          Need more help? Contact support or visit our FAQ.
        </p>
      </footer> */}
    </div>
  );
};

// Inline styles for simplicity
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  section: {
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    color: '#444',
  },
  paragraph: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#555',
  },
  list: {
    marginLeft: '1.5rem',
    marginTop: '0.5rem',
  },
  listItem: {
    marginBottom: '0.75rem',
  },
  subList: {
    listStyle: 'disc',
    marginLeft: '1.5rem',
    marginTop: '0.5rem',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  imageBox: {
    flex: '1 1 300px',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },
  image: {
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  footer: {
    marginTop: '3rem',
    paddingTop: '1rem',
    borderTop: '1px solid #ddd',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#999',
  },
};

export default Introduction;
