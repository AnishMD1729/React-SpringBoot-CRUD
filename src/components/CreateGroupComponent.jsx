import React, { Component } from 'react'
import GroupService from '../services/GroupService';

class CreateGroupComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            name: '',
            clients: []
        }
        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
        this.saveOrUpdateClient = this.saveOrUpdateClient.bind(this);
    }

    componentDidMount(){

        if(this.state.id === '_add'){
            return
        }else{
            GroupService.getGroupById(this.state.id).then( (res) =>{
                let group = res.data;
                this.setState({name: group.name,
                    clients: group.clients,
                });
            });
        }        
    }
    saveOrUpdateGroup = (e) => {
        e.preventDefault();
        let group = {name: this.state.name, clients: this.state.clients};
        console.log('group => ' + JSON.stringify(group));

        if(this.state.id === '_add'){
            GroupService.createGroup(group).then(res =>{
                this.props.history.push('/groups');
            });
        }else{
            GroupService.updateGroup(group, this.state.id).then( res => {
                this.props.history.push('/groups');
            });
        }
    }
    
    changeNameHandler= (event) => {
        this.setState({name: event.target.value});
    }

    cancel(){
        this.props.history.push('/groups');
    }

    getTitle(){
        if(this.state.id === '_add'){
            return <h3 className="text-center">Add Group</h3>
        }else{
            return <h3 className="text-center">Update Group</h3>
        }
    }
    render() {
        return (
            <div>
                <br></br>
                   <div className = "container">
                        <div className = "row">
                            <div className = "card col-md-6 offset-md-3 offset-md-3">
                                {
                                    this.getTitle()
                                }
                                <div className = "card-body">
                                    <form>
                                        <div className = "form-group">
                                            <label> Name: </label>
                                            <input placeholder="Group Name" name="name" className="form-control" 
                                                value={this.state.name} onChange={this.changeNameHandler}/>
                                        </div>
                                        {
                                            this.state.clients
                                            .map(
                                                client => 
                                                <tr key = {client.id}>
                                                    <td> {client.firstName} </td>   
                                                    <td> {client.lastName}</td>
                                                    <td>
                                                        <button style={{marginLeft: "10px"}} onClick={ () => this.removeClient(client.id)} className="btn btn-danger">Remove </button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        <button className="btn btn-success" onClick={this.saveOrUpdateGroup}>Save</button>
                                        <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                   </div>
            </div>
        )
    }
}

export default CreateGroupComponent