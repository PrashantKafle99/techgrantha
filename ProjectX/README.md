# Tech Grantha 📚

A modern, full-stack tech blogging platform that combines in-depth articles with daily tech updates, powered by AI-assisted content creation and real-time analytics.

## ✨ Features

- 📝 **Long-form Articles** - In-depth technical content and case studies
- 📰 **Daily Tech Updates** - Bite-sized daily news and insights
- 🤖 **AI Image Generation** - Powered by Google Gemini and Pollinations.ai
- 📊 **Real-time Analytics** - Visitor tracking and engagement metrics
- 👨‍💼 **Multi-role Admin System** - Super admin and regular admin roles
- 📱 **Fully Responsive** - Mobile-first design for all devices
- 🔒 **Secure Authentication** - JWT-based auth with role-based access
- ☁️ **Cloud Image Hosting** - Integrated with Cloudinary

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Shadcn/ui** components

### Backend
- **Node.js** with Express
- **Supabase** (PostgreSQL) for database
- **JWT** for authentication
- **Cloudinary** for image storage
- **Google Gemini API** for AI features

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- Cloudinary account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tech-grantha.git
cd tech-grantha
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

4. **Setup Database**
- Run migrations in `database/migrations/` in order
- See `database/migrations/MIGRATION_GUIDE.md` for details

### Environment Variables

#### Backend (.env)
```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 📖 Documentation

- [Setup Guide](SETUP_CHECKLIST.md)
- [Backend Setup](backend/SETUP.md)
- [AI Image Generation](AI_IMAGE_GENERATION_QUICKSTART.md)
- [Migration Guide](database/migrations/MIGRATION_GUIDE.md)
- [Mobile Responsive Updates](MOBILE_RESPONSIVE_UPDATES.md)

## 🔐 Default Admin Credentials

After running the database seeds:
- **Email**: `admin@techgrantha.com`
- **Password**: `Admin@123`

⚠️ **Change these immediately in production!**

## 📁 Project Structure

```
tech-grantha/
├── backend/              # Express API server
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, rate limiting, etc.
│   ├── utils/           # Helper functions
│   └── scripts/         # Utility scripts
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── contexts/    # React contexts
│   └── public/          # Static assets
├── database/            # Database setup
│   ├── migrations/      # SQL migrations
│   └── seeds/           # Seed data
└── docs/                # Documentation
```

## 🎯 Key Features Explained

### AI Image Generation
- Generate article images using AI prompts
- Multiple style options (professional, artistic, minimalist, etc.)
- Text overlay support for banners
- Automatic aspect ratio handling

### Analytics Dashboard
- Track page views and unique visitors
- Monitor article engagement
- View real-time statistics
- Privacy-friendly (no personal data collection)

### Admin Panel
- Create and manage articles
- Manage daily tech updates
- User management (super admin only)
- Real-time content statistics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Cloudinary](https://cloudinary.com) for image hosting
- [Google Gemini](https://ai.google.dev) for AI capabilities
- [Pollinations.ai](https://pollinations.ai) for image generation

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the tech community
