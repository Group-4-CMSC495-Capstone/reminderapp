const Pool = require('pg').Pool
const pool = new Pool({
    user: 'cvogfomzqoijrb',
    host: 'ec2-174-129-43-40.compute-1.amazonaws.com',
    database: 'dg6q97m1lj6c3',
    password: 'ac8687544da4959b5c3c70e559659d5bfcca527035ee43e9169a8fbf64c31d56',
    port: 5432,
})

const getRemindersComingUp = (request, response) => {
    //const id = parseInt(request.params.id)

    var dateTime=new Date();
    dateTime.setMilliseconds(0);
    dateTime.setSeconds(0);

    pool.query('SELECT * FROM reminders where notify_date = $1', [dateTime.toUTCString()], (error, results) => {

        if (error) {
            response.status(400).json(error)
            return
        }

        response.status(200).json(results.rows)

    })
}

const authenticate = (request, response) => {
    //const id = parseInt(request.params.id)

    const {username, password, seq} = request.body

    console.log("TEST")

    pool.query('SELECT * FROM users WHERE username = $1 AND password= $2 AND user_id = $3', [username, password, seq], (error, results) => {

        console.log(username)
        console.log(password)

        if (error) {
            response.status(400).json(error)
            return
        }

        response.status(200).json(results.rows)

    })
}

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if (error) {
            response.status(400).json(error)
            return
            //response.status(400).json(error)
        }
        response.status(200).json(results.rows)
    })
}

const getReminders = (request, response) => {
    pool.query('SELECT * FROM reminders ORDER BY user_id ASC, notify_date DESC', (error, results) => {
        if (error) {
            response.status(400).json(error)
            return
            //response.status(400).json(error)
        }
        response.status(200).json(results.rows)
    })
}


const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).json(error)
            return
        }
        response.status(200).json(results.rows)
    })
}

const getReminderById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM reminders WHERE event_id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).json(error)
            return
        }
        response.status(200).json(results.rows)
    })
}

const getReminderByUserId = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM reminders WHERE user_id = $1 ORDER BY notify_date DESC', [id], (error, results) => {
        if (error) {
            response.status(400).json(error)
            return
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const {username, password, email, phone} = request.body

    pool.query('INSERT INTO users (username, password, email, phone) VALUES ($1, $2, $3, $4)', [username, password, email, phone], (error, results) => {
        if (error) {
            response.status(400).json(error)
            return
        }
        response.status(201).json(`User added with ID: ${username}`)
    })
}

const createReminder = (request, response) => {
    const id = parseInt(request.params.id)
    const {date, description, notify_date, name} = request.body

    pool.query('INSERT INTO reminders (date,descr,notify_date,user_id,event_name) VALUES ($1, $2, $3, $4,$5)', [date, description, notify_date, id, name], (error, results) => {
        if (error) {
            response.status(400).json(error)
            return
        }
        response.status(201).json(`Reminder added with ID: ${name}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const {email} = request.body

    pool.query(
        'UPDATE users SET email = $1 WHERE id = $2',
        [email, id],
        (error, results) => {
            if (error) {
                response.status(400).json(error)
                return
            }
            response.status(200).json(`User modified with ID: ${id}`)
        }
    )
}

const deleteReminder = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM reminders WHERE event_id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).json(error)
        }
        response.status(200).json(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    getReminders,
    createReminder,
    getReminderById,
    getReminderByUserId,
    authenticate,
    deleteReminder,
    getRemindersComingUp,
    //deleteUser,
}
