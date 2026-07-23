'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import {
  Phone, MapPin, Clock, MessageCircle, ArrowUp, Menu, X,
  Drumstick, Truck, ShieldCheck, Sparkles, Star,
  ChevronRight, Send, Mail, Instagram, Facebook, Search,
  Loader2, CheckCircle2, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// -------- Contact --------
const PHONE = '+92 348 4113201'
const PHONE_DIGITS = '+923484113201'
const WA_NUMBER = '923484113201'
const ADDRESS_EN = '6M53+932, Kalaswala, Pakistan'
const ADDRESS_UR = '6M53+932، کلاسوالہ، پاکستان'
const MAP_EMBED = 'https://www.google.com/maps?q=6M53%2B932%20Kalaswala%20Pakistan&output=embed'

// Universal WhatsApp opener — works on mobile app AND desktop web
function openWhatsApp(message) {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      // Popup blocked → fall back to same-tab navigation
      window.location.href = url
    }
  } catch {
    window.location.href = url
  }
}

const inquiryMessage = (product) =>
  `Hello,\nI would like to inquire about ${product}.\nPlease share the price and availability.`

const contactFormMessage = ({ name, phone, message }) =>
  `New Inquiry — Malik Poultry Farm\n\nName:\n${name}\n\nPhone:\n${phone}\n\nMessage:\n${message}`

