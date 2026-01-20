import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Copy, Check, Send } from 'lucide-react';
import { toast } from 'sonner';

interface SupportEmailCardProps {
  subject: string;
  body: string;
  issueType: string;
  onSendEmail: (email: string) => void;
  onBack: () => void;
}

export const SupportEmailCard = ({
  subject,
  body,
  issueType,
  onSendEmail,
  onBack,
}: SupportEmailCardProps) => {
  const [email, setEmail] = useState('');
  const [editedSubject, setEditedSubject] = useState(subject);
  const [editedBody, setEditedBody] = useState(body);
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    const fullEmail = `Subject: ${editedSubject}\n\n${editedBody}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    onSendEmail(email);
  };

  const issueLabels: Record<string, string> = {
    'delivery-delay': '🚚 Delivery Issue',
    'return-request': '↩️ Return Request',
    'payment-issue': '💳 Payment Issue',
    'product-defect': '🔧 Product Defect',
    'missing-item': '📦 Missing Item',
    'general': '❓ General Inquiry',
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border/50 overflow-hidden animate-message-in">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/30">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Support Email Ready</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Issue Type: {issueLabels[issueType] || issueType}
        </p>
      </div>

      {/* Email Content */}
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Subject</label>
          <Input
            value={editedSubject}
            onChange={(e) => setEditedSubject(e.target.value)}
            className="mt-1 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Message</label>
          <Textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            className="mt-1 text-sm min-h-[150px]"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Your Email (for response)</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border/30 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToClipboard}
            className="flex-1 gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Email'}
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            className="flex-1 gap-2"
          >
            <Send className="h-4 w-4" />
            Save & Submit
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-full"
        >
          ← Back to Menu
        </Button>
      </div>
    </div>
  );
};
