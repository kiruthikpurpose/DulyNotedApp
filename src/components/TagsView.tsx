import React from 'react';
import { useStore } from '../store/useStore';
import { Tag as TagIcon, Plus, X } from 'lucide-react';
import { clsx } from 'clsx';

export function TagsView() {
  const notes = useStore((state) => state.notes);
  const [newTag, setNewTag] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  const tags = React.useMemo(() => {
    const tagMap = new Map<string, number>();
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  const filteredNotes = React.useMemo(() => {
    if (!selectedTag) return [];
    return notes.filter((note) => note.tags.includes(selectedTag));
  }, [notes, selectedTag]);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.some(([tag]) => tag === newTag.trim())) {
      // In a real app, we'd probably want to add this to a separate tags store
      setNewTag('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Tags</h2>
        <form onSubmit={handleAddTag} className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag..."
            className="bg-gray-800 rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tag
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-[300px,1fr] gap-6">
        <div className="space-y-2">
          {tags.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={clsx(
                'w-full p-3 rounded flex items-center justify-between',
                tag === selectedTag
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              )}
            >
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                <span>{tag}</span>
              </div>
              <span className="text-sm opacity-75">{count}</span>
            </button>
          ))}
        </div>

        <div>
          {selectedTag ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">
                  Notes tagged with "{selectedTag}"
                </h3>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium mb-2">{note.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <TagIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a tag to view associated notes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}