// -------- Translations --------
const T = {
  en: {
    dir: 'ltr',
    brand: { name: 'Malik Poultry Farm', tag: 'Fresh · Reliable · 24/7' },
    nav: { home: 'Home', about: 'About', brands: 'Brands', products: 'Products', reviews: 'Reviews', contact: 'Contact', callNow: 'Call Now', menu: 'Menu' },
    search: { placeholder: 'Search products…', clear: 'Clear', noResults: 'No products found.', suggestions: 'Suggestions', poultry: 'Poultry', beverage: 'Beverage' },
    hero: {
      badge: 'Trusted supplier in Kalaswala',
      title1: 'Fresh Poultry & Refreshing Beverages',
      title2: 'Delivered with Quality',
      subtitle: 'Serving Kalaswala and nearby areas with premium poultry products and popular beverage brands. Retail, wholesale & bulk supply — open 24 hours.',
      callNow: 'Call Now',
      viewProducts: 'View Products',
      open24: 'Open 24 Hours',
      location: 'Kalaswala, Pakistan',
    },
    features: [
      { title: 'Fresh Daily Poultry', desc: 'Cut & delivered fresh every day.' },
      { title: 'Trusted Local Supplier', desc: 'Years of service in Kalaswala.' },
      { title: 'Wholesale Available', desc: 'Bulk rates for businesses.' },
      { title: 'Open 24 Hours', desc: 'Serving you around the clock.' },
    ],
    about: {
      badge: 'About Us',
      title: 'A trusted name for fresh poultry and quality beverages in Kalaswala.',
      desc: 'Malik Poultry Farm has proudly served families, grocery stores, restaurants, hotels, and wholesale buyers with fresh chicken and popular beverage brands. Our commitment is simple — quality products, honest prices, and reliable service, every single day.',
      bullets: ['Quality Products', 'Freshness Guaranteed', 'Customer Satisfaction', 'Reliable Service', 'Local Trusted Business'],
      contactUs: 'Contact Us', whatsapp: 'WhatsApp',
      alwaysOpen: 'Always Open',
    },
    brands: {
      badge: 'Featured Brands',
      title: 'Premium beverage brands, always in stock',
      subtitle: 'We distribute the most loved cold drink, water and juice brands — retail and wholesale.',
      premium: 'Premium Brand',
      inquire: 'Inquire on WhatsApp',
    },
    products: {
      badge: 'Our Products',
      title: 'Fresh Poultry — Farm Direct',
      subtitle: 'Retail and wholesale poultry supply. Use the search bar in the top navigation to find any product instantly.',
      freshPoultry: 'Fresh Poultry',
      available: 'Available',
      inquireNow: 'Inquire Now',
      showing: 'Showing results for',
      matches: 'matches',
      match: 'match',
      clear: 'clear',
      beverageMatches: 'beverage brand(s) above',
    },
    poultryItems: [
      { key: 'fresh-chicken', name: 'Fresh Chicken', desc: 'Cleaned, cut & packed daily — ready for your kitchen or restaurant.' },
      { key: 'live-chicken', name: 'Live Chicken', desc: 'Healthy, farm-raised live broilers available any time, any quantity.' },
      { key: 'chicken-meat', name: 'Chicken Meat', desc: 'Fresh, hygienically cut chicken meat — packed and ready to cook.' },
      { key: 'farm-fresh-eggs', name: 'Farm Fresh Eggs', desc: 'Farm-fresh brown & white eggs delivered in trays and cartons.' },
      { key: 'wholesale-poultry', name: 'Wholesale Poultry', desc: 'Bulk poultry supply in crates — best rates for shops & distributors.' },
    ],
    beverageItems: [
      { key: 'coca-cola', name: 'Coca-Cola', desc: 'Original taste — bottles, cans & family packs available.' },
      { key: 'pepsi', name: 'Pepsi', desc: 'The bold cola — 1.5L, 1L, 500ml and cans always in stock.' },
      { key: 'sprite', name: 'Sprite', desc: 'Refreshing lemon-lime soda — chilled and in-stock 24/7.' },
      { key: '7up', name: '7Up', desc: 'Crisp lemon-lime refreshment in bottles and cans.' },
      { key: 'fanta', name: 'Fanta', desc: 'Vibrant orange fizz — bottles and cans in all sizes.' },
      { key: 'mountain-dew', name: 'Mountain Dew', desc: 'Bold citrus energy — cold stock available round the clock.' },
      { key: 'minute-maid', name: 'Minute Maid Juices', desc: 'Real fruit juices — perfect for retail, cafes and catering.' },
      { key: 'nestle-pure-life', name: 'Nestlé Pure Life', desc: 'Trusted mineral water — 1.5L and 500ml bottles.' },
      { key: 'aquafina', name: 'Aquafina', desc: 'Pure drinking water — perfect for homes, offices & events.' },
      { key: 'rani-juice', name: 'Rani Juice', desc: 'Real fruit pieces — multiple flavors in cans.' },
    ],
    brandTagline: {
      'coca-cola': 'Original Taste. Timeless Refresh.',
      'pepsi': 'The Bold, The Cold, The Best.',
      'sprite': 'Lemon-Lime. Crisp & Clean.',
      '7up': 'The Uncola. Fresh & Fizzy.',
      'mountain-dew': 'Do The Dew. Bold Citrus Kick.',
      'nestle-pure-life': 'Pure. Trusted. Refreshing.',
      'aquafina': 'Pure Water, Perfect Every Time.',
      'rani-juice': 'Real Fruit Pieces. Real Taste.',
    },
    reviews: { badge: 'Customer Reviews', title: 'What our customers say', subtitle: 'Real feedback from families and businesses across Kalaswala.', googleReview: 'Google Review' },
    contact: {
      badge: 'Contact Us',
      title: 'Get in touch — we\u2019re open 24 hours',
      subtitle: 'Call, WhatsApp, or send us a message. We respond quickly.',
      phone: 'Phone', whatsapp: 'WhatsApp', hours: 'Business Hours', address: 'Address',
      open24: 'Open 24 Hours',
      callBtn: 'Call',
      sendMsg: 'Send us a message',
      sendMsgSub: 'We\u2019ll open WhatsApp with your details pre-filled. Just press Send.',
      yourName: 'Your Name', phoneNumber: 'Phone Number', message: 'Message',
      placeholderName: 'e.g. Ahmed Malik', placeholderPhone: '+92 3XX XXXXXXX', placeholderMsg: 'Tell us how we can help...',
      sending: 'Opening WhatsApp...',
      sendButton: 'Send via WhatsApp',
      thankYou: 'Thank you!',
      thankMsg: 'Your inquiry has been sent successfully. We\u2019ll reach out shortly.',
      sendAnother: 'Send another',
      errName: 'Please enter your name.',
      errPhone: 'Please enter your phone number.',
      errMsg: 'Please enter a message.',
      required: '*',
    },
    footer: {
      tagline: 'Trusted supplier of fresh poultry products and popular cold drink brands in Kalaswala, Pakistan. Serving families, restaurants, hotels & wholesalers.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      copyright: '© 2026 Malik Poultry Farm. All Rights Reserved.',
      crafted: 'Crafted with care · Serving Kalaswala & nearby areas',
      whatsappLabel: 'WhatsApp',
    },
    langBtn: { en: 'English', ur: 'اردو', switchTo: 'Switch language' },
  },

  ur: {
    dir: 'rtl',
    brand: { name: 'ملک پولٹری فارم', tag: 'تازہ · قابل اعتماد · 24/7' },
    nav: { home: 'ہوم', about: 'ہمارے بارے میں', brands: 'برانڈز', products: 'مصنوعات', reviews: 'تبصرے', contact: 'رابطہ', callNow: 'ابھی کال کریں', menu: 'مینو' },
    search: { placeholder: 'مصنوعات تلاش کریں…', clear: 'صاف کریں', noResults: 'کوئی مصنوعات نہیں ملیں۔', suggestions: 'تجاویز', poultry: 'پولٹری', beverage: 'مشروب' },
    hero: {
      badge: 'کلاسوالہ کا قابل اعتماد سپلائر',
      title1: 'تازہ پولٹری اور تازگی بھرے مشروبات',
      title2: 'اعلیٰ معیار کے ساتھ',
      subtitle: 'کلاسوالہ اور قریبی علاقوں میں پریمیم پولٹری مصنوعات اور مقبول مشروبات کے برانڈز کی خدمات۔ ریٹیل، ہول سیل اور بلک سپلائی — 24 گھنٹے کھلا۔',
      callNow: 'ابھی کال کریں',
      viewProducts: 'مصنوعات دیکھیں',
      open24: '24 گھنٹے کھلا',
      location: 'کلاسوالہ، پاکستان',
    },
    features: [
      { title: 'روزانہ تازہ پولٹری', desc: 'ہر روز تازہ کاٹ کر تیار۔' },
      { title: 'قابل اعتماد مقامی سپلائر', desc: 'کلاسوالہ میں سالوں کی خدمات۔' },
      { title: 'ہول سیل دستیاب', desc: 'کاروبار کے لیے بلک ریٹ۔' },
      { title: '24 گھنٹے کھلا', desc: 'ہر وقت آپ کی خدمت میں۔' },
    ],
    about: {
      badge: 'ہمارے بارے میں',
      title: 'کلاسوالہ میں تازہ پولٹری اور اعلیٰ مشروبات کا قابل اعتماد نام۔',
      desc: 'ملک پولٹری فارم فخر سے خاندانوں، دکانوں، ریسٹورنٹس، ہوٹلز اور تھوک خریداروں کو تازہ چکن اور مقبول مشروبات فراہم کرتا ہے۔ ہمارا وعدہ سادہ ہے — معیاری مصنوعات، مناسب قیمتیں اور قابل اعتماد خدمت، ہر روز۔',
      bullets: ['معیاری مصنوعات', 'تازگی کی ضمانت', 'گاہک کی اطمینان', 'قابل اعتماد خدمت', 'مقامی معتبر کاروبار'],
      contactUs: 'رابطہ کریں', whatsapp: 'واٹس ایپ',
      alwaysOpen: 'ہمیشہ کھلا',
    },
    brands: {
      badge: 'نمایاں برانڈز',
      title: 'پریمیم مشروبات کے برانڈز، ہر وقت دستیاب',
      subtitle: 'ہم سب سے پسندیدہ کولڈ ڈرنک، پانی اور جوس کے برانڈز فروخت کرتے ہیں — ریٹیل اور ہول سیل۔',
      premium: 'پریمیم برانڈ',
      inquire: 'واٹس ایپ پر پوچھیں',
    },
    products: {
      badge: 'ہماری مصنوعات',
      title: 'تازہ پولٹری — فارم سے براہ راست',
      subtitle: 'ریٹیل اور ہول سیل پولٹری سپلائی۔ اوپر نیویگیشن میں تلاش بار استعمال کریں۔',
      freshPoultry: 'تازہ پولٹری',
      available: 'دستیاب',
      inquireNow: 'ابھی پوچھیں',
      showing: 'نتائج برائے',
      matches: 'نتائج',
      match: 'نتیجہ',
      clear: 'صاف کریں',
      beverageMatches: 'برانڈ اوپر',
    },
    poultryItems: [
      { key: 'fresh-chicken', name: 'تازہ چکن', desc: 'روزانہ صاف کر کے پیک شدہ — کچن یا ریسٹورنٹ کے لیے تیار۔' },
      { key: 'live-chicken', name: 'زندہ چکن', desc: 'صحت مند فارم کے پرورش کردہ برائلر ہر وقت، ہر مقدار میں۔' },
      { key: 'chicken-meat', name: 'چکن گوشت', desc: 'تازہ، حفظان صحت کے مطابق کاٹا ہوا چکن گوشت — پکانے کے لیے تیار۔' },
      { key: 'farm-fresh-eggs', name: 'فارم کے تازہ انڈے', desc: 'ٹریوں اور کارٹنز میں فارم کے تازہ بھورے اور سفید انڈے۔' },
      { key: 'wholesale-poultry', name: 'ہول سیل پولٹری', desc: 'کرٹوں میں بلک پولٹری سپلائی — دکانوں اور تقسیم کاروں کے لیے بہترین ریٹ۔' },
    ],
    beverageItems: [
      { key: 'coca-cola', name: 'کوکا کولا', desc: 'اصل ذائقہ — بوتلیں، ڈبے اور فیملی پیک دستیاب۔' },
      { key: 'pepsi', name: 'پیپسی', desc: 'بولڈ کولا — 1.5 لیٹر، 1 لیٹر، 500ml اور ڈبے ہر وقت دستیاب۔' },
      { key: 'sprite', name: 'سپرائٹ', desc: 'تازگی بھرا لیمن-لائم سوڈا — ٹھنڈا اور 24/7 دستیاب۔' },
      { key: '7up', name: '7 اپ', desc: 'کرسپ لیمن-لائم تازگی بوتلوں اور ڈبوں میں۔' },
      { key: 'fanta', name: 'فینٹا', desc: 'شوخ اورنج فز — تمام سائز کی بوتلوں اور ڈبوں میں۔' },
      { key: 'mountain-dew', name: 'ماؤنٹین ڈیو', desc: 'بولڈ سٹرس انرجی — 24 گھنٹے ٹھنڈا اسٹاک دستیاب۔' },
      { key: 'minute-maid', name: 'منٹ میڈ جوسز', desc: 'اصل پھلوں کے جوس — ریٹیل، کیفے اور کیٹرنگ کے لیے بہترین۔' },
      { key: 'nestle-pure-life', name: 'نیسلے پیور لائف', desc: 'قابل اعتماد منرل واٹر — 1.5 لیٹر اور 500ml بوتلیں۔' },
      { key: 'aquafina', name: 'ایکوافینا', desc: 'خالص پینے کا پانی — گھروں، دفاتر اور تقریبات کے لیے بہترین۔' },
      { key: 'rani-juice', name: 'رانی جوس', desc: 'حقیقی پھلوں کے ٹکڑے — کئی ذائقے ڈبوں میں۔' },
    ],
    brandTagline: {
      'coca-cola': 'اصل ذائقہ۔ لازوال تازگی۔',
      'pepsi': 'بولڈ، ٹھنڈا، بہترین۔',
      'sprite': 'لیمن-لائم۔ کرسپ اور صاف۔',
      '7up': 'دی انکولا۔ تازہ اور فزی۔',
      'mountain-dew': 'ڈو دی ڈیو۔ بولڈ سٹرس کک۔',
      'nestle-pure-life': 'خالص۔ قابل اعتماد۔ تازگی بخش۔',
      'aquafina': 'خالص پانی، ہر بار مکمل۔',
      'rani-juice': 'حقیقی پھلوں کے ٹکڑے۔ اصل ذائقہ۔',
    },
    reviews: { badge: 'گاہکوں کے تبصرے', title: 'ہمارے گاہک کیا کہتے ہیں', subtitle: 'کلاسوالہ کے خاندانوں اور کاروباروں سے حقیقی رائے۔', googleReview: 'گوگل ریویو' },
    contact: {
      badge: 'رابطہ کریں',
      title: 'ہم سے رابطہ کریں — ہم 24 گھنٹے کھلے ہیں',
      subtitle: 'کال، واٹس ایپ یا پیغام بھیجیں۔ ہم جلد جواب دیتے ہیں۔',
      phone: 'فون', whatsapp: 'واٹس ایپ', hours: 'کاروباری اوقات', address: 'پتہ',
      open24: '24 گھنٹے کھلا',
      callBtn: 'کال کریں',
      sendMsg: 'ہمیں پیغام بھیجیں',
      sendMsgSub: 'ہم آپ کی تفصیلات کے ساتھ واٹس ایپ کھول دیں گے۔ بس Send دبائیں۔',
      yourName: 'آپ کا نام', phoneNumber: 'فون نمبر', message: 'پیغام',
      placeholderName: 'مثلاً احمد ملک', placeholderPhone: '+92 3XX XXXXXXX', placeholderMsg: 'ہم آپ کی کیسے مدد کر سکتے ہیں...',
      sending: 'واٹس ایپ کھول رہے ہیں...',
      sendButton: 'واٹس ایپ پر بھیجیں',
      thankYou: 'شکریہ!',
      thankMsg: 'آپ کی درخواست کامیابی سے بھیج دی گئی ہے۔ ہم جلد رابطہ کریں گے۔',
      sendAnother: 'دوبارہ بھیجیں',
      errName: 'براہ کرم اپنا نام درج کریں۔',
      errPhone: 'براہ کرم اپنا فون نمبر درج کریں۔',
      errMsg: 'براہ کرم پیغام درج کریں۔',
      required: '*',
    },
    footer: {
      tagline: 'کلاسوالہ، پاکستان میں تازہ پولٹری مصنوعات اور مقبول کولڈ ڈرنک برانڈز کا قابل اعتماد سپلائر۔ خاندانوں، ریسٹورنٹس، ہوٹلز اور ہول سیلرز کی خدمت میں۔',
      quickLinks: 'فوری لنکس',
      contact: 'رابطہ',
      copyright: '© 2026 ملک پولٹری فارم۔ جملہ حقوق محفوظ ہیں۔',
      crafted: 'محبت سے بنایا گیا · کلاسوالہ اور قریبی علاقوں کی خدمت میں',
      whatsappLabel: 'واٹس ایپ',
    },
    langBtn: { en: 'English', ur: 'اردو', switchTo: 'زبان تبدیل کریں' },
  }
}

