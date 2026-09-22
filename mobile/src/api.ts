import { API_URL } from './config';

export type RegisterDeviceRequest = {
  pushToken: string;
  platform: string;
};

export type SendNotificationRequest = {
  title: string;
  body: string;
  categoria: string;
  avisoId: number;
};

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Erro HTTP ${response.status}`);
  }

  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function registerDevice(data: RegisterDeviceRequest) {
  return request('/api/devices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function sendPushNotification(
  data: SendNotificationRequest,
) {
  return request('/api/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
