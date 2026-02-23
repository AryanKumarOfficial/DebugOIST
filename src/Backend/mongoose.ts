import mongoose from 'mongoose'

const connect = async () => {
  if (mongoose.connection.readyState >= 1) return
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error(error)
  }
}
export default connect
