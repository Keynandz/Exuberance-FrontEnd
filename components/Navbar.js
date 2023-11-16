import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const Navbar = ({ cookies }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const user = {
    name: "exuberance",
    avatar: cookies.profile || "/image/pp.png",
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-end items-center">
        <div className="flex items-center">
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex justify-center items-center gap-x-3  cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 rounded-full mr-2"
              />
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/changepassword" className="font-popin">
                      Ubah Kata Sandi
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
