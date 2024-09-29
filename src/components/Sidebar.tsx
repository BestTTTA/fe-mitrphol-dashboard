"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-80 h-dvh border p-4">
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
          href="/MAC"
          className={
            pathname === "/MAC"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MAC
        </Link>
        <Link
          href="/SB"
          className={
            pathname === "/SB"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          SB
        </Link>
        <Link
          href="/MPDC"
          className={
            pathname === "/MPDC"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MPDC
        </Link>
        <Link
          href="/MPV"
          className={
            pathname === "/MPV"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MPV
        </Link>
        <Link
          href="/MPL"
          className={
            pathname === "/MPL"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MPL
        </Link>
        <div
          className={
            pathname === "/MPK"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-gray-300 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
          }
        >
          MPK
        </div>
        <div
          className={
            pathname === "/MKS"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-gray-300 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
          }
        >
          MKS
        </div>
        {/* <Link
          href="/MPK"
          className={
            pathname === "/MPK"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MPK
        </Link>
        <Link
          href="/MKS"
          className={
            pathname === "/MKS"
              ? "active w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold"
              : "text-sky-600 w-full h-20 shadow-sm drop-shadow-md flex justify-center items-center rounded-md bg-gray-100 font-bold hover:scale-105"
          }
        >
          MKS
        </Link> */}
      </ul>
    </div>
  );
}
