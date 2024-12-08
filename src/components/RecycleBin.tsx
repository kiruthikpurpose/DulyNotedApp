import React from 'react';
import { useStore } from '../store/useStore';
import { Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export function RecycleBin() {
  const { deletedNotes, restoreNote, permanentlyDeleteNote } = useStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Recycle Bin</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deletedNotes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-800 rounded-lg p-4 relative group"
          >
            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
            <p className="text-gray-300 mb-4 line-clamp-3">{note.content}</p>
            <div className="text-sm text-gray-400">
              Deleted on: {format(note.updatedAt, 'MMM d, yyyy')}
            </div>

            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                onClick={() => restoreNote(note.id)}
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => permanentlyDeleteNote(note.id)}
                className="bg-red-500 hover:bg-red-600 p-2 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}