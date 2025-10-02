# SIH 2025 Civic Issue Reporting Platform

A comprehensive Next.js 14 demo application for the Smart India Hackathon 2025, showcasing a government civic issue reporting and management system with role-based dashboards, analytics, and real-time status updates.

## 🚀 Features

### Core Functionality
- **Role-Based Authentication**: Admin, Department Head, and Staff roles with different permissions
- **Interactive Dashboards**: Customized dashboards for each user role with relevant metrics
- **Report Management**: Complete CRUD operations for civic issue reports
- **Real-Time Updates**: Status updates and notifications using Redux state management
- **Analytics & Charts**: Comprehensive analytics with interactive charts using Recharts
- **Responsive Design**: Mobile-first design with professional government theme

### User Roles & Capabilities

#### 🛡️ Admin
- System-wide overview and analytics
- Department and user management
- Complete report oversights
- Performance metrics across all departments

#### 👑 Department Head
- Department-specific dashboard and analytics
- Staff management and task assignment
- Department performance tracking
- Report routing and prioritization

#### 💼 Staff
- Personal task dashboard
- Assigned report management
- Status updates and progress tracking
- Task completion workflows

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: Redux Toolkit
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Data**: Mock data with lib/seedData.js

## 📁 Project Structure

```
sih-civic-platform/
├── src/app/                    # Next.js App Router pages
│   ├── dashboard/             # Role-based dashboard
│   ├── reports/               # Report management
│   ├── analytics/             # Analytics and charts
│   ├── departments/           # Department management (Admin)
│   ├── users/                 # User management (Admin)
│   └── tasks/                 # Task management (Staff)
├── components/
│   ├── dashboards/            # Role-specific dashboard components
│   ├── layout/                # Navbar, Sidebar components
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── seedData.js            # Mock data source
│   └── utils.ts               # Utility functions
└── redux/
    ├── store.ts               # Redux store configuration
    └── slices/                # Redux slices for state management
```

## 🎨 Design Theme

Professional government portal design with:
- **Primary Colors**: Blue gradient (blue-600 to blue-700)
- **Secondary Colors**: Green for success states, Amber for warnings, Red for critical
- **Background**: Clean gray shades (gray-50, gray-100)
- **Typography**: Inter font family for modern readability
- **Components**: Rounded corners, subtle shadows, professional spacing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sih-civic-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login

The application includes mock authentication. Use the login cards on the homepage to access different user roles:

- **Admin**: Full system access
- **Department Head**: Department-specific management (choose from Sanitation, Public Works, etc.)
- **Staff**: Task-focused interface (choose from available staff members)

## 📊 Key Features Showcase

### Dashboard Analytics
- **Real-time Metrics**: Live statistics and KPIs
- **Interactive Charts**: Bar, Pie, Line, and Area charts
- **Performance Tracking**: Resolution rates, response times
- **Trend Analysis**: Historical data visualization

### Report Management
- **Advanced Filtering**: Search by status, priority, department
- **Status Tracking**: Complete workflow from submission to resolution
- **Priority Management**: Critical, High, Medium, Low priority levels
- **Assignment System**: Automatic and manual task assignment

### Role-Based Access
- **Secure Routing**: Pages restricted based on user roles
- **Contextual Navigation**: Role-appropriate menu items
- **Personalized Dashboards**: Relevant data for each user type

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Mock Data

The application uses `lib/seedData.js` for demo purposes, containing:
- 5 Government departments (Sanitation, Public Works, Electricity, Water Supply, Parks)
- 16 Users across different roles
- 15 Sample reports with various statuses and priorities
- 10 Notification samples

### State Management

Redux Toolkit slices manage:
- **Auth**: User authentication and role management
- **Reports**: CRUD operations and filtering
- **Notifications**: Real-time updates and alerts
- **UI**: Theme, sidebar, modals, and toast notifications

## 🎯 Demo Highlights

This application demonstrates:
- **Modern React Patterns**: Hooks, Context, and Redux integration
- **TypeScript Best Practices**: Type safety and developer experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Government UX**: Professional, accessible, and intuitive interface
- **Scalable Architecture**: Modular components and clean code structure

## 📱 Responsive Design

Fully responsive across all devices:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with stacked layouts

## 🔮 Future Enhancements

Potential extensions for a production system:
- Real backend API integration
- Database connectivity (PostgreSQL/MongoDB)
- Authentication with JWT/OAuth
- Real-time notifications with WebSockets
- File upload for report attachments
- Email notifications and SMS alerts
- Advanced reporting and export features
- Multi-language support
- Dark mode toggle

## 📄 License

This project is created for SIH 2025 demonstration purposes.

---

**Built with ❤️ for Smart India Hackathon 2025**
