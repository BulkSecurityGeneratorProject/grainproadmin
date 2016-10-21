package pro.grain.admin.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A TransportationPrice.
 */
@Entity
@Table(name = "transportation_price")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "transportationprice")
public class TransportationPrice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "price", nullable = false)
    private Long price;

    @OneToOne
    @JoinColumn(unique = true)
    private Station stationFrom;

    @OneToOne
    @JoinColumn(unique = true)
    private Station stationTo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPrice() {
        return price;
    }

    public TransportationPrice price(Long price) {
        this.price = price;
        return this;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public Station getStationFrom() {
        return stationFrom;
    }

    public TransportationPrice stationFrom(Station station) {
        this.stationFrom = station;
        return this;
    }

    public void setStationFrom(Station station) {
        this.stationFrom = station;
    }

    public Station getStationTo() {
        return stationTo;
    }

    public TransportationPrice stationTo(Station station) {
        this.stationTo = station;
        return this;
    }

    public void setStationTo(Station station) {
        this.stationTo = station;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TransportationPrice transportationPrice = (TransportationPrice) o;
        if(transportationPrice.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, transportationPrice.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "TransportationPrice{" +
            "id=" + id +
            ", price='" + price + "'" +
            '}';
    }
}