import { useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import QuantityControl from './components/QuantityControl';
import { products } from './data/products';

const money = (value) => `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

function HomePage({ cart, onAdd }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const categories = ['All', ...new Set(products.map((product) => product.category))];
  const filtered = useMemo(() => products.filter((product) => {
    const term = query.trim().toLowerCase();
    return (category === 'All' || product.category === category)
      && (!term || `${product.name} ${product.description}`.toLowerCase().includes(term));
  }), [query, category]);
  const showing = filtered.slice(0, visibleCount);
  const resetView = (nextCategory) => { setCategory(nextCategory); setVisibleCount(6); };

  return <main>
    <section className="hero">
      <p className="eyebrow">Thoughtful things, every day</p>
      <h1>Little finds for a life well lived.</h1>
      <p>Explore considered home, apparel, and everyday essentials selected to make ordinary moments feel special.</p>
      <a href="#catalog" className="button button-light">Browse collection</a>
    </section>
    <section className="catalog section" id="catalog">
      <div className="section-heading"><div><p className="eyebrow">The shop</p><h2>Made to be used and loved.</h2></div><span>{filtered.length} pieces</span></div>
      <div className="filters"><label className="search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(6); }} placeholder="Search the collection" aria-label="Search products" /></label><div className="category-filters">{categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => resetView(item)}>{item}</button>)}</div></div>
      {showing.length ? <div className="product-grid">{showing.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} cartQuantity={cart.find((item) => item.id === product.id)?.quantity || 0} />)}</div> : <div className="empty-state"><h3>No pieces found</h3><p>Try a different search or category.</p><button onClick={() => { setQuery(''); resetView('All'); }}>Clear filters</button></div>}
      {visibleCount < filtered.length && <div className="more"><button className="button" onClick={() => setVisibleCount((count) => count + 3)}>View more pieces</button></div>}
    </section>
  </main>;
}

function ProductDetailsPage({ onAdd }) {
  const { productId } = useParams();
  const product = products.find((item) => item.id === Number(productId));
  const [quantity, setQuantity] = useState(1);
  if (!product) return <Navigate to="/not-found" replace />;
  return <main className="section detail-page"><button className="back" onClick={() => window.history.back()}>← Back to shop</button><div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.name} /></div><div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="price">{money(product.price)}</p><p className="description">{product.description}</p><div className="stock">● In stock · {product.stock} available</div><div className="detail-actions"><QuantityControl quantity={quantity} onDecrease={() => setQuantity((value) => Math.max(1, value - 1))} onIncrease={() => setQuantity((value) => Math.min(product.stock, value + 1))} limit={product.stock} /><button className="button" onClick={() => onAdd(product, quantity)}>Add to cart — {money(product.price * quantity)}</button></div><p className="delivery-note">Free local delivery on orders over ₱2,500.</p></div></div></main>;
}

function CartPage({ cart, onAdd, onUpdate, onRemove }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!cart.length) return <main className="section empty-state cart-empty"><p className="eyebrow">Your bag</p><h1>Your cart is waiting.</h1><p>Add a few pieces you love and they will appear here.</p><Link className="button" to="/">Continue shopping</Link></main>;
  return <main className="section cart-page"><div className="page-heading"><p className="eyebrow">Your bag</p><h1>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h1></div><div className="cart-layout"><section className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-copy"><p>{item.category}</p><h2>{item.name}</h2><strong>{money(item.price)}</strong><QuantityControl quantity={item.quantity} onDecrease={() => onUpdate(item.id, item.quantity - 1)} onIncrease={() => onUpdate(item.id, item.quantity + 1)} limit={item.stock} /></div><div className="item-end"><strong>{money(item.price * item.quantity)}</strong><button onClick={() => onRemove(item.id)}>Remove</button></div></article>)}</section><aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money(total)}</strong></div><div><span>Delivery</span><strong>{total >= 2500 ? 'Free' : money(150)}</strong></div><div className="summary-total"><span>Total</span><strong>{money(total + (total >= 2500 ? 0 : 150))}</strong></div><Link to="/checkout" className="button full">Proceed to checkout</Link><p>Taxes are included where applicable.</p></aside></div></main>;
}

function CheckoutPage({ cart, onCheckout }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', payment: 'Cash on Delivery' });
  const [errors, setErrors] = useState({});
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (subtotal >= 2500 ? 0 : 150);
  const submit = (event) => { event.preventDefault(); const next = {}; if (!form.name.trim()) next.name = 'Please enter your full name.'; if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'; if (!/^(\+63|0)9\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) next.phone = 'Use a valid Philippine mobile number.'; if (form.address.trim().length < 12) next.address = 'Please enter your complete delivery address.'; setErrors(next); if (!Object.keys(next).length) { onCheckout(form); navigate('/confirmation'); } };
  if (!cart.length) return <main className="section empty-state"><h1>Nothing to check out yet.</h1><p>Your cart needs at least one item before checkout.</p><Link className="button" to="/">Visit the shop</Link></main>;
  return <main className="section checkout-page"><div className="page-heading"><p className="eyebrow">Checkout</p><h1>Almost yours.</h1><p>Fill in your delivery details to place your order.</p></div><div className="checkout-layout"><form noValidate onSubmit={submit}><h2>Delivery information</h2>{[['name', 'Full name', 'text'], ['email', 'Email address', 'email'], ['phone', 'Phone number', 'tel']].map(([field, label, type]) => <label key={field}>{label}<input type={type} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={field === 'phone' ? '0917 123 4567' : ''} className={errors[field] ? 'has-error' : ''} />{errors[field] && <small className="error">{errors[field]}</small>}</label>)}<label>Delivery address<textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} rows="4" placeholder="House no., street, barangay, city, province" className={errors.address ? 'has-error' : ''} />{errors.address && <small className="error">{errors.address}</small>}</label><fieldset><legend>Payment method</legend><label className="radio"><input type="radio" checked readOnly /> <span>Cash on Delivery</span><small>Pay when your order arrives.</small></label></fieldset><button className="button full" type="submit">Place order — {money(total)}</button></form><aside className="order-summary"><h2>Your order</h2>{cart.map((item) => <div className="checkout-item" key={item.id}><span>{item.name} <small>× {item.quantity}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div></aside></div></main>;
}

function ConfirmationPage({ order }) { return <main className="section confirmation empty-state"><div className="check">✓</div><p className="eyebrow">Order confirmed</p><h1>Thank you, {order?.name?.split(' ')[0] || 'friend'}!</h1><p>Your order has been received. We’ll send confirmation updates to <strong>{order?.email}</strong>.</p><Link to="/" className="button">Back to the shop</Link></main>; }
function NotFoundPage() { return <main className="section empty-state"><h1>That page wandered off.</h1><p>Let’s get you back to the collection.</p><Link to="/" className="button">Go home</Link></main>; }

export default function App() {
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const addToCart = (product, amount = 1) => setCart((current) => { const found = current.find((item) => item.id === product.id); return found ? current.map((item) => item.id === product.id ? { ...item, quantity: Math.min(item.stock, item.quantity + amount) } : item) : [...current, { ...product, quantity: Math.min(product.stock, amount) }]; });
  const updateQuantity = (id, quantity) => setCart((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity: Math.min(item.stock, quantity) } : item));
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const completeOrder = (details) => { setOrder(details); setCart([]); };
  return <div className="app-shell"><Header itemCount={itemCount} /><Routes><Route path="/" element={<HomePage cart={cart} onAdd={addToCart} />} /><Route path="/products/:productId" element={<ProductDetailsPage onAdd={addToCart} />} /><Route path="/cart" element={<CartPage cart={cart} onAdd={addToCart} onUpdate={updateQuantity} onRemove={(id) => setCart((items) => items.filter((item) => item.id !== id))} />} /><Route path="/checkout" element={<CheckoutPage cart={cart} onCheckout={completeOrder} />} /><Route path="/confirmation" element={<ConfirmationPage order={order} />} /><Route path="/not-found" element={<NotFoundPage />} /><Route path="*" element={<Navigate to="/not-found" replace />} /></Routes><Footer /></div>;
}
