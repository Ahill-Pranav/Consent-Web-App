import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // We'll need a backend endpoint for this. I'll add /api/auth/users later if it doesn't exist.
            // For now, I'll assume it exists or I'll add it.
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This will also delete their associations.")) {
            try {
                await api.delete(`/auth/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Error deleting user.");
            }
        }
    };

    if (loading) return <div className="p-20 text-center text-text-muted">Loading users...</div>;

    return (
        <div className="reveal">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-forest-dark">User Management</h2>
                <div className="badge badge-forest">{users.length} Total Users</div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name & Email</th>
                            <th>Role</th>
                            <th>Mentor / Assigned To</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div className="font-bold text-forest-dark">{u.name}</div>
                                    <div className="text-xs text-text-muted">{u.email}</div>
                                </td>
                                <td>
                                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-amber' : u.role === 'MENTOR' ? 'badge-forest' : 'badge-emerald'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-sm">
                                        {u.mentorName ? u.mentorName : u.role === 'STUDENT' ? 'Unassigned' : 'N/A'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button 
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
