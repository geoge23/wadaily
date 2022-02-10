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

const Days = mongoose.models?.days || mongoose.model('days', DaysSchema)

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

const Schedules = mongoose.models?.schedules || mongoose.model('schedules', SchedulesSchema)

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    meta: {
        type: Object,
        required: true,
        default: {}
    }
})

const User = mongoose.models?.users || mongoose.model('users', UserSchema)

const LoginEventSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    secret: {
        type: String,
        required: true
    },
    completed: Boolean,
    date: {
        type: Date,
        required: true,
        default: new Date()
    }
})

const LoginEvent = mongoose.models?.loginEvents || mongoose.model('loginEvents', LoginEventSchema)

export {
    Days,
    Schedules,
    User,
    LoginEvent
}