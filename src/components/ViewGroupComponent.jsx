import React, { Component } from 'react'
import GroupService from '../services/GroupService'

class ViewGroupComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            name: "",
            clients: []
        }
    }

    componentDidMount(){
        GroupService.getGroupById(this.state.id).then( res => {
            this.setState({
                clients: res.clients,
                name: res.name
            });
        })
    }

    render() {
        return (
            <div>
                <br></br>
                <div className = "card col-md-6 offset-md-3">
                    <h3 className = "text-center"> View Group Details</h3>
                    <div className = "card-body">
                        <div className = "row">
                            <label> Group Name: </label>
                            <div> { this.state.name }</div>
                        </div>
                        {
                            this.state.clients
                            .map(
                                client => 
                                <tr key = {client.id}>
                                             <td> {client.firstName} </td>   
                                             <td> {client.lastName}</td>
                                             <td> {client.emailId}</td>
                                </tr>
                            )
                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default ViewGroupComponent
