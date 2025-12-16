# Ruby 101 - All-in-One Personal Management App

> A comprehensive Ruby on Rails application featuring AI-powered assistance for managing finances, tasks, and blog posts.

![Ruby on Rails](https://img.shields.io/badge/Ruby%20on%20Rails-7.2.2-red?style=flat-square&logo=ruby-on-rails)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![DaisyUI](https://img.shields.io/badge/DaisyUI-Latest-5A0EF8?style=flat-square)

## ✨ Features

### 🤖 AI Assistant (Powered by Google Gemini)
- Natural language commands for creating transactions, todos, and blog posts
- Smart command parsing and validation
- Chat history with user session tracking
- Token usage limits with automatic reset
- Pre-filled command shortcuts

### 💰 Transaction Management
- Add income and expenses
- Date filtering (Daily, Monthly, Yearly)
- Summary statistics (Total Income, Total Expense, Net Balance)
- Real-time search functionality

### ✅ Todo List
- Create and manage tasks
- Mark tasks as pending or completed
- Card-based UI with real-time search
- Status badges

### 📝 Blog Posts
- Write and publish blog posts
- Rich text content
- Recent posts display on homepage
- Search functionality

### 🎨 Modern UI/UX
- Dark/Light theme switcher
- Responsive design with DaisyUI components
- Animated AI typing effect on homepage
- Smooth transitions and hover effects
- Mobile-friendly sidebar navigation

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Ruby**: 3.3.6 or higher
- **Rails**: 7.2.2 or higher
- **Node.js**: 18.x or higher
- **Yarn**: Latest version
- **SQLite3**: For development database

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ruby-101.git
cd ruby-101
```

### 2. Install dependencies

```bash
# Install Ruby gems
bundle install

# Install JavaScript packages
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following environment variable:

```env
# Google Gemini API Key (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here
```

**How to get a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste the key into your `.env` file

### 4. Set up the database

```bash
# Create database
rails db:create

# Run migrations
rails db:migrate

# (Optional) Seed sample data
rails db:seed
```

## 🏃 Running the Application

### Development Mode

```bash
# Start the Rails server and watch CSS/JS files
bin/dev
```

The application will be available at `http://localhost:3000`

### Alternative: Manual Start

If `bin/dev` doesn't work, you can start services separately:

```bash
# Terminal 1: Rails server
rails server

# Terminal 2: CSS watcher
yarn build:css --watch

# Terminal 3: JS watcher (if needed)
yarn build
```

## 👤 Creating Your First User

1. Navigate to `http://localhost:3000`
2. Click "Sign Up"
3. Enter your email and password
4. Start using the app!

## 🎯 Usage Guide

### Using the AI Assistant

**Option 1: Homepage Input**
- Click the animated AI Assistant input on the homepage
- The AI chat sidebar will open

**Option 2: Sidebar FAB Button**
- Click the purple FAB button (💬) on the right side
- Chat sidebar will slide out

**Example Commands:**
- `Add income: Salary 50000 baht`
- `Add expense: Lunch 150 baht`
- `Create todo: Finish project report`
- `Write post: My learning journey`

### Managing Transactions

1. Go to "Transactions" from the sidebar
2. Click "New Transaction" or use AI Assistant
3. Filter by date using the controls:
   - **วันนี้** button: Jump to today
   - **< >** buttons: Navigate periods
   - **Date picker**: Select specific date
   - **View mode**: Switch between Daily/Monthly/Yearly

### Managing Todos

1. Go to "To-Do List" from the sidebar
2. Click "New Todo" or use AI Assistant
3. Mark tasks as completed
4. Use search to filter tasks

### Writing Blog Posts

1. Go to "Blog" from the sidebar
2. Click "Write Post" or use AI Assistant
3. Write your content
4. Publish and view on homepage

## 🛠️ Tech Stack

### Backend
- **Ruby on Rails** 7.2.2
- **SQLite3** (Development/Production)
- **Devise** (Authentication)
- **HTTParty** (API requests)

### Frontend
- **TailwindCSS** 3.4
- **DaisyUI** (Component library)
- **Stimulus.js** (JavaScript framework)
- **Turbo** (SPA-like navigation)

### AI Integration
- **Google Gemini API** (gemini-2.0-flash model)
- Natural language processing
- Structured JSON responses

## 📁 Project Structure

```
ruby-101/
├── app/
│   ├── controllers/      # Rails controllers
│   ├── models/          # ActiveRecord models
│   ├── views/           # ERB templates
│   ├── javascript/      # Stimulus controllers
│   ├── services/        # Business logic (GeminiService)
│   └── assets/          # CSS and images
├── config/
│   ├── routes.rb        # Application routes
│   └── database.yml     # Database configuration
├── db/
│   ├── migrate/         # Database migrations
│   └── schema.rb        # Database schema
├── .env                 # Environment variables (create this)
└── bin/dev             # Development startup script
```

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features |

## 🚂 Deployment to Railway

### Prerequisites
- Railway account ([Sign up here](https://railway.app/))
- GitHub repository with your code

### Step 1: Generate Secret Key Base

Run this command locally to generate a secret key:

```bash
rails secret
```

Copy the generated key (you'll need it in Step 3).

### Step 2: Create New Project on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `ruby-101` repository
5. Railway will auto-detect it's a Rails app

### Step 3: Add Environment Variables

In your Railway project dashboard, go to **Variables** tab and add:

| Variable | Value | Required |
|----------|-------|----------|
| `SECRET_KEY_BASE` | [Your generated secret from Step 1] | ✅ Yes |
| `RAILS_ENV` | `production` | ✅ Yes |
| `GEMINI_API_KEY` | [Your Gemini API key] | ✅ Yes |
| `RAILS_SERVE_STATIC_FILES` | `true` | ✅ Yes |

### Step 4: Deploy

1. Railway will automatically deploy when you push to your main branch
2. Wait for build to complete (usually 2-5 minutes)
3. Click on your deployment URL to access your app

### Step 5: Run Database Migrations

After first deployment, run migrations:

1. Go to your Railway project
2. Open the **Deployments** tab
3. Click on the latest deployment
4. Open the **Shell** tab
5. Run:
```bash
rails db:migrate
```

### Custom Domain (Optional)

1. Go to **Settings** tab in Railway
2. Click **Generate Domain** for a free `.up.railway.app` domain
3. Or add your custom domain

### Troubleshooting Railway Deployment

**Build fails with missing gems:**
```bash
# Make sure your Gemfile.lock is committed
git add Gemfile.lock
git commit -m "Add Gemfile.lock"
git push
```

**Database errors:**
- Railway automatically provides a PostgreSQL database
- If using SQLite, it will work but data won't persist between deployments
- For production, consider switching to PostgreSQL

**Assets not loading:**
- Ensure `RAILS_SERVE_STATIC_FILES=true` is set in environment variables
- Check that `config/environments/production.rb` has `config.public_file_server.enabled = true`

## 🐛 Troubleshooting

### AI features not working
- Verify your `GEMINI_API_KEY` is set correctly in `.env`
- Check if you have remaining API quota
- Token limits reset at midnight Bangkok time (GMT+7)

### Database issues
```bash
# Reset database
rails db:drop db:create db:migrate
```

### Asset compilation errors
```bash
# Clear cache and recompile
rails assets:clobber
yarn build:css
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**
- GitHub: [@Chawn](https://github.com/Chawn/)

## 🙏 Acknowledgments

- Google Gemini AI for powering the AI assistant
- DaisyUI for beautiful UI components
- Ruby on Rails community

---

Made with ❤️ using Ruby on Rails
