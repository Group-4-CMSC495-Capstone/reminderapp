const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'reminderapp',
    password: 'admin',
    port: 5432,
})
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

    pool.query('SELECT * FROM reminders WHERE user_id = $1', [id], (error, results) => {
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
        response.status(201).send(`User added with ID: ${username}`)
    })
}

const createReminder = (request, response) => {
    const id = parseInt(request.params.id)
    const {date, descr, notify_date, name} = request.body

    pool.query('INSERT INTO reminders (date,descr,notify_date,user_id,event_name) VALUES ($1, $2, $3, $4,$5)', [date, descr, notify_date, id, name], (error, results) => {
        if (error) {
            response.status(400).json(error)
            return
        }
        response.status(201).send(`Reminder added with ID: ${name}`)
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
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

/*const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).json(error)
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}*/

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    getReminders,
    createReminder,
    getReminderById,
    getReminderByUserId
    //deleteUser,
}
