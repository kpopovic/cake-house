import postal from 'postal';
import constants from './../constants'
import rootUrl from './../web-root-url'

const channel = postal.channel();

channel.subscribe(constants.TOPIC_MATERIAL_LIST_REQUEST, function (request) {
    const promise = $.ajax({
        url: rootUrl + "/v1/material",
        type: 'GET',
        crossDomain: false,
        dataType: 'json'
    });

    promise.done(data => {
        channel.publish(constants.TOPIC_MATERIAL_LIST_RESPONSE, { error: null, data: data });
    });

    promise.fail(error => {
        channel.publish(constants.TOPIC_MATERIAL_LIST_RESPONSE, { error: error, data: null });
    });

});

export default channel;
