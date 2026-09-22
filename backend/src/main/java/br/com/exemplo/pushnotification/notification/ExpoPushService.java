package br.com.exemplo.pushnotification.notification;

import br.com.exemplo.pushnotification.device.Device;
import br.com.exemplo.pushnotification.device.DeviceRepository;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class ExpoPushService {

    private final DeviceRepository deviceRepository;
    private final RestClient restClient;

    public ExpoPushService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
        this.restClient = RestClient.builder()
                .baseUrl("https://exp.host")
                .build();
    }

    public List<NotificationResult> sendToAll(
            NotificationRequest request
    ) {
        validate(request);

        List<Device> devices = deviceRepository.findAll();

        if (devices.isEmpty()) {
            throw new IllegalStateException(
                    "Nenhum dispositivo registrado."
            );
        }

        return devices.stream()
                .map(device -> send(device, request))
                .toList();
    }

    private NotificationResult send(
            Device device,
            NotificationRequest request
    ) {
        Map<String, Object> payload = Map.of(
                "to", device.getPushToken(),
                "sound", "default",
                "title", request.title(),
                "body", request.body(),
                "channelId", "default",
                "data", Map.of(
                        "categoria", request.categoria(),
                        "avisoId", request.avisoId()
                )
        );

        String response = restClient.post()
                .uri("/--/api/v2/push/send")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(String.class);

        return new NotificationResult(
                device.getId(),
                device.getPushToken(),
                response
        );
    }

    private void validate(NotificationRequest request) {
        if (request.title() == null || request.title().isBlank()) {
            throw new IllegalArgumentException("title é obrigatório.");
        }

        if (request.body() == null || request.body().isBlank()) {
            throw new IllegalArgumentException("body é obrigatório.");
        }

        if (request.categoria() == null
                || request.categoria().isBlank()) {
            throw new IllegalArgumentException(
                    "categoria é obrigatória."
            );
        }

        if (request.avisoId() == null || request.avisoId() < 1) {
            throw new IllegalArgumentException(
                    "avisoId deve ser maior que zero."
            );
        }
    }
}
