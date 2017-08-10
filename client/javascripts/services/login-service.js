import postal from 'postal';
import constants from './../constants'
import rootUrl from './../web-root-url'

const channel = postal.channel();

channel.subscribe(constants.TOPIC_LOGIN_REQUEST, function (request) {
    const promise = $.ajax({
        url: rootUrl + "/v1/user",
        type: 'GET',
        crossDomain: false,
        dataType: 'json',
        headers: {
            "Authorization": "Basic " + btoa(request.data.username + ":" + request.data.password)
        }
    });

    promise.done(data => {
        channel.publish(constants.TOPIC_LOGIN_RESPONSE, { error: null, data: data });
    });

    promise.fail(error => {
        channel.publish(constants.TOPIC_LOGIN_RESPONSE, { error: error, data: null });
    });

});

channel.subscribe(constants.TOPIC_LOGOUT_REQUEST, function (request) {
    const promise = $.ajax({
        url: rootUrl + "/v1/user/logout",
        type: 'GET',
        crossDomain: false,
        dataType: 'json'
    });

    promise.done(data => {
        channel.publish(constants.TOPIC_LOGOUT_RESPONSE, { error: null, data: data });
    });

    promise.fail(error => {
        channel.publish(constants.TOPIC_LOGOUT_RESPONSE, { error: error, data: null });
    });

});

export default channel;
