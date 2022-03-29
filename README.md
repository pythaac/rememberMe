# rememberMe
블로그 리마인더

## 요약
rememberMe는 지정한 시간에 내가 작성했던 블로그 글을 푸쉬 알림으로 받는 어플리케이션입니다. 클라이언트에서 지정한 카테고리와 시간을 서버에 저장합니다. 서버는 매 분마다 DB에 저장된 시간과 일치하는 카테고리의 임의의 글 내용을 클라이언트로 전송합니다.  
&nbsp;  

## 기능
- 블로그 글 푸쉬알림  
&nbsp;  

## 시스템 구성
<img src="/image/시스템 구성도.png">  
&nbsp;  

## 푸쉬 정보 저장
푸쉬 정보를 서버에 저장하는 과정을 나타냅니다.
- SEND TOKEN  
디바이스를 식별하는 FCM 토큰을 서버로 전송합니다.
- CREATE PUSH  
Push를 생성하기 위해 카테고리 선택창으로 이동합니다.
- UPDATE CATEGORIES  
Push로 받을 카테고리 리스트를 가져옵니다.
- PICK TIME  
Push를 받을 시간을 설정합니다.
- SEND  
Push 정보를 저장합니다.  
<img src="/image/푸쉬 정보 저장.png">  
&nbsp;  

## 푸쉬 알림
서버에 저장된 푸쉬 정보를 활용하여 푸쉬 알림을 보내는 과정을 나타냅니다.
- CHECK PUSH  
Push를 보낼 정보가 있는지 확인합니다.
- SEND PUSH  
Push를 전송합니다.
- READ POST  
전송된 Push로 블로그 글을 가져옵니다.  
<img src="/image/푸쉬 알림.png">  
&nbsp;  
