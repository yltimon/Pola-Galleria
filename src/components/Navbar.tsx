import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="flex justify-between items-center p-4 bg-transparent text-black bold fixed top-0 left-0 right-0 z-10">
            <Link href="/" className="text-lg font-bold">
                Pola Galleria
            </Link>
            <div className="relative">
                {/* Hamburger Menu Icon */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex flex-col gap-1 w-6 h-6 justify-center items-center"
                >
                    <span className="block w-full h-[2px] bg-black"></span>
                    <span className="block w-full h-[2px] bg-black"></span>
                    <span className="block w-full h-[2px] bg-black"></span>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2">
                        <Link href="/" className="hover:underline" onClick={() => setMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/polaroid" className="hover:underline" onClick={() => setMenuOpen(false)}>
                            Polaroid
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}