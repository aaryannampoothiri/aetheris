"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getActionReactionMessage, getMascotChosenMessage } from "@/lib/mascot-personalities";

export type WorkMode = "deep-work" | "planning" | "balanced";
export type ThemeMode = "light" | "dark" | "system";
export type TaskColumn = "To Do" | "Working On" | "Done";
export type VisualThemePreset =
  | "aetheris"
  | "diwali"
  | "holi"
  | "forest"
  | "sunset"
  | "valentine"
  | "batman";
export type Mascot = "optimus-prime" | "bumblebee" | "wall-e" | "aetheris" | "none";

export type FontFamily = 
  | "space-grotesk" 
  | "sora" 
  | "inter" 
  | "roboto" 
  | "open-sans" 
  | "lato" 
  | "poppins" 
  | "montserrat" 
  | "raleway"
  | "playfair-display"
  | "merriweather"
  | "lora"
  | "georgia"
  | "times-new-roman"
  | "courier-new"
  | "source-code-pro"
  | "jetbrains-mono"
  | "fira-code"
  | "ubuntu-mono";

export type PersonalThemeSettings = {
  enabled: boolean;
  name: string;
  textColor: string;
  fontFamily: FontFamily;
  fontSize: number;
};

type ScreenSaverSettings = {
  enabled: boolean;
  message: string;
  color: string;
  speedSeconds: number;
};

type DeadlineReminderSettings = {
  enabled: boolean;
  minutesBefore: number; // How many minutes before deadline to remind
  showOnLogin: boolean; // Show upcoming deadlines on login
};

type DailyTask = {
  id: string;
  title: string;
  details?: string;
  column: TaskColumn;
};

type NoteItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

type DeadlineItem = {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  completed: boolean;
  completedAt?: string;
};

type CalendarActivity = {
  id: string;
  title: string;
  notes?: string;
  startsAt: string;
  category: "meeting" | "task" | "personal" | "other";
  completed: boolean;
  createdAt: string;
};

type TimeLogEntry = {
  date: string;
  focusSeconds: number;
  workSeconds: number;
};

type FlashCard = {
  id: string;
  front: string;
  back: string;
  createdAt: string;
};

type FlashCardTopic = {
  id: string;
  title: string;
  description?: string;
  cards: FlashCard[];
  createdAt: string;
};

type SuggestionItem = {
  id: string;
  text: string;
};

type ActionCard = {
  id: string;
  title: string;
  reason: string;
  energy: "low" | "medium" | "high";
  impact: number;
};

type WellnessActivity = {
  id: string;
  type: "water" | "break" | "exercise" | "mood";
  timestamp: string;
  value?: string;
};

type User = {
  id: string;
  email: string;
  name: string;
  username: string;
  nickname?: string;
  bio?: string;
  profilePicture?: string;
};

type MascotReaction = {
  id: number;
  action: string;
  message?: string;
  speaker?: Exclude<Mascot, "none">;
};

