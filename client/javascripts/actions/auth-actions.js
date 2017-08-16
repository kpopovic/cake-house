'use strict';

import Reflux from 'reflux';

const AuthActions = Reflux.createActions([
    "setFormFieldUsername",
    "setFormFieldPassword",
    "loginUser",
    "logoutUser"
]);

export default AuthActions;
