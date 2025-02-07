<script>
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../secrets";

export default {
  name: "OpenAIComponent",
  data() {
    return {
      userInput: "",
      generatedText: "",
      generatedImage: ""
    };
  },
  methods: {
    async generateText() {
      // Initialize OpenAI client with API key
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: this.userInput }]
        });
        // Extract and assign the generated text
        this.generatedText = response.choices[0].message.content;
      } catch (error) {
        console.error("Error during text generation:", error);
      }
    },
    async generateImage() {
      // Initialize OpenAI client for image generation
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      try {
        const response = await openai.images.generate({
          prompt: this.userInput,
          n: 1,
          size: "512x512"
        });
        // Extract and assign the URL of the generated image
        this.generatedImage = response.data[0].url;
      } catch (error) {
        console.error("Error during image generation:", error);
      }
    }
  }
};
</script>