type AppState = {
  // Authentication
  isLoggedIn: boolean;
  user: User | null;

  // User data
  dailyTasks: DailyTask[];
  notes: NoteItem[];
  flashCardTopics: FlashCardTopic[];
  deadlines: DeadlineItem[];
  calendarActivities: CalendarActivity[];
  timeLogs: TimeLogEntry[];
  suggestions: SuggestionItem[];
  actionCards: ActionCard[];
  progressPoints: number[];
  focusScore: number;
  
  // Wellness tracking
  wellnessActivities: WellnessActivity[];
  lastWaterRemindTime: number;
  lastBreakRemindTime: number;
  lastHydrationNotifTime: number;
  lastBreakNotifTime: number;
  wellnessRemindersEnabled: boolean;
  activeReminder: { type: "water" | "break"; message: string } | null;
  isFocusMode: boolean;
  focusModeStartedAt: number | null;
  focusModeTotalSeconds: number;
  isWorkModeActive: boolean;
  workModeStartedAt: number | null;
  workModeTotalSeconds: number;
  screenSaverSettings: ScreenSaverSettings;
  deadlineReminderSettings: DeadlineReminderSettings;
  
  // Theme & Layout
  theme: ThemeMode;
  visualThemePreset: VisualThemePreset;
  personalTheme: PersonalThemeSettings;
  
  // Layout & Mode
  workMode: WorkMode;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  showBottomBar: boolean;
  
  // AI Model
  activeModel: "gemini" | "claude" | "deepseek";
  
  // Mascot
  selectedMascot: Mascot;
  hasSeenTutorial: boolean;
  mascotReaction: MascotReaction | null;
  
  // Actions
  login: (identifier: string, password: string) => Promise<void>;
  register: (name: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "name" | "username" | "nickname" | "bio" | "profilePicture">>) => void;
  addDailyTask: (title: string, details?: string, column?: TaskColumn) => void;
  moveDailyTask: (taskId: string, nextColumn: TaskColumn) => void;
  updateDailyTask: (taskId: string, updates: Partial<Pick<DailyTask, "title" | "details">>) => void;
  removeDailyTask: (taskId: string) => void;
  addNote: (title: string, body: string) => void;
  removeNote: (noteId: string) => void;
  addFlashCardTopic: (title: string, description?: string) => void;
  removeFlashCardTopic: (topicId: string) => void;
  addFlashCard: (topicId: string, front: string, back: string) => void;
  removeFlashCard: (topicId: string, cardId: string) => void;
  updateFlashCard: (topicId: string, cardId: string, front: string, back: string) => void;
  addDeadline: (title: string, description: string, dueDate: string, dueTime: string) => void;
  removeDeadline: (deadlineId: string) => void;
  toggleDeadlineCompleted: (deadlineId: string, completed: boolean) => void;
  addCalendarActivity: (
    title: string,
    notes: string,
    date: string,
    time: string,
    category: CalendarActivity["category"]
  ) => void;
  removeCalendarActivity: (activityId: string) => void;
  toggleCalendarActivityCompleted: (activityId: string, completed: boolean) => void;
  setFocusMode: (enabled: boolean) => void;
  setWorkModeActive: (enabled: boolean) => void;
  updateScreenSaverSettings: (updates: Partial<ScreenSaverSettings>) => void;
  updateDeadlineReminderSettings: (updates: Partial<DeadlineReminderSettings>) => void;
  addSuggestion: (text: string) => void;
  removeSuggestion: (suggestionId: string) => void;
  addActionCard: (title: string, reason: string, energy: "low" | "medium" | "high", impact: number) => void;
  removeActionCard: (cardId: string) => void;
  addProgressPoint: (value: number) => void;
  setFocusScore: (value: number) => void;
  setTheme: (theme: ThemeMode) => void;
  setVisualThemePreset: (preset: VisualThemePreset) => void;
  updatePersonalTheme: (updates: Partial<PersonalThemeSettings>) => void;
  togglePersonalTheme: (enabled: boolean) => void;
  setWorkMode: (mode: WorkMode) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleBottomBar: () => void;
  setActiveModel: (model: "gemini" | "claude" | "deepseek") => void;
  setMascot: (mascot: Mascot) => void;
  setHasSeenTutorial: (seen: boolean) => void;
  triggerMascotReaction: (
    action: string,
    payload?: { message?: string; speaker?: Exclude<Mascot, "none"> }
  ) => void;
  clearMascotReaction: () => void;
  logWellnessActivity: (type: WellnessActivity["type"], value?: string) => void;
  removeWellnessActivity: (activityId: string) => void;
  updateWellnessReminders: (hydrationTime: number, breakTime: number) => void;
  checkWellnessReminders: () => { shouldRemindHydration: boolean; shouldRemindBreak: boolean };
  toggleWellnessReminders: () => void;
  showWellnessReminder: (type: "water" | "break", message: string) => void;
  clearWellnessReminder: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isLoggedIn: false,
      user: null,

      // User data (no presets)
      dailyTasks: [],
      notes: [],
      flashCardTopics: [],
      deadlines: [],
      calendarActivities: [],
      timeLogs: [],
      suggestions: [],
      actionCards: [],
      progressPoints: [],
      focusScore: 0,
      wellnessActivities: [],
      lastWaterRemindTime: Date.now(),
      lastBreakRemindTime: Date.now(),
      lastHydrationNotifTime: Date.now(),
      lastBreakNotifTime: Date.now(),
      wellnessRemindersEnabled: true,
      activeReminder: null,
      isFocusMode: false,
      focusModeStartedAt: null,
      focusModeTotalSeconds: 0,
      isWorkModeActive: false,
      workModeStartedAt: null,
      workModeTotalSeconds: 0,
      screenSaverSettings: {
        enabled: true,
        message: "Stay focused. You are doing great.",
        color: "#67e8f9",
        speedSeconds: 18,
      },
      deadlineReminderSettings: {
        enabled: true,
        minutesBefore: 60, // Remind 60 minutes before deadline
        showOnLogin: true,
      },
      
      // Theme & Layout
      theme: "dark",
      visualThemePreset: "aetheris",
      personalTheme: {
        enabled: false,
        name: "My Theme",
        textColor: "#e6eef9",
        fontFamily: "space-grotesk",
        fontSize: 16,
      },
      workMode: "balanced",
      showLeftSidebar: true,
      showRightSidebar: true,
      showBottomBar: false,
      activeModel: "claude",
      selectedMascot: "aetheris",
      hasSeenTutorial: false,
      mascotReaction: null,

      // Actions
      login: async (identifier, password) => {
        // Simple demo authentication - in production, verify against a backend
        // identifier can be email or username
        if (identifier && password.length >= 6) {
          // Check if any registered user matches the identifier
          const storedUsers = JSON.parse(localStorage.getItem("aetheris-users") || "[]");
          const user = storedUsers.find((u: User & { password: string }) => 
            (u.email === identifier || u.username === identifier) && u.password === password
          );

          if (user) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _password, ...userWithoutPassword } = user;
            
            // Load user-specific workspace data
            const userWorkspaceKey = `aetheris-workspace-${user.id}`;
            const savedWorkspace = localStorage.getItem(userWorkspaceKey);
            
            if (savedWorkspace) {
              const workspaceData = JSON.parse(savedWorkspace);
              set({ 
                isLoggedIn: true, 
                user: userWithoutPassword,
                // Load all user-specific data
                dailyTasks: workspaceData.dailyTasks || [],
                notes: workspaceData.notes || [],
                flashCardTopics: workspaceData.flashCardTopics || [],
                deadlines: workspaceData.deadlines || [],
                calendarActivities: workspaceData.calendarActivities || [],
                timeLogs: workspaceData.timeLogs || [],
                suggestions: workspaceData.suggestions || [],
                actionCards: workspaceData.actionCards || [],
                progressPoints: workspaceData.progressPoints || [],
                focusScore: workspaceData.focusScore || 0,
                wellnessActivities: workspaceData.wellnessActivities || [],
                lastWaterRemindTime: workspaceData.lastWaterRemindTime || Date.now(),
                lastBreakRemindTime: workspaceData.lastBreakRemindTime || Date.now(),
                lastHydrationNotifTime: workspaceData.lastHydrationNotifTime || Date.now(),
                lastBreakNotifTime: workspaceData.lastBreakNotifTime || Date.now(),
                wellnessRemindersEnabled: workspaceData.wellnessRemindersEnabled ?? true,
                focusModeTotalSeconds: workspaceData.focusModeTotalSeconds || 0,
                workModeTotalSeconds: workspaceData.workModeTotalSeconds || 0,
                screenSaverSettings: workspaceData.screenSaverSettings || {
                  enabled: true,
                  message: "Stay focused. You are doing great.",
                  color: "#67e8f9",
                  speedSeconds: 18,
                },
                deadlineReminderSettings: workspaceData.deadlineReminderSettings || {
                  enabled: true,
                  minutesBefore: 60,
                  showOnLogin: true,
                },
                theme: workspaceData.theme || "dark",
                visualThemePreset: workspaceData.visualThemePreset || "aetheris",
                personalTheme: workspaceData.personalTheme || {
                  enabled: false,
                  name: "My Theme",
                  textColor: "#e6eef9",
                  fontFamily: "space-grotesk",
                  fontSize: 16,
                },
                workMode: workspaceData.workMode || "balanced",
                showLeftSidebar: workspaceData.showLeftSidebar ?? true,
                showRightSidebar: workspaceData.showRightSidebar ?? true,
                showBottomBar: workspaceData.showBottomBar ?? false,
                activeModel: workspaceData.activeModel || "claude",
                selectedMascot: workspaceData.selectedMascot || "aetheris",
                hasSeenTutorial: workspaceData.hasSeenTutorial || false,
              });
            } else {
              // New user login - set with defaults
              set({ 
                isLoggedIn: true, 
                user: userWithoutPassword 
              });
            }
          } else {
            throw new Error("Invalid credentials");
          }
        } else {
          throw new Error("Invalid identifier or password");
        }
      },

      register: async (name: string, email: string, username: string, password: string) => {
        // Simple demo registration - in production, use a backend
        if (!name || !email || !username || password.length < 6) {
          throw new Error("All fields are required and password must be at least 6 characters");
        }

        // Check if user already exists
        const storedUsers = JSON.parse(localStorage.getItem("aetheris-users") || "[]");
        const existingUser = storedUsers.find((u: User & { password: string }) => 
          u.email === email || u.username === username
        );

        if (existingUser) {
          throw new Error("Email or username already exists");
        }

        // Create new user
        const newUser: User & { password: string } = {
          id: `user-${Date.now()}`,
          email,
          name,
          username,
          nickname: username,
          password, // In production, this should be hashed
        };

        // Save to localStorage (in production, use backend)
        storedUsers.push(newUser);
        localStorage.setItem("aetheris-users", JSON.stringify(storedUsers));

        // Log the user in
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...userWithoutPassword } = newUser;
        
        // Initialize empty workspace for new user
        const userWorkspaceKey = `aetheris-workspace-${newUser.id}`;
        const initialWorkspace = {
          dailyTasks: [],
          notes: [],
          flashCardTopics: [],
          deadlines: [],
          calendarActivities: [],
          timeLogs: [],
          suggestions: [],
          actionCards: [],
          progressPoints: [],
          focusScore: 0,
          wellnessActivities: [],
          hasSeenTutorial: false,
        };
        localStorage.setItem(userWorkspaceKey, JSON.stringify(initialWorkspace));
        
        set({ isLoggedIn: true, user: userWithoutPassword });
      },
      
      logout: () => {
        const state = get();
        
        // Save current workspace data to user-specific storage before logging out
        if (state.user) {
          const userWorkspaceKey = `aetheris-workspace-${state.user.id}`;
          const workspaceData = {
            dailyTasks: state.dailyTasks,
            notes: state.notes,
            flashCardTopics: state.flashCardTopics,
            deadlines: state.deadlines,
            calendarActivities: state.calendarActivities,
            timeLogs: state.timeLogs,
            suggestions: state.suggestions,
            actionCards: state.actionCards,
            progressPoints: state.progressPoints,
            focusScore: state.focusScore,
            wellnessActivities: state.wellnessActivities,
            lastWaterRemindTime: state.lastWaterRemindTime,
            lastBreakRemindTime: state.lastBreakRemindTime,
            lastHydrationNotifTime: state.lastHydrationNotifTime,
            lastBreakNotifTime: state.lastBreakNotifTime,
            wellnessRemindersEnabled: state.wellnessRemindersEnabled,
            focusModeTotalSeconds: state.focusModeTotalSeconds,
            workModeTotalSeconds: state.workModeTotalSeconds,
            screenSaverSettings: state.screenSaverSettings,
            deadlineReminderSettings: state.deadlineReminderSettings,
            theme: state.theme,
            visualThemePreset: state.visualThemePreset,
            personalTheme: state.personalTheme,
            workMode: state.workMode,
            showLeftSidebar: state.showLeftSidebar,
            showRightSidebar: state.showRightSidebar,
            showBottomBar: state.showBottomBar,
            activeModel: state.activeModel,
            selectedMascot: state.selectedMascot,
            hasSeenTutorial: state.hasSeenTutorial,
          };
          localStorage.setItem(userWorkspaceKey, JSON.stringify(workspaceData));
        }
        
        // Reset to default state and clear user
        set({ 
          isLoggedIn: false, 
          user: null,
          dailyTasks: [],
          notes: [],
          flashCardTopics: [],
          deadlines: [],
          calendarActivities: [],
          timeLogs: [],
          suggestions: [],
          actionCards: [],
          progressPoints: [],
          focusScore: 0,
          wellnessActivities: [],
          lastWaterRemindTime: Date.now(),
          lastBreakRemindTime: Date.now(),
          lastHydrationNotifTime: Date.now(),
          lastBreakNotifTime: Date.now(),
          wellnessRemindersEnabled: true,
          activeReminder: null,
          isFocusMode: false,
          focusModeStartedAt: null,
          focusModeTotalSeconds: 0,
          isWorkModeActive: false,
          workModeStartedAt: null,
          workModeTotalSeconds: 0,
          mascotReaction: null,
        });
      },
      
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
        get().triggerMascotReaction("updateSettings");
      },

      addDailyTask: (title, details, column = "To Do") => {
        set((state) => ({
          dailyTasks: [
            ...state.dailyTasks,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              title,
              details,
              column,
            },
          ],
        }));
        get().triggerMascotReaction("addTask");
      },
      moveDailyTask: (taskId, nextColumn) => {
        set((state) => ({
          dailyTasks: state.dailyTasks.map((task) =>
            task.id === taskId ? { ...task, column: nextColumn } : task
          ),
        }));
        if (nextColumn === "Done") {
          get().triggerMascotReaction("completeTask");
        }
      },
      updateDailyTask: (taskId, updates) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...(typeof updates.title === "string" ? { title: updates.title } : {}),
                  ...(updates.details !== undefined ? { details: updates.details } : {}),
                }
              : task
          ),
        })),
      removeDailyTask: (taskId) => {
        set((state) => ({
          dailyTasks: state.dailyTasks.filter((task) => task.id !== taskId),
        }));
        get().triggerMascotReaction("removeItem");
      },

      addNote: (title, body) => {
        set((state) => ({
          notes: [
            ...state.notes,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              title,
              body,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        get().triggerMascotReaction("addNote");
      },
      removeNote: (noteId) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        }));
        get().triggerMascotReaction("removeItem");
      },

      addFlashCardTopic: (title, description) => {
        set((state) => ({
          flashCardTopics: [
            ...state.flashCardTopics,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              title,
              description,
              cards: [],
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        get().triggerMascotReaction("addFlashcard");
      },

      removeFlashCardTopic: (topicId) => {
        set((state) => ({
          flashCardTopics: state.flashCardTopics.filter((topic) => topic.id !== topicId),
        }));
        get().triggerMascotReaction("removeItem");
      },

      addFlashCard: (topicId, front, back) => {
        set((state) => ({
          flashCardTopics: state.flashCardTopics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  cards: [
                    ...(Array.isArray(topic.cards) ? topic.cards : []),
                    {
                      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                      front,
                      back,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : topic
          ),
        }));
        get().triggerMascotReaction("addFlashcard");
      },

      removeFlashCard: (topicId, cardId) => {
        set((state) => ({
          flashCardTopics: state.flashCardTopics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  cards: (Array.isArray(topic.cards) ? topic.cards : []).filter(
                    (card) => card.id !== cardId
                  ),
                }
              : topic
          ),
        }));
        get().triggerMascotReaction("removeItem");
      },

      updateFlashCard: (topicId, cardId, front, back) =>
        set((state) => ({
          flashCardTopics: state.flashCardTopics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  cards: (Array.isArray(topic.cards) ? topic.cards : []).map((card) =>
                    card.id === cardId ? { ...card, front, back } : card
                  ),
                }
              : topic
          ),
        })),

      addDeadline: (title, description, dueDate, dueTime) => {
        set((state) => ({
          deadlines: [
            ...state.deadlines,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              title,
              description,
              dueAt: new Date(`${dueDate}T${dueTime}`).toISOString(),
              completed: false,
            },
          ],
        }));
        get().triggerMascotReaction("addDeadline");
      },

      addCalendarActivity: (title, notes, date, time, category) => {
        set((state) => ({
          calendarActivities: [
            ...state.calendarActivities,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              title,
              notes: notes || undefined,
              startsAt: new Date(`${date}T${time}`).toISOString(),
              category,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        get().triggerMascotReaction("addTask");
      },

      removeCalendarActivity: (activityId) => {
        set((state) => ({
          calendarActivities: state.calendarActivities.filter((item) => item.id !== activityId),
        }));
        get().triggerMascotReaction("removeItem");
      },

      toggleCalendarActivityCompleted: (activityId, completed) => {
        set((state) => ({
          calendarActivities: state.calendarActivities.map((item) =>
            item.id === activityId ? { ...item, completed } : item
          ),
        }));
        get().triggerMascotReaction(completed ? "completeTask" : "updateSettings");
      },

      removeDeadline: (deadlineId) => {
        set((state) => ({
          deadlines: state.deadlines.filter((item) => item.id !== deadlineId),
        }));
        get().triggerMascotReaction("removeItem");
      },
      toggleDeadlineCompleted: (deadlineId, completed) => {
        set((state) => ({
          deadlines: state.deadlines.map((item) =>
            item.id === deadlineId
              ? {
                  ...item,
                  completed,
                  completedAt: completed ? new Date().toISOString() : undefined,
                }
              : item
          ),
        }));
        get().triggerMascotReaction(completed ? "completeTask" : "updateSettings");
      },

      setFocusMode: (enabled) => {
        const state = get();
        
        if (enabled) {
          if (state.isFocusMode) return;
          
          set({
            isFocusMode: true,
            focusModeStartedAt: Date.now(),
          });
          get().triggerMascotReaction("focusMode");
          return;
        }

        if (!state.isFocusMode || !state.focusModeStartedAt) {
          set({
            isFocusMode: false,
            focusModeStartedAt: null,
          });
          return;
        }

        const sessionSeconds = Math.max(
          0,
          Math.floor((Date.now() - state.focusModeStartedAt) / 1000)
        );

        const todayKey = new Date().toISOString().slice(0, 10);
        const existingLog = state.timeLogs.find((entry) => entry.date === todayKey);
        const updatedLogs = existingLog
          ? state.timeLogs.map((entry) =>
              entry.date === todayKey
                ? { ...entry, focusSeconds: entry.focusSeconds + sessionSeconds }
                : entry
            )
          : [
              ...state.timeLogs,
              {
                date: todayKey,
                focusSeconds: sessionSeconds,
                workSeconds: 0,
              },
            ];

        set({
          isFocusMode: false,
          focusModeStartedAt: null,
          focusModeTotalSeconds: state.focusModeTotalSeconds + sessionSeconds,
          timeLogs: updatedLogs,
        });
      },

      setWorkModeActive: (enabled) => {
        const state = get();
        
        if (enabled) {
          if (state.isWorkModeActive) return;
          
          set({
            isWorkModeActive: true,
            workModeStartedAt: Date.now(),
          });
          get().triggerMascotReaction("focusMode");
          return;
        }

        if (!state.isWorkModeActive || !state.workModeStartedAt) {
          set({
            isWorkModeActive: false,
            workModeStartedAt: null,
          });
          return;
        }

        const sessionSeconds = Math.max(
          0,
          Math.floor((Date.now() - state.workModeStartedAt) / 1000)
        );

        const todayKey = new Date().toISOString().slice(0, 10);
        const existingLog = state.timeLogs.find((entry) => entry.date === todayKey);
        const updatedLogs = existingLog
          ? state.timeLogs.map((entry) =>
              entry.date === todayKey
                ? { ...entry, workSeconds: entry.workSeconds + sessionSeconds }
                : entry
            )
          : [
              ...state.timeLogs,
              {
                date: todayKey,
                focusSeconds: 0,
                workSeconds: sessionSeconds,
              },
            ];

        set({
          isWorkModeActive: false,
          workModeStartedAt: null,
          workModeTotalSeconds: state.workModeTotalSeconds + sessionSeconds,
          timeLogs: updatedLogs,
        });
      },

      updateScreenSaverSettings: (updates) => {
        set((state) => ({
          screenSaverSettings: { ...state.screenSaverSettings, ...updates },
        }));
        get().triggerMascotReaction("updateSettings");
      },

      updateDeadlineReminderSettings: (updates) => {
        set((state) => ({
          deadlineReminderSettings: { ...state.deadlineReminderSettings, ...updates },
        }));
        get().triggerMascotReaction("updateSettings");
      },

      addSuggestion: (text) => {
        set((state) => ({
          suggestions: [
            ...state.suggestions,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              text,
            },
          ],
        }));
        get().triggerMascotReaction("addSuggestion");
      },
      removeSuggestion: (suggestionId) => {
        set((state) => ({
          suggestions: state.suggestions.filter((item) => item.id !== suggestionId),
        }));
        get().triggerMascotReaction("removeItem");
      },

      addActionCard: (title, reason, energy, impact) =>
        set((state) => ({
          actionCards: [
            ...state.actionCards,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              title,
              reason,
              energy,
              impact,
            },
          ],
        })),
      removeActionCard: (cardId) =>
        set((state) => ({
          actionCards: state.actionCards.filter((card) => card.id !== cardId),
        })),

      addProgressPoint: (value) =>
        set((state) => ({
          progressPoints: [...state.progressPoints, Math.max(0, Math.min(100, value))],
        })),
      setFocusScore: (value) => set({ focusScore: Math.max(0, Math.min(100, value)) }),
      
      setTheme: (theme) => {
        set({ theme });
        get().triggerMascotReaction("changeTheme");
      },
      setVisualThemePreset: (visualThemePreset) => {
        set({ visualThemePreset });
        get().triggerMascotReaction("changeTheme");
      },
      updatePersonalTheme: (updates) => {
        set((state) => ({
          personalTheme: { ...state.personalTheme, ...updates },
        }));
        get().triggerMascotReaction("updateSettings");
      },
      togglePersonalTheme: (enabled) => {
        set((state) => ({
          personalTheme: { ...state.personalTheme, enabled },
        }));
        get().triggerMascotReaction("updateSettings");
      },
      setWorkMode: (mode) => {
        // Auto-adjust layout based on mode
        const updates: Partial<AppState> = { workMode: mode };
        if (mode === "deep-work") {
          updates.showRightSidebar = false;
          updates.showLeftSidebar = false;
        } else if (mode === "planning") {
          updates.showRightSidebar = true;
          updates.showLeftSidebar = true;
        } else {
          updates.showRightSidebar = true;
          updates.showLeftSidebar = true;
        }
        set(updates);
        get().triggerMascotReaction("updateSettings");
      },
      toggleLeftSidebar: () => {
        set((state) => ({ showLeftSidebar: !state.showLeftSidebar }));
        get().triggerMascotReaction("updateSettings");
      },
      toggleRightSidebar: () => {
        set((state) => ({ showRightSidebar: !state.showRightSidebar }));
        get().triggerMascotReaction("updateSettings");
      },
      toggleBottomBar: () => {
        set((state) => ({ showBottomBar: !state.showBottomBar }));
        get().triggerMascotReaction("updateSettings");
      },
      setActiveModel: (activeModel) => {
        set({ activeModel });
        get().triggerMascotReaction("updateSettings");
      },
      setMascot: (selectedMascot) => {
        const prevMascot = get().selectedMascot;
        set({ selectedMascot });
        if (prevMascot !== "none" && selectedMascot !== "none" && selectedMascot !== prevMascot) {
          get().triggerMascotReaction("changeMascot", {
            speaker: prevMascot,
            message: getActionReactionMessage(prevMascot, "changeMascot"),
          });

          window.setTimeout(() => {
            get().triggerMascotReaction("changeMascot", {
              speaker: selectedMascot,
              message: getMascotChosenMessage(selectedMascot),
            });
          }, 1600);
        }
      },
      setHasSeenTutorial: (hasSeenTutorial) => set({ hasSeenTutorial }),
      triggerMascotReaction: (action, payload) => {
        const state = get();
        const speaker =
          payload?.speaker ?? (state.selectedMascot !== "none" ? state.selectedMascot : null);

        if (!speaker) return;

        const message = payload?.message ?? getActionReactionMessage(speaker, action);

        set({
          mascotReaction: {
            id: Date.now() + Math.floor(Math.random() * 1000),
            action,
            message,
            speaker,
          },
        });
      },
      clearMascotReaction: () => set({ mascotReaction: null }),
      
      logWellnessActivity: (type, value) => {
        const newActivity: WellnessActivity = {
          id: Date.now().toString(),
          type,
          timestamp: new Date().toISOString(),
          value,
        };
        set((state) => ({
          wellnessActivities: [...state.wellnessActivities, newActivity],
        }));

        // Trigger mascot reaction
        if (type === "water") {
          get().triggerMascotReaction("water", {
            message: "Great hydration! Your body will thank you.",
          });
        } else if (type === "break") {
          get().triggerMascotReaction("break", {
            message: "Good break! Your eyes and mind needed that.",
          });
        } else if (type === "exercise") {
          get().triggerMascotReaction("exercise", {
            message: "Awesome stretch! Keep moving!",
          });
        }
      },

      removeWellnessActivity: (activityId) => {
        set((state) => ({
          wellnessActivities: state.wellnessActivities.filter((a) => a.id !== activityId),
        }));
      },

      updateWellnessReminders: (hydrationTime, breakTime) => {
        set({
          lastHydrationNotifTime: hydrationTime,
          lastBreakNotifTime: breakTime,
        });
      },

      checkWellnessReminders: () => {
        const state = get();
        const now = Date.now();
        const HYDRATION_INTERVAL = 60 * 60 * 1000; // 60 minutes
        const BREAK_INTERVAL = 25 * 60 * 1000; // 25 minutes

        const shouldRemindHydration = now - state.lastHydrationNotifTime >= HYDRATION_INTERVAL;
        const shouldRemindBreak = now - state.lastBreakNotifTime >= BREAK_INTERVAL;

        return { shouldRemindHydration, shouldRemindBreak };
      },

      toggleWellnessReminders: () => {
        set((state) => ({
          wellnessRemindersEnabled: !state.wellnessRemindersEnabled,
        }));
      },

      showWellnessReminder: (type, message) => {
        set({
          activeReminder: { type, message },
        });
      },

      clearWellnessReminder: () => {
        set({
          activeReminder: null,
        });
      },
    }),
    {
      name: "aetheris-app-state",
    }
  )
);

