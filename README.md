# Productivity Game

Gamified productivity app for tasks, habits, and goals — earn points, build streaks, climb ranks, and reach leaderboards while doing real work. Built with Expo / React Native and TypeScript, with Firebase (Auth, Firestore, Realtime Database, Storage) and Google Calendar sync.

![Stars](https://img.shields.io/github/stars/5h4d0wn1k/productivity_game)
![Last commit](https://img.shields.io/github/last-commit/5h4d0wn1k/productivity_game)
![Issues](https://img.shields.io/github/issues/5h4d0wn1k/productivity_game)

Productivity Game turns day-to-day productivity into a role-playing meta-game. Every completed task and habit yields experience points, levels, and rank progression; streaks and a global leaderboard keep motivation high, while a calendar view keeps planning concrete. The app is built with **Expo (React Native) + TypeScript** using `expo-router` for navigation and Firebase for auth and realtime data.

## Why Productivity Game

Traditional habit apps fail because the reward loop is a static checkmark. Productivity Game adds a game layer on top of real behavior: XP for tasks, daily habit streaks, military-style rank progression visible on your profile, a global leaderboard, and character stats (strength, intelligence, creativity, focus) you grow by doing actual work. Firebase realtime sync means your scores and streaks follow you across devices.

## Features

- **Task management** (`Tasks` tab) — add, edit, and complete tasks with descriptions and `DateTimePicker` scheduling; live Firestore updates via `onSnapshot`
- **Habit tracking** (`Habit Creator`) — create daily/weekly habits, track streaks and last-completed dates
- **Gamification** — points, XP, levels, and rank progression (`Private` → rank up) computed from `getUserRank`
- **Global leaderboard** — top users by points with medals, crowns, and your current standing
- **Calendar planning** — month view with event creation, location/attendees, and Google Calendar integration
- **Character stats** — RPG-style stats (strength, intelligence, creativity, focus) driven by activity
- **Auth** — email/password signup + login with Firebase Auth, plus Google Sign-In (OAuth with Google Calendar offline access)
- **Firebase backend** — Firestore documents, Realtime Database records, and Storage ready via a single `config/firebase.ts`
- **Meta Space** — placeholder arc for a future immersive productivity workspace

## Quickstart

Prerequisites: Node.js 18+, npm/yarn, and an Expo account for device preview (optional).

```bash
npm install           # or: yarn
npm run dev           # start the Expo dev server (EXPO_NO_TELEMETRY=1 expo start)
npm run build:web     # export the web build (expo export --platform web)
npm run lint          # expo lint
```

### Firebase configuration

The app reads Firebase credentials from environment variables named `EXPO_PUBLIC_FIREBASE_*` and `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (see `app/config/firebase.ts`). Provide them in a `.env` file per [Expo environment variables](https://docs.expo.dev/guides/environment-variables/) before launching.

## Examples

Use the app directly: sign up, create a task and a habit, complete them to earn points, then check your rank on the Leaderboard and Profile tabs.

## Project structure

```
app/
├── (tabs)/           # home, tasks, habitCreator, calendar, leaderboard, profile
├── (auth)/           # login, signup
├── components/       # AuthWrapper, SettingsPage, metspace
├── config/firebase.ts
├── contexts/AuthContext.tsx
└── services/         # firebase.ts, realtimeDatabase.ts, googleCalendar.ts
```

## Contributing

Contributions are welcome. Open an issue or pull request. Keep Firebase credential files out of the repository.

## License

No license file is present in this repository. All rights are reserved by the author until a license is explicitly added.