import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../../Components/Assets/aiGenRobot.png';


const API_KEY = import.meta.env.VITE_API_KEY;

 const ImageGenerator = () => {
  const [image_url, setImage_url] = useState('/');
  const [loading, setLoading] = useState(false);
  let inputRef = useRef(null); // Initialize inputRef to null or the current value
  // Ensure inputRef is initialized properly


  // Make sure API_KEY is defined here or imported
  // For example, if it's an environment variable (replace with your actual env var name)

  const imageGenerator = async () => {
  // ...
  const promptValue = inputRef.current.value.trim();

  if (promptValue === '') {
    alert('Please enter a prompt for the image.');
    setLoading(false);
    return;
  }

  console.log("Sending prompt:", promptValue); // Add this line

  try {
    const response = await fetch(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-2',
          prompt: promptValue, // Use the trimmed value
          n: 1,
          size: '512x512',
        }),
      }
    );

      let data = await response.json();
      console.log(data);

      if (!response.ok) {
        console.error('API Error:', data.error);
        alert(`Error: ${data.error ? data.error.message : 'Unknown API error'}`);
        setImage_url('/');
        setLoading(false);
        return;
      }

      if (data.data && data.data.length > 0 && data.data[0].url) {
        setImage_url(data.data[0].url);
      } else {
        alert('Could not retrieve image URL from response.');
        setImage_url('/');
      }

    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to connect to the image generation service.');
      setImage_url('/');
    } finally {
      setLoading(false);
    }
  };
  

  // ... rest of your component's JSX and other code





  return (
    <div className="ai-image-generator">
      <div className="column">
        <div className="header">
          AI <span>Image Generator</span>
        </div>
        <div className="search-box">
          <textarea
            className="search-input"
            type="text"
            ref={inputRef}
            placeholder="Describe What You Want to See!"
          />
          <div
            className={loading ? null : 'generate-btn'}
            onClick={() => {
              imageGenerator();
            }}
          >
            Generate
          </div>
        </div>
      </div>
      <div className="img-loading">
        <div className="image">
          <img
            src={image_url === '/' ? default_image : image_url}
            alt="placeholder"
          />
        </div>
        <div className="loading">
          <div className={loading ? 'loading-bar-full' : 'loading-bar'}></div>
          <div className={loading ? 'loading-text' : 'display-none'}>
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
};


export default ImageGenerator;