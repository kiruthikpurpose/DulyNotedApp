import React from 'react';
import { useStore } from '../store/useStore';
import { Note } from '../types';
import { Save, Tag, AlertTriangle } from 'lucide-react';
import { debounce } from '../utils/debounce';

interface NoteEditorProps {
  noteId?: string;
  onClose?: () => void;
}

const SUGGESTED_TAGS = ['Work', 'Personal', 'Ideas', 'Important', 'Tasks'];
const FONT_OPTIONS = ['sans', 'serif', 'mono'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const;

export function NoteEditor({ noteId, onClose }: NoteEditorProps) {
  const { notes, addNote, updateNote } = useStore();
  const note = noteId ? notes.find((n) => n.id === noteId) : null;
  
  const [title, setTitle] = React.useState(note?.title || '');
  const [content, setContent] = React.useState(note?.content || '');
  const [tags, setTags] = React.useState<string[]>(note?.tags || []);
  const [priority, setPriority] = React.useState<Note['priority']>(note?.priority || 'medium');
  const [font, setFont] = React.useState('sans');
  const [showTagInput, setShowTagInput] = React.useState(false);
  const [newTag, setNewTag] = React.useState('');

  const debouncedSave = React.useMemo(
    () =>
      debounce((updates: Partial<Note>) => {
        if (noteId) {
          updateNote(noteId, updates);
        }
      }, 2000),
    [noteId, updateNote]
  );

  React.useEffect(() => {
    if (noteId) {
      debouncedSave({ title, content, tags, priority });
    }
  }, [title, content, tags, priority, noteId]);

  const handleSave = () => {
    if (!noteId) {
      addNote({
        title,
        content,
        tags,
        priority,
        isPinned: false,
        isDeleted: false,
      });
    }
    onClose?.();
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleNewTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="w-full bg-transparent text-2xl font-bold mb-4 border-b border-gray-700 pb-2 focus:outline-none focus:border-blue-500"
      />
      
      <div className="flex gap-4 mb-4">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Note['priority'])}
          className="bg-gray-700 rounded px-3 py-1 text-sm"
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)} Priority
            </option>
          ))}
        </select>

        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="bg-gray-700 rounded px-3 py-1 text-sm"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            <Tag className="w-3 h-3" />
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 hover:text-red-200"
            >
              ×
            </button>
          </span>
        ))}
        {showTagInput ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNewTag()}
              placeholder="New tag..."
              className="bg-gray-700 rounded px-2 py-1 text-sm"
              autoFocus
            />
            <button
              onClick={handleNewTag}
              className="text-blue-400 hover:text-blue-300"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowTagInput(true)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            + Add Tag
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Suggested Tags:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.filter((tag) => !tags.includes(tag)).map((tag) => (
            <button
              key={tag}
              onClick={() => handleAddTag(tag)}
              className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className={`w-full h-64 bg-gray-700 rounded p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-${font}`}
      />

      <div className="flex justify-between mt-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-400">Auto-saving...</span>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {noteId ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  );
}