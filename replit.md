# ChatKit Starter Template

## Overview

This is a Next.js-based starter application that integrates OpenAI's ChatKit web component to create a conversational AI interface. The application provides a minimal UI with theming controls and connects to OpenAI's Agent Builder workflows. It serves as a bootstrap template for building ChatKit-powered applications with custom configurations for prompts, themes, and session management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### October 21, 2025 - Zoning District Lookup API Endpoint
- Added new POST endpoint `/api/lookup_zoning_district` for ArcGIS FeatureServer integration
- Implements geospatial query with lat/lon coordinates to identify zoning districts
- Includes robust validation (type checking, NaN validation, coordinate range validation)
- Uses proper WGS84 spatial reference (EPSG:4326) for accurate geospatial queries
- Returns structured JSON responses for found/not found/error cases

### October 13, 2025 - Vercel to Replit Migration
- Migrated project from Vercel to Replit environment
- Updated Next.js dev and start scripts to bind to port 5000 and host 0.0.0.0 for Replit compatibility
- Installed all npm dependencies (342 packages)
- Configured development workflow for Next.js Dev Server on port 5000
- Set up deployment configuration for autoscale deployment target
- Configured required environment variables (OPENAI_API_KEY, NEXT_PUBLIC_CHATKIT_WORKFLOW_ID) in Replit Secrets

## System Architecture

### Frontend Architecture

**Framework Choice: Next.js 15 with App Router**
- **Problem**: Need a modern React framework with SSR/SSG capabilities and API routes
- **Solution**: Next.js App Router with React 19 for server and client components
- **Rationale**: Provides built-in API routes, server-side rendering, and optimal performance out of the box

**Component Structure**
- Client-side rendering for interactive chat interface using `"use client"` directives
- Separation of concerns with dedicated components (`ChatKitPanel`, `ErrorOverlay`)
- Custom hooks for color scheme management (`useColorScheme`)

**Styling Approach: Tailwind CSS v4**
- **Problem**: Need a utility-first CSS framework with dark mode support
- **Solution**: Tailwind CSS with custom theme configuration and CSS variables
- **Rationale**: Provides rapid styling with built-in dark mode and minimal bundle size

### State Management

**Color Scheme Management**
- Custom hook (`useColorScheme`) with system preference detection
- Local storage persistence for user preferences
- Media query subscription for automatic theme switching
- Support for light, dark, and system-based themes

**Session Management**
- Cookie-based session tracking (`chatkit_session_id`)
- 30-day session persistence
- User ID resolution from cookies or new generation

### ChatKit Integration

**Web Component Architecture**
- Uses `@openai/chatkit-react` library for React integration
- External script loading via Next.js Script component for ChatKit bundle
- Custom theme configuration with grayscale and accent color controls

**Event Handling**
- Widget action callbacks for fact saving
- Response end event tracking
- Theme request handling for dynamic theme changes

**Error Handling**
- Multi-layered error tracking (script, session, integration errors)
- Error overlay component with retry functionality
- Development-mode error logging

### API Architecture

**Session Creation Endpoint (`/api/create-session`)**
- **Problem**: Need secure server-side session creation with OpenAI API
- **Solution**: Next.js API route that proxies requests to OpenAI's session API
- **Rationale**: Keeps API keys secure on the server, provides cookie management

**Request Flow**
1. Client requests session creation
2. Server validates OpenAI API key
3. Server resolves or creates user ID
4. Server makes authenticated request to OpenAI API
5. Server sets session cookie and returns session data

**Zoning District Lookup Endpoint (`/api/lookup_zoning_district`)**
- **Problem**: Need to query geospatial data from ArcGIS FeatureServer for zoning information
- **Solution**: Next.js API route that accepts lat/lon coordinates and queries ArcGIS REST API
- **Rationale**: Server-side querying provides consistent interface and error handling

**Request/Response Format**
- Request: `{ "lat": number, "lon": number }`
- Success (found): `{ "found": true, "district": string, "attributes": object }`
- Success (not found): `{ "found": false }`
- Error: `{ "error": string }` with appropriate HTTP status code

**Validation & Security**
- Type validation for lat/lon parameters
- Coordinate range validation (lat: -90 to 90, lon: -180 to 180)
- JSON parsing error handling with 400 status codes
- Sanitized error messages that don't leak internal details
- Proper spatial reference (EPSG:4326/WGS84) for accurate geospatial queries

### Configuration Management

**Environment Variables**
- `OPENAI_API_KEY`: Server-side API authentication
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`: Client-exposed workflow identifier
- `CHATKIT_API_BASE`: Optional custom API endpoint (defaults to `https://api.openai.com`)

**Application Configuration (`lib/config.ts`)**
- Centralized configuration for starter prompts, placeholders, and greetings
- Dynamic theme generation based on color scheme
- Workflow ID management

## External Dependencies

### OpenAI Services
- **ChatKit API**: Core conversational AI functionality
- **Agent Builder Workflows**: Configurable AI agent behaviors
- **Session Management API**: User session creation and persistence
- **CDN-hosted ChatKit Script**: Web component bundle (`https://cdn.platform.openai.com/deployments/chatkit/chatkit.js`)

### Third-Party Libraries
- **React 19**: UI library with latest concurrent features
- **Next.js 15**: Full-stack React framework with App Router
- **@openai/chatkit-react**: Official ChatKit React integration library
- **Tailwind CSS v4**: Utility-first CSS framework with PostCSS
- **dotenv**: Environment variable management for development

### Development Tools
- **TypeScript 5**: Static type checking
- **ESLint 9**: Code linting with Next.js configuration
- **Tailwind CSS Oxide**: Optimized Tailwind compiler (Linux x64 binary)
- **Lightning CSS**: Fast CSS processing (Linux x64 binary)

### Browser APIs
- **MediaQuery API**: System color scheme detection
- **LocalStorage**: Theme preference persistence
- **Cookie API**: Session management
- **Fetch API**: HTTP requests to session endpoint