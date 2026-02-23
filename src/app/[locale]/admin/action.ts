'use server'

import Event from '@/src/Backend/Models/Event'
import Registration from '@/src/Backend/Models/Registration'
import TeamRegistration from '@/src/Backend/Models/TeamRegistration'
import connect from '@/src/Backend/mongoose'

export const getAdminStats = async () => {
  await connect()
  const events = await Event.countDocuments()
  const users = await Registration.countDocuments()
  const pendingApprovals = await TeamRegistration.countDocuments({
    status: 'pending'
  })
  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = await Event.find({
    date: { $gte: today }
  }).countDocuments()

  return {
    events,
    activeMemebers: users,
    pendingApprovals,
    upcomingEvents
  }
}
