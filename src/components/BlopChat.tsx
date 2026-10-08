import { FormEvent, useEffect, useRef, useState } from 'react';
import { BLOP_CONTEXT, BLOP_SECTION_LINKS, BLOP_STARTER_QUESTIONS, BLOP_WELCOME_MESSAGE } from '../data/blop';
import { BlopRequestError, getLocalSafetyResponse, sendBlopMessage, trimChatHistory } from '../services/blop';
import type { ChatHistoryItem, ChatMessage } from '../types/chat';

const welcomeMessage: ChatMessage = { id: 'blop-welcome', role: 'model', text: BLOP_WELCOME_MESSAGE };

function makeMessage(role: ChatMessage['role'], text: string): ChatMessage {
  return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`, role, text };
}

export function BlopChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<readonly ChatMessage[]>([welcomeMessage]);
  const [history, setHistory] = useState<readonly ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const requestInFlight = useRef(false);
  const endpoint = import.meta.env.VITE_BLOP_API_URL ?? '';

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const closeChat = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  const submitPrompt = async (prompt: string) => {
    const query = prompt.trim();
    if (!query || requestInFlight.current) return;

    requestInFlight.current = true;
    setInput('');
    setError('');
    setIsLoading(true);
    setMessages((current) => [...current, makeMessage('user', query)]);

    const userHistory: ChatHistoryItem = { role: 'user', parts: [{ text: query }] };
    const requestHistory = trimChatHistory([...history, userHistory]);
    setHistory(requestHistory);

    try {
      const safetyResponse = getLocalSafetyResponse(query);
      if (safetyResponse) {
        const modelHistory: ChatHistoryItem = { role: 'model', parts: [{ text: safetyResponse }] };
        setHistory(trimChatHistory([...requestHistory, modelHistory]));
        setMessages((current) => [...current, makeMessage('model', safetyResponse)]);
        return;
      }
      const reply = await sendBlopMessage({ endpoint, query, context: BLOP_CONTEXT, history: requestHistory });
      const modelHistory: ChatHistoryItem = { role: 'model', parts: [{ text: reply }] };
      setHistory((current) => trimChatHistory([...current, modelHistory]));
      setMessages((current) => [...current, makeMessage('model', reply)]);
    } catch (caughtError) {
      const message = caughtError instanceof BlopRequestError
        ? caughtError.message
        : 'Blop could not connect. Please try again.';
      setError(message);
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitPrompt(input);
  };

  return (
    <aside className="blop-chat" aria-label="Blop portfolio assistant">
      <button
        ref={toggleRef}
        className="blop-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="blop-dialog"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span aria-hidden="true">✦</span>
        <span>{isOpen ? 'Hide Blop' : 'Ask Blop'}</span>
      </button>

      <section
        id="blop-dialog"
        className="blop-dialog"
        role="dialog"
        aria-modal="false"
        aria-labelledby="blop-heading"
        hidden={!isOpen}
      >
        <header className="blop-header">
          <div>
            <h2 id="blop-heading">Blop</h2>
            <p>Portfolio assistant</p>
          </div>
          <button type="button" className="blop-close" aria-label="Close Blop chat" onClick={closeChat}>×</button>
        </header>

        <div ref={messageListRef} className="blop-messages" aria-live="polite" aria-relevant="additions text">
          {messages.map((message) => (
            <div className={`blop-message blop-message--${message.role}`} key={message.id}>
              <p className="blop-message-label">{message.role === 'model' ? 'Blop' : 'You'}</p>
              <p>{message.text}</p>
            </div>
          ))}
          {messages.length === 1 ? (
            <div className="blop-starters" aria-label="Starter questions">
              {BLOP_STARTER_QUESTIONS.map((question) => (
                <button type="button" key={question} onClick={() => void submitPrompt(question)}>{question}</button>
              ))}
            </div>
          ) : null}
          {isLoading ? <p className="blop-typing" role="status">Blop is thinking…</p> : null}
          {error ? <p className="blop-error" role="alert">{error}</p> : null}
        </div>

        <form className="blop-form" onSubmit={handleSubmit} aria-busy={isLoading}>
          <label className="sr-only" htmlFor="blop-input">Message Blop</label>
          <input
            ref={inputRef}
            id="blop-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about Ruan's portfolio…"
            maxLength={500}
            disabled={isLoading}
            autoComplete="off"
          />
          <button type="submit" disabled={isLoading || !input.trim()}>{isLoading ? 'Sending…' : 'Send'}</button>
        </form>
        <nav className="blop-navigation" aria-label="Portfolio sections">
          {BLOP_SECTION_LINKS.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
        </nav>
      </section>
    </aside>
  );
}
