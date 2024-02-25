const form = document.querySelector("form");

const email = document.getElementById("email");
const emailError = document.querySelector("#email + span.error");

const subject = document.getElementById("subject");
const subjectError = document.querySelector("#subject + span.error");

const massege = document.getElementById("massege");
const massegeError = document.querySelector("#massege + span.error");

email.addEventListener("input", (event) => {
    // Each time the user types something, we check if the
    // form fields are valid.

    if (email.validity.valid ) {
        // In case there is an error message visible, if the field
        // is valid, we remove the error message.
        emailError.textContent = ""; // Reset the content of the message
        emailError.className = "error"; // Reset the visual state of the message
    }
    else {
        // If there is still an error, show the correct error
        showEmailError();
    }
});

subject.addEventListener("input", (event) => {
    if(subject.validity.valid){
        subjectError.textContent = ""; // Reset the content of the message
        subjectError.className = "error"; // Reset the visual state of the message
    } 
    else {
        // If there is still an error, show the correct error
        showSubjectError();
    }

});

massege.addEventListener("input", (event) => {
    if(massege.validity.valid){
        massegeError.textContent = ""; // Reset the content of the message
        massegeError.className = "error"; // Reset the visual state of the message
    } 
    else {
        // If there is still an error, show the correct error
        showMassegeError();
    }

});

function showError(){
    showEmailError()
    showSubjectError()
    showMassegeError()
}

function showEmailError() {
    if (email.validity.valueMissing) {
        // If the field is empty,
        // display the following error message.
        emailError.textContent = "You need to enter an e-mail address.";
    } else if (email.validity.typeMismatch) {
        // If the field doesn't contain an email address,
        // display the following error message.
        emailError.textContent = "Entered value needs to be an e-mail address.";
    } else if (email.validity.tooShort) {
        // If the data is too short,
        // display the following error message.
        emailError.textContent = `E-mail should be at least ${email.minLength} characters; you entered ${email.value.length}.`;
    }
    // Set the styling appropriately
    emailError.className = "error active";
}

function showSubjectError() {
   if(subject.validity.valueMissing){
        subjectError.textContent = "You need to enter an subject.";
    }

    if(subject.validity.length > 200){
        console.log("200");
        subjectError.textContent = "200";
    }
    // Set the styling appropriately
    subjectError.className = "error active";
}

function showMassegeError() {
    if(massege.validity.valueMissing){
        massegeError.textContent = "You need to enter an massege address.";
    }
     // Set the styling appropriately
     massegeError.className = "error active";
 }

        const sendButton = document.querySelector("#sendButton")
        const sendButtonText = document.querySelector("#sendButton .text")
sendButton.addEventListener("click", async (event) => {
    // Then we prevent the form from being sent by canceling the event
    event.preventDefault();



        // if the email field is valid, we let the form submit
        if (!email.validity.valid || !subject.validity.valid || !massege.validity.valid) {
            // If it isn't, we display an appropriate error message
            showError();
            return;
        }

        if (!sendButton.classList.contains("active")) {
            sendButton.classList.add("active")

        grecaptcha.ready( function () {
            grecaptcha.execute('6LfSDHgpAAAAAK_I_INXeLkkkIhYWS__b4akWAkE', { action: 'submit' }).then(async function (token) {
                const formSubmit = document.getElementById('submit');
                console.log(formSubmit)
                try {
                    // Verstuur het eerst naar jouw eigen server.
                    // Voor dit voorbeeld is een nodejs server bijgevoegd (Zie map server).
                    // Je kunt dit voor je showcase ook aanpassen door je eigen server project (bijv. ASP.NET) te gebruiken.
                    const response = await fetch('http://localhost:3000/captcha', {
                        method: "POST",
                        body: JSON.stringify({
                            response: token
                        }),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    // handel het resultaat af en bepaal of je te maken hebt met een mens of een bot.
                    const result = await response.json();
                    let isHuman;

                    if (result.score > 0.8) {
                        isHuman = true;
                    }
                    else {
                        isHuman = false;
                    }


                    if (isHuman) {
                        try {
                            let response = await fetch('http://localhost:3000/form', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({email: email.value, subject: subject.value, massege: massege.value}) 
                            });
                        
                            let data = await response.json();
                            //console.log(data);

                            verzonden(true);
                        } catch (error) {
                            verzonden(false);
                        }
                    }
                }
                catch (e) {
                    verzonden(false);
                }

                function verzonden( bool ) {
                    
                    if(bool){
                        sendButton.classList.add("sent");
                        sendButtonText.innerText = "verzonden"
                    }
                    else{
                        sendButton.classList.add("notSent");
                        sendButtonText.innerText = "niet verzonden"
                    }
                    
                    setTimeout(() => {
                        if(bool){
                            sendButtonText.innerText = "verzend"
                            sendButton.classList.remove("active");
                            sendButton.classList.remove("sent");
                        }
                        else{
                            sendButtonText.innerText = "try again later"
                            sendButton.classList.remove("active");
                            sendButton.classList.remove("notSent");
                        }

                        form.reset();
                    }, 2000);
                }
            });
        });
    }
});