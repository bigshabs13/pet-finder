# Sprint 2 - Work Distribution for 3 People

## 📊 Overview
**Sprint 2** involves implementing missing pet tracking, GPS mapping, and sighting reports. This document splits the work into 3 manageable pieces based on specialization.

---

## 👥 Team Structure

### **Person 1: Backend & Database Developer** 🗄️
**Focus**: Supabase database setup and API integration
**Estimated Time**: 4-5 hours

### **Person 2: Frontend UI/UX Developer** 🎨
**Focus**: HTML/CSS design and UI components
**Estimated Time**: 5-6 hours

### **Person 3: JavaScript Logic & Integration Developer** ⚙️
**Focus**: JavaScript functionality and feature integration
**Estimated Time**: 5-6 hours

---

## 🔄 PERSON 1: Backend & Database Developer

### Responsibilities
- Set up all database tables
- Configure Row-Level Security (RLS)
- Test database queries
- Create documentation for API endpoints

### Tasks

#### Task 1.1: Create Database Tables
**Time**: 1.5 hours
**Deliverable**: All 3 tables in Supabase

```sql
Steps:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run DATABASE_SCHEMA.sql (complete file with all 3 tables):
   - pets (updated with new fields)
   - missing_pets (NEW)
   - pet_sightings (NEW)
4. Verify all tables created
5. Check indexes created
6. Document connection details
```

**Checklist**:
- [ ] `pets` table created with all fields
- [ ] `missing_pets` table created
- [ ] `pet_sightings` table created
- [ ] All indexes created
- [ ] RLS policies enabled
- [ ] Test: Can insert a row into each table

#### Task 1.2: Set Up Row-Level Security (RLS)
**Time**: 1.5 hours
**Deliverable**: Secure database access

```sql
Verify RLS Policies:
1. Users can see their own pets
2. Anyone can view missing_pets (active only)
3. Anyone can insert sightings
4. Users can only update their own missing pets

Test with:
- Create 2 test accounts
- Try viewing each other's pets (should fail)
- Try viewing missing_pets (should succeed)
- Try reporting sighting (should succeed)
```

**Checklist**:
- [ ] All RLS policies created
- [ ] Test data inserted
- [ ] Policy tests pass
- [ ] Document security model

#### Task 1.3: Database Testing & Documentation
**Time**: 1-1.5 hours
**Deliverable**: Test results and API docs

```
Tasks:
1. Create test users
2. Insert test pets
3. Insert test missing_pets records
4. Insert test sightings
5. Query data to verify relationships
6. Document any issues found

Create PERSON_1_DELIVERABLES.md with:
- Database connection info
- Table schemas
- RLS policies summary
- Test results
- Known issues (if any)
```

**Checklist**:
- [ ] Test data created
- [ ] All queries working
- [ ] Documentation complete
- [ ] No errors in console

### Person 1 Deliverables
- ✅ Working Supabase database
- ✅ All 3 tables with proper structure
- ✅ RLS policies configured
- ✅ Test data inserted
- ✅ Documentation (PERSON_1_DELIVERABLES.md)

---

## 🎨 PERSON 2: Frontend UI/UX Developer

### Responsibilities
- Create HTML structure for new sections
- Design CSS for all new components
- Ensure responsive design
- Create UI components library

### Tasks

#### Task 2.1: Report Missing Pet Form UI
**Time**: 2 hours
**Deliverable**: Beautiful, responsive form

**Already in HTML, but needs CSS refinement**:
```
1. Review existing form in index.html (lines 1869-1945)
2. Add CSS for:
   - Form styling (padding, borders, shadows)
   - Input fields focus states
   - Select dropdown styling
   - Button hover effects
   - Error message styling
3. Test on mobile (375px width)
4. Test on tablet (768px width)
5. Test on desktop (1200px width)

CSS needed for:
.missing-pet-container
.missing-form
.form-group (inputs, selects)
.form-actions
.missing-alert
```

**Checklist**:
- [ ] Form looks professional
- [ ] Inputs have proper focus states
- [ ] Mobile responsive (100% width)
- [ ] Tablet responsive (grid adjusts)
- [ ] Desktop beautiful (centered, proper spacing)

#### Task 2.2: Map Section UI
**Time**: 2 hours
**Deliverable**: Clean map interface with filters

**Already in HTML, needs CSS refinement**:
```
1. Review map section (lines 1949-2003)
2. Add CSS for:
   - Filter controls (nice spacing)
   - Map container (600px height, rounded)
   - Missing pets grid below map
   - Card designs for pets
   - Filter buttons styling
3. Add hover effects on cards
4. Test responsive on all sizes

CSS needed for:
.map-filters
.map-container
.map-placeholder
#petMap (Leaflet styling)
.missing-pets-grid
.missing-pet-card
```

**Checklist**:
- [ ] Filters look clean and organized
- [ ] Map container properly sized
- [ ] Pet cards well-designed
- [ ] Mobile responsive
- [ ] Desktop beautiful

