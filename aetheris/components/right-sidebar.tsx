"use client";

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Zap, X } from "lucide-react";
import { useAppStore } from "@/lib/app-store";

const modelOptions = [
  { id: "gemini" as const, name: "Gemini", desc: "Ecosystem integration" },
  { id: "claude" as const, name: "Claude", desc: "Deep reasoning" },
  { id: "deepseek" as const, name: "DeepSeek", desc: "Code generation" },
];

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type TaskItem = {
  id: string;
  title: string;
  completed: boolean;
};

type KnowledgeItem = {
  id: string;
  source: "note" | "task";
  title: string;
  content: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
  slot: "morning" | "afternoon" | "evening";
  weekOffset: number;
};

type Intent = "plan" | "summarize" | "code" | "schedule" | "research" | "generic";

function detectIntent(prompt: string): Intent {
  const text = prompt.toLowerCase();
  if (/(plan|steps|roadmap|strategy|break down|next step)/.test(text)) return "plan";
  if (/(summarize|summary|recap|tl;dr|highlights|what does|explain|what is|tell me about)/.test(text))
    return "summarize";
  if (/(code|bug|error|fix|refactor|typescript|react|next\.js|api)/.test(text)) return "code";
  if (/(schedule|calendar|deadline|today|tomorrow|meeting|time block)/.test(text)) return "schedule";
  if (/(research|compare|pros|cons|sources|citations)/.test(text)) return "research";
  return "generic";
}

function buildPlan(prompt: string) {
  return [
    `Clarify the goal in one sentence for: "${prompt}".`,
    "List the top 3 deliverables that prove completion.",
    "Pick one action you can finish in the next 25 minutes and start there.",
  ];
}

function modelPrefix(model: "gemini" | "claude" | "deepseek") {
  if (model === "gemini") return "Gemini";
  if (model === "deepseek") return "DeepSeek";
  return "Claude";
}

function summarizeText(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "I need text to summarize. Try: /summarize <your transcript>.";

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((s) => s.length > 10);

  if (sentences.length === 0) return `Summary: ${cleaned}`;
  if (sentences.length <= 2) return `Summary: ${cleaned}`;
  if (sentences.length <= 5) return `Summary: ${sentences.join(" ")}`;

  // Better algorithm: identify main topics and create coherent summary
  const topicKeywords = {
    what: ["event", "activity", "project", "meeting", "is", "was", "program"],
    when: ["date", "time", "day", "today", "tomorrow", "scheduled", "held", "on"],
    where: ["venue", "location", "place", "at", "room", "building"],
    who: [
      "participants",
      "attendees",
      "people",
      "team",
      "member",
      "coordinator",
      "organizer",
      "student",
    ],
    outcome: [
      "achieved",
      "result",
      "concluded",
      "completed",
      "successfully",
      "outcome",
      "resulted",
    ],
  };

  // Find sentences for each topic
  const topicSentences: Record<string, string> = {};

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      const hasKeyword = keywords.some((kw) => lowerSentence.includes(kw));

      if (hasKeyword && !topicSentences[topic]) {
        topicSentences[topic] = sentence;
      }
    }
  }

  // Build summary from identified topics
  const summary: string[] = [];

  if (topicSentences.what) summary.push(topicSentences.what);
  if (topicSentences.when) summary.push(topicSentences.when);
  if (topicSentences.where) summary.push(topicSentences.where);
  if (topicSentences.who) summary.push(topicSentences.who);
  if (topicSentences.outcome) summary.push(topicSentences.outcome);

  // If we found topic sentences, use them; otherwise, use the best sentences by position
  if (summary.length > 0) {
    return `Summary:\n${summary.map((s) => `• ${s}`).join("\n")}`;
  }

  // Fallback: extract sentences proportionally distributed through the text
  const fallbackSummary = [
    sentences[0],
    sentences[Math.floor(sentences.length / 2)],
    sentences[sentences.length - 1],
  ]
    .filter((s) => s.length > 15)
    .map((s) => `• ${s}`);

  return `Summary:\n${fallbackSummary.join("\n")}`;
}

