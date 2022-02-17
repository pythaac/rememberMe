package com.pythaac.rememberme;

import lombok.Data;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PushRegisterController
{
    @PostMapping(value = "/register")
    @ResponseBody
    public PushInfo regist(@RequestBody PushInfo info){
//        String time = info.getTime().
//        System.out.println(info.getCategory() + " " + time);
        return info;
    }
}