#### Task 2.3: Missing Pet Cards & Markers
**Time**: 1.5 hours
**Deliverable**: Styled cards and popup designs

```
1. Style missing-pet-card component:
   - Red border with emoji
   - Pet photo area
   - Name, location, date
   - Reward display
   - Action buttons
   
2. Style popup designs:
   - Pet info popup
   - Contact buttons
   - Sighting buttons
   
3. Add animations:
   - Hover effects on cards
   - Smooth transitions
   - Button animations

CSS for:
.missing-pet-card
.pet-popup
.contact-btn
.sighting-card
```

**Checklist**:
- [ ] Cards look premium
- [ ] Colors consistent with brand
- [ ] Animations smooth
- [ ] All states styled (hover, active)

#### Task 2.4: Responsive Design Testing
**Time**: 1.5 hours
**Deliverable**: Cross-device testing report

```
Test on:
1. Mobile (375px, 425px)
   - Portrait and landscape
   - Forms should stack
   - Map should be full width
   
2. Tablet (768px, 1024px)
   - 2-column layouts where applicable
   - Map should be readable
   
3. Desktop (1200px+)
   - Side-by-side layouts
   - Proper spacing

Document any issues in PERSON_2_DELIVERABLES.md
```

**Checklist**:
- [ ] Mobile ✓
- [ ] Tablet ✓
- [ ] Desktop ✓
- [ ] All images responsive
- [ ] All text readable

### Person 2 Deliverables
- ✅ Professional CSS for all new sections
- ✅ Responsive design tested
- ✅ Component library styles
- ✅ Documentation (PERSON_2_DELIVERABLES.md)
- ✅ No console errors

---

## ⚙️ PERSON 3: JavaScript Logic & Integration Developer

### Responsibilities
- Implement all JavaScript functionality
- Integrate with Supabase
- Handle GPS and map interactions
- Test all features end-to-end

### Tasks

#### Task 3.1: Missing Pet Report Logic
**Time**: 1.5 hours
**Deliverable**: Working report form

**In app.js (already added, needs testing)**:
```
Functions to verify/test:
1. initReportMissing() - Form initialization
2. handleReportMissing() - Form submission
3. Populate pet dropdown
4. GPS capture
5. Supabase insert

Testing:
1. Form submit works
2. GPS requested and captured
3. Data inserted to missing_pets table
4. Pet status changed to 'lost'
5. Form resets after submit
6. Message shows success
```

**Checklist**:
- [ ] Form initializes correctly
- [ ] Dropdown populated with pets
- [ ] GPS permission requested
- [ ] Data inserts to database
- [ ] Pet status updates
- [ ] Success message displays
- [ ] Form works on mobile

#### Task 3.2: Map Initialization & Display
**Time**: 2 hours
**Deliverable**: Working Leaflet.js map with markers

**In app.js (already added, needs testing)**:
```
Functions to verify/test:
1. initMap() - Map initialization
2. getUserLocation() - Get user GPS
3. loadMissingPetsOnMap() - Load missing pets
4. Display markers with proper colors
5. Popup content shows correctly

Testing:
1. Map loads centered on Beirut
2. User location marked (green dot)
3. Missing pets appear as markers
4. Colors correct (red/orange based on days)
5. Popups show on marker click
6. Popups show pet details
7. Contact buttons work in popups
```

**Checklist**:
- [ ] Map initializes
- [ ] Leaflet.js working
- [ ] Markers display
- [ ] User location captured
- [ ] Popups functional
- [ ] Contact buttons work
- [ ] No console errors

#### Task 3.3: Sighting Report System
**Time**: 1.5 hours
**Deliverable**: Working sighting reports

**In app.js (already added, needs testing)**:
```
Functions to verify/test:
1. reportSighting() - Capture sighting data
2. GPS location capture for sighting
3. Insert to pet_sightings table
4. Show success message
5. Update map with new sighting

Testing:
1. Click "Report Sighting" works
2. Prompts for name, phone, notes
3. GPS permission requested
4. Data inserted correctly
5. Confirmation message shows
6. Map updates with new sighting
```

**Checklist**:
- [ ] Prompts appear
- [ ] GPS captured
- [ ] Data validates
- [ ] Insert successful
- [ ] Message displays
- [ ] Map updates
- [ ] Works on mobile

#### Task 3.4: Filtering & Map Updates
**Time**: 1 hour
**Deliverable**: Working filters

**In app.js (already added, needs testing)**:
```
Functions to verify/test:
1. filterMissingPets() - Filter function
2. Location filter (city dropdown)
3. Pet type filter
4. Distance filter (km radius)
5. Real-time map update

Testing:
1. Select location → map updates
2. Select pet type → filters apply
3. Select distance → correct radius
4. Multiple filters together work
5. Clearing filters shows all pets
```

**Checklist**:
- [ ] Location filter works
- [ ] Pet type filter works
- [ ] Distance filter works
- [ ] Filters combine correctly
- [ ] Map updates on filter change
- [ ] No console errors

#### Task 3.5: Integration Testing
**Time**: 1 hour
**Deliverable**: End-to-end test report

