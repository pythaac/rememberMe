package com.pythaac.rememberme.Data;

import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.context.annotation.Primary;

import javax.persistence.*;

@Data
@Entity
public class PushInfo
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull
    @Column(name="id")
    Long id;

    @NotNull
    @Column(name="category")
    String category;

    @NotNull
    @Column(name="time")
    String time;
}
