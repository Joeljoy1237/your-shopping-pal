import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/lib/sessionId';

export interface SupportTicketData {
  ticketType: string;
  subject: string;
  body: string;
  orderId?: string;
  productName?: string;
  email?: string;
}

// Keywords for auto-detecting issue types
const ISSUE_KEYWORDS: Record<string, string[]> = {
  'delivery-delay': ['delay', 'late', 'slow', 'taking long', 'not arrived', 'where is my order', 'shipping issue'],
  'return-request': ['return', 'refund', 'send back', 'wrong item', 'exchange', 'money back'],
  'payment-issue': ['payment', 'charge', 'billing', 'invoice', 'card declined', 'double charged', 'overcharged'],
  'product-defect': ['defect', 'broken', 'damaged', 'not working', 'malfunction', 'faulty', 'dead on arrival'],
  'missing-item': ['missing', 'incomplete', 'not included', 'part missing', 'accessories missing'],
  'general': ['help', 'question', 'inquiry', 'support', 'assistance'],
};

export const useSupportTickets = () => {
  const sessionId = getSessionId();

  const detectIssueType = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [issueType, keywords] of Object.entries(ISSUE_KEYWORDS)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return issueType;
      }
    }
    
    return 'general';
  }, []);

  const generateSupportEmail = useCallback((
    issueType: string,
    context: { orderId?: string; productName?: string; userMessage?: string }
  ): { subject: string; body: string } => {
    const { orderId, productName, userMessage } = context;

    const templates: Record<string, { subject: string; body: string }> = {
      'delivery-delay': {
        subject: `Delivery Status Inquiry${orderId ? ` - Order #${orderId}` : ''}`,
        body: `Dear Support Team,

I am writing to inquire about the delivery status of my order${orderId ? ` (#${orderId})` : ''}.

${userMessage || 'My order appears to be delayed and I would like an update on its current status and expected delivery date.'}

Could you please provide:
1. Current location of my package
2. Updated estimated delivery date
3. Reason for the delay (if any)

Thank you for your assistance.

Best regards`,
      },
      'return-request': {
        subject: `Return Request${orderId ? ` - Order #${orderId}` : ''}${productName ? ` - ${productName}` : ''}`,
        body: `Dear Support Team,

I would like to initiate a return for ${productName ? `the ${productName}` : 'an item'}${orderId ? ` from order #${orderId}` : ''}.

${userMessage || 'Please guide me through the return process.'}

Please provide:
1. Return shipping label
2. Instructions for packaging
3. Expected refund timeline

Thank you.

Best regards`,
      },
      'payment-issue': {
        subject: `Payment/Billing Issue${orderId ? ` - Order #${orderId}` : ''}`,
        body: `Dear Support Team,

I am experiencing a payment/billing issue with my order${orderId ? ` (#${orderId})` : ''}.

${userMessage || 'I need assistance resolving a billing discrepancy.'}

Please review my account and provide clarification.

Thank you.

Best regards`,
      },
      'product-defect': {
        subject: `Product Defect Report${productName ? ` - ${productName}` : ''}${orderId ? ` - Order #${orderId}` : ''}`,
        body: `Dear Support Team,

I am reporting a defect with ${productName || 'a product I recently purchased'}${orderId ? ` (Order #${orderId})` : ''}.

${userMessage || 'The product is not functioning as expected.'}

I would like to request:
1. Warranty claim process
2. Replacement or repair options
3. Any troubleshooting steps I may have missed

Thank you for your prompt attention.

Best regards`,
      },
      'missing-item': {
        subject: `Missing Item Report${orderId ? ` - Order #${orderId}` : ''}`,
        body: `Dear Support Team,

I received my order${orderId ? ` (#${orderId})` : ''} but some items appear to be missing.

${userMessage || 'Please help me resolve this issue.'}

Could you please:
1. Verify the items shipped
2. Arrange for missing items to be sent
3. Confirm expected delivery for missing items

Thank you.

Best regards`,
      },
      'general': {
        subject: `Customer Support Request${orderId ? ` - Order #${orderId}` : ''}`,
        body: `Dear Support Team,

${userMessage || 'I need assistance with my recent purchase.'}

${orderId ? `Order ID: ${orderId}` : ''}
${productName ? `Product: ${productName}` : ''}

Please get back to me at your earliest convenience.

Thank you.

Best regards`,
      },
    };

    return templates[issueType] || templates['general'];
  }, []);

  const createSupportTicket = useCallback(async (data: SupportTicketData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          session_id: sessionId,
          ticket_type: data.ticketType,
          subject: data.subject,
          body: data.body,
          order_id: data.orderId,
          product_name: data.productName,
          email: data.email,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      return false;
    }
  }, [sessionId]);

  return {
    detectIssueType,
    generateSupportEmail,
    createSupportTicket,
  };
};
