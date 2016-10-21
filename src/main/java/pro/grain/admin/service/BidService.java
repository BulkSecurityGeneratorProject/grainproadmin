package pro.grain.admin.service;

import pro.grain.admin.domain.Bid;
import pro.grain.admin.repository.BidRepository;
import pro.grain.admin.repository.search.BidSearchRepository;
import pro.grain.admin.service.dto.BidDTO;
import pro.grain.admin.service.mapper.BidMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Bid.
 */
@Service
@Transactional
public class BidService {

    private final Logger log = LoggerFactory.getLogger(BidService.class);
    
    @Inject
    private BidRepository bidRepository;

    @Inject
    private BidMapper bidMapper;

    @Inject
    private BidSearchRepository bidSearchRepository;

    /**
     * Save a bid.
     *
     * @param bidDTO the entity to save
     * @return the persisted entity
     */
    public BidDTO save(BidDTO bidDTO) {
        log.debug("Request to save Bid : {}", bidDTO);
        Bid bid = bidMapper.bidDTOToBid(bidDTO);
        bid = bidRepository.save(bid);
        BidDTO result = bidMapper.bidToBidDTO(bid);
        bidSearchRepository.save(bid);
        return result;
    }

    /**
     *  Get all the bids.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public Page<BidDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Bids");
        Page<Bid> result = bidRepository.findAll(pageable);
        return result.map(bid -> bidMapper.bidToBidDTO(bid));
    }

    /**
     *  Get one bid by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public BidDTO findOne(Long id) {
        log.debug("Request to get Bid : {}", id);
        Bid bid = bidRepository.findOneWithEagerRelationships(id);
        BidDTO bidDTO = bidMapper.bidToBidDTO(bid);
        return bidDTO;
    }

    /**
     *  Delete the  bid by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Bid : {}", id);
        bidRepository.delete(id);
        bidSearchRepository.delete(id);
    }

    /**
     * Search for the bid corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<BidDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Bids for query {}", query);
        Page<Bid> result = bidSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(bid -> bidMapper.bidToBidDTO(bid));
    }
}