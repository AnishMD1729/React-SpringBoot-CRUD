import React, { Component, useState } from "react";
import GroupService from '../services/GroupService'
import ReactPaginate from "react-paginate";


class ListGroupComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
                groups: [],
                pageNumber: 1,
                groupsPerPage: 4,
                //searchTerm: "",
                sortType: "asc",
                pageCount: 1,
                sortField: "groupName"
        }
        //this.pagesVisited = this.state.pageNumber * this.state.clientsPerPage
        //this.pageCount = Math.ceil(this.state.clients.length / this.state.clientsPerPage);
        this.addGroup = this.addGroup.bind(this);
        this.editGroup = this.editGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    changePage = (data) => {
        this.setState({pageNumber: data.selected});

        GroupService.getGroupsByPageNo(data.selected, this.state.groupsPerPage)
        .then((res) => {
            this.setState({groups: res.data});
        });
      };

    /*deleteGroup(id){
        ClientService.deleteGroup(id).then( res => {
            this.setState({clients: this.state.clients.filter(client => client.id !== id)});
        });
    }*/

    viewGroup(id){
        this.props.history.push(`/view-group/${id}`);
    }

    editGroup(id){
        this.props.history.push(`/add-group/${id}`);
    }

    componentDidMount(){
        GroupService.getGroups().then((res) => {
            this.setState({
                groups: res.data
            });
        });

        //this.state.pageCount = ClientService.getPageCount;
    }

    addGroup(){
        this.props.history.push('/add-group/_add');
    }

    handleSearch(event){
        /*this.setState({
            searchTerm : event.target.value
        })*/
        event.target.value === "" ? 
        GroupService.getGroupsByPageNo(0, this.state.groupsPerPage)
        .then((res) => {
            this.setState({groups: res.data});
        })
        :
        GroupService.getSearchResults(event.target.value)
        .then((res) => {
            this.setState({groups: res.data});
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
                 <h2 className="text-center">Groups' List</h2>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={this.addGroup}> Add Group</button>
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
                            placeholder = "Search group..."
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
                                    <th> Group Name</th>
                                    <th> Clients </th>
                                    <th> Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.groups
                                    /*.filter((val) => {
                                        if(val.firstName.toLowerCase().includes(this.state.searchTerm.toLowerCase()) || val.lastName.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                                            return val;
                                        }
                                    })*/
                                    //.slice(this.state.pageNumber * this.state.clientsPerPage, this.state.pageNumber * this.state.clientsPerPage + this.state.clientsPerPage)
                                    .sort( (a, b) => {
                                        const isReversed = (this.state.sortType === "asc") ? 1 : -1;
                                        return isReversed * a.groupName.localeCompare(b.groupName)
                                    })
                                    .map(
                                        group => 
                                        <tr key = {group.id}>
                                             <td> {group.groupName} </td>   
                                             <td> 
                                                {group.clients
                                                .map(
                                                    client =>
                                                    <tr key = {client.id}>
                                                        <td> {client.firstName} </td>
                                                        <td> {client.lastName} </td>
                                                    </tr>
                                                )}
                                             </td>
                                             <td>
                                                 <button onClick={ () => this.editGroup(group.id)} className="btn btn-info">Update </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.deleteGroup(group.id)} className="btn btn-danger">Delete </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.viewGroup(group.id)} className="btn btn-info">View </button>
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

export default ListGroupComponent
