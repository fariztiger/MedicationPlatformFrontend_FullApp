import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    patient: '/patient'
};

function getPatients(callback) {
    let request = new Request(HOST.backend_api + endpoint.patient, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPatientById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.patient + params.id, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postPatient(user, callback){
    let request = new Request(HOST.backend_api + endpoint.patient , {
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
            'role': 'PATIENT',
            'caregiverId': user.caregiverId
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getPatients,
    getPatientById,
    postPatient
};
