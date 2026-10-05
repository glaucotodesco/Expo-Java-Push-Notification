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

No Windows, o arquivo `.env.example` também pode ser copiado manualmente para `.env`.

Edite `.env` e informe o endereço do computador na rede local:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

O celular e o computador precisam conseguir se comunicar pela rede.

## 3. Configurar Expo / EAS

Dentro de `mobile/`:

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build:configure
```

O `eas init` associa o projeto ao Expo/EAS e adiciona o `projectId` usado para obter o `ExpoPushToken`.

## 4. Configurar Firebase / FCM

No Firebase Console:

1. Crie ou escolha um projeto.
2. Adicione um aplicativo **Android**.
3. Use exatamente o package:

```text
com.exemplo.pushnotification
```

4. Baixe o arquivo `google-services.json`.
5. Coloque-o localmente em:

```text
mobile/google-services.json
```

O arquivo está no `.gitignore` e **não será enviado ao EAS Build pelo Git**.

### 4.1 Enviar google-services.json ao EAS

O EAS Build precisa receber o arquivo separadamente. Dentro de `mobile/`, execute:

```bash
npx eas-cli@latest env:set --name GOOGLE_SERVICES_JSON --value ./google-services.json --environment development --type file --visibility secret
```

Confira:

```bash
npx eas-cli@latest env:list --environment development
```

Deve existir uma variável chamada:

```text
GOOGLE_SERVICES_JSON
```

O projeto possui `app.config.js`, que usa:

```javascript
process.env.GOOGLE_SERVICES_JSON ?? './google-services.json'
```

Assim:

```text
Execução local
→ usa ./google-services.json

EAS Build
→ usa o arquivo enviado como GOOGLE_SERVICES_JSON
```

> Não remova o `google-services.json` do `.gitignore` apenas para fazer o build funcionar.

## 5. Configurar credencial FCM V1

O `google-services.json` identifica o aplicativo Android no Firebase, mas não é a credencial privada usada para envio via FCM V1.

No Firebase Console:

```text
Project settings
→ Service accounts
→ Generate new private key
```

Baixe o JSON da Service Account e mantenha-o privado.

Depois:

```bash
npx eas-cli@latest credentials
```

No menu Android, configure a **Google Service Account Key for Push Notifications (FCM V1)** usando esse JSON.

> O JSON da Service Account contém chave privada. Nunca faça commit dele no GitHub.

## 6. Gerar o development build

O profile `development` do `eas.json` usa explicitamente o ambiente EAS `development`, portanto receberá a variável `GOOGLE_SERVICES_JSON`.

Execute:

```bash
npx eas-cli@latest build --profile development --platform android
```

O resultado será um **APK de development build** para instalação direta no Android.

Após instalar o APK:

```bash
npx expo start
```

Abra no Android o aplicativo **Push Notification** instalado, e não o Expo Go.

## 7. Fluxo de teste

1. Abrir o development build.
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
- JSON da Service Account
- chaves privadas
- outras credenciais

## Se o EAS informar que google-services.json está ausente

Erro típico:

```text
"google-services.json" is missing
Remember that EAS Build only uploads the files tracked by git.
```

Verifique:

```bash
npx eas-cli@latest env:list --environment development
```

A variável `GOOGLE_SERVICES_JSON` precisa existir como variável do tipo **file** no ambiente `development`.

Depois execute novamente:

```bash
npx eas-cli@latest build --profile development --platform android
```

## Documentação

- https://docs.expo.dev/push-notifications/overview/
- https://docs.expo.dev/push-notifications/push-notifications-setup/
- https://docs.expo.dev/push-notifications/fcm-credentials/
- https://docs.expo.dev/eas/environment-variables/manage/
