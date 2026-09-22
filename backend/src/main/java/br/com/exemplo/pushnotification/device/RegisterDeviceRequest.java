package br.com.exemplo.pushnotification.device;

public record RegisterDeviceRequest(
        String pushToken,
        String platform
) {
}
