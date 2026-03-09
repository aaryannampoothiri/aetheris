# Aetheris Implementation Notes

## Architecture Overview

### Layout System (3-Column + Bottom Bar)
- **Left Sidebar** (`left-sidebar.tsx`): Contextual Navigator with folders, active goals, progress tracking
- **Center Stage**: Hybrid workspace content (routes)
- **Right Sidebar** (`right-sidebar.tsx`): AI Companion with multi-model switching (Gemini/Claude/DeepSeek)
- **Bottom Bar** (`pulse-bar.tsx`): Real-time productivity stats and AI suggestions

### State Management (`app-store.ts`)
- Work modes: `balanced`, `deep-work`, `planning`
- Auto-adaptive layouts based on mode
- Multi-model AI switching
- Theme persistence

### Intelligence Features Implemented

#### ✅ Phase 1 (Foundation)
- [x] 3-column adaptive layout
- [x] Work mode switching (auto-collapses sidebars)
- [x] Multi-model LLM UI toggle (Gemini/Claude/DeepSeek)
- [x] Enhanced Command Bar with AI commands (type `/`)
- [x] Next-Best-Action widget with impact scoring
- [x] Pulse Bar with real-time metrics
- [x] Theme system: Light / Dark / System (auto-detects OS preference)

#### 🚧 Phase 2 (In Progress)
- [ ] Contextual Memory Engine (vector search for notes)
- [ ] Autonomous Task Extraction from unstructured notes
- [ ] Adaptive layout presets (Deep Work collapses AI chat)
- [ ] Live Web Research Sidepane
- [ ] Smart Goal Alignment visualization

#### 📋 Phase 3 (Planned)
- [ ] Auto-Priority Kanban with AI card movement
- [ ] Ambient Documentation (real-time note generation)
- [ ] AI-Driven Micro-interactions (mood detection)
- [ ] Agentic Plugins ("Book meeting", "Send invoice")
- [ ] Evidence Mapping (source links for AI outputs)

## Command Bar Capabilities
Type in Cmd+K palette:
- Standard search: Find pages, notes, tasks
- AI commands: Prefix with `/`
  - `/summarize` - Summarize last meeting
  - `/extract-tasks` - Extract tasks from notes
  - `/analyze` - Analyze productivity trends
  - `/research` - Research topic in web

## Work Modes
- **Balanced**: All sidebars visible, standard layout
- **Deep Work**: Hides AI Companion + Navigator for distraction-free editing
- **Planning**: Full visibility with Kanban and Calendar focus

## Theme System
- **Light Mode**: Clean, bright interface with blue gradients
- **Dark Mode**: Default dark theme with cyan accents
- **System**: Automatically follows your OS theme preference and updates in real-time

## Next Steps
1. Wire up actual AI model endpoints (currently UI-only)
2. Implement vector search for note linking
3. Add task extraction from notes using NLP
4. Build Work Graph visualization for goal alignment
5. Integrate real calendar/task data sources
