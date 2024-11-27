import React, { useState, useEffect } from 'react';
import { getAllUsers, updateRole } from '../services/authService';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err.response?.data || err.message);
                setError('Failed to fetch users.');
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateRole(userId, newRole);
            setSuccessMessage('Role updated successfully!');
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ===
                'Access denied. Only the main admin can perform this action.'
                    ? 'Only the main admin has access to change roles.'
                    : 'Failed to update role.';
            console.error('Failed to update role:', err.response?.data || err.message);
            setError(errorMessage);
            setTimeout(() => setError(''), 3000); 
        }
    };

    return (
        <div className="admin-users-container">
            <h2>Manage Users</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.email !== 'admin@example.com' && (
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(user.id, e.target.value)
                                            }
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: '#555' }}>
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
