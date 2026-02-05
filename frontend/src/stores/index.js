import { createPinia } from 'pinia'

// Quasar CLI expects a default export that returns a store instance.
// This is used internally to install Pinia on the app so that
// `useStore` (and our `useAuthStore` / `useChatStore`) work.

export default function () {
  const pinia = createPinia()
  return pinia
}

