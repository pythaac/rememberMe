package com.pythaac.rememberme.Repository;

import com.pythaac.rememberme.Data.Token;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface TokenRepository extends CrudRepository<Token, String>
{
    Token save(Token token);
    ArrayList<Token> findAll();
    void deleteAll();
}
