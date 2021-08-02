import React, { Component } from 'react'
import ClientService from '../services/ClientService'

class ListClientComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
                clients: []
        }
        this.addClient = this.addClient.bind(this);
        this.editClient = this.editClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
    }

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
            this.setState({ clients: res.data});
        });
    }

    addClient(){
        this.props.history.push('/add-client/_add');
    }

    render() {
        return (
            <div>
                 <h2 className="text-center">Clients' List</h2>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={this.addClient}> Add Client</button>
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
                                    this.state.clients.map(
                                        client => 
                                        <tr key = {client.id}>
                                             <td> { client.firstName} </td>   
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

            </div>
        )
    }
}

export default ListClientComponent