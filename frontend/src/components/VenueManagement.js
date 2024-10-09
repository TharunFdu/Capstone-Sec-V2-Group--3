import React, { useState, useEffect } from 'react';
import { getVenues, createVenue, updateVenue, deleteVenue } from '../services/authService';
import './VenueManagement.css';  
import Navbar from './Navbar';   

const VenueManagement = ({ isAdmin }) => {
  const [venues, setVenues] = useState([]);
  const [newVenue, setNewVenue] = useState({ name: '', location: '', capacity: '' });
  const [editingVenue, setEditingVenue] = useState(null);
  const adminId = JSON.parse(localStorage.getItem('user')).id; 

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    const data = await getVenues();
    setVenues(data);
  };

  const handleCreate = async () => {
    await createVenue(newVenue);
    setNewVenue({ name: '', location: '', capacity: '' });
    loadVenues();
  };

  const handleDelete = async (id, createdBy) => {
    if (createdBy !== adminId) {
      alert('You can only delete venues that you created.');
      return;
    }
    await deleteVenue(id);
    loadVenues();
  };

  const handleEdit = (venue) => {
    if (venue.createdBy !== adminId) {
      alert('You can only edit venues that you created.');
      return;
    }
    setEditingVenue(venue);
  };

  const handleUpdate = async () => {
    await updateVenue(editingVenue.id, editingVenue);
    setEditingVenue(null);
    loadVenues();
  };

  return (
    <div>
      <Navbar />
      <div className="venue-management-container">
        <div className="venue-form">
          {isAdmin && (
            <>
              <h3>{editingVenue ? 'Edit Venue' : 'Create Venue'}</h3>
              <input
                type="text"
                placeholder="Name"
                value={editingVenue ? editingVenue.name : newVenue.name}
                onChange={(e) =>
                  editingVenue
                    ? setEditingVenue({ ...editingVenue, name: e.target.value })
                    : setNewVenue({ ...newVenue, name: e.target.value })
                }
                className="form-input"
              />
              <input
                type="text"
                placeholder="Location"
                value={editingVenue ? editingVenue.location : newVenue.location}
                onChange={(e) =>
                  editingVenue
                    ? setEditingVenue({ ...editingVenue, location: e.target.value })
                    : setNewVenue({ ...newVenue, location: e.target.value })
                }
                className="form-input"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={editingVenue ? editingVenue.capacity : newVenue.capacity}
                onChange={(e) =>
                  editingVenue
                    ? setEditingVenue({ ...editingVenue, capacity: e.target.value })
                    : setNewVenue({ ...newVenue, capacity: e.target.value })
                }
                className="form-input"
              />
              <button className="submit-button" onClick={editingVenue ? handleUpdate : handleCreate}>
                {editingVenue ? 'Update Venue' : 'Create Venue'}
              </button>
            </>
          )}
        </div>

        <div className="venue-list-container">
          <h2>Venues</h2>
          <ul className="venue-list">
            {venues.map(venue => (
              <li key={venue.id}>
                {venue.name} - {venue.location} - {venue.capacity}
                {isAdmin && (
                  <div className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(venue)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(venue.id, venue.createdBy)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VenueManagement;
