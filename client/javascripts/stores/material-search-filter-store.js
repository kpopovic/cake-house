import Reflux from 'reflux';
import MaterialSearchFilterActions from './../actions/material-search-filter-actions';
import _ from 'lodash';
import * as XLSX from 'xlsx';

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
    onDownloadShoppingList() {
        /* original data */
        var data = [[1, 2, 3], [true, false, null, "sheetjs"], ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
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

        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "test.xlsx");
    }
}

const defaultState = {
    name: '',
    isQuantityToBuy: false
};

export function buildStore() {
    return new MaterialSearchFilterStore();
}
