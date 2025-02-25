// AGNESChatbot.js - AGNES Climate Chatbot with OpenAI and document sources
// Replace with your actual OpenAI API key
require('dotenv').config({ path: './.env' });
console.log("API Key:", process.env.OPENAI_API_KEY); // Test if it loads
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Store chat history
let chatHistory = [];
let currentChatId = Date.now().toString();
let conversationHistory = [
  {
    role: "system",
    content: "You are AGNES, a helpful assistant specialized in climate change and environmental topics, especially as they relate to Nigeria and African contexts. Always cite your sources after providing information. Keep your responses friendly, conversational and informative."
  }
];

// Initialize localStorage if needed
function initializeStorage() {
  if (!localStorage.getItem('agnesChatHistory')) {
    localStorage.setItem('agnesChatHistory', JSON.stringify([]));
  } else {
    // Load chat history from localStorage
    chatHistory = JSON.parse(localStorage.getItem('agnesChatHistory'));
  }
}

// Toggle chatbot visibility
function toggleChatbot() {
  const chatbotContainer = document.getElementById('chatbot-container');
  if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
    chatbotContainer.style.display = 'flex';
    // Focus on input field when opening
    setTimeout(() => {
      const inputField = document.getElementById('chatbot-question');
      if (inputField) inputField.focus();
      
      // Scroll to the bottom to ensure the latest messages are visible
      scrollToBottom();
    }, 100);
  } else {
    chatbotContainer.style.display = 'none';
    // Close menu if open
    toggleMenu(false);
  }
}

// Toggle menu visibility
function toggleMenu(show = null) {
  const menu = document.getElementById('chatbot-menu');
  if (menu) {
    if (show === null) {
      // Toggle based on current state
      menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
    } else {
      // Set to specific state
      menu.style.display = show ? 'block' : 'none';
    }
  }
}

// Scroll to bottom of messages
function scrollToBottom() {
  const messagesContainer = document.getElementById('chatbot-messages');
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Switch between chat and history view
function switchView(view) {
  const chatView = document.getElementById('chatbot-chat-view');
  const historyView = document.getElementById('chatbot-history-view');
  const headerTitle = document.querySelector('.chatbot-header span');
  const backButton = document.getElementById('chatbot-back-button');
  const refreshButton = document.getElementById('chatbot-refresh-button');
  
  toggleMenu(false);
  
  if (view === 'history') {
    chatView.style.display = 'none';
    historyView.style.display = 'block';
    headerTitle.textContent = 'Recent Chats';
    backButton.style.display = 'block';
    refreshButton.style.display = 'none';
    displayChatHistory();
  } else {
    chatView.style.display = 'flex';
    historyView.style.display = 'none';
    headerTitle.textContent = 'AGNES CLIMATE CHATBOT';
    backButton.style.display = 'none';
    refreshButton.style.display = 'block';
    
    // Ensure the most recent messages are visible
    setTimeout(scrollToBottom, 50);
  }
}

// Display chat history
function displayChatHistory() {
  const historyContainer = document.getElementById('chatbot-history-list');
  historyContainer.innerHTML = '';
  
  // Sort history by date (newest first)
  const sortedHistory = [...chatHistory].sort((a, b) => b.timestamp - a.timestamp);
  
  if (sortedHistory.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'chatbot-history-empty';
    emptyMessage.textContent = 'No previous chats found';
    historyContainer.appendChild(emptyMessage);
    return;
  }
  
  sortedHistory.forEach(chat => {
    const historyItem = document.createElement('div');
    historyItem.className = 'chatbot-history-item';
    historyItem.onclick = () => loadChat(chat.id);
    
    // Create chat preview
    const preview = chat.messages.find(m => m.type === 'user')?.text || 'New conversation';
    const date = new Date(chat.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
    
    historyItem.innerHTML = `
      <div class="history-avatar">AC</div>
      <div class="history-content">
        <div class="history-preview">${preview.length > 30 ? preview.substring(0, 30) + '...' : preview}</div>
        <div class="history-meta">AGNES CLIMATE · ${formattedDate}</div>
      </div>
      <div class="history-action">Open</div>
    `;
    
    historyContainer.appendChild(historyItem);
  });
}

// Load a specific chat
function loadChat(chatId) {
  const chat = chatHistory.find(c => c.id === chatId);
  if (!chat) return;
  
  // Set as current chat
  currentChatId = chatId;
  
  // Clear messages container
  const messagesContainer = document.getElementById('chatbot-messages');
  messagesContainer.innerHTML = '';
  
  // Load messages
  chat.messages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.className = msg.type === 'user' ? 'user-message' : 'bot-message';
    
    // For bot messages, handle source citations
    if (msg.type === 'bot' && msg.sources) {
      // Main message text
      messageDiv.innerHTML = `${msg.text}`;
      
      // Add sources if present
      if (msg.sources && msg.sources.length > 0) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'message-sources';
        sourcesDiv.innerHTML = `<div class="sources-title">Sources:</div>`;
        
        msg.sources.forEach(source => {
          const sourceItem = document.createElement('div');
          sourceItem.className = 'source-item';
          sourceItem.textContent = source;
          sourcesDiv.appendChild(sourceItem);
        });
        
        messageDiv.appendChild(sourcesDiv);
      }
    } else {
      messageDiv.textContent = msg.text;
    }
    
    messagesContainer.appendChild(messageDiv);
  });
  
  // Restore conversation history
  conversationHistory = chat.conversationHistory || [
    {
      role: "system",
      content: "You are AGNES, a helpful assistant specialized in climate change and environmental topics, especially as they relate to Nigeria and African contexts. Always cite your sources after providing information. Keep your responses friendly, conversational and informative."
    }
  ];
  
  // Switch back to chat view
  switchView('chat');
  
  // Scroll to bottom - with a small delay to ensure rendering is complete
  setTimeout(scrollToBottom, 100);
}

