import mongoose from 'mongoose'

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    return
  }

  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  isConnected = db.connections[0].readyState
}

export default dbConnect

const DaysSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    schedule: {
        type: String,
        required: true
    }
})

const Days = mongoose.models.days || mongoose.model('days', DaysSchema)

const SchedulesSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "friendlyName": {
        type: String,
        required: true
    },
    "schedule": [{
        "name": {
            type: String,
            required: true
        },
        "code": {
            type: String,
            required: true
        },
        "startTime": {
            type: String,
            required: true
        },
        "endTime": {
            type: String,
            required: true
        }
    }]
})

const Schedules = mongoose.models.schedules || mongoose.model('schedules', SchedulesSchema)

export {
    Days,
    Schedules
}