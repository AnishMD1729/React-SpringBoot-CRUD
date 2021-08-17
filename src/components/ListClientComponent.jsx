import React, { Component, useState } from "react";
import ClientService from '../services/ClientService'
import ReactPaginate from "react-paginate";


class ListClientComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
                clients: [],
                pageNumber: 1,
                clientsPerPage: 4,
                //searchTerm: "",
                sortType: "asc",
                pageCount: 1,
                sortField: "firstName"
        }
        //this.pagesVisited = this.state.pageNumber * this.state.clientsPerPage
        //this.pageCount = Math.ceil(this.state.clients.length / this.state.clientsPerPage);
        this.addClient = this.addClient.bind(this);
        this.editClient = this.editClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    changePage = (data) => {
        this.setState({pageNumber: data.selected});

        ClientService.getClientsByPageNo(data.selected, this.state.clientsPerPage)
        .then((res) => {
            this.setState({clients: res.data});
        });
      };

    deleteClient(id){
        ClientService.deleteClient(id).then( res => {
            this.setState({clients: this.state.clients.filter(client => client.id !== id)});
        });
    }

    viewClient(id){
        this.props.history.push(`/view-client/${id}`);
    }

    editClient(id){
        this.props.history.push(`/add-client/${id}`);
    }

    componentDidMount(){
        ClientService.getClients().then((res) => {
            this.setState({clients: res.data});
        });

        //this.state.pageCount = ClientService.getPageCount;
    }

    addClient(){
        this.props.history.push('/add-client/_add');
    }

    handleSearch(event){
        /*this.setState({
            searchTerm : event.target.value
        })*/
        event.target.value === "" ? 
        ClientService.getClientsByPageNo(0, this.state.clientsPerPage)
        .then((res) => {
            this.setState({clients: res.data});
        })
        :
        ClientService.getSearchResults(event.target.value)
        .then((res) => {
            this.setState({clients: res.data});
        });
    }

    onSort = (sortType) => {
        /*ClientService.getClientsByPageNo(this.state.pageNumber, this.state.clientsPerPage, this.state.sortField, sortType)
        .then((res) => {
            this.setState({clients: res.data});
        });*/
        this.setState({sortType});
    }

    render() {
        return (
            <div>
                 <h2 className="text-center">Clients' List</h2>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={this.addClient}> Add Client</button>
                 </div>
                 <div className="container">
                     <div className="row">
                        <div className="col"></div>
                        <div className="col">
                            <button className="btn btn-info" onClick={() => this.onSort("asc")}> Sort by Asc</button>
                            <button style={{marginLeft: "10px"}} className="btn btn-info" onClick={() => this.onSort("desc")}> Sort by Desc</button>
                        </div>
                     </div>
                 </div>
                 <div class="wrap">
                    <div class="search">
                        <input
                            type = "text"
                            placeholder = "Search client..."
                            onChange = {(event) => this.handleSearch(event)}
                            className="searchTerm"
                            id="input_text"
                        ></input>
                    </div>
                </div>
                 <br></br>
                 <div className = "row">
                        <table className = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> Client First Name</th>
                                    <th> Client Last Name</th>
                                    <th> Client Email Id</th>
                                    <th> Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.clients
                                    /*.filter((val) => {
                                        if(val.firstName.toLowerCase().includes(this.state.searchTerm.toLowerCase()) || val.lastName.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                                            return val;
                                        }
                                    })*/
                                    //.slice(this.state.pageNumber * this.state.clientsPerPage, this.state.pageNumber * this.state.clientsPerPage + this.state.clientsPerPage)
                                    .sort( (a, b) => {
                                        const isReversed = (this.state.sortType === "asc") ? 1 : -1;
                                        return isReversed * a.firstName.localeCompare(b.firstName)
                                    })
                                    .map(
                                        client => 
                                        <tr key = {client.id}>
                                             <td> {client.firstName} </td>   
                                             <td> {client.lastName}</td>
                                             <td> {client.emailId}</td>
                                             <td>
                                                 <button onClick={ () => this.editClient(client.id)} className="btn btn-info">Update </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.deleteClient(client.id)} className="btn btn-danger">Delete </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.viewClient(client.id)} className="btn btn-info">View </button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                 </div>

                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    //pageCount={Math.ceil(this.state.clients.length / this.state.clientsPerPage)}
                    //pageCount={this.state.pageCount}
                    onPageChange={this.changePage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
                />

            </div>
        )
    }
}

export default ListClientComponent
