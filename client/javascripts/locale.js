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
        'login_page.error.password.length': "Lozinka mora imati {0} do {1} znakova",

        index_page_material_menu_title: "Materijal",
        index_page_signout: "Izlaz",

        material_table_empty: "https://semantic-ui.com/images/wireframe/media-paragraph.png",
        material_table_header_name: "Naziv",
        material_table_header_unit: "Jedinica",
        material_table_header_quantityInStock: "Stanje skladišta",
        material_table_header_quantityToBuy: "Za kupiti",
        material_table_header_edit: "Izmjena",
        material_table_btn_edit: "Izmjeni",
        material_table_btn_add: "Unesi materijal",

        material_table_modal_add_title: "Unos novog materijala",
        material_table_modal_edit_title: "Izmjena materijala",
        material_table_modal_btn_add: "Potvrdi",
        material_table_modal_btn_cancel: "Poništi",
        material_table_modal_quantityInStock: "Stanje skladišta",
        material_table_modal_quantityInStock_content: "Unesite stanje skladišta",
        material_table_modal_unit_content: "Unesite jedinicu materijala",

        material_table_modal_name_content: "Unesite naziv materijala",

        material_type_L: "Litra",
        material_type_kg: "Kilogram",

        pagination_btn_next: "Naprijed",
        pagination_btn_previous: "Nazad"
    }
});

export default locale;
