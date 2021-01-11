import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    caregiver: '/caregiver'
};

function getCaregivers(callback) {
    let request = new Request(HOST.backend_api + endpoint.caregiver, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getCaregiverById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.caregiver + params.id, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postCaregiver(user, callback){
    let request = new Request(HOST.backend_api + endpoint.caregiver , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'name': user.name,
            'address': user.address,
            'birthDate': user.birthDate,
            'username': user.username,
            'password': user.password,
            'userRole': 'CAREGIVER'
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getCaregivers,
    postCaregiver,
    getCaregiverById
};
