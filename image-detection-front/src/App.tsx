import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './screens/HomePage';
import AuthRedirectHandler from './components/AuthRedirectHandler';
import UploadPage from './screens/UploadPage';
import LoginComponent from './components/LoginComponent';
import SearchByTags from './components/SearchByTagsComponents';
import ThumbnailToImageResolver from './components/ThumbnailToImageResolver';
import TagManagementComponent from './components/TagManagementComponent'; 
import BulkImageDeleteComponent from './components/BulkImageDeleteComponent';
import TagSubscriptionComponent from './components/TagSubscriptionComponent';
import SearchByImageComponent from './components/SearchByImageComponent';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/html/main.html" element={<AuthRedirectHandler />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/search-by-tags" element={<SearchByTags />} />
          <Route path="/search-by-thumbnail" element={<ThumbnailToImageResolver />} />
          <Route path="/manage-tags" element={<TagManagementComponent />} />
          <Route path="/delete-images" element={<BulkImageDeleteComponent />} />
          <Route path='/tag-subscription' element={<TagSubscriptionComponent />} />
          <Route path='/search-by-image' element={<SearchByImageComponent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
