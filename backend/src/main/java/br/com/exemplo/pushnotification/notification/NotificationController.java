package br.com.exemplo.pushnotification.notification;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final ExpoPushService service;

    public NotificationController(ExpoPushService service) {
        this.service = service;
    }

    @PostMapping
    public List<NotificationResult> send(
            @RequestBody NotificationRequest request
    ) {
        return service.sendToAll(request);
    }
}
