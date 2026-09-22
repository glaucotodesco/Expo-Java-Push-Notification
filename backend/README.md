# Backend - Spring Boot

## Executar

```bash
mvn spring-boot:run
```

Servidor: `http://localhost:8080`

## H2 Console

```text
http://localhost:8080/h2-console
```

Configuração:

```text
JDBC URL: jdbc:h2:mem:pushnotification
User: sa
Password:
```

## Endpoints

### Registrar dispositivo

```http
POST /api/devices
```

```json
{
  "pushToken": "ExponentPushToken[xxxx]",
  "platform": "android"
}
```

### Listar dispositivos

```http
GET /api/devices
```

### Enviar notificação

```http
POST /api/notifications
```

```json
{
  "title": "Novo aviso",
  "body": "Existe uma nova mensagem.",
  "categoria": "INFO",
  "avisoId": 1
}
```
