'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import {
  Phone, MapPin, Clock, MessageCircle, ArrowUp, Menu, X,
  Drumstick, Truck, ShieldCheck, Sparkles, Star,
  ChevronRight, Send, Mail, Instagram, Facebook, Search,
  Loader2, CheckCircle2, Droplets, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const PHONE = '+92 348 4113201'
const PHONE_DIGITS = '+923484113201'
const WA_NUMBER = '923484113201'
const ADDRESS = '6M53+932, Kalaswala, Pakistan'
const MAP_EMBED = 'https://www.google.com/maps?q=6M53%2B932%20Kalaswala%20Pakistan&output=embed'

const waLink = (msg = "Hello Malik Poultry Farm, I'd like to inquire about your products.") =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

const inquiryMessage = (product) =>
  `Hello,\nI would like to inquire about ${product}.\nPlease share the price and availability.`

const IMG = {
  hero: 'https://images.unsplash.com/photo-1630090374791-c9eb7bab3935?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxwb3VsdHJ5JTIwZmFybXxlbnwwfHx8fDE3ODQ3Mjk3MTB8MA&ixlib=rb-4.1.0&q=85',
  farm: 'https://images.pexels.com/photos/19972937/pexels-photo-19972937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  freshChicken: 'https://images.pexels.com/photos/8251004/pexels-photo-8251004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  liveChicken: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=940&q=80',
  chickenMeat: 'https://images.pexels.com/photos/6107721/pexels-photo-6107721.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  eggs: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxlZ2dzJTIwdHJheXxlbnwwfHx8fDE3ODI1NDgzMzJ8MA&ixlib=rb-4.1.0&q=85',
  wholesalePoultry: 'https://images.pexels.com/photos/16831301/pexels-photo-16831301.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  cocaCola: 'https://images.pexels.com/photos/35020136/pexels-photo-35020136.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  sprite: 'https://images.unsplash.com/photo-1680404005217-a441afdefe83?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHxTcHJpdGUlMjBib3R0bGV8ZW58MHx8fHwxNzgzMDA1ODAzfDA&ixlib=rb-4.1.0&q=85',
  fanta: 'https://images.pexels.com/photos/17408558/pexels-photo-17408558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  mountainDew: 'https://images.pexels.com/photos/18297528/pexels-photo-18297528.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  minuteMaid: 'https://images.pexels.com/photos/5946781/pexels-photo-5946781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  water: 'https://images.pexels.com/photos/31699476/pexels-photo-31699476.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

// ---------- Brands (Premium Showcase) ----------
const brands = [
  { name: 'Coca-Cola', tagline: 'Original Taste. Timeless Refresh.', sizes: ['1.5L', '1L', '500ml', '330ml Can', 'Glass'], bg: 'from-red-600 via-red-700 to-red-900', accent: '#F40009', mark: 'C', icon: '🥤' },
  { name: 'Pepsi', tagline: 'The Bold, The Cold, The Best.', sizes: ['1.5L', '1L', '500ml', 'Can'], bg: 'from-blue-600 via-blue-800 to-slate-900', accent: '#004B93', mark: 'P', icon: '🥤' },
  { name: 'Sprite', tagline: 'Lemon-Lime. Crisp & Clean.', sizes: ['1.5L', '1L', '500ml', 'Can'], bg: 'from-emerald-500 via-green-600 to-green-900', accent: '#00A651', mark: 'S', icon: '🍋' },
  { name: '7Up', tagline: 'The Uncola. Fresh & Fizzy.', sizes: ['1.5L', '1L', '500ml', 'Can'], bg: 'from-lime-500 via-green-600 to-emerald-800', accent: '#4A9B3E', mark: '7', icon: '🍋' },
  { name: 'Mountain Dew', tagline: 'Do The Dew. Bold Citrus Kick.', sizes: ['1.5L', '500ml', 'Can'], bg: 'from-yellow-400 via-lime-500 to-green-800', accent: '#2E8B2E', mark: 'M', icon: <Zap className="w-6 h-6" /> },
  { name: 'Nestlé Pure Life', tagline: 'Pure. Trusted. Refreshing.', sizes: ['5L', '1.5L', '500ml'], bg: 'from-sky-400 via-sky-600 to-blue-900', accent: '#009CDE', mark: 'N', icon: <Droplets className="w-6 h-6" /> },
  { name: 'Aquafina', tagline: 'Pure Water, Perfect Every Time.', sizes: ['5L', '1.5L', '500ml'], bg: 'from-cyan-400 via-cyan-600 to-blue-800', accent: '#00A9E0', mark: 'A', icon: <Droplets className="w-6 h-6" /> },
  { name: 'Rani Juice', tagline: 'Real Fruit Pieces. Real Taste.', sizes: ['1L', '240ml', 'Can'], bg: 'from-orange-500 via-red-500 to-rose-700', accent: '#F7941D', mark: 'R', icon: '🍊' },
]

// ---------- Products ----------
const poultryProducts = [
  { name: 'Fresh Chicken', desc: 'Cleaned, cut & packed daily — ready for your kitchen or restaurant.', img: IMG.freshChicken },
  { name: 'Live Chicken', desc: 'Healthy, farm-raised live broilers available any time, any quantity.', img: IMG.liveChicken },
  { name: 'Chicken Meat', desc: 'Fresh, hygienically cut chicken meat — packed and ready to cook.', img: IMG.chickenMeat },
  { name: 'Farm Fresh Eggs', desc: 'Farm-fresh brown & white eggs delivered in trays and cartons.', img: IMG.eggs },
  { name: 'Wholesale Poultry', desc: 'Bulk poultry supply in crates — best rates for shops & distributors.', img: IMG.wholesalePoultry },
]

const beverageProducts = [
  { name: 'Coca-Cola', desc: 'Original taste — bottles, cans & family packs available.', img: IMG.cocaCola },
  { name: 'Pepsi', desc: 'The bold cola — 1.5L, 1L, 500ml and cans always in stock.', brand: brands[1] },
  { name: 'Sprite', desc: 'Refreshing lemon-lime soda — chilled and in-stock 24/7.', img: IMG.sprite },
  { name: '7Up', desc: 'Crisp lemon-lime refreshment in bottles and cans.', brand: brands[3] },
  { name: 'Fanta', desc: 'Vibrant orange fizz — bottles and cans in all sizes.', img: IMG.fanta },
  { name: 'Mountain Dew', desc: 'Bold citrus energy — cold stock available round the clock.', img: IMG.mountainDew },
  { name: 'Minute Maid Juices', desc: 'Real fruit juices — perfect for retail, cafes and catering.', img: IMG.minuteMaid },
  { name: 'Nestlé Pure Life', desc: 'Trusted mineral water — 5L, 1.5L and 500ml bottles.', brand: brands[5] },
  { name: 'Aquafina', desc: 'Pure drinking water — perfect for homes, offices & events.', brand: brands[6] },
  { name: 'Rani Juice', desc: 'Real fruit pieces — multiple flavors in bottles and cans.', brand: brands[7] },
]

const reviews = [
  { name: 'Ayzu Kaka', text: 'Good place to visit and shopping.', stars: 5 },
  { name: 'Dilawar Malik', text: 'Good.', stars: 5 },
  { name: 'Irsa Abhameed', text: 'Excellent service.', stars: 5 },
]

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Brands', href: '#brands' },
  { label: 'Products', href: '#products' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-md">
              <Drumstick className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className={`font-bold text-base md:text-lg ${scrolled ? 'text-brand-green' : 'text-white'}`}>Malik Poultry Farm</div>
              <div className={`text-[11px] uppercase tracking-wider ${scrolled ? 'text-slate-500' : 'text-white/80'}`}>Fresh · Reliable · 24/7</div>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className={`text-sm font-medium transition hover:text-brand-red ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>{l.label}</a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${PHONE_DIGITS}`}>
              <Button className="bg-brand-red hover:bg-red-700 text-white rounded-full px-5 gap-2">
                <Phone className="w-4 h-4" /> Call Now
              </Button>
            </a>
          </div>
          <button onClick={() => setOpen(!open)} className={`lg:hidden p-2 rounded-md ${scrolled ? 'text-slate-800' : 'text-white'}`} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">{l.label}</a>
            ))}
            <a href={`tel:${PHONE_DIGITS}`} className="block">
              <Button className="w-full mt-2 bg-brand-red hover:bg-red-700 text-white gap-2">
                <Phone className="w-4 h-4" /> Call {PHONE}
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMG.hero} alt="Modern poultry farm" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl">
          <Badge className="bg-white/15 text-white border border-white/20 backdrop-blur px-3 py-1 mb-5 hover:bg-white/20">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Trusted supplier in Kalaswala
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
            Fresh Poultry & Refreshing Beverages<br />
            <span className="text-brand-red">Delivered with Quality</span>
          </h1>
          <p className="mt-6 text-lg text-white/90 max-w-2xl leading-relaxed">
            Serving Kalaswala and nearby areas with premium poultry products and popular beverage brands. Retail, wholesale & bulk supply — open 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`tel:${PHONE_DIGITS}`}>
              <Button size="lg" className="bg-brand-red hover:bg-red-700 text-white rounded-full px-7 gap-2 h-12 text-base">
                <Phone className="w-4 h-4" /> Call Now
              </Button>
            </a>
            <a href="#products">
              <Button size="lg" variant="outline" className="rounded-full px-7 gap-2 h-12 text-base bg-white/10 border-white/40 text-white hover:bg-white hover:text-brand-green backdrop-blur">
                View Products <ChevronRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-white/85 text-sm">
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-red" /> Open 24 Hours</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-red" /> Kalaswala, Pakistan</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-red" /> {PHONE}</div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-white/95" />
    </section>
  )
}

