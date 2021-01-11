import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    medicine: '/medicine'
};

function getMedicine(callback) {
    let request = new Request(HOST.backend_api + endpoint.medicine, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getMedicineById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.medicine + params.id, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postMedicine(user, callback){
    let request = new Request(HOST.backend_api + endpoint.medicine , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'name': user.name,
            'description': user.description,
            'sideEffects': user.sideEffects
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getMedicine,
    getMedicineById,
    postMedicine
};
