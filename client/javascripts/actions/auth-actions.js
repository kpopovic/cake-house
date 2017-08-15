'use strict';

import Reflux from 'reflux';

const AuthActions = Reflux.createActions([
    "updateCredentials",
    "loginUser",
    "logoutUser"
]);

export default AuthActions;
