import React, { useState, useMemo } from "react";
import { ShoppingCart, Search, Menu, X, Plus, Minus, Star, ChevronLeft, Trash2, Mail } from "lucide-react";

const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Tajawal:wght@300;400;500;700;900&display=swap');
  .font-display { font-family: 'Aref Ruqaa', serif; }
  .font-body { font-family: 'Tajawal', sans-serif; }
`;

const CATEGORIES = [
  { id: "aqeedah", name: "عقيدة" },
  { id: "fiqh", name: "فقه" },
  { id: "seerah", name: "سيرة" },
  { id: "tafsir", name: "تفسير" },
  { id: "tarbiyah", name: "تربية" },
  { id: "history", name: "تاريخ" },
];

const BOOKS = [
  { id: 1, title: "الداء والدواء", author: "ابن قيّم الجوزية", price: 45, oldPrice: 60, cat: "tarbiyah", color: "#1f3b32", rating: 5 },
  { id: 2, title: "سيف الله خالد بن الوليد", author: "الجنرال أ. أكرم", price: 68, oldPrice: null, cat: "history", color: "#2b2b4a", rating: 5 },
  { id: 3, title: "رياض الصالحين", author: "الإمام النووي", price: 52, oldPrice: 65, cat: "tarbiyah", color: "#6b1f28", rating: 5 },
  { id: 4, title: "مختصر تفسير ابن كثير", author: "ابن كثير", price: 75, oldPrice: null, cat: "tafsir", color: "#1f3b32", rating: 4 },
  { id: 5, title: "الرحيق المختوم", author: "صفي الرحمن المباركفوري", price: 58, oldPrice: 70, cat: "seerah", color: "#3a2c18", rating: 5 },
  { id: 6, title: "فقه السنة", author: "سيد سابق", price: 89, oldPrice: null, cat: "fiqh", color: "#2b2b4a", rating: 4 },
  { id: 7, title: "حصن المسلم", author: "سعيد بن علي القحطاني", price: 22, oldPrice: 30, cat: "tarbiyah", color: "#6b1f28", rating: 5 },
  { id: 8, title: "شرح العقيدة الطحاوية", author: "ابن أبي العز", price: 64, oldPrice: null, cat: "aqeedah", color: "#1f3b32", rating: 4 },
];

function Emblem({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e3ab" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8a6a24" />
        </linearGradient>
      </defs>
      <polygon points="50,8 92,50 50,92 8,50" fill="none" stroke="url(#emblemGold)" strokeWidth="5" />
      <polygon points="50,26 74,50 50,74 26,50" fill="none" stroke="#241609" strokeWidth="3" />
    </svg>
  );
}

function BookCover({ book }) {
  return (
    <div
      className="relative w-full aspect-[3/4] rounded-sm flex items-center justify-center overflow-hidden shadow-md"
      style={{ backgroundColor: book.color }}
    >
      <div className="absolute inset-2 border-2 rounded-sm" style={{ borderColor: "#c9a22799" }} />
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-s-2 rounded-tl-sm" style={{ borderColor: "#f3e3ab" }} />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-e-2 rounded-br-sm" style={{ borderColor: "#f3e3ab" }} />
      <span className="font-display text-[#f3e3ab] text-center px-4 leading-relaxed" style={{ fontSize: "clamp(0.85rem, 3.2vw, 1.15rem)" }}>
        {book.title}
      </span>
    </div>
  );
}

export default function DarAlWahyaynStore() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");

  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === book.id);
      if (existing) {
        return prev.map((i) => (i.id === book.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...book, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((b) => {
      const matchesCat = activeCat === "all" || b.cat === activeCat;
      const matchesQuery = b.title.includes(query) || b.author.includes(query);
      return matchesCat && matchesQuery;
    });
  }, [activeCat, query]);

  return (
    <div dir="rtl" className="font-body min-h-screen bg-[#f6efdd] text-[#241609]">
      <style>{FONT_STYLE}</style>

      {/* Announcement bar */}
      <div className="bg-[#1f3b32] text-[#f3e3ab] text-center text-xs md:text-sm py-2 px-4 font-medium tracking-wide">
        شحن مجاني للطلبات فوق ٢٠٠ ليرة تركية
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#f6efdd]/95 backdrop-blur border-b border-[#c9a22733]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
          <div className="flex items-center gap-2">
            <Emblem className="w-9 h-9" />
            <span className="font-display font-bold text-xl md:text-2xl">دار الوحيين</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-[#8a6a24] transition-colors">الرئيسية</a>
            <a href="#books" className="hover:text-[#8a6a24] transition-colors">الكتب</a>
            <a href="#" className="hover:text-[#8a6a24] transition-colors">من نحن</a>
            <a href="#" className="hover:text-[#8a6a24] transition-colors">تواصل معنا</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-white/70 rounded-full px-3 py-1.5 border border-[#c9a22755] gap-2 w-48">
              <Search size={16} className="text-[#8a6a24] shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن كتاب..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-[#8a6a2499]"
              />
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#c9a22722] transition-colors"
              aria-label="سلة المشتريات"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -end-1 bg-[#6b1f28] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            <button className="md:hidden p-2" onClick={() => setMenuOpen((o) => !o)} aria-label="القائمة">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col gap-3 px-4 pb-4 text-sm font-medium border-t border-[#c9a22733] pt-3">
            <a href="#">الرئيسية</a>
            <a href="#books">الكتب</a>
            <a href="#">من نحن</a>
            <a href="#">تواصل معنا</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[#8a6a24] tracking-[3px] text-sm font-semibold mb-3">مكتبة إلكترونية أصيلة</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-[1.4] mb-5">
            كتبٌ تُنير العقل<br />وتُطمئن القلب
          </h1>
          <p className="text-[#3a2c18aa] leading-8 mb-8 max-w-md">
            نُقدّم لك نخبة من أمّهات الكتب في العقيدة والفقه والسيرة والتفسير،
            بطبعاتٍ موثوقة ونسخٍ أنيقة تليق بمكتبتك.
          </p>
          <div className="flex items-center gap-4">
            <a href="#books" className="bg-[#1f3b32] text-[#f3e3ab] px-7 py-3 rounded-full font-semibold hover:bg-[#16302a] transition-colors flex items-center gap-2">
              تسوّق الآن
              <ChevronLeft size={18} />
            </a>
            <span className="text-sm text-[#8a6a24] font-medium">+٤٠٠ عنوان متوفر</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm rotate-[-3deg]">
            <div className="col-span-1 translate-y-6"><BookCover book={BOOKS[2]} /></div>
            <div className="col-span-1 -translate-y-3"><BookCover book={BOOKS[0]} /></div>
            <div className="col-span-1 translate-y-8"><BookCover book={BOOKS[1]} /></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCat("all")}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeCat === "all" ? "bg-[#1f3b32] text-[#f3e3ab] border-[#1f3b32]" : "border-[#c9a22755] hover:bg-[#c9a22715]"
            }`}
          >
            الكل
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeCat === c.id ? "bg-[#1f3b32] text-[#f3e3ab] border-[#1f3b32]" : "border-[#c9a22755] hover:bg-[#c9a22715]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Books grid */}
      <section id="books" className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display font-bold text-2xl md:text-3xl">أحدث الإصدارات</h2>
          <span className="text-sm text-[#8a6a2499]">{filteredBooks.length} كتاب</span>
        </div>

        {filteredBooks.length === 0 ? (
          <p className="text-center py-16 text-[#8a6a2499]">لا توجد كتب مطابقة لبحثك.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {filteredBooks.map((book) => (
              <div key={book.id} className="group">
                <div className="relative">
                  <BookCover book={book} />
                  {book.oldPrice && (
                    <span className="absolute top-2 start-2 bg-[#6b1f28] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      خصم
                    </span>
                  )}
                </div>
                <div className="pt-3">
                  <h3 className="font-semibold text-sm md:text-base truncate">{book.title}</h3>
                  <p className="text-xs text-[#8a6a2499] mb-1.5">{book.author}</p>
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < book.rating ? "#c9a227" : "none"} stroke="#c9a227" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-[#1f3b32]">{book.price} ₺</span>
                      {book.oldPrice && (
                        <span className="text-xs text-[#8a6a2477] line-through">{book.oldPrice} ₺</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(book)}
                      className="bg-[#1f3b32] text-[#f3e3ab] rounded-full p-2 hover:bg-[#16302a] transition-colors"
                      aria-label="أضف للسلة"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-[#1f3b32] text-[#f3e3ab] mt-14">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-start">
            <h3 className="font-display font-bold text-2xl mb-2">اشترك في نشرتنا البريدية</h3>
            <p className="text-[#f3e3abaa] text-sm">كن أول من يعلم بالإصدارات الجديدة والعروض الخاصة</p>
          </div>
          <div className="flex w-full md:w-auto max-w-sm bg-white/10 rounded-full p-1.5 gap-2">
            <input
              placeholder="بريدك الإلكتروني"
              className="bg-transparent outline-none px-4 text-sm flex-1 placeholder:text-[#f3e3ab99]"
            />
            <button className="bg-[#c9a227] text-[#1f3b32] rounded-full px-5 py-2 text-sm font-bold flex items-center gap-1.5 shrink-0">
              <Mail size={15} />
              اشترك
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8a6a2499]">
        <div className="flex items-center gap-2">
          <Emblem className="w-6 h-6" />
          <span className="font-display font-bold text-[#241609]">دار الوحيين</span>
        </div>
        <p>© {new Date().getFullYear()} دار الوحيين — جميع الحقوق محفوظة</p>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="absolute top-0 end-0 h-full w-full max-w-sm bg-[#f6efdd] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#c9a22744]">
              <h3 className="font-display font-bold text-xl">سلة المشتريات</h3>
              <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-[#c9a22722] rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <p className="text-center text-[#8a6a2499] py-16 text-sm">سلتك فارغة حالياً</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 shrink-0">
                        <BookCover book={item} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.title}</p>
                        <p className="text-xs text-[#8a6a2499] mb-1.5">{item.price} ₺</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded-full border border-[#c9a22755]">
                            <Minus size={12} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded-full border border-[#c9a22755]">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-[#6b1f28] hover:bg-[#6b1f2811] rounded-full">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#c9a22744] px-5 py-4">
                <div className="flex items-center justify-between mb-4 font-bold">
                  <span>الإجمالي</span>
                  <span>{total} ₺</span>
                </div>
                <button className="w-full bg-[#1f3b32] text-[#f3e3ab] py-3 rounded-full font-semibold hover:bg-[#16302a] transition-colors">
                  إتمام الطلب
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
