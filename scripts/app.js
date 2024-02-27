const form = document.querySelector("form");

const email = document.getElementById("email");
const emailError = document.querySelector("#email + span.error");

const subject = document.getElementById("subject");
const subjectError = document.querySelector("#subject + span.error");

const Message = document.getElementById("massege");
const massegeError = document.querySelector("#massege + span.error");

const firstname = document.getElementById("firstname");
const firstnameError = document.querySelector("#firstname + span.error");

const lastname = document.getElementById("lastname");
const lastnameError = document.querySelector("#lastname + span.error");

const phone = document.getElementById("phone");
const phoneError = document.querySelector("#phone + span.error");


email.addEventListener("input", (event) => { setEventToInput(email, emailError, validateEmail()) });
subject.addEventListener("input", (event) => { setEventToInput(subject, subjectError, validatefield(subject,subjectError,200)) });
Message.addEventListener("input", (event) => { setEventToInput(Message, massegeError, validatefield(Message,massegeError,600)) });
firstname.addEventListener("input", (event) => { setEventToInput(firstname, firstnameError, validateName(firstname,firstnameError)) });
lastname.addEventListener("input", (event) => { setEventToInput(lastname, lastnameError, validateName(lastname,lastnameError)) });
phone.addEventListener("input", (event) => { setEventToInput(phone, phoneError, validatePhone()) });

function setEventToInput(input, inputError, errorFunction) {
    if(!errorFunction){
        inputError.className = "error active";

    }else{
        inputError.textContent = "";
        inputError.className = "error";
    }
}

function validateForm(){
    if( !validateName(firstname,firstnameError) || !validateName(lastname,lastnameError || !validatePhone() || !validateEmail() ||!validatefield(subject,subjectError,200) || validatefield(Message,massegeError,600))){
        return false
    }else{
        return true
    }

}



function validateEmail() {
    if (email.validity.valueMissing) {
        // If the field is empty,
        // display the following error message.
        emailError.textContent = "";
        emailError.textContent = "vul een e-mail aderess in";
        return false
        
    } else if (email.validity.typeMismatch) {
        // If the field doesn't contain an email address,
        // display the following error message.
        emailError.textContent = "";
        emailError.textContent = "De ingevoerde waarde moet een e-mailadres zijn.";
        return false
    } else if (email.validity.tooShort) {
        // If the data is too short,
        // display the following error message.
        emailError.textContent = "";
        emailError.textContent = `E-mail zou op zijn minst ${email.minLength} karakters moeten zijn; jij hebt er ${email.value.length}.`;
        return false
    }
    emailError.textContent = "";
    return true

}

function validatefield(field, error, MaxwordCount) {
    if(field.validity.valueMissing){
        error.textContent = "";
        error.textContent = `vul een ${field.labels[0].textContent} in.`;
        return false
    }
    if(field.value.length > MaxwordCount){
        error.textContent = "";
        error.textContent = `je kunt maar ${MaxwordCount} tekens gebruiken`;
        return false
    }
    error.textContent = "";
     return true
 }

 function validateName(name, nameError) {
    if(name.validity.valueMissing){
        nameError.textContent = "";
        nameError.textContent = `vul een ${name.labels[0].textContent} in.`;
        return false
    }
     // Set the styling appropriately
     nameError.textContent = "";
     return true
 }

 function validatePhone() {
    
    let regex = new RegExp(/(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/);
    console.log(regex.test(phone.value));
    if(phone.validity.valueMissing){
        phoneError.textContent = "";
        phoneError.textContent = `vul een ${phone.labels[0].textContent} in.`;
        return false
    }else if (!regex.test(phone.value)) {
        phoneError.textContent = "";
        phoneError.textContent = "Invalid phone number";
    return false
    }

     phoneError.textContent = "";
     return true
 }


        const sendButton = document.querySelector("#sendButton")
        const sendButtonText = document.querySelector("#sendButton .text")
sendButton.addEventListener("click", async (event) => {
    // Then we prevent the form from being sent by canceling the event
    event.preventDefault();

    if(!validateForm()){
        return
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
                    const response = await fetch('http://127.0.0.1:5291/api/Captcha', {
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
                            let response = await fetch('http://127.0.0.1:5291/api/Contact', {
                                method: 'POST',
                                body: JSON.stringify({
                                    email: email.value, 
                                    subject: subject.value,
                                    firstname: firstname.value,
                                    lastname: lastname.value,
                                    phone: phone.value,
                                    Message: Message.value
                                }),
                                headers: { 
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json' 
                                }
                            });
                        
                            let data = await response.json();
                            console.log(data);

                            verzonden(data.success);
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