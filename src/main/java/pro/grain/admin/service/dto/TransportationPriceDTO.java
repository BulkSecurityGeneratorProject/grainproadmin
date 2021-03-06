package pro.grain.admin.service.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;


/**
 * A DTO for the TransportationPrice entity.
 */
public class TransportationPriceDTO implements Serializable {

    private Long id;

    @NotNull
    private Long price;

    private Long priceNds;

    private Integer distance;

    private String stationFromCode;

    private String stationToCode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }
    public Long getPriceNds() {
        return priceNds;
    }

    public void setPriceNds(Long priceNds) {
        this.priceNds = priceNds;
    }
    public Integer getDistance() {
        return distance;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public String getStationFromCode() {
        return stationFromCode;
    }

    public void setStationFromCode(String stationCode) {
        this.stationFromCode = stationCode;
    }

    public String getStationToCode() {
        return stationToCode;
    }

    public void setStationToCode(String stationCode) {
        this.stationToCode = stationCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        TransportationPriceDTO transportationPriceDTO = (TransportationPriceDTO) o;

        if ( ! Objects.equals(id, transportationPriceDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "TransportationPriceDTO{" +
            "id=" + id +
            ", price='" + price + "'" +
            ", priceNds='" + priceNds + "'" +
            ", distance='" + distance + "'" +
            ", stationFromCode='" + stationFromCode + "'" +
            ", stationToCode='" + stationToCode + "'" +
            '}';
    }
}
