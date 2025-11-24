# Pet-Finder App - Complete Workflow Explanation

## How the App Currently Works

### 1. **User Registration & Authentication** ✅
- User signs up with email/password
- Gets a branded confirmation email
- Logs in to access dashboard

---

## 2. **Add Pet Section** ✅
When user adds a pet, they provide:
- Pet name, type, breed, gender
- Age, weight, color
- Description (distinctive marks, personality)
- Owner phone number
- Optional photo

**System generates:**
- Unique QR code linked to pet ID
- Each QR code encodes: `http://localhost:3000/?pet=[pet_id]`
- Pet data stored in database with `status: 'safe'`

---

## 3. **Missing Pet Report** ❌ NEEDS TO BE BUILT

### Current Limitation:
The app doesn't have a way to mark pets as "missing" yet.

### What We Need:
```
Users should be able to:
1. Click "Report Lost Pet" button
2. Select which pet is missing
3. Enter details:
   - Last seen location (city/area - e.g., "Beirut, Hamra")
   - Date/time lost
   - Additional description
4. Geolocation data (latitude, longitude)
5. Status changes to 'lost'

Database needs to store:
- Pet status: 'safe' or 'lost'
- Last known location: city, coordinates
- Lost date/time
- Missing description
```

---

## 4. **QR Code Scanning** ⚠️ PARTIALLY DONE

When someone finds a pet and scans the QR code:

### Current Flow:
1. Scanner opens the QR URL: `http://localhost:3000/?pet=[pet_id]`
2. System shows pet details:
   - Pet name, type, breed
   - Owner phone number
   - Contact button (opens email/SMS)

### What's Missing:
- If pet is marked as "lost", scanner should see: **"This pet is missing! Contact owner ASAP"** in red/urgent colors
- If pet is "safe", scanner should see: **"This is [Pet Name], contact owner if found"** in green/normal colors
- Scanner should also input their location (GPS) as potential sighting

---

## 5. **Missing Pets Map** ❌ NEEDS TO BE BUILT

### What We Need:
A map showing all missing pets in selected location (e.g., Beirut)

```
Features needed:
1. Map display (using Google Maps or Leaflet.js)
2. Filter options:
   - Location selector (dropdown: "Beirut", "Tripoli", etc.)
   - Pet type filter (Dog, Cat, Bird, etc.)
   - Distance radius (5km, 10km, 25km, 50km)

3. Display on map:
   - Red pins = Missing pets
   - Green pins = Recently sighted missing pets
   - Click pin to see:
     * Pet photo
     * Last seen location & time
     * Owner contact info
     * Reward (optional)

4. Users can report sighting:
   - Click "I saw this pet"
   - Enter GPS location
   - Add photo/description
   - Gets logged in database
```

---

## 6. **ChatBot** ✅ PARTIALLY DONE

Current chatbot answers questions about:
- Adding pets
- Lost pets
- QR codes
- Using scanner

---

## Complete User Journey - MISSING PET SCENARIO

### Step 1: Pet Goes Missing
```
Owner: "My cat got lost!"
→ Logs into dashboard
→ Clicks "Report Lost Pet"
→ Selects pet "Whiskers"
→ Enters: Last seen at "Beirut, Hamra, near Coffee Shop X"
→ Enters timestamp: "Today 2:30 PM"
→ Enters description: "Very shy, needs medication"
→ Submits - Status changes to 'LOST'
```

### Step 2: Someone Finds the Pet
```
Finder: "Found a cat!"
→ Scans QR code on collar
→ Sees: "🚨 THIS PET IS MISSING! 🚨"
→ Name: Whiskers
→ Owner: +961 71 123 456
→ Last seen: Beirut, Hamra
→ Description: Very shy, needs medication
→ Buttons: [Call Owner] [Send SMS] [I Found This Pet]
```

### Step 3: Report Sighting on Map
```
Finder clicks "I Found This Pet"
→ System captures GPS location (latitude, longitude)
→ Asks: "Upload photo of pet?"
→ Submits sighting
→ Owner gets notification: "Your pet was spotted in Beirut, Achrafieh!"
```

