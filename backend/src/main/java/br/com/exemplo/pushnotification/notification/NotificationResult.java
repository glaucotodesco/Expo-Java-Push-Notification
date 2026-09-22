package br.com.exemplo.pushnotification.notification;

public record NotificationResult(
        Long deviceId,
        String pushToken,
        String expoResponse
) {
}
