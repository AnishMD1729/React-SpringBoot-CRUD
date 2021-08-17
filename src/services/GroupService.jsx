import axios from 'axios';

const CLIENT_API_BASE_URL = "http://localhost:8080/api/v1/teams";

class GroupService {

    getTeams(){
        return axios.get(CLIENT_API_BASE_URL);
    }

    getClientsByPageNo(pageNo, pageSize){
        return axios.get(CLIENT_API_BASE_URL + '/' + pageNo + '/' + pageSize);
    }

    createTeam(team){
        return axios.post(CLIENT_API_BASE_URL, team);
    }

    getTeamById(teamId){
        return axios.get(CLIENT_API_BASE_URL + '/' + teamId);
    }

    updateteam(team, teamId){
        return axios.post(CLIENT_API_BASE_URL + '/' + teamId, team);
    }

    deleteTeam(teamId){
        return axios.delete(CLIENT_API_BASE_URL + '/' + teamId);
    }

    getSortedTeams(sortDirection, teams){
        return axios.get(CLIENT_API_BASE_URL + '/sort', teams);
    }

    getSearchResults(query){
        return axios.get(CLIENT_API_BASE_URL + '/queryresults/' + query);
    }

    getPageCount(){
        return axios.get(CLIENT_API_BASE_URL + '/pageCount');
    }
}

export default new GroupService()