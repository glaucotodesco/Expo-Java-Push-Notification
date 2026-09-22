package br.com.exemplo.pushnotification.notification;

public record NotificationRequest(
        String title,
        String body,
        String categoria,
        Long avisoId
) {
}
