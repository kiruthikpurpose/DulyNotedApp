import { Note } from '../types';
import { jsPDF } from 'jspdf';

export function generatePDF(note: Note) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(note.title, 20, 20);
  
  // Add metadata
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Priority: ${note.priority}`, 20, 30);
  doc.text(`Tags: ${note.tags.join(', ')}`, 20, 40);
  
  // Add content
  doc.setTextColor(0);
  doc.setFontSize(12);
  
  const textLines = doc.splitTextToSize(note.content, 170);
  doc.text(textLines, 20, 60);
  
  // Save the PDF
  doc.save(`${note.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}