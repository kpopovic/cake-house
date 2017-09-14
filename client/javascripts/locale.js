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

        index_page_material_menu_title: "Materijali",
        index_page_product_menu_title: "Proizvodi",
        index_page_orders_menu_title: "Narudžbe",

        index_page_signout: "Izlaz",

        table_empty: "https://semantic-ui.com/images/wireframe/media-paragraph.png",

        // material table
        material_table_search: "Pretraga materijala",
        material_table_header_name: "Naziv",
        material_table_header_unit: "Jedinica",
        material_table_header_quantity: "Količina",
        material_table_header_quantityInStock: "Stanje skladišta",
        material_table_header_quantityToBuy: "Za kupiti",
        material_table_header_edit: "Izmjena",
        material_table_btn_edit: "Izmjeni",
        material_table_btn_add: "Unesi materijal",

        material_table_modal_add_title: "Unos novog materijala",
        material_table_modal_edit_title: "Izmjena materijala",
        material_table_modal_quantityInStock: "Stanje skladišta",
        material_table_modal_quantityInStock_content: "Unesite stanje skladišta",
        material_table_modal_unit_content: "Unesite jedinicu materijala",
        material_table_modal_name_content: "Unesite naziv materijala",

        material_unit_L: "Litra",
        material_unit_kg: "Kilogram",
        material_unit_piece: "Komad",

        // product table
        product_table_search: "Pretraga proizvoda",
        product_table_header_name: "Naziv",
        product_table_header_quantity: "Količina materijala",
        product_table_header_edit: "Izmjena",
        product_table_btn_edit: "Izmjeni",
        product_table_btn_add: "Unesi proizvod",

        product_table_modal_add_title: "Unos novog proizvoda",
        product_table_modal_edit_title: "Izmjena proizvoda",

        product_table_modal_material_noResultsMessage: "Materijal nije pronađen",
        product_table_modal_material_quantity: "Količina materijala",
        product_table_modal_material_quantity_placeholder: "Unesite količinu za proizvodnju",

        product_table_modal_productName: "Naziv proizvoda",
        product_table_modal_productName_placeholder: "Unesite naziv proizvoda",
        product_table_modal_material_search: "Pretraga materijala",
        product_table_modal_material_search_placeholder: "Unesite naziv materijala",
        product_table_modal_btn_add: "Dodaj materijal",

        // order table
        order_table_search_placeholder: "Unesite naziv narudžbe",
        order_table_header_name: "Naziv",
        order_table_header_deliveryDate: "Rok dostave",
        order_table_header_state: "Status",
        order_table_header_clientName: "Klijent",
        order_table_header_clientName_placeholder: "Unesite naziv klijenta",
        order_table_header_clientPhone: "Telefon",
        order_table_header_clientPhone_placeholder: "Unesite broj telefona",
        order_table_header_quantity: "Količina proizvoda",
        order_table_header_edit: "Izmjena",
        order_table_btn_edit: "Izmjeni",
        order_table_btn_add: "Unesi naružbu",

        order_table_modal_add_title: "Unos nove narudžbe",
        order_table_modal_edit_title: "Izmjena narudžbe",
        order_table_modal_product_search: "Pretraga proizvoda",
        order_table_modal_product_search_placeholder: "Unesite naziv proizvoda",
        order_table_modal_product_noResultsMessage: "Proizvod nije pronađen",
        order_table_modal_product_quantity: "Količina proizvoda (komad)",
        order_table_modal_product_quantity_placeholder: "Unesite količinu za proizvodnju",
        order_table_modal_btn_add: "Dodaj narudžbu",

        order_state_all: "Svi statusi",
        order_state_pending: "Naručeno",
        order_state_production: "Proizvodnja",
        order_state_done: "Završeno",

        // pagination
        pagination_btn_next: "Naprijed",
        pagination_btn_previous: "Nazad",

        btn_add: "Potvrdi",
        btn_cancel: "Poništi",
        btn_remove: "Ukloni",
        btn_today: "Danas"

    }
});

export default locale;
