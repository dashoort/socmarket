import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/conversations', { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/messages/${userId}`, { withCredentials: true });
      return { userId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
    }
  }
);

const initialState = {
  conversations: [],
  messages: {},
  currentChat: null,
  loading: false,
  error: null,
  wsConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      // Accept both WebSocket and API message formats
      const msg = action.payload;
      const sender_id = msg.sender_id || msg.senderId;
      const receiver_id = msg.receiver_id || msg.receiverId;
      const chatKey = [sender_id, receiver_id].sort().join('-');
      if (!state.messages[chatKey]) {
        state.messages[chatKey] = [];
      }
      state.messages[chatKey].push({
        ...msg,
        sender_id,
        receiver_id,
        created_at: msg.created_at || msg.timestamp || new Date().toISOString(),
      });
    },
    setWebSocketStatus: (state, action) => {
      state.wsConnected = action.payload;
    },
    clearMessages: (state) => {
      state.messages = {};
      state.currentChat = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, messages } = action.payload;
        // Use currentChat and logged-in user for key
        if (state.currentChat && state.currentChat.other_user_id) {
          const chatKey = [state.currentChat.other_user_id, state.currentChat.user_id || userId].sort().join('-');
          state.messages[chatKey] = messages;
        } else {
          // fallback for initial load
          const chatKey = [userId].sort().join('-');
          state.messages[chatKey] = messages;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setCurrentChat, 
  addMessage, 
  setWebSocketStatus, 
  clearMessages 
} = chatSlice.actions;

export default chatSlice.reducer;