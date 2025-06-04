import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../theme/Navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><button onClick={() => handleNavigation('/')} className="nav-item">Home</button></li>
        <li><button onClick={() => handleNavigation('/upload')} className="nav-item">Upload Image</button></li>
        <li><button onClick={() => handleNavigation('/search-by-tags')} className="nav-item">Search by Tags</button></li>
        <li><button onClick={() => handleNavigation('/search-by-image')} className="nav-item">Search by Image</button></li>
        <li><button onClick={() => handleNavigation('/search-by-thumbnail')} className="nav-item">Search by Thumbnail URL</button></li>
        <li><button onClick={() => handleNavigation('/manage-tags')} className="nav-item">Manage Tags</button></li>
        <li><button onClick={() => handleNavigation('/delete-images')} className="nav-item">Delete Images</button></li>
        <li><button onClick={() => handleNavigation('/tag-subscription')} className="nav-item">Tag Subscription</button></li>
        {auth?.isLoggedIn ? (
          <li><button onClick={auth.logout} className="nav-item">Logout</button></li>
        ) : (
          <li><button onClick={() => handleNavigation('/login')} className="nav-item">Login</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
