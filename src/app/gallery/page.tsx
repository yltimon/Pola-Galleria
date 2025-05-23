'use client';

import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { StyledLink } from '@/components';
import imageData from '../../../public/image-data.json'; // Your JSON data

type SelectablePhoto = Photo & {
  id: string; // Added id field
  selected?: boolean;
  date?: string; // Added date field
  tags?: string[]; // Added tags field
};


export default function PolaroidLightboxGallery() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId");

  // Transform JSON data to photo format
  const [photos, setPhotos] = useState<SelectablePhoto[]>(() =>
    imageData.images.map((img, index) => ({
      id: `photo-${index}`,
      src: `/images/${img.filename}`,
      width: 800, // Default dimensions
      height: 600,
      href: `/images/${img.filename}`,
      label: img.tags.join(', '),
      date: img.date,
      tags: img.tags,
      selected: false
    }))
  );

  const [lightboxPhoto, setLightboxPhoto] = useState<SelectablePhoto | null>(null);
    // Automatically open the lightbox if an imageId is provided in the query
    useEffect(() => {
      if (imageId) {
        const selectedImage = photos.find((photo) => photo.id === imageId);
        if (selectedImage) {
          setLightboxPhoto(selectedImage);
        }
      }
    }, [imageId, photos]);

  return (
    <>
      <Navbar />
      <div className="p-8">
        <RowsPhotoAlbum
          photos={photos}
          targetRowHeight={150}
          render={{
            link: (props) => <StyledLink {...props} />,
          }}
          componentsProps={{
            link: ({ photo: { href } }) =>
              href?.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : undefined,
          }}
          onClick={({ event, photo }) => {
            if (event.shiftKey || event.altKey || event.metaKey) return;
            event.preventDefault();
            setLightboxPhoto(photo);
          }}
          sizes={{
            size: "1168px",
            sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
          }}
          breakpoints={[220, 360, 480, 600, 900, 1200]}
        />

        <Lightbox
          open={Boolean(lightboxPhoto)}
          close={() => setLightboxPhoto(null)}
          slides={lightboxPhoto ? [{
            src: lightboxPhoto.src,
            alt: lightboxPhoto.tags?.join(', '), // Using alt for description
            // Removed title as it is not part of SlideImage type
          }] : []}
          carousel={{ finite: true }}
          render={{ buttonPrev: () => null, buttonNext: () => null }}
          styles={{ 
            container: { color: "white" } // Apply color directly to the container
          }}
          controller={{ closeOnBackdropClick: true, closeOnPullUp: true, closeOnPullDown: true }}
        />
      </div>
    </>
  );
}