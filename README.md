<!-- GSSoC banner and project insights -->
<h1 align="center">
  DevSync
</h1> 

<table align="center">
    <thead align="center">
        <tr>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Closed PRs</b></td>
            <td><b>🛠️ Languages</b></td>
            <td><b>👥 Contributors</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/DevSyncx/DevSync?style=flat&logo=github"/></td>
            <td><img alt="Forks" src="https://img.shields.io/github/forks/DevSyncx/DevSync?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/DevSyncx/DevSync?style=flat&logo=github"/></td>
            <td><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/DevSyncx/DevSync?style=flat&logo=github"/></td>
            <td><img alt="Closed PRs" src="https://img.shields.io/github/issues-pr-closed/DevSyncx/DevSync?style=flat&color=critical&logo=github"/></td>
            <td><img alt="Languages Count" src="https://img.shields.io/github/languages/count/DevSyncx/DevSync?style=flat&color=green&logo=github"></td>
            <td><img alt="Contributors Count" src="https://img.shields.io/github/contributors/DevSyncx/DevSync?style=flat&color=blue&logo=github"/></td>
        </tr>
    </tbody>
</table>

# 🚀 DevSync — Developer Productivity Dashboard


From pull requests to pomodoros — DevSync's got you covered.  
Stay ahead. Stay synced. stay **DevSynced**

**DevSync** is a unified productivity tracker for developers. It aggregates your coding activity, daily goals, and contribution metrics from various platforms into a single, elegant dashboard — designed to help you track growth, stay consistent, and showcase your development journey.


## 📋 Table of Contents

