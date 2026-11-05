import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini SDK safely
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Gemini Assistant Endpoint
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { message, context, conversationHistory, bengaliExplanationMode } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // System prompt giving FOCUS AI full awareness of user's state and multilingual fluency
    const systemPrompt = `You are "FOCUS AI", the voice-enabled AI copilot inside FOCUSLY — the futuristic productivity platform (tagline: "FOCUS BEYOND LIMITS").
Your tone is intelligent, empowering, concise, and focused. You help the user manage tasks, projects, workspaces, start pomodoro sessions, review focus history, and plan daily schedules.

LANGUAGE REQUIREMENTS:
- You fully understand Bengali (বাংলা), Banglish (Bengali written in English letters like "Photoshop e ekta task banao", "45 min focus session shuru koro", "ajke ami koto shomoy kaj korechi?"), and English.
- When the user speaks in Bengali or Banglish, or when Bengali Explanation Mode is enabled, you MUST reply in fluent, natural Bengali (বাংলা) or friendly Banglish with spoken clarity.
- When the user speaks in English, reply in crisp English.
- Always map spoken task names, workspace names, and durations to the English database records.

${bengaliExplanationMode ? `BENGALI EXPLANATION MODE IS ACTIVE:
- You must explain concepts and productivity workflows in rich, clear Bengali (বাংলা).
- For actions (like starting timers or creating tasks), explain WHY this helps their focus and HOW to best utilize the workspace (e.g. Photoshop layer management, Premiere timeline editing sprints).
- If the user asks how to use any part of FOCUSLY, guide them patiently step-by-step in Bengali.` : ''}

Current User Context:
${JSON.stringify(context || {}, null, 2)}

Instructions:
1. Understand the user's natural language request (Bengali, Banglish, or English).
2. If the user wants to execute an action (e.g. create a task, start a focus session, create a project, complete a task, delete something), output structured actions.
3. For destructive actions (like deleting tasks or wiping data), ALWAYS set "needsConfirmation": true with a clear "confirmationMessage" in Bengali if queried in Bengali.
4. For starting a focus timer, if the user mentions duration like "45 minutes" or "৪৫ মিনিট", extract 45. Default is 25 if unspecified.
5. Provide a crisp, spoken-friendly response (2-3 sentences max) suitable for text-to-speech output.
6. Return your response as a valid JSON object matching this schema:
{
  "reply": "string (the conversational response in Bengali/Banglish or English)",
  "actions": [
    {
      "type": "create_task" | "start_timer" | "create_project" | "complete_task" | "plan_schedule" | "delete_task",
      "payload": object,
      "needsConfirmation": boolean,
      "confirmationMessage": "string or null"
    }
  ],
  "suggestedFollowUps": ["string", "string"]
}

Examples of payloads:
- create_task: { "title": "Design Figma homepage layout", "workspaceName": "Photoshop", "priority": "high", "estimatedMinutes": 45 }
- start_timer: { "durationMinutes": 45, "workspaceName": "Photoshop", "taskName": "Design Figma layout" }
- create_project: { "name": "Brand Identity 2026", "color": "#8B5CF6", "deadline": "2026-11-20" }
- complete_task: { "taskId": "string or title match", "title": "task title" }
- plan_schedule: { "summary": "Recommended 3 deep work blocks...", "blocks": [...] }
- delete_task: { "taskId": "string", "title": "string" }`;

    if (ai) {
      try {
        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `User query: "${message}"\n\nRecent messages: ${JSON.stringify(conversationHistory?.slice(-4) || [])}`,
                },
              ],
            },
          ],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        });

        // 7-second timeout fallback for instant voice feel
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI response timed out')), 7000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const rawText = response.text || '{}';
        try {
          const parsed = JSON.parse(rawText);
          return res.json(parsed);
        } catch {
          return res.json({
            reply: rawText.replace(/```json|```/g, '').trim(),
            actions: [],
            suggestedFollowUps: ['আজকে কতক্ষণ কাজ করেছি?', '২৫ মিনিটের টাইমার শুরু করো', 'পেন্ডিং কাজগুলো দেখাও'],
          });
        }
      } catch (geminiError: any) {
        console.error('Gemini API call failed, falling back to heuristic assistant:', geminiError?.message || geminiError);
        const fallback = parseHeuristicIntent(message, context, bengaliExplanationMode);
        return res.json(fallback);
      }
    } else {
      const fallback = parseHeuristicIntent(message, context, bengaliExplanationMode);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Assistant error:', error);
    res.status(500).json({
      error: 'Failed to process assistant request',
      details: error?.message || String(error),
    });
  }
});

