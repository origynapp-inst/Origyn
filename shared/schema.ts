import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  selectedDiscipline: text("selected_discipline").notNull(),
  mood: text("mood").notNull(),
  creationFrequency: text("creation_frequency").notNull(),
  streak: integer("streak").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  theme: text("theme").notNull().default("dark"),
  language: text("language").notNull().default("en"),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  notificationTime: text("notification_time").notNull().default("09:00"),
  lastCompletionDate: text("last_completion_date"),
  todayCompleted: boolean("today_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  prompt: text("prompt").notNull(),
  creation: text("creation").notNull(),
  duration: integer("duration").notNull(),
  mood: text("mood").notNull(),
  reflection: text("reflection"),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedPrompts = pgTable("saved_prompts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  prompt: text("prompt").notNull(),
  discipline: text("discipline").notNull(),
  mood: text("mood").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlocked: boolean("unlocked").notNull().default(false),
  unlockedDate: text("unlocked_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const museMessages = pgTable("muse_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'user' or 'muse'
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema: any = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertJournalEntrySchema: any = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertSavedPromptSchema: any = createInsertSchema(savedPrompts).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema: any = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertMuseMessageSchema: any = createInsertSchema(museMessages).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type SavedPrompt = typeof savedPrompts.$inferSelect;
export type InsertSavedPrompt = z.infer<typeof insertSavedPromptSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type MuseMessage = typeof museMessages.$inferSelect;
export type InsertMuseMessage = z.infer<typeof insertMuseMessageSchema>;
