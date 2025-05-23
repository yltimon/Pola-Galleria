'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import imageData from '../../../public/image-data.json';
import Navbar from '@/components/Navbar';

interface PolaroidImage {
  id: string;
  url: string;  
  caption: string;
}

export default function PolaroidGenerator() {
  // Grid configuration
  const [gridConfig, setGridConfig] = useState({
    rows: 4,
    cols: 4,
    spacing: 4,
    polaroidWidth: 250,
  });

  // Polaroid images loaded from JSON
  const [images, setImages] = useState<PolaroidImage[]>([]);

  // Load images from JSON data
  useEffect(() => {
    const loadedImages = imageData.images.map((img, index) => ({
      id: `polaroid-${index}`,
      url: `/images/${img.filename}`,
      caption: img.tags.join(', '),
    }));
    setImages(loadedImages);
  }, []);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');


  // Add/remove images when grid size changes
  const updateGridImages = (type: 'rows' | 'cols', value: number) => {
    if (type === 'rows' || type === 'cols') {
      const newSize = (type === 'rows' ? value : gridConfig.rows) * 
                     (type === 'cols' ? value : gridConfig.cols);
      setImages(prev => {
        if (newSize > prev.length) {
          return [
            ...prev,
            ...Array.from({ length: newSize - prev.length }, (_, i) => ({
              id: `polaroid-${prev.length + i}`,
              url: `/images/default-${(i % 4) + 1}.jpg`,
              caption: `Memory ${prev.length + i + 1}`,
            }))
          ];
        }
        return prev.slice(0, newSize);
      });
    }
  };

  // Handle caption editing
  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingId) {
      setImages(prev =>
        prev.map(img =>
          img.id === editingId ? { ...img, caption: editText } : img
        )
      );
      setEditingId(null);
    }
  };

  const updateGridSize = (size: string) => {
    let width = 250; // Default to Medium
    let spacing = gridConfig.spacing; // Keep current spacing by default


    switch (size) {
      case 'large':
        width = 400;
        spacing = 6;
        break;
      case 'medium':
        width = 250;
        spacing = 4;
        break;
      case 'small':
        width = 150;
        spacing = 3;
        break;
    }
  
    setGridConfig((prev) => ({
      ...prev,
      polaroidWidth: width,
      spacing: spacing,
    }));
  };

  const downloadPolaroid = async (img: PolaroidImage) => {
    const html2canvas = (await import('html2canvas')).default;
    const element = document.getElementById(`polaroid-${img.id}`);

    if (element) {
      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = '#000000'; // Set background to black
      const buttonsPola = element.querySelectorAll('button');
      buttonsPola.forEach((button) => (button.style.display = 'none'));
      const downloadDiv = document.getElementById('hid-Download');
      if (downloadDiv) {
        downloadDiv.style.display = 'none';
      }

      try {
        const canvas = await html2canvas(element, {
          backgroundColor: null, // Ensure the background is transparent
        });
        const link = document.createElement('a');
        link.download = `polaroid-${img.caption.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    
      } finally {}
      element.style.backgroundColor = originalBg; // Reset background color
      buttonsPola.forEach((button) => (button.style.display = ''));
      if (downloadDiv) {
        downloadDiv.style.display = '';
      }
      // Reset the display of buttons and downloadDiv
      // to their original state
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Polaroid Album</h1>
            <p className="text-gray-600">Create your perfect memory</p>
          </header>

          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Polaroid Size</label>
                <select
                  onChange={(e) => updateGridSize(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="large">Large</option>
                  <option value="medium">Medium</option>
                  <option value="small">Small</option>
                </select>
              </div>
            <div className="mt-4 flex justify-between items-center">

              {/* Upload Button */}
              <input
              type="file"
              accept="image/*"
              id="upload-input"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const newId = `polaroid-${Date.now()}`;
                    setImages((prev) => [
                      ...prev,
                      {
                        id: newId,
                        url: reader.result as string, // Use the base64 URL
                        caption: `Uploaded Memory ${prev.length + 1}`,
                      },
                    ]);
                  };
                  reader.readAsDataURL(file); // Convert the file to a base64 URL
                }
              }}
            />
            <label
              htmlFor="upload-input"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              Upload Polaroid
            </label>

            {/* Add Default Polaroid Button */}
              <button
                onClick={() => {
                  const newId = `polaroid-${Date.now()}`;
                  setImages(prev => [
                    ...prev,
                    {
                      id: newId,
                      url: `/images/default-${(prev.length % 4) + 1}.jpg`,
                      caption: `Memory ${prev.length + 1}`,
                    },
                  ]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Polaroid
              </button>
            </div>
          </div>

          {/* Polaroid Grid */}
          <div
            id="polaroid-grid"
            className="p-6 rounded-lg shadow-md"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${gridConfig.polaroidWidth}px, 1fr))`,
              gap: `${gridConfig.spacing * 4}px`,
              backgroundColor: 'transparent'
            }}
          >
            {images.slice(0, gridConfig.rows * gridConfig.cols).map((img) => (
              <div
                key={img.id}
                id={`polaroid-${img.id}`}
                className="relative group"
                style={{ width: `${gridConfig.polaroidWidth}px`, backgroundColor: 'transparent' }}
              >
                <div className="shadow-lg border border-gray-200 rounded-sm p-4 flex flex-col"
                  style={{ 
                    height: `${gridConfig.polaroidWidth * 1.1}px`,
                    backgroundColor: '#ffffff', 
                    }}
                  >
                  <div className="relative flex-1 mb-4 overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.caption}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  {editingId === img.id ? (
                    <div className="flex">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 p-1 border rounded text-center font-handwritten text-lg"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="ml-2 px-2 bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p 
                        className="text-center font-handwritten text-gray-800 text-lg cursor-pointer flex-1"
                        onClick={() => startEditing(img.id, img.caption)}
                      >
                        {img.caption}
                      </p>
                      <button
                        onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                  <button
                    onClick={() => downloadPolaroid(img)}
                    className="mt-1 w-full py-1 text-gray-800 rounded shadow-sm hover:bg-gray-100 transition-colors text-sm"
                    style={{backgroundColor: 'transparent'}}
                    id='hid-Download'
                  >
                    Download
                </button>
                
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}