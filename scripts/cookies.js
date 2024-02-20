class GDPR {

    constructor() {
        this.bindEvents();

        if(this.cookieStatus() !== 'accept') this.showGDPR();
    }

    bindEvents() {
        let buttonAccept = document.querySelector('.gdpr-consent__button--accept');
        buttonAccept.addEventListener('click', () => {
            this.cookieStatus('accept');
            this.hideGDPR();
        });

        let buttonReject = document.querySelector('.gdpr-consent__button--reject');
        buttonReject.addEventListener('click', () => {
            this.cookieStatus('reject');
            this.hideGDPR();
        });
    }



    cookieStatus(status) {

        if (status) {
            localStorage.setItem('gdpr-consent-choice', status);
            this.saveDate();
        }
        return localStorage.getItem('gdpr-consent-choice');
    }
    
    saveDate(){
        const date = new Date
        let metadata ={
            datum:  date.toLocaleDateString("nl-NL"),
            time:  date.toLocaleTimeString()
        }

        localStorage.setItem('gdpr-consent-metaData', JSON.stringify(metadata));
    }

    hideGDPR(){
        document.querySelector(`.gdpr-consent`).classList.add('hide');
        document.querySelector(`.gdpr-consent`).classList.remove('show');
    }

    showGDPR(){
        document.querySelector(`.gdpr-consent`).classList.add('show');
    }

}

const gdpr = new GDPR();