// -------- Language Context --------
const LangContext = createContext({ lang: 'en', setLang: () => {}, t: T.en })

function useLang() { return useContext(LangContext) }

// -------- Data --------
const brandsData = [
  { key: 'coca-cola', img: '/brands/coca-cola.png', sizes: ['1.5L', '1L', '500ml', '330ml Can', 'Glass'], bg: 'from-red-600 via-red-700 to-red-900' },
  { key: 'pepsi', img: '/brands/pepsi.png', sizes: ['1.5L', '1L', '500ml', 'Can'], bg: 'from-blue-600 via-blue-800 to-slate-900' },
  { key: 'sprite', img: '/brands/sprite.png', sizes: ['1.5L', '1L', '500ml', 'Can'], bg: 'from-emerald-500 via-green-600 to-green-900' },
  { key: '7up', img: '/brands/7up.png', sizes: ['1.5L', '1L', '500ml', 'Can'], bg: 'from-lime-500 via-green-600 to-emerald-800' },
  { key: 'mountain-dew', img: '/brands/mountain-dew.png', sizes: ['1.5L', '1L', '500ml', 'Can'], bg: 'from-yellow-400 via-lime-500 to-green-800' },
  { key: 'nestle-pure-life', img: '/brands/nestle-pure-life.png', sizes: ['1.5L', '500ml'], bg: 'from-sky-400 via-sky-600 to-blue-900' },
  { key: 'aquafina', img: '/brands/aquafina.png', sizes: ['1.5L', '500ml'], bg: 'from-cyan-400 via-cyan-600 to-blue-800' },
  { key: 'rani-juice', img: '/brands/rani-juice.png', sizes: ['Can'], bg: 'from-orange-500 via-red-500 to-rose-700' },
]

