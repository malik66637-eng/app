'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  Phone, MapPin, Clock, MessageCircle, ArrowUp, Menu, X,
  Drumstick, Truck, Users, ShieldCheck, Sparkles, Star,
  ChevronRight, Send, Mail, Instagram, Facebook
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const PHONE = '+92 348 4113201'
const PHONE_DIGITS = '+923484113201'
const WA_LINK = `https://wa.me/923484113201?text=${encodeURIComponent("Hello Malik Poultry Farm, I'd like to inquire about your products.")}`
const MAP_EMBED = 'https://www.google.com/maps?q=6M53%2B932%20Kalaswala%20Pakistan&output=embed'
const ADDRESS = '6M53+932, Kalaswala, Pakistan'

const IMG = {
  hero: 'https://images.unsplash.com/photo-1630090374791-c9eb7bab3935?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxwb3VsdHJ5JTIwZmFybXxlbnwwfHx8fDE3ODQ3Mjk3MTB8MA&ixlib=rb-4.1.0&q=85',
  freshChicken: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxmcmVzaCUyMGNoaWNrZW58ZW58MHx8fHwxNzg0NzI5NzExfDA&ixlib=rb-4.1.0&q=85',
  liveChicken: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxwb3VsdHJ5JTIwZmFybXxlbnwwfHx8fDE3ODQ3Mjk3MTB8MA&ixlib=rb-4.1.0&q=85',
  farm: 'https://images.pexels.com/photos/19972937/pexels-photo-19972937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  colas: 'https://images.pexels.com/photos/4113660/pexels-photo-4113660.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  fridge: 'https://images.pexels.com/photos/4113653/pexels-photo-4113653.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  water: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NDQ2MzR8MHwxfHNlYXJjaHwyfHxib3R0bGVkJTIwd2F0ZXJ8ZW58MHx8fHwxNzg0NzI5NzE3fDA&ixlib=rb-4.1.0&q=85'
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const brands = [
  { name: 'Coca-Cola', color: '#F40009', short: 'CC' },
  { name: 'Sprite', color: '#00A651', short: 'SP' },
  { name: 'Fanta', color: '#F7941D', short: 'FN' },
  { name: 'Mountain Dew', color: '#2E8B2E', short: 'MD' },
  { name: 'Minute Maid', color: '#E4002B', short: 'MM' },
]

const poultryProducts = [
  { name: 'Fresh Chicken', desc: 'Cleaned, cut & packed daily — ready for your kitchen or restaurant.', img: IMG.freshChicken },
  { name: 'Live Chicken', desc: 'Healthy, farm-raised live broilers available any time, any quantity.', img: IMG.liveChicken },
  { name: 'Broiler Chicken', desc: 'Premium broiler stock for wholesalers, hotels & caterers.', img: IMG.farm },
  { name: 'Wholesale Supply', desc: 'Bulk poultry supply at competitive rates for shops and businesses.', img: IMG.freshChicken },
]

const beverageProducts = [
  { name: 'Coca-Cola', desc: 'Original taste — bottles, cans & family packs available.', img: IMG.colas },
  { name: 'Sprite / Fanta', desc: 'Refreshing lemon-lime and orange soft drinks in all sizes.', img: IMG.fridge },
  { name: 'Mountain Dew', desc: 'Bold citrus energy — cold stock available 24/7.', img: IMG.colas },
  { name: 'Minute Maid & Juices', desc: 'Fruit juices and nectars for retail and catering needs.', img: IMG.fridge },
  { name: 'Bottled Water', desc: 'Mineral & purified drinking water in multiple sizes.', img: IMG.water },
  { name: 'Energy Drinks', desc: 'Popular energy drink brands — subject to availability.', img: IMG.colas },
]

const reviews = [
  { name: 'Ayzu Kaka', text: 'Good place to visit and shopping.', stars: 5 },
  { name: 'Dilawar Malik', text: 'Good.', stars: 5 },
  { name: 'Irsa Abhameed', text: 'Excellent service.', stars: 5 },
]

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Brands', href: '#brands' },
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
      {/* Mobile menu */}
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
      {/* decorative curve */}
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
            <a href={WA_LINK} target="_blank" rel="noreferrer">
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

function BrandsStrip() {
  const row = [...brands, ...brands, ...brands]
  return (
    <section id="brands" className="py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <Badge className="bg-brand-red/10 text-brand-red border-0 mb-3">Featured Brands</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Popular beverages, always in stock</h2>
        <p className="mt-3 text-slate-600">We distribute the most loved cold drink brands across Kalaswala and nearby areas.</p>
      </div>
      <div className="mt-10 relative overflow-hidden">
        <div className="flex gap-6 animate-marquee w-max px-4">
          {row.map((b, i) => (
            <div key={i} className="shrink-0 w-56 h-28 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition flex items-center gap-4 px-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: b.color }}>
                {b.short}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{b.name}</div>
                <div className="text-xs text-slate-500">Available in bulk</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ p, onInquire }) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="overflow-hidden group border-slate-100 hover:border-brand-green/30 hover:shadow-2xl transition-all duration-300 rounded-2xl">
        <div className="relative h-52 overflow-hidden">
          <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <Badge className="absolute top-3 left-3 bg-white/90 text-brand-green border-0">Available</Badge>
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2">{p.desc}</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => onInquire(p.name)} className="flex-1 bg-brand-green hover:bg-brand-green-2 text-white rounded-full h-10">
              Inquire Now
            </Button>
            <a href={`https://wa.me/923484113201?text=${encodeURIComponent('Hi, I want to inquire about ' + p.name)}`} target="_blank" rel="noreferrer">
              <Button variant="outline" className="h-10 w-10 p-0 rounded-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Products({ onInquire }) {
  return (
    <section id="products" className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-brand-green/10 text-brand-green border-0 mb-3">Our Products</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Fresh Poultry & Cold Drinks</h2>
          <p className="mt-3 text-slate-600">Retail and wholesale — everything you need, all in one place.</p>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center"><Drumstick className="w-5 h-5" /></div>
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900">Fresh Poultry</h3>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {poultryProducts.map((p, i) => <ProductCard key={i} p={p} onInquire={onInquire} />)}
          </motion.div>
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center">🥤</div>
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900">Cold Drinks & Beverages</h3>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {beverageProducts.map((p, i) => <ProductCard key={i} p={p} onInquire={onInquire} />)}
          </motion.div>
        </div>
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

function ContactSection({ initialProduct, setInitialProduct }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast.error('Please enter your name and phone.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product: initialProduct })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success('Thanks! We will reach out shortly.')
      setForm({ name: '', phone: '', message: '' })
      setInitialProduct('')
    } catch (err) {
      toast.error(err.message || 'Something went wrong.')
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
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Clock className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">Business Hours</div>
                <div className="font-semibold">Open 24 Hours</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:col-span-2">
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
              <a href={WA_LINK} target="_blank" rel="noreferrer" className="flex-1">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-12 gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 lg:p-8 shadow-2xl">
            <h3 className="text-xl font-bold">Send us a message</h3>
            <p className="text-sm text-slate-500 mt-1">We&rsquo;ll get back to you as soon as possible.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Your Name</label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ahmed Malik" className="mt-1.5 h-11" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+92 3XX XXXXXXX" className="mt-1.5 h-11" />
              </div>
              {initialProduct && (
                <div className="flex items-center gap-2 bg-brand-green/10 text-brand-green text-sm rounded-lg px-3 py-2">
                  <span>Inquiring about:</span>
                  <span className="font-semibold">{initialProduct}</span>
                  <button type="button" onClick={() => setInitialProduct('')} className="ml-auto text-brand-green/60 hover:text-brand-green"><X className="w-4 h-4" /></button>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-slate-700">Message</label>
                <Textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." className="mt-1.5" />
              </div>
              <Button disabled={loading} type="submit" className="w-full h-12 bg-brand-green hover:bg-brand-green-2 text-white rounded-full gap-2">
                {loading ? 'Sending...' : (<><Send className="w-4 h-4" /> Send Message</>)}
              </Button>
            </form>
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
      <a href={WA_LINK} target="_blank" rel="noreferrer" aria-label="WhatsApp"
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
  const [inquiryProduct, setInquiryProduct] = useState('')
  const onInquire = (name) => {
    setInquiryProduct(name)
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <main className="min-h-screen bg-white">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Features />
      <About />
      <BrandsStrip />
      <Products onInquire={onInquire} />
      <Reviews />
      <ContactSection initialProduct={inquiryProduct} setInitialProduct={setInquiryProduct} />
      <Footer />
      <FloatingActions />
    </main>
  )
}

export default App
