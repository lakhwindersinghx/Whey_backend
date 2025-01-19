import React, { useState } from 'react';
import { Button } from '../components/ui/button';

const UploadPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log('Uploading:', file.name);
      // TODO: Call backend API
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload Nutritional Label</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />
      <Button onClick={handleUpload}>Analyze</Button>
    </div>
  );
};

export default UploadPage;
