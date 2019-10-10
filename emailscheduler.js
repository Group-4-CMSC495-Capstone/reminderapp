function emailScheduler() {
    const axios = require('axios');

    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'reminderappemails@gmail.com',
            pass: 'https://group-4-cmsc495-capstone.github.io/'
        }
    });

    const mailOptions = {
        from: 'ReminderAppEmails@Gmail.com',
        //to: 'myfriend@yahoo.com',
        //subject: 'Sending Email using Node.js',
        //text: 'That was easy!'
    };

    let sentMails = new Map();

    function updateTime() {

        //var dateTime=new Date();
        //dateTime.setMilliseconds(0);
        //dateTime.setSeconds(0);

        //console.log(dateTime.toUTCString());

        console.log(sentMails);

        axios.get('https://remind-a-p-p.herokuapp.com/email')
            .then((data) => {
                let emails = data.data;

                if (!Object.keys(emails).length) {

                    console.log("NO EMAILS at " + new Date());
                    return;

                }

                //console.log(data.data);

                for (let index in emails) {

                    console.log(emails[index].event_id);
                    console.log(sentMails.has(emails[index].event_id));

                    if (sentMails.has(emails[index].event_id)) {

                        continue;

                    }

                    console.log("Found reminder #" + index);
                    mailOptions.subject = "Reminder! " + emails[index].event_name;
                    mailOptions.text = "Hello!\nHere's a reminder for: " + emails[index].descr + "\nAt: " + emails[index].notify_date + ", as you requested!";

                    axios.get('https://remind-a-p-p.herokuapp.com/users/' + emails[index].user_id)
                        .then((data) => {

                            console.log(data);

                            mailOptions.to = data.data[0].email;
                            console.log(mailOptions);

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });

                            sentMails.set(emails[index].event_id, true);
                            console.log(sentMails);

                        })
                        .catch((error) => {
                            console.error(error)
                        });


                }

            })
            .catch((error) => {
                console.error(error)
            });

        /*if (!emails[0]){

            console.log("Time is: "+new Date()+", no emails!");

        }*/

    }

    function refreshCache() {

        sentMails = new Map();

        console.log("Cache refreshed!");

    }


    updateTime();
    setInterval(refreshCache, 60000);
    setInterval(updateTime, 5000);
}

module.exports=emailScheduler;
