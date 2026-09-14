import { useState } from 'react';
import { Cpu, Eye, Mic, Volume2, Link2, Server } from 'lucide-react';
import { useSeo } from '../hooks';
import { SectionHeading, CodeBlock } from '../components/shared';

const aiServices = [
  { icon: <Cpu className="w-6 h-6 text-blue-400" />, title: 'گفتگوی هوشمند (LLM)', desc: 'مدل‌های زبانی بزرگ با پشتیبانی کامل از زبان فارسی', price: '۵۰٬۰۰۰ تومان / میلیون توکن' },
  { icon: <Eye className="w-6 h-6 text-emerald-400" />, title: 'بینایی ماشین و OCR', desc: 'تشخیص تصویر، چهره و تبدیل تصویر به متن', price: '۳۰٬۰۰۰ تومان / هزار درخواست' },
  { icon: <Mic className="w-6 h-6 text-purple-400" />, title: 'تبدیل گفتار به متن', desc: 'تبدیل صدا و گفتار فارسی به متن با دقت بالا', price: '۲۰٬۰۰۰ تومان / ساعت صدا' },
  { icon: <Volume2 className="w-6 h-6 text-cyan-400" />, title: 'متن به گفتار', desc: 'تولید صدای طبیعی فارسی از متن', price: '۲۵٬۰۰۰ تومان / میلیون کاراکتر' },
  { icon: <Link2 className="w-6 h-6 text-amber-400" />, title: 'Embedding و RAG', desc: 'تولید وکتورهای معنایی برای جستجوی هوشمند', price: '۱۰٬۰۰۰ تومان / میلیون توکن' },
  { icon: <Server className="w-6 h-6 text-rose-400" />, title: 'GPU ابری', desc: 'دسترسی به GPU‌های NVIDIA A100 و H100 برای آموزش مدل', price: 'از ۵۰٬۰۰۰ تومان / ساعت' },
];

export function AI() {
  useSeo('خدمات هوش مصنوعی — ابران سیستم', 'API‌های هوش مصنوعی آنلاین شامل LLM، بینایی ماشین، تبدیل گفتار و GPU ابری');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    const demoResponse = `سلام! من مدل هوش مصنوعی ابران هستم. خوشحالم که با شما صحبت می‌کنم.

شما پرسیدید: "${prompt}"

این یک پاسخ نمایشی است. در حالت واقعی، API ما پاسخ‌های دقیق‌تری ارائه می‌دهد.

ویژگی‌های مدل ابران:
• پشتیبانی کامل از زبان فارسی
• درک زمینه و متن
• پاسخ‌های دقیق و مفید`;

    let i = 0;
    const interval = setInterval(() => {
      if (i < demoResponse.length) {
        setResponse(demoResponse.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 30);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <SectionHeading badge="🤖 هوش مصنوعی" title="API‌های هوش مصنوعی ابران" subtitle="دسترسی آسان به مدل‌های هوش مصنوعی پیشرفته از طریق API" center />

      {/* AI Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {aiServices.map((service, i) => (
          <div key={i} className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              {service.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{service.desc}</p>
            <p className="text-blue-400 text-xs font-medium">{service.price}</p>
          </div>
        ))}
      </div>

      {/* Playground */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 محیط آزمایشی</h2>
        <div className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-6 max-w-3xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
            <p className="text-amber-400 text-xs text-center">⚠️ این محیط نمایشی است. پاسخ‌ها شبیه‌سازی شده‌اند.</p>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="سوال خود را به فارسی بنویسید..."
            className="w-full bg-[#050816] border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 mb-4 focus:outline-none focus:border-blue-500/50"
          />
          <button
            onClick={handleRun}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-l from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'در حال پردازش...' : 'اجرا'}
          </button>
          {response && (
            <div className="mt-4 bg-[#050816] rounded-xl p-4 border border-white/5">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{response}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Code Samples */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">نمونه کد</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <CodeBlock language="curl" code={`curl -X POST https://api.abran.system/v1/chat \\
  -H "Authorization: Bearer sk-..." \\
  -d '{"model":"abran-llm-fa","messages":[
    {"role":"user","content":"سلام"}
  ]}'`} />
          <CodeBlock language="javascript" code={`const response = await fetch(
  'https://api.abran.system/v1/chat',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-...',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'abran-llm-fa',
      messages: [{ role: 'user', content: 'سلام' }],
    }),
  }
);
const data = await response.json();`} />
        </div>
      </div>

      {/* Pricing Table */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">تعرفه API‌ها</h2>
        <div className="overflow-x-auto max-w-3xl mx-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4 text-gray-400">سرویس</th>
                <th className="text-center py-3 px-4 text-gray-400">واحد</th>
                <th className="text-center py-3 px-4 text-gray-400">قیمت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['گفتگوی هوشمند', 'میلیون توکن', '۵۰٬۰۰۰ تومان'],
                ['بینایی ماشین', 'هزار درخواست', '۳۰٬۰۰۰ تومان'],
                ['گفتار به متن', 'ساعت صدا', '۲۰٬۰۰۰ تومان'],
                ['متن به گفتار', 'میلیون کاراکتر', '۲۵٬۰۰۰ تومان'],
                ['Embedding', 'میلیون توکن', '۱۰٬۰۰۰ تومان'],
                ['GPU A100', 'ساعت', '۵۰٬۰۰۰ تومان'],
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 text-gray-300">{row[0]}</td>
                  <td className="py-3 px-4 text-center text-gray-400">{row[1]}</td>
                  <td className="py-3 px-4 text-center text-blue-400 font-medium">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
