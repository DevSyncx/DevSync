# 🤝 Contributing to DevSync

Thank you for considering contributing to **DevSync**! 🎉  
We welcome all kinds of contributions — from code improvements and documentation to feature suggestions and bug reports.

## 📋 Table of Contents

- [Getting Started](#-Getting-Started)
- [How to Contribute](#-How-to-Contribute)
- [Code Guidelines](#-Code-Guidelines)
- [Submitting Changes](#-Submitting-Changes)
- [Reporting Bugs](#-reporting-bugs)
- [Requesting Features or Enhancements](#-requesting-features-or-enhancements)
- [Improving Documentation](#-improving-documentation)
- [Levels](#-labels-and-levels)
- [Issue Completion Timelines](#-Issue-Completion-Timeline)
- [Contributor Guidelines – Issue & PR Management](#-Contributor-Guidelines)
- [Community Standards](#-Community-Standards)


---

## 🛠 Getting Started

1. **Fork** this repository.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/your-username/DevSync.git
   cd DevSync
3. **Setup Frontend**
```bash 
#move into the frontend directory
cd frontend
#install frontend dependencies
npm install
# Run the app
npm run dev  # Starts frontend on http://localhost:5173
```


4. **Setup backtend**
```bash 
#move into the backend directory
cd backend
#install backend dependencies
npm install
# Run the app
npm run dev   # Starts frontend on http://localhost:5173
```


---

## ✨ How to Contribute

Here are some ways you can contribute:

- 📂 Work on open issues
- 🐞 Report bugs
- 💡 Suggest new features
- 🧹 Improve documentation
- 🧪 Add or improve test coverage
- 🖌️ Design or UI improvements

---

## 🧭 Code Guidelines

- Write **clean**, **modular**, and **well-commented** code.
- Follow naming conventions already used in the codebase.
- For UI components, use the existing **Shadcn UI** structure.
- Keep commits **atomic** and **descriptive**.
---

## 🚀 Submitting Changes

1. **Create a new branch**:

   ```bash
   git checkout -b feature/your-feature-name

   ```

2. **Make your changes and commit**:

```bash
git add .
git commit -m "Add: Meaningful description of your change"
```
3. **Push to your fork**:

 ```bash
git push origin feature/your-feature-name
```
4. Open a Pull Request (PR) to the main branch.

💬 If your PR fixes an issue, mention it with Fixes #issue-number in the PR description.

---

### 🐞 Reporting Bugs
Please include the following in your bug reports:

- ✅ **Clear and descriptive title** of the bug.
- 📝 A short explanation of what’s broken.
- 🔍 **File name & line number**, if possible.
- 🆚 Describe **expected vs actual behavior**.
- 📷 Add **screenshots or screen recordings** (if applicable).
- 🔁 Include **steps to reproduce** the issue.

### 🌟 Requesting Features or Enhancements
Want to suggest something cool or improve the UX/UI? Here’s what to include:

- ✅ A descriptive **title** and a clear explanation of the idea.
- 💡 Explain **why it’s useful** or needed.
- 🖼️ Include **mockups or screenshots** if it's a UI/UX feature.
- 🔗 If related to backend/API, mention the **endpoints or data flow**.

### 📚 Improving Documentation
Spotted unclear, outdated, or missing documentation?

- ✏️ Point out the exact **section or file** to update.
- 🧩 Suggest or provide improved content.
- 💬 Ask for clarification in case something is confusing.

### 🏷️ Labels and Levels
All issues are tagged to help contributors choose wisely:

| Level   | Suitable For        | Points |
|---------|---------------------|--------|
| `L-1`   | Beginners            | 3      |
| `L-2`   | Intermediate tasks   | 7      |
| `L-3`   | Advanced/complex     | 10     |

## 🕒 Issue Completion Timeline

To ensure smooth progress and timely contributions during GSSoC, we’ve defined expected completion times for issues based on their difficulty levels:

| Level | Difficulty    |Expected Completion Time |
|-------|---------------|-------------------------|
| Level 1 | Beginner    |       **2-3 days**      |
| Level 2 | Intermediate|       **4-6 days**      |
| Level 3 | Advanced    |       **7-10 days**     |

## 📌 Contributor Guidelines

### 🧑‍💻 Issue Assignment

- 🟢 You can **only start working on an issue once it has been officially assigned to you**.
- 🏃‍♀️ We follow a **first come, first serve** policy — the **first person to comment** on an issue will be assigned.
- 🚫 **PRs for unassigned issues will not be accepted or merged.**
- 🧠 If you're already assigned to an issue, you **must get your current PR at least approved** (even if not merged) **before claiming a new issue**.

---

### ⏳ Inactive Issues

- 💤 If there is **no activity for 3 days** after assignment, the issue will be marked as **`stale`**.
- 🔁 After being marked stale for **12 more hours**, the issue will be **unassigned and reassigned** to another contributor to ensure progress.

---

### 🕒 Requesting Extensions

- 🗓️ If you require more time, please **inform a maintainer before the issue is marked stale**.
- 🧍 We understand delays happen — just communicate and request an extension politely!

---

### 🔄 Pull Request (PR) Management

#### ⚠️ Keeping PRs Up-to-Date

- 🆕 Always ensure your PR is **up-to-date with the latest changes** from the `main` branch.
- 💻 Run `git pull` regularly on your fork/branches to avoid merge conflicts or outdated changes.
- 🧪 This helps maintainers test and review your changes smoothly without delays.

#### 💤 Inactive Pull Requests

- ⏸️ PRs with no activity for **3 days** will be **marked as stale**.
- ❌ If no updates are made within the next **24 hours**, the PR will be **closed**, and the issue will be **unassigned**.

---

## 🌐 Community Standards

We expect all contributors to follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to foster an inclusive and respectful community.
