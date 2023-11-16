import Image from "next/image";
import Link from "next/link";
import { RxDashboard } from "react-icons/rx";
import { TbWorldSearch } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import { useRouter } from "next/router";
import { destroyCookie } from 'nookies';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'id');
    destroyCookie(null, 'profile');
    destroyCookie(null, 'oauth');
    router.push('/login');
  };

  return (
    <div
      className={`${
        open ? "w-68" : "w-20"
      }  h-screen bg-[#172882] duration-300 relative`}
    >
      <div className="p-4 text-white">
        <IoIosArrowBack
          className={`text-3xl bg-black rounded-full absolute -right-3 top-9 cursor-pointer duration-300 ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex items-center justify-center mb-7">
          <Image src="/image/OIG1.png" width={100} height={100} />
        </div>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`flex gap-3 font-popin items-center p-2 rounded ${
                !open && "mr-4"
              } ${router.pathname === "/" ? "bg-white text-black" : ""}`}
            >
              <RxDashboard />
              <span className={`flex-1 ${!open && "hidden"}`}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/url-phishing"
              className={`flex gap-3 font-popin items-center p-2 rounded ${
                !open && "mr-4"
              } ${
                router.pathname === "/url-phishing" ? "bg-white text-black" : ""
              }`}
            >
              <TbWorldSearch />
              <span className={`flex-1 ${!open && "hidden"}`}>
                Pendeteksi URL Phising
              </span>
            </Link>
          </li>
          <div>
            <Link
              onClick={handleLogout}
              href="/login"
              className={`flex gap-3 font-popin items-center p-2 rounded mt-[340px] ${
                !open && "mr-4 mt-[420px]"
              } `}
            >
              <BiLogOut />
              <span className={`flex-1 ${!open && "hidden"}`}>Keluar</span>
            </Link>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
