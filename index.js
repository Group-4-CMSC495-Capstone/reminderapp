const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const emailer=require('./emailscheduler')
const port = process.env.PORT || 3000
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({info: 'Node.js, Express, and Postgres API'})
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/authenticate', db.authenticate)

app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)

app.get('/reminders', db.getReminders)
app.get('/reminders/:id', db.getReminderById)
app.get('/reminders/user/:id', db.getReminderByUserId)
app.put('/reminders/:id', db.updateReminder)

app.get('/email/', db.getRemindersComingUp)

app.post('/reminders/:id', db.createReminder)
app.delete('/reminders/:id', db.deleteReminder)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

emailer();
