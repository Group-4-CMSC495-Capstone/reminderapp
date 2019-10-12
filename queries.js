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

    const {username, password} = request.body

    console.log("TEST")

    pool.query('SELECT * FROM users WHERE username = $1 AND password= $2', [username, password], (error, results) => {

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
    const {email, password} = request.body

    let query="UPDATE users SET ";

    let i=0;
    let vals=[];

    if (email){

        query+=" email = $"+(++i);
        vals.push(email);

    }

    if (email && password){

        query+=" , ";

    }

    if (password){

        query+=" password = $"+(++i);
        vals.push(password);

    }

    query+=" WHERE user_id = $"+(++i);
    vals.push(id);

    console.log(query);
    console.log(vals);


    pool.query(
        query,
         vals,
        (error, results) => {
            if (error) {
                response.status(400).json(error)
                return
            }
            response.status(200).json(`User modified with ID: ${id}`)
        }
    )
}

const updateReminder = (request, response) => {

    const id = parseInt(request.params.id)
    const {description, notify_date, name} = request.body

    let vars=[description,notify_date,name];

    console.log("SENT: "+vars);

    //pool.query('INSERT INTO reminders (date,descr,notify_date,user_id,event_name) VALUES ($1, $2, $3, $4,$5)', [date, description, notify_date, id, name],

    let query="UPDATE reminders SET ";

    let i=0;
    let vals=[];

    let sets="";

    for (let col in vars){

        console.log("COL: "+vars[col]);
        console.log("LENGTH: "+vars[col].length);
        console.log("LENGTH > 0? "+vars[col].length>0);

        console.log(typeof col+" "+typeof vars[col]+" "+typeof vars[col].length);

        if (vars[col].length!==0){

            console.log(vars[col].length+" !== 0!");

            switch(col){

                case '0':sets+=" descr = $"+(++i);
                    vals.push(vars[col]); break;
                case '1':sets+=" notify_date = $"+(++i);
                    vals.push(vars[col]); break;
                case '2':sets+=" event_name = $"+(++i);
                    vals.push(vars[col]);  break;

            }

            sets+=",";

        }
        //i++;

    }

    if (sets.length===1){

        response.status(200).json(`No values to update.`);
        return;

    }

    query+=sets.substring(0, sets.length-1)+" WHERE event_id = $"+(++i);

    vals.push(id);

    console.log(query);
    console.log(vals);

    pool.query(
        query,
        vals,
        (error, results) => {
            if (error) {
                response.status(400).json(error)
                return
            }
            response.status(200).json(`Reminder modified with ID: ${id}`)
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
    updateReminder,
    //deleteUser,
}
