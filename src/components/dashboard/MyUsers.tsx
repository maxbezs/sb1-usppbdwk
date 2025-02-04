import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, UserX, Copy, Check, Shield, X, Edit2 } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { supabase } from '../../lib/supabase';
import { AutosaveInput } from '../AutosaveInput';

interface User {
  id: string;
  name: string;
  username: string;
  joinDate: string;
  paypal_username?: string;
  permission_level: 'User' | 'Admin';
  total_earnings?: number;
  display_name: string | null;
  bio: string | null;
  headline: string | null;
  avatar_url: string | null;
  has_advanced_access: boolean;
}

const USERS_PER_PAGE = 10;

export function MyUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'joinDate' | 'total_earnings'>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, updatePermissionLevel } = useProfileStore();
  const [showCopyToast, setShowCopyToast] = useState<{show: boolean, message: string}>({ show: false, message: '' });
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      // Mock total earnings for now - replace with actual earnings calculation
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.display_name || 'Unnamed User',
        username: user.username || 'no-username',
        joinDate: user.created_at,
        paypal_username: user.paypal_username,
        permission_level: user.permission_level || 'User',
        total_earnings: Math.floor(Math.random() * 1000), // Replace with actual earnings
        display_name: user.display_name,
        bio: user.bio,
        headline: user.headline,
        avatar_url: user.avatar_url,
        has_advanced_access: user.has_advanced_access
      }));

      setUsers(formattedUsers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, type: 'PayPal' | 'Referral Code') => {
    await navigator.clipboard.writeText(text);
    setShowCopyToast({ 
      show: true, 
      message: `${type} copied to clipboard` 
    });
    setTimeout(() => setShowCopyToast({ show: false, message: '' }), 2000);
  };

  const handlePermissionChange = async (userId: string, newLevel: 'User' | 'Admin') => {
    try {
      setUpdatingUser(userId);
      await updatePermissionLevel(userId, newLevel);
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, permission_level: newLevel }
          : user
      ));
    } catch (error) {
      console.error('Error updating permission level:', error);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleUserUpdate = async (userId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, [field]: value }
          : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const getReferralCode = (username: string) => `${username}77`;

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.paypal_username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'name') {
      return modifier * a.name.localeCompare(b.name);
    }
    if (sortField === 'total_earnings') {
      return modifier * ((a.total_earnings || 0) - (b.total_earnings || 0));
    }
    return modifier * (new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
  });

  // Paginate users
  const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleSort = (field: 'name' | 'joinDate' | 'total_earnings') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <UserX className="w-16 h-16 text-white/50 mx-auto" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-white/70">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-white/70">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-white/20">
        <table className="w-full">
          <thead>
            <tr className="bg-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">
                  Name
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">PayPal</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Referral Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer" onClick={() => handleSort('total_earnings')}>
                <div className="flex items-center gap-2">
                  Total Earnings
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer" onClick={() => handleSort('joinDate')}>
                <div className="flex items-center gap-2">
                  Join Date
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {paginatedUsers.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url && (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <span className="text-white/70">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.paypal_username ? (
                      <button
                        onClick={() => handleCopy(user.paypal_username!, 'PayPal')}
                        className="text-white/70 hover:text-white flex items-center gap-2 transition-colors"
                      >
                        {user.paypal_username}
                        <Copy className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-white/50">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCopy(getReferralCode(user.username), 'Referral Code')}
                      className="text-white/70 hover:text-white flex items-center gap-2 transition-colors"
                    >
                      {getReferralCode(user.username)}
                      <Copy className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    £{user.total_earnings?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select
                        value={user.permission_level}
                        onChange={(e) => handlePermissionChange(user.id, e.target.value as 'User' | 'Admin')}
                        disabled={updatingUser === user.id}
                        className="w-full px-3 py-2 bg-white/10 rounded-lg border border-white/20 text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="User" className="bg-gray-900">User</option>
                        <option value="Admin" className="bg-gray-900">Admin</option>
                      </select>
                      <Shield className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      {editingUser === user.id ? 'Close' : 'Edit'}
                    </button>
                  </td>
                </tr>
                {editingUser === user.id && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-white/5">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-white/70 mb-1">Display Name</label>
                            <AutosaveInput
                              value={user.display_name || ''}
                              field={`profiles.${user.id}.display_name`}
                              placeholder="Display Name"
                              onChange={(value) => handleUserUpdate(user.id, 'display_name', value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-white/70 mb-1">Username</label>
                            <AutosaveInput
                              value={user.username || ''}
                              field={`profiles.${user.id}.username`}
                              placeholder="Username"
                              onChange={(value) => handleUserUpdate(user.id, 'username', value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-white/70 mb-1">Headline</label>
                          <AutosaveInput
                            value={user.headline || ''}
                            field={`profiles.${user.id}.headline`}
                            placeholder="Headline"
                            onChange={(value) => handleUserUpdate(user.id, 'headline', value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/70 mb-1">Bio</label>
                          <AutosaveInput
                            type="textarea"
                            value={user.bio || ''}
                            field={`profiles.${user.id}.bio`}
                            placeholder="Bio"
                            onChange={(value) => handleUserUpdate(user.id, 'bio', value)}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.has_advanced_access}
                              onChange={(e) => handleUserUpdate(user.id, 'has_advanced_access', e.target.checked)}
                              className="w-4 h-4 rounded border-white/20 bg-white/10 text-white"
                            />
                            <span className="text-sm text-white/70">Advanced Access</span>
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-white/50">
          Showing {((currentPage - 1) * USERS_PER_PAGE) + 1} to {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 py-2 rounded-lg bg-white/10 text-white">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Copy Toast */}
      {showCopyToast.show && (
        <div className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white shadow-lg transition-all animate-fade-in">
          <Check className="w-4 h-4 text-green-400" />
          <span>{showCopyToast.message}</span>
        </div>
      )}
    </div>
  );
}