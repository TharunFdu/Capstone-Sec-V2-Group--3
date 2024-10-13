import React, { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, getVenues } from '../services/authService'; 
import './EventManagement.css';
import Navbar from './Navbar';

const EventManagement = ({ isAdmin }) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]); 
  const [newEvent, setNewEvent] = useState({ title: '', venueId: '', date: '', time: '', capacity: '', image: null });  
  const [editingEvent, setEditingEvent] = useState(null); 
  const adminId = JSON.parse(localStorage.getItem('user')).id;

  useEffect(() => {
    loadEvents();
    loadVenues(); 
  }, []);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const loadVenues = async () => {
    const data = await getVenues();
    setVenues(data);
  };

  const handleFileChange = (e) => {
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, image: e.target.files[0] });
    } else {
      setNewEvent({ ...newEvent, image: e.target.files[0] });
    }
  };

  const handleCreate = async () => {
    const selectedVenue = venues.find(venue => venue.id === parseInt(newEvent.venueId)); 
    if (selectedVenue && parseInt(newEvent.capacity) > selectedVenue.capacity) {
      alert(`Event capacity cannot exceed venue capacity (${selectedVenue.capacity}).`);
      return;
    }

    const formData = new FormData();
    formData.append('title', newEvent.title);
    formData.append('venueId', newEvent.venueId);
    formData.append('date', newEvent.date);
    formData.append('time', newEvent.time);
    formData.append('capacity', newEvent.capacity);
    if (newEvent.image) {
      formData.append('image', newEvent.image);  
    }

    await createEvent(formData);
    setNewEvent({ title: '', venueId: '', date: '', time: '', capacity: '', image: null });
    loadEvents();
  };

  const handleEdit = (event) => {
    if (event.createdBy !== adminId) {
      alert('You can only edit events that you created.');
      return;
    }
    setEditingEvent(event);  
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('title', editingEvent.title);
    formData.append('venueId', editingEvent.venueId);
    formData.append('date', editingEvent.date);
    formData.append('time', editingEvent.time);
    formData.append('capacity', editingEvent.capacity);
    if (editingEvent.image) {
      formData.append('image', editingEvent.image);  
    }

    await updateEvent(editingEvent.id, formData);
    setEditingEvent(null);  
    loadEvents();
  };

  const handleDelete = async (id, createdBy) => {
    if (createdBy !== adminId) {
      alert('You can only delete events that you created.');
      return;
    }
    await deleteEvent(id);
    loadEvents();
  };

  return (
    <div>
      <Navbar />
      <div className="event-management-wrapper">
        {isAdmin && (
          <div className="event-form-container">
            <h3>{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
            <div className="event-form">
              <input
                type="text"
                placeholder="Title"
                value={editingEvent ? editingEvent.title : newEvent.title}
                onChange={(e) =>
                  editingEvent
                    ? setEditingEvent({ ...editingEvent, title: e.target.value })
                    : setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="form-input"
              />
              <select
                value={editingEvent ? editingEvent.venueId : newEvent.venueId}
                onChange={(e) =>
                  editingEvent
                    ? setEditingEvent({ ...editingEvent, venueId: e.target.value })
                    : setNewEvent({ ...newEvent, venueId: e.target.value })
                }
                className="form-input"
              >
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} (Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={editingEvent ? editingEvent.date : newEvent.date}
                onChange={(e) =>
                  editingEvent
                    ? setEditingEvent({ ...editingEvent, date: e.target.value })
                    : setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="form-input"
              />
              <input
                type="time"
                value={editingEvent ? editingEvent.time : newEvent.time}
                onChange={(e) =>
                  editingEvent
                    ? setEditingEvent({ ...editingEvent, time: e.target.value })
                    : setNewEvent({ ...newEvent, time: e.target.value })
                }
                className="form-input"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={editingEvent ? editingEvent.capacity : newEvent.capacity}
                onChange={(e) =>
                  editingEvent
                    ? setEditingEvent({ ...editingEvent, capacity: e.target.value })
                    : setNewEvent({ ...newEvent, capacity: e.target.value })
                }
                className="form-input"
              />
              <input
                type="file"
                onChange={handleFileChange}  
                className="form-input"
              />
              <button className="submit-button" onClick={editingEvent ? handleUpdate : handleCreate}>
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        )}

        <div className="event-list-container">
          <ul className="event-list">
            {events.map(event => (
              <li key={event.id}>
                {event.title} - {event.date} - {event.capacity}
                {isAdmin && (
                  <div className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(event)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(event.id, event.createdBy)}>Delete</button>
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

export default EventManagement;
