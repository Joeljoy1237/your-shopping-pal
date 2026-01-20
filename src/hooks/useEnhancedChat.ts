import { useState, useCallback } from 'react';
import { ChatMessage, ChatOption, ConversationState, ConversationFlow, Product } from '@/types/chat';
import { useProducts, DatabaseProduct } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useCart } from '@/hooks/useCart';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { toast } from 'sonner';

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

// Convert database product to chat product type
const toProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: dbProduct.price,
  image: dbProduct.image,
  category: dbProduct.category,
  rating: dbProduct.rating,
  specs: dbProduct.specs,
  description: dbProduct.description,
  availability: dbProduct.availability,
  warranty: dbProduct.warranty,
});

const getInitialMessage = (): ChatMessage => createMessage(
  "👋 Hi there! I'm your shopping assistant. How can I help you today?",
  'bot',
  {
    type: 'quick-actions',
    options: [
      { id: '1', label: '🔍 Find Products', value: 'product-discovery' },
      { id: '2', label: '🛒 View Cart', value: 'view-cart' },
      { id: '3', label: '📦 Track Order', value: 'order-tracking' },
      { id: '4', label: '🚚 Delivery Info', value: 'delivery-info' },
      { id: '5', label: '↩️ Returns', value: 'returns-info' },
      { id: '6', label: '👤 Talk to Human', value: 'human-support' },
    ],
  }
);

