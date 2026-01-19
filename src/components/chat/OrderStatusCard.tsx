import { OrderStatus } from '@/types/chat';
import { getStatusLabel } from '@/data/orders';
import { Package, Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStatusCardProps {
  orderStatus: OrderStatus;
}

const statusIcons = {
  processing: Clock,
  shipped: Package,
  'in-transit': Truck,
  'out-for-delivery': Truck,
  delivered: CheckCircle2,
};

const statusColors = {
  processing: 'text-yellow-500 bg-yellow-500/10',
  shipped: 'text-blue-500 bg-blue-500/10',
  'in-transit': 'text-blue-500 bg-blue-500/10',
  'out-for-delivery': 'text-primary bg-primary/10',
  delivered: 'text-green-500 bg-green-500/10',
};

export const OrderStatusCard = ({ orderStatus }: OrderStatusCardProps) => {
  const StatusIcon = statusIcons[orderStatus.status];
  const colorClass = statusColors[orderStatus.status];

  const steps = ['processing', 'shipped', 'in-transit', 'out-for-delivery', 'delivered'];
  const currentStep = steps.indexOf(orderStatus.status);

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-soft animate-message-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Order ID</p>
          <p className="font-mono font-semibold text-foreground">{orderStatus.orderId}</p>
        </div>
        <div className={cn('p-2 rounded-full', colorClass)}>
          <StatusIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Status Badge */}
      <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mb-4', colorClass)}>
        <span>{getStatusLabel(orderStatus.status)}</span>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {steps.map((step, index) => (
            <div
              key={step}
              className={cn(
                'w-2 h-2 rounded-full -mt-2',
                index <= currentStep ? 'bg-primary' : 'bg-secondary'
              )}
            />
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-muted-foreground">Estimated Delivery</p>
            <p className="font-medium text-foreground">{orderStatus.estimatedDelivery}</p>
          </div>
        </div>
        {orderStatus.location && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Current Location</p>
              <p className="font-medium text-foreground">{orderStatus.location}</p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-2">
          <Package className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-muted-foreground">Last Update</p>
            <p className="font-medium text-foreground">{orderStatus.lastUpdate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
