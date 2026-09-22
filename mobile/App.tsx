import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { API_URL } from './src/config';
import {
  registerDevice,
  sendPushNotification,
} from './src/api';
import {
  configureAndroidChannel,
  getExpoPushToken,
  requestNotificationPermission,
  sendLocalNotification,
} from './src/notifications';

export default function App() {
  const [permission, setPermission] = useState('não solicitada');
  const [pushToken, setPushToken] = useState('');
  const [title, setTitle] = useState('Novo aviso');
  const [body, setBody] = useState('Existe uma nova mensagem para você.');
  const [categoria, setCategoria] = useState('INFO');
  const [avisoId, setAvisoId] = useState('1');
  const [lastInteraction, setLastInteraction] = useState(
    'Nenhuma notificação aberta.',
  );

  useEffect(() => {
    configureAndroidChannel().catch(console.error);

    const receivedSubscription =
      Notifications.addNotificationReceivedListener(notification => {
        console.log('Notificação recebida:', notification);
      });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        setLastInteraction(
          `Categoria: ${String(data?.categoria ?? '-')}
Aviso: ${String(
            data?.avisoId ?? '-',
          )}`,
        );
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  async function handlePermission() {
    try {
      const status = await requestNotificationPermission();
      setPermission(status);
    } catch (error) {
      showError(error);
    }
  }

  async function handleGenerateToken() {
    try {
      const status = await requestNotificationPermission();
      setPermission(status);

      if (status !== 'granted') {
        throw new Error('Permissão para notificações não concedida.');
      }

      const token = await getExpoPushToken();
      setPushToken(token);
    } catch (error) {
      showError(error);
    }
  }

  async function handleRegister() {
    if (!pushToken) {
      Alert.alert('Atenção', 'Gere o Push Token primeiro.');
      return;
    }

    try {
      await registerDevice({
        pushToken,
        platform: Platform.OS,
      });

      Alert.alert('Sucesso', 'Dispositivo registrado no backend.');
    } catch (error) {
      showError(error);
    }
  }

  async function handleRemotePush() {
    const parsedAvisoId = Number(avisoId);

    if (!Number.isInteger(parsedAvisoId) || parsedAvisoId < 1) {
      Alert.alert('Atenção', 'Informe um avisoId inteiro maior que zero.');
      return;
    }

    try {
      await sendPushNotification({
        title,
        body,
        categoria,
        avisoId: parsedAvisoId,
      });

      Alert.alert(
        'Solicitação enviada',
        'O Spring enviou a mensagem para o Expo Push Service.',
      );
    } catch (error) {
      showError(error);
    }
  }

  function showError(error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);
    Alert.alert('Erro', message);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Push Notification</Text>
        <Text style={styles.subtitle}>Expo + Java / Spring Boot</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Permissão</Text>
          <Text>Status: {permission}</Text>
          <Button
            title="Solicitar permissão"
            onPress={handlePermission}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Notificação local</Text>
          <Text>
            Testa a integração do aplicativo sem usar o backend.
          </Text>
          <Button
            title="Enviar notificação local"
            onPress={() =>
              sendLocalNotification().catch(showError)
            }
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. Push Token</Text>
          <Button
            title="Gerar Expo Push Token"
            onPress={handleGenerateToken}
          />
          <Text selectable style={styles.code}>
            {pushToken || 'Token ainda não gerado.'}
          </Text>
          <Button
            title="Registrar dispositivo no Spring"
            onPress={handleRegister}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>4. Enviar Push</Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
          />

          <TextInput
            style={styles.input}
            value={body}
            onChangeText={setBody}
            placeholder="Mensagem"
          />

          <TextInput
            style={styles.input}
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Categoria"
            autoCapitalize="characters"
          />

          <TextInput
            style={styles.input}
            value={avisoId}
            onChangeText={setAvisoId}
            placeholder="Aviso ID"
            keyboardType="number-pad"
          />

          <Button
            title="Enviar pelo Spring"
            onPress={handleRemotePush}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            5. Última notificação aberta
          </Text>
          <Text>{lastInteraction}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configuração</Text>
          <Text selectable style={styles.code}>
            API: {API_URL}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  code: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: 12,
  },
});