// Start a new chat
function startNewChat() {
  // Create new chat ID
  currentChatId = Date.now().toString();
  
  // Clear messages container
  const messagesContainer = document.getElementById('chatbot-messages');
  messagesContainer.innerHTML = '';
  
  // Add welcome messages
  const welcomeMsg1 = document.createElement('div');
  welcomeMsg1.className = 'bot-message';
  welcomeMsg1.textContent = "Hi! My Name is AGNES. I am an AI chatbot here to help with any questions you may have about Climate Change. Please note that I am still under training and may not have all the answers now, but definitely with time, I will be more optimized";
  messagesContainer.appendChild(welcomeMsg1);
  
  const welcomeMsg2 = document.createElement('div');
  welcomeMsg2.className = 'bot-message';
  welcomeMsg2.textContent = "What can I help you with?";
  messagesContainer.appendChild(welcomeMsg2);
  
  // Reset conversation history
  conversationHistory = [
    {
      role: "system",
      content: "You are AGNES, a helpful assistant specialized in climate change and environmental topics, especially as they relate to Nigeria and African contexts. Always cite your sources after providing information. Keep your responses friendly, conversational and informative."
    }
  ];
  
  // Add to chat history
  const newChat = {
    id: currentChatId,
    timestamp: Date.now(),
    messages: [
      { type: 'bot', text: welcomeMsg1.textContent },
      { type: 'bot', text: welcomeMsg2.textContent }
    ],
    conversationHistory: [...conversationHistory]
  };
  
  chatHistory.push(newChat);
  
  // Save to localStorage
  localStorage.setItem('agnesChatHistory', JSON.stringify(chatHistory));
  
  // Switch to chat view
  switchView('chat');
  
  // Hide menu
  toggleMenu(false);
  
  // Scroll to bottom - with a small delay to ensure rendering is complete
  setTimeout(scrollToBottom, 100);
}

