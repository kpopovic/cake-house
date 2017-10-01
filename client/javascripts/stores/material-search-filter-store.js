import Reflux from 'reflux';
import MaterialSearchFilterActions from './../actions/material-search-filter-actions';
import * as XLSX from 'xlsx';
import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
import locale from './../../javascripts/locale';

class MaterialSearchFilterStore extends Reflux.Store {

    constructor() {
        super();
        this.listenables = MaterialSearchFilterActions;
        this.state = { store: defaultState };
    }

    onSetName(name) {
        const theName = name && name.length > 0 ? name : '';
        const state = Object.assign({}, this.state.store, { name: theName });
        this.setLocaleState(state);
        MaterialSearchFilterActions.stateChanged.completed(state);
    }

    onSetQuantityToBuy(isQuantityToBuy) {
        const isToBuy = isQuantityToBuy === true;
        const state = Object.assign({}, this.state.store, { isQuantityToBuy: isToBuy });
        this.setLocaleState(state);
        MaterialSearchFilterActions.stateChanged.completed(state);
    }

    setLocaleState(data) {
        this.setState({ store: data });
    }

    /**
     * https://www.npmjs.com/package/xlsx
     * https://github.com/SheetJS/js-xlsx/tree/1a8f97269e6b7f8d4db67d08db2ad587f6da5259/demos/react
     */
    downloadFile(filename, data) {
        /* original data */
        //var data = [[1, 2, 3], [true, false, null, "sheetjs"], ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
        var ws_name = "SheetJS";

        function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }

        /* add worksheet to workbook */
        var wb = new Workbook()
        var ws = XLSX.utils.aoa_to_sheet(data);

        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename + ".xlsx");
    }

    onDownloadShoppingList() {
        const url = '/v1/material?direction=first&limit=100&filter[isQuantityToBuy]=true';
        const thePromise = axios.get(url);

        thePromise.then(response => {
            if (response.data.code === 0) {
                const materials = response.data.data.materials;
                const size = materials.length;
                if (size > 0) {
                    const header = [locale.material_table_header_name, locale.material_table_header_unit, locale.material_table_header_quantityToBuy];
                    const body = materials.map(m => {
                        return [m.name, locale[`material_unit_${m.unit}`], m.quantityToBuy];
                    });

                    const data = _.concat([header], body);
                    const date = moment().format("DD_MM_YYYY");
                    this.downloadFile(locale.material_table_shoppingList_btn + "_" + date, data);
                }
            }
        }).catch(error => {
            console.log(error);
        });

    }
}

const defaultState = {
    name: '',
    isQuantityToBuy: false
};

export function buildStore() {
    return new MaterialSearchFilterStore();
}
