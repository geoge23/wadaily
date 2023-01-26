import mongoose from 'mongoose';

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

const NotificationSchema = new mongoose.Schema({
    "title": String,
    "text": String,
    "goodUntil": Date,
    "link": String
})

const Notifications = mongoose.models.notifications || mongoose.model('notifications', NotificationSchema)

const AnnouncementSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['day', 'week']
    },
    date: {
        type: String
    },
    week: {
        type: Number
    },
    list: [String]
})

const Announcements = mongoose.models.announcements || mongoose.model('announcements', AnnouncementSchema)

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    studentId: {
        type: String,
        unique: true,
        required: true
    },
    preferences: {
        type: Object,
        required: true,
        default: {}
    },
    credentials: {
        type: Object,
        required: true,
        default: {}
    },
}, {minimize: false})

const Users = mongoose.models.users || mongoose.model('users', UserSchema)

const ChallengeSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    challenge: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
})

const Challenges = mongoose.models.challenges || mongoose.model('challenges', ChallengeSchema)

export {
    Days,
    Schedules,
    Notifications,
    Announcements,
    Users,
    Challenges
};
