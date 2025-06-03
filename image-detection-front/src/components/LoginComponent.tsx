import React from 'react';

const LoginComponent: React.FC = () => {

  const handleLoginGoogle = () => {
    const loginUri = `https://logingoogle.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=3u8casf37q83em6i30q67sr08p&response_type=token&scope=email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhtml%2Fmain.html`;
    window.location.href = loginUri;
  };
  const handleLoginLocal = () => {
    window.location.href = "https://5225-assign3.auth.us-east-1.amazoncognito.com/login?client_id=40rohq4k8tr24hsukltsg4g65s&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhtml%2Fmain.html";
  };



  return (
    <div className='centered-container'>
      <h2>Click Button to Login or Sign Up</h2>
      <button className="centered-button" onClick={handleLoginLocal}>Local Login</button>
      <button className="centered-button" onClick={handleLoginGoogle}>Login with Google</button>
    </div>
  );
};

export default LoginComponent;