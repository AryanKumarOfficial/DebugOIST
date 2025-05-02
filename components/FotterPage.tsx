import { FaGithub, FaLinkedin, FaDiscord, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Left Section */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-white">Debug Programming Club</h2>
          <p className="mt-2 text-sm text-gray-500">Think. Build. Deploy.</p>
        </div>

        {/* Center Section */}
        <div className="flex space-x-6 text-sm">
          <a href="/about" className="hover:text-white transition">About</a>
        </div>

        {/* Right Section (Social Media) */}
        <div className="flex space-x-6">
          <a
            href="https://github.com/Nev-Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/company/debugoist/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://discord.com/invite/your-invite-code"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaDiscord size={24} />
          </a>
          <a
            href="https://www.instagram.com/debug.oist/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="mailto:ashishashish7440@gmail.com"
            className="hover:text-white transition"
          >
            <FaEnvelope size={24} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6 text-gray-500">
        &copy; {new Date().getFullYear()} Debug Programming Club. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
