export interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  status: string;
  provider: string;
  isDevelopment: boolean;
}

export interface SendingDefaults {
  defaultDelayBetweenEmails: number;
  defaultHourlyLimit: number;
  maxRetriesPerEmail: number;
}

export interface SenderIdentity {
  name: string;
  email: string;
}

export interface SettingsData {
  smtp: SmtpSettings;
  sendingDefaults: SendingDefaults;
  senderIdentity: SenderIdentity;
}

export interface SettingsResponse {
  success: boolean;
  settings: SettingsData;
}

export interface TestEmailResponse {
  success: boolean;
  message: string;
  result: {
    messageId: string;
    previewUrl?: string | false;
    sentAt: string;
    recipient: string;
  };
}
