# Supervity Market Intelligence Agent

A modern React-based web application for conducting intelligent market research and analysis. This application provides an intuitive interface for submitting research queries and viewing structured results through interactive dashboards.

## 🚀 Features

- **Interactive Query Interface** - Submit complex market research queries through a user-friendly form
- **Real-time Research Processing** - Track research progress with animated loading stages
- **Dynamic Dashboard** - View structured research results with interactive data visualization
- **Chat Interface** - Engage with research results through an integrated chat system
- **Data Export** - Export research findings in various formats
- **Responsive Design** - Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Markdown Rendering**: React Markdown with GitHub Flavored Markdown

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard-related components
│   │   ├── ChatInterface.tsx
│   │   ├── DataCard.tsx
│   │   ├── LoadingStages.tsx
│   │   ├── ReportViewer.tsx
│   │   ├── StructuredDataTabs.tsx
│   │   └── StructuredDataViewer.tsx
│   ├── forms/              # Form components
│   │   └── QueryForm.tsx
│   ├── layout/             # Layout components
│   │   └── Header.tsx
│   └── ui/                 # Reusable UI components
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── TextArea.tsx
├── config/                 # Configuration files
│   └── api.ts
├── hooks/                  # Custom React hooks
│   ├── api/
│   │   └── useResearchQueries.ts
│   └── useAnimatedLogs.ts
├── pages/                  # Page components
│   ├── DashboardPage.tsx
│   ├── HomePage.tsx
│   └── LoadingPage.tsx
├── services/               # API services
│   ├── api.ts
│   └── researchApi.ts
├── store/                  # State management
│   ├── useAppStore.ts
│   ├── useChatStore.ts
│   └── useResearchStore.ts
└── types/                  # TypeScript type definitions
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd market_intelligence_agent/project
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Usage

1. **Submit Research Query**: Navigate to the home page and fill out the research query form with your market intelligence requirements.

2. **Track Progress**: After submission, you'll be redirected to a loading page where you can monitor the research progress in real-time.

3. **View Results**: Once complete, access the dashboard to explore structured data, reports, and interactive visualizations.

4. **Chat Interface**: Use the integrated chat system to ask follow-up questions about your research results.

## 🔄 Application Flow

1. **Home Page** (`/`) - Research query submission form
2. **Loading Page** (`/research/:jobId`) - Real-time progress tracking
3. **Dashboard** (`/dashboard/:jobId`) - Results visualization and interaction

## 🎨 UI Components

The application features a comprehensive set of reusable UI components:

- **Form Elements**: Custom input fields, textareas, and buttons
- **Data Display**: Cards, badges, and structured data viewers
- **Navigation**: Header and routing components
- **Feedback**: Loading states, toast notifications, and progress indicators

## 🔧 Configuration

### API Configuration

The application communicates with a backend API. Configure the API endpoint in your environment variables:

```env
VITE_API_URL=your-api-endpoint
```

### Styling

The project uses Tailwind CSS for styling. Customize the design system by modifying:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🐛 Bug Reports

If you encounter any issues, please report them through the appropriate channels with:
- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information

## 🔮 Future Enhancements

- Advanced data visualization charts
- Real-time collaboration features
- Enhanced export options
- Mobile app development
- AI-powered insights and recommendations 