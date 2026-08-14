export interface Sender {
  id: string;
  userId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendersResponse {
  success: boolean;
  senders: Sender[];
}

export interface CreateSenderResponse {
  success: boolean;
  sender: Sender;
}

export interface CreateSenderInput {
  name: string;
  email: string;
}
