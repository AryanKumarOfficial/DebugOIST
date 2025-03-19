import dynamic from 'next/dynamic'
import { Tabs } from '@/src/components/ui/tabs'
import { BackgroundBeamsWithCollision } from '@/src/components/ui/background-beams-with-collision'
import { Suspense } from 'react'

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
            <div className="w-full overflow-visible bg-black/60 dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
              <div className="p-4 sm:p-6">
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
    <section className='min-h-screen w-full px-4 py-6 antialiased sm:px-6 lg:px-8'>
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300'>
          Admin Dashboard
        </h1>

        <Tabs
          tabs={tabs}
          containerClassName="mb-6 flex-wrap"
          tabClassName="text-sm sm:text-base whitespace-nowrap"
          contentClassName="pt-6 min-h-[400px] w-full"
          activeTabClassName="bg-purple-100 dark:bg-zinc-700"
        />
      </div>
    </section>
  )
}

export default AdminPage

function Members() {
  return (
    <BackgroundBeamsWithCollision className="rounded-xl h-64 sm:h-80 md:h-96">
      <div className="relative z-20 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <h2 className='relative z-20 text-center font-sans text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-black dark:text-white'>
          What&apos;s cooler than Beams?{' '}
          <div className='relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]'>
            <div className='absolute left-0 top-[1px] bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text bg-no-repeat py-4 text-transparent [text-shadow:0_0_rgba(0,0,0,0.1)]'>
              <span className=''>Exploding beams.</span>
            </div>
            <div className='relative bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text bg-no-repeat py-4 text-transparent'>
              <span className=''>Exploding beams.</span>
            </div>
          </div>
        </h2>
      </div>
    </BackgroundBeamsWithCollision>
  )
}
