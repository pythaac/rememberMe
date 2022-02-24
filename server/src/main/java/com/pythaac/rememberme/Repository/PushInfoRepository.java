package com.pythaac.rememberme.Repository;

import com.pythaac.rememberme.Data.PushInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface PushInfoRepository extends CrudRepository<PushInfo, Long>
{
    PushInfo save(PushInfo pushInfo);
    PushInfo deleteByCategoryAndTime(String category, String time);
    ArrayList<PushInfo> findAll();
}