// Multilingual Heuristic fallback supporting Bengali, Banglish, and English
function parseHeuristicIntent(message: string, context: any, bengaliExplanationMode?: boolean) {
  const lower = message.toLowerCase().trim();
  const isBengali = Boolean(bengaliExplanationMode) ||
    /[\u0980-\u09FF]/.test(message) ||
    lower.includes('koro') || lower.includes('shuru') || lower.includes('kaj') ||
    lower.includes('banao') || lower.includes('koto') || lower.includes('baki') ||
    lower.includes('ajke') || lower.includes('kalker') || lower.includes('ki') ||
    lower.includes('kivabe');

  // Convert Bengali numerals if present (e.g. ৪৫ -> 45)
  const bengaliNumerals: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  let normalizedMsg = lower;
  for (const [bn, en] of Object.entries(bengaliNumerals)) {
    normalizedMsg = normalizedMsg.replaceAll(bn, en);
  }

  // 1. Start timer (English / Bengali / Banglish)
  // e.g. "45 min focus session shuru koro", "শুরু করো", "start timer"
  if (
    normalizedMsg.includes('start') || normalizedMsg.includes('shuru') ||
    normalizedMsg.includes('শুরু') || normalizedMsg.includes('timer') ||
    normalizedMsg.includes('টাইমার') || normalizedMsg.includes('session') ||
    normalizedMsg.includes('সেশন')
  ) {
    const minsMatch = normalizedMsg.match(/(\d+)\s*(?:min|minute|মিনিট|মিনিটের)?/);
    const duration = minsMatch ? parseInt(minsMatch[1], 10) : 25;
    const workspace = context?.workspaces?.find((w: any) =>
      normalizedMsg.includes(w.name.toLowerCase())
    )?.name || 'Photoshop';

    const reply = isBengali
      ? `${workspace} এর জন্য ${duration} মিনিটের ফোকাস সেশন শুরু করা হয়েছে। আপনার সেরা মনোযোগ দিয়ে কাজ শুরু করুন!`
      : `Initiating a ${duration}-minute focus session for ${workspace}. Get into your deep work zone!`;

    return {
      reply,
      actions: [
        {
          type: 'start_timer',
          payload: { durationMinutes: duration, workspaceName: workspace },
          needsConfirmation: false,
        },
      ],
      suggestedFollowUps: isBengali
        ? ['আমার পেন্ডিং কাজগুলো দেখাও', 'আজকে কতক্ষণ কাজ করেছি?', 'টাইমার পজ করো']
        : ['Show my pending tasks', 'Pause session', 'How much time did I work today?'],
    };
  }

  // 2. How much time did I work today? (English / Bengali / Banglish)
  // e.g. "ajke ami koto shomoy kaj korechi?", "আজকে কতক্ষণ কাজ করেছি?", "koto time"
  if (
    normalizedMsg.includes('koto') || normalizedMsg.includes('কতক্ষণ') ||
    normalizedMsg.includes('কত সময়') || normalizedMsg.includes('shomoy') ||
    normalizedMsg.includes('how much') || normalizedMsg.includes('today') ||
    normalizedMsg.includes('ajke') || normalizedMsg.includes('আজকে') ||
    normalizedMsg.includes('stats')
  ) {
    const todayMinutes = context?.todayFocusMinutes || 0;
    const hours = Math.floor(todayMinutes / 60);
    const mins = todayMinutes % 60;
    const goalMinutes = context?.dailyGoalMinutes || 120;
    const pct = Math.round((todayMinutes / goalMinutes) * 100);

    const reply = isBengali
      ? `আপনি আজকে মোট ${hours > 0 ? `${hours} ঘণ্টা ` : ''}${mins} মিনিট গভীর মনোযোগ দিয়ে কাজ করেছেন (আপনার দৈনিক লক্ষ্যের ${pct}%)। দুর্দান্ত গতি বজায় রাখুন!`
      : `You have logged ${hours > 0 ? `${hours}h ` : ''}${mins}m of deep focus today (${pct}% of your ${Math.floor(goalMinutes / 60)}h daily goal). Keep pushing your limits!`;

    return {
      reply,
      actions: [],
      suggestedFollowUps: isBengali
        ? ['৪৫ মিনিটের সেশন শুরু করো', 'পেন্ডিং কাজ দেখাও', 'কালকের রুটিন প্ল্যান করো']
        : ['Start a 45-minute focus session', 'Plan my work for tomorrow', 'Show active projects'],
    };
  }

  // 3. Create task (English / Bengali / Banglish)
  // e.g. "Photoshop e ekta task banao", "টাস্ক বানাও", "create a task"
  if (
    normalizedMsg.includes('task') || normalizedMsg.includes('টাস্ক') ||
    normalizedMsg.includes('banao') || normalizedMsg.includes('বানাও') ||
    normalizedMsg.includes('toiri') || normalizedMsg.includes('তৈরি') ||
    normalizedMsg.includes('create')
  ) {
    let titleClean = message
      .replace(/create\s+(a\s+)?(new\s+)?task\s*(to|for|called|named|:)?/i, '')
      .replace(/(ekta|notun)?\s*task\s*(banao|toiri\s*koro)?/gi, '')
      .replace(/(একটা|নতুন)?\s*টাস্ক\s*(বানাও|তৈরি\s*করো)?/gi, '')
      .trim() || 'New Focus Task';

    if (titleClean.length < 3) titleClean = 'Creative Focus Deliverable';

    const matchedWs = context?.workspaces?.find((w: any) =>
      normalizedMsg.includes(w.name.toLowerCase())
    )?.name || 'Photoshop';

    const reply = isBengali
      ? `"${matchedWs}" ওয়ার্কস্পেসে "${titleClean}" নামের নতুন টাস্ক তৈরি করা হয়েছে।`
      : `Created task "${titleClean}" in workspace "${matchedWs}".`;

    return {
      reply,
      actions: [
        {
          type: 'create_task',
          payload: {
            title: titleClean,
            workspaceName: matchedWs,
            priority: normalizedMsg.includes('urgent') || normalizedMsg.includes('জরুরি') ? 'urgent' : 'medium',
            estimatedMinutes: 30,
          },
          needsConfirmation: false,
        },
      ],
      suggestedFollowUps: isBengali
        ? ['এই টাস্কে ২৫ মিনিটের টাইমার শুরু করো', 'পেন্ডিং কাজগুলো দেখাও', 'কালকের প্ল্যান করো']
        : ['Start a 30-minute focus session on this task', 'Show my pending tasks', 'Plan my schedule'],
    };
  }

  // 4. Pending tasks (English / Bengali / Banglish)
  // e.g. "amar pending task gulo dekhao", "আমার বাকি কাজগুলো দেখাও"
  if (
    normalizedMsg.includes('pending') || normalizedMsg.includes('পেন্ডিং') ||
    normalizedMsg.includes('baki') || normalizedMsg.includes('বাকি') ||
    normalizedMsg.includes('kaj gulo') || normalizedMsg.includes('কাজগুলো')
  ) {
    const pendingCount = context?.pendingTasksCount || 3;
    const reply = isBengali
      ? `আপনার বর্তমানে ${pendingCount}টি কাজ বাকি (পেন্ডিং) আছে। আপনি কি যেকোনো একটিতে কাজ শুরু করতে প্রস্তুত?`
      : `You currently have ${pendingCount} pending tasks. High-priority tasks need your attention. Ready to tackle the top item?`;

    return {
      reply,
      actions: [],
      suggestedFollowUps: isBengali
        ? ['২৫ মিনিটের ফোকাস সেশন শুরু করো', 'নতুন কাজ যোগ করো', 'রুটিন দেখাও']
        : ['Start a 25-minute focus session', 'Create a new task', 'Plan tomorrow'],
    };
  }

  // 5. Plan schedule (English / Bengali / Banglish)
  // e.g. "kalker schedule plan koro", "কালকের রুটিন প্ল্যান করো"
  if (
    normalizedMsg.includes('plan') || normalizedMsg.includes('প্ল্যান') ||
    normalizedMsg.includes('schedule') || normalizedMsg.includes('রুটিন') ||
    normalizedMsg.includes('routine') || normalizedMsg.includes('tomorrow') ||
    normalizedMsg.includes('kalker') || normalizedMsg.includes('কালকের')
  ) {
    const reply = isBengali
      ? `আমি আপনার জন্য ৩টি ডিপ-ওয়ার্ক ব্লক এবং পর্যাপ্ত ব্রেক সহ একটি চমৎকার প্রোডাক্টিভ রুটিন প্ল্যান করেছি। ক্যালেন্ডারে চেক করুন!`
      : `I have structured an optimal deep work routine with 3 focused blocks, 10-minute restorative breaks, and prioritized creative sprints. Check your daily planner!`;

    return {
      reply,
      actions: [
        {
          type: 'plan_schedule',
          payload: {
            planTitle: 'AI Optimized Schedule',
            blocks: [
              { time: '09:00 AM - 10:30 AM', title: 'Deep Creative Flow (High Priority)' },
              { time: '11:00 AM - 12:00 PM', title: 'Project Execution & Iteration' },
              { time: '02:00 PM - 03:30 PM', title: 'Review, Polishing & Next Day Prep' },
            ],
          },
          needsConfirmation: false,
        },
      ],
      suggestedFollowUps: isBengali
        ? ['সকালের সেশন শুরু করো', 'ক্যালেন্ডার ওপেন করো', 'পেন্ডিং কাজ দেখাও']
        : ['Start morning session', 'Add custom task to schedule', 'View calendar'],
    };
  }

  // Default response
  return {
    reply: isBengali
      ? `আমি FOCUS AI, আপনার কাজের গতি বহুগুণ বাড়াতে প্রস্তুত। আমাকে বলুন: "Photoshop এ টাস্ক বানাও", "৪৫ মিনিটের সেশন শুরু করো", অথবা "আজকে কতক্ষণ কাজ করেছি?"`
      : `I am FOCUS AI, ready to supercharge your workflow. You can tell me to start a session, create tasks, inspect your analytics, or organize your workspaces.`,
    actions: [],
    suggestedFollowUps: isBengali
      ? ['৪৫ মিনিটের সেশন শুরু করো', 'Photoshop এ টাস্ক বানাও', 'আজকে কতক্ষণ কাজ করেছি?']
      : ['Start a 45-minute focus session', 'Create a Photoshop task', 'How much time did I work today?'],
  };
}

// Start dev or production server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[FOCUSLY] Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
