<template>
    <div class="ocr-component">
      <h2>OCR Functionality</h2>
      <!-- Prompt Input & Image Upload -->
      <input v-model="prompt" placeholder="Enter a prompt..." @keydown.enter="sendRequest" />
      <input type="file" @change="handleImageUpload" accept="image/*" />
      <button @click="sendRequest" :disabled="!selectedImage || loading">
        Submit
      </button>
      <!-- Status and Result Display -->
      <div v-if="loading">Processing image...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="rawText">
        <h3>Extracted Text:</h3>
        <pre>{{ rawText }}</pre>
        <button @click="copyText(rawText)">Copy</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        prompt: "",
        selectedImage: null,
        rawText: "",
        loading: false,
        error: ""
      };
    },
    methods: {
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) this.selectedImage = file;
      },
      async sendRequest() {
        if (!this.prompt || !this.selectedImage) {
          this.error = "Both prompt and image are required.";
          return;
        }
        this.loading = true;
        // Create FormData and send request to the Flask API
        // Response processing updates rawText with extracted and optimized text
        this.loading = false;
      },
      copyText(text) {
        navigator.clipboard.writeText(text);
      }
    }
  };
  </script>