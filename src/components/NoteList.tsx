import React from 'react';
import { useStore } from '../store/useStore';
import { Note } from '../types';
import { Pin, Tag, Trash2, Edit2, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { generatePDF } from '../utils/pdf';

interface NoteListProps {
  onEditNote: (noteId: string) => void;
  pinnedOnly?: boolean;
}

export function NoteList({ onEditNote, pinnedOnly }: NoteListProps) {
  const { notes, togglePinNote, deleteNote } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'date' | 'priority'>('date');

  const filteredNotes = React.useMemo(() => {
    let filtered = notes.filter((note) => {
      if (pinnedOnly && !note.isPinned) return false;
      return (
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    });
  }, [notes, searchTerm, sortBy, pinnedOnly]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notes..."
          className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
          className="bg-gray-800 rounded-lg px-4 py-2"
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="group bg-gray-800 rounded-lg p-4 relative hover:ring-2 hover:ring-blue-500 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold flex-1 mr-2">{note.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePinNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                  title={note.isPinned ? "Unpin note" : "Pin note"}
                >
                  <Pin className={note.isPinned ? "text-blue-400 w-4 h-4" : "w-4 h-4"} />
                </button>
                <button
                  onClick={() => generatePDF(note)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                  title="Export as PDF"
                >
                  <FileDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                  title="Edit note"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                  title="Move to trash"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-300 mb-4 line-clamp-3">{note.content}</p>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  note.priority === 'high'
                    ? 'bg-red-900 text-red-200'
                    : note.priority === 'medium'
                    ? 'bg-yellow-900 text-yellow-200'
                    : 'bg-green-900 text-green-200'
                }`}
              >
                {note.priority}
              </span>
              <span>{format(note.updatedAt, 'MMM d, yyyy')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}