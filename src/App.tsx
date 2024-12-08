import React from 'react';
import { Layout } from './components/Layout';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { RecycleBin } from './components/RecycleBin';
import { Profile } from './components/Profile';
import { TagsView } from './components/TagsView';
import { Plus } from 'lucide-react';

function App() {
  const [activeNoteId, setActiveNoteId] = React.useState<string | undefined>();
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeView, setActiveView] = React.useState('notes');

  const handleNewNote = () => {
    setActiveNoteId(undefined);
    setIsEditing(true);
  };

  const handleEditNote = (id: string) => {
    setActiveNoteId(id);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setActiveNoteId(undefined);
  };

  const renderContent = () => {
    if (isEditing) {
      return <NoteEditor noteId={activeNoteId} onClose={handleCloseEditor} />;
    }

    switch (activeView) {
      case 'notes':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">My Notes</h2>
              <button
                onClick={handleNewNote}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Note
              </button>
            </div>
            <NoteList onEditNote={handleEditNote} />
          </>
        );
      case 'pinned':
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">Pinned Notes</h2>
            <NoteList onEditNote={handleEditNote} pinnedOnly />
          </>
        );
      case 'tags':
        return <TagsView />;
      case 'profile':
        return <Profile />;
      case 'trash':
        return <RecycleBin />;
      default:
        return null;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      <div className="max-w-7xl mx-auto px-4 py-6">{renderContent()}</div>
    </Layout>
  );
}

export default App;