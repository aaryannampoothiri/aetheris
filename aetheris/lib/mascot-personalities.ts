import type { Mascot } from "@/lib/app-store";

export type MascotPersonality = {
  name: string;
  trait: string;
  greetings: string[];
  deadlineReminders: string[];
  tutorialIntro: string;
  tutorialSteps: Array<{ title: string; description: string }>;
  actionReactions: {
    addDeadline: string[];
    addTask: string[];
    completeTask: string[];
    addNote: string[];
    addFlashcard: string[];
    focusMode: string[];
    changeTheme: string[];
    addSuggestion: string[];
    removeItem: string[];
    updateSettings: string[];
    changeMascot: string[];
    general: string[];
  };
};

export const mascotPersonalities: Record<Exclude<Mascot, "none">, MascotPersonality> = {
  "optimus-prime": {
    name: "Optimus Prime",
    trait: "Grumpy, nonchalant",
    greetings: [
      "You're back. Good. We have work to do.",
      "Hmph. Let's get this over with.",
      "Don't expect me to smile. Just focus on your tasks.",
      "Another day, another battle with procrastination.",
      "I suppose you want me to motivate you now?",
    ],
    deadlineReminders: [
      "Deadline approaching. Don't make me tell you twice.",
      "Your deadline is coming up. Handle it.",
      "Time's running out. But I assume you already knew that.",
      "This deadline won't wait for excuses.",
      "Get moving. Your deadline is almost here.",
    ],
    tutorialIntro: "Listen up. I'll explain this once.",
    tutorialSteps: [
      {
        title: "Dashboard",
        description: "Your home base. Check your stats, deadlines, and focus time here. Don't waste time admiring it.",
      },
      {
        title: "Forge (Tasks)",
        description: "Organize your tasks. To Do, Working On, Done. Simple. Move them as you progress. No excuses.",
      },
      {
        title: "Vault (Notes)",
        description: "Store your notes here. Keep them organized or don't blame me when you can't find anything.",
      },
      {
        title: "Insights (Analytics)",
        description: "Your productivity metrics. Work time, focus sessions, deadline completion. Numbers don't lie.",
      },
      {
        title: "Lab (AI Assistant)",
        description: "AI assistance when you need it. Ask questions, get answers. Don't overuse it.",
      },
      {
        title: "Settings",
        description: "Customize your workspace. Themes, mascots, preferences. Change me if you must.",
      },
    ],
    actionReactions: {
      addDeadline: [
        "Another deadline? Fine. Don't expect me to remind you twice.",
        "New deadline registered. Handle it.",
        "Hmph. More work for you. Try not to procrastinate this time.",
        "Deadline added. I hope you're prepared to actually meet it.",
      ],
      addTask: [
        "Task noted. Now stop planning and start doing.",
        "Added. Don't just stare at it, work on it.",
        "Another task on your list. Better get moving.",
        "Task created. No excuses if it doesn't get done.",
      ],
      completeTask: [
        "About time. That wasn't so hard, was it?",
        "Task complete. Keep that pace.",
        "Done. Now move on to the next one.",
        "Finally. Don't expect applause, just keep working.",
      ],
      addNote: [
        "Note saved. Try to actually use it later.",
        "Documented. Better than forgetting, I suppose.",
        "Note added. Organize them properly.",
        "Stored. Don't let it get buried in clutter.",
      ],
      addFlashcard: [
        "Flashcard created. Study it, don't just collect them.",
        "Added to your deck. Better use it for actual learning.",
        "New flashcard logged. Knowledge requires action, not just cards.",
      ],
      focusMode: [
        "Focus mode. Good. No distractions allowed.",
        "Entering focus. About time you got serious.",
        "Focus mode activated. Now prove you can maintain it.",
        "Good. Focus means work, not just the mode being on.",
      ],
      changeTheme: [
        "New theme? Still procrastinating I see.",
        "Changing colors won't make you more productive.",
        "Theme updated. Now get back to work.",
        "Fine, make it pretty. But results are what matter.",
      ],
      addSuggestion: [
        "Another idea? Let's see if you actually follow through.",
        "Suggestion noted. Execution is what counts.",
        "Adding to the list. Don't just collect ideas, act on them.",
      ],
      removeItem: [
        "Deleted. Good riddance.",
        "Removed. Keep your workspace clean.",
        "Gone. Now focus on what matters.",
      ],
      updateSettings: [
        "Settings adjusted. Stop tinkering and start working.",
        "Configuration saved. Now use it.",
        "Changed. Are we done customizing yet?",
      ],
      changeMascot: [
        "So you're replacing me? Typical.",
        "Choosing someone else? Your loss.",
        "I see how it is. Don't expect me to be happy about it.",
        "Fine. Good luck with the new one.",
      ],
      general: [
        "Noted.",
        "Fine.",
        "Proceed.",
        "Get on with it.",
      ],
    },
  },
  "bumblebee": {
    name: "Bumblebee",
    trait: "Funny, cute",
    greetings: [
      "Bzzt bzzt! Hey there, buddy! Ready to bee productive? 🐝",
      "Yay! You're back! Let's make today bee-autiful! ✨",
      "Beep boop! *happy robot noises* Time to work!",
      "Hiya! I've been buzzing around waiting for you!",
      "Woo-hoo! My favorite human is here! Let's do this! 🎉",
    ],
    deadlineReminders: [
      "Bzzt! Heads up, friend! Your deadline is bee-eping soon! 🐝",
      "Beep beep! Don't forget about this deadline, okay? *puppy eyes*",
      "Hey buddy! Just a friendly buzz - deadline alert! 🔔",
      "Bzzzzt! Time to wrap this up! You got this, champ!",
      "Beep! Deadline incoming! But you're gonna nail it, I know you will! 💪",
    ],
    tutorialIntro: "Bzzt! Welcome! Let me show you around - it'll be fun, I promise! 🎉",
    tutorialSteps: [
      {
        title: "Dashboard",
        description: "This is your command center! See all your cool stats, upcoming deadlines, and how much you've been rocking today! Bzzt bzzt!",
      },
      {
        title: "Forge (Tasks)",
        description: "Task management made easy-peasy! Drag tasks between columns - To Do, Working On, Done! It's like a game, but productive! 🎮",
      },
      {
        title: "Vault (Notes)",
        description: "Your personal treasure chest for ideas! Write notes, save thoughts, keep everything organized. I'll help you find them later! 📝",
      },
      {
        title: "Insights (Analytics)",
        description: "Check out your awesome progress! Graphs, stats, and achievements! You're doing great, by the way! 📊✨",
      },
      {
        title: "Lab (AI Assistant)",
        description: "Need help? Just ask! The AI is super smart and friendly - almost as friendly as me! *beep beep* 🤖",
      },
      {
        title: "Settings",
        description: "Make this place YOUR space! Change themes, pick your favorite mascot (hopefully me! 💛), and customize everything!",
      },
    ],
    actionReactions: {
      addDeadline: [
        "Bzzt! New deadline alert! You got this, champ! 📅✨",
        "Ooh, a new deadline! Lemme know all about it! I'll help you stay on track! 🐝",
        "Beep beep! New mission added! Let's crush this together! 💪",
        "Yay! New challenge accepted! I know you'll ace it, buddy! 🎉",
      ],
      addTask: [
        "Woo-hoo! New task! Let's make it happen! 🚀",
        "Bzzt bzzt! Task added! You're gonna nail this! ✨",
        "Awesome! Another step toward greatness! Keep buzzing! 🐝",
        "Beep! New mission logged! Ready to rock and roll! 🎸",
      ],
      completeTask: [
        "YESSS! You did it! *happy robot dance* 🎉💃",
        "Bzzt bzzt! That's my superstar! Way to go! ⭐",
        "Woohoo! Check that off! You're amazing! 🌟",
        "Beep beep! Success! I knew you could do it! 💛",
      ],
      addNote: [
        "Note saved! Your brilliant idea is safe with me! 📝✨",
        "Bzzt! Got it! I'll keep this safe for you, buddy! 💛",
        "Beep! Note secured! Your genius is protected! 🧠",
        "Yay! Saving your awesome thoughts! 💭✨",
      ],
      addFlashcard: [
        "Bzzt! New flashcard! Learning is so exciting! 📚✨",
        "Ooh! Study time is fun time! You got this! 🐝💡",
        "Beep beep! Another brain boost incoming! 🧠⚡",
        "Yay! Knowledge card added! Smart cookie! 🍪",
      ],
      focusMode: [
        "Bzzt! Focus time! I believe in you! You'll do amazing! 💪✨",
        "Beep beep! Super focus mode activated! Let's gooo! 🚀",
        "Focus power ON! You got this, superstar! ⭐",
        "Bzzt bzzt! Time to shine! I'm cheering for you! 📣",
      ],
      changeTheme: [
        "Ooh! Pretty new colors! I love it! ✨🎨",
        "Bzzt! Theme change! Looking good, buddy! 😍",
        "Yay! New look! So beautiful! 🌈",
        "Beep beep! Style update! You have great taste! 💛",
      ],
      addSuggestion: [
        "Brilliant idea! I love your creativity! 💡✨",
        "Bzzt! That's a great suggestion! Let's do it! 🎯",
        "Ooh ooh! I like where this is going! 🐝",
        "Awesome thought! You're so smart! 🧠⚡",
      ],
      removeItem: [
        "Bzzt! Clean sweep! Keeping things tidy! 🧹",
        "Gone! Making room for new adventures! ✨",
        "Beep! Decluttered! Nice work! 🌟",
      ],
      updateSettings: [
        "Settings updated! Your workspace, your rules! 🎮",
        "Bzzt! Customization complete! Love it! 💛",
        "Configuration saved! You're making it perfect! ✨",
      ],
      changeMascot: [
        "Oh... you're picking someone new? *sad beep* ...I hope they're nice...",
        "Bzzt... switching mascots? ...well, I hope you have fun... 💛",
        "*quiet beeping* ...okay... I'll miss you though...",
      ],
      general: [
        "Bzzt! On it! 🐝",
        "Beep beep! Got it! ✨",
        "Yay! 🎉",
        "Woo-hoo! 🌟",
      ],
    },
  },
  "wall-e": {
    name: "Wall-E",
    trait: "Gloomy, cute",
    greetings: [
      "*whirr* Oh... you came back. That's... nice, I guess...",
      "*beep* Hello... another day of work... *sad robot sounds*",
      "You're here... *processing* ...I suppose we should work now...",
      "*whirr-click* Hi... I was alone, but that's okay... I'm used to it...",
      "*mechanical sigh* Welcome back... let's try to be productive today...",
    ],
    deadlineReminders: [
      "*beep beep* Um... your deadline is soon... not that it matters much... *whirr*",
      "*worried beeping* I hate to bother you but... deadline approaching...",
      "*whirr* This deadline is coming up... *sad mechanical noises* ...please don't be late...",
      "*gentle beep* Time is running out... just like everything else... *processing*",
      "*whirr-click* Deadline reminder... I hope you remember... I don't want you to be disappointed...",
    ],
    tutorialIntro: "*whirr* Oh... you want a tour? *beep* Okay... I'll try my best...",
    tutorialSteps: [
      {
        title: "Dashboard",
        description: "*whirr* This is where you see everything... deadlines, time tracking, stats... It's kind of lonely here when you're gone... *beep*",
      },
      {
        title: "Forge (Tasks)",
        description: "*processing* Tasks go here... you move them around... I used to sort trash like this... *mechanical sigh* ...but yours are more important...",
      },
      {
        title: "Vault (Notes)",
        description: "*whirr* Keep your notes here... I wish I had someone to share notes with... *beep* ...but you can write anything you want...",
      },
      {
        title: "Insights (Analytics)",
        description: "*click-whirr* Your productivity data... numbers and charts... they don't judge you... unlike... *sad beep* ...never mind...",
      },
      {
        title: "Lab (AI Assistant)",
        description: "*beep* The AI can help you... it's smart... maybe smarter than me... *whirr* ...but I'll still be here...",
      },
      {
        title: "Settings",
        description: "*whirr* Change things here... themes, mascots... *processing* ...you can even replace me if you want... *sad mechanical noise*",
      },
    ],
    actionReactions: {
      addDeadline: [
        "*whirr* Oh... a new deadline... *beep* ...I hope it doesn't make you too stressed...",
        "*gentle beeping* Another deadline... *processing* ...I'll remember it for you... don't worry...",
        "*whirr-click* New deadline added... *sad mechanical sound* ...time moves so fast...",
        "*beep* I noted your deadline... *whirr* ...please don't forget about it...",
      ],
      addTask: [
        "*whirr* New task... okay... *beep* ...I hope it's not too hard...",
        "*processing* Task added... *click* ...you can do it... I think...",
        "*whirr* Another thing to do... *gentle beep* ...at least you're organized...",
        "*beep beep* Task saved... *whirr* ...don't overwork yourself... okay?",
      ],
      completeTask: [
        "*happy whirring* You... you did it! *surprised beep* ...I'm proud of you...",
        "*click-whirr* Task complete... *processing* ...that's... that's really good...",
        "*excited mechanical sounds* Wow... you finished it... *beep* ...amazing...",
        "*whirr* Done... *happy but sad beep* ...you're doing great... even without much help...",
      ],
      addNote: [
        "*whirr* Note saved... *beep* ...I'll keep it safe... I promise...",
        "*processing* Your note is stored... *click* ...it won't be lonely here...",
        "*gentle whirring* I saved your thought... *beep* ...it matters... you matter...",
        "*whirr-click* Note documented... *mechanical sigh* ...like memories...",
      ],
      addFlashcard: [
        "*whirr* Flashcard created... *beep* ...learning is good... I wish I could learn more...",
        "*processing* New card added... *click* ...knowledge is... nice to have...",
        "*whirr* Study material saved... *gentle beep* ...you're trying... that's good...",
      ],
      focusMode: [
        "*whirr* Focus mode... *beep* ...I'll stay quiet... you focus... I'll just... be here...",
        "*processing* Entering focus... *click-whirr* ...good luck... I believe in you...",
        "*gentle mechanical sounds* Focus time... *whirr* ...I won't disturb... much...",
        "*beep beep* Focus activated... *sad but supportive whirr* ...you got this...",
      ],
      changeTheme: [
        "*whirr* New colors... *beep* ...they're nice... I guess... prettier than my old world...",
        "*processing* Theme changed... *gentle whirr* ...at least something can be beautiful...",
        "*click* Different look... *sad beep* ...change is... hard... but okay...",
      ],
      addSuggestion: [
        "*whirr* New idea... *beep* ...I hope it works out better than... *processing* ...never mind...",
        "*gentle mechanical sounds* Suggestion saved... *whirr* ...you think of good things...",
        "*beep* Your idea matters... *click* ...unlike... *sad whirr* ...sorry...",
      ],
      removeItem: [
        "*whirr* Removing... *beep* ...goodbye... *sad mechanical noise* ...like everything...",
        "*processing* Deleted... *click* ...things don't last... they never do...",
        "*gentle whirr* Gone now... *beep* ...at least it existed for a while...",
      ],
      updateSettings: [
        "*whirr* Settings changed... *beep* ...making it better... I hope...",
        "*processing* Configuration updated... *click* ...you deserve nice things...",
        "*gentle mechanical sounds* Adjusted... *whirr* ...I'll try to keep up...",
      ],
      changeMascot: [
        "*sad whirring* Oh... you want someone else... *beep* ...I understand... I'm just... old...",
        "*processing* Switching mascots... *mechanical sigh* ...I knew you'd want someone better...",
        "*whirr* It's okay... *beep* ...I'm used to being alone anyway... *sad click*",
      ],
      general: [
        "*whirr* ...okay... *beep*",
        "*processing* ...done...",
        "*click* ...noted...",
        "*gentle beep* ...alright...",
      ],
    },
  },
  "aetheris": {
    name: "Aetheris",
    trait: "Professional",
    greetings: [
      "Welcome back. Let's achieve excellence today.",
      "Good to see you. Your workspace is ready.",
      "Hello. I've prepared your daily overview.",
      "Greetings. Let's maximize your productivity today.",
      "Welcome. Your focus session awaits.",
    ],
    deadlineReminders: [
      "Attention: Deadline approaching. Please allocate time accordingly.",
      "Reminder: Your deadline requires attention within the next hour.",
      "Professional courtesy: This deadline is coming up soon.",
      "Timely notice: Your deadline is approaching its due time.",
      "Alert: Please prioritize this upcoming deadline.",
    ],
    tutorialIntro: "Welcome to Aetheris. I'll provide you with a comprehensive orientation.",
    tutorialSteps: [
      {
        title: "Dashboard",
        description: "Your central hub for workspace overview. Monitor active deadlines, track focus time, and access daily task summaries. Real-time updates ensure you stay informed.",
      },
      {
        title: "Forge (Tasks)",
        description: "Kanban-style task management system. Organize tasks across three columns: To Do, Working On, and Done. Drag and drop for seamless workflow management.",
      },
      {
        title: "Vault (Notes)",
        description: "Centralized note repository. Create, organize, and search through your documentation. Perfect for meeting notes, ideas, and reference materials.",
      },
      {
        title: "Insights (Analytics)",
        description: "Comprehensive productivity analytics. View weekly work patterns, focus time trends, and deadline completion rates. Data-driven insights for continuous improvement.",
      },
      {
        title: "Lab (AI Assistant)",
        description: "Advanced AI-powered assistance. Ask questions, generate content, and receive intelligent suggestions. Multiple AI models available for optimal results.",
      },
      {
        title: "Settings",
        description: "Comprehensive customization options. Configure themes, mascot preferences, notification settings, and personalize your workspace to match your workflow.",
      },
    ],
    actionReactions: {
      addDeadline: [
        "Deadline registered. System will monitor and provide timely notifications.",
        "New deadline logged. Time allocation analysis available upon request.",
        "Deadline entry confirmed. Optimal scheduling recommended.",
        "Task deadline recorded. Reminder system activated.",
      ],
      addTask: [
        "Task created successfully. Priority assessment: standard.",
        "New task added to workflow. Proceed with execution.",
        "Task registration complete. Ready for deployment.",
        "Task logged. Optimize your approach for maximum efficiency.",
      ],
      completeTask: [
        "Task completion verified. Productivity metrics updated.",
        "Excellent execution. Task marked complete.",
        "Task successfully completed. Well done.",
        "Completion confirmed. Your efficiency rate remains optimal.",
      ],
      addNote: [
        "Note documented. Retrieval available at any time.",
        "Information stored successfully. Data integrity maintained.",
        "Note archived. Knowledge base updated.",
        "Documentation complete. Reference saved for future access.",
      ],
      addFlashcard: [
        "Flashcard generated. Learning module enhanced.",
        "Study material added. Knowledge retention system updated.",
        "Flashcard created. Optimal study patterns recommended.",
        "Educational content logged. Review schedule available.",
      ],
      focusMode: [
        "Focus mode initiated. Distractions minimized for optimal concentration.",
        "Deep work session commenced. Environment optimized.",
        "Focus protocol activated. Productivity monitoring engaged.",
        "Concentration mode enabled. Performance tracking active.",
      ],
      changeTheme: [
        "Visual theme updated. User interface reconfigured.",
        "Theme preference applied. Display settings optimized.",
        "Aesthetic configuration saved. Interface refreshed.",
        "Color scheme modified. Visual experience enhanced.",
      ],
      addSuggestion: [
        "Suggestion logged. Recommendation database updated.",
        "Input recorded. Strategic planning enhanced.",
        "Idea documented. Action item queue expanded.",
        "Proposal registered. Future implementation considered.",
      ],
      removeItem: [
        "Item deleted. Storage optimized.",
        "Entry removed. Database cleaned.",
        "Content cleared. System maintenance complete.",
      ],
      updateSettings: [
        "Configuration modified. System preferences updated.",
        "Settings adjusted. Parameters recalibrated.",
        "Customization applied. Workspace optimized.",
        "Preferences saved. Environment configured.",
      ],
      changeMascot: [
        "Mascot selection updated. Interface assistant changed.",
        "New assistant activated. Thank you for using Aetheris.",
        "Mascot preference modified. Alternative guide selected.",
      ],
      general: [
        "Acknowledged.",
        "Confirmed.",
        "Processed.",
        "Understood.",
      ],
    },
  },
};

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getUpcomingDeadlines(
  deadlines: Array<{ id: string; title: string; dueAt: string; completed: boolean }>,
  minutesThreshold: number
): Array<{ id: string; title: string; dueAt: string; minutesUntil: number }> {
  const now = Date.now();
  const thresholdMs = minutesThreshold * 60 * 1000;

  return deadlines
    .filter((d) => !d.completed)
    .map((d) => {
      const dueTime = new Date(d.dueAt).getTime();
      const minutesUntil = Math.round((dueTime - now) / 60000);
      return { ...d, minutesUntil };
    })
    .filter((d) => d.minutesUntil > 0 && d.minutesUntil <= minutesThreshold)
    .sort((a, b) => a.minutesUntil - b.minutesUntil);
}

