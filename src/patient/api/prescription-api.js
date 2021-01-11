import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    prescription: '/prescription'
};

function getPrescriptions(callback) {
    let request = new Request(HOST.backend_api + endpoint.prescription, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getPrescriptions
}