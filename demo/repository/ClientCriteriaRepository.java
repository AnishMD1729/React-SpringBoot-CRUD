package com.example.demo.repository;

import com.example.demo.model.Client;
import com.example.demo.model.ClientPage;
import com.example.demo.model.ClientSearchCriteria;
import com.example.demo.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
public class ClientCriteriaRepository {

    private final EntityManager entityManager;
    private final CriteriaBuilder criteriaBuilder;
    @Autowired
    private ClientRepository clientRepository;

    public ClientCriteriaRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
        this.criteriaBuilder = entityManager.getCriteriaBuilder();
    }

    public Page<Client> findAllWithFilters(ClientPage clientPage,
                                           ClientSearchCriteria clientSearchCriteria){
        CriteriaQuery<Client> criteriaQuery = criteriaBuilder.createQuery(Client.class);
        Root<Client> clientRoot = criteriaQuery.from(Client.class);
        Predicate predicate = getPredicate(clientSearchCriteria, clientRoot);
        criteriaQuery.where(predicate);
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
        if(Objects.nonNull(clientSearchCriteria.getFirstName())){
            predicates.add(
                    criteriaBuilder.like(clientRoot.get("firstName"),
                            "%" + clientSearchCriteria.getFirstName() + "%")
            );
        }
        if(Objects.nonNull(clientSearchCriteria.getLastName())){
            predicates.add(
                    criteriaBuilder.like(clientRoot.get("lastName"),
                            "%" + clientSearchCriteria.getLastName() + "%")
            );
        }
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
