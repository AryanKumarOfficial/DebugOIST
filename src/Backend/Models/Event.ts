import mongoose from 'mongoose'

export interface IEvent {
  _id?: string
  title: string
  description: string
  date: string
  time: string
  registration: string
  publicId: string
  category: string
  venue: string
  past: boolean
  participants?: number
}

const EventSchema = new mongoose.Schema<IEvent>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    registration: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    venue: {
      type: String,
      required: true
    },
    past: {
      type: Boolean,
      default: false,
      required: true
    },
    participants: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const Event: mongoose.Model<IEvent> =
  mongoose.models.Event || mongoose.model('Event', EventSchema)

export default Event
