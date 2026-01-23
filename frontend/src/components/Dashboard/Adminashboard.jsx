// React hooks এবং প্রয়োজনীয় libraries import
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider'; // Authentication context
import { toast } from 'react-toastify'; // Toast notifications
import { FaEye, FaUserShield } from 'react-icons/fa'; // Icons

// Admin dashboard component - user management এর জন্য
const AdminDashboard = () => {
  // Authentication context থেকে user info, token function এবং role
  const { user, getToken, role } = useContext(AuthContext);
  
  // Component states
  const [users, setUsers] = useState([]);              // All users list
  const [loading, setLoading] = useState(true);        // Loading state
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for modal
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal open/close state
  // Component mount হওয়ার সময় users fetch করা
  useEffect(() => {
    // Admin role check - শুধু admin রা access করতে পারবে
    if (role !== 'admin') {
      toast.error('Access denied: Admin role required');
      setLoading(false);
      return;
    }

    // All users fetch করার function
    const fetchUsers = async () => {
      try {
        // JWT token get করা
        const token = await getToken();
        console.log('Fetching users with token:', token.substring(0, 20) + '...');
        
        // Backend API call - users list এর জন্য
        const response = await fetch('http://localhost:3000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`, // JWT token authentication
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('Users fetched successfully:', data.users);
          setUsers(data.users); // Users state update করা
        } else {
          console.error('Fetch error:', data.error);
          toast.error(data.error || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Fetch users error:', error.message);
        toast.error(`Error fetching users: ${error.message}`);
      } finally {
        setLoading(false); // Loading state end
      }
    };

    // User logged in এবং admin role আছে কিনা check করে fetch করা
    if (user && role === 'admin') {
      fetchUsers();
    } else {
      console.log('No user authenticated or not an admin');
      setLoading(false);
    }
  }, [user, getToken, role]); // Dependencies - এই values change হলে re-run হবে

  // User কে admin role দেওয়ার function
  const handleMakeAdmin = async (uid) => {
    try {
      // JWT token get করা
      const token = await getToken();
      console.log('Making admin for UID:', uid);
      
      // Backend API call - user role update করা
      const response = await fetch('http://localhost:3000/api/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, role: 'admin' }), // User ID এবং admin role
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // UI তে optimistically update করা (server response এর আগেই)
        setUsers(users.map(u => u.uid === uid ? { ...u, role: 'admin' } : u));
        toast.success('User role updated to admin');
      } else {
        console.error('Make admin error:', data.error);
        toast.error(data.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error.message);
      toast.error(`Error updating role: ${error.message}`);
    }
  };

  // User details view করার জন্য modal open করা
  const handleViewData = (user) => {
    setSelectedUser(user);   // Selected user set করা
    setIsModalOpen(true);    // Modal open করা
  };

  // Modal close করার function
  const closeModal = () => {
    setIsModalOpen(false);   // Modal close করা
    setSelectedUser(null);   // Selected user clear করা
  };

  if (loading) {
    return <div className="text-center text-gray-600 text-xl">Loading...</div>;
  }

  if (!user || role !== 'admin') {
    return <div className="text-center text-red-500 text-xl">Access Denied: Admin role required</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-semibold text-amber-700 mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="table w-full">
          <thead>
            <tr className="bg-amber-200 text-gray-800">
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-600">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50">
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.displayName || 'N/A'}</td>
                  <td className="py-4 px-6">{user.role}</td>
                  <td className="py-4 px-6 flex space-x-2">
                    <button
                      className="btn btn-ghost btn-sm text-amber-600 hover:text-amber-800"
                      onClick={() => handleViewData(user)}
                      title="View Data"
                    >
                      <FaEye className="text-2xl" />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        className="btn btn-ghost btn-sm text-amber-600 hover:text-amber-800"
                        onClick={() => handleMakeAdmin(user.uid)}
                        title="Make Admin"
                      >
                        <FaUserShield className="text-2xl" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-semibold text-amber-700 mb-4">User Details</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-bold">UID:</span> {selectedUser.uid}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Email:</span> {selectedUser.email}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Name:</span> {selectedUser.displayName || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Role:</span> {selectedUser.role}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="btn bg-amber-600 text-white hover:bg-amber-700 rounded-md px-4 py-2"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;