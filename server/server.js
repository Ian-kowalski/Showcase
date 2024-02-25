const express = require('express');

const app = express();
const port = 3000;
let cors = require('cors')
app.use(cors());
app.use(express.json());

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hallo wereld!");
});

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c72c7fa069a508",
      pass: "d0726dda0e97ca"
    }
  });

app.post('/form', async (req, res) => {
    let email = req.body.email;
    let subject = req.body.subject;
    let massege = req.body.massege;

    const info = await transport.sendMail({
        from: email,
        to: "ian.kowalski@hotmail.com",
        subject: subject, // Subject line
        text: massege, // plain text body
        html: "<b>"+ massege +"</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
    res.json({email: email, subject: subject,massege: massege});
});

app.listen(port, () => console.log(`Data API listening on port ${port}!`))

// Ontvang de captcha gegevens vanuit een POST request
app.post('/captcha', async (req, res) => {
    token = req.body.response;
    // Vul hier je secret key in van Google reCAPTCHA, check dat je dit op een veilige (security) manier doet.
    let secret = "6LfSDHgpAAAAAJP3-VI76dfN7BW2QtgoEc2e06GZ";
    // Verstuur de gegevens naar de Google Api
    try {
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
            method: "POST",
            body: JSON.stringify({
                secret: secret,
                response: token
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // De response vanuit Google (meer info: https://developers.google.com/recaptcha/docs/v3#site_verify_response):
        const result = await response.json();
       // Stuur het resultaat weer terug naar je client
        res.json(result);
    }
    catch (e) {
        console.log(e);
    }
});
