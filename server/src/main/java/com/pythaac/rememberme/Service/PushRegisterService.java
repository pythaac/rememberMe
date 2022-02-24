package com.pythaac.rememberme.Service;

import com.pythaac.rememberme.Data.PushInfo;
import com.pythaac.rememberme.Data.Token;
import com.pythaac.rememberme.Repository.PushInfoRepository;
import com.pythaac.rememberme.Repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
public class PushRegisterService
{
    private final PushInfoRepository pushInfoRepository;
    private final TokenRepository tokenRepository;

    @Autowired
    public PushRegisterService(PushInfoRepository pushInfoRepository, TokenRepository tokenRepository)
    {
        this.pushInfoRepository = pushInfoRepository;
        this.tokenRepository = tokenRepository;
    }

    @PostMapping(value = "/register")
    @ResponseBody
    public ResponseEntity<String> register(@RequestBody PushInfo info){
        Pattern pat = Pattern.compile("\\d\\d:\\d\\d");
        Matcher m = pat.matcher(info.getTime());
        if (!m.find())
            return ResponseEntity.badRequest().body("입력 정보를 확인하세요");
        info.setTime(m.group(0));
        if (info.equals(pushInfoRepository.save(info)))
        {
            System.out.println("[Token] " + info.getTime() + ", " + info.getCategory());
            return ResponseEntity.ok("저장되었습니다");
        }
        else
            return ResponseEntity.badRequest().body("입력 정보를 확인하세요");
    }

    @PostMapping(value = "/tokenRegister")
    @ResponseBody
    public ResponseEntity<String> tokenRegister(@RequestBody Token token){
        Assert.notNull(token, "token is null");
        tokenRepository.deleteAll();
        if (token.equals(tokenRepository.save(token))) {
            System.out.println("[Token] " + token.getToken());
            return ResponseEntity.ok("저장되었습니다");
        }
        else{
            System.out.println("[Token] 저장 실패");
            return ResponseEntity.badRequest().body("토큰을 확인하세요");
        }
    }
}
