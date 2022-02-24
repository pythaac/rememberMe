package com.pythaac.rememberme.Push;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.pythaac.rememberme.Data.PushInfo;
import com.pythaac.rememberme.Data.Token;
import com.pythaac.rememberme.Repository.PushInfoRepository;
import com.pythaac.rememberme.Repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@Controller
@EnableScheduling
public class PushService
{
    private final FirebaseMessaging msg;
    private final PushInfoRepository pushInfoRepository;
    private final TokenRepository tokenRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public PushService(PushInfoRepository pushInfoRepository, TokenRepository tokenRepository) throws IOException
    {
        String keyPath = "google/rememberme-578e6-firebase-adminsdk-lumv2-15e980c503.json";
        ClassPathResource key = new ClassPathResource(keyPath);

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(key.getInputStream()))
                .build();

        FirebaseApp app = FirebaseApp.initializeApp(options, "rememberMe");
        this.msg = FirebaseMessaging.getInstance(app);
        this.pushInfoRepository = pushInfoRepository;
        this.tokenRepository = tokenRepository;
        RestTemplateBuilder builder = new RestTemplateBuilder();
        this.restTemplate = builder.build();
        this.restTemplate
                .getMessageConverters()
                .add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
    }

    @Scheduled(cron = "0 * * * * *")
    public void sendAllPush() throws FirebaseMessagingException
    {
        // get current time
        LocalTime now = LocalTime.now(ZoneId.of("Asia/Seoul"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String currentTime = now.format(formatter);

        // get token
        ArrayList<Token> tokens = tokenRepository.findAll();
        if (tokens.size() < 1)
            return;

        String token = tokens.get(0).getToken();

        // get push from database
        ArrayList<PushInfo> infos = pushInfoRepository.findAll();

        // find push to send
        ArrayList<PushInfo> toSend = new ArrayList<>();
        for(int i=0; i<infos.size(); i++){
            PushInfo info = infos.get(i);
            if (info.getTime().equals(currentTime))
                toSend.add(info);
        }

        // send push
        for(int i=0; i<toSend.size(); i++){
            PushInfo info = toSend.get(i);
            Post post = getRandomPost(info.getCategory());
            Assert.notNull(post, "post is null");
            Assert.notNull(post.getTitle(), "title is null");
            Assert.notNull(post.getId(), "id is null");
            Assert.notNull(info.getCategory(), "category is null");

            System.out.println(sendPush(token, info.getCategory(), post.getTitle(), post.getTitle(), post.getId()));
        }

        System.out.println("[" + currentTime + "] " + toSend.size() + " sent");
    }

    @GetMapping(value = "/test")
    @ResponseBody
    public void test() throws FirebaseMessagingException
    {
        ArrayList<Token> tokens = tokenRepository.findAll();
        if (tokens.size() < 1)
            return;

        String token = tokens.get(0).getToken();
        String result = sendPush(
                token,
                "[개발] 계획하기/DR",
                "[Daily Report] 22.01.19 - createPost, deletePost 작성",
                "[Daily Report] 22.01.19 - createPost, deletePost 작성",
                "265");
        System.out.println("test sent: " + result);
    }

    private Post getRandomPost(String cat){
        String MAMACOCO = "http://192.168.1.3:8080";
        String url = MAMACOCO + "/rememberMe/randomPostByCategory";
        HttpEntity<String> body = new HttpEntity<>(cat);
        System.out.println("[getRandomPost] " + cat);

        return this.restTemplate.postForObject(
                        url,
                        body,
                        Post.class
                    );
    }

    private String sendPush(String token, String notiTitle, String notiBody, String title, String id) throws FirebaseMessagingException
    {
        Notification notification = Notification
                .builder()
                .setTitle(notiTitle)
                .setBody(notiBody)
                .build();

        Message message = Message
                .builder()
                .setToken(token)
                .putData("title", title)
                .putData("id", id)
                .setNotification(notification)
                .build();

        return msg.send(message);
    }

    static class Post{
        private String title;
        private String id;

        public Post() {}

        public Post(String title, String id)
        {
            this.title = title;
            this.id = id;
        }

        public String getTitle()
        {
            return title;
        }

        public void setTitle(String title)
        {
            this.title = title;
        }

        public String getId()
        {
            return id;
        }

        public void setId(String id)
        {
            this.id = id;
        }
    }
}
