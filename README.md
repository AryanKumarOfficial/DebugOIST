# DEBUG OIST CLUB WEBSITE - SRS Document

![Next.js](https://img.shields.io/badge/Next.js-14-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-blue)
![Shadcn/UI](https://img.shields.io/badge/Shadcn/UI-Components-purple)
![Aceternity UI](https://img.shields.io/badge/Aceternity-UI-orange)

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [System Requirements](#-system-requirements)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Installation Guide](#-installation-guide)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Security Considerations](#-security-considerations)
- [Testing](#-testing)
- [Maintenance](#-maintenance)
- [Contribution Guidelines](#-contribution-guidelines)
- [License](#-license)

## 🚀 Project Overview
This project is a **Next.js-based CLUB WEBSITE** designed to manage events, users, and future features of the DEBUG OIST Club. It utilizes **Clerk Authentication**, **MongoDB**, and **shadcn/UI** for a modern UI experience. The dashboard supports CRUD operations for events, user management, and email notifications via external services like SendGrid or Mailgun.

## 💻 System Requirements

### Minimum Hardware Requirements
- **CPU**: Dual-core processor, 2.0 GHz or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB of free disk space
- **Internet**: Broadband connection

### Software Requirements
- **Node.js**: v18.0.0 or higher
- **npm/yarn/pnpm**: Latest stable version
- **MongoDB**: v4.4 or higher (local or Atlas)
- **Web Browser**: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux

## 📌 Features

### Authentication Module
- Secure login and registration via Clerk
- Role-based access control (Admin, Member)
- User profile management

### Events Module
- **Admin Features**:
  - Create, read, update, delete events
  - View event registrations
  - Export event data
  - Send notifications to registered users
- **Member Features**:
  - View upcoming and past events
  - Register for events
  - Cancel registration

### Members Module
- **Admin Features**:
  - View all members
  - Assign/modify roles
  - Manage member status
- **Member Features**:
  - View and edit own profile
  - Track participation in events

### Dashboard
- Responsive admin interface
- Analytics and reporting
- User activity monitoring

### Future Enhancements
- Blog/Announcements module
- Resource library
- Discussion forum

## 🏗️ System Architecture

<img src="./arch.png" alt="System Architecture" width="100%" height="100%"/>

The application follows a modern Next.js architecture with:
- **Frontend**: Server and client components
- **Backend**: API routes and Server Actions 
- **Authentication**: External service (Clerk)
- **Database**: MongoDB connection
- **File Storage**: Cloudinary integration

## 🛠️ Tech Stack
- **Frontend**: 
  - Next.js 14 (App Router)
  - React 18
  - Tailwind CSS
  - shadcn/UI components
  - Aceternity UI effects
  - Zod (form validation)
  - React Hook Form
  
- **Backend**: 
  - Next.js API Routes
  - Server Actions
  - Mongoose ODM
  
- **Authentication**: 
  - Clerk authentication
  
- **Database**: 
  - MongoDB
  
- **Storage**: 
  - Cloudinary (image uploads)
  
- **Email Service**: 
  - SendGrid/Mailgun integration
  
- **State Management**: 
  - React hooks (local state)
  - Context API (global state)

## 📊 Database Schema

The application uses MongoDB with the following main collections:

### Users Collection
Managed by Clerk with additional profile data in MongoDB

### Events Collection
- **id**: ObjectId (primary key)
- **title**: String (required)
- **description**: String (required)
- **date**: Date (required)
- **time**: String
- **location**: String
- **imageUrl**: String
- **capacity**: Number
- **registrations**: Array of user references
- **status**: String (upcoming, ongoing, completed, cancelled)
- **createdAt**: Date
- **updatedAt**: Date

### Registrations Collection
- **id**: ObjectId (primary key)
- **eventId**: ObjectId (reference to Events)
- **userId**: String (reference to Clerk user)
- **status**: String (registered, attended, cancelled)
- **registeredAt**: Date

## 📦 Installation Guide

### Prerequisites
1. Install Node.js (v18+) and npm/yarn/pnpm
2. Install MongoDB locally or set up MongoDB Atlas account
3. Register for Clerk authentication
4. Set up Cloudinary account for image uploads

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/AryanKumarOfficial/DebugOIST.git
cd DebugOIST
```

### 2️⃣ Install Dependencies
Using yarn:
```sh
yarn install
```

Using npm:
```sh
npm install
```

Using pnpm:
```sh
pnpm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file based on `.env.example`:
```sh
cp .env.example .env.local
```

Edit `.env.local` with your specific credentials:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGO_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

### 4️⃣ Run the Development Server
Using yarn:
```sh
yarn dev
```

Using npm:
```sh
npm run dev
```

Using pnpm:
```sh
pnpm dev
```

Access the website at `http://localhost:3000`

## ⚙️ Configuration

### Authentication Setup
1. Create an account at [clerk.dev](https://clerk.dev)
2. Set up an application and copy API keys
3. Configure sign-in/sign-up methods as needed

### MongoDB Setup
1. Local installation: Start MongoDB service
2. Atlas: Create cluster and database
3. Configure connection string in `.env.local`

### Cloudinary Setup
1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Retrieve API credentials
3. Configure in `.env.local`

## 🖥️ Usage Guide

### Admin Dashboard
1. Access `/dashboard` after logging in with admin credentials
2. Navigate through sidebar menu for different management features:
   - Events management
   - User management
   - Settings

### Event Management
1. Create events via "Add New Event" button
2. Fill in event details including images
3. Publish or save as draft
4. Manage registrations for each event

### User Registration
1. Users can sign up through the authentication system
2. Admins can manage users through the dashboard
3. Users can update their profiles

## 📝 API Documentation

### Events API
- `GET /api/events` - List all events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get event details
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Registrations API
- `GET /api/registrations` - List all registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations/:id` - Get registration details
- `PATCH /api/registrations/:id` - Update registration
- `DELETE /api/registrations/:id` - Cancel registration

### Users API
- Managed through Clerk with custom endpoints for additional functionality

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with a single click:
```sh
vercel deploy
```



## 🛡️ Security Considerations
- **Environment Variables**: Store sensitive credentials securely
- **Authentication**: Implement proper authentication flows via Clerk
- **Role-Based Access Control (RBAC)**: Restrict dashboard access to admins
- **API Security**: Validate input and implement rate limiting
- **Data Validation**: Use Zod for schema validation
- **Regular Updates**: Keep dependencies up to date

## 🧪 Testing
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API route testing
- **End-to-End Tests**: Full application testing with Cypress
- **Accessibility Testing**: Ensure compliance with a11y standards

## 🔧 Maintenance
- **Dependency Updates**: Regular package updates via `yarn upgrade` or `npm update`
- **Performance Monitoring**: Use Vercel Analytics
- **Error Tracking**: Implement error logging and monitoring
- **Backup Strategy**: Regular database backups

## 📝 Contribution Guidelines
1. **Fork the repository**.
2. **Create a new feature branch**: `git checkout -b feature/your-feature-name`.
3. **Commit your changes**: Follow conventional commit messages.
4. **Push the branch**: `git push origin feature/your-feature-name`.
5. **Create a Pull Request**: Provide clear description of changes.

### Coding Standards
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Document new features

## 📜 License
This project is **MIT Licensed**. Feel free to use and modify it for your needs.

---
🚀 **Built with Next.js, MongoDB & Clerk Authentication.**
