"use client";
import Navbar from '@/components/Navbar';
import ImgCard from '@/components/ImgCard';
import TaskbarBtn from '@/components/TaskbarBtn';
import imageData from '../../public/image-data.json';
import { useState } from 'react';
import { useRouter} from 'next/navigation';

export default function VisionproGallery() {
  const router = useRouter();
  const buttons = ["Years", "Months", "Days", "All Photos"];
  const [activeFilter, setActiveFilter] = useState("All Photos");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    // Process image data
    const images = imageData.images.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  // Get unique years and months from the image data
  const years = [...new Set(images.map(img => img.date.split('-')[0]))].sort((a, b) => b.localeCompare(a));

  const months = [
    { value: "01", label: "Jan" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Apr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Aug" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];


  // Filter logic based on active filter
  const getFilteredImages = () => {
    switch (activeFilter) {
      case "Years":
        return years.map(year => {
          const yearImages = images.filter(img => img.date.startsWith(year));
          return yearImages[0] || null; // Get first image for each year
        }).filter(Boolean);
      case "Months":
        return months.map(month => {
          const monthImages = images.filter(img => 
            img.date.startsWith(`${selectedYear}-${month.value}`)
          );
          return monthImages[0] || null; // Get first image for each month
        }).filter(Boolean);

      case "Days":
        return images.slice(0, 15); // Get first 15 images for the "Days" filter

      default:
        return images.slice(0, 18); // Default to first 18 images
    }
  };
  // Group images into rows
  const groupIntoRows = (items: any[], itemsPerRow: number) => {;
  const rows = [];
  for (let i = 0; i < items.length; i += itemsPerRow) {
    rows.push(items.slice(i, i + itemsPerRow));
  }
  return rows;
};

// Get filtered images based on the active filter
const getRows = () => {
  const filtered = getFilteredImages();
  switch (activeFilter) {
    case "Years": return groupIntoRows(filtered, 3);
    case "Months": return groupIntoRows(filtered, 3);
    case "Days": return groupIntoRows(filtered, 4);
    default: return groupIntoRows(filtered, 4);
  }
};
  const rows = getRows();

  return (
    <>
      <Navbar />
      <main className="bg-[#ff00001a] flex justify-center w-full">
        <section className="relative w-[1920px] h-[1080px] bg-[url('/images/hero.jpg')] bg-cover bg-center">
          <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[1177px] h-[800px]">
            <div className="relative h-full">
              {/* Photo Gallery */}
              <section className="flex flex-col items-start gap-5 p-[60px] absolute top-0 left-0 w-full h-full bg-glass-bg rounded-[40px] overflow-hidden border-none backdrop-blur-2xl backdrop-brightness-100 shadow-glass-blur">
                
                {/* Year selector for Months view */}
                {activeFilter === "Months" && (
                  <div className="absolute top-4 right-4 z-10">
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="bg-white/80 rounded-full px-4 py-2 text-sm"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Dynamic Rows */}
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex w-full h-[204px] items-center justify-center gap-5">
                    {row.map(img => (
                      <ImgCard 
                        key={img.id}
                        {...img}
                        onHover={hoveredCard === img.id}
                        onMouseEnter={() => setHoveredCard(img.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        displayMode={ 
                          activeFilter === "Years" ? "year" :
                          activeFilter === "Months" ? "month" :
                          activeFilter === "Days" ? "day" : "all"
                        }
                        onClick = {() => router.push(`/gallery?imageId=${img.id}`)}
                      />
                    ))}
                  </div>
                ))}

              </section>

              {/* Buttons */}
              <nav className="inline-flex items-start gap-4 p-3 absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-glass-bg rounded-[40px] overflow-hidden border-none backdrop-blur-2xl backdrop-brightness-100 shadow-glass-blur">
                {buttons.map(btn => (
                  <TaskbarBtn
                    key={btn}
                    text={btn}
                    className="!flex-[0_0_auto]"
                    isActive={activeFilter === btn}
                    onClick={() => {
                      setActiveFilter(btn)
                      if (btn === "Months") setSelectedYear(new Date().getFullYear().toString());
                    }}
                  />
                ))}
              </nav>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}