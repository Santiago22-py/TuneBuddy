import Link from "next/link";
import Image from "next/image";
import LogoText from '../assets/svg/logo-text-white.svg';


export default function Navbar() {
  return (
    <nav className="bg-black p-4 text-black">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          <Image src={LogoText} alt="Tune Buddy Logo" width={150} height={40} />
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:text-gray-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-white hover:text-gray-500">
              Log In
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
