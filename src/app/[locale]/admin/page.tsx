import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  Users,
  Settings,
  Activity,
  Plus,
  BarChart3,
  Bell,
  Clock,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAdminStats } from './action'

const AdminPage = async () => {
  const { events, pendingApprovals, activeMemebers, upcomingEvents } =
    await getAdminStats()
  const stats = [
    {
      title: 'Total Events',
      value: events || '0',
      change: 'Lifetime',
      icon: Calendar,
      color: 'text-blue-400',
      link: '/admin/events'
    },
    {
      title: 'Active Members',
      value: activeMemebers || '1',
      change: 'Total registered',
      icon: Users,
      color: 'text-indigo-400',
      link: '/admin/members'
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals || '0',
      change: 'Requires action',
      icon: Bell,
      color: 'text-amber-400',
      link: '/admin/registrations'
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents || '0',
      change: 'Scheduled',
      icon: Clock,
      color: 'text-emerald-400',
      link: '/admin/events'
    }
  ]

  const recentActivity = [
    {
      title: 'New Event Registration',
      description: 'Team "Code Warriors" registered for Hackathon 2024',
      time: '2 hours ago',
      type: 'registration'
    },
    {
      title: 'Event Created',
      description: 'New workshop "Web Development Basics" added',
      time: '5 hours ago',
      type: 'event'
    },
    {
      title: 'Member Joined',
      description: 'John Doe joined as a new member',
      time: '1 day ago',
      type: 'member'
    }
  ]

  return (
    <section className='min-h-screen w-full bg-black px-4 py-6 antialiased sm:px-6 lg:px-8'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -left-4 top-0 h-72 w-72 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter'></div>
        <div className='absolute -right-4 top-32 h-72 w-72 rounded-full bg-blue-500 opacity-15 mix-blend-multiply blur-3xl filter'></div>
        <div className='absolute -bottom-32 left-1/2 h-72 w-72 rounded-full bg-indigo-500 opacity-15 mix-blend-multiply blur-3xl filter'></div>
      </div>
      <div className='relative mx-auto my-10 flex max-w-7xl flex-col space-y-6'>
        <div className='relative'>
          <h1 className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl'>
            Admin Dashboard
          </h1>
          <p className='mt-2 text-zinc-400'>
            Welcome back! Here's what's happening with your organization.
          </p>
        </div>

        {/* Quick Stats */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => (
            <Link href={stat.link} key={index}>
              <Card className='w-full cursor-pointer border-zinc-800 bg-zinc-950/50 backdrop-blur-lg transition-colors hover:border-blue-500/50'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-zinc-400'>{stat.title}</p>
                      <h3 className='mt-1 text-2xl font-bold'>{stat.value}</h3>
                      <p className='mt-1 text-sm text-zinc-500'>
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`rounded-full bg-zinc-900/50 p-3 ${stat.color}`}
                    >
                      <stat.icon className='h-6 w-6' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Quick Actions */}
          <Card className='border-zinc-800 bg-zinc-950/50 backdrop-blur-lg'>
            <CardHeader>
              <CardTitle className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent'>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <Link href='/admin/events/new'>
                  <Button className='w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'>
                    <Plus className='mr-2 h-4 w-4' />
                    Create New Event
                  </Button>
                </Link>
                <Link href='/admin/members'>
                  <Button
                    variant='outline'
                    className='w-full border-zinc-700 hover:border-blue-500/50 hover:bg-zinc-800'
                  >
                    <Users className='mr-2 h-4 w-4' />
                    Manage Members
                  </Button>
                </Link>
                <Link href='/admin/registrations'>
                  <Button
                    variant='outline'
                    className='w-full border-zinc-700 hover:border-blue-500/50 hover:bg-zinc-800'
                  >
                    <Activity className='mr-2 h-4 w-4' />
                    Review Registrations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className='border-zinc-800 bg-zinc-950/50 backdrop-blur-lg'>
            <CardHeader>
              <CardTitle className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent'>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className='rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-blue-500/50'
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <h4 className='font-semibold'>{activity.title}</h4>
                        <p className='mt-1 text-sm text-zinc-400'>
                          {activity.description}
                        </p>
                      </div>
                      <span className='text-xs text-zinc-500'>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Overview */}
        <Card className='border-zinc-800 bg-zinc-950/50 backdrop-blur-lg'>
          <CardHeader>
            <CardTitle className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent'>
              Analytics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <div className='rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-blue-500/50'>
                <div className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5 text-blue-400' />
                  <h3 className='font-semibold'>Event Participation</h3>
                </div>
                <div className='mt-4 flex h-32 items-center justify-center'>
                  <p className='text-zinc-400'>Chart coming soon</p>
                </div>
              </div>
              <div className='rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-blue-500/50'>
                <div className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5 text-indigo-400' />
                  <h3 className='font-semibold'>Member Growth</h3>
                </div>
                <div className='mt-4 flex h-32 items-center justify-center'>
                  <p className='text-zinc-400'>Chart coming soon</p>
                </div>
              </div>
              <div className='rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-blue-500/50'>
                <div className='flex items-center gap-2'>
                  <Activity className='h-5 w-5 text-purple-400' />
                  <h3 className='font-semibold'>Registration Trends</h3>
                </div>
                <div className='mt-4 flex h-32 items-center justify-center'>
                  <p className='text-zinc-400'>Chart coming soon</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default AdminPage
