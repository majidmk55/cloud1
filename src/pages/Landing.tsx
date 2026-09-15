import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Cpu, Shield, BarChart3, Mail, Phone, MapPin } from 'lucide-react';
import { HeroBackground } from '../components/HeroBackground';
import { ProductMegaMenu, MobileMenu } from '../components/ProductMenu';

export function Landing() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animated counter
  const [counters, setCounters] = useState({
    projects: 0,
    clients: 0,
    uptime: 0,
    team: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Animate counters
          const targets = { projects: 150, clients: 80, uptime: 99.9, team: 25 };
          const duration = 2000;
          const steps = 60;
          const interval = duration / steps;

          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounters({
              projects: Math.floor(targets.projects * progress),
              clients: Math.floor(targets.clients * progress),
              uptime: Number((targets.uptime * progress).toFixed(1)),
              team: Math.floor(targets.team * progress),
            });

            if (step >= steps) clearInterval(timer);
          }, interval);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Cloud,
      title: 'خدمات ابری',
      description: 'سرورهای ابری مقیاس‌پذیر با عملکرد بالا و قابلیت اطمینان ۹۹.۹٪',
    },
    {
      icon: Cpu,
      title: 'هوش مصنوعی',
      description: 'API‌های هوش مصنوعی پیشرفته برای پردازش زبان، بینایی و تحلیل داده',
    },
    {
      icon: BarChart3,
      title: 'سرور مجازی',
      description: 'VPS‌های پرسرعت در_locations مختلف ایران و جهان',
    },
    {
      icon: Shield,
      title: 'امنیت سایبری',
      description: 'محافظت چندلایه از داده‌ها و زیرساخت‌های شما در برابر تهدیدات',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden" dir="rtl">
      {/* Navigation - Dark theme with glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/80 backdrop-blur-md border-b border-[#00d4ff]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-[#00d4ff]" />
            <span className="text-xl font-bold text-white">ابران سیستم</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-white hover:text-[#00d4ff] transition-colors font-medium">خانه</a>
            <ProductMegaMenu />
            <a href="#services" className="text-white hover:text-[#00d4ff] transition-colors font-medium">خدمات</a>
            <a href="#about" className="text-white hover:text-[#00d4ff] transition-colors font-medium">درباره ما</a>
            <a href="#contact" className="text-white hover:text-[#00d4ff] transition-colors font-medium">تماس با ما</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2 bg-[#00d4ff] text-[#0a1628] rounded-lg font-bold hover:bg-[#4fc3f7] transition-colors shadow-lg shadow-[#00d4ff]/20">
              شروع کنید
            </button>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
        <HeroBackground />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-white">
              ابران سیستم
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-[#00d4ff] mb-10 font-light">
              راهکارهای هوشمند ابری و هوش مصنوعی
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-[#00d4ff] text-[#0a1628] rounded-lg font-bold text-lg hover:bg-[#4fc3f7] transition-all shadow-lg shadow-[#00d4ff]/30 hover:shadow-[#00d4ff]/50">
                مشاوره رایگان
              </button>
              <button className="px-8 py-4 bg-transparent text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all border-2 border-white/30">
                اطلاعات بیشتر
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - Dark theme */}
      <section id="services" className="py-24 px-6 bg-[#0d2137] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">خدمات ما</h2>
            <p className="text-xl text-gray-400">راهکارهای جامع برای نیازهای دیجیتال شما</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-[#0a1628] rounded-xl p-8 border border-[#00d4ff]/20 hover:border-[#00d4ff]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4ff]/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-[#00d4ff]" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section - Dark theme */}
      <section ref={statsRef} className="py-24 px-6 bg-gradient-to-b from-[#1a3a6c] to-[#0d2137]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-[#00d4ff] mb-2">
                {counters.projects}+
              </div>
              <div className="text-gray-400 text-lg">پروژه موفق</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-[#00d4ff] mb-2">
                {counters.clients}+
              </div>
              <div className="text-gray-400 text-lg">مشتری راضی</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-[#00d4ff] mb-2">
                {counters.uptime}%
              </div>
              <div className="text-gray-400 text-lg">آپتایم سرویس</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-[#00d4ff] mb-2">
                {counters.team}+
              </div>
              <div className="text-gray-400 text-lg">متخصص حرفه‌ای</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Dark theme */}
      <section id="contact" className="py-24 px-6 bg-[#0a1628]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">تماس با ما</h2>
            <p className="text-xl text-gray-400">ما آماده پاسخگویی به سوالات شما هستیم</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#0d2137] rounded-xl p-8 border border-[#00d4ff]/20 shadow-lg"
            >
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#0a1628] border border-[#00d4ff]/20 rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                    placeholder="نام خود را وارد کنید"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">ایمیل</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-[#0a1628] border border-[#00d4ff]/20 rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">پیام</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0a1628] border border-[#00d4ff]/20 rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors resize-none"
                    placeholder="پیام خود را بنویسید..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#00d4ff] text-[#0a1628] rounded-lg font-bold text-lg hover:bg-[#4fc3f7] transition-all shadow-lg shadow-[#00d4ff]/30 hover:shadow-[#00d4ff]/50"
                >
                  ارسال پیام
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-[#0d2137] to-[#0a1628] rounded-xl p-8 border border-[#00d4ff]/20 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-white">اطلاعات تماس</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#00d4ff]" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">تلفن</h4>
                      <p className="text-gray-400" dir="ltr">+98 21 1234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#00d4ff]" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">ایمیل</h4>
                      <p className="text-gray-400" dir="ltr">info@abran-system.ir</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#00d4ff]" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">آدرس</h4>
                      <p className="text-gray-400">تهران، خیابان ولیعصر، برج ابران، طبقه ۱۲</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#00d4ff]/10 to-[#4fc3f7]/10 rounded-xl p-8 border border-[#00d4ff]/20 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-white">ساعات کاری</h3>
                <div className="space-y-2 text-gray-300">
                  <p>شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰</p>
                  <p>پنج‌شنبه: ۸:۰۰ - ۱۳:۰۰</p>
                  <p>جمعه: تعطیل</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Dark theme */}
      <footer className="bg-[#0a1628] border-t border-[#00d4ff]/10 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-8 h-8 text-[#00d4ff]" />
                <span className="text-xl font-bold">ابران سیستم</span>
              </div>
              <p className="text-gray-400">
                ارائه‌دهنده خدمات ابری و راهکارهای هوش مصنوعی برای کسب‌وکارهای مدرن
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#00d4ff]">خدمات</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">زیرساخت ابری</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">هوش مصنوعی</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">سرور مجازی</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">امنیت سایبری</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#00d4ff]">شرکت</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">درباره ما</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">تماس با ما</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">بلاگ</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">فرصت‌های شغلی</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-[#00d4ff]">شبکه‌های اجتماعی</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center hover:bg-[#00d4ff]/20 transition-colors">
                  <svg className="w-5 h-5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center hover:bg-[#00d4ff]/20 transition-colors">
                  <svg className="w-5 h-5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center hover:bg-[#00d4ff]/20 transition-colors">
                  <svg className="w-5 h-5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#00d4ff]/10 pt-8 text-center text-gray-400">
            <p>© ۱۴۰۳ ابران سیستم. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
