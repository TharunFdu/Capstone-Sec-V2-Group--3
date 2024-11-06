import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/authService';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    location: '',
  });
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState(''); 
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      fetchProfile(user.id);
    } else {
      setError('No user logged in');
    }
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const data = await getUserProfile(userId);
      setProfile(data);
      setNewName(data.name);
      setNewLocation(data.location); 
    } catch (err) {
      setError('Failed to fetch profile');
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = JSON.parse(localStorage.getItem('user'));

    if (oldPassword && !newPassword) {
      setError('Please enter a new password along with the old password.');
      return;
    } else if (!oldPassword && newPassword) {
      setError('Please enter your old password to update to a new password.');
      return;
    }

    try {
      const updatedProfile = await updateUserProfile(user.id, {
        name: newName,
        location: newLocation, 
        oldPassword,
        newPassword,
      });

      setProfile(updatedProfile.user);
      setSuccess('Profile updated successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update profile');
      }
      console.error(err);
    }
  };

  return (
    <div className="profile-management-wrapper">
      <div className="profile-form-container">
        <h3>Manage Profile</h3>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="profile-info">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Change Name:</label>
            <input
              type="text"
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter location"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
