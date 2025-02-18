<template>
    <div class="chat-container">
      <!-- Chat Window -->
      <div class="chat-window" v-if="currentChat">
        <div v-for="msg in currentChat.messages" :key="msg.id" :class="msg.type">
          <p v-if="msg.type==='user'">{{ msg.text }}</p>
          <div v-else v-html="renderMarkdown(msg.text)"></div>
        </div>
      </div>
      <!-- Sidebar for Saved Chats -->
      <aside class="chat-sidebar">
        <ul>
          <li v-for="chat in chats" :key="chat.id" @click="loadChat(chat.id)">
            {{ chat.name }}
          </li>
        </ul>
        <button @click="startNewChat">+ New Chat</button>
      </aside>
    </div>
  </template>
  
  <script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  
  export default {
    data() {
      return {
        chats: [],
        currentChat: null
      };
    },
    methods: {
      async loadChatList() {
        const snapshot = await firebase.firestore().collection('chats').get();
        this.chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
      async loadChat(chatId) {
        const doc = await firebase.firestore().collection('chats').doc(chatId).get();
        this.currentChat = { id: doc.id, ...doc.data() };
      },
      async saveChat() {
        if (this.currentChat) {
          await firebase.firestore().collection('chats').doc(this.currentChat.id)
            .set(this.currentChat);
        }
      },
      startNewChat() {
        // Create a new chat session and persist it to Firestore.
      },
      renderMarkdown(text) {
        // Convert Markdown text to HTML.
      }
    },
    mounted() {
      this.loadChatList();
    }
  };
  </script>
  