// Auto-save workspace data to user-specific storage whenever state changes
useAppStore.subscribe((state) => {
  if (state.user && state.isLoggedIn) {
    const userWorkspaceKey = `aetheris-workspace-${state.user.id}`;
    const workspaceData = {
      dailyTasks: state.dailyTasks,
      notes: state.notes,
      flashCardTopics: state.flashCardTopics,
      deadlines: state.deadlines,
      calendarActivities: state.calendarActivities,
      timeLogs: state.timeLogs,
      suggestions: state.suggestions,
      actionCards: state.actionCards,
      progressPoints: state.progressPoints,
      focusScore: state.focusScore,
      wellnessActivities: state.wellnessActivities,
      lastWaterRemindTime: state.lastWaterRemindTime,
      lastBreakRemindTime: state.lastBreakRemindTime,
      lastHydrationNotifTime: state.lastHydrationNotifTime,
      lastBreakNotifTime: state.lastBreakNotifTime,
      wellnessRemindersEnabled: state.wellnessRemindersEnabled,
      focusModeTotalSeconds: state.focusModeTotalSeconds,
      workModeTotalSeconds: state.workModeTotalSeconds,
      screenSaverSettings: state.screenSaverSettings,
      deadlineReminderSettings: state.deadlineReminderSettings,
      theme: state.theme,
      visualThemePreset: state.visualThemePreset,
      personalTheme: state.personalTheme,
      workMode: state.workMode,
      showLeftSidebar: state.showLeftSidebar,
      showRightSidebar: state.showRightSidebar,
      showBottomBar: state.showBottomBar,
      activeModel: state.activeModel,
      selectedMascot: state.selectedMascot,
      hasSeenTutorial: state.hasSeenTutorial,
    };
    localStorage.setItem(userWorkspaceKey, JSON.stringify(workspaceData));
  }
});
