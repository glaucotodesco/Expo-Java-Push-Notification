# Mobile - Expo Push Notification

## Instalação

```bash
npm install
cp .env.example .env
```

Edite o arquivo `.env` com o IP do computador que executa o Spring Boot.

## Expo / EAS

Vincule o projeto à sua conta Expo:

```bash
npx eas-cli@latest init
npx eas-cli@latest build:configure
```

O comando `eas init` adiciona o `projectId` do projeto em `app.json`.

## Firebase / FCM

1. Cadastre uma aplicação Android no Firebase.
2. Use o package `com.exemplo.pushnotification`.
3. Baixe o arquivo `google-services.json`.
4. Coloque-o nesta pasta: `mobile/google-services.json`.
5. Configure as credenciais FCM V1 no EAS.

O arquivo `google-services.json` está no `.gitignore`.

## Development build

```bash
npx eas-cli@latest build --profile development --platform android
```

Instale o build no dispositivo e depois execute:

```bash
npx expo start
```

## Observação

- Notificação local pode ser usada para validar o código básico.
- Push remoto no Android exige development build; não use Expo Go para essa etapa.
