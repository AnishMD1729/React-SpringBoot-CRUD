package com.example.demo.controller;

import com.example.demo.model.Client;
import com.example.demo.model.Team;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class GroupController {

    private final GroupRepository groupRepository;
    private final ClientRepository clientRepository;

    @Autowired
    public GroupController(GroupRepository groupRepository, ClientRepository clientRepository) {
        this.groupRepository = groupRepository;
        this.clientRepository = clientRepository;
    }

    @PostMapping("/groups")
    public Team addTeam(@RequestBody Team team){
        return groupRepository.save(team);
    }

    @GetMapping("/groups")
    public ResponseEntity<List<Team>> getGroups(){
        List<Team> teams = groupRepository.findAll();
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    @GetMapping("/groups/{id}")
    public ResponseEntity<Team> getGroup(@PathVariable (value = "id") Long id){
        Team team = groupRepository.getById(id);
        return new ResponseEntity<>(team, HttpStatus.OK);
    }

    @DeleteMapping("groups/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteGroup(@PathVariable (value = "id") Long id){
        Team team = groupRepository.getById(id);

        groupRepository.delete(team);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/groups/{id}")
    public ResponseEntity<Team> editCart(@PathVariable (value = "id") final Long id,
                                         @RequestBody final Team team){
        Team teamToEdit = groupRepository.getById(id);

        teamToEdit.setTeamName(team.getTeamName());
        Team updatedTeam = groupRepository.save(teamToEdit);
        return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
    }

    @PostMapping("/groups/{clientId}/{groupId}")
    public ResponseEntity<Team> addClientToGroup(@PathVariable (value = "groupId") final Long groupId,
                                                 @PathVariable (value = "clientId") final Long clientId){
        Team team = addClientToGroupHelper(groupId, clientId);
        return new ResponseEntity<>(team, HttpStatus.OK);
    }

    @DeleteMapping("/groups/{clientId}/{groupId}")
    public ResponseEntity<Team> removeClientFromGroup(@PathVariable (value = "groupId") final Long groupId,
                                                      @PathVariable (value = "clientId") final Long clientId){
        Team team = removeClientFromGroupHelper(groupId, clientId);
        return new ResponseEntity<>(team, HttpStatus.OK);
    }

    @Transactional
    public Team addClientToGroupHelper(Long groupId, Long clientId){
        Team team = groupRepository.getById(groupId);
        Client client = clientRepository.getById(clientId);
        if(Objects.nonNull(client.getGroup())){
            throw new RuntimeException();
        }
        team.addClient(client);
        client.setGroup(team);
        return team;
    }

    @Transactional
    public Team removeClientFromGroupHelper(Long groupId, Long clientId){
        Team team = groupRepository.getById(groupId);
        Client client = clientRepository.getById(clientId);
        team.removeClient(client);
        return team;
    }

}
