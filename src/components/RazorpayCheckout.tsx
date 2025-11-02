import { useState } from 'react';
import { ordersAPI } from '@/lib/api';

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onFailure?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayCheckout = ({ orderId, amount, onSuccess, onFailure }: RazorpayCheckoutProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create Razorpay order
      const { razorpayOrder } = await ordersAPI.createPayment(orderId);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'AgroLink',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyRes = await fetch('http://127.0.0.1:5000/api/orders/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('agrolink_token')}`
              },
              body: JSON.stringify({
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            const result = await verifyRes.json();
            
            if (result.success) {
              onSuccess?.();
            } else {
              onFailure?.(new Error('Payment verification failed'));
            }
          } catch (err) {
            onFailure?.(err);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3b7a57'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        onFailure?.(response.error);
      });
      
      rzp.open();
    } catch (err) {
      onFailure?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};