```
Complete workflow test:
1. User adds a pet ✓
2. User marks pet as missing ✓
3. Pet appears on map ✓
4. Another user sees map ✓
5. User reports sighting ✓
6. Sighting appears on map ✓
7. Owner marks pet as found ✓
8. Pet disappears from map ✓

Document results in PERSON_3_DELIVERABLES.md
```

**Checklist**:
- [ ] All workflows tested
- [ ] No errors in console
- [ ] Data persists in database
- [ ] Mobile works
- [ ] Desktop works
- [ ] All notifications display

### Person 3 Deliverables
- ✅ All JavaScript functions working
- ✅ Supabase integration verified
- ✅ GPS functionality tested
- ✅ Map interactions working
- ✅ Documentation (PERSON_3_DELIVERABLES.md)
- ✅ Integration test report

---

## 📅 Timeline & Milestones

### Day 1 - Setup & Database
- **Person 1**: Complete database setup (4-5 hours)
- **Person 2**: Start CSS framework (2-3 hours)
- **Person 3**: Prepare JavaScript structure (1 hour)

### Day 2 - Frontend & Logic
- **Person 1**: Final testing & documentation (1 hour)
- **Person 2**: Complete all CSS & responsive (4-5 hours)
- **Person 3**: Implement JavaScript logic (5-6 hours)

### Day 3 - Integration & Testing
- **All**: Integration testing
- **All**: Bug fixes
- **All**: Final documentation

---

## 🚀 Daily Standup

### Questions to Ask Each Other:
1. What did you complete?
2. What are you working on next?
3. Do you need anything from others?
4. Any blockers?

### Communication
- Share progress in messages
- Person 1 → Person 3: Database ready (then Person 3 can test)
- Person 2 → Person 1: CSS done (Person 1 can verify styling)
- Person 3 → All: Integration test results

---

## 🐛 Testing Checklist (All Persons)

### Before Merging Code:
- [ ] No console errors
- [ ] All features work on mobile
- [ ] All features work on desktop
- [ ] Database queries execute
- [ ] Forms validate input
- [ ] Messages display correctly
- [ ] Map markers appear
- [ ] GPS works (allow permission)
- [ ] Sightings save to database
- [ ] Filters work correctly

---

## 📦 Deliverables per Person

### Person 1 Deliverables:
```
📁 PERSON_1_DELIVERABLES.md
├── Database setup completion report
├── Table schemas
├── RLS policies documentation
├── Test results
└── Connection details for team
```

### Person 2 Deliverables:
```
📁 PERSON_2_DELIVERABLES.md
├── CSS implementation summary
├── Responsive design test results
├── Component styling documentation
├── Mobile/Tablet/Desktop screenshots
└── Known CSS issues (if any)
```

### Person 3 Deliverables:
```
📁 PERSON_3_DELIVERABLES.md
├── JavaScript implementation summary
├── Feature testing results
├── Integration test report
├── GPS functionality verification
├── Known JavaScript issues (if any)
└── Performance notes
```

---

## ✅ Definition of Done

### For Each Person:
- [ ] Code is written and tested
- [ ] No console errors
- [ ] Deliverables document completed
- [ ] Code is committed to git
- [ ] Team reviewed the work
- [ ] No blockers for next person

### For Sprint 2:
- [ ] All database tables working
- [ ] All CSS responsive and styled
- [ ] All JavaScript functions working
- [ ] All features integrated and tested
- [ ] App works on mobile & desktop
- [ ] Documentation complete
- [ ] Ready to deploy

---

## 🎯 Success Criteria

### Sprint 2 Complete When:
1. ✅ Users can report missing pets
2. ✅ Missing pets appear on map
3. ✅ Users can report sightings
4. ✅ GPS tracking works
5. ✅ Filters work correctly
6. ✅ UI responsive on all devices
7. ✅ Database secure with RLS
8. ✅ No console errors
9. ✅ All 3 people documented work
10. ✅ Full integration test passes

---

## 💡 Pro Tips for Team

1. **Person 1 (Database)**: Start ASAP - others depend on you
2. **Person 2 (UI)**: Can work in parallel, use existing HTML structure
3. **Person 3 (Logic)**: Wait for Person 1's database, then implement

### Dependencies:
```
Person 1 (Database) ✓
    ↓ (provides connection info)
Person 3 (Logic) → tests queries
    ↓ (provides data structure)
Person 2 (UI) → structures forms correctly
    ↓
All → Integration Testing
```

---

## 🔗 File Structure After Sprint 2

```
/home/serah/pet-finder/
├── index.html (updated with new sections)
├── app.js (updated with all functions)
├── DATABASE_SCHEMA.sql (all 3 tables)
├── PERSON_1_DELIVERABLES.md
├── PERSON_2_DELIVERABLES.md
├── PERSON_3_DELIVERABLES.md
├── SPRINT_2_DISTRIBUTION.md (this file)
└── FEATURES_IMPLEMENTED.md
```

---

Good luck! This is a complete, production-ready application after Sprint 2! 🚀
