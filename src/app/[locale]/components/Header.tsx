'use client'
import { useEffect, useState } from 'react'
import { Link } from '@/src/navigation'
import { Github, Menu, X } from 'lucide-react'
import {
  Protect,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/nextjs'

// --- OPTIMIZATION: Abstract navigation links into an array to avoid repetition (DRY principle).
const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' }
] as const

export default function Header({ locale = 'en' }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Function to close the mobile menu, useful for link clicks
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-300 ${scrolled ? 'bg-black/90 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}
    >
      <div className='container mx-auto flex items-center justify-between px-6 py-4'>
        {/* Logo */}
        <Link
          lang={locale}
          href='/'
          onClick={mobileMenuOpen ? closeMobileMenu : undefined}
        >
          <div className='flex items-center'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white'>
              D
            </div>
            <span className='ml-3 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-2xl font-bold text-transparent'>
              Debug
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden items-center space-x-8 md:flex'>
          {navLinks.map(link => (
            <Link
              key={link.href}
              lang={locale}
              href={link.href}
              className='text-sm uppercase tracking-wide text-gray-400 transition-colors hover:text-white'
            >
              {link.label}
            </Link>
          ))}
          <SignedIn>
            <Link
              lang={locale}
              href='/dashboard'
              className='text-sm uppercase tracking-wide text-gray-400 transition-colors hover:text-white'
            >
              Dashboard
            </Link>
            <Protect fallback={null} role='org:admin'>
              <Link
                lang={locale}
                href='/admin'
                className='text-sm uppercase tracking-wide text-gray-400 transition-colors hover:text-white'
              >
                Admin
              </Link>
            </Protect>
          </SignedIn>
        </nav>

        {/* Right-side Actions */}
        <div className='flex items-center space-x-4'>
          <SignedOut>
            <SignInButton mode='modal'>
              <button className='hidden rounded-md bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 md:block'>
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl='/'
              appearance={{ elements: { avatarBox: 'w-9 h-9'} }}

            />
          </SignedIn>
          <a
            href='https://github.com/Nev-Labs'
            target='_blank'
            rel='noopener noreferrer'
            className='hidden md:block'
          >
            <Github className='h-5 w-5 text-gray-400 transition-colors hover:text-white' />
          </a>

          {/* --- ACCESSIBILITY FIX: Added aria-controls and aria-expanded for screen readers */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden'
            aria-controls='mobile-menu'
            aria-expanded={mobileMenuOpen}
          >
            <span className='sr-only'>Toggle menu</span>
            {mobileMenuOpen ? (
              <X className='h-6 w-6 text-gray-400' />
            ) : (
              <Menu className='h-6 w-6 text-gray-400' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* --- UI/UX FIX: Added transition classes for a smooth slide-down animation */}
      <div
        id='mobile-menu'
        className={`overflow-hidden bg-black/90 transition-all duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className='container mx-auto flex flex-col space-y-4 px-6 pb-6 pt-2'>
          {navLinks.map(link => (
            <Link
              key={link.href}
              lang={locale}
              href={link.href}
              onClick={closeMobileMenu}
              className='text-lg text-gray-400 hover:text-white'
            >
              {link.label}
            </Link>
          ))}
          <SignedIn>
            <Link
              lang={locale}
              href='/dashboard'
              onClick={closeMobileMenu}
              className='text-lg text-gray-400 hover:text-white'
            >
              Dashboard
            </Link>
            {/* --- BUG FIX: Added missing Admin link to mobile menu */}
            <Protect fallback={null} role='org:admin'>
              <Link
                lang={locale}
                href='/admin'
                onClick={closeMobileMenu}
                className='text-lg text-gray-400 hover:text-white'
              >
                Admin
              </Link>
            </Protect>
          </SignedIn>
          <hr className='my-2 border-gray-700' />
          <div className='flex items-center space-x-4'>
            {/* --- BUG FIX: Added missing Sign In button for signed-out users */}
            <SignedOut>
              <SignInButton mode='modal'>
                <button className='flex-grow rounded-md bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-medium text-white'>
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            {/* --- BUG FIX: Added missing GitHub link to mobile menu */}
            <a
              href='https://github.com/Nev-Labs'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Github className='h-6 w-6 text-gray-400 hover:text-white' />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
