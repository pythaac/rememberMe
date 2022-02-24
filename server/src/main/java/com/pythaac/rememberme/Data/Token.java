package com.pythaac.rememberme.Data;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity
public class Token
{
    @Id
    @NotNull
    @Column(name = "token")
    String token;
}