// Parse sources from the response
function parseSources(text) {
  // Look for sources section
  const sourcesMatch = text.match(/Sources:(.+?)$/s) || 
                      text.match(/From document "(.+?)":/) ||
                      text.match(/According to the (.+?),/g);
  
  if (!sourcesMatch) return { cleanText: text, sources: [] };
  
  let sources = [];
  let cleanText = text;
  
  // Extract document names from various patterns
  if (text.includes('Sources:')) {
    // Extract the sources section
    const sourcesSection = text.split('Sources:')[1].trim();
    // Split into individual sources
    sources = sourcesSection.split(/\n|,/).map(s => s.trim()).filter(s => s.length > 0);
    // Remove the sources section from the text
    cleanText = text.split('Sources:')[0].trim();
  } else {
    // Extract from inline citations
    const docMatches = text.match(/From document "(.+?)"/g) || [];
    const accordingMatches = text.match(/According to the (.+?),/g) || [];
    
    // Process "From document" matches
    docMatches.forEach(match => {
      const docName = match.replace('From document "', '').replace('"', '');
      if (!sources.includes(docName)) {
        sources.push(docName);
      }
    });
    
    // Process "According to" matches
    accordingMatches.forEach(match => {
      const docName = match.replace('According to the ', '').replace(',', '');
      if (!sources.includes(docName)) {
        sources.push(docName);
      }
    });
    
    // Keep the text as is for inline citations
    cleanText = text;
  }
  
  return { cleanText, sources };
}

// Add message to chat (user or bot)
function addMessage(text, isUser = false, sources = []) {
  const messagesContainer = document.getElementById('chatbot-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'user-message' : 'bot-message';
  
  // For bot messages, handle source citations
  if (!isUser && sources.length > 0) {
    // Main message text
    messageDiv.innerHTML = `${text}`;
    
    // Add sources
    const sourcesDiv = document.createElement('div');
    sourcesDiv.className = 'message-sources';
    sourcesDiv.innerHTML = `<div class="sources-title">Sources:</div>`;
    
    sources.forEach(source => {
      const sourceItem = document.createElement('div');
      sourceItem.className = 'source-item';
      sourceItem.textContent = source;
      sourcesDiv.appendChild(sourceItem);
    });
    
    messageDiv.appendChild(sourcesDiv);
  } else {
    messageDiv.textContent = text;
  }
  
  messagesContainer.appendChild(messageDiv);
  
  // Ensure auto-scroll to latest message
  setTimeout(scrollToBottom, 10);
  
  // Find current chat in history
  const chatIndex = chatHistory.findIndex(c => c.id === currentChatId);
  const msgObject = { 
    type: isUser ? 'user' : 'bot', 
    text: text
  };
  
  // Add sources if present
  if (!isUser && sources.length > 0) {
    msgObject.sources = sources;
  }
  
  if (chatIndex >= 0) {
    // Update existing chat
    chatHistory[chatIndex].messages.push(msgObject);
    chatHistory[chatIndex].timestamp = Date.now(); // Update timestamp to bring to top
    chatHistory[chatIndex].conversationHistory = [...conversationHistory];
  } else {
    // Create new chat
    chatHistory.push({
      id: currentChatId,
      timestamp: Date.now(),
      messages: [msgObject],
      conversationHistory: [...conversationHistory]
    });
  }
  
  // Save to localStorage
  localStorage.setItem('agnesChatHistory', JSON.stringify(chatHistory));
}

// Show loading indicator with bouncing dots
function showLoadingIndicator() {
  const messagesContainer = document.getElementById('chatbot-messages');
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-indicator';
  loadingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  messagesContainer.appendChild(loadingDiv);
  
  // Ensure the loading indicator is visible
  setTimeout(scrollToBottom, 10);
  
  return loadingDiv;
}

// Get document content from local folder path
async function getDocumentContent(docName) {
  try {
    const response = await fetch(`docs/${docName}`);
    if (!response.ok) {
      console.error(`Failed to fetch document: ${docName}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching document ${docName}:`, error);
    return null;
  }
}

// Get list of available documents
async function getAvailableDocuments() {
  // This is a hardcoded list of documents from your project
  return [
    "Harmful Waste (Special Criminal Provisions).pdf",
    "Land Use Act 1978.pdf",
    "National Environmental Standards and Regulations.pdf",
    "National Oil Spill Detection and Response Agency.pdf",
    "NIGERIA MINERAL AND MINING ACT 2007.pdf",
    "Nigerian Meterological Agency (Establishment).pdf",
    "Nigerian Urban and Regional Planning Act 1992.pdf",
    "Nigerian Urban and Regional Planning Act.pdf",
    "Oil in Navigable Waters Decree 1989.pdf",
    "Oil Pipelines Act 1956.pdf",
    "Petroleum Act 1969.pdf",
    "The National Agricultural Resilience Framework.pdf",
    "Water Resources Act 1993.pdf"
  ];
}

// Search documents for relevant content
async function searchDocuments(query) {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 3);
  const documents = await getAvailableDocuments();
  let relevantContents = [];
  
  for (const docName of documents) {
    try {
      const content = await getDocumentContent(docName);
      if (!content) continue;
      
      const contentLower = content.toLowerCase();
      let score = 0;
      
      // Score document based on query terms
      for (const term of queryTerms) {
        if (contentLower.includes(term)) {
          score += 1;
          // Boost score for exact phrase matches
          if (contentLower.includes(query.toLowerCase())) {
            score += 3;
          }
        }
      }
      
      if (score > 0) {
        // Extract relevant sections
        const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
        let relevantSentences = [];
        
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i].toLowerCase();
          if (queryTerms.some(term => sentence.includes(term))) {
            // Include surrounding sentences for context
            const start = Math.max(0, i - 1);
            const end = Math.min(sentences.length, i + 2);
            relevantSentences = sentences.slice(start, end);
            break;
          }
        }
        
        if (relevantSentences.length > 0) {
          relevantContents.push({
            docName,
            content: relevantSentences.join(' '),
            score
          });
        }
      }
    } catch (error) {
      console.error(`Error processing document ${docName}:`, error);
    }
  }
  
  // Sort by relevance score
  relevantContents.sort((a, b) => b.score - a.score);
  
  if (relevantContents.length > 0) {
    // Take top 2 most relevant results
    const topResults = relevantContents.slice(0, 2);
    let combinedContext = "";
    let usedSources = [];
    
    topResults.forEach(result => {
      combinedContext += `From document "${result.docName}": ${result.content}\n\n`;
      usedSources.push(result.docName);
    });
    
    return { context: combinedContext, sources: usedSources };
  }
  
  return { context: "", sources: [] };
}

