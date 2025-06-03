import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchByTags: React.FC = () => {
  const [tags, setTags] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [idToken, setIdToken] = useState<string>('');

  // Load credentials from localStorage upon component mount
  useEffect(() => {
    const token = localStorage.getItem('idToken') || '';
    setIdToken(token);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setImages([]); // Clear previous images before a new search
    setSearchPerformed(false); // Set searchPerformed to false initially

    const apiEndpoint = 'https://0t3uu35ju6.execute-api.us-east-1.amazonaws.com/dev/query/queryByTags';
    const processedTags = tags.split(',').map(tag => tag.trim());

    try {
      const response = await axios.post(apiEndpoint, { tags: processedTags }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.data.links && response.data.links.length > 0) {
        setImages(response.data.links);
      }
      setSearchPerformed(true); // Set searchPerformed to true only after the search is completed
    } catch (error: any) {
      setError('Failed to fetch images: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Images by Tags</h1>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Enter tags separated by commas"
        style={{ width: '100%' }}
      />
      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '20px' }}>
        <h2>Results</h2>
        {searchPerformed && !error && images.length === 0 ? (
          <p>No images found. Try different tags!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px' }}>
            {images.map((image, index) => (
              <a key={index} href={image} target="_blank" rel="noopener noreferrer" style={{ background: '#f0f0f0', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                Image Link {index + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchByTags;
