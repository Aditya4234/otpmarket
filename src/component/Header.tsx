"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Feature', href: '#Feature' },
    { name: 'Pricing', href: '#Pricing' },
    { name: 'Support', href: '#Support' },
  ];

  return (
    <nav className="bg-primary/90 fixed w-full z-20 top-0 start-0 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white tracking-widest">
            OTP<span className="text-[#804dee]">MART</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-sticky"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        {/* Nav Links */}
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 text-secondary rounded-sm hover:text-white md:bg-transparent md:p-0 transition-colors duration-300"
                  aria-current="page"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col md:flex-row md:ml-4 mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
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