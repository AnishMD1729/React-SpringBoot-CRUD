package com.example.demo.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "team")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //@Column
    private Long id;

    //@Column(name = "group_name")
    private String teamName;

    @OneToMany(
            mappedBy = "team",
            cascade = CascadeType.ALL
    )
    private List<Client> clients = new ArrayList<>();

    public Team() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<Client> getClients() {
        return clients;
    }

    public void setClients(List<Client> clients) {
        this.clients = clients;
    }

    public void addClient(Client client){
        clients.add(client);
    }

    public void removeClient(Client client){
        clients.remove(client);
    }

}