const poultryImgs = {
  'fresh-chicken': 'https://images.pexels.com/photos/8251004/pexels-photo-8251004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'live-chicken': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=940&q=80',
  'chicken-meat': 'https://images.pexels.com/photos/6107721/pexels-photo-6107721.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'farm-fresh-eggs': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxlZ2dzJTIwdHJheXxlbnwwfHx8fDE3ODI1NDgzMzJ8MA&ixlib=rb-4.1.0&q=85',
  'wholesale-poultry': 'https://images.pexels.com/photos/16831301/pexels-photo-16831301.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
}

const beverageImgs = {
  'coca-cola': '/brands/coca-cola.png',
  'pepsi': '/brands/pepsi.png',
  'sprite': '/brands/sprite.png',
  '7up': '/brands/7up.png',
  'fanta': '/brands/fanta.png',
  'mountain-dew': '/brands/mountain-dew.png',
  'minute-maid': '/brands/minute-maid.png',
  'nestle-pure-life': '/brands/nestle-pure-life.png',
  'aquafina': '/brands/aquafina.png',
  'rani-juice': '/brands/rani-juice.png',
}

const reviews = [
  { name: 'Ayzu Kaka', text: 'Good place to visit and shopping.', stars: 5 },
  { name: 'Dilawar Malik', text: 'Good.', stars: 5 },
  { name: 'Irsa Abhameed', text: 'Excellent service.', stars: 5 },
]

