"use client";
import Image from 'next/image';

interface ImgCardProps {
  id: number;
  filename: string;
  date: string;
  tags: string[];
  location: string;
  isFavorite: boolean;
  onHover: boolean;
  displayMode?: 'year' | 'month' | 'day' | 'all';
  onClick?: () => void;
}



export default function ImgCard({ displayMode = 'all', id, filename, date, tags, location, isFavorite, onHover, onClick }: ImgCardProps) {

  const [year, month, day] = date.split('-');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getDateLabel = () => {
    switch(displayMode) {
      case 'year':
        return <span className="bg-black/50 text-white px-2 py-1 rounded-md text-sm">{year}</span>;
  
      case 'month':
        return <span className="bg-black/50 text-white px-2 py-1 rounded-md text-sm">{monthNames[parseInt(month) - 1]}</span>
      
      case 'day':
         return <span className="bg-black/50 text-white px-2 py-1 rounded-md text-sm">{monthNames[parseInt(month)-1]} {parseInt(day)}</span>

        default: // 'all'
        return <span className="bg-black/50 text-white px-2 py-1 rounded-md text-sm">{monthNames[parseInt(month)-1]} {parseInt(day)}, {year}</span>;
    }
  }
  return (
    <div className="relative w-full h-full cursor-pointer" onClick={onClick}>
      <Image
        src={`/images/${filename}`}  // Using the same image for all cards
        alt={tags.join(', ')}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Conditional date display */}
      <div className="absolute top-4 left-4 flex flex-col items-start gap-1">
        {getDateLabel()}
      </div>
      
    </div>
  );
}