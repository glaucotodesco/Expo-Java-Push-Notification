package br.com.exemplo.pushnotification.device;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {

    private final DeviceRepository repository;

    public DeviceService(DeviceRepository repository) {
        this.repository = repository;
    }

    public Device register(RegisterDeviceRequest request) {
        if (request.pushToken() == null || request.pushToken().isBlank()) {
            throw new IllegalArgumentException("pushToken é obrigatório.");
        }

        String platform =
                request.platform() == null || request.platform().isBlank()
                        ? "unknown"
                        : request.platform();

        return repository.findByPushToken(request.pushToken())
                .map(existing -> {
                    existing.setPlatform(platform);
                    return repository.save(existing);
                })
                .orElseGet(() ->
                        repository.save(
                                new Device(request.pushToken(), platform)
                        )
                );
    }

    public List<Device> findAll() {
        return repository.findAll();
    }
}
