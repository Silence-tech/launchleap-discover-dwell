# Producshine - Product Discovery Platform

## Overview

Producshine is a modern web application for discovering and sharing innovative tools and products. Built as a Product Hunt-style platform, it allows users to discover new tools, submit their own products, track trending launches, and engage with a community of creators and early adopters. The platform features a sleek glassmorphic design with cosmic-themed aesthetics and focuses on providing an intuitive user experience for product discovery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router for client-side navigation with protected routes
- **UI Framework**: Custom design system built on Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom glassmorphic theme and cosmic design tokens
- **State Management**: React Context for authentication state, React Query for server state management

### Design System
- **Theme**: Glassmorphic and cosmic-inspired design with gradient overlays and backdrop blur effects
- **Color Palette**: Pastel and dreamy colors with cosmic blue, mystic purple, and neon cyan accents
- **Components**: Comprehensive UI component library with variants for glass, cosmic, hero, and neon styles
- **Typography**: Gradient text effects and modern font hierarchy
- **Animations**: CSS animations for cosmic pulse effects and smooth transitions

### Authentication & Authorization
- **Provider**: Supabase Auth with Google OAuth integration
- **Strategy**: Email/password and social authentication (Google)
- **Protection**: Route-level authentication guards for protected pages (Submit Tool, Profile, Settings)
- **Profile Management**: User profiles with username, tagline, bio, and avatar support

### Data Management
- **Database**: Supabase (PostgreSQL) for data persistence
- **ORM**: Drizzle ORM for type-safe database interactions
- **Caching**: React Query for intelligent data fetching, caching, and synchronization
- **Real-time**: Potential for real-time updates through Supabase subscriptions

### Core Features
- **Tool Discovery**: Browse and filter tools with search functionality
- **Tool Submission**: Authenticated users can submit new tools with logo uploads
- **Upvoting System**: Community-driven ranking through upvotes
- **Trending**: Algorithm-based trending tools display
- **User Profiles**: Comprehensive user profile management
- **Responsive Design**: Mobile-first responsive layout with sidebar navigation

### File Structure
- **Component Organization**: Modular component structure with UI components, layout components, and feature-specific components
- **Page Routing**: Clear separation between public pages (Home, Discover, Trending) and protected pages (Submit, Profile, Settings)
- **Hook Architecture**: Custom hooks for authentication, mobile detection, and toast notifications
- **Type Safety**: Comprehensive TypeScript configuration with path aliases for clean imports

## External Dependencies

### Core Infrastructure
- **Supabase**: Backend-as-a-Service providing PostgreSQL database, authentication, file storage, and real-time subscriptions
- **Vercel/Netlify**: Potential deployment platform for static site hosting

### UI & Styling
- **Radix UI**: Headless UI component primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Icon library for consistent iconography
- **next-themes**: Theme management for dark/light mode support

### Development & Build
- **Vite**: Modern build tool and development server
- **TypeScript**: Static type checking for enhanced developer experience
- **ESLint**: Code linting and formatting standards

### Data & State Management
- **React Query (TanStack Query)**: Server state management and data fetching
- **React Hook Form**: Form handling with validation
- **Drizzle ORM**: Type-safe database interactions

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **class-variance-authority**: Component variant management
- **embla-carousel**: Carousel/slider functionality