const HERO_IMG = 'https://images.unsplash.com/photo-1630090374791-c9eb7bab3935?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxwb3VsdHJ5JTIwZmFybXxlbnwwfHx8fDE3ODQ3Mjk3MTB8MA&ixlib=rb-4.1.0&q=85'
const FARM_IMG = 'https://images.pexels.com/photos/19972937/pexels-photo-19972937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'

// -------- Highlight helper --------
function scrollAndHighlight(elementId, setHighlightId) {
  const el = document.getElementById(elementId)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setHighlightId(elementId)
  window.setTimeout(() => setHighlightId(null), 3500)
}

// -------- Search Box with Suggestions --------
function SearchBox({ variant = 'nav', scrolled = false, onNavigate }) {
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  // build search index
  const index = useMemo(() => {
    const poultry = t.poultryItems.map(it => ({
      key: it.key,
      name: it.name,
      category: t.search.poultry,
      elementId: `product-${it.key}`,
      accent: '#dc2626',
    }))
    const beverages = t.beverageItems.map(it => ({
      key: it.key,
      name: it.name,
      category: t.search.beverage,
      // If it has a brand entry, target the brand card; else target product card
      elementId: brandsData.find(b => b.key === it.key) ? `brand-${it.key}` : `product-${it.key}`,
      accent: '#0f3d2e',
    }))
    return [...poultry, ...beverages]
  }, [t])

  const query = q.trim().toLowerCase()
  const suggestions = useMemo(() => {
    if (!query) return []
    return index.filter(x => x.name.toLowerCase().includes(query) || x.key.toLowerCase().includes(query))
  }, [query, index])

  useEffect(() => { setActiveIdx(-1) }, [query])

  // Click outside to close
  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const pick = (item) => {
    setOpen(false)
    setQ('')
    inputRef.current?.blur()
    onNavigate?.(item.elementId)
  }

  const onKey = (e) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Enter' && suggestions.length > 0) {
        e.preventDefault()
        pick(suggestions[0])
      }
      return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); pick(suggestions[activeIdx >= 0 ? activeIdx : 0]) }
    else if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
  }

  const isNav = variant === 'nav'
  const inputBg = scrolled
    ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:ring-brand-green'
    : 'bg-white/15 border-white/25 text-white placeholder:text-white/70 backdrop-blur focus-visible:ring-white/40'

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className={`absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${scrolled ? 'text-slate-400' : 'text-white/70'}`} />
        <Input
          ref={inputRef}
          data-testid="product-search"
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
          onKeyDown={onKey}
          placeholder={t.search.placeholder}
          className={`h-10 ltr:pl-10 ltr:pr-9 rtl:pr-10 rtl:pl-9 rounded-full text-sm transition-all ${isNav ? inputBg : 'bg-white border-slate-200 shadow'}`}
        />
        {q && (
          <button
            onClick={() => { setQ(''); inputRef.current?.focus() }}
            className={`absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center ${scrolled ? 'text-slate-500 hover:bg-slate-200' : 'text-white/80 hover:bg-white/20'}`}
            aria-label={t.search.clear}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && query && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50" data-testid="search-suggestions">
          <div className="max-h-80 overflow-y-auto">
            {suggestions.length === 0 ? (
              <div className="p-6 text-center" data-testid="no-search-results">
                <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Search className="w-5 h-5" />
                </div>
                <div className="font-semibold text-slate-900">{t.search.noResults}</div>
              </div>
            ) : (
              <>
                <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{t.search.suggestions}</div>
                <ul>
                  {suggestions.map((s, i) => (
                    <li key={s.key}>
                      <button
                        data-testid={`suggestion-${s.key}`}
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => pick(s)}
                        className={`w-full text-start px-4 py-2.5 flex items-center gap-3 transition ${i === activeIdx ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.accent }}>
                          {s.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 truncate">{s.name}</div>
                          <div className="text-xs text-slate-500">{s.category}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// -------- Language Switcher --------
function LangSwitcher({ scrolled = false, compact = false }) {
  const { lang, setLang, t } = useLang()
  return (
    <div className={`inline-flex items-center rounded-full border ${scrolled ? 'border-slate-200 bg-slate-100' : 'border-white/25 bg-white/10 backdrop-blur'} p-0.5`}>
      <button
        data-testid="lang-en"
        onClick={() => setLang('en')}
        className={`px-3 h-8 rounded-full text-xs font-semibold flex items-center gap-1 transition ${lang === 'en' ? 'bg-brand-red text-white shadow' : (scrolled ? 'text-slate-700 hover:text-slate-900' : 'text-white/90 hover:text-white')}`}
        aria-label={t.langBtn.switchTo}
      >
        <span aria-hidden>🇬🇧</span>{!compact && <span>EN</span>}
      </button>
      <button
        data-testid="lang-ur"
        onClick={() => setLang('ur')}
        className={`px-3 h-8 rounded-full text-xs font-semibold flex items-center gap-1 transition ${lang === 'ur' ? 'bg-brand-red text-white shadow' : (scrolled ? 'text-slate-700 hover:text-slate-900' : 'text-white/90 hover:text-white')}`}
        aria-label={t.langBtn.switchTo}
      >
        <span aria-hidden>🇵🇰</span>{!compact && <span>UR</span>}
      </button>
    </div>
  )
}

// -------- Navbar --------
function Navbar({ onNavigate }) {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.brands, href: '#brands' },
    { label: t.nav.products, href: '#products' },
    { label: t.nav.reviews, href: '#reviews' },
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-md">
              <Drumstick className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className={`font-bold text-base md:text-lg ${scrolled ? 'text-brand-green' : 'text-white'}`}>{t.brand.name}</div>
              <div className={`text-[11px] uppercase tracking-wider hidden sm:block ${scrolled ? 'text-slate-500' : 'text-white/80'}`}>{t.brand.tag}</div>
            </div>
          </a>

          <nav className="hidden xl:flex items-center gap-5 shrink-0">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className={`text-sm font-medium transition hover:text-brand-red ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>{l.label}</a>
            ))}
          </nav>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-auto xl:ml-auto xl:mr-0">
            <SearchBox variant="nav" scrolled={scrolled} onNavigate={onNavigate} />
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <LangSwitcher scrolled={scrolled} />
            <a href={`tel:${PHONE_DIGITS}`} className="hidden lg:inline-flex">
              <Button className="bg-brand-red hover:bg-red-700 text-white rounded-full px-4 gap-2 h-10">
                <Phone className="w-4 h-4" /> {t.nav.callNow}
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LangSwitcher scrolled={scrolled} compact />
            <button onClick={() => setMobileSearch(!mobileSearch)} className={`p-2 rounded-md ${scrolled ? 'text-slate-800' : 'text-white'}`} aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setOpen(!open)} className={`p-2 rounded-md ${scrolled ? 'text-slate-800' : 'text-white'}`} aria-label={t.nav.menu}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileSearch && (
          <div className="md:hidden pb-3">
            <SearchBox variant="mobile" scrolled={true} onNavigate={(id) => { setMobileSearch(false); onNavigate(id) }} />
          </div>
        )}
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">{l.label}</a>
            ))}
            <a href={`tel:${PHONE_DIGITS}`} className="block">
              <Button className="w-full mt-2 bg-brand-red hover:bg-red-700 text-white gap-2">
                <Phone className="w-4 h-4" /> {t.nav.callNow} {PHONE}
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

