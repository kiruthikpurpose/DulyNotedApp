import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, User } from '../types';

interface Store {
  notes: Note[];
  deletedNotes: Note[];
  user: User;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      notes: [],
      deletedNotes: [],
      user: {
        name: 'User',
        avatar: '',
        isOnline: true,
        timeSpent: 0,
      },
      addNote: (note) =>
        set((state) => ({
          notes: [
            {
              ...note,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...state.notes,
          ],
        })),
      updateNote: (id, updatedNote) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updatedNote, updatedAt: new Date() }
              : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          deletedNotes: [
            ...state.deletedNotes,
            ...state.notes.filter((note) => note.id === id),
          ],
        })),
      restoreNote: (id) =>
        set((state) => ({
          deletedNotes: state.deletedNotes.filter((note) => note.id !== id),
          notes: [
            ...state.notes,
            ...state.deletedNotes.filter((note) => note.id === id),
          ],
        })),
      permanentlyDeleteNote: (id) =>
        set((state) => ({
          deletedNotes: state.deletedNotes.filter((note) => note.id !== id),
        })),
      togglePinNote: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
          ),
        })),
      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),
    }),
    {
      name: 'dulynoted-storage',
    }
  )
);