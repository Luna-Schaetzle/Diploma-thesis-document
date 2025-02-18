<template>
    <div class="programming-bot">
      <!-- Selection Area for Model and Programming Language -->
      <div class="selection-area">
        <select v-model="selectedModel">
          <option value="modelA">Model A</option>
          <option value="modelB">Model B</option>
        </select>
        <select v-model="selectedLanguage">
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      <!-- Chat Interface -->
      <div class="chat-box">
        <div v-for="msg in messages" :class="msg.type">{{ msg.text }}</div>
      </div>
      <!-- Input Area with Refine Option -->
      <textarea v-model="userInput" placeholder="Enter your programming question..."></textarea>
      <button @click="sendMessage">Send</button>
      <button v-if="isLastUserMessage" @click="prepareRefine">Refine</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userInput: '',
        selectedModel: 'modelA',
        selectedLanguage: 'python',
        messages: [],
      };
    },
    methods: {
      async sendMessage() {
        // Append the selected programming language to the user prompt
        const prompt = `Language: ${this.selectedLanguage}\n${this.userInput}`;
        // Send the prompt to the Flask API and process the response...
      },
      prepareRefine() {
        // Open a modal to refine the user prompt for improved accuracy
      }
    }
  };
  </script>
  