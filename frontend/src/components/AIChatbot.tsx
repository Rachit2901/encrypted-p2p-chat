import { Component, createSignal, createEffect, For, Show } from 'solid-js'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

const HINDSIGHT_API_URL = 'https://api.hindsight.vectorize.io/v1/default/banks/cybersecurity-assistant/reflect'
const HINDSIGHT_PROMO_CODE = 'MEMHACK1019'
const HINDSIGHT_API_KEY = 'hsk_50b425c99734390d6a9f74d59a7f5e78_021b3c05d1268660'

export const AIChatbot: Component<{ projectName?: string }> = (props) => {
  const projectName = () => props.projectName || 'Encrypted P2P Chat'
  const [isOpen, setIsOpen] = createSignal(false)
  const [messages, setMessages] = createSignal<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your **Hindsight AI Cryptographic Auditor** for **${projectName()}**.\n\nAsk me about Signal Protocol, Double Ratchet key ratcheting, zero-knowledge verification, or WebSocket security!\n\n🎁 **Coupon Code: MEMHACK1019** (Claim free credits on [Hindsight Cloud](https://vectorize.io))`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  let messagesContainer: HTMLDivElement | undefined

  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }

  createEffect(() => {
    if (isOpen() && messages().length) {
      setTimeout(scrollToBottom, 50)
    }
  })

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input()).trim()
    if (!queryText || loading()) return

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const response = await fetch(HINDSIGHT_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HINDSIGHT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `[Context: ${projectName()}] ${queryText}`,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: data.text || 'I analyzed your request but received an empty response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Unknown error'
      const errMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: `⚠️ **Error communicating with Hindsight AI**: ${errorText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
      setTimeout(scrollToBottom, 50)
    }
  }

  const quickPrompts = [
    'How does Double Ratchet achieve forward secrecy?',
    'Explain X3DH key agreement protocol',
    'How are WebSocket messages authenticated?',
    'What mitigates MITM in encrypted chat?',
  ]

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', 'z-index': 999999, 'font-family': 'system-ui, -apple-system, sans-serif' }}>
      <Show when={!isOpen()}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            'border-radius': '50%',
            background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
            border: 'none',
            'box-shadow': '0 8px 24px rgba(6, 182, 212, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            color: '#fff',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          title="Open AI Crypto Auditor (Hindsight)"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <circle cx="12" cy="11" r="3" />
            <path d="M12 8v1" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '14px',
              height: '14px',
              'background-color': '#10B981',
              'border-radius': '50%',
              border: '2px solid #0D1117',
            }}
          />
        </button>
      </Show>

      <Show when={isOpen()}>
        <div
          style={{
            width: '420px',
            'max-width': 'calc(100vw - 32px)',
            height: '580px',
            'max-height': 'calc(100vh - 80px)',
            'background-color': '#0D1117',
            border: '1px solid #30363D',
            'border-radius': '16px',
            'box-shadow': '0 20px 40px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            'flex-direction': 'column',
            overflow: 'hidden',
            color: '#E6EDF3',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)',
              'border-bottom': '1px solid #30363D',
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'space-between',
            }}
          >
            <div style={{ display: 'flex', 'align-items': 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  'border-radius': '10px',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center',
                  color: '#fff',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="11" r="2" />
                </svg>
              </div>
              <div>
                <div style={{ 'font-weight': 600, 'font-size': '15px', color: '#F0F6FC' }}>Hindsight Crypto Auditor</div>
                <div style={{ 'font-size': '11px', color: '#8B949E', display: 'flex', 'align-items': 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', 'border-radius': '50%', 'background-color': '#10B981', display: 'inline-block' }} />
                  {projectName()} • Connected
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      sender: 'assistant',
                      text: `Chat reset. How can I assist with cryptographic protocol analysis?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                style={{ background: 'transparent', border: 'none', color: '#8B949E', cursor: 'pointer', 'font-size': '12px' }}
              >
                Clear
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8B949E', cursor: 'pointer', 'font-size': '18px' }}>
                ×
              </button>
            </div>
          </div>

          <div
            ref={messagesContainer}
            style={{
              flex: 1,
              padding: '16px',
              'overflow-y': 'auto',
              display: 'flex',
              'flex-direction': 'column',
              gap: '14px',
              'font-size': '13.5px',
              'line-height': 1.5,
            }}
          >
            <For each={messages()}>
              {(m) => (
                <div style={{ 'align-self': m.sender === 'user' ? 'flex-end' : 'flex-start', 'max-width': '85%' }}>
                  <div
                    style={{
                      'background-color': m.sender === 'user' ? '#0284C7' : '#161B22',
                      color: m.sender === 'user' ? '#FFFFFF' : '#C9D1D9',
                      border: m.sender === 'user' ? 'none' : '1px solid #30363D',
                      'border-radius': m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      padding: '10px 14px',
                      'white-space': 'pre-wrap',
                      'word-break': 'break-word',
                    }}
                  >
                    {m.text}
                  </div>
                  <div style={{ 'font-size': '10px', color: '#6E7681', 'margin-top': '4px', 'text-align': m.sender === 'user' ? 'right' : 'left' }}>
                    {m.timestamp}
                  </div>
                </div>
              )}
            </For>

            <Show when={loading()}>
              <div
                style={{
                  'align-self': 'flex-start',
                  'background-color': '#161B22',
                  border: '1px solid #30363D',
                  'border-radius': '14px 14px 14px 2px',
                  padding: '10px 16px',
                  display: 'flex',
                  gap: '6px',
                  'align-items': 'center',
                }}
              >
                <span style={{ 'font-size': '12px', color: '#8B949E' }}>Auditing crypto session...</span>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', 'background-color': '#06B6D4', 'border-radius': '50%' }} />
              </div>
            </Show>
          </div>

          <div
            style={{
              padding: '8px 14px',
              display: 'flex',
              gap: '6px',
              'overflow-x': 'auto',
              'border-top': '1px solid #21262D',
              'background-color': '#0D1117',
              'scrollbar-width': 'none',
            }}
          >
            <For each={quickPrompts}>
              {(q) => (
                <button
                  onClick={() => handleSend(q)}
                  disabled={loading()}
                  style={{
                    'white-space': 'nowrap',
                    'font-size': '11px',
                    padding: '4px 10px',
                    'border-radius': '12px',
                    'background-color': '#161B22',
                    border: '1px solid #30363D',
                    color: '#38BDF8',
                    cursor: 'pointer',
                  }}
                >
                  {q}
                </button>
              )}
            </For>
          </div>

          <div
            style={{
              padding: '12px 14px',
              'border-top': '1px solid #30363D',
              'background-color': '#161B22',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input()}
              onInput={(e) => setInput(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              placeholder="Ask AI Crypto Auditor..."
              disabled={loading()}
              style={{
                flex: 1,
                'background-color': '#0D1117',
                border: '1px solid #30363D',
                'border-radius': '8px',
                padding: '10px 12px',
                color: '#F0F6FC',
                'font-size': '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading() || !input().trim()}
              style={{
                'background-color': input().trim() && !loading() ? '#06B6D4' : '#21262D',
                border: 'none',
                'border-radius': '8px',
                padding: '0 14px',
                color: input().trim() && !loading() ? '#FFFFFF' : '#484F58',
                'font-weight': 600,
                cursor: input().trim() && !loading() ? 'pointer' : 'default',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}
export default AIChatbot