function Features() {
  const items = [
    { icon: Drumstick, title: 'Fresh Daily Poultry', desc: 'Cut & delivered fresh every day.' },
    { icon: ShieldCheck, title: 'Trusted Local Supplier', desc: 'Years of service in Kalaswala.' },
    { icon: Truck, title: 'Wholesale Available', desc: 'Bulk rates for businesses.' },
    { icon: Clock, title: 'Open 24 Hours', desc: 'Serving you around the clock.' },
  ]
  return (
    <section className="relative -mt-16 z-20 container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 bg-white rounded-3xl p-4 lg:p-6 brand-shadow border border-slate-100">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl hover:bg-slate-50 transition">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
              <it.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">{it.title}</div>
              <div className="text-sm text-slate-500 mt-0.5">{it.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

function About() {
  const bullets = ['Quality Products', 'Freshness Guaranteed', 'Customer Satisfaction', 'Reliable Service', 'Local Trusted Business']
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="relative">
          <div className="absolute -top-6 -left-6 w-40 h-40 grid-dots rounded-2xl hidden md:block" />
          <div className="relative rounded-3xl overflow-hidden brand-shadow">
            <img src={IMG.farm} alt="Poultry farm interior" className="w-full h-[480px] object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-brand-green text-white rounded-2xl p-5 shadow-xl hidden md:block">
            <div className="text-3xl font-extrabold">24/7</div>
            <div className="text-xs uppercase tracking-wider text-white/80">Always Open</div>
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <Badge className="bg-brand-green/10 text-brand-green border-0 mb-4">About Us</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">A trusted name for fresh poultry and quality beverages in Kalaswala.</h2>
          <p className="mt-5 text-slate-600 leading-relaxed">
            Malik Poultry Farm has proudly served families, grocery stores, restaurants, hotels, and wholesale buyers with fresh chicken and popular beverage brands. Our commitment is simple — quality products, honest prices, and reliable service, every single day.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center">✓</div>
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact"><Button className="bg-brand-green hover:bg-brand-green-2 text-white rounded-full px-6 h-11">Contact Us</Button></a>
            <a href={waLink()} target="_blank" rel="noreferrer">
              <Button variant="outline" className="rounded-full px-6 h-11 border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ---------- Brand Showcase Cards (Premium) ----------
function BrandCard({ b, index }) {
  return (
    <motion.div variants={fadeUp}>
      <a href={waLink(inquiryMessage(b.name))} target="_blank" rel="noreferrer" className="block h-full">
        <div className={`group relative h-72 rounded-3xl overflow-hidden bg-gradient-to-br ${b.bg} shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500`}>
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/10 blur-xl" />
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

          {/* Big mark / bottle silhouette */}
          <div className="absolute right-4 top-4 w-16 h-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white text-2xl font-black">
            {b.mark}
          </div>
          <div className="absolute right-8 bottom-6 opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
            <div className="w-24 h-40 rounded-t-full rounded-b-2xl bg-white/30 border border-white/40 backdrop-blur-sm relative">
              <div className="absolute inset-x-4 top-4 h-3 rounded-full bg-white/40" />
              <div className="absolute inset-x-3 bottom-4 top-16 rounded-xl bg-white/20" />
            </div>
          </div>

          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-between text-white">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/80">
                <span className="w-8 h-px bg-white/60" /> Premium Brand
              </div>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight drop-shadow-sm">{b.name}</h3>
              <p className="mt-1.5 text-sm text-white/85 max-w-[80%]">{b.tagline}</p>
            </div>
            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {b.sizes.map((s, i) => (
                  <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur">{s}</span>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-slate-900 rounded-full px-4 py-2 shadow-lg group-hover:gap-3 transition-all">
                <MessageCircle className="w-4 h-4 text-green-600" />
                Inquire on WhatsApp
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  )
}

function BrandsShowcase() {
  return (
    <section id="brands" className="py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-brand-red/10 text-brand-red border-0 mb-3">Featured Brands</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Premium beverage brands, always in stock</h2>
          <p className="mt-3 text-slate-600">We distribute the most loved cold drink, water and juice brands — retail and wholesale.</p>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {brands.map((b, i) => <BrandCard key={i} b={b} index={i} />)}
        </motion.div>
      </div>
    </section>
  )
}

// ---------- Product Card ----------
function ProductCard({ p }) {
  const waHref = waLink(inquiryMessage(p.name))
  return (
    <motion.div variants={fadeUp}>
      <Card className="overflow-hidden group border-slate-100 hover:border-brand-green/30 hover:shadow-2xl transition-all duration-300 rounded-2xl h-full flex flex-col">
        <div className="relative h-52 overflow-hidden">
          {p.img ? (
            <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${p.brand.bg} relative flex items-center justify-center`}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              <div className="relative text-center text-white px-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-3xl font-black mb-2">{p.brand.mark}</div>
                <div className="font-extrabold text-2xl drop-shadow">{p.name}</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <Badge className="absolute top-3 left-3 bg-white/90 text-brand-green border-0">Available</Badge>
        </div>
        <CardContent className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2 flex-1">{p.desc}</p>
          <div className="mt-4 flex gap-2">
            <a href={waHref} target="_blank" rel="noreferrer" className="flex-1">
              <Button className="w-full bg-brand-green hover:bg-brand-green-2 text-white rounded-full h-10 gap-2">
                <MessageCircle className="w-4 h-4" /> Inquire Now
              </Button>
            </a>
            <a href={`tel:${PHONE_DIGITS}`}>
              <Button variant="outline" className="h-10 w-10 p-0 rounded-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white" aria-label="Call">
                <Phone className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ---------- Products with Search ----------
function Products() {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const filteredPoultry = useMemo(
    () => poultryProducts.filter(p => !query || p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)),
    [query]
  )
  const filteredBeverage = useMemo(
    () => beverageProducts.filter(p => !query || p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)),
    [query]
  )
  const totalResults = filteredPoultry.length + filteredBeverage.length

  return (
    <section id="products" className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-brand-green/10 text-brand-green border-0 mb-3">Our Products</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Fresh Poultry & Cold Drinks</h2>
          <p className="mt-3 text-slate-600">Retail and wholesale — search below or scroll to explore.</p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <Input
              data-testid="product-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products… e.g. Chicken, Coca-Cola, Aquafina"
              className="h-14 pl-12 pr-12 rounded-full text-base shadow-lg border-slate-200 focus-visible:ring-brand-green"
            />
            {q && (
              <button onClick={() => setQ('')} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500" aria-label="Clear">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {query && (
            <div className="mt-3 text-center text-sm text-slate-500">
              {totalResults > 0 ? `${totalResults} result${totalResults > 1 ? 's' : ''} found` : ''}
            </div>
          )}
        </div>

        {/* No results */}
        {query && totalResults === 0 && (
          <div className="mt-14 max-w-md mx-auto text-center bg-white rounded-3xl p-10 border border-slate-100 shadow-sm" data-testid="no-products">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="mt-4 font-bold text-slate-900 text-lg">No products found.</div>
            <p className="text-sm text-slate-500 mt-1">Try a different keyword like &ldquo;chicken&rdquo;, &ldquo;cola&rdquo; or &ldquo;water&rdquo;.</p>
            <Button onClick={() => setQ('')} className="mt-4 bg-brand-green hover:bg-brand-green-2 text-white rounded-full px-5">Clear search</Button>
          </div>
        )}

        {/* Poultry */}
        {filteredPoultry.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center"><Drumstick className="w-5 h-5" /></div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900">Fresh Poultry</h3>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {filteredPoultry.map((p, i) => <ProductCard key={p.name} p={p} />)}
            </motion.div>
          </div>
        )}

        {/* Beverages */}
        {filteredBeverage.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center">🥤</div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900">Cold Drinks & Beverages</h3>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {filteredBeverage.map((p, i) => <ProductCard key={p.name} p={p} />)}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-brand-red/10 text-brand-red border-0 mb-3">Customer Reviews</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">What our customers say</h2>
          <p className="mt-3 text-slate-600">Real feedback from families and businesses across Kalaswala.</p>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="h-full rounded-2xl border-slate-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400" />)}
                  </div>
                  <p className="mt-4 text-slate-700 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold">{r.name.charAt(0)}</div>
                    <div>
                      <div className="font-semibold text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-500">Google Review</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const name = form.name.trim()
    const phone = form.phone.trim()
    const message = form.message.trim()
    if (!name) { toast.error('Please enter your name.'); return }
    if (!phone) { toast.error('Please enter your phone number.'); return }
    if (!message) { toast.error('Please enter a message.'); return }

    setLoading(true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, phone, message }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
      toast.success('Thank you! Your inquiry has been sent successfully.')
      setSuccessOpen(true)
      setForm({ name: '', phone: '', message: '' })
    } catch (err) {
      const msg = err?.name === 'AbortError'
        ? 'Request timed out. Please try again or contact us on WhatsApp.'
        : (err?.message || 'Could not send your message. Please try WhatsApp or Call.')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-brand-green text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 grid-dots" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-white/10 text-white border border-white/20 mb-3">Contact Us</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold">Get in touch — we&rsquo;re open 24 hours</h2>
          <p className="mt-3 text-white/80">Call, WhatsApp, or send us a message. We respond quickly.</p>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Info & Map */}
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={`tel:${PHONE_DIGITS}`} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition">
                <Phone className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">Phone</div>
                <div className="font-semibold">{PHONE}</div>
              </a>
              <a href={waLink()} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition">
                <MessageCircle className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">WhatsApp</div>
                <div className="font-semibold">{PHONE}</div>
              </a>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Clock className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">Business Hours</div>
                <div className="font-semibold">Open 24 Hours</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <MapPin className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">Address</div>
                <div className="font-semibold">{ADDRESS}</div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <iframe
                src={MAP_EMBED}
                width="100%"
                height="280"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Malik Poultry Farm Location"
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${PHONE_DIGITS}`} className="flex-1">
                <Button className="w-full bg-brand-red hover:bg-red-700 text-white rounded-full h-12 gap-2">
                  <Phone className="w-4 h-4" /> Call {PHONE}
                </Button>
              </a>
              <a href={waLink()} target="_blank" rel="noreferrer" className="flex-1">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-12 gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
            <h3 className="text-xl font-bold">Send us a message</h3>
            <p className="text-sm text-slate-500 mt-1">We&rsquo;ll get back to you as soon as possible.</p>
            <form onSubmit={submit} className="mt-6 space-y-4" data-testid="contact-form">
              <div>
                <label className="text-sm font-medium text-slate-700">Your Name <span className="text-brand-red">*</span></label>
                <Input required data-testid="name-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ahmed Malik" className="mt-1.5 h-11" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Phone Number <span className="text-brand-red">*</span></label>
                <Input required data-testid="phone-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+92 3XX XXXXXXX" className="mt-1.5 h-11" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Message <span className="text-brand-red">*</span></label>
                <Textarea required rows={4} data-testid="message-input" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." className="mt-1.5" />
              </div>
              <Button disabled={loading} type="submit" data-testid="submit-btn" className="w-full h-12 bg-brand-green hover:bg-brand-green-2 text-white rounded-full gap-2">
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>) : (<><Send className="w-4 h-4" /> Send Message</>)}
              </Button>
            </form>

            {/* Success overlay */}
            <AnimatePresence>
              {successOpen && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur rounded-3xl flex items-center justify-center p-6">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
                    <div className="w-16 h-16 mx-auto rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <div className="mt-4 text-lg font-bold text-slate-900">Thank you!</div>
                    <p className="text-slate-600 mt-1">Your inquiry has been sent successfully. We&rsquo;ll reach out shortly.</p>
                    <Button onClick={() => setSuccessOpen(false)} className="mt-5 bg-brand-green hover:bg-brand-green-2 text-white rounded-full px-6">Send another</Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white"><Drumstick className="w-5 h-5" /></div>
            <div>
              <div className="font-bold text-white text-lg">Malik Poultry Farm</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Fresh · Reliable · 24/7</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-md">
            Trusted supplier of fresh poultry products and popular cold drink brands in Kalaswala, Pakistan. Serving families, restaurants, hotels & wholesalers.
          </p>
          <div className="mt-5 flex gap-2">
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center transition"><Facebook className="w-4 h-4" /></a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center transition"><Instagram className="w-4 h-4" /></a>
            <a href="#contact" aria-label="Email" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center transition"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
        <div>
          <div className="font-semibold text-white mb-4">Quick Links</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#products" className="hover:text-white transition">Products</a></li>
            <li><a href="#about" className="hover:text-white transition">About</a></li>
            <li><a href="#brands" className="hover:text-white transition">Brands</a></li>
            <li><a href="#reviews" className="hover:text-white transition">Reviews</a></li>
            <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white mb-4">Contact</div>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-2"><Phone className="w-4 h-4 text-brand-red mt-0.5" /> {PHONE}</li>
            <li className="flex gap-2"><MessageCircle className="w-4 h-4 text-brand-red mt-0.5" /> WhatsApp: {PHONE}</li>
            <li className="flex gap-2"><MapPin className="w-4 h-4 text-brand-red mt-0.5" /> {ADDRESS}</li>
            <li className="flex gap-2"><Clock className="w-4 h-4 text-brand-red mt-0.5" /> Open 24 Hours</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>© 2026 Malik Poultry Farm. All Rights Reserved.</div>
          <div>Crafted with care · Serving Kalaswala & nearby areas</div>
        </div>
      </div>
    </footer>
  )
}

function FloatingActions() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {show && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl transition" aria-label="Back to top">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      <a href={`tel:${PHONE_DIGITS}`} aria-label="Call"
        className="w-14 h-14 rounded-full bg-brand-red hover:bg-red-700 text-white flex items-center justify-center shadow-xl transition">
        <Phone className="w-6 h-6" />
      </a>
      <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp"
        className="pulse-wa w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xl transition">
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  return (
    <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-brand-red origin-left z-[60]" />
  )
}

function App() {
  return (
    <main className="min-h-screen bg-white">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Features />
      <About />
      <BrandsShowcase />
      <Products />
      <Reviews />
      <ContactSection />
      <Footer />
      <FloatingActions />
    </main>
  )
}

export default App