// -------- Hero --------
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

function Hero() {
  const { t } = useLang()
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Modern poultry farm" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl">
          <Badge className="bg-white/15 text-white border border-white/20 backdrop-blur px-3 py-1 mb-5 hover:bg-white/20">
            <Sparkles className="w-3.5 h-3.5 mx-1.5" /> {t.hero.badge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
            {t.hero.title1}<br />
            <span className="text-brand-red">{t.hero.title2}</span>
          </h1>
          <p className="mt-6 text-lg text-white/90 max-w-2xl leading-relaxed">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`tel:${PHONE_DIGITS}`}>
              <Button size="lg" className="bg-brand-red hover:bg-red-700 text-white rounded-full px-7 gap-2 h-12 text-base">
                <Phone className="w-4 h-4" /> {t.hero.callNow}
              </Button>
            </a>
            <a href="#products">
              <Button size="lg" variant="outline" className="rounded-full px-7 gap-2 h-12 text-base bg-white/10 border-white/40 text-white hover:bg-white hover:text-brand-green backdrop-blur">
                {t.hero.viewProducts} <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-white/85 text-sm">
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-red" /> {t.hero.open24}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-red" /> {t.hero.location}</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-red" /> {PHONE}</div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-white/95" />
    </section>
  )
}

function Features() {
  const { t } = useLang()
  const icons = [Drumstick, ShieldCheck, Truck, Clock]
  return (
    <section className="relative -mt-16 z-20 container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 bg-white rounded-3xl p-4 lg:p-6 brand-shadow border border-slate-100">
        {t.features.map((it, i) => {
          const Icon = icons[i]
          return (
            <div key={i} className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl hover:bg-slate-50 transition">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{it.title}</div>
                <div className="text-sm text-slate-500 mt-0.5">{it.desc}</div>
              </div>
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}

function About() {
  const { t } = useLang()
  return (
    <section id="about" className="py-20 lg:py-28 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="relative">
          <div className="absolute -top-6 -left-6 w-40 h-40 grid-dots rounded-2xl hidden md:block" />
          <div className="relative rounded-3xl overflow-hidden brand-shadow">
            <img src={FARM_IMG} alt="Poultry farm" className="w-full h-[480px] object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-brand-green text-white rounded-2xl p-5 shadow-xl hidden md:block">
            <div className="text-3xl font-extrabold">24/7</div>
            <div className="text-xs uppercase tracking-wider text-white/80">{t.about.alwaysOpen}</div>
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <Badge className="bg-brand-green/10 text-brand-green border-0 mb-4">{t.about.badge}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">{t.about.title}</h2>
          <p className="mt-5 text-slate-600 leading-relaxed">{t.about.desc}</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {t.about.bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center">✓</div>
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact"><Button className="bg-brand-green hover:bg-brand-green-2 text-white rounded-full px-6 h-11">{t.about.contactUs}</Button></a>
            <Button onClick={() => openWhatsApp("Hello Malik Poultry Farm, I'd like to inquire about your products.")} variant="outline" className="rounded-full px-6 h-11 border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
              <MessageCircle className="w-4 h-4 mr-2" /> {t.about.whatsapp}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// -------- Brand Card --------
function BrandCard({ b, highlightId }) {
  const { t } = useLang()
  const item = t.beverageItems.find(x => x.key === b.key)
  const name = item?.name || b.key
  const tagline = t.brandTagline[b.key] || ''
  const isHighlighted = highlightId === `brand-${b.key}`
  return (
    <motion.div variants={fadeUp} id={`brand-${b.key}`} className={`scroll-mt-28 ${isHighlighted ? 'highlight-target' : ''}`} data-testid={`brand-card-${b.key}`}>
      <button onClick={() => openWhatsApp(inquiryMessage(name))} className="block h-full w-full text-start">
        <div className={`group relative rounded-3xl overflow-hidden bg-gradient-to-br ${b.bg} shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 h-full`}>
          <div className="relative aspect-square overflow-hidden bg-white/5">
            <img src={b.img} alt={`${name} products`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
            <div className="absolute top-3 ltr:left-3 rtl:right-3 bg-white/95 text-slate-900 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow">{t.brands.premium}</div>
          </div>
          <div className="p-5 text-white">
            <h3 className="text-2xl font-extrabold leading-tight drop-shadow">{name}</h3>
            <p className="mt-1 text-sm text-white/85">{tagline}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {b.sizes.map((s, i) => (
                <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur">{s}</span>
              ))}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold bg-white text-slate-900 rounded-full px-4 py-2 shadow-lg group-hover:gap-3 transition-all">
              <MessageCircle className="w-4 h-4 text-green-600" />
              {t.brands.inquire}
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

function BrandsShowcase({ highlightId }) {
  const { t } = useLang()
  return (
    <section id="brands" className="py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-brand-red/10 text-brand-red border-0 mb-3">{t.brands.badge}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{t.brands.title}</h2>
          <p className="mt-3 text-slate-600">{t.brands.subtitle}</p>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {brandsData.map((b) => <BrandCard key={b.key} b={b} highlightId={highlightId} />)}
        </motion.div>
      </div>
    </section>
  )
}

// -------- Product Card --------
function ProductCard({ p, highlightId }) {
  const { t } = useLang()
  const isHighlighted = highlightId === `product-${p.key}`
  return (
    <motion.div variants={fadeUp} id={`product-${p.key}`} className={`scroll-mt-28 ${isHighlighted ? 'highlight-target' : ''}`} data-testid={`product-card-${p.key}`}>
      <Card className="overflow-hidden group border-slate-100 hover:border-brand-green/30 hover:shadow-2xl transition-all duration-300 rounded-2xl h-full flex flex-col">
        <div className="relative h-52 overflow-hidden">
          <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <Badge className="absolute top-3 ltr:left-3 rtl:right-3 bg-white/90 text-brand-green border-0">{t.products.available}</Badge>
        </div>
        <CardContent className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2 flex-1">{p.desc}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => openWhatsApp(inquiryMessage(p.name))} className="flex-1">
              <Button className="w-full bg-brand-green hover:bg-brand-green-2 text-white rounded-full h-10 gap-2">
                <MessageCircle className="w-4 h-4" /> {t.products.inquireNow}
              </Button>
            </button>
            <a href={`tel:${PHONE_DIGITS}`}>
              <Button variant="outline" className="h-10 w-10 p-0 rounded-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white" aria-label={t.contact.callBtn}>
                <Phone className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Products({ highlightId }) {
  const { t } = useLang()
  const items = t.poultryItems.map(it => ({ ...it, img: poultryImgs[it.key] }))
  return (
    <section id="products" className="py-20 lg:py-28 bg-slate-50 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-brand-green/10 text-brand-green border-0 mb-3">{t.products.badge}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{t.products.title}</h2>
          <p className="mt-3 text-slate-600">{t.products.subtitle}</p>
        </div>
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center"><Drumstick className="w-5 h-5" /></div>
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900">{t.products.freshPoultry}</h3>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {items.map((p) => <ProductCard key={p.key} p={p} highlightId={highlightId} />)}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const { t } = useLang()
  return (
    <section id="reviews" className="py-20 lg:py-28 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-brand-red/10 text-brand-red border-0 mb-3">{t.reviews.badge}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{t.reviews.title}</h2>
          <p className="mt-3 text-slate-600">{t.reviews.subtitle}</p>
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
                      <div className="text-xs text-slate-500">{t.reviews.googleReview}</div>
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
  const { t, lang } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    const phone = form.phone.trim()
    const message = form.message.trim()
    if (!name) { toast.error(t.contact.errName); return }
    if (!phone) { toast.error(t.contact.errPhone); return }
    if (!message) { toast.error(t.contact.errMsg); return }
    setLoading(true)
    try {
      openWhatsApp(contactFormMessage({ name, phone, message }))
      toast.success(t.contact.thankMsg)
      setSuccessOpen(true)
      setForm({ name: '', phone: '', message: '' })
    } catch (err) {
      toast.error(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const address = lang === 'ur' ? ADDRESS_UR : ADDRESS_EN

  return (
    <section id="contact" className="py-20 lg:py-28 bg-brand-green text-white relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 opacity-10 grid-dots" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-white/10 text-white border border-white/20 mb-3">{t.contact.badge}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold">{t.contact.title}</h2>
          <p className="mt-3 text-white/80">{t.contact.subtitle}</p>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={`tel:${PHONE_DIGITS}`} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition">
                <Phone className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">{t.contact.phone}</div>
                <div className="font-semibold">{PHONE}</div>
              </a>
              <button onClick={() => openWhatsApp("Hello Malik Poultry Farm, I'd like to inquire.")} className="text-start bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition">
                <MessageCircle className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">{t.contact.whatsapp}</div>
                <div className="font-semibold">{PHONE}</div>
              </button>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Clock className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">{t.contact.hours}</div>
                <div className="font-semibold">{t.contact.open24}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <MapPin className="w-6 h-6 text-brand-red" />
                <div className="mt-3 text-xs uppercase tracking-wider text-white/60">{t.contact.address}</div>
                <div className="font-semibold">{address}</div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <iframe src={MAP_EMBED} width="100%" height="280" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Malik Poultry Farm Location" className="w-full" />
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${PHONE_DIGITS}`} className="flex-1">
                <Button className="w-full bg-brand-red hover:bg-red-700 text-white rounded-full h-12 gap-2">
                  <Phone className="w-4 h-4" /> {t.contact.callBtn} {PHONE}
                </Button>
              </a>
              <button onClick={() => openWhatsApp("Hello Malik Poultry Farm, I'd like to inquire about your products.")} className="flex-1">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-12 gap-2">
                  <MessageCircle className="w-4 h-4" /> {t.contact.whatsapp}
                </Button>
              </button>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
            <h3 className="text-xl font-bold">{t.contact.sendMsg}</h3>
            <p className="text-sm text-slate-500 mt-1">{t.contact.sendMsgSub}</p>
            <form onSubmit={submit} className="mt-6 space-y-4" data-testid="contact-form">
              <div>
                <label className="text-sm font-medium text-slate-700">{t.contact.yourName} <span className="text-brand-red">{t.contact.required}</span></label>
                <Input required data-testid="name-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t.contact.placeholderName} className="mt-1.5 h-11" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">{t.contact.phoneNumber} <span className="text-brand-red">{t.contact.required}</span></label>
                <Input required data-testid="phone-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder={t.contact.placeholderPhone} className="mt-1.5 h-11" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">{t.contact.message} <span className="text-brand-red">{t.contact.required}</span></label>
                <Textarea required rows={4} data-testid="message-input" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={t.contact.placeholderMsg} className="mt-1.5" />
              </div>
              <Button disabled={loading} type="submit" data-testid="submit-btn" className="w-full h-12 bg-brand-green hover:bg-brand-green-2 text-white rounded-full gap-2">
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> {t.contact.sending}</>) : (<><MessageCircle className="w-4 h-4" /> {t.contact.sendButton}</>)}
              </Button>
            </form>

            <AnimatePresence>
              {successOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur rounded-3xl flex items-center justify-center p-6">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
                    <div className="w-16 h-16 mx-auto rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <div className="mt-4 text-lg font-bold text-slate-900">{t.contact.thankYou}</div>
                    <p className="text-slate-600 mt-1">{t.contact.thankMsg}</p>
                    <Button onClick={() => setSuccessOpen(false)} className="mt-5 bg-brand-green hover:bg-brand-green-2 text-white rounded-full px-6">{t.contact.sendAnother}</Button>
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
  const { t, lang } = useLang()
  const address = lang === 'ur' ? ADDRESS_UR : ADDRESS_EN
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white"><Drumstick className="w-5 h-5" /></div>
            <div>
              <div className="font-bold text-white text-lg">{t.brand.name}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">{t.brand.tag}</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-md">{t.footer.tagline}</p>
          <div className="mt-5 flex gap-2">
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center transition"><Facebook className="w-4 h-4" /></a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center transition"><Instagram className="w-4 h-4" /></a>
            <a href="#contact" aria-label="Email" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center transition"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
        <div>
          <div className="font-semibold text-white mb-4">{t.footer.quickLinks}</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#products" className="hover:text-white transition">{t.nav.products}</a></li>
            <li><a href="#about" className="hover:text-white transition">{t.nav.about}</a></li>
            <li><a href="#brands" className="hover:text-white transition">{t.nav.brands}</a></li>
            <li><a href="#reviews" className="hover:text-white transition">{t.nav.reviews}</a></li>
            <li><a href="#contact" className="hover:text-white transition">{t.nav.contact}</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white mb-4">{t.footer.contact}</div>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-2"><Phone className="w-4 h-4 text-brand-red mt-0.5" /> {PHONE}</li>
            <li className="flex gap-2"><MessageCircle className="w-4 h-4 text-brand-red mt-0.5" /> {t.footer.whatsappLabel}: {PHONE}</li>
            <li className="flex gap-2"><MapPin className="w-4 h-4 text-brand-red mt-0.5" /> {address}</li>
            <li className="flex gap-2"><Clock className="w-4 h-4 text-brand-red mt-0.5" /> {t.contact.open24}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>{t.footer.copyright}</div>
          <div>{t.footer.crafted}</div>
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
    <div className="fixed bottom-5 ltr:right-5 rtl:left-5 z-40 flex flex-col gap-3">
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
      <button onClick={() => openWhatsApp("Hello Malik Poultry Farm, I'd like to inquire about your products.")} aria-label="WhatsApp"
        className="pulse-wa w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xl transition">
        <MessageCircle className="w-6 h-6" />
      </button>
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

// -------- App --------
function App() {
  const [lang, setLangState] = useState('en')
  const [highlightId, setHighlightId] = useState(null)

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('mpf_lang')
      if (saved === 'en' || saved === 'ur') setLangState(saved)
    } catch {}
  }, [])

  // Persist + set html dir
  const setLang = (l) => {
    setLangState(l)
    try { window.localStorage.setItem('mpf_lang', l) } catch {}
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', T[lang].dir)
      document.documentElement.setAttribute('lang', lang)
    }
  }, [lang])

  const t = T[lang]

  const onNavigate = (elementId) => {
    scrollAndHighlight(elementId, setHighlightId)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <main className="min-h-screen bg-white">
        <ScrollProgress />
        <Navbar onNavigate={onNavigate} />
        <Hero />
        <Features />
        <About />
        <BrandsShowcase highlightId={highlightId} />
        <Products highlightId={highlightId} />
        <Reviews />
        <ContactSection />
        <Footer />
        <FloatingActions />
      </main>
    </LangContext.Provider>
  )
}

export default App