export const useEnhancedChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [state, setState] = useState<ConversationState>({ flow: 'initial' });
  const [isTyping, setIsTyping] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { getFilteredProducts, getProductById } = useProducts();
  const { getOrderByOrderId } = useOrders();
  const { cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity } = useCart();
  const { detectIssueType, generateSupportEmail, createSupportTicket } = useSupportTickets();

  const addBotMessage = useCallback((message: ChatMessage) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    }, 600);
  }, []);

  const handleViewProductDetails = useCallback(async (productId: string) => {
    setMessages((prev) => [...prev, createMessage('📋 View Details', 'user')]);
    
    const product = await getProductById(productId);
    if (product) {
      setState((prev) => ({ ...prev, flow: 'product-detail', selectedProductId: productId }));
      addBotMessage(
        createMessage(
          'Here are the full product details:',
          'bot',
          {
            type: 'product-detail',
            productDetail: toProduct(product),
          }
        )
      );
    } else {
      addBotMessage(createMessage('Sorry, I couldn\'t find that product.', 'bot'));
    }
  }, [getProductById, addBotMessage]);

  const handleAddToCart = useCallback(async (productId: string) => {
    setIsAddingToCart(true);
    const result = await addToCart(productId);
    setIsAddingToCart(false);
    
    if (result.success) {
      toast.success('Added to cart!', {
        description: 'Item has been added to your shopping cart.',
      });
      
      // Show cart update message
      addBotMessage(
        createMessage(
          `✅ **Added to cart!**\n\nYour cart now has ${cartCount + 1} item(s). Total: $${(cartTotal + (await getProductById(productId))?.price || 0).toFixed(2)}`,
          'bot',
          {
            type: 'options',
            options: [
              { id: '1', label: '🛒 View Cart', value: 'view-cart' },
              { id: '2', label: '🔍 Continue Shopping', value: 'product-discovery' },
              { id: '3', label: '🏠 Back to Menu', value: 'restart' },
            ],
          }
        )
      );
    } else {
      toast.error('Failed to add to cart');
    }
  }, [addToCart, addBotMessage, cartCount, cartTotal, getProductById]);

  const handleAddToCartFromDetail = useCallback(async () => {
    if (state.selectedProductId) {
      await handleAddToCart(state.selectedProductId);
    }
  }, [state.selectedProductId, handleAddToCart]);

  const handleBackFromDetail = useCallback(() => {
    setState((prev) => ({ ...prev, flow: 'product-results', selectedProductId: undefined }));
    addBotMessage(
      createMessage(
        'Anything else I can help you with?',
        'bot',
        {
          type: 'options',
          options: [
            { id: '1', label: '🔍 Find More Products', value: 'product-discovery' },
            { id: '2', label: '🛒 View Cart', value: 'view-cart' },
            { id: '3', label: '🏠 Back to Menu', value: 'restart' },
          ],
        }
      )
    );
  }, [addBotMessage]);

  const handleRemoveFromCart = useCallback(async (cartItemId: string) => {
    const success = await removeFromCart(cartItemId);
    if (success) {
      toast.success('Item removed from cart');
    }
  }, [removeFromCart]);

  const handleUpdateCartQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    await updateQuantity(cartItemId, quantity);
  }, [updateQuantity]);

  const handleContinueShopping = useCallback(() => {
    setState({ flow: 'product-category' });
    addBotMessage(
      createMessage(
        "Let's find the perfect product for you. What are you looking for?",
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
  }, [addBotMessage]);

  const handleCheckout = useCallback(() => {
    setState({ flow: 'checkout' });
    addBotMessage(
      createMessage(
        '🎉 **Ready to Checkout!**\n\nTo complete your purchase, please visit our secure checkout page. A customer service representative can also assist you over the phone.\n\n📞 **1-800-SHOP-HELP**\n\nWould you like any other assistance?',
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
  }, [addBotMessage]);

  const handleSendSupportEmail = useCallback(async (email: string) => {
    if (state.supportContext) {
      const { orderId, productName, userMessage } = state.supportContext;
      const issueType = detectIssueType(userMessage || '');
      const { subject, body } = generateSupportEmail(issueType, { orderId, productName, userMessage });
      
      const success = await createSupportTicket({
        ticketType: issueType,
        subject,
        body,
        orderId,
        productName,
        email,
      });

      if (success) {
        toast.success('Support ticket created!');
        addBotMessage(
          createMessage(
            `✅ **Support Request Submitted!**\n\nWe've received your request and will respond to **${email}** within 24 hours.\n\nTicket Type: ${issueType.replace('-', ' ').toUpperCase()}\n\nIs there anything else I can help you with?`,
            'bot',
            {
              type: 'options',
              options: [
                { id: '1', label: '🏠 Back to Menu', value: 'restart' },
              ],
            }
          )
        );
      } else {
        toast.error('Failed to create support ticket');
      }
    }
    setState((prev) => ({ ...prev, flow: 'initial', supportContext: undefined }));
  }, [state.supportContext, detectIssueType, generateSupportEmail, createSupportTicket, addBotMessage]);

  const handleBackFromSupport = useCallback(() => {
    setState({ flow: 'initial' });
    addBotMessage(getInitialMessage());
  }, [addBotMessage]);

  const handleOptionSelect = useCallback(
    async (option: ChatOption) => {
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
        case 'daily': {
          const newState = { ...state, productUsage: flow };
          setState({ ...newState, flow: 'product-results' });
          
          const dbProducts = await getFilteredProducts(
            newState.productCategory,
            newState.productBudget,
            flow
          );
          
          const products = dbProducts.map(toProduct);
          
          addBotMessage(
            createMessage(
              `🎉 Here are my top recommendations for you:`,
              'bot',
              {
                type: 'product-results',
                products,
                options: [
                  { id: 'restart', label: '🔄 Start Over', value: 'restart' },
                  { id: 'cart', label: '🛒 View Cart', value: 'view-cart' },
                ],
              }
            )
          );
          break;
        }

        case 'view-cart':
          setState({ flow: 'view-cart' });
          addBotMessage(
            createMessage(
              '🛒 Here\'s your shopping cart:',
              'bot',
              {
                type: 'cart-summary',
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
                `Need to start a return?`,
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '📧 Create Support Email', value: 'human-support' },
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
                `Need to file a warranty claim?`,
              'bot',
              {
                type: 'options',
                options: [
                  { id: '1', label: '📧 Contact Support', value: 'human-support' },
                  { id: '2', label: '🏠 Back to Menu', value: 'restart' },
                ],
              }
            )
          );
          break;

        case 'human-support':
          setState({ flow: 'support-compose', supportContext: {} });
          const { subject, body } = generateSupportEmail('general', {});
          addBotMessage(
            createMessage(
              `👤 **Contact Support**\n\nI've prepared an email template for you. You can customize it before sending:`,
              'bot',
              {
                type: 'support-email',
                supportEmail: {
                  subject,
                  body,
                  issueType: 'general',
                },
              }
            )
          );
          break;

        case 'restart':
          setState({ flow: 'initial' });
          addBotMessage(getInitialMessage());
          break;

        default:
          break;
      }
    },
    [state, addBotMessage, getFilteredProducts, generateSupportEmail]
  );

  const handleTextInput = useCallback(
    async (text: string) => {
      setMessages((prev) => [...prev, createMessage(text, 'user')]);

      if (state.flow === 'order-input') {
        const order = await getOrderByOrderId(text);
        if (order) {
          addBotMessage(
            createMessage(
              `📦 Found your order!`,
              'bot',
              {
                type: 'order-status',
                orderStatus: {
                  orderId: order.order_id,
                  status: order.status as any,
                  estimatedDelivery: order.estimated_delivery || 'TBD',
                  lastUpdate: order.last_update || 'No updates yet',
                  location: order.location,
                },
                options: [
                  { id: '1', label: '📦 Track Another', value: 'order-tracking' },
                  { id: '2', label: '📧 Report Issue', value: 'human-support' },
                  { id: '3', label: '🏠 Back to Menu', value: 'restart' },
                ],
              }
            )
          );
          
          // Store context for potential support email
          setState((prev) => ({
            ...prev,
            supportContext: { orderId: order.order_id },
          }));
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
      } else if (state.flow === 'support-compose' || state.flow === 'human-support') {
        // User provided additional context for support
        const issueType = detectIssueType(text);
        const { subject, body } = generateSupportEmail(issueType, {
          ...state.supportContext,
          userMessage: text,
        });
        
        setState((prev) => ({
          ...prev,
          supportContext: { ...prev.supportContext, userMessage: text },
        }));

        addBotMessage(
          createMessage(
            `I've detected this might be about: **${issueType.replace('-', ' ')}**\n\nHere's your customized support email:`,
            'bot',
            {
              type: 'support-email',
              supportEmail: {
                subject,
                body,
                issueType,
                orderId: state.supportContext?.orderId,
                productName: state.supportContext?.productName,
              },
            }
          )
        );
      }
    },
    [state, addBotMessage, getOrderByOrderId, detectIssueType, generateSupportEmail]
  );

  return {
    messages,
    isTyping,
    state,
    isAddingToCart,
    handleOptionSelect,
    handleTextInput,
    handleViewProductDetails,
    handleAddToCart,
    handleAddToCartFromDetail,
    handleBackFromDetail,
    // Cart handlers
    cartItems,
    cartCount,
    cartTotal,
    handleRemoveFromCart,
    handleUpdateCartQuantity,
    handleContinueShopping,
    handleCheckout,
    // Support handlers
    handleSendSupportEmail,
    handleBackFromSupport,
  };
};
