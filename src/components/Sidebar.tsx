"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-80 h-dvh p-4">
      <div className="w-full flex justify-center">
        <Image
          src="/mitrphol-logo-26F9A6C8DE-seeklogo.com.png"
          alt="Mitrphol Image"
          height={100}
          width={100}
        />
      </div>
      <ul className="flex flex-col gap-4 w-full mt-4">
        <Link
          href="/zone/mac"
          className={
            pathname === "/zone/mac"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MAC
        </Link>
        <Link
          href="/zone/sb"
          className={
            pathname === "/zone/sb"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          SB
        </Link>
        <Link
          href="/zone/mpdc"
          className={
            pathname === "/zone/mpdc"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MPDC
        </Link>
        <Link
          href="/zone/mpv"
          className={
            pathname === "/zone/mpv"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MPV
        </Link>
        <Link
          href="/zone/mpl"
          className={
            pathname === "/zone/mpl"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MPL
        </Link>
        <Link
          href="/zone/mpk"
          className={
            pathname === "/zone/mpk"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MPK
        </Link>
        <Link
          href="/zone/mks"
          className={
            pathname === "/zone/mks"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MKS
        </Link>
      </ul>
    </div>
  );
}
