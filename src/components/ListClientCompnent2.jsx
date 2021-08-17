import React, { Component, useState } from "react";
import ClientService from '../services/ClientService'
import ReactPaginate from "react-paginate";


function ListClientComponent {

    const [users, setUsers] = useState(JsonData.slice(0, 50));
    const [pageNumber, setPageNumber] = useState(0);

        pageNumber = 0;
        clientsPerPage = 2;
        pagesVisited = pageNumber * clientsPerPage;
        pageCount = Math.ceil(clients.length / clientsPerPage);

        addClient = addClient.bind(;
        editClient = editClient.bind(;
        deleteClient = deleteClient.bind(;



        const changePage = ({ selected }) => {
            setPageNumber(selected);
          };

    deleteClient(id){
        ClientService.deleteClient(id).then( res => {
            setState({clients: .clients.filter(client => client.id !== id)});
        });
    }
    viewClient(id){
        props.history.push(`/view-client/${id}`);
    }
    editClient(id){
        props.history.push(`/add-client/${id}`);
    }

    componentDidMount(){
        ClientService.getClients().then((res) => {
            setState({ clients: res.data});
        });
    }

    addClient(){
        props.history.push('/add-client/_add');
    }

        return (
            <div>
                 <h2 className="text-center">Clients List</h2>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={addClient}> Add Client</button>
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
                                    state.clients
                                    .slice(pagesVisited, pagesVisited + clientsPerPage)
                                    .map(
                                        client => 
                                        <tr key = {client.id}>
                                             <td> { client.firstName} </td>   
                                             <td> {client.lastName}</td>
                                             <td> {client.emailId}</td>
                                             <td>
                                                 <button onClick={ () => editClient(client.id)} className="btn btn-info">Update </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => deleteClient(client.id)} className="btn btn-danger">Delete </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => viewClient(client.id)} className="btn btn-info">View </button>
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
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
      />

            </div>
        )
    

}
export default ListClientComponent;
