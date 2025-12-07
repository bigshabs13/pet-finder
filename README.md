# PetFinder

A modern web application that helps pet owners register pets, generate unique QR codes for collars/tags, and reunite with their pets faster when they go missing. When someone scans the QR code, they instantly see the pet's profile and can contact the owner via WhatsApp or report a sighting.

## Features

**Core Functionality**
- Secure pet registration with detailed profiles
- Automatic QR code generation for each pet
- Public pet profile page accessible by scanning QR code
- WhatsApp integration for instant owner contact
- Pet sighting reports with location tracking
- Missing pet management and community notifications
- Multi-pet dashboard for easy management
- User authentication with email verification

**User Experience**
- No app required - works in any web browser
- Mobile-friendly QR scanning interface
- Intuitive pet registration flow
- Real-time sighting notifications
- Prevent self-reporting of own pets
- Download and print QR codes for pet tags

## Latest Changes

- Home and dashboard maps share filters (location, type, radius) and render missing pets (red/orange), sightings (green), plus user-location centering when allowed.
- Missing pet reports and status toggles now refresh feed + map immediately; reward amount and description are saved and shown in cards/popups.
- QR scanner supports `BarcodeDetector` with jsQR fallback and parses full QR URLs (not just raw IDs).
- Dashboard overview stats and pet preview populate correctly; quick actions are wired.
- Call/WhatsApp buttons use a defined `callOwner` helper to avoid broken actions.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **APIs**: QR Server for QR code generation
- **Hosting**: Static file hosting compatible (Netlify, Vercel, GitHub Pages)
- **Authentication**: Supabase Auth with email verification
- **Database**: PostgreSQL with Row Level Security (RLS)

## Getting Started

**Prerequisites:**
- Node.js/npm or Python 3 for local server
- Supabase account (free tier available)

**Quick Setup:**

1. Clone repository:
   ```bash
   git clone https://github.com/bigshabs13/pet-finder.git
   cd pet-finder
   ```

2. Configure Supabase:
   - Create a Supabase project at https://supabase.co
   - Copy your API URL and anonymous key
   - Update `CONFIG` in `app.js` with your credentials
   - Run `DATABASE_SCHEMA.sql` in Supabase SQL editor

3. Start local server:
   ```bash
   python3 -m http.server 3000
   # or: npx serve .
   ```

4. Open browser:
   - Desktop: http://localhost:3000
   - Mobile (on same network): http://192.168.10.87:3000 (replace with your IP)
   - Login or create account
   - Add your pet and generate QR code

## Project Structure

```
pet-finder/
├── index.html              # Main app UI
├── app.js                  # All app logic & functionality
├── DATABASE_SCHEMA.sql     # Supabase schema setup
├── images/                 # Pet background images
├── email-templates/        # Email confirmation templates
└── README.md
```

## Configuration

**Environment Variables** (in `app.js` CONFIG object):
```javascript
SUPABASE_URL: 'your-project-url'
SUPABASE_KEY: 'your-anon-key'
DEFAULT_LAT: 33.8547  // Default map location
DEFAULT_LNG: 35.4747
MAP_ZOOM: 13
QR_SIZE: 300
```

**Database Schema Includes:**
- Users table (Supabase Auth)
- Pets table (pet profiles with owner info)
- Missing pets table (lost pet reports)
- Pet sightings table (community reports)
- Row Level Security (RLS) policies
- Proper indexing for performance

## How It Works

**For Pet Owners:**
1. Create account and login
2. Add pet with photos, breed, color, etc.
3. Generate unique QR code
4. Download/print QR code for collar or tag
5. Manage multiple pets in dashboard
6. Receive notifications when pet is sighted

**For Pet Finders:**
1. Scan QR code on lost pet's collar
2. View pet's full profile and owner info
3. Contact owner via WhatsApp
4. Report sighting with location and time
5. Track missing pet on community map

**For Missing Pet Owners:**
1. Mark pet as missing in dashboard
2. Community receives alert
3. Get real-time sighting notifications
4. Track pet locations on map
5. Mark pet as found when reunited

## Key Features Explained

**QR Code System:**
- Each pet gets a unique QR code pointing to `http://your-ip:3000/?pet={petId}`
- Scannable from phone camera or any QR reader
- Shows instant pet profile with owner contact info

**Sighting Reports:**
- Users must be logged in to report sightings
- Cannot report sightings for their own pets
- Auto-captures reporter info and location
- Owner receives instant notifications

**Security:**
- Row Level Security (RLS) on all tables
- Users can only see/edit their own pets
- Email verification for accounts
- No passwords stored (Supabase Auth handles it)

## Deployment

**Netlify:**
```bash
netlify deploy --prod --dir .
```

**Vercel:**
```bash
vercel --prod
```

**GitHub Pages:**
Enable Pages in repository settings and push to main

**Self-hosted:**
Can be deployed to any static file host. Update IP addresses in QR code generation for your server.

## Security

- Row Level Security (RLS) on all database tables
- Supabase Auth with JWT tokens
- Email verification required
- Input validation on all forms
- HTTPS-ready for production
- No sensitive data exposed to frontend

## Troubleshooting

**QR code won't scan from phone:**
- Ensure server is running: `python3 -m http.server 3000`
- Use your local network IP instead of localhost
- Check that both devices are on same WiFi

**Supabase connection errors:**
- Verify API URL and key in app.js
- Check that DATABASE_SCHEMA.sql was executed
- Confirm RLS policies are enabled

**Login/Auth issues:**
- Clear browser cache and cookies
- Check email for verification link
- Verify Supabase auth is configured

**Notifications not working:**
- Ensure you're logged in
- Check browser console for errors
- Verify Supabase real-time is enabled

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Guidelines:**
- Keep code in vanilla JavaScript (no frameworks)
- Test across browsers and devices
- Update README if adding new features
- Keep UI responsive and accessible

## Sprint Plan (3 people)

- Frontend/UI: set the QR `baseUrl` in `app.js` to the live domain before deploy, polish map/filter UX (loading/error states), and surface pet photos in cards/feed once storage is wired.
- Backend/Infra: add the live domain to Supabase allowed origins/CORS; create a `pet-photos` storage bucket + upload path; validate reward fields and missing reports include coordinates.
- QA/Release: run end-to-end smoke on the hosted URL (add pet, mark missing, Apply filters, map pins, QR scan on Chrome/Safari), verify QR fallback, and document deploy + rollback steps.

## License

MIT License - see LICENSE file for details

## Support

- **Issues:** Report bugs on [GitHub Issues](https://github.com/bigshabs13/pet-finder/issues)
- **Discussions:** Join [GitHub Discussions](https://github.com/bigshabs13/pet-finder/discussions)
- **Docs:** Check `/docs` directory for detailed documentation

## Acknowledgments

- [Supabase](https://supabase.co) for backend infrastructure
- [QR Server](https://qrserver.com) for QR code generation
- All contributors helping keep pets safe!
