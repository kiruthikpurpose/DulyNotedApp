import React from 'react';
import { useStore } from '../store/useStore';
import { Camera, Upload, User as UserIcon, X } from 'lucide-react';

const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
];

export function Profile() {
  const { user, updateUser } = useStore();
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [newName, setNewName] = React.useState(user.name);
  const [showAvatarSelector, setShowAvatarSelector] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      updateUser({ name: newName.trim() });
      setIsEditingName(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleOnlineStatus = () => {
    updateUser({ isOnline: !user.isOnline });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Profile Settings</h2>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:text-blue-400"
                  title="Upload photo"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="p-1 hover:text-blue-400"
                  title="Choose avatar"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex-1">
            {isEditingName ? (
              <form onSubmit={handleNameSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-700 rounded px-3 py-2 flex-1"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-white"
                >
                  (Edit)
                </button>
              </div>
            )}
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`}
              />
              <button
                onClick={toggleOnlineStatus}
                className="text-sm text-gray-400 hover:text-white"
              >
                {user.isOnline ? 'Online' : 'Offline'} (Click to toggle)
              </button>
            </div>
          </div>
        </div>

        {showAvatarSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Choose an avatar</h4>
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {DEFAULT_AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => {
                      updateUser({ avatar });
                      setShowAvatarSelector(false);
                    }}
                    className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                  >
                    <img
                      src={avatar}
                      alt="Avatar option"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="font-medium mb-4">App Statistics</h3>
        <div className="text-sm text-gray-400">
          <p>Time spent writing: {Math.round(user.timeSpent / 60)} minutes</p>
          <p>Total notes: {useStore((state) => state.notes.length)}</p>
          <p>
            Deleted notes: {useStore((state) => state.deletedNotes.length)}
          </p>
        </div>
      </div>
    </div>
  );
}