# Expo + Java: Push Notification

Projeto didático de **Push Notification** com Expo / React Native e Java / Spring Boot.

O projeto acompanha o material da aula e demonstra o fluxo:

```text
App Expo
   ↓ registra ExpoPushToken
Spring Boot + H2
   ↓ envia mensagem
Expo Push Service
   ↓
Firebase Cloud Messaging (FCM)
   ↓
Android
```

## Estrutura

```text
Expo-Java-Push-Notification/
├── mobile/
└── backend/
```

## Pré-requisitos

- Node.js compatível com Expo SDK 57
- Java 21
- Maven
- conta Expo
- EAS CLI
- projeto Firebase para Android/FCM
- dispositivo Android ou emulador com Google Play Services

> Push remoto não funciona no Expo Go no Android. Use um **development build**. Notificações locais continuam úteis para validar permissões e o código básico.

## 1. Backend

```bash
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080`

H2 Console: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:pushnotification`
- User: `sa`
- Password: vazio

Endpoints:

```text
POST /api/devices
GET  /api/devices
POST /api/notifications
```

## 2. Mobile

```bash
cd mobile
npm install
cp .env.example .env
```

Edite `.env` e informe o endereço do computador na rede local:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

Depois:

```bash
npx eas-cli@latest init
npx eas-cli@latest build:configure
```

Configure o Firebase/FCM, adicione o `google-services.json` em `mobile/` e gere o development build:

```bash
npx eas-cli@latest build --profile development --platform android
```

Após instalar o build no Android:

```bash
npx expo start
```

## Fluxo de teste

1. Abrir o aplicativo.
2. Solicitar permissão.
3. Testar uma notificação local.
4. Gerar o Expo Push Token.
5. Registrar o dispositivo no Spring.
6. Conferir o token no H2.
7. Preencher título, mensagem, categoria e avisoId.
8. Enviar a Push Notification.
9. Tocar na notificação.
10. Conferir os dados recebidos no aplicativo.

## Segurança

Não faça commit de:

- `.env`
- `google-services.json`
- chaves privadas
- credenciais de Service Account

## Documentação

- https://docs.expo.dev/push-notifications/overview/
- https://docs.expo.dev/push-notifications/push-notifications-setup/
- https://docs.expo.dev/push-notifications/sending-notifications/
