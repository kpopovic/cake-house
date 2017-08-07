import LocalizedStrings from 'react-localization';

const locale = new LocalizedStrings({
    hr: {
        login_page_title: "Unesite podatke korisničkog računa",
        login_page_username: "Naziv korisnika",
        login_page_password: "Lozinka korisnika",
        login_page_login: "Prijavite se",
        'login_page.error.title': "Pogreška u prijavi korisnika",
        'login_page.error.username.empty': "Naziv korisnika nije unešen",
        'login_page.error.password.empty': "Lozinka korisnika nije unešena",
        'login_page.error.username.length': "Korisničko ime mora imati {0} do {1} znakova",
        'login_page.error.password.length': "Lozinka mora imati {0} do {1} znakova"
    }
});

export default locale;
