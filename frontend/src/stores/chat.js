import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    messagesPage: 1,
    hasMoreMessages: true,
    loading: false,
    showNewChatDialog: false
  }),

  actions: {
    async fetchConversations () {
      const { data } = await api.get('/conversations')
      this.conversations = data.conversations
      return data.conversations
    },

    async fetchConversation (id) {
      const { data } = await api.get(`/conversations/${id}`)
      this.currentConversation = data.conversation
      return data.conversation
    },

    async fetchMessages (conversationId, reset = true) {
      if (reset) {
        this.messagesPage = 1
        this.messages = []
        this.hasMoreMessages = true
      }
      if (!this.hasMoreMessages && !reset) return this.messages
      const { data } = await api.get(`/conversations/${conversationId}/messages`, {
        params: { page: this.messagesPage }
      })
      const newMessages = data.data || []
      if (reset) {
        this.messages = newMessages
      } else {
        this.messages = [...newMessages, ...this.messages]
      }
      this.hasMoreMessages = (data.current_page || 1) < (data.last_page || 1)
      this.messagesPage = (data.current_page || 1) + 1
      return this.messages
    },

    async loadMoreMessages (conversationId) {
      if (!this.hasMoreMessages) return
      return this.fetchMessages(conversationId, false)
    },

    prependMessage (message) {
      if (!message || this.messages.some(m => m.id === message.id)) return
      this.messages.push(message)
    },

    async sendMessage (conversationId, body, attachments = []) {
      const form = new FormData()
      if (body) form.append('body', body)
      attachments.forEach((file) => form.append('attachments[]', file))
      const { data } = await api.post(`/conversations/${conversationId}/messages`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      this.prependMessage(data.message)
      const conv = this.conversations.find(c => c.id === conversationId)
      if (conv) {
        conv.last_message = {
          body: data.message.body || '(attachment)',
          user_name: data.message.user?.name,
          created_at: data.message.created_at
        }
      }
      return data.message
    },

    async createConversation (type, participantIds, name = null) {
      const { data } = await api.post('/conversations', {
        type,
        participant_ids: participantIds,
        name
      })
      await this.fetchConversations()
      return data.conversation
    },

    async deleteConversation (conversationId) {
      await api.delete(`/conversations/${conversationId}`)
      this.conversations = this.conversations.filter(c => c.id !== conversationId)
      if (this.currentConversation?.id === conversationId) {
        this.currentConversation = null
        this.messages = []
      }
    },

    async pollNewMessages (conversationId) {
      if (this.messages.length === 0) return
      const lastId = Math.max(...this.messages.map(m => m.id))
      const { data } = await api.get(`/conversations/${conversationId}/messages`, {
        params: { after_id: lastId }
      })
      const newMessages = data.data || []
      newMessages.forEach(m => this.prependMessage(m))
      return newMessages
    },

    updateConversationFromPush (conversationId, message) {
      const conv = this.conversations.find(c => c.id === conversationId)
      if (conv) {
        conv.last_message = {
          body: message.body || '(attachment)',
          user_name: message.user?.name,
          created_at: message.created_at
        }
      }
      if (this.currentConversation?.id === conversationId) {
        this.prependMessage(message)
      }
    }
  }
})
