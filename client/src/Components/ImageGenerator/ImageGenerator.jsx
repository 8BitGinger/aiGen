import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../../Components/Assets/aiPlaceholder.png';

const API_KEY = import.meta.env.VITE_API_KEY;

export const ImageGenerator = () => {
  const [image_url, setImage_url] = useState('/');
  const [loading, setLoading] = useState(false);
  let inputRef = useRef(null);

  const imageGenerator = async () => {
    if (inputRef.current.value === '') {
      return 0;
    }
    setLoading(true);
    const response = await fetch(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_KEY,
          'User-Agent': 'Chrome',
        },
        body: JSON.stringify({
          prompt: inputRef.current.value,
          n: 1,
          size: '512x512',
        }),
      }
    );
    let data = await response.json();
    let data_array = data.data;
    setImage_url(data_array[0].url);
    setLoading(false);
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
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
      <div className="search-box">
        <textarea
          className="search-input"
          type="text"
          ref={inputRef}
          placeholder="Describe What You Want to See!"
        />
        <div
          className={loading ? 'button-disabled' : 'generate-btn'}
          onClick={() => {
            imageGenerator();
          }}
        >
          Generate
        </div>
      </div>
    </div>
  );
};