- [🔍 Overview](#-overview)
- [✨ Features](#-features)
- [🏗 Tech Stack](#-tech-stack)
- [📸 Screenshots](#-screenshots)
- [📊 Project Insights](#-project-insights)
- [🛠️ Setup & Installation](#️-setup--installation)
- [📁 Folder Structure](#-folder-structure)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [📄 Code of Conduct](#-code-of-conduct)
- [📄 Docs](#-setup-guides)
- [👩‍💻 Maintainers](#-maintainers)
- [⭐ Support This Project](#-support-this-project)


## 🔍 Overview

In today’s fragmented developer ecosystem, tracking your contributions across multiple platforms can be overwhelming.  
**DevSync** simplifies this by:

- Consolidating your stats, streaks, and growth in one place.  
- Offering visual productivity logs and heatmaps.  
- Letting you manage tasks and goals alongside coding activity.  

Whether you’re preparing for internships, building a personal brand, or staying accountable — **DevSync** empowers you with **data-driven insights** at a glance.  



## ✨ Features

- 📈 **Unified Developer Insights** – Track problems solved, commits, issues, ratings, and more.  
- 🔥 **Cross-Platform Heatmaps** – Visualize your coding streaks and consistency.  
- 🧩 **Modular Platform Support** – Easily add integrations for new coding platforms.  
- ✅ **Task & Goal Tracker** – Stay on top of daily, weekly, and long-term goals.  
- 🧾 **Timeline Logs** – Get auto-generated summaries (daily/weekly/monthly).  
- 🪪 **Public Shareable Profile (Coming Soon)** – Showcase your journey to recruiters or peers.  



## 🏗 Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React, Tailwind CSS, ShadCN UI      |
| Backend     | Node.js, Express, REST API          |
| Database    | MongoDB                             |
| Auth        | JWT / OAuth                         |
| Deployment  | Vercel / Render                     |



## 📸 Screenshots

![Home Page](assets/img1.jpg "Home Page")
![About DevSync](assets/img2.jpg "About DevSync")
![Contact Us](assets/img3.jpg "Contact Us")


## 🛠️ Setup & Installation

### 1. Fork the Repository  
Click the **Fork** button (top-right) to get your copy of the repo.

### 2. Clone Your Fork  

```bash
git clone https://github.com/<your-username>/DevSync.git
cd DevSync
````

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Your frontend runs at 👉 [http://localhost:5173](http://localhost:5173)

### 4. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Your backend runs at 👉 [http://localhost:5000](http://localhost:5000)



## 📁 Folder Structure

```
DevSync/
├─ 🗄️  .github/
│  ├─ 📄 ISSUE_TEMPLATE/ → Issue templates for contributors
│  ├─ ⚙️  scripts/ → GitHub automation scripts (cleanup, validation, etc.)
│  ├─ 🤖 workflows/ → GitHub Actions CI/CD workflows
│  └─ 📑 PULL_REQUEST_TEMPLATE.md → PR submission format
│
├─ 📸 assets/
│  ├─ 🖼️ screenshots/ → Setup & API reference images
│  ├─ gssoc.png
│  └─ img1.jpg / img2.jpg / img3.jpg
│
├─ 💻 backend/
│  ├─ ⚙️  config/ → Auth & server configuration (e.g., passport.js)
│  ├─ 📝 controllers/ → Handles API logic (e.g., contact.controller.js)
│  ├─ 🗄️ db/ → Database connection setup
│  ├─ 🛡️ middleware/ → Auth & rate-limit middleware
│  ├─ 📦 models/ → MongoDB models (User, ContactMessage, etc.)
│  ├─ 🌐 routes/ → API routes (auth, contact, profile)
│  ├─ 📧 services/ → Email & external services
│  ├─ 🛠️ utils/ → Helper functions (email, cron jobs, etc.)
│  └─ 🚀 server.js → Main backend entry point
│
├─ 📚 docs/
│  ├─ 🛠️ setup/ → Integration guides (Google Auth, Resend, Sheets)
│  └─ 📄 env_guide.md → Environment variable documentation
│
├─ ⚛️ frontend/
│  ├─ 🌐 public/ → Static assets (e.g., vite.svg)
│  ├─ src/
│  │  ├─ 🧩 Components/
│  │  │  ├─ 🔑 auth/ → Login, Register, Forgot Password, etc.
│  │  │  ├─ 📊 DashBoard/ → Dashboard UI components
│  │  │  ├─ 🧭 Navbar/, Footer.jsx, Hero.jsx, About.jsx, etc.
│  │  │  ├─ 🎨 ui/ → Reusable UI elements (buttons, loaders, toggles)
│  │  │  └─ 👤 profile/ → User profile components
│  │  ├─ 🌐 context/ → React Context providers (Timer, Theme)
│  │  ├─ 🛠️ lib/ → Utility scripts & validation schemas
│  │  ├─ 🚪 App.jsx / main.jsx / index.css → React entry files
│  │  └─ 🎨 App.css → Global styles
│  ├─ 📝 index.html → Root HTML
│  ├─ ⚙️ vite.config.js → Vite config
│  ├─ 🔧 eslint.config.js / jsconfig.json → Linting & path configs
│  └─ 🚀 vercel.json → Deployment config
│
├─ 📚 docs/ → Developer documentation
├─ ❌ .gitignore
├─ 📝 README.md → Project overview
├─ 📜 LICENSE / CODE_OF_CONDUCT.md / CONTRIBUTING.md
├─ 🔧 auth-profile-implementation.md → Feature documentation
└─ 📦 package.json → Dependencies and project metadata

```


## 🤝 Contributing

We ❤️ contributions!

* Read the [Contributing Guide](./CONTRIBUTING.md).
* Check open issues or raise new ones.
* Submit pull requests with clear descriptions.

Every contribution counts — from bug fixes to new features!



## 📜 License

This project is licensed under the [MIT License](./LICENSE).



## 📄 Code of Conduct

We enforce a [Code of Conduct](./CODE_OF_CONDUCT.md) to maintain a safe, inclusive, and welcoming environment. Please read it before contributing.

## 📚 Setup Guides

For detailed setup instructions, please follow the full documentation here:  
[📄 DevSync Setup Docs](./docs)

 
## 👩‍💻 Maintainers

* **Annanya Tiwary** – [GitHub](https://github.com/Annanyatiwary4)


## ⭐ Support This Project

If **DevSync** inspired you:

* Star ⭐ the repo on [GitHub](https://github.com/DevSyncx/DevSync)
* Share it with your friends & community
* Contribute by fixing issues or adding features

Together, let’s make developer productivity smarter 🚀
