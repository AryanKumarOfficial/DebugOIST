'use client';

import { Link } from '@/src/navigation';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import GithubIcon from '../../icons/github';
import LangSwitcher from './LangSwitcher';
import ThemeSwitch from './ThemeSwitch';
import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
  Protect
} from '@clerk/nextjs';

interface Props {
  locale: string;
}

export const Header: FC<Props> = ({ locale }) => {
  const t = useTranslations('');

  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-4">
        {/* Logo */}
        <Link lang={locale} href="/">
          <div className="flex items-center">
            <div className="mb-2 h-14 w-14"></div>
            <strong className="mx-2 select-none text-3xl font-semibold">
              Debug
            </strong>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link lang={locale} href="/about" className="hover:text-gray-400 transition">
            {t('About')}
          </Link>
          <SignedIn>
            <Link lang={locale} href="/dashboard" className="hover:text-gray-400 transition">
              Dashboard
            </Link>
            <Protect fallback={<></>} role="org:admin">
              <Link lang={locale} href="/admin" className="hover:text-gray-400 transition">
                Admin
              </Link>
            </Protect>
          </SignedIn>
        </nav>

        {/* Right-side Icons */}
        <div className="flex items-center gap-4">
       

          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
                {t('Sign in')}
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: 'w-10 h-10' }
              }}
            />
          </SignedIn>

          <a href="https://github.com/Nev-Labs" target="_blank" rel="noopener noreferrer">
            <div className="size-8 hover:opacity-80 transition">
              <GithubIcon />
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};
