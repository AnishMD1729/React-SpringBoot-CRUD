package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Client;
import com.example.demo.model.ClientPage;
import com.example.demo.model.ClientSearchCriteria;
import com.example.demo.repository.ClientCriteriaRepository;
import com.example.demo.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;
    private final ClientCriteriaRepository clientCriteriaRepository;
    private final CriteriaBuilder criteriaBuilder;
    private final EntityManager entityManager;
    private ClientPage clientPage;
    @Autowired
    private ClientSearchCriteria clientSearchCriteria;

    public ClientController(ClientRepository clientRepository, ClientCriteriaRepository clientCriteriaRepository,
                            EntityManager entityManager) {
        this.clientRepository = clientRepository;
        this.clientCriteriaRepository = clientCriteriaRepository;
        //this.criteriaBuilder = criteriaBuilder;
        this.entityManager = entityManager;
        this.criteriaBuilder = entityManager.getCriteriaBuilder();
        this.clientPage = clientPage;
        this.clientSearchCriteria = clientSearchCriteria;
    }

    @GetMapping("/clients")
    public List<Client> getAllClients(){
        int pageSize = 4;

        //Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortField).ascending() :
        //        Sort.by(sortField).descending();

        Pageable pageable = PageRequest.of(0, pageSize);
        Page<Client> page = this.clientRepository.findAll(pageable);

        return page.getContent();
    }

    @PostMapping("/clients")
    public Client createClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClientById(ClientPage clientPage,
                                                ClientSearchCriteria clientSearchCriteria,
                                                @PathVariable (value = "id") long id) {
        //Client client = clientCriteriaRepository.findAllWithFilters(clientPage, clientSearchCriteria);
                //.orElseThrow(() -> new ResourceNotFoundException("Client not exist with id :" + id));
        //return ResponseEntity<Client>(clientCriteriaRepository.findAllWithFilters(clientPage, clientSearchCriteria));
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not exist with id :" + id));
        return ResponseEntity.ok(client);
    }

    @GetMapping("/clients/{pageNo}/{pageSize}")
    public List<Client> findPaginated(@PathVariable (value = "pageNo") int pageNo,
                                      @PathVariable (value = "pageSize") int pageSize) {
        //int pageSize = 5;

        /*Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortField).ascending() :
                Sort.by(sortField).descending();
        */

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Client> page = this.clientRepository.findAll(pageable);
        /*CriteriaQuery<Client> criteriaQuery = criteriaBuilder.createQuery(Client.class);
        Root<Client> clientRoot = criteriaQuery.from(Client.class);

        if(sortDir.equals(Sort.Direction.ASC)){
            criteriaQuery.orderBy(criteriaBuilder.asc(clientRoot.get(sortField)));
        } else {
            criteriaQuery.orderBy(criteriaBuilder.desc(clientRoot.get(sortField)));
        }*/
        /*clientPage.setPageSize(pageSize);
        clientPage.setPageNumber(pageNo);
        clientPage.setSortBy(sortField);
        clientPage.setSortDirection(sortDir == "asc" ? Sort.Direction.ASC : Sort.Direction.DESC);*/
        //clientSearchCriteria.setFirstName();
        //Page<Client> page = findAllWithFilters(clientPage, clientSearchCriteria);

        return page.getContent();
    }

    @GetMapping("/clients/queryresults/{query}")
    public List<Client> getQueryResults(@PathVariable (value = "query") String query){
        CriteriaQuery<Client> criteriaQuery = criteriaBuilder.createQuery(Client.class);
        Root<Client> clientRoot = criteriaQuery.from(Client.class);
        //ClientSearchCriteria clientSearchCriteria = this.clientSearchCriteria;
        clientSearchCriteria.setFirstName(query);
        //clientSearchCriteria.setLastName(query);
        Predicate predicate = getPredicate(clientSearchCriteria, clientRoot);
        criteriaQuery.where(predicate);

        TypedQuery<Client> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getResultList();
    }

    /*@GetMapping("/clients/{sort}/{pageClients}")
    public List<Client> getSortedClients(@PathVariable (value = "sort") String sortDir,
                                         @PathVariable (value = "clients") List<Client> pageClients){
        clientPage.setSortDirection(sortDir == "asc" ? Sort.Direction.ASC : Sort.Direction.DESC);

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortField).ascending() :
                Sort.by(sortField).descending();


        Pageable pageable = getPageable(clientPage);
        Page<Client> page = this.clientRepository.findAll(pageable);
        return page.getContent();
    }*/

    @PutMapping("/clients/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client clientDetails){
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not exist with id :" + id));

        client.setFirstName(clientDetails.getFirstName());
        client.setLastName(clientDetails.getLastName());
        client.setEmailId(clientDetails.getEmailId());

        Client updatedClient = clientRepository.save(client);
        return ResponseEntity.ok(updatedClient);
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteClient(@PathVariable Long id){
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not exist with id :" + id));

        clientRepository.delete(client);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/clients/pageCount")
    public long getPageCount(){
        Pageable pageable = PageRequest.of(0, 5);
        Page<Client> page = this.clientRepository.findAll(pageable);
        return page.getTotalPages() + 1;
    }

    public Page<Client> findAllWithFilters(ClientPage clientPage,
                                           ClientSearchCriteria clientSearchCriteria){
        CriteriaQuery<Client> criteriaQuery = criteriaBuilder.createQuery(Client.class);
        Root<Client> clientRoot = criteriaQuery.from(Client.class);
        //Predicate predicate = getPredicate(clientSearchCriteria, clientRoot);
        //criteriaQuery.where(predicate);
        setOrder(clientPage, criteriaQuery, clientRoot);

        TypedQuery<Client> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setFirstResult(clientPage.getPageNumber() * clientPage.getPageSize());
        typedQuery.setMaxResults(clientPage.getPageSize());

        Pageable pageable = getPageable(clientPage);

        //return new PageImpl<Client>(typedQuery.getResultList(), pageable, null);
        return this.clientRepository.findAll(pageable);
    }

    private Predicate getPredicate(ClientSearchCriteria clientSearchCriteria,
                                   Root<Client> clientRoot) {
        List<Predicate> predicates = new ArrayList<>();
        /*if(Objects.nonNull(clientSearchCriteria.getFirstName())){
            predicates.add(
                    criteriaBuilder.like(clientRoot.get("firstName"),
                            "%" + clientSearchCriteria.getFirstName() + "%")
            );
        }*/
        predicates.add(
                criteriaBuilder.like(clientRoot.get("firstName"),
                        "%" + clientSearchCriteria.getFirstName() + "%")
        );
        /*if(Objects.nonNull(clientSearchCriteria.getLastName())){
            predicates.add(
                    criteriaBuilder.like(clientRoot.get("lastName"),
                            "%" + clientSearchCriteria.getLastName() + "%")
            );
        }*/
        predicates.add(
                criteriaBuilder.like(clientRoot.get("lastName"),
                        "%" + clientSearchCriteria.getLastName() + "%")
        );
        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }

    private void setOrder(ClientPage clientPage,
                          CriteriaQuery<Client> criteriaQuery,
                          Root<Client> clientRoot) {
        if(clientPage.getSortDirection().equals(Sort.Direction.ASC)){
            criteriaQuery.orderBy(criteriaBuilder.asc(clientRoot.get(clientPage.getSortBy())));
        } else {
            criteriaQuery.orderBy(criteriaBuilder.desc(clientRoot.get(clientPage.getSortBy())));
        }
    }

    private Pageable getPageable(ClientPage clientPage) {
        Sort sort = Sort.by(clientPage.getSortDirection(), clientPage.getSortBy());
        return PageRequest.of(clientPage.getPageNumber(),clientPage.getPageSize(), sort);
    }


}
