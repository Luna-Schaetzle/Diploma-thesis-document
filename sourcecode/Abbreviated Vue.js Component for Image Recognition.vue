<template>
    <div class="image-recognition">
      <h1>Upload Image and Send to Ollama</h1>
      <!-- Text prompt input -->
      <input v-model="userPrompt" placeholder="Enter a prompt..." @keydown.enter="sendRequest" />
      <!-- File input for image upload -->
      <input type="file" @change="handleImageUpload" />
      <!-- Submission button -->
      <button @click="sendRequest">Submit</button>
      <!-- Status and response display -->
      <div v-if="loading">Sending request...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="response">
        <h3>Ollama Response:</h3>
        <p>{{ response }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userPrompt: "",
        imageData: "",
        loading: false,
        error: "",
        response: null
      };
    },
    methods: {
      handleImageUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => { 
          // Extract the Base64-encoded string from the data URL
          this.imageData = reader.result.split(",")[1];
        };
        if (file) reader.readAsDataURL(file);
      },
      async sendRequest() {
        if (!this.userPrompt || !this.imageData) {
          this.error = "Both prompt and image are required!";
          return;
        }
        this.loading = true;
        // Send the prompt and image data to the Flask API (request details omitted)
        // e.g., using axios.post(url, { prompt: this.userPrompt, image: this.imageData })
        // Process the response and update this.response accordingly.
        this.loading = false;
      }
    }
  };
  </script>