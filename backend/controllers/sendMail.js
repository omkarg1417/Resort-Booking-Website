const { text } = require('express');
const nodeMailer = require('nodemailer');
const {email, password} = require('../config/index');


const sendBookingMail = async (user, resort, booking, details) => {
    const emailInfo = {
        creation: {
            subject: `Your booking was successful for ${resort.name}`,
            html: ``
        },
        deletion: {
            subject: `Your booking was successfully cancelled for ${resort.name}`,
            html: ``
        }
    }
    try {
        console.log(email, password);
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });

        const info = await transporter.sendMail({
            from: email,
            to: user.email,
            subject: (details.isBookingCreation ? emailInfo.creation.subject : emailInfo.deletion.subject),
            // html: (details.isBookingCreation ? emailInfo.creation.html : emailInfo.deletion.html),
            html:`<div>
            <h4>Registration - Team Midori/navya</h4>
            <p>
                Hello <strong>${user.name}</strong>,
            </p>
            <p>
                &nbsp; &nbsp; &nbsp;Thank you for booking your resort ${resort.name}. Enjoy your trip between ${booking.checkInDate} to ${booking.checkOutDate}.
            </p>
            <p>
                Regards,
            </p>
            <p>
                Team Midori/navya.
            </p>
            </div>`
            // text:`${booking}`
            // subject: `Your booking is successful for ${resort.name}`,
            // html: `<h1>This is heading</h1>`
        });

        console.log(info);
        
    } catch(err) {
        console.log("ERROR: ", err);
    }
}

module.exports = {sendBookingMail}