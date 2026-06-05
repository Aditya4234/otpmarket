'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav className="bg-primary/90 fixed w-full z-20 top-0 start-0 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white tracking-widest">
            OTP<span className="text-[#804dee]">MART</span>
          </span>
        </Link>

        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="navbar-sticky"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          )}
        </button>

        <div
          className={`${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'} md:max-h-none md:opacity-100 overflow-hidden transition-all duration-300 ease-in-out items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="p-2 px-3 text-secondary rounded-sm hover:text-white md:bg-transparent md:p-0 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="flex flex-col md:hidden space-y-2 pt-2 border-t border-white/10 mt-2">
              <Link
                href="/login"
                className="px-4 py-2 text-white bg-transparent border border-[#804dee] rounded-md hover:bg-[#804dee] hover:text-white transition-colors duration-300 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-white bg-[#804dee] rounded-md hover:bg-[#6b3dc9] transition-colors duration-300 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </li>
          </ul>
          <div className="hidden md:flex md:flex-row md:ml-4 mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-white bg-transparent border border-[#804dee] rounded-md hover:bg-[#804dee] hover:text-white transition-colors duration-300 text-center"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-white bg-[#804dee] rounded-md hover:bg-[#6b3dc9] transition-colors duration-300 text-center"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