// Generate response using OpenAI API
async function generateOpenAIResponse(userMessage) {
  try {
    // Update conversation history with user message
    conversationHistory.push({ role: "user", content: userMessage });
    
    // Search documents for relevant content
    const { context: documentContext, sources: documentSources } = await searchDocuments(userMessage);
    
    // Add document context if found
    let messages = [...conversationHistory];
    if (documentContext) {
      messages.push({
        role: "system",
        content: `Relevant information from Nigerian environmental documents:\n${documentContext}\n\nIncorporate this information into your response when relevant, but maintain a natural, conversational tone. After your response, list the sources you used with a "Sources:" heading. The sources are: ${documentSources.join(", ")}`
      });
    }
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;
    
    // Update conversation history with bot response
    conversationHistory.push({ role: "assistant", content: botResponse });
    
    // Trim history if getting too long (keep system prompt and last few exchanges)
    if (conversationHistory.length > 10) {
      conversationHistory = [
        conversationHistory[0], // Keep system prompt
        ...conversationHistory.slice(-9) // Keep last 9 messages
      ];
    }
    
    // Parse sources from response or use document sources
    const { cleanText, sources: parsedSources } = parseSources(botResponse);
    const allSources = [...new Set([...parsedSources, ...documentSources])];
    
    return { text: cleanText, sources: allSources };
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}

// Handle user messages
async function askQuestion() {
  const inputField = document.getElementById('chatbot-question');
  const question = inputField.value.trim();
  
  if (!question) return;
  
  // Disable the input field and button while processing
  inputField.disabled = true;
  document.querySelector('.chatbot-input button').disabled = true;
  
  // Clear input field
  inputField.value = '';
  
  // Add user message to chat
  addMessage(question, true);
  
  // Show loading indicator
  const loadingIndicator = showLoadingIndicator();
  
  try {
    // Generate response
    const { text, sources } = await generateOpenAIResponse(question);
    
    // Remove loading indicator
    loadingIndicator.remove();
    
    // Add bot response to chat with sources
    addMessage(text, false, sources);
  } catch (error) {
    console.error('Error:', error);
    
    // Remove loading indicator
    loadingIndicator.remove();
    
    // Add error message
    addMessage("I apologize, but I encountered an error. Please try asking your question again.");
  } finally {
    // Re-enable the input field and button
    inputField.disabled = false;
    document.querySelector('.chatbot-input button').disabled = false;
    inputField.focus();
  }
}

// Initialize chatbot
function initChatbot() {
  // Initialize storage
  initializeStorage();
  
  // Set up event listener for Enter key
  document.getElementById('chatbot-question').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      askQuestion();
    }
  });
  
  // Add a new chat if none exists
  if (chatHistory.length === 0) {
    startNewChat();
  } else {
    // Load most recent chat
    loadChat(chatHistory[chatHistory.length - 1].id);
  }
  
  // Make functions globally available
  window.toggleChatbot = toggleChatbot;
  window.toggleMenu = toggleMenu;
  window.switchView = switchView;
  window.startNewChat = startNewChat;
  window.askQuestion = askQuestion;
  window.loadChat = loadChat;
  window.scrollToBottom = scrollToBottom;
}

