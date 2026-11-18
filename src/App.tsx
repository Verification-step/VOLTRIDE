import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bike,
  Search,
  ShoppingBag,
  UserRound,
  Heart,
  Menu,
  X,
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Plus,
  Minus,
  Trash2,
  Check,
  ChevronRight,
} from 'lucide-react';
import './index.css';

const seed = [
  {
    id: 'bike-1',
    name: 'Sur-Ron Light Bee X',
    brand: 'Sur-Ron',
    price: 1799,
    category: 'Electric Dirt Bikes',
    tag: 'BESTSELLER',
    image:
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1100&q=85',
    description:
      'A compact electric dirt bike concept listing. Confirm the exact model specification, supplier availability and regional delivery eligibility before purchase.',
  },
  {
    id: 'bike-2',
    name: 'Talaria Sting R MX4',
    brand: 'Talaria',
    price: 2199,
    category: 'Electric Dirt Bikes',
    tag: 'POPULAR',
    image:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1100&q=85',
    description:
      'An illustrative catalogue listing for the VOLTRIDE prototype. Technical details require supplier verification.',
  },
  {
    id: 'bike-3',
    name: 'Surron Ultra Bee',
    brand: 'Sur-Ron',
    price: 2499,
    category: 'Electric Bikes',
    tag: 'NEW',
    image:
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1100&q=85',
    description:
      'Demo listing. No live inventory, delivery or warranty information is connected.',
  },
  {
    id: 'bike-4',
    name: 'Talaria XXX',
    brand: 'Talaria',
    price: 2299,
    category: 'Electric Bikes',
    tag: '',
    image:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1100&q=85',
    description:
      'Demo listing. Product specifications and availability must be verified.',
  },
  {
    id: 'bike-5',
    name: 'Sur-Ron LBX',
    brand: 'Sur-Ron',
    price: 1999,
    category: 'Electric Dirt Bikes',
    tag: '',
    image:
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1100&q=85',
    description:
      'Demo listing. Supplier and manufacturer details are not connected.',
  },
  {
    id: 'bike-6',
    name: 'E-Ride Pro SS',
    brand: 'E-Ride Pro',
    price: 2699,
    category: 'Electric Bikes',
    tag: '',
    image:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1100&q=85',
    description:
      'Demo listing. This prototype does not verify stock or road legality.',
  },
];
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const money = n =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(n || 0);
function App() {
  const [products, setProducts] = useState(() => read('vol-products', seed));
  const [cart, setCart] = useState(() => read('vol-cart', []));
  const [orders, setOrders] = useState(() => read('vol-orders', []));
  const [wishlist, setWishlist] = useState(() => read('vol-wishlist', []));
  const [page, setPage] = useState('home'),
    [product, setProduct] = useState(seed[0]);
  const [query, setQuery] = useState(''),
    [category, setCategory] = useState('All'),
    [sort, setSort] = useState('Featured');
  const [admin, setAdmin] = useState(false),
    [adminTab, setAdminTab] = useState('Overview'),
    [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState(''),
    [checkoutStep, setCheckoutStep] = useState(1),
    [payment, setPayment] = useState('Card / Bank');
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
  });
  const [activeOrder, setActiveOrder] = useState(null),
    [cryptoHash, setCryptoHash] = useState('');
  const [editing, setEditing] = useState(null),
    [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState({
    name: '',
    brand: '',
    price: '',
    category: 'Electric Dirt Bikes',
  });
  const notify = msg => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2500);
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const navigate = next => {
    setPage(next);
    setAdmin(false);
    setMobile(false);
    window.scrollTo(0, 0);
  };
  const updateCart = next => {
    setCart(next);
    save('vol-cart', next);
  };
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const filtered = useMemo(
    () =>
      products
        .filter(
          p =>
            (category === 'All' || p.category === category) &&
            (p.name + ' ' + p.brand).toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) =>
          sort === 'Price: low to high'
            ? a.price - b.price
            : sort === 'Price: high to low'
              ? b.price - a.price
              : sort === 'A–Z'
                ? a.name.localeCompare(b.name)
                : 0
        ),
    [products, category, query, sort]
  );
  const addToCart = p => {
    const next = [...cart];
    const found = next.find(x => x.id === p.id);
    if (found) found.qty += 1;
    else next.push({ ...p, qty: 1 });
    updateCart(next);
    notify('Added to your basket');
  };
  const toggleWish = id => {
    const next = wishlist.includes(id)
      ? wishlist.filter(x => x !== id)
      : [...wishlist, id];
    setWishlist(next);
    save('vol-wishlist', next);
  };
  const createOrder = () => {
    if (
      !customer.name ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.postcode
    ) {
      notify('Please complete the required delivery details');
      return;
    }
    const next = {
      id: 'VR-' + String(Date.now()).slice(-6),
      items: cart,
      total,
      customer,
      payment,
      status: 'Awaiting demo payment',
      date: new Date().toLocaleDateString('en-GB'),
    };
    setActiveOrder(next);
    setOrders([next, ...orders]);
    save('vol-orders', [next, ...orders]);
    updateCart([]);
    navigate(payment === 'Cryptocurrency' ? 'crypto' : 'success');
  };
  const saveProduct = () => {
    if (!draft.name.trim() || Number(draft.price) <= 0) {
      notify('Enter a product name and valid price');
      return;
    }
    const next = editing
      ? products.map(p =>
          p.id === editing.id
            ? { ...p, ...draft, price: Number(draft.price) }
            : p
        )
      : [
          {
            ...draft,
            id: 'custom-' + Date.now(),
            price: Number(draft.price),
            brand: draft.brand || 'Unspecified',
            image: seed[0].image,
            tag: '',
            description:
              'Admin-created demo product. Add verified specifications before publishing.',
          },
          ...products,
        ];
    setProducts(next);
    save('vol-products', next);
    setShowEditor(false);
    setEditing(null);
    notify('Product saved in this browser');
  };
  const header = (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('home')}>
        <Bike /> VOLTRIDE
      </button>
      <nav>
        <button onClick={() => navigate('home')}>Home</button>
        <button onClick={() => navigate('shop')}>Shop</button>
        <button onClick={() => navigate('about')}>About</button>
        <button onClick={() => navigate('account')}>Account</button>
      </nav>
      <div className="header-actions">
        <button aria-label="Search" onClick={() => navigate('shop')}>
          <Search />
        </button>
        <button aria-label="Account" onClick={() => navigate('account')}>
          <UserRound />
        </button>
        <button
          className="bag"
          aria-label="Basket"
          onClick={() => navigate('cart')}
        >
          <ShoppingBag />
          <span>{cart.reduce((s, x) => s + x.qty, 0)}</span>
        </button>
        <button className="mobile-toggle" onClick={() => setMobile(!mobile)}>
          {mobile ? <X /> : <Menu />}
        </button>
      </div>
      {mobile && (
        <div className="mobile-nav">
          {['home', 'shop', 'about', 'account', 'cart'].map(x => (
            <button key={x} onClick={() => navigate(x)}>
              {x}
            </button>
          ))}
        </div>
      )}
    </header>
  );
  const footer = (
    <footer>
      <div className="footer-grid">
        <div>
          <b className="brand">
            <Bike /> VOLTRIDE
          </b>
          <p>Electric freedom. Without compromise.</p>
        </div>
        <div>
          <b>Explore</b>
          <button onClick={() => navigate('shop')}>Shop all bikes</button>
          <button onClick={() => navigate('about')}>Our approach</button>
        </div>
        <div>
          <b>Customer care</b>
          <button onClick={() => navigate('shipping')}>
            Shipping information
          </button>
          <button onClick={() => navigate('returns')}>
            Returns & warranty
          </button>
          <button onClick={() => navigate('contact')}>Contact</button>
        </div>
        <div>
          <b>Stay in the loop</b>
          <p>Product news and collection updates.</p>
          <div className="subscribe">
            <input placeholder="Email address" />
            <button onClick={() => notify('Newsletter is demo-only')}>
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 VOLTRIDE UK</span>
        <span>Prototype store · No live transactions</span>
      </div>
    </footer>
  );
  const card = p => (
    <article className="product-card" key={p.id}>
      <div
        className="product-image"
        onClick={() => {
          setProduct(p);
          navigate('product');
        }}
      >
        <img src={p.image} alt={p.name} />
        {p.tag && <label>{p.tag}</label>}
        <button
          className="wish"
          aria-label="Toggle wishlist"
          onClick={e => {
            e.stopPropagation();
            toggleWish(p.id);
          }}
        >
          <Heart fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} />
        </button>
        <button
          className="quick-add"
          onClick={e => {
            e.stopPropagation();
            addToCart(p);
          }}
        >
          Quick add <span>+</span>
        </button>
      </div>
      <div className="product-meta">
        <small>{p.brand}</small>
        <button
          className="product-name"
          onClick={() => {
            setProduct(p);
            navigate('product');
          }}
        >
          {p.name}
        </button>
        <b>{money(p.price)}</b>
        <small className="muted">Availability to be confirmed</small>
      </div>
    </article>
  );
  const adminPanel = (
    <div className="admin-shell">
      <aside className="admin-side">
        <button className="brand" onClick={() => setAdmin(false)}>
          <Bike /> VOLTRIDE
        </button>
        <small className="side-label">STORE MANAGEMENT</small>
        {[
          ['Overview', LayoutDashboard],
          ['Products', Package],
          ['Orders', ShoppingCart],
          ['Customers', Users],
          ['Payments', CreditCard],
          ['Crypto review', Wallet],
          ['Analytics', ChartNoAxesCombined],
          ['Settings', Settings],
        ].map(([label, Icon]) => (
          <button
            key={label}
            className={adminTab === label ? 'selected' : ''}
            onClick={() => setAdminTab(label)}
          >
            <Icon />
            {label}
          </button>
        ))}
        <button className="side-exit" onClick={() => setAdmin(false)}>
          <LogOut /> Exit admin
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-topline">
          VOLTRIDE / {adminTab.toUpperCase()} <span>DEMO WORKSPACE</span>
        </div>
        <div className="admin-content">
          <div className="admin-title">
            <div>
              <small>RETAIL OPERATIONS</small>
              <h1>{adminTab}</h1>
              <p>Illustrative local data · Not connected to a live store.</p>
            </div>
            {adminTab === 'Products' && (
              <button
                className="button-dark"
                onClick={() => {
                  setEditing(null);
                  setDraft({
                    name: '',
                    brand: '',
                    price: '',
                    category: 'Electric Dirt Bikes',
                  });
                  setShowEditor(true);
                }}
              >
                <Plus /> Add product
              </button>
            )}
          </div>
          {adminTab === 'Overview' && (
            <>
              <div className="metric-grid">
                {[
                  [
                    'Demo revenue',
                    money(orders.reduce((s, o) => s + o.total, 0)),
                  ],
                  ['Orders', orders.length],
                  ['Awaiting payment', orders.length],
                  ['Products', products.length],
                ].map(([k, v]) => (
                  <div className="metric">
                    <small>{k}</small>
                    <strong>{v}</strong>
                    <span>Local prototype data</span>
                  </div>
                ))}
              </div>
              <div className="admin-columns">
                <section className="admin-panel">
                  <h3>Recent orders</h3>
                  {orders.length ? (
                    orders.slice(0, 5).map(o => (
                      <div className="order-line">
                        <b>{o.id}</b>
                        <span>{o.customer.name}</span>
                        <strong>{money(o.total)}</strong>
                        <em>{o.status}</em>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      No orders yet. Demo orders created at checkout appear
                      here.
                    </div>
                  )}
                </section>
                <section className="admin-panel">
                  <h3>Store checklist</h3>
                  {[
                    'Connect an authorised payment provider',
                    'Verify product specifications and prices',
                    'Configure real supplier fulfilment',
                    'Set shipping zones and policies',
                    'Configure transactional email',
                  ].map(x => (
                    <p className="check-line">
                      <span>○</span>
                      {x}
                    </p>
                  ))}
                </section>
              </div>
            </>
          )}
          {adminTab === 'Products' && (
            <section className="admin-panel">
              <div className="panel-head">
                <h3>Catalogue</h3>
                <span>{products.length} products</span>
              </div>
              {products.map(p => (
                <div className="product-admin-row">
                  <img src={p.image} />
                  <div>
                    <b>{p.name}</b>
                    <small>
                      {p.brand} · {p.category}
                    </small>
                  </div>
                  <strong>{money(p.price)}</strong>
                  <button
                    onClick={() => {
                      setEditing(p);
                      setDraft({
                        name: p.name,
                        brand: p.brand,
                        price: String(p.price),
                        category: p.category,
                      });
                      setShowEditor(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="danger-text"
                    onClick={() => {
                      const next = products.filter(x => x.id !== p.id);
                      setProducts(next);
                      save('vol-products', next);
                      notify('Product removed');
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </section>
          )}
          {adminTab === 'Orders' && (
            <section className="admin-panel">
              <h3>Order management</h3>
              {orders.length ? (
                orders.map(o => (
                  <div className="order-line">
                    <b>{o.id}</b>
                    <span>{o.customer.name}</span>
                    <strong>{money(o.total)}</strong>
                    <em>{o.status}</em>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  Orders placed in this demo will appear here.
                </div>
              )}
            </section>
          )}
          {adminTab === 'Customers' && (
            <section className="admin-panel">
              <h3>Customer records</h3>
              {orders.length ? (
                orders.map(o => (
                  <div className="order-line">
                    <b>{o.customer.name}</b>
                    <span>{o.customer.email}</span>
                    <strong>{o.id}</strong>
                  </div>
                ))
              ) : (
                <div className="empty-state">No customer records yet.</div>
              )}
            </section>
          )}
          {adminTab === 'Payments' && (
            <section className="admin-panel">
              <h3>Payment centre</h3>
              <p>
                All payment states are simulated. No card, bank or crypto
                transaction is initiated.
              </p>
              {orders.map(o => (
                <div className="order-line">
                  <b>{o.id}</b>
                  <span>{o.payment}</span>
                  <strong>{money(o.total)}</strong>
                  <em>{o.status}</em>
                </div>
              ))}
            </section>
          )}
          {adminTab === 'Crypto review' && (
            <section className="admin-panel">
              <h3>Manual crypto review</h3>
              <p>
                Submitted transaction references are demo-only. This prototype
                cannot verify blockchain payments or approve a real order.
              </p>
              {orders.filter(o => o.payment === 'Cryptocurrency').length ? (
                orders
                  .filter(o => o.payment === 'Cryptocurrency')
                  .map(o => (
                    <div className="order-line">
                      <b>{o.id}</b>
                      <span>{o.customer.email}</span>
                      <strong>{money(o.total)}</strong>
                      <em>Awaiting demo review</em>
                    </div>
                  ))
              ) : (
                <div className="empty-state">No demo crypto submissions.</div>
              )}
            </section>
          )}
          {adminTab === 'Analytics' && (
            <div className="metric-grid">
              {[
                [
                  'Gross demo sales',
                  money(orders.reduce((s, o) => s + o.total, 0)),
                ],
                ['Orders', orders.length],
                [
                  'Average order',
                  money(
                    orders.length
                      ? orders.reduce((s, o) => s + o.total, 0) / orders.length
                      : 0
                  ),
                ],
                ['Catalogue size', products.length],
              ].map(([k, v]) => (
                <div className="metric">
                  <small>{k}</small>
                  <strong>{v}</strong>
                  <span>Based on this browser only</span>
                </div>
              ))}
            </div>
          )}
          {adminTab === 'Settings' && (
            <section className="admin-panel">
              <h3>Prototype settings</h3>
              <p>
                Business contact details, tax rules, payment credentials,
                supplier accounts, delivery zones and policies are intentionally
                not configured.
              </p>
              <button
                className="button-outline"
                onClick={() =>
                  notify('No external integrations are configured')
                }
              >
                Integration status
              </button>
            </section>
          )}
        </div>
      </main>
      {showEditor && (
        <div className="modal-backdrop">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setShowEditor(false)}
            >
              <X />
            </button>
            <small>CATALOGUE EDITOR</small>
            <h2>{editing ? 'Edit product' : 'Add product'}</h2>
            {[
              ['Product name', 'name'],
              ['Manufacturer', 'brand'],
              ['Retail price (£)', 'price'],
            ].map(([label, key]) => (
              <label className="field">
                {label}
                <input
                  value={draft[key]}
                  onChange={e => setDraft({ ...draft, [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="field">
              Category
              <select
                value={draft.category}
                onChange={e => setDraft({ ...draft, category: e.target.value })}
              >
                <option>Electric Dirt Bikes</option>
                <option>Electric Bikes</option>
              </select>
            </label>
            <p className="form-note">
              Saved to this browser only. No public production catalogue is
              updated.
            </p>
            <button className="button-dark full" onClick={saveProduct}>
              Save product
            </button>
          </div>
        </div>
      )}
    </div>
  );
  let content;
  if (page === 'home')
    content = (
      <>
        <section className="hero">
          <div className="hero-copy">
            <small>THE NEXT GENERATION OF ELECTRIC RIDING</small>
            <h1>
              Electric freedom.
              <br />
              Without compromise.
            </h1>
            <p>Discover a new standard in electric riding.</p>
            <div className="hero-buttons">
              <button className="button-light" onClick={() => navigate('shop')}>
                Explore the collection <ArrowRight />
              </button>
              <button className="text-button" onClick={() => navigate('about')}>
                Discover VOLTRIDE
              </button>
            </div>
          </div>
          <div className="hero-caption">ENGINEERED FOR THE JOURNEY AHEAD</div>
        </section>
        <section className="benefits">
          {[
            [Truck, 'Delivery information'],
            [ShieldCheck, 'Secure checkout concept'],
            [Headphones, 'Customer support'],
          ].map(([Icon, t]) => (
            <div>
              <Icon />
              <span>{t}</span>
            </div>
          ))}
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <small>THE COLLECTION</small>
              <h2>Featured bikes</h2>
            </div>
            <button onClick={() => navigate('shop')}>
              View all bikes <ArrowRight />
            </button>
          </div>
          <div className="product-grid">{products.slice(0, 3).map(card)}</div>
        </section>
        <section className="editorial">
          <div>
            <small>OUR POINT OF VIEW</small>
            <h2>
              Move differently.
              <br />
              Think electric.
            </h2>
            <p>
              Explore an evolving collection of electric bikes, with clear
              product information and a considered customer experience.
            </p>
            <button className="button-light" onClick={() => navigate('about')}>
              The VOLTRIDE approach <ArrowRight />
            </button>
          </div>
          <img src={seed[1].image} alt="Electric bike editorial" />
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <small>WHY VOLTRIDE</small>
              <h2>A clearer way to ride electric.</h2>
            </div>
          </div>
          <div className="value-grid">
            <div>
              <b>01</b>
              <h3>Curated selection</h3>
              <p>A focused catalogue built around electric riding.</p>
            </div>
            <div>
              <b>02</b>
              <h3>Transparent information</h3>
              <p>
                Product and delivery details should be clear before checkout.
              </p>
            </div>
            <div>
              <b>03</b>
              <h3>Support that matters</h3>
              <p>Helpful guidance throughout the customer journey.</p>
            </div>
          </div>
        </section>
      </>
    );
  else if (page === 'shop')
    content = (
      <>
        <div className="page-banner">
          <small>VOLTRIDE / SHOP</small>
          <h1>Our collection</h1>
          <p>Find the right ride for your journey.</p>
        </div>
        <section className="shop-layout">
          <aside className="filters">
            <b>Filter by</b>
            <small>Category</small>
            {['All', 'Electric Dirt Bikes', 'Electric Bikes'].map(x => (
              <button
                className={category === x ? 'filter-active' : ''}
                onClick={() => setCategory(x)}
              >
                {x}
              </button>
            ))}
            <small>Search</small>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search bikes..."
            />
          </aside>
          <div>
            <div className="shop-toolbar">
              <span>{filtered.length} products</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option>Featured</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>A–Z</option>
              </select>
            </div>
            {filtered.length ? (
              <div className="product-grid">{filtered.map(card)}</div>
            ) : (
              <div className="empty-state">
                No bikes match those filters. Try another search.
              </div>
            )}
          </div>
        </section>
      </>
    );
  else if (page === 'product')
    content = (
      <>
        <div className="breadcrumbs">Home / Shop / {product.name}</div>
        <section className="product-detail">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="detail-copy">
            <small>{product.brand}</small>
            <h1>{product.name}</h1>
            <div className="stars">
              ★★★★★ <span>Prototype listing</span>
            </div>
            <strong className="detail-price">{money(product.price)}</strong>
            <p className="stock-note">
              Availability and delivery eligibility require confirmation.
            </p>
            <p>{product.description}</p>
            <ul className="detail-points">
              <li>Product information subject to verification</li>
              <li>Supplier stock not connected</li>
              <li>Delivery terms depend on destination</li>
            </ul>
            <button
              className="button-dark full"
              onClick={() => addToCart(product)}
            >
              Add to basket
            </button>
            <button
              className="button-outline full"
              onClick={() => {
                addToCart(product);
                navigate('checkout');
              }}
            >
              Buy now
            </button>
            <div className="detail-accordions">
              {[
                'Overview',
                'Specifications',
                'Delivery',
                'Warranty',
                'Reviews',
              ].map(x => (
                <details>
                  <summary>
                    {x}
                    <span>+</span>
                  </summary>
                  <p>
                    {x === 'Specifications'
                      ? 'Manufacturer specifications have not been verified for this demo listing.'
                      : 'Information will be published when confirmed by the retailer and supplier.'}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <h2>You may also like</h2>
            <button onClick={() => navigate('shop')}>
              Shop all <ArrowRight />
            </button>
          </div>
          <div className="product-grid">
            {products
              .filter(x => x.id !== product.id)
              .slice(0, 3)
              .map(card)}
          </div>
        </section>
      </>
    );
  else if (page === 'cart')
    content = (
      <section className="narrow-page">
        <small>YOUR SELECTION</small>
        <h1>Shopping basket</h1>
        {cart.length ? (
          <>
            <div className="cart-list">
              {cart.map(item => (
                <div className="cart-item">
                  <img src={item.image} />
                  <div>
                    <b>{item.name}</b>
                    <small>{item.brand}</small>
                    <strong>{money(item.price)}</strong>
                    <div className="qty">
                      <button
                        onClick={() =>
                          updateCart(
                            cart.map(x =>
                              x.id === item.id
                                ? { ...x, qty: Math.max(1, x.qty - 1) }
                                : x
                            )
                          )
                        }
                      >
                        <Minus />
                      </button>
                      {item.qty}
                      <button
                        onClick={() =>
                          updateCart(
                            cart.map(x =>
                              x.id === item.id ? { ...x, qty: x.qty + 1 } : x
                            )
                          )
                        }
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove"
                    onClick={() =>
                      updateCart(cart.filter(x => x.id !== item.id))
                    }
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Subtotal</span>
              <b>{money(total)}</b>
            </div>
            <p className="form-note">
              Delivery and taxes are not calculated in this prototype.
            </p>
            <button
              className="button-dark full"
              onClick={() => {
                setCheckoutStep(1);
                navigate('checkout');
              }}
            >
              Continue to checkout <ArrowRight />
            </button>
            <button
              className="button-outline full"
              onClick={() => navigate('shop')}
            >
              Continue shopping
            </button>
          </>
        ) : (
          <div className="empty-state">
            <ShoppingBag />
            <h3>Your basket is empty</h3>
            <p>Explore the collection and find your next ride.</p>
            <button className="button-dark" onClick={() => navigate('shop')}>
              Browse bikes
            </button>
          </div>
        )}
      </section>
    );
  else if (page === 'checkout')
    content = (
      <section className="checkout-page">
        <div>
          <small>SECURE CHECKOUT EXPERIENCE</small>
          <h1>Checkout</h1>
          <div className="steps">
            {['Information', 'Delivery', 'Payment', 'Confirm'].map((s, i) => (
              <span className={checkoutStep === i + 1 ? 'current' : ''}>
                {i + 1}. {s}
              </span>
            ))}
          </div>
          <div className="checkout-panel">
            <h3>
              {checkoutStep === 1
                ? 'Your details'
                : checkoutStep === 2
                  ? 'Delivery address'
                  : 'Payment method'}
            </h3>
            {checkoutStep === 1 && (
              <div className="form-grid">
                {[
                  ['Full name', 'name'],
                  ['Email address', 'email'],
                  ['Phone number', 'phone'],
                ].map(([label, key]) => (
                  <label className="field">
                    {label}
                    <input
                      value={customer[key]}
                      onChange={e =>
                        setCustomer({ ...customer, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
              </div>
            )}
            {checkoutStep === 2 && (
              <div className="form-grid">
                {[
                  ['Street address', 'address'],
                  ['City', 'city'],
                  ['Postcode', 'postcode'],
                ].map(([label, key]) => (
                  <label className="field">
                    {label}
                    <input
                      value={customer[key]}
                      onChange={e =>
                        setCustomer({ ...customer, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
                <p className="form-note">
                  Delivery cost and eligibility are not live-calculated in this
                  prototype.
                </p>
              </div>
            )}
            {checkoutStep === 3 && (
              <div className="payment-options">
                {['Card / Bank', 'Cryptocurrency'].map(x => (
                  <button
                    className={payment === x ? 'chosen' : ''}
                    onClick={() => setPayment(x)}
                  >
                    {x}
                    <span>{payment === x ? '●' : '○'}</span>
                  </button>
                ))}
                <p className="form-note">
                  Demo only: no card details are collected and no payment
                  provider or blockchain is connected.
                </p>
              </div>
            )}
            <div className="checkout-actions">
              {checkoutStep > 1 && (
                <button
                  className="button-outline"
                  onClick={() => setCheckoutStep(checkoutStep - 1)}
                >
                  Back
                </button>
              )}
              <button
                className="button-dark"
                onClick={() =>
                  checkoutStep < 3
                    ? setCheckoutStep(checkoutStep + 1)
                    : createOrder()
                }
              >
                {checkoutStep < 3 ? 'Continue' : 'Place demo order'}{' '}
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
        <aside className="summary">
          <h3>Order summary</h3>
          {cart.map(x => (
            <div className="summary-item">
              <span>
                {x.name} × {x.qty}
              </span>
              <b>{money(x.price * x.qty)}</b>
            </div>
          ))}
          <div className="cart-total">
            <span>Total</span>
            <b>{money(total)}</b>
          </div>
        </aside>
      </section>
    );
  else if (page === 'crypto')
    content = (
      <section className="narrow-page crypto-page">
        <small>PAYMENT SIMULATION</small>
        <h1>Cryptocurrency payment</h1>
        <div className="demo-alert">
          DEMO ONLY — no receiving wallet is configured and no funds should be
          sent.
        </div>
        <h2>{money(activeOrder?.total)}</h2>
        <p>Order {activeOrder?.id}</p>
        <div className="fake-qr">
          QR
          <br />
          DEMO
        </div>
        <p>
          Real wallet addresses and network details are intentionally absent.
        </p>
        <label className="field">
          Transaction hash (demo reference)
          <input
            value={cryptoHash}
            onChange={e => setCryptoHash(e.target.value)}
            placeholder="Enter a sample reference"
          />
        </label>
        <button
          className="button-dark full"
          onClick={() => {
            if (!cryptoHash.trim()) {
              notify('Enter a demo reference');
              return;
            }
            const next = orders.map(o =>
              o.id === activeOrder?.id
                ? { ...o, status: 'Evidence submitted (demo)' }
                : o
            );
            setOrders(next);
            save('vol-orders', next);
            navigate('success');
          }}
        >
          Submit demo reference
        </button>
      </section>
    );
  else if (page === 'success')
    content = (
      <section className="narrow-page success-page">
        <div className="success-mark">
          <Check />
        </div>
        <small>PROTOTYPE ORDER</small>
        <h1>Order received.</h1>
        <p>
          Your demo order {activeOrder?.id} has been recorded in this browser.
          No payment has been processed and no supplier has received an order.
        </p>
        <div className="cart-total">
          <span>Demo order total</span>
          <b>{money(activeOrder?.total)}</b>
        </div>
        <button
          className="button-dark full"
          onClick={() => navigate('account')}
        >
          View demo account
        </button>
        <button
          className="button-outline full"
          onClick={() => navigate('shop')}
        >
          Continue shopping
        </button>
      </section>
    );
  else if (page === 'account')
    content = (
      <section className="narrow-page">
        <small>YOUR VOLTRIDE</small>
        <h1>Account overview</h1>
        <div className="account-grid">
          <button onClick={() => navigate('orders')}>
            <Package /> My orders <ChevronRight />
          </button>
          <button onClick={() => navigate('wishlist')}>
            <Heart /> Wishlist <ChevronRight />
          </button>
          <button
            onClick={() => notify('Sign-in is not connected in this prototype')}
          >
            <UserRound /> Sign in / Register <ChevronRight />
          </button>
        </div>
        <p className="form-note">
          This prototype stores demo orders and wishlist items in this browser
          only. There is no customer authentication.
        </p>
      </section>
    );
  else if (page === 'orders')
    content = (
      <section className="narrow-page">
        <small>ACCOUNT</small>
        <h1>Order history</h1>
        {orders.length ? (
          orders.map(o => (
            <div className="order-line">
              <b>{o.id}</b>
              <span>{o.date}</span>
              <strong>{money(o.total)}</strong>
              <em>{o.status}</em>
            </div>
          ))
        ) : (
          <div className="empty-state">No demo orders yet.</div>
        )}
      </section>
    );
  else if (page === 'wishlist')
    content = (
      <section className="section">
        <div className="section-heading">
          <h1>Your wishlist</h1>
        </div>
        <div className="product-grid">
          {products.filter(p => wishlist.includes(p.id)).map(card)}
        </div>
        {!wishlist.length && (
          <div className="empty-state">Your wishlist is empty.</div>
        )}
      </section>
    );
  else if (page === 'about')
    content = (
      <section className="story-page">
        <small>ABOUT VOLTRIDE</small>
        <h1>
          Electric freedom.
          <br />
          Without compromise.
        </h1>
        <p>
          VOLTRIDE is a concept for a considered electric bike retail
          experience: a curated catalogue, transparent product information and
          clear customer support.
        </p>
        <p>
          We do not claim to manufacture these bikes, operate warehouses or
          represent any manufacturer. Product availability, specifications,
          warranty and delivery terms must be confirmed before a live launch.
        </p>
        <img src={seed[0].image} />
      </section>
    );
  else if (page === 'contact')
    content = (
      <section className="narrow-page">
        <small>WE'RE HERE TO HELP</small>
        <h1>Contact VOLTRIDE</h1>
        <label className="field">
          Your name
          <input placeholder="Full name" />
        </label>
        <label className="field">
          Email
          <input placeholder="you@example.com" />
        </label>
        <label className="field">
          Message
          <textarea placeholder="How can we help?" />
        </label>
        <button
          className="button-dark full"
          onClick={() =>
            notify('Contact form is a local demo; no message was sent')
          }
        >
          Send enquiry
        </button>
        <p className="form-note">
          No business email or phone number has been configured.
        </p>
      </section>
    );
  else
    content = (
      <section className="narrow-page">
        <small>INFORMATION</small>
        <h1>
          {page === 'shipping' ? 'Shipping information' : 'Returns & warranty'}
        </h1>
        <p>
          Policies are placeholders in this prototype. Confirm destination
          eligibility, shipping prices, return terms and warranty coverage
          before accepting live orders.
        </p>
        <button className="button-dark" onClick={() => navigate('contact')}>
          Contact us
        </button>
      </section>
    );
  return (
    <>
      {header}
      {admin ? adminPanel : <main>{content}</main>}
      {!admin && footer}
      <button
        className="admin-access"
        onClick={() => {
          setAdmin(true);
          setAdminTab('Overview');
          window.scrollTo(0, 0);
        }}
      >
        Admin preview
      </button>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
export default App;
