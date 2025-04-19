package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class EmailService {

    private JavaMailSender javaMailSender;

    public void sendSimpleMessage(String emailReceiver, String subject, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("m1kpod");
        message.setTo(emailReceiver);
        message.setSubject(subject);
        message.setText(code);
        log.info(message.toString());
        javaMailSender.send(message);
    }
}
