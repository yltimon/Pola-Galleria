'use client';

import Navbar from '@/components/Navbar';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import imageData from '../../../public/image-data.json';

export default function PolaroidLightboxGallery() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');
  const [lightboxPhoto, setLightboxPhoto] = useState<{ id: string; src: string; caption: string } | null>(null);

  // Process image data
  const images = imageData.images.map((img, index) => ({
    id: `polaroid-${index}`,
    src: `/images/${img.filename}`,
    caption: img.tags.join(', '),
  }));

  // Set the lightbox photo based on the query parameter
  useEffect(() => {
    if (imageId) {
      const selectedImage = images.find((img) => img.id === imageId);
      setLightboxPhoto(selectedImage || null);
    }
  }, [imageId]);

  return (
    <>
      <Navbar />
      <main className="p-8">
        <div className="grid grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group cursor-pointer"
              onClick={() => setLightboxPhoto(img)} // Open lightbox on click
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <p className="text-center mt-2 text-gray-700">{img.caption}</p>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          open={Boolean(lightboxPhoto)}
          close={() => setLightboxPhoto(null)}
          slides={
            lightboxPhoto
              ? [
                  {
                    src: lightboxPhoto.src,
                    alt: lightboxPhoto.caption,
                  },
                ]
              : []
          }
        />
      </main>
    </>
  );
}