// Create enhanced UI when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Create enhanced UI
  createEnhancedUI();
  
  // Initialize chatbot functionality
  initChatbot();
});

// Create enhanced UI with history view and menu
function createEnhancedUI() {
  // Get existing container
  const existingContainer = document.getElementById('chatbot-container');
  
  if (existingContainer) {
    // Create enhanced HTML structure
    existingContainer.innerHTML = `
      <div class="chatbot-header">
        <button id="chatbot-back-button" onclick="switchView('chat')" style="display: none; background: transparent; border: none; color: white; cursor: pointer;">
          ←
        </button>
        <span>AGNES CLIMATE CHATBOT</span>
        <div class="chatbot-header-actions">
          <button id="chatbot-refresh-button" onclick="scrollToBottom()" class="refresh-button">⟳</button>
          <button onclick="toggleMenu()" class="menu-button">⋮</button>
          <button onclick="toggleChatbot()" class="close-button">✖</button>
        </div>
      </div>
      
      <!-- Dropdown menu -->
      <div id="chatbot-menu" class="chatbot-menu" style="display: none;">
        <div class="menu-item" onclick="startNewChat()">
          <span class="menu-icon">+</span>
          <span class="menu-text">Start a new chat</span>
        </div>
        <div class="menu-item" onclick="switchView('history')">
          <span class="menu-icon">⏱</span>
          <span class="menu-text">View recent chats</span>
        </div>
      </div>
      
      <!-- Chat View -->
      <div id="chatbot-chat-view">
        <div class="chatbot-messages" id="chatbot-messages"></div>
        <div class="chatbot-input">
          <input type="text" id="chatbot-question" placeholder="Ask a question...">
          <button onclick="askQuestion()">Send</button>
        </div>
      </div>
      
      <!-- History View -->
      <div id="chatbot-history-view" style="display: none;">
        <div id="chatbot-history-list" class="chatbot-history-list"></div>
      </div>
    `;
    
    // Add CSS for enhanced UI
    if (!document.getElementById('agnes-chatbot-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'agnes-chatbot-styles';
      styleElement.textContent = `
        /* Base styles */
        .chatbot-container {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 350px; 
          height: 500px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          display: none;
          flex-direction: column;
          z-index: 9999;
          overflow: hidden;
        }
        
        .chatbot-header {
          background: #008751;
          color: white;
          padding: 10px 15px;
          border-radius: 10px 10px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          z-index: 10;
          position: sticky;
          top: 0;
        }
        
        .chatbot-header-actions {
          display: flex;
          gap: 10px;
        }
        
        .chatbot-header button {
          background: transparent;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 5px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .chatbot-header button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        #chatbot-chat-view {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }
        
        #chatbot-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: #f8f8f8;
          display: flex;
          flex-direction: column;
          scroll-behavior: smooth;
        }
        
        .bot-message, .user-message {
          max-width: 85%;
          padding: 12px 16px;
          margin-bottom: 10px;
          border-radius: 18px;
          word-wrap: break-word;
          position: relative;
          animation: fadeIn 0.3s ease;
          font-size: 14px;
          line-height: 1.4;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .bot-message {
          background-color: #f0f0f0;
          color: #333;
          align-self: flex-start;
          border-bottom-left-radius: 5px;
          margin-right: auto;
        }
        
        .user-message {
          background-color: #008751;
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 5px;
          margin-left: auto;
        }
        
        .message-sources {
          margin-top: 8px;
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
          padding-top: 8px;
        }
        
        .sources-title {
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .source-item {
          padding: 2px 0;
          color: #555;
        }
        
        /* Enhanced styles for menu and history */
        .chatbot-menu {
          position: absolute;
          top: 45px;
          right: 10px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 10001;
          width: 200px;
          overflow: hidden;
        }
        
        .menu-item {
          padding: 12px 15px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .menu-item:hover {
          background: #f5f5f5;
        }
        
        .menu-icon {
          margin-right: 12px;
          font-size: 16px;
          width: 20px;
          text-align: center;
        }
        
        #chatbot-history-view {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .chatbot-history-list {
          overflow-y: auto;
          flex: 1;
        }
        
        .chatbot-history-item {
          padding: 15px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .chatbot-history-item:hover {
          background: #f5f5f5;
        }
        
        .history-avatar {
          width: 40px;
          height: 40px;
          background: #008751;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-weight: bold;
        }
        
        .history-content {
          flex: 1;
        }
        
        .history-preview {
          font-weight: 500;
          margin-bottom: 4px;
          color: #333;
        }
        
        .history-meta {
          font-size: 12px;
          color: #666;
        }
        
        .history-action {
          color: #008751;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .history-action:hover {
          background-color: rgba(0, 135, 81, 0.1);
        }
        
        .chatbot-history-empty {
          text-align: center;
          padding: 30px 15px;
          color: #666;
        }
        
        /* Loading indicator with bouncing dots */
        .loading-indicator {
          align-self: flex-start;
          margin: 8px 0;
        }
        
        .typing-dots {
          display: flex;
          gap: 4px;
          padding: 10px 16px;
          background: #f0f0f0;
          border-radius: 18px;
          border-bottom-left-radius: 5px;
          width: fit-content;
        }
        
        .typing-dots span {
          width: 8px;
          height: 8px;
          background: #008751;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1s infinite;
        }
        
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        /* Input field and button */
        .chatbot-input {
          display: flex;
          padding: 10px 15px;
          border-top: 1px solid #eee;
          background: white;
          z-index: 10;
        }
        
        .chatbot-input input {
          flex-grow: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
        }
        
        .chatbot-input input:focus {
          border-color: #008751;
          box-shadow: 0 0 0 2px rgba(0, 135, 81, 0.1);
        }
        
        .chatbot-input button {
          background: #008751;
          color: white;
          border: none;
          padding: 10px 20px;
          margin-left: 8px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .chatbot-input button:hover {
          background-color: #006b3e;
        }
        
        .chatbot-input button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        /* Fab button style */
        .fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background-color: #008751;
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          font-size: 24px;
          z-index: 9998;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .fab:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        }
        
        /* For mobile devices */
        @media (max-width: 480px) {
          .chatbot-container {
            width: 100%;
            height: 100%;
            right: 0;
            bottom: 0;
            border-radius: 0;
          }
          
          .chatbot-header {
            border-radius: 0;
          }
          
          .fab {
            bottom: 10px;
            right: 10px;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
  }
}