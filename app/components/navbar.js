import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-black p-4 text-black mt-2 mb-2">
      <div className="w-full flex items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">
          <Image src='/assets/svg/logo-text-white.svg' alt="Tune Buddy Logo" width={150} height={40} />
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:text-gray-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/page-login" className="text-white hover:text-gray-500">
              Log In
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
