import { useState, useCallback } from 'react';
import { ChatMessage, ChatOption, ConversationState, ConversationFlow } from '@/types/chat';
import { getFilteredProducts } from '@/data/products';
import { getOrderStatus } from '@/data/orders';

const generateId = () => Math.random().toString(36).substring(2, 9);

const createMessage = (
  content: string,
  sender: 'user' | 'bot',
  options?: Partial<ChatMessage>
): ChatMessage => ({
  id: generateId(),
  type: 'text',
  content,
  sender,
  timestamp: new Date(),
  ...options,
});

const initialMessages: ChatMessage[] = [
  createMessage(
    "👋 Hi there! I'm your shopping assistant. How can I help you today?",
    'bot',
    {
      type: 'quick-actions',
      options: [
        { id: '1', label: '🔍 Find Products', value: 'product-discovery' },
        { id: '2', label: '📦 Track Order', value: 'order-tracking' },
        { id: '3', label: '🚚 Delivery Info', value: 'delivery-info' },
        { id: '4', label: '↩️ Returns', value: 'returns-info' },
        { id: '5', label: '🛡️ Warranty', value: 'warranty-info' },
        { id: '6', label: '👤 Talk to Human', value: 'human-support' },
      ],
    }
  ),
];

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [state, setState] = useState<ConversationState>({ flow: 'initial' });
  const [isTyping, setIsTyping] = useState(false);

  const addBotMessage = useCallback((message: ChatMessage) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    }, 600);
  }, []);

  const handleOptionSelect = useCallback(
    (option: ChatOption) => {
      // Add user's selection as a message
      setMessages((prev) => [
        ...prev,
        createMessage(option.label, 'user'),
      ]);

      const flow = option.value as ConversationFlow;

      switch (flow) {
        case 'product-discovery':
          setState({ flow: 'product-category' });
          addBotMessage(
            createMessage(
              "Great choice! Let's find the perfect product for you. What are you looking for?",
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '💻 Laptop', value: 'laptop' },
                  { id: '2', label: '📱 Phone', value: 'phone' },
                ],
              }
            )
          );
          break;

        case 'laptop':
        case 'phone':
          setState((prev) => ({ ...prev, flow: 'product-budget', productCategory: flow }));
          addBotMessage(
            createMessage(
              `Perfect! What's your budget for a ${flow}?`,
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '💵 Under $500', value: 'under-500' },
                  { id: '2', label: '💰 $500 - $1,000', value: '500-1000' },
                  { id: '3', label: '💎 $1,000 - $1,500', value: '1000-1500' },
                  { id: '4', label: '👑 Over $1,500', value: 'over-1500' },
                ],
              }
            )
          );
          break;

        case 'under-500':
        case '500-1000':
        case '1000-1500':
        case 'over-1500':
          setState((prev) => ({ ...prev, flow: 'product-usage', productBudget: flow }));
          addBotMessage(
            createMessage(
              'Almost there! What will you primarily use it for?',
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '📚 Student', value: 'student' },
                  { id: '2', label: '💼 Office Work', value: 'office' },
                  { id: '3', label: '🎮 Gaming', value: 'gaming' },
                  { id: '4', label: '📱 Daily Use', value: 'daily' },
                ],
              }
            )
          );
          break;

        case 'student':
        case 'office':
        case 'gaming':
        case 'daily':
          const newState = { ...state, productUsage: flow };
          setState({ ...newState, flow: 'product-results' });
          const products = getFilteredProducts(
            newState.productCategory,
            newState.productBudget,
            flow
          );
          addBotMessage(
            createMessage(
              `🎉 Here are my top recommendations for you:`,
              'bot',
              {
                type: 'product-results',
                products,
                options: [
                  { id: 'restart', label: '🔄 Start Over', value: 'restart' },
                  { id: 'human', label: '👤 Talk to Human', value: 'human-support' },
                ],
              }
            )
          );
          break;

        case 'order-tracking':
          setState({ flow: 'order-input' });
          addBotMessage(
            createMessage(
              '📦 Sure! Please enter your Order ID (e.g., ORD-12345):',
              'bot',
              { type: 'text' }
            )
          );
          break;

        case 'delivery-info':
          setState({ flow: 'delivery-info' });
          addBotMessage(
            createMessage(
              `🚚 **Delivery Information**\n\n` +
                `• **Standard Delivery**: 5-7 business days (Free over $50)\n` +
                `• **Express Delivery**: 2-3 business days ($9.99)\n` +
                `• **Next Day**: Order by 2 PM for next-day delivery ($19.99)\n\n` +
                `📍 We deliver to all 50 states. International shipping available for select items.\n\n` +
                `Need more help?`,
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '📦 Track My Order', value: 'order-tracking' },
                  { id: '2', label: '🏠 Back to Menu', value: 'restart' },
                ],
              }
            )
          );
          break;

        case 'returns-info':
          setState({ flow: 'returns-info' });
          addBotMessage(
            createMessage(
              `↩️ **Returns & Refunds**\n\n` +
                `**30-Day Return Policy**\n` +
                `• Items must be in original packaging\n` +
                `• Include all accessories and manuals\n` +
                `• Free returns on defective items\n\n` +
                `**Refund Timeline**\n` +
                `• Refund initiated within 24 hours of receiving return\n` +
                `• 5-7 business days to appear in your account\n\n` +
                `**How to Return**\n` +
                `1. Visit your Orders page\n` +
                `2. Select "Return Item"\n` +
                `3. Print your free shipping label\n` +
                `4. Drop off at any carrier location\n\n` +
                `Need assistance with a return?`,
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '👤 Talk to Human', value: 'human-support' },
                  { id: '2', label: '🏠 Back to Menu', value: 'restart' },
                ],
              }
            )
          );
          break;

        case 'warranty-info':
          setState({ flow: 'warranty-info' });
          addBotMessage(
            createMessage(
              `🛡️ **Warranty Information**\n\n` +
                `**Standard Warranty**\n` +
                `• 1-year manufacturer warranty on all electronics\n` +
                `• 2-year warranty on premium products\n\n` +
                `**What's Covered**\n` +
                `✅ Manufacturing defects\n` +
                `✅ Hardware malfunctions\n` +
                `✅ Battery issues (first 6 months)\n\n` +
                `**What's NOT Covered**\n` +
                `❌ Physical damage or water damage\n` +
                `❌ Software issues\n` +
                `❌ Normal wear and tear\n\n` +
                `**Extended Warranty**\n` +
                `Add up to 3 years of protection at checkout!\n\n` +
                `Need to file a warranty claim?`,
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '👤 Contact Support', value: 'human-support' },
                  { id: '2', label: '🏠 Back to Menu', value: 'restart' },
                ],
              }
            )
          );
          break;

        case 'human-support':
          setState({ flow: 'human-support' });
          addBotMessage(
            createMessage(
              `👤 **Connect with Our Team**\n\n` +
                `**📞 Phone Support**\n` +
                `1-800-SHOP-HELP (1-800-746-7435)\n` +
                `Mon-Fri: 8 AM - 10 PM EST\n` +
                `Sat-Sun: 9 AM - 6 PM EST\n\n` +
                `**📧 Email Support**\n` +
                `support@shophelp.com\n` +
                `Response within 24 hours\n\n` +
                `**💬 Live Chat**\n` +
                `Available on our website during business hours\n\n` +
                `Is there anything else I can help you with?`,
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '🏠 Back to Menu', value: 'restart' },
                ],
              }
            )
          );
          break;

        case 'restart':
          setState({ flow: 'initial' });
          addBotMessage(initialMessages[0]);
          break;

        default:
          break;
      }
    },
    [state, addBotMessage]
  );

  const handleTextInput = useCallback(
    (text: string) => {
      setMessages((prev) => [...prev, createMessage(text, 'user')]);

      if (state.flow === 'order-input') {
        const orderStatus = getOrderStatus(text);
        if (orderStatus) {
          addBotMessage(
            createMessage(
              `📦 Found your order!`,
              'bot',
              {
                type: 'order-status',
                orderStatus,
                options: [
                  { id: '1', label: '📦 Track Another', value: 'order-tracking' },
                  { id: '2', label: '🏠 Back to Menu', value: 'restart' },
                ],
              }
            )
          );
        } else {
          addBotMessage(
            createMessage(
              `❌ Sorry, I couldn't find an order with ID "${text}". Please check the order ID and try again.\n\n` +
                `💡 **Tip**: Order IDs usually start with "ORD-" followed by numbers (e.g., ORD-12345)`,
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '🔄 Try Again', value: 'order-tracking' },
                  { id: '2', label: '👤 Talk to Human', value: 'human-support' },
                  { id: '3', label: '🏠 Back to Menu', value: 'restart' },
                ],
              }
            )
          );
        }
      }
    },
    [state.flow, addBotMessage]
  );

  return {
    messages,
    isTyping,
    state,
    handleOptionSelect,
    handleTextInput,
  };
};
