"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { useAppStore } from "@/lib/app-store";
import { Trash2, Plus, BookOpen, StickyNote } from "lucide-react";
import { FlashCardViewer, type FlashCardData } from "@/components/flashcard-viewer";

type Tab = "notes" | "flashcards";

export default function VaultPage() {
  const notes = useAppStore((state) => state.notes);
  const addNote = useAppStore((state) => state.addNote);
  const removeNote = useAppStore((state) => state.removeNote);
  
  const flashCardTopics = useAppStore((state) => state.flashCardTopics);
  const addFlashCardTopic = useAppStore((state) => state.addFlashCardTopic);
  const removeFlashCardTopic = useAppStore((state) => state.removeFlashCardTopic);
  const addFlashCard = useAppStore((state) => state.addFlashCard);
  const removeFlashCard = useAppStore((state) => state.removeFlashCard);

  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  
  // Flashcard states
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [studyingTopicId, setStudyingTopicId] = useState<string | null>(null);

  const activeNote = notes.find((item) => item.id === activeNoteId) ?? null;
  const studyingTopic = flashCardTopics.find((topic) => topic.id === studyingTopicId) ?? null;

  const handleAddNote = () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) return;
    addNote(trimmedTitle, trimmedBody);
    setTitle("");
    setBody("");
  };

  const handleAddTopic = () => {
    const trimmedTitle = topicTitle.trim();
    if (!trimmedTitle) return;
    addFlashCardTopic(trimmedTitle, topicDescription.trim() || undefined);
    setTopicTitle("");
    setTopicDescription("");
  };

  const handleAddCard = (topicId: string) => {
    const trimmedFront = cardFront.trim();
    const trimmedBack = cardBack.trim();
    if (!trimmedFront || !trimmedBack) return;
    addFlashCard(topicId, trimmedFront, trimmedBack);
    setCardFront("");
    setCardBack("");
    setSelectedTopicId(null);
  };

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-white/20 bg-black/30 p-6">
        <p className="text-xs tracking-[0.22em] text-cyan-200/90">MY VAULT</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-4xl">
          Notes & Flashcards
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
            activeTab === "notes"
              ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
              : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10"
          }`}
        >
          <StickyNote className="h-4 w-4" />
          <span>Notes</span>
        </button>
        <button
          onClick={() => setActiveTab("flashcards")}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
            activeTab === "flashcards"
              ? "border-purple-300/40 bg-purple-300/10 text-purple-200"
              : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Flashcards</span>
        </button>
      </div>

      {/* Notes Section */}
      {activeTab === "notes" && (
        <>
          <GlassCard className="space-y-3" glow="cyan">
            <h2 className="text-base font-medium text-slate-100">Add a Note</h2>
            <div className="grid gap-2">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Note title"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
              />
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write your note..."
                rows={4}
                className="resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="w-fit rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-300/20"
              >
                Add Note
              </button>
            </div>
          </GlassCard>

          <section className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {notes.length === 0 && (
              <div className="mb-4 break-inside-avoid">
                <GlassCard className="border-dashed border-white/10 text-sm text-slate-500">
                  No notes yet. Add your first note above.
                </GlassCard>
              </div>
            )}
            {notes.map((note) => (
              <div key={note.id} className="mb-4 break-inside-avoid">
                <GlassCard
                  className="cursor-pointer"
                  onClick={() => setActiveNoteId(note.id)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-medium text-slate-100">{note.title}</h2>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeNote(note.id);
                        if (activeNoteId === note.id) setActiveNoteId(null);
                      }}
                      className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-red-300"
                      aria-label="Remove note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{note.body}</p>
                </GlassCard>
              </div>
            ))}
          </section>
        </>
      )}

      {/* Flashcards Section */}
      {activeTab === "flashcards" && (
        <>
          {/* Create Topic */}
          <GlassCard className="space-y-3" glow="purple">
            <h2 className="text-base font-medium text-slate-100">Create Flashcard Topic</h2>
            <div className="grid gap-2">
              <input
                value={topicTitle}
                onChange={(event) => setTopicTitle(event.target.value)}
                placeholder="Topic title (e.g., JavaScript Basics)"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-purple-300/40"
              />
              <textarea
                value={topicDescription}
                onChange={(event) => setTopicDescription(event.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-purple-300/40"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="w-fit rounded-lg border border-purple-300/40 bg-purple-300/10 px-4 py-2 text-sm text-purple-200 transition hover:bg-purple-300/20"
              >
                Create Topic
              </button>
            </div>
          </GlassCard>

          {/* Topics List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flashCardTopics.length === 0 && (
              <GlassCard className="border-dashed border-white/10 text-sm text-slate-500">
                No flashcard topics yet. Create one above.
              </GlassCard>
            )}
            {flashCardTopics.map((topic) => (
              <GlassCard
                key={topic.id}
                className="space-y-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {/** Safeguard for older persisted topics without cards array */}
                {(() => {
                  const topicCards = Array.isArray(topic.cards) ? topic.cards : [];
                  return (
                    <>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-slate-100">{topic.title}</h3>
                    {topic.description && (
                      <p className="mt-1 text-xs text-slate-400">{topic.description}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-500">{topicCards.length} cards</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFlashCardTopic(topic.id)}
                    className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-red-300"
                    aria-label="Remove topic"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedTopicId(selectedTopicId === topic.id ? null : topic.id)
                    }
                    className="flex items-center gap-1 rounded-lg border border-purple-300/40 bg-purple-300/10 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-300/20"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Card</span>
                  </button>
                  {topicCards.length > 0 && (
                    <button
                      onClick={() => setStudyingTopicId(topic.id)}
                      className="flex items-center gap-1 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200 transition hover:bg-cyan-300/20"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Study</span>
                    </button>
                  )}
                </div>

                {/* Add Card Form */}
                {selectedTopicId === topic.id && (
                  <div className="space-y-2 border-t border-white/10 pt-3">
                    <input
                      value={cardFront}
                      onChange={(event) => setCardFront(event.target.value)}
                      placeholder="Question / Front"
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-purple-300/40"
                    />
                    <textarea
                      value={cardBack}
                      onChange={(event) => setCardBack(event.target.value)}
                      placeholder="Answer / Back"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-purple-300/40"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddCard(topic.id)}
                        className="rounded-lg border border-purple-300/40 bg-purple-300/10 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-300/20"
                      >
                        Add Card
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTopicId(null);
                          setCardFront("");
                          setCardBack("");
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Cards List */}
                {topicCards.length > 0 && selectedTopicId !== topic.id && (
                  <div className="space-y-1 border-t border-white/10 pt-3">
                    {topicCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-black/20 p-2"
                      >
                        <div className="flex-1">
                          <p className="text-xs text-slate-300">{card.front}</p>
                        </div>
                        <button
                          onClick={() => removeFlashCard(topic.id, card.id)}
                          className="rounded p-0.5 text-slate-500 transition hover:bg-white/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                    </>
                  );
                })()}
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {/* Note Modal */}
      <AnimatePresence>
        {activeNote ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveNoteId(null)}
          >
            <motion.div
              className="w-full max-w-xl rounded-3xl border border-white/20 bg-slate-950/95 p-6"
              initial={{ scale: 0.9, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 14 }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-slate-100">{activeNote.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{activeNote.body}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Study Modal */}
      <AnimatePresence>
        {studyingTopic ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStudyingTopicId(null)}
          >
            <motion.div
              className="w-full max-w-2xl rounded-3xl border border-white/20 bg-slate-950/95 p-6"
              initial={{ scale: 0.9, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 14 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">{studyingTopic.title}</h2>
                  {studyingTopic.description && (
                    <p className="mt-1 text-sm text-slate-400">{studyingTopic.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setStudyingTopicId(null)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <FlashCardViewer
                cards={(Array.isArray(studyingTopic.cards)
                  ? studyingTopic.cards
                  : []) as FlashCardData[]}
                variant="study"
                onClose={() => setStudyingTopicId(null)}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
