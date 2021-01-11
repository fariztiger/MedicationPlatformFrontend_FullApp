import {HOST} from './../commons/hosts';
import RestApiClient from "./../commons/api/rest-client";


const endpoint = {
    person: '/user_t'
};

function getUsers(callback) {
    let request = new Request(HOST.backend_api + endpoint.person, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getUserByUsername(params, callback){
    let request = new Request(HOST.backend_api + endpoint.person + params.username, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


export {
    getUsers,
    getUserByUsername
};