### Step 4: Check Missing Pets Map
```
Rescuers/volunteers:
→ Go to MAP section
→ Select "Beirut" from dropdown
→ See red pins for all missing pets in Beirut
→ Can filter by pet type, distance, date
→ Click on pet to see details + sightings
```

---

## Database Tables Needed

### 1. `pets` ✅ (Already planned)
```sql
id, owner_id, name, species, breed, gender, age, weight, color,
description, microchip_id, owner_phone, photo_url, qr_code_url,
status (safe/lost), created_at, updated_at
```

### 2. `missing_pets` ❌ NEEDS TO BE ADDED
```sql
id, pet_id (foreign key to pets),
lost_date, lost_time, lost_location (city),
latitude, longitude,
additional_description,
reward_amount, reward_description,
created_at, status (active/found)
```

### 3. `pet_sightings` ❌ NEEDS TO BE ADDED
```sql
id, pet_id (foreign key to pets),
reporter_name, reporter_phone, reporter_email,
sighting_location (description),
latitude, longitude,
sighting_date, sighting_time,
photo_url,
notes,
created_at
```

### 4. `locations` ❌ OPTIONAL (For faster queries)
```sql
id, city, area,
latitude, longitude,
country (Lebanon)
```

---

## Features Breakdown

### MVP (Minimum Viable Product) - What we have/need:
✅ User authentication
✅ Add pets with QR codes
✅ Scan QR codes to see pet info
❌ Report pet as missing
❌ Missing pets map
❌ Sighting reports
❌ Location filtering

### Nice to Have:
- Reward system (offer money for finding pet)
- Pet photo on QR code
- Dark mode
- Multi-language support
- Push notifications

---

## How QR Codes Work

### Current:
```
QR Code Data: "http://localhost:3000/?pet=abc123"
↓
Anyone scans it
↓
App shows: Pet info + Owner contact
```

### Should Be:
```
QR Code Data: "http://localhost:3000/?pet=abc123"
↓
Anyone scans it
↓
App checks: Is this pet marked as LOST?
↓
YES → Shows: "🚨 MISSING PET 🚨" + urgent action buttons
NO  → Shows: "Safe Pet" + normal contact info
```

---

## GPS & Location Features

### How GPS Works in the App:
1. **Browser gets user location**: Using browser's Geolocation API
   ```javascript
   navigator.geolocation.getCurrentPosition(position => {
     latitude = position.coords.latitude;
     longitude = position.coords.longitude;
   })
   ```

2. **User selects location on map** or **enters city name**

3. **Sightings are logged with coordinates**

4. **Map displays nearby missing pets**

### For Beirut:
- User opens MAP section
- Selects "Beirut" from dropdown
- Can filter by:
  - Distance (5km, 10km, 25km)
  - Pet type (Dog/Cat/Bird)
  - Days since missing (Last 24h, Last 7 days, etc.)
- Map shows all missing pets in that area

---

## Implementation Priority

### Phase 1 (Current):
- ✅ Auth & basic pet registration
- ✅ QR code generation

### Phase 2 (Next):
- ❌ Report missing pet functionality
- ❌ Missing pets table in database
- ❌ Update QR scanner to show missing status

### Phase 3:
- ❌ Map with markers
- ❌ Sighting reports
- ❌ Location filtering

### Phase 4:
- ❌ Notifications
- ❌ Rewards system
- ❌ Social sharing

---

## Technical Stack Summary

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **QR Codes**: API from qrserver.com (or library like jsQR)
- **Maps**: Leaflet.js (free, open-source) or Google Maps API
- **GPS**: Browser Geolocation API
- **Database**: PostgreSQL (via Supabase)

---

## What Needs to Happen Next

1. **Update database schema** to include:
   - `missing_pets` table (for lost pet reports)
   - `pet_sightings` table (for sightings/reports)

2. **Add missing pet reporting UI**:
   - Form to mark pet as lost
   - Location selector
   - Date/time picker

3. **Update QR scanner**:
   - Check if pet is lost
   - Show urgent status if missing
   - Allow sighting reports

4. **Build map feature**:
   - Display missing pets
   - Location filters
   - Show sightings on map

5. **Add location system**:
   - GPS/geolocation capture
   - Area-based filtering

This makes the app actually useful for finding lost pets! 🐾
