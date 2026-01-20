// Session ID management for cart persistence
const SESSION_KEY = 'chatbot_session_id';

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};
