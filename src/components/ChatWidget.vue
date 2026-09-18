<template>
  <div class="position-fixed bottom-0 end-0 p-4" style="z-index: 1080;">
    <!-- Chat Toggle Button -->
    <button
      @click="toggleChat"
      class="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center transition"
      style="width: 62px; height: 62px;"
      aria-label="Chatbot"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="card shadow-lg position-absolute bottom-100 end-0 mb-3 border-0 animate-fade-in"
      style="width: 380px; height: 520px; max-height: 85vh;"
    >
      <!-- Header -->
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top py-3">
        <div class="d-flex align-items-center gap-2">
          <span class="bg-success rounded-circle animate-pulse" style="width: 11px; height: 11px;"></span>
          <span class="fw-bold">Library Smart Assistant 🤖</span>
        </div>
        <button @click="toggleChat" class="btn-close btn-close-white" aria-label="Close"></button>
      </div>

      <!-- Messages Area -->
      <div class="card-body overflow-auto d-flex flex-column gap-3 bg-body-tertiary" style="font-size: 0.95rem;" ref="messagesContainer">
        <div class="d-flex justify-content-start">
          <div class="bg-white border text-dark p-3 rounded-4 shadow-sm" style="max-width: 85%;">
            Welcome! I am your smart assistant at <strong>Books & Authors</strong> .<br>
            I can help you find books, suggest authors, or guide you through the site sections. Ask me anything!
          </div>
        </div>

        <div v-for="(msg, index) in messages" :key="index" :class="['d-flex', msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start']">
          <div :class="[
            'p-3 rounded-4 shadow-sm',
            msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white border text-dark'
          ]" style="max-width: 85%; white-space: pre-line;">
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- Quick Suggestions -->
      <div class="card-footer bg-white p-2 d-flex gap-1 overflow-x-auto border-top-0">
        <button @click="sendPreset('I want programming books')" class="btn btn-outline-primary btn-sm text-nowrap rounded-pill py-1 px-3" style="font-size: 0.8rem;">💻 Programming</button>
        <button @click="sendPreset('Who are the famous authors?')" class="btn btn-outline-primary btn-sm text-nowrap rounded-pill py-1 px-3" style="font-size: 0.8rem;">✍️ Top Authors</button>
        <button @click="sendPreset('How to add a book to cart?')" class="btn btn-outline-primary btn-sm text-nowrap rounded-pill py-1 px-3" style="font-size: 0.8rem;">🛒 Cart</button>
        <button @click="sendPreset('Help')" class="btn btn-outline-secondary btn-sm text-nowrap rounded-pill py-1 px-3" style="font-size: 0.8rem;">❓ Help</button>
      </div>

      <!-- Input Area -->
      <form @submit.prevent="handleSendMessage" class="card-footer bg-white d-flex gap-2 p-3 border-top">
        <input
          v-model="userInput"
          type="text"
          placeholder="Type your question here..."
          class="form-control rounded-pill px-3"
        />
        <button type="submit" class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; min-width: 40px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWidget',
  data() {
    return {
      isOpen: false,
      userInput: '',
      messages: []
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    handleSendMessage() {
      if (!this.userInput.trim()) return;
      
      const text = this.userInput;
      this.messages.push({ sender: 'user', text });
      this.userInput = '';
      this.scrollToBottom();

      setTimeout(() => {
        const reply = this.getAdvancedSmartResponse(text);
        this.messages.push({ sender: 'bot', text: reply });
        this.scrollToBottom();
      }, 600);
    },
    sendPreset(text) {
      this.userInput = text;
      this.handleSendMessage();
    },
    getAdvancedSmartResponse(query) {
      const q = query.toLowerCase();

      // Greetings
      if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('morning') || q.includes('evening')) {
        return "Hello there! Welcome. How can I assist your reading passion today? Are you looking for a specific book or want to browse authors?";
      }

      // Programming & Tech Books
      if (q.includes('programming') || q.includes('code') || q.includes('tech') || q.includes('vue') || q.includes('js') || q.includes('developer')) {
        return "💻 We have a dedicated section for technical and programming books on the site! You can go to the (Books) page to browse the latest releases and add them directly to your cart.";
      }

      // General Books & Novels
      if (q.includes('book') || q.includes('read') || q.includes('novel') || q.includes('find')) {
        return "📚 To find the right book:\n1. Go to the (Books) page from the top navigation menu.\n2. Use the search bar or filter by category.\n3. Click on any book to view its full details, publication year, and description.";
      }

      // Authors
      if (q.includes('author') || q.includes('writer') || q.includes('who') || q.includes('creator')) {
        return "✍️ The (Authors) section features a wonderful collection of prominent writers with full biographies and profiles. Visit it to discover your favorite writers!";
      }

      // Cart & Checkout
      if (q.includes('cart') || q.includes('buy') || q.includes('checkout') || q.includes('add') || q.includes('basket')) {
        return "🛒 You can manage your shopping cart by clicking on the (Cart) button in the top right. There, you can review selected books, update quantities, or remove items.";
      }

      // Dashboard & Admin
      if (q.includes('dashboard') || q.includes('admin') || q.includes('manage') || q.includes('control')) {
        return "⚙️ The Admin Dashboard allows you to easily add, edit, or delete books and authors through a secure and protected interface.";
      }

      // Help & General
      if (q.includes('help') || q.includes('how') || q.includes('what can') || q.includes('support')) {
        return "💡 I am here to help you with everything inside Books & Authors:\n- Searching for technical and literature books 📖\n- Browsing writer information ✍️\n- Tracking your shopping cart 🛍️\n- Accessing the dashboard ⚙️\nJust type what you are looking for and I will guide you instantly!";
      }

      // Default fallback response
      return `Sorry, I couldn't precisely match your query "${query}" with our database.\nHowever, you can use the top navigation bar for quick access to sections, or type "help" to see available options!`;
    }
  }
}
</script>