import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, IndianRupee, MapPin, Tag, Check, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiJson } from '../lib/api';
import { loadRazorpayScript, openRazorpayCheckout, type RazorpayOrderResponse } from '../lib/razorpay';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placingStage, setPlacingStage] = useState<'payment' | 'placing' | null>(null);
  const [copied, setCopied] = useState(false);
  const [finalOrder, setFinalOrder] = useState({ id: '', total: 0, items: 0 });

  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const taxes = Math.round(totalPrice * 0.05);
  const discount = appliedPromo ? Math.round(totalPrice * 0.1) : 0;
  const grandTotal = totalPrice + deliveryFee + taxes - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'ZOMATO10') {
      setAppliedPromo(true);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsPlacing(true);
    const newOrderId = Date.now().toString().slice(-6);

    try {
      // 1. Ask our backend to open a Razorpay order for this cart total.
      setPlacingStage('payment');
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Unable to load payment gateway. Check your connection and try again.');
      }

      const paymentOrder = await apiJson<RazorpayOrderResponse>('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: grandTotal }),
      });

      // 2. Open Razorpay Checkout and wait for the user to complete payment.
      const payment = await openRazorpayCheckout(paymentOrder, {
        name: 'Zomato',
        description: items[0]?.restaurantName ? `Order from ${items[0].restaurantName}` : 'Food order',
        contact: user.number,
      });

      // 3. Only now place the actual order, passing along the payment proof.
      // The backend independently re-verifies the signature before saving —
      // this call succeeding server-side is what actually marks it paid.
      setPlacingStage('placing');
      await apiJson('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          Orderid: newOrderId,
          number: user.number,
          totalAmount: grandTotal,
          restrauntName: items[0]?.restaurantName || 'Zomato Restaurant',
          restrauntId: items[0]?.restaurantId,
          orderedItems: items.map(ci => ({ name: ci.item.name, quantity: ci.quantity })),
          ItemPrices: items.map(ci => ({ name: ci.item.name, price: ci.item.price * ci.quantity })),
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
        }),
      });

      setFinalOrder({ id: newOrderId, total: grandTotal, items: totalItems });
      setOrderPlaced(true);
      clearCart();
    } catch (error: any) {
      showToast(error.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacing(false);
      setPlacingStage(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scale-in">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8">Your order is being prepared. Estimated delivery in 30-35 minutes.</p>
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-gray-600">Order ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-zomato-red">#{finalOrder.id}</span>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 text-sm text-gray-600"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-semibold">₹{finalOrder.total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Items</span>
            <span className="font-semibold">{finalOrder.items} items</span>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="inline-block bg-zomato-red text-white font-semibold px-8 py-3 rounded-lg hover:bg-zomato-red-dark transition-colors">
            Back to Home
          </Link>
          <Link to={`/order/${finalOrder.id}`} className="inline-block border-2 border-zomato-red text-zomato-red font-semibold px-8 py-3 rounded-lg hover:bg-red-50 transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet</p>
        <Link to="/" className="inline-block bg-zomato-red text-white font-semibold px-8 py-3 rounded-lg hover:bg-zomato-red-dark transition-colors">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-zomato-red mb-6">
        <ArrowLeft className="w-4 h-4" />
        Continue shopping
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
      <p className="text-gray-500 mb-8">{totalItems} items from {items[0].restaurantName}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Order Items</h2>
              <button onClick={clearCart} className="text-sm text-gray-500 hover:text-zomato-red flex items-center gap-1">
                <Trash2 className="w-4 h-4" />
                Clear cart
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {items.map((ci) => (
                <div key={ci.item.id} className="p-4 flex items-center gap-4">
                  <img
                    src={ci.item.image}
                    alt={ci.item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/100x100/f5f5f5/cccccc?text=${encodeURIComponent(ci.item.name)}`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{ci.item.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{ci.item.description}</p>
                    <p className="font-semibold text-gray-900 mt-1">₹{ci.item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-zomato-red text-white rounded-lg">
                    <button onClick={() => updateQuantity(ci.item.id, -1)} className="p-2 hover:bg-zomato-red-dark rounded-l-lg transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-6 text-center">{ci.quantity}</span>
                    <button onClick={() => updateQuantity(ci.item.id, 1)} className="p-2 hover:bg-zomato-red-dark rounded-r-lg transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right shrink-0 w-20">
                    <p className="font-bold text-gray-900">₹{ci.item.price * ci.quantity}</p>
                  </div>
                  <button onClick={() => removeItem(ci.item.id)} className="text-gray-400 hover:text-zomato-red p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-zomato-red" />
              Delivery Address
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">Home</p>
              <p className="text-sm text-gray-500 mt-1">Flat 204, Green Residency, Sector 18, Noida, Uttar Pradesh - 201301</p>
            </div>
          </div>
        </div>

        <aside>
          <div className="sticky top-32">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Bill Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item Total</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Charges (5%)</span>
                  <span className="font-medium">₹{taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (ZOMATO10)</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">To Pay</span>
                  <span className="font-bold text-gray-900">₹{grandTotal}</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-zomato-red" />
                  Apply Promo Code
                </h4>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">ZOMATO10 applied</span>
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-zomato-red"
                    />
                    <button
                      onClick={applyPromo}
                      className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Try code: ZOMATO10 for 10% off</p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="w-full mt-6 bg-zomato-red text-white font-bold py-3.5 rounded-xl hover:bg-zomato-red-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isPlacing ? (
                  <span className="animate-pulse">
                    {placingStage === 'payment' ? 'Waiting for payment...' : 'Placing order...'}
                  </span>
                ) : (
                  <>
                    <IndianRupee className="w-5 h-5" />
                    Pay & Place Order · ₹{grandTotal}
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}