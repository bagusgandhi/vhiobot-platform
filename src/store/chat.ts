import { create } from 'zustand';

export interface IChat {
  message: IMessage[]
}

export interface IMessage {
  text: string
  sender: string
  timestamp: string
}

interface State {
  messages: IMessage[]
}

const INITIAL_STATE: State = {
  messages: [],
}

export const useChatStore = create((set: any, get: any) => ({
  messages: INITIAL_STATE.messages,
  addNewMessage: (data: IMessage) => {
    const messages = get().messages;
    const updatedMessage = [...messages, data];
    set(() => ({
      messages: updatedMessage
    }));
  },
  setAllMessage: (data: IChat) => {
    set(() => ({
      messages: data.message
    }));
  }
}));
