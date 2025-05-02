'use client'
import { Github, Instagram, Linkedin } from 'lucide-react';
import { Link } from '@/src/navigation';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            Debug
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            About
          </Link>
 
          <Link href="/events" className="text-sm text-gray-400 hover:text-white transition-colors">
            Events
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://github.com/Nev-Labs" target="_blank" rel="noopener noreferrer">
            <Github className="w-5 h-5 text-gray-400 hover:text-white" />
          </a>
          <a href="https://www.instagram.com/debug.oist/" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-500" />
          </a>
          <a href="https://www.linkedin.com/company/debugoist/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-500" />
          </a>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-800">
        © {new Date().getFullYear()} Debug Programming Club. All rights reserved.
      </div>
    </footer>
  );
}
