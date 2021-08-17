import axios from 'axios';

const CLIENT_API_BASE_URL = "http://localhost:8080/api/v1/clients";

class ClientService {

    getClients(){
        return axios.get(CLIENT_API_BASE_URL);
    }

    getClientsByPageNo(pageNo, pageSize){
        return axios.get(CLIENT_API_BASE_URL + '/' + pageNo + '/' + pageSize);
    }

    createClient(client){
        return axios.post(CLIENT_API_BASE_URL, client);
    }

    getSortedClients(sortDirection, clients){
        return axios.get(CLIENT_API_BASE_URL + '/sort', clients);
    }

    getSearchResults(query){
        return axios.get(CLIENT_API_BASE_URL + '/queryresults/' + query);
    }

    getPageCount(){
        return axios.get(CLIENT_API_BASE_URL + '/pageCount');
    }

    getClientById(clientId){
        return axios.get(CLIENT_API_BASE_URL + '/' + clientId);
    }

    updateClient(client, clientId){
        return axios.post(CLIENT_API_BASE_URL + '/' + clientId, client);
    }

    deleteClient(clientId){
        return axios.delete(CLIENT_API_BASE_URL + '/' + clientId);
    }
}

export default new ClientService()