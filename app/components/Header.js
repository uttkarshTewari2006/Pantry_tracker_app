"use client";
import Link from "next/link";

import { useEffect, useState } from "react";

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Or some fallback UI
  }

  return (
    <div className="fixed flex flex-row w-full h-10 bg-white justify-between items-center">
      <h2 className="text-lg text-black p-2">Pantry Tracker</h2>
      <Link
        className="duration-300 p-3 text-black hover:bg-black hover:text-white"
        href="https://my-personal-website-lemon.vercel.app/"
      >
        Home
      </Link>
    </div>
  );
};

export default Header;
