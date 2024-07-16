import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiURL from '.././apiConfig';

const Home = () => {
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    axios.get(`${apiURL}/metabase_dashboard_react/`)
      .then(response => {
        setIframeUrl(response.data.iframe_url);
      })
      .catch(error => {
        console.error('Error fetching iframe URL:', error);
      });
  }, []);

  return (
    <div className="container-fluid">
          <div>
            {iframeUrl && (
              <iframe title="Metabase Dashboard" src={iframeUrl} width="100%" height="600" frameBorder="0"></iframe>
            )}
          </div>
    </div>
  );
}

export default Home;
