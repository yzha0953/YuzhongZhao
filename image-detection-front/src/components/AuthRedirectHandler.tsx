import React from 'react';
import { useNavigate } from 'react-router-dom';

interface JWTInfo {
  'cognito:username': string;
  email: string;
}

// Immediately run outside of component function to avoid reruns on component re-renders
const hash = window.location.hash;
const hashParams = new URLSearchParams(hash.substring(1));
const idToken = hashParams.get('id_token');
const accessToken = hashParams.get('access_token');
const jwtInfo = idToken ? parseJwt(idToken) : null;

function parseJwt(token: string): JWTInfo {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

console.log('ID Token:', idToken);
console.log('Access Token:', accessToken);
console.log('JWT Info:', jwtInfo);
const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (idToken && accessToken && jwtInfo) {
      localStorage.setItem('username', jwtInfo['cognito:username'] || 'default_username');
      localStorage.setItem('email', jwtInfo.email || 'default_email');
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('accessToken', accessToken);
      console.log('JWT Info:', jwtInfo);
      console.log('username:', localStorage.getItem('username'));

      // Clear the hash to avoid redirection loop and navigate to home
      window.location.hash = '';
      navigate('/', { replace: true });
    } else {
      console.error('No ID Token or Access Token found.');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default AuthRedirectHandler;