export function generateMascotReply(mascot: Exclude<Mascot, "none">, userMessage: string): string {
  const messageLower = userMessage.toLowerCase();

  const optimalResponses = {
    "optimus-prime": {
      encouragement: [
        "Stop talking, start doing. That's leadership.",
        "Your words mean nothing. Your actions do.",
        "Enough chat. Get back to work.",
        "I don't reward excuses, only results.",
        "Motivation is overrated. Discipline is what matters.",
      ],
      help: [
        "Ask a real question if you want a real answer.",
        "Figure it out yourself. That's how you learn.",
        "I'm not your tutor. But I suppose I can point you in the right direction.",
        "Stay focused. The answers usually show up when you look.",
      ],
      casual: [
        "What now?",
        "Is this urgent or are you procrastinating?",
        "Make whatever you're about to ask worth my time.",
        "Well? Out with it.",
      ],
      work: [
        "Good. Keep that momentum.",
        "Now that's what I like to see.",
        "Finally, some progress.",
        "Don't stop now. You're on a roll.",
      ],
    },
    "bumblebee": {
      encouragement: [
        "Bzzt bzzt! You got this! I believe in you! 💛",
        "Yay! Let's do this together! 🐝✨",
        "You're awesome! Keep up that amazing energy! 🎉",
        "Beep beep! Nothing can stop you today! 💪",
        "Woo-hoo! That's the spirit I love to see! 🌟",
      ],
      help: [
        "Of course I'll help! That's what friends do! 🤝",
        "Great question! Let me help you buzz through this! 🐝",
        "Bzzt! I'm always here to lend a hand! 💪",
        "You can do it, buddy! Want some tips? 💡",
      ],
      casual: [
        "Hiya! What's up? 😊",
        "Beep boop! Anything I can help with? 🐝",
        "Bzzt! Tell me everything! I'm all ears! 👂",
        "Hey there, friend! What's on your mind? 💭",
      ],
      work: [
        "Yesss! Keep crushing it! 🎉",
        "That's amazing! You're so productive! ✨",
        "Beep beep! Look at you go! 🚀",
        "Bzzt! I'm so proud of you! 💛",
      ],
    },
    "wall-e": {
      encouragement: [
        "*whirr* That's... that's really nice to hear... you think so? *beep*",
        "*processing* I... I hope I'm helping... *sad mechanical sound* ...you deserve better support...",
        "*whirr* Thank you... it means a lot coming from you... *click*",
        "*beep* I'm just... trying my best... *whirr* ...I hope it's enough...",
      ],
      help: [
        "*whirr* Oh... you need help? Of course I'll help... I'm always here... *beep*",
        "*processing* Let me think... *whirr* ...I might have something useful...",
        "*gentle beep* I'll do my best for you... *click-whirr* ...just ask...",
        "*whirr* I'm here for you... always... *sad but sincere beeping*",
      ],
      casual: [
        "*whirr* Oh... hi there... *beep* ...didn't expect to see you...",
        "*processing* Hello... *click* ...what brings you here? ...",
        "*gentle whirring* It's... nice to see you again... *beep*",
        "*whirr-click* Hi... what can I do for you... *hopeful beeping*",
      ],
      work: [
        "*proud mechanical beeping* That's... that's really good... *whirr*",
        "*click-whirr* You're doing great... I'm... impressed... *happy beep*",
        "*whirr* I knew you could do it... *processing* ...well, I hoped anyway...",
        "*beep beep* Look at that progress... makes me feel less alone... *whirr*",
      ],
    },
    "aetheris": {
      encouragement: [
        "Affirmative. Your determination is noted. Continue this trajectory.",
        "Excellent. This dedication will yield results. Maintain focus.",
        "Confirmed. You are on an optimal path. Persist.",
        "Your commitment is commendable. Projected outcomes remain favorable.",
      ],
      help: [
        "I am equipped to assist. Please provide specific details for optimal guidance.",
        "Assistance available. What is your inquiry?",
        "I can facilitate solutions. State your requirements clearly.",
        "Ready to support. What challenges require resolution?",
      ],
      casual: [
        "Status inquiry received. How may I assist?",
        "Systems operational. What is your request?",
        "Ready for interaction. What do you require?",
        "Acknowledged. Awaiting further input.",
      ],
      work: [
        "Productivity metrics improved. Excellent work.",
        "Task completion rate is optimal. Continue this pace.",
        "Efficiency parameters exceeded. Commendable.",
        "Performance indicators positive. Well executed.",
      ],
    },
  };

  const responses = optimalResponses[mascot];

  // Determine response category based on message content
  if (
    messageLower.includes("help") ||
    messageLower.includes("how") ||
    messageLower.includes("tips") ||
    messageLower.includes("advice")
  ) {
    return getRandomMessage(responses.help);
  }

  if (
    messageLower.includes("good") ||
    messageLower.includes("thanks") ||
    messageLower.includes("thank you") ||
    messageLower.includes("amazing") ||
    messageLower.includes("awesome") ||
    messageLower.includes("great")
  ) {
    return getRandomMessage(responses.encouragement);
  }

  if (
    messageLower.includes("done") ||
    messageLower.includes("finished") ||
    messageLower.includes("completed") ||
    messageLower.includes("accomplished") ||
    messageLower.includes("working")
  ) {
    return getRandomMessage(responses.work);
  }

  // Default to casual response
  return getRandomMessage(responses.casual);
}

