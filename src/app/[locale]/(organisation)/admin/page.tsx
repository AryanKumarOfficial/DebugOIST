'use client';

import dynamic from 'next/dynamic'
import { Tabs } from '@/src/components/ui/tabs'
import { BackgroundBeamsWithCollision } from '@/src/components/ui/background-beams-with-collision'
import { Suspense } from 'react'
import { motion } from 'framer-motion'

// Animation styles component
const AnimationStyles = () => {
  return (
    <style jsx global>{`
      @keyframes slow-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      @keyframes slow-spin-reverse {
        from {
          transform: rotate(360deg);
        }
        to {
          transform: rotate(0deg);
        }
      }
      
      .animate-slow-spin {
        animation: slow-spin 25s linear infinite;
      }
      
      .animate-slow-spin-reverse {
        animation: slow-spin-reverse 20s linear infinite;
      }
      
      .bg-gradient-conic {
        background-image: conic-gradient(var(--tw-gradient-stops));
      }
    `}</style>
  )
}

// Dynamically import the EventsComponent to optimize loading
const EventsComponent = dynamic(
  () => import('@/src/app/[locale]/components/admin/Events'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    )
  }
)

// Define Members component before it's used
function Members() {
  return (
    <div className="w-full overflow-visible text-white">
      <div className="w-full overflow-visible bg-black/20 rounded-2xl shadow-lg border border-white/10 backdrop-blur-xl transition-all duration-300">
        <BackgroundBeamsWithCollision className="rounded-2xl h-[500px] overflow-hidden">
          <div className="relative z-20 p-8 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500 rounded-full blur-[80px] opacity-30"></div>
            <h2 className='relative z-20 text-center font-sans text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-6'>
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                Members Management
              </span>
            </h2>
            
            <p className="text-center text-purple-200/90 max-w-2xl mb-8">Our interactive members management system is coming soon with comprehensive tools for member tracking, communication, and engagement metrics.</p>
            
            <div className='relative mx-auto inline-block w-max'>
              <div className='absolute left-0 top-[1px] bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text bg-no-repeat py-4 text-transparent'>
                <span className=''>Coming Soon</span>
              </div>
              <div className='relative bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text bg-no-repeat py-4 text-transparent'>
                <span className=''>Coming Soon</span>
              </div>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </div>
    </div>
  )
}

const AdminPage = () => {
  const tabs = [
    {
      title: 'Events',
      value: 'events',
      content: (
        <Suspense fallback={
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
          </div>
        }>
          <div className="w-full overflow-x-visible overflow-y-visible text-white">
            <div className="w-full overflow-visible bg-black/60 dark:bg-neutral-900/90 rounded-xl shadow-lg border border-purple-500/20 backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/10">
              <div className="p-6 sm:p-8">
                <EventsComponent />
              </div>
            </div>
          </div>
        </Suspense>
      )
    },
    {
      title: 'Members',
      value: 'members',
      content: <Members />
    }
  ]

  return (
    <section className='min-h-screen w-full antialiased bg-gradient-to-b from-black via-purple-950 to-black text-white relative overflow-hidden'>
      <AnimationStyles />
      {/* Premium animated background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-20"></div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] bg-gradient-conic from-purple-500/40 via-purple-900/40 to-indigo-500/40 rounded-full blur-[120px] animate-slow-spin"></div>
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] bg-gradient-conic from-indigo-500/40 via-purple-900/40 to-purple-500/40 rounded-full blur-[120px] animate-slow-spin-reverse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
        <div className="flex flex-col space-y-8 max-w-7xl mx-auto">
          {/* Header section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center justify-center px-4 py-1 text-xs font-medium bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-200 rounded-full backdrop-blur-xl border border-purple-500/20">
                Organization Management
              </span>
              <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 leading-tight tracking-tight'>
          Admin Dashboard
        </h1>
              <p className="text-lg text-purple-200/70 max-w-2xl">
                Manage your organization's events, members and resources from this central hub.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Event
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 bg-white/5 text-white rounded-xl border border-white/10 transition-all duration-200 backdrop-blur-sm hover:bg-white/10 shadow-lg shadow-black/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { label: 'Total Events', value: '24', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'from-blue-500/20 to-indigo-600/20', iconColor: 'from-blue-500 to-indigo-600' },
              { label: 'Active Members', value: '182', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'from-purple-500/20 to-fuchsia-600/20', iconColor: 'from-purple-500 to-fuchsia-600' },
              { label: 'Registrations', value: '512', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'from-orange-500/20 to-amber-600/20', iconColor: 'from-orange-500 to-amber-600' },
              { label: 'Engagement', value: '87%', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'from-teal-500/20 to-emerald-600/20', iconColor: 'from-teal-500 to-emerald-600' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="group relative bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/5 transition-all duration-300"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative flex justify-between items-start">
                  <div>
                    <p className="text-purple-200/70 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2 bg-clip-text">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.iconColor} p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                </div>
                
                <div className="relative mt-4 flex items-center text-xs">
                  <span className="text-green-400 flex items-center font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    12% 
                  </span>
                  <span className="text-purple-200/50 ml-1.5">vs last month</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
        <Tabs
          tabs={tabs}
              containerClassName="mb-6 flex-wrap bg-black/20 backdrop-blur-xl p-1.5 rounded-xl border border-white/10"
              tabClassName="text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 text-purple-200/70 hover:text-white hover:bg-white/5"
              contentClassName="pt-6 min-h-[450px] w-full"
              activeTabClassName="bg-white/10 text-white shadow-sm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AdminPage
