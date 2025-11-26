🎯Sportify – Sports Scores, Matches & Teams App

A modern React Native + Expo app that allows users to explore upcoming matches, view detailed stats, browse teams, and manage favourites — powered by TheSportsDB API.

🚀 Features
✅ User Authentication

Register & Login (DummyJSON API)

Form validation using Formik + Yup

Local auth persistence with Redux Persist

Protected routes (tabs hidden until login)

🏠 Home Screen

Live data fetched from TheSportsDB

Match cards with:

Team badges

Scores

Match time

Tap to view full match details

📄 Match Details Screen

Beautiful UI + gradients

Tabs: Overview, Stats, Players

Add/remove favourites

Highlights & news sections

🔍 Explore Screen

Searchable list of teams

Team logos, country, league

API: TheSportsDB → Premier League teams

⭐ Favourites

Add/remove favourites from Home & Details

Stored persistently using Redux Toolkit + Persist

👤 Profile

View logged-in user info

Upload profile picture (Expo Image Picker)

Edit name/email

Logout button

🎨 Styling & UI

Fully responsive UI

Global theming

Dark + Light mode toggle

Feather Icons throughout the app

🎬 Splash Screen

Animated splash with:

Gradient background

Logo

Custom loader

🛠 Tech Stack
Feature	Technology
Frontend	React Native, Expo Router
State Management	Redux Toolkit, Redux Persist
Authentication	DummyJSON API
Sports Data	TheSportsDB API
UI	Feather Icons, Linear Gradient, Animated API
Image Upload	Expo Image Picker

🌐 APIs Used
1️⃣ DummyJSON – Authentication

Login → /auth/login

Register → /users/add

2️⃣ SportsDB – Matches & Teams

Upcoming matches

Team logos

Player list

Events

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