function extractTaskCandidates(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  // Patterns that indicate action items
  const actionPatterns = [
    /^(review|revise|check|verify|audit|analyze|assess)/i,
    /^(send|email|message|notify|alert|inform)/i,
    /^(create|make|build|develop|design|draft|write)/i,
    /^(fix|resolve|address|handle|manage|deal with|tackle)/i,
    /^(follow up|followup|check in|reconnect|reach out)/i,
    /^(update|refactor|improve|optimize|enhance|upgrade)/i,
    /^(schedule|book|arrange|plan|organize|coordinate)/i,
    /^(approve|sign off|authorize|validate)/i,
    /must|need to|should|have to|required to|needs to/i,
  ];

  const tasks: string[] = [];

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length < 10) continue;

    // Check if sentence matches action patterns
    const isAction = actionPatterns.some((pattern) => pattern.test(trimmedSentence));

    if (isAction) {
      // Clean up the sentence to be a clear task
      let cleanedTask = trimmedSentence
        .replace(/^(need to|should|must|have to|required to)\s*/i, "")
        .replace(/that\s+/i, "")
        .replace(/\sand\s(then|also|furthermore)/i, " -")
        .trim();

      // Capitalize first letter
      cleanedTask = cleanedTask.charAt(0).toUpperCase() + cleanedTask.slice(1);

      // Remove trailing period if last character
      if (cleanedTask.endsWith(".")) {
        cleanedTask = cleanedTask.slice(0, -1);
      }

      if (cleanedTask.length > 5 && !tasks.includes(cleanedTask)) {
        tasks.push(cleanedTask);
      }
    }
  }

  return tasks.slice(0, 8); // Return up to 8 tasks
}

function casualChatReply(prompt: string, model: "gemini" | "claude" | "deepseek") {
  const text = prompt.toLowerCase().trim();
  const prefix = modelPrefix(model);

  if (/^(hi|hello|hey|yo|hola)\b/.test(text)) {
    return `${prefix}: Hey! I can help you organize tasks, summarize documents, or extract action items. What's on your mind?`;
  }

  if (/(what'?s?|who are|your name|who am i|what are you)/.test(text)) {
    return `${prefix}: I'm Aetheris AI. I help you summarize documents, extract tasks, manage your todo list, and organize your work. Try: /task add, /extract-tasks, or just paste text for me to summarize.`;
  }

  if (/(thank|thanks|thx|appreciated)/.test(text)) {
    return `${prefix}: Happy to help! Need me to organize anything else?`;
  }

  if (/(how are you|how r u|how you doin)/.test(text)) {
    return `${prefix}: I'm ready to go. What do you need help with?`;
  }

  if (/(help|what can|what do|guide|show me)/.test(text)) {
    return `${prefix}: I can: summarize text, extract tasks, manage your todo list (/task), search notes, and reschedule events. Just paste text or use /help for all commands.`;
  }

  return `${prefix}: Got it. I can help you summarize, extract tasks, manage your list, or organize information. What would you like to do?`;
}

function parseSearchTerm(prompt: string) {
  const quoted = prompt.match(/["']([^"']+)["']/);
  if (quoted?.[1]) return quoted[1].trim();

  const mentionPattern = prompt.match(/mention\s+(.+)\??$/i);
  if (mentionPattern?.[1]) return mentionPattern[1].trim();

  return "";
}

function parseDayAndSlot(prompt: string) {
  const text = prompt.toLowerCase();
  const day = ["monday", "tuesday", "wednesday", "thursday", "friday"].find((value) =>
    text.includes(value)
  ) as CalendarEvent["day"] | undefined;
  const slot = ["morning", "afternoon", "evening"].find((value) => text.includes(value)) as
    | CalendarEvent["slot"]
    | undefined;

  return { day, slot };
}

function buildExtractedTasksReply(extracted: string[]) {
  if (extracted.length === 0) {
    return "I could not detect action items. Try text with verbs like review, send, fix, draft, implement, or follow up.";
  }

  return `Extracted ${extracted.length} tasks and added them to your list:\n${extracted
    .map((task, idx) => `${idx + 1}. ${task}`)
    .join("\n")}`;
}

const seededKnowledge: KnowledgeItem[] = [
  {
    id: "k-1",
    source: "note",
    title: "Project X kickoff",
    content: "Initial scope for Project X, milestones, and team ownership.",
  },
  {
    id: "k-2",
    source: "note",
    title: "Client recap",
    content: "Project X budget and delivery risks were discussed in the meeting.",
  },
  {
    id: "k-3",
    source: "task",
    title: "Review Project X roadmap",
    content: "Validate dependencies and blockers for Project X.",
  },
];

export function RightSidebar() {
  const showRightSidebar = useAppStore((state) => state.showRightSidebar);
  const toggleRightSidebar = useAppStore((state) => state.toggleRightSidebar);
  const activeModel = useAppStore((state) => state.activeModel);
  const setActiveModel = useAppStore((state) => state.setActiveModel);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "I can help you research, analyze files, or automate workflows. What would you like to explore?",
    },
  ]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: "c-1", title: "Design sync", day: "friday", slot: "afternoon", weekOffset: 0 },
    { id: "c-2", title: "Client follow-up", day: "friday", slot: "afternoon", weekOffset: 0 },
    { id: "c-3", title: "Sprint planning", day: "thursday", slot: "morning", weekOffset: 0 },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  const modelName = useMemo(
    () => modelOptions.find((model) => model.id === activeModel)?.name ?? "AI",
    [activeModel]
  );

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isThinking]);

  const runUtilityCommand = (prompt: string) => {
    const inputText = prompt.trim();
    const lowerInput = inputText.toLowerCase();

    if (/(where did i mention|find .*mention|search for)/i.test(lowerInput)) {
      const term = parseSearchTerm(inputText);
      if (!term) return { reply: "Tell me what to search. Example: Where did I mention 'Project X'?" };

      const dynamicKnowledge: KnowledgeItem[] = [
        ...seededKnowledge,
        ...tasks.map((task) => ({
          id: `task-${task.id}`,
          source: "task" as const,
          title: task.title,
          content: task.title,
        })),
      ];

      const hits = dynamicKnowledge.filter(
        (item) =>
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.content.toLowerCase().includes(term.toLowerCase())
      );

      if (hits.length === 0) {
        return { reply: `No matches found for "${term}" in notes/tasks.` };
      }

      return {
        reply: `Found ${hits.length} related item(s) for "${term}":\n${hits
          .map((item, index) => `${index + 1}. [${item.source}] ${item.title}`)
          .join("\n")}`,
      };
    }

    const naturalAddTask = inputText.match(/^add\s+["']?(.+?)["']?\s+to\s+my\s+list\.?$/i);
    if (naturalAddTask?.[1]) {
      const title = naturalAddTask[1].trim();
      const newTask: TaskItem = {
        id: `${Date.now()}-task`,
        title,
        completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
      return { reply: `Done. I added "${title}" to your task list.` };
    }

    if (/clear my .*afternoon|clear my .*morning|clear my .*evening/i.test(lowerInput)) {
      const { day, slot } = parseDayAndSlot(inputText);
      if (!day || !slot) {
        return { reply: "I could not detect the day/slot. Example: Clear my Friday afternoon." };
      }

      const targets = calendarEvents.filter((event) => event.day === day && event.slot === slot);
      if (targets.length === 0) {
        return { reply: `No events found for ${day} ${slot}.` };
      }

      setCalendarEvents((prev) =>
        prev.map((event) =>
          event.day === day && event.slot === slot
            ? { ...event, weekOffset: event.weekOffset + 1 }
            : event
        )
      );

      return {
        reply: `Cleared ${day} ${slot}. Rescheduled ${targets.length} item(s) to next week:\n${targets
          .map((event, index) => `${index + 1}. ${event.title}`)
          .join("\n")}`,
      };
    }

    if (inputText === "/help") {
      return {
        reply:
          "Quick Commands:\n- /task add <task> - Add to your list\n- /task list - See all tasks\n- /task done <number> - Mark done\n- /summarize <text> - Get the key points\n- /extract-tasks <text> - Turn notes into tasks\n\nOr just type naturally:\n- 'Add buy milk to my list'\n- 'Where did I mention Project X?'\n- 'Clear my Friday afternoon'",
      };
    }

    if (inputText.startsWith("/task add ")) {
      const title = inputText.replace("/task add ", "").trim();
      if (!title) return { reply: "Please provide a task title. Example: /task add Review launch checklist" };

      const newTask: TaskItem = {
        id: `${Date.now()}-task`,
        title,
        completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
      return { reply: `Added task: "${title}"` };
    }

    if (inputText === "/task list") {
      if (tasks.length === 0) return { reply: "No tasks yet. Add one with /task add <task>." };

      const list = tasks
        .map((task, index) => `${index + 1}. [${task.completed ? "x" : " "}] ${task.title}`)
        .join("\n");
      return { reply: `Task list:\n${list}` };
    }

    if (inputText.startsWith("/task done ")) {
      const indexValue = Number(inputText.replace("/task done ", "").trim());
      if (!Number.isInteger(indexValue) || indexValue < 1 || indexValue > tasks.length) {
        return { reply: "Invalid task number. Use /task list to see valid indexes." };
      }

      const task = tasks[indexValue - 1];
      setTasks((prev) =>
        prev.map((item, idx) => (idx === indexValue - 1 ? { ...item, completed: true } : item))
      );
      return { reply: `Marked as done: "${task.title}"` };
    }

    if (inputText.startsWith("/summarize ")) {
      const content = inputText.replace("/summarize ", "");
      return { reply: summarizeText(content) };
    }

    const wantsTaskExtraction =
      inputText.startsWith("/extract-tasks") ||
      /(extract.*task|action items?|todos? from)/i.test(lowerInput);

    if (wantsTaskExtraction) {
      const inlineContent = inputText.startsWith("/extract-tasks")
        ? inputText.replace("/extract-tasks", "").trim()
        : "";

      if (!inlineContent.trim()) {
        return {
          reply: "No text to extract from. Example: /extract-tasks Review meeting notes and approve budget proposal",
        };
      }

      const extracted = extractTaskCandidates(inlineContent);

      const newTasks = extracted.map((title) => ({
        id: `${Date.now()}-${title}`,
        title,
        completed: false,
      }));
      setTasks((prev) => [...prev, ...newTasks]);

      return {
        reply: buildExtractedTasksReply(extracted),
      };
    }

    return null;
  };

  const createModelReply = (prompt: string) => {
    const utility = runUtilityCommand(prompt);
    if (utility) return utility.reply;

    const intent = detectIntent(prompt);
    const prefix = modelPrefix(activeModel);

    // Auto-detect long text pasting and summarize
    if (prompt.trim().length > 200 && !prompt.startsWith("/")) {
      const words = prompt.trim().split(/\s+/).length;
      if (words > 30) {
        return `${prefix}: ${summarizeText(prompt)}`;
      }
    }

    if (intent === "plan") {
      const steps = buildPlan(prompt)
        .map((step, index) => `${index + 1}. ${step}`)
        .join(" ");
      return `${prefix}: Great ask. Here is a focused execution plan. ${steps}`;
    }

    if (intent === "summarize") {
      // Extract the actual content to summarize (remove command keywords)
      const contentToSummarize = prompt
        .replace(/(summarize|summary|recap|tl;dr|highlights|what does|explain|what is|tell me about)\s*/gi, "")
        .trim();

      if (contentToSummarize.length < 20) {
        return `${prefix}: I can summarize this in three layers: key outcomes, open risks, and immediate actions. Share the source notes and I will return a concise recap plus a one-paragraph executive summary.`;
      }

      return `${prefix}: ${summarizeText(contentToSummarize)}`;
    }

    if (intent === "code") {
      if (activeModel === "deepseek") {
        return `${prefix}: I will debug this as code-first. Please share the error text and file path. I will propose a patch, edge-case checks, and a quick validation command.`;
      }
      return `${prefix}: For this technical issue, we should isolate repro steps, inspect the failing component path, then patch and validate with lint/build.`;
    }

    if (intent === "schedule") {
      return `${prefix}: Suggested schedule: 1) 45-minute deep block for the hardest task, 2) 20-minute admin sweep, 3) 15-minute review buffer before deadline. If you share due times, I can optimize it.`;
    }

    if (intent === "research") {
      return `${prefix}: I can structure research into: objective, comparison criteria, and source-backed recommendation. Tell me the topic and decision you need to make.`;
    }

    return casualChatReply(prompt, activeModel);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: createModelReply(trimmed),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 550);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {showRightSidebar && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 h-screen w-80 border-l border-white/10 bg-black/40 backdrop-blur-xl"
          >
            <div className="flex h-full min-h-0 flex-col p-4">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide text-slate-200">AI CHAT</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMessages([
                        {
                          id: "welcome",
                          role: "assistant",
                          text: "I can help you research, analyze files, or automate workflows. What would you like to explore?",
                        },
                      ]);
                      setInput("");
                    }}
                    className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-white/10"
                    aria-label="Clear chat"
                    title="New chat"
                  >
                    New
                  </button>
                  <button
                    onClick={toggleRightSidebar}
                    className="rounded-lg p-1 hover:bg-white/10"
                    aria-label="Close sidebar"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Model Selector */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <Zap className="h-3 w-3" />
                  <span>ACTIVE MODEL</span>
                </div>
                <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                  {modelOptions.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setActiveModel(model.id)}
                      className={`flex w-full flex-col items-start rounded-lg border px-3 py-2 text-left transition ${
                        activeModel === model.id
                          ? "border-cyan-300/40 bg-cyan-300/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-200">{model.name}</span>
                      <span className="text-xs text-slate-400">{model.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Chat */}
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  <span>{modelName} is ready</span>
                </div>
                <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 text-sm text-slate-300">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-lg p-3 ${
                        message.role === "assistant"
                          ? "border border-white/10 bg-white/5"
                          : "ml-8 border border-cyan-300/30 bg-cyan-300/10"
                      }`}
                    >
                      <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">
                        {message.role === "assistant" ? modelName : "You"}
                      </p>
                      <p>{message.text}</p>
                    </div>
                  ))}
                  {isThinking ? (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
                      {modelName} is thinking...
                    </div>
                  ) : null}
                </div>

                {/* Input */}
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Type your message</p>
                  <p className="mb-2 text-[10px] text-slate-500">
                    Try: /help, /task add, /task list, /summarize, /extract-tasks
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder={`Message ${modelName}...`}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                    />
                    <button
                      type="button"
                      onClick={() => void sendMessage()}
                      disabled={isThinking || !input.trim()}
                      className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 p-2 text-cyan-200 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