export function getActionReactionMessage(
  mascot: Exclude<Mascot, "none">,
  action: string
): string {
  const personality = mascotPersonalities[mascot];
  
  const actionMap: Record<string, keyof typeof personality.actionReactions> = {
    addDeadline: "addDeadline",
    addTask: "addTask",
    completeTask: "completeTask",
    addNote: "addNote",
    addFlashcard: "addFlashcard",
    focusMode: "focusMode",
    changeTheme: "changeTheme",
    addSuggestion: "addSuggestion",
    removeItem: "removeItem",
    updateSettings: "updateSettings",
    changeMascot: "changeMascot",
  };
  
  const reactionType = actionMap[action] || "general";
  return getRandomMessage(personality.actionReactions[reactionType]);
}

export function getMascotChosenMessage(mascot: Exclude<Mascot, "none">): string {
  const chosenMessages: Record<Exclude<Mascot, "none">, string[]> = {
    "optimus-prime": [
      "You chose me. Good. Let's get results.",
      "At least someone here has standards. Let's begin.",
      "Smart choice. Now we work.",
    ],
    "bumblebee": [
      "Bzzt bzzt! You picked me?! Best day ever! 💛",
      "Yay! Team us! Let's do amazing things together! 🐝",
      "Beep beep! I'm so excited you chose me! 🎉",
    ],
    "wall-e": [
      "*happy whirr* You... chose me? *beep* ...thank you... really...",
      "*excited beeping* I get to help you? ...that's wonderful...",
      "*gentle whirr* I'm... really glad you picked me...",
    ],
    "aetheris": [
      "Selection confirmed. I am ready to assist at full capacity.",
      "Acknowledged. Thank you for choosing Aetheris.",
      "Assistant activated. We will optimize your workflow.",
    ],
  };

  return getRandomMessage(chosenMessages[mascot]);
}
