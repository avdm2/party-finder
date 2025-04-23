package ru.partyfinder.organizerprofile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.entity.DataEntity;
import ru.partyfinder.organizerprofile.model.dto.DataResponse;
import ru.partyfinder.organizerprofile.repository.DataRepository;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class DataService {

    private final DataRepository dataRepository;

    public DataEntity save(DataEntity data) {
        return dataRepository.save(data);
    }

    public DataResponse getAvg(UUID eventId) {
        List<DataEntity> all = dataRepository.findAllByEventId(eventId);

        DataResponse dataResponse = new DataResponse();
        dataResponse.setEventId(eventId);
        Double avgBill = 0.0;
        Double avgAge = 0.0;
        Double avgTravelTimeInMinutes = 0.0;
        Double rate = 0.0;
        Double peopleInGroup = 0.0;
        Double avgSpentTimeInMinutes = 0.0;

        for (DataEntity data : all) {
            avgBill += data.getAvgBill();
            avgAge += data.getAvgAge();
            avgTravelTimeInMinutes += data.getAvgTravelTimeInMinutes();
            rate += data.getRate();
            peopleInGroup += data.getPeopleInGroup();
            avgSpentTimeInMinutes += data.getAvgSpentTimeInMinutes();
        }

        return dataResponse.withAvgAge(avgAge / all.size())
                .withAvgBill(avgBill / all.size())
                .withAvgTravelTimeInMinutes(avgTravelTimeInMinutes / all.size())
                .withRate(rate / all.size())
                .withPeopleInGroup(peopleInGroup / all.size())
                .withAvgSpentTimeInMinutes(avgSpentTimeInMinutes / all.size());
    }

    public List<DataEntity> getAllByEventId(UUID eventId) {
        return dataRepository.findAllByEventId(eventId);
    }
}
