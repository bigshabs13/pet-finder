Pet-Finder

Pet-Finder is a modern, lightweight web application designed to help reunite lost pets with their owners using QR code technology. Built with vanilla JavaScript and Supabase, it offers a simple yet powerful solution for pet safety.






Features
Core Functionality

Instant Pet Recovery: QR codes provide immediate access to owner contact information

Mobile-First Design: Fully responsive interface that works on all devices

Secure Authentication: Email verification with branded confirmation emails

Pet Dashboard: Manage multiple pets with detailed profiles

QR Code Generation: High-quality, downloadable QR codes for pet tags

Dark Mode Support: Email templates adapt to user preferences

User Experience

No App Required: Works directly in any web browser

High Performance: Pure vanilla JS with no heavy frameworks

Modern UI: Clean interface with smooth animations

Branded Emails: Professional email confirmations with Pet-Finder branding

Real-time Updates: Instant synchronization across devices

Technology Stack
Frontend

HTML5: Semantic, accessible markup

CSS3: Custom styling with flexbox/grid, animations, and responsive design

Vanilla JavaScript: Pure ES6+ with async/await

Web APIs: File download, QR generation, local storage

Backend & Services

Supabase

PostgreSQL database with Row Level Security (RLS)

Built-in authentication and JWT tokens

Real-time subscriptions

Customizable email service

QR Server API: External service for QR code generation

Email Templates: Custom HTML templates with dark mode support

Development

No Build Process: Direct file serving

Git: Version control

Environment Variables: Secure credential setup

Static Hosting: Deployable on Netlify, Vercel, GitHub Pages, etc.

Quick Start
Option 1: Instant Deploy (Recommended)

Clone the repository:

git clone https://github.com/bigshabs13/pet-finder.git
cd pet-finder


Start local server:

python3 -m http.server 3000


Open browser: Visit http://localhost:3000

Complete setup: Follow the guided Supabase configuration steps

Option 2: Full Setup

Create Supabase Project

Configure Database using DATABASE_SCHEMA.sql

Copy API Credentials from Supabase dashboard

Update app.js with your project keys

Optional: Customize email templates

Project Structure
pet-finder/
├── index.html                 
├── app.js                     
├── DATABASE_SCHEMA.sql        
├── images/                    
├── email-templates/           
├── docs/                      
├── .env.example               
└── README.md                  

Development
Local Development
python3 -m http.server 3000
npx serve .
php -S localhost:3000

Environment Variables
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

Database Schema

Includes:

pets table

RLS policies

Indexes

Storage bucket setup

Usage Guide
For Pet Owners

Register

Add pet details

Generate QR code

Download and print

Attach to pet collar

For Pet Finders

Scan QR

View pet info

Contact owner

Help return the pet safely

Configuration Options
Email Customization

Templates:

Full-featured

Minimal branded

Basic fallback

Supabase Settings

Email confirmation

Secure RLS policies

Optional storage bucket

Real-time subscriptions

Deployment
# Netlify
netlify deploy --prod --dir .

# Vercel
vercel --prod

# GitHub Pages
# Push to main with Pages enabled

Security Features

Row Level Security

JWT authentication

Email verification

Input validation

HTTPS-ready

Troubleshooting

Supabase not configured

Update SUPABASE_URL and SUPABASE_ANON_KEY

Email not received

Check spam

Try another provider

QR code not generating

Ensure API connectivity

Login issues

Clear cache

Verify schema setup

Contributing

Fork repository

Create a feature branch

Commit changes

Push and open PR

Development guidelines:

Use vanilla JS

Maintain code style

Test across browsers

Update docs when needed

License

MIT License — see LICENSE.

Acknowledgments

Supabase

QR Server

All contributors

Support

GitHub Issues

Documentation in /docs

GitHub Discussions
