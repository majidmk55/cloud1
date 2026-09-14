# 🤖 Support & Smart Chat Module — Design Document

**Version:** 1.0.0  
**Author:** Senior Product Design & AI Solutions Architecture Team  
**Status:** Ready for Development  
**Last Updated:** 2026-01-15

---

## 📋 Table of Contents

1. [Module Overview & Objectives](#1-module-overview--objectives)
2. [Smart Chatbot Architecture & UX Flow](#2-smart-chatbot-architecture--ux-flow)
3. [Escalation & Human Handoff Protocol](#3-escalation--human-handoff-protocol)
4. [Self-Service & Knowledge Base Integration](#4-self-service--knowledge-base-integration)
5. [Support Ticketing System](#5-support-ticketing-system)
6. [User Settings & Accessibility Features](#6-user-settings--accessibility-features)
7. [Markdown UI Mockup](#7-markdown-ui-mockup)

---

## 1. Module Overview & Objectives

### 🎯 Purpose

The **Support & Smart Chat Module** is an AI-powered customer support system designed to provide instant, intelligent assistance to users while seamlessly integrating human agent support when needed. This module serves as the primary communication channel between users and the Abran System support team.

### 🏆 Goals

| Goal | Description | Success Metric |
|------|-------------|----------------|
| **Instant Resolution** | Resolve 70% of queries without human intervention | First-contact resolution rate ≥ 70% |
| **Seamless Escalation** | Smooth transition to human agents when needed | Handoff time < 30 seconds |
| **24/7 Availability** | Always-on support regardless of time zone | 99.9% uptime |
| **Context Retention** | Maintain conversation context across sessions | Context retention score ≥ 95% |
| **User Satisfaction** | Deliver exceptional support experience | CSAT score ≥ 4.5/5 |

### 🎨 Expected User Experience

- **Frictionless:** Users get answers within seconds, not minutes
- **Intelligent:** Bot understands context and provides relevant solutions
- **Empathetic:** Recognizes frustration and escalates appropriately
- **Transparent:** Users always know if they're talking to AI or human
- **Accessible:** Works for all users regardless of ability or device

---

## 2. Smart Chatbot Architecture & UX Flow

### 🚀 Initial Greeting & Context

The chatbot initiates conversations with a **context-aware greeting** that adapts based on:

- **User's account status** (new, active, premium)
- **Current page** (pricing, services, dashboard)
- **Previous interactions** (open tickets, recent queries)
- **Time of day** (business hours vs. after-hours)

#### Greeting Logic

```typescript
interface GreetingContext {
  userName: string;
  accountType: 'free' | 'professional' | 'enterprise';
  currentPage: string;
  hasOpenTickets: boolean;
  lastInteraction?: Date;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

function generateGreeting(context: GreetingContext): string {
  const timeGreeting = {
    morning: 'صبح بخیر',
    afternoon: 'ظهر بخیر',
    evening: 'عصر بخیر'
  }[context.timeOfDay];

  if (context.hasOpenTickets) {
    return `${timeGreeting} ${context.userName}! می‌بینم که تیکت‌های باز دارید. آیا می‌خواهید وضعیت آن‌ها را بررسی کنیم؟`;
  }

  if (context.currentPage === '/pricing') {
    return `${timeGreeting}! به نظر می‌رسد در حال بررسی تعرفه‌ها هستید. آیا سوالی درباره پلن‌ها دارید؟`;
  }

  return `${timeGreeting} ${context.userName}! چطور می‌توانم امروز کمکتان کنم؟`;
}
```

### 💬 Quick Replies & Interactive Elements

The chatbot uses **rich interactive elements** to guide users:

#### Quick Reply Buttons

```
┌─────────────────────────────────────┐
│ 🤖 سلام! چطور می‌توانم کمکتان کنم؟ │
└─────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐
│ 🖥️ مشکل فنی  │ │ 💰 سوال مالی │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ 📊 گزارش‌گیری│ │ 🎫 تیکت جدید │
└──────────────┘ └──────────────┘
```

#### Carousel Cards (for service selection)

```
┌─────────────────────────────────────────────────────┐
│ سرور مورد نظر خود را انتخاب کنید:                    │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │ 🖥️          │ │ ⚡          │ │ 🚀          │   │
│ │ سرور ابری   │ │ سرور اختصاصی│ │ سرور GPU    │   │
│ │ از ۴۹۰,۰۰۰ ت│ │ از ۲,۹۰۰,۰۰۰│ │ از ۵,۰۰۰,۰۰۰│   │
│ │ [انتخاب]    │ │ [انتخاب]    │ │ [انتخاب]    │   │
│ └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 🧠 AI Capabilities

#### LLM Integration

The chatbot leverages **advanced LLM capabilities** for:

| Capability | Description | Technology |
|------------|-------------|------------|
| **Natural Language Understanding** | Parse user intent from natural Persian/English | Fine-tuned LLM (abran-llm-fa) |
| **Context Retention** | Remember conversation history across turns | Vector embeddings + session storage |
| **Multi-turn Conversations** | Handle complex, multi-step queries | Conversation state machine |
| **Sentiment Analysis** | Detect user frustration or satisfaction | Sentiment classifier (real-time) |
| **Entity Extraction** | Identify service names, error codes, dates | NER model |

#### Context Retention Architecture

```typescript
interface ConversationContext {
  sessionId: string;
  userId: string;
  messages: Message[];
  entities: Record<string, any>;
  intent: string;
  sentiment: number; // -1 to 1
  lastUpdated: Date;
  ttl: number; // 24 hours
}

// Example context flow
const context: ConversationContext = {
  sessionId: 'sess_abc123',
  userId: 'user_456',
  messages: [
    { role: 'user', content: 'سرورم قطع شده', timestamp: Date.now() },
    { role: 'bot', content: 'متوجه شدم. لطفاً شناسه سرور را بفرمایید', timestamp: Date.now() },
    { role: 'user', content: 'SRV-789', timestamp: Date.now() }
  ],
  entities: {
    serviceId: 'SRV-789',
    issueType: 'outage'
  },
  intent: 'report_outage',
  sentiment: -0.3, // slightly frustrated
  lastUpdated: new Date(),
  ttl: 86400000 // 24 hours
};
```

---

## 3. Escalation & Human Handoff Protocol

### 🚨 Triggers for Escalation

The system automatically escalates to a human agent when:

| Trigger | Condition | Priority |
|---------|-----------|----------|
| **Sentiment Drop** | Sentiment score < -0.5 for 2+ messages | High |
| **Complex Query** | Bot confidence < 60% after 3 attempts | Medium |
| **Explicit Request** | User says "talk to human" or "agent" | High |
| **Repeated Failures** | Same issue reported 3+ times | Critical |
| **Account Security** | Password reset, account lockout | Critical |
| **Billing Disputes** | Charges > 5,000,000 Toman | High |
| **SLA Breach** | Response time > 5 minutes | Critical |

#### Escalation Decision Tree

```typescript
function shouldEscalate(context: ConversationContext): boolean {
  // Explicit request
  if (context.messages.some(m => 
    m.role === 'user' && 
    /انسان|اپراتور|agent|human/i.test(m.content)
  )) {
    return true;
  }

  // Sentiment drop
  if (context.sentiment < -0.5) {
    const negativeCount = context.messages
      .filter(m => m.role === 'user')
      .slice(-3)
      .filter(m => analyzeSentiment(m.content) < -0.3)
      .length;
    
    if (negativeCount >= 2) return true;
  }

  // Low confidence
  if (context.botConfidence < 0.6 && context.messages.length > 6) {
    return true;
  }

  return false;
}
```

### 🤝 Handoff Experience

#### User Communication

When escalation is triggered, the user sees:

```
┌─────────────────────────────────────────────────────┐
│ 🤖 متوجه شدم که سوال شما پیچیده‌تر از حد معمول است. │
│    یک کارشناس متخصص به زودی به شما متصل می‌شود.     │
│                                                      │
│    ⏱️ زمان تقریبی انتظار: ۲ دقیقه                   │
│                                                      │
│    در این مدت، آیا مایل هستید مقالات مرتبط را       │
│    مطالعه کنید؟                                      │
│                                                      │
│    [📖 بله، مقالات را نشان بده]                      │
│    [⏸️ نه، منتظر کارشناس می‌مانم]                    │
└─────────────────────────────────────────────────────┘
```

#### Agent Handoff Package

The human agent receives:

```typescript
interface HandoffPackage {
  // User info
  user: {
    id: string;
    name: string;
    email: string;
    accountType: string;
    tier: 'free' | 'professional' | 'enterprise';
  };

  // Conversation history
  conversation: {
    messages: Message[];
    duration: number; // minutes
    turnCount: number;
  };

  // AI analysis
  analysis: {
    detectedIntent: string;
    confidence: number;
    sentiment: number;
    entities: Record<string, any>;
    suggestedSolution?: string;
  };

  // Context
  context: {
    currentPage: string;
    device: string;
    browser: string;
    previousTickets: Ticket[];
  };

  // Priority
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedResolutionTime: number; // minutes
}
```

---

## 4. Self-Service & Knowledge Base Integration

### 📚 Dynamic Content Surfacing

The chatbot intelligently surfaces relevant content **during the conversation**:

#### Content Types

| Type | When Shown | Example |
|------|------------|---------|
| **FAQ Articles** | When query matches FAQ | "How to reset password?" → Password reset guide |
| **Video Tutorials** | For complex procedures | "How to configure VPS?" → 5-min video tutorial |
| **Documentation** | For technical queries | "API rate limits" → API documentation link |
| **Status Updates** | For service issues | "Is the API down?" → Real-time status page |
| **Community Posts** | For best practices | "Optimize server performance" → Community guide |

#### Surfacing Algorithm

```typescript
interface ContentSuggestion {
  type: 'faq' | 'video' | 'docs' | 'status' | 'community';
  title: string;
  url: string;
  relevanceScore: number; // 0-1
  preview: string;
}

async function suggestContent(query: string, context: ConversationContext): Promise<ContentSuggestion[]> {
  // 1. Vector search in knowledge base
  const queryEmbedding = await embed(query);
  const similarArticles = await vectorSearch(queryEmbedding, topK: 5);

  // 2. Filter by relevance and recency
  const relevant = similarArticles
    .filter(a => a.relevanceScore > 0.7)
    .filter(a => a.lastUpdated > daysAgo(30))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // 3. Format for display
  return relevant.map(article => ({
    type: article.type,
    title: article.title,
    url: article.url,
    relevanceScore: article.relevanceScore,
    preview: article.excerpt.slice(0, 100) + '...'
  }));
}
```

#### In-Chat Content Display

```
┌─────────────────────────────────────────────────────┐
│ 🤖 برای تنظیم سرور ابری، این منابع ممکن است کمک     │
│    کنند:                                            │
│                                                      │
│    📖 [راهنمای راه‌اندازی سرور ابری]                 │
│       ⏱️ ۵ دقیقه مطالعه • 📊 ۹۵٪ مفید               │
│                                                      │
│    🎥 [ویدیو: پیکربندی اولیه VPS]                    │
│       ⏱️ ۳ دقیقه • 👁️ ۱۲,۴۵۰ بازدید                │
│                                                      │
│    📄 [مستندات API مدیریت سرور]                      │
│       🔗 docs.abran.system/api/servers               │
│                                                      │
│    آیا این منابع مفید بودند؟                         │
│    [ 👍 بله ] [ 👎 خیر ]                            │
└─────────────────────────────────────────────────────┘
```

---

## 5. Support Ticketing System

### 🎫 Ticket Creation Flow

When chat cannot resolve the issue, a **support ticket** is created:

#### Ticket Creation Triggers

1. **User Request:** "Create a ticket" or "I need more help"
2. **Bot Limitation:** After 3 failed resolution attempts
3. **Complex Issue:** Requires backend investigation
4. **Follow-up Needed:** Issue resolution takes > 24 hours

#### Ticket Creation Form

```typescript
interface TicketCreation {
  // Auto-populated
  userId: string;
  conversationId: string;
  createdAt: Date;
  
  // User input
  subject: string;
  category: 'technical' | 'billing' | 'account' | 'feature_request' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  attachments?: File[];
  
  // AI-generated
  suggestedCategory: string;
  suggestedPriority: string;
  relatedArticles: string[];
}
```

#### Ticket Status Tracking

```
┌─────────────────────────────────────────────────────┐
│ 🎫 تیکت شما ایجاد شد                                 │
│                                                      │
│    شماره تیکت: TKT-2026-001234                       │
│    موضوع: مشکل در اتصال سرور ابری                    │
│    اولویت: بالا                                       │
│    وضعیت: در حال بررسی                               │
│                                                      │
│    ⏱️ زمان پاسخ تخمینی: ۲ ساعت                      │
│                                                      │
│    [📋 مشاهده جزئیات] [🔔 اعلان برای آپدیت]          │
└─────────────────────────────────────────────────────┘
```

#### Ticket Lifecycle

```
Created → Assigned → In Progress → Waiting for User → Resolved → Closed
    ↓         ↓           ↓              ↓                ↓
  Auto      Agent      Agent          User             Auto
 assign    review    investigation   provides         follow-up
                                     info
```

#### Ticket Resolution

```typescript
interface TicketResolution {
  ticketId: string;
  resolution: string;
  resolvedBy: 'bot' | 'agent';
  resolutionTime: number; // minutes
  customerSatisfaction?: number; // 1-5
  followUpRequired: boolean;
  
  // Auto-generated
  knowledgeBaseArticle?: string; // If solution should be added to KB
  similarTickets: string[];
  tags: string[];
}
```

---

## 6. User Settings & Accessibility Features

### ⚙️ User Preferences

Users can customize their chat experience:

#### Settings Panel

```
┌─────────────────────────────────────────────────────┐
│ ⚙️ تنظیمات چت                                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 🌐 زبان                                              │
│    [ فارسی ▼ ]                                       │
│                                                      │
│ 🎨 تم                                                │
│    ○ روشن  ● تاریک  ○ پیش‌فرض سیستم                 │
│                                                      │
│ 🔔 اعلان‌ها                                          │
│    ✓ اعلان پیام جدید                                 │
│    ✓ اعلان آپدیت تیکت                                │
│    ○ اعلان ایمیل (برای موارد غیرضروری)              │
│                                                      │
│ 📥 دانلود                                            │
│    [📄 دانلود تاریخچه چت (PDF)]                      │
│    [📊 دانلود تاریخچه چت (JSON)]                     │
│                                                      │
│ 🔒 حریم خصوصی                                        │
│    ✓ ذخیره تاریخچه چت                                │
│    ○ حالت ناشناس (بدون ذخیره)                        │
│                                                      │
│ [💾 ذخیره تغییرات]                                    │
└─────────────────────────────────────────────────────┘
```

#### Settings Schema

```typescript
interface ChatSettings {
  // Display
  language: 'fa' | 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  
  // Notifications
  notifications: {
    newMessage: boolean;
    ticketUpdate: boolean;
    emailNotifications: boolean;
    sound: boolean;
  };
  
  // Privacy
  privacy: {
    saveHistory: boolean;
    anonymousMode: boolean;
    dataRetentionDays: number; // 30, 90, 365
  };
  
  // Accessibility
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReaderOptimized: boolean;
    keyboardNavigation: boolean;
  };
}
```

### ♿ Accessibility Features

The chat widget is **WCAG 2.1 AA compliant**:

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Keyboard Navigation** | Full keyboard support (Tab, Enter, Escape) | Users can navigate without mouse |
| **Screen Reader** | ARIA labels, role attributes, live regions | Blind users can use chat |
| **High Contrast** | Optional high-contrast mode | Low-vision users |
| **Reduced Motion** | Respects `prefers-reduced-motion` | Users with vestibular disorders |
| **Focus Indicators** | Visible focus rings on all interactive elements | Keyboard users |
| **Color Contrast** | Minimum 4.5:1 contrast ratio | All users |
| **Resizable Text** | Supports browser zoom up to 200% | Low-vision users |
| **Language Support** | RTL support for Persian/Arabic | Right-to-left language users |

#### Accessibility Implementation

```typescript
// Keyboard navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeChat();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      sendMessage();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

// Screen reader announcements
const announceToScreenReader = (message: string) => {
  const announcement = document.getElementById('chat-announcements');
  if (announcement) {
    announcement.textContent = message;
  }
};

// Reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animationDuration = prefersReducedMotion ? '0ms' : '200ms';
```

---

## 7. Markdown UI Mockup

### 🎨 Chat Widget UI

Below is a **visual representation** of the chat widget interface:

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ 🤖 چت پشتیبانی ابران                                    [─][×]│  │
│ ├───────────────────────────────────────────────────────────────┤  │
│ │                                                                │  │
│ │  ┌─────────────────────────────────────────────────────────┐  │  │
│ │  │ 🤖 سلام علی! خوش آمدید.                                 │  │  │
│ │  │    چطور می‌توانم امروز کمکتان کنم؟                      │  │  │
│ │  │                                           ۱۰:۳۰ ق.ظ     │  │  │
│ │  └─────────────────────────────────────────────────────────┘  │  │
│ │                                                                │  │
│ │  ┌─────────────────────────────────────────────────────────┐  │  │
│ │  │ انتخاب کنید:                                             │  │  │
│ │  │                                                          │  │  │
│ │  │  ┌──────────────┐  ┌──────────────┐                     │  │  │
│ │  │  │ 🖥️ مشکل فنی  │  │ 💰 سوال مالی │                     │  │  │
│ │  │  └──────────────┘  └──────────────┘                     │  │  │
│ │  │  ┌──────────────┐  ┌──────────────┐                     │  │  │
│ │  │  │ 📊 گزارش‌گیری│  │ 🎫 تیکت جدید │                     │  │  │
│ │  │  └──────────────┘  └──────────────┘                     │  │  │
│ │  └─────────────────────────────────────────────────────────┘  │  │
│ │                                                                │  │
│ │                                          ┌─────────────────┐  │  │
│ │                                          │ 👤 سرورم قطع شده│  │  │
│ │                                          │      ۱۰:۳۱ ق.ظ │  │  │
│ │                                          └─────────────────┘  │  │
│ │                                                                │  │
│ │  ┌─────────────────────────────────────────────────────────┐  │  │
│ │  │ 🤖 متوجه شدم. لطفاً شناسه سرور را بفرمایید.             │  │  │
│ │  │                                          ۱۰:۳۱ ق.ظ     │  │  │
│ │  └─────────────────────────────────────────────────────────┘  │  │
│ │                                                                │  │
│ │                                          ┌─────────────────┐  │  │
│ │                                          │ 👤 SRV-789      │  │  │
│ │                                          │      ۱۰:۳۲ ق.ظ │  │  │
│ │                                          └─────────────────┘  │  │
│ │                                                                │  │
│ │  ┌─────────────────────────────────────────────────────────┐  │  │
│ │  │ 🤖 بررسی کردم. سرور SRV-789 در حال حاضر offline است.    │  │  │
│ │  │                                                          │  │  │
│ │  │    🔧 اقدامات پیشنهادی:                                  │  │  │
│ │  │    ۱. ری‌استارت سرور از پنل مدیریت                      │  │  │
│ │  │    ۲. بررسی لاگ‌های سیستم                                │  │  │
│ │  │    ۳. تماس با پشتیبانی (در صورت ادامه مشکل)              │  │  │
│ │  │                                                          │  │  │
│ │  │    📖 [راهنمای عیب‌یابی سرور]                            │  │  │
│ │  │                                                          │  │  │
│ │  │    آیا این مشکل حل شد؟                                   │  │  │
│ │  │    [ ✅ بله، حل شد ] [ ❌ خیر، کمک بیشتر ]              │  │  │
│ │  │                                           ۱۰:۳۲ ق.ظ     │  │  │
│ │  └─────────────────────────────────────────────────────────┘  │  │
│ │                                                                │  │
│ ├───────────────────────────────────────────────────────────────┤  │
│ │ ┌─────────────────────────────────────────────────────────┐  │  │
│ │ │ پیام خود را بنویسید...                           [📎][📤]│  │  │
│ │ └─────────────────────────────────────────────────────────┘  │  │
│ │ ⚡ تایپ شده توسط هوش مصنوعی • [⚙️] [📋]                      │  │
│ └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 📱 Mobile View

```
┌─────────────────────────┐
│ 🤖 چت پشتیبانی      [×] │
├─────────────────────────┤
│                          │
│  ┌────────────────────┐ │
│  │ 🤖 سلام! چطور      │ │
│  │    می‌توانم کمک     │ │
│  │    کنم؟             │ │
│  │         ۱۰:۳۰ ق.ظ  │ │
│  └────────────────────┘ │
│                          │
│        ┌──────────────┐ │
│        │ 👤 سرورم     │ │
│        │    قطع شده   │ │
│        │   ۱۰:۳۱ ق.ظ │ │
│        └──────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │ 🤖 متوجه شدم...    │ │
│  │         ۱۰:۳۱ ق.ظ  │ │
│  └────────────────────┘ │
│                          │
├─────────────────────────┤
│ [پیام...]        [📤]  │
│ ⚡ هوش مصنوعی • [⚙️]   │
└─────────────────────────┘
```

### 🌙 Dark Mode

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ 🤖 چت پشتیبانی ابران                                    [─][×]│  │
│ │                                                 (Dark Theme)  │  │
│ ├───────────────────────────────────────────────────────────────┤  │
│ │  ┌─────────────────────────────────────────────────────────┐  │  │
│ │  │ 🤖 سلام! چطور می‌توانم کمکتان کنم؟                      │  │  │
│ │  │                                           ۱۰:۳۰ ق.ظ     │  │  │
│ │  └─────────────────────────────────────────────────────────┘  │  │
│ │                                                                │  │
│ │                                          ┌─────────────────┐  │  │
│ │                                          │ 👤 سوال دارم    │  │  │
│ │                                          │      ۱۰:۳۱ ق.ظ │  │  │
│ │                                          └─────────────────┘  │  │
│ │                                                                │  │
│ ├───────────────────────────────────────────────────────────────┤  │
│ │ ┌─────────────────────────────────────────────────────────┐  │  │
│ │ │ پیام خود را بنویسید...                           [📎][📤]│  │  │
│ │ └─────────────────────────────────────────────────────────┘  │  │
│ └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Technical Specifications

### API Endpoints

```typescript
// Chat endpoints
POST   /api/chat/message          // Send message
GET    /api/chat/history          // Get conversation history
POST   /api/chat/escalate         // Escalate to human
GET    /api/chat/suggestions      // Get content suggestions

// Ticket endpoints
POST   /api/tickets               // Create ticket
GET    /api/tickets/:id           // Get ticket details
PATCH  /api/tickets/:id           // Update ticket
GET    /api/tickets/user/:userId  // Get user's tickets

// Settings endpoints
GET    /api/chat/settings         // Get user settings
PUT    /api/chat/settings         // Update settings
POST   /api/chat/transcript       // Download transcript
```

### Database Schema

```sql
-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(10) NOT NULL, -- 'user', 'bot', 'agent'
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  conversation_id UUID REFERENCES conversations(id),
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  assigned_to UUID REFERENCES agents(id),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  metadata JSONB
);
```

---

## 🎯 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Response Time** | < 5 seconds | Bot response latency |
| **Resolution Rate** | ≥ 70% | Queries resolved without human |
| **Handoff Time** | < 30 seconds | Time to connect human agent |
| **Customer Satisfaction** | ≥ 4.5/5 | Post-chat survey |
| **Ticket Resolution Time** | < 24 hours | Average ticket lifecycle |
| **Knowledge Base Usage** | ≥ 60% | % of queries with KB suggestions |
| **Escalation Rate** | ≤ 30% | % of conversations escalated |

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Basic chat widget UI
- [ ] Message sending/receiving
- [ ] Simple bot responses
- [ ] User authentication

### Phase 2: AI Integration (Weeks 3-4)
- [ ] LLM integration for NLU
- [ ] Context retention
- [ ] Quick replies & carousels
- [ ] Knowledge base search

### Phase 3: Escalation (Weeks 5-6)
- [ ] Human handoff protocol
- [ ] Agent dashboard
- [ ] Ticket creation
- [ ] Real-time chat transfer

### Phase 4: Polish (Weeks 7-8)
- [ ] Accessibility features
- [ ] User settings
- [ ] Analytics & reporting
- [ ] Performance optimization

---

## 📝 Conclusion

This **Support & Smart Chat Module** design provides a comprehensive, user-centric solution for customer support. By combining AI-powered automation with seamless human escalation, we deliver:

✅ **Instant responses** for common queries  
✅ **Intelligent escalation** when needed  
✅ **Seamless experience** across AI and human agents  
✅ **Accessible design** for all users  
✅ **Measurable outcomes** with clear success metrics

The module is ready for development and will significantly improve customer satisfaction while reducing support costs.

---

**Document Status:** ✅ Ready for Development  
**Next Steps:** Review with engineering team → Begin Phase 1 implementation

---

*For questions or clarifications, contact the Product Design team.*
