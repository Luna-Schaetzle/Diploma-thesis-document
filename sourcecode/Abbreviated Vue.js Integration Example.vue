<template>
  <div>
    <!-- AI Model Selection -->
    <select v-model="selectedModel">
      <option value="llama3.2:1b">LLaMA 3.2 - 1B (Fast)</option>
      <option value="llama3.2">LLaMA 3.2 - 2B (Latest)</option>
      <!-- more Models -->
    </select>
    <!-- Chat Display -->
    <div v-for="msg in currentChat.messages" :key="msg.id">
      <p v-if="msg.type==='user'">{{ msg.text }}</p>
      <p v-else>{{ msg.text }}</p>
    </div>
    <!-- User Input and Submission -->
    <input v-model="userInput" @keydown.enter="sendMessage" placeholder="Ask the AI question..." />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      userInput: '',
      selectedModel: 'llama3.2:1b',
      currentChat: { messages: [] },
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;
      // Append user message to chat
      this.currentChat.messages.push({ id: Date.now(), type: 'user', text: this.userInput });
      // Send the query to the Flask API
      const response = await axios.post('http://server-address/ask_ollama', {
        prompt: this.userInput,
        model: this.selectedModel,
      });
      // Append AI response to chat
      this.currentChat.messages.push({ id: Date.now(), type: 'ollama', text: response.data.choices[0].text });
      this.userInput = '';
    },
  },
};
</script>
