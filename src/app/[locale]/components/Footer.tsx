import { Mail, Github, Linkedin, Instagram, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black text-center py-8 border-t border-gray-800">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Club Name */}
        <h2 className="text-xl font-semibold text-white tracking-wide">
          Debug Programming Club
        </h2>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/debug.oist/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-500 transition-transform transform hover:scale-110" />
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
          >
            <MessageCircle className="w-6 h-6 text-gray-400 hover:text-purple-500 transition-transform transform hover:scale-110" />
          </a>
          <a href="mailto:debug@oist.edu" aria-label="Mail">
            <Mail className="w-6 h-6 text-gray-400 hover:text-blue-500 transition-transform transform hover:scale-110" />
          </a>
          <a
            href="https://www.linkedin.com/company/debugoist/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-transform transform hover:scale-110" />
          </a>
          <a
            href="https://github.com/Nev-Labs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6 text-gray-400 hover:text-white transition-transform transform hover:scale-110" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © 2025 Debug Programming Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
