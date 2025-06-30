# 🥗 Dietitian App

**Live Demo**: [https://signaldietitian.netlify.app](https://signaldietitian.netlify.app)  
**Repository**: [GitHub - LordNecromancer/Signal](https://github.com/LordNecromancer/Signal)

---

## 📌 Overview

**Dietitian** is a user-centric dietary recommendation app that provides **personalized daily menus** based on age and sex for both individuals and their families. It is designed to be responsive, dynamic, and intuitive for users on both mobile and web. This app is a submission for the **Signal Code Test Project**, focused on maximizing developer signal with clean, scalable, and maintainable code.

---

## 🎯 Project Goals (Signal Evaluation)

This project aims to demonstrate:

- ✅ Modular and well-structured codebase
- ✅ Good commits and GitHub best practices
- ✅ Simplicity and adherence to React/React Native architectural principles
- ✅ Responsive UI that adapts to screen size
- ✅ Dynamic theming using Context API
- ✅ DevOps principle: environment-based configuration via Supabase
- ✅ Security: Authentication handled via Supabase
- ✅ One tested UI component (pending if test coverage added)
- ✅ Clear setup instructions and solid README ✅

---

## 🌱 Features

- 🔐 **User Authentication** (Sign-up/Login) using **Supabase**
- 👤 **Individual Profile Creation** with name, age, and sex
- 👨‍👩‍👧‍👦 Optionally add **multiple family members**
- 🍽 Personalized **daily dietary recommendations** in 4 food categories
- 🌗 **Light/Dark Mode** toggle with persistent theme using AsyncStorage
- 📱 Fully responsive across mobile and web (React Native + Expo)
- 🧠 Smart rendering logic and conditional routing based on authentication state

---

## 📚 User Stories

> As a user, I want to see an optimal daily menu so that I can improve my health.  
> As a family, I want to see an optimal daily menu per member so that I can improve the health of my family.

---

## 🚀 How to Use

### 👉 Live App

Visit: [https://signaldietitian.netlify.app](https://signaldietitian.netlify.app)

1. Sign up or log in
2. Enter your personal info (name, age, sex)
3. (Optional) Add family members
4. Submit to view personalized meal recommendations
5. Toggle light/dark theme anytime

---

## 🛠️ Running Locally

### 🔄 Clone the Repository

```bash
git clone https://github.com/LordNecromancer/Signal.git
cd Signal
```

### 📦 Install Dependencies

```bash
npm install
```

or using yarn:

```bash
yarn install
```

### 🚀 Start the App

```bash
npx expo start
```

This will start Expo CLI. You can scan the QR code with your Expo Go mobile app, run on a web browser, or launch it on an emulator.

---

## 📁 Folder Structure

```bash
app/
├── index.js                 # Entry point with auth redirection
├── _layout.js               # Root layout & stack navigation
├── (auth)/login.js          # Login screen
├── (auth)/signup.js         # Signup screen
├── (diet)/main.js           # Main Dietitian screen
components/
├── DietUI.js                # Main component for food display
context/
├── ThemeContext.js          # Theme toggle context (light/dark)
data/
├── directions.json          # Local food data
```

---

## 🧠 Technical Highlights

- **React Native** (via Expo): cross-platform mobile & web UI
- **Supabase**: Auth + Postgres DB as backend
- **Expo Router**: File-system based routing
- **Context API**: Global state for theming
- **AsyncStorage**: Persistent theme preference
- **Responsive Design**: `Dimensions` API and conditional styles

---

## ✅ Completed Signal Evaluation Criteria

| Criteria | Status |
|---------|--------|
| Good commits and GitHub usage | ✅ |
| Clear README | ✅ |
| Simplicity & structure | ✅ |
| DevOps principle | ✅ Supabase used |
| Security best practice | ✅ Auth only access |
| Responsive & testable UI | ✅ |
| Dynamic UI & dark mode | ✅ |
| Easy to run locally | ✅ |

---

## ✨ Future Improvements (Outside Scope)

- 🛒 Generate grocery lists automatically
- 🛍️ Integrate grocery delivery (e.g., Amazon Fresh)
- 📅 Weekly meal planner
- 📊 Nutrition analysis

---

## 📩 Feedback & Contribution

This project is part of the **Signal Evaluation Project**.  
If you have suggestions, feedback, or want to contribute, feel free to:

- Open an [Issue](https://github.com/LordNecromancer/Signal/issues)
- Submit a Pull Request

---

## 📄 License

MIT License © 2025
