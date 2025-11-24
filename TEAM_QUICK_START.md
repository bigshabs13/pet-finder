# Sprint 2 - Quick Start Guide for Each Person

## 👤 PERSON 1: Database Developer - START HERE

### Your Mission 🎯
Set up the Supabase database with all 3 tables and security policies.

### Quick Start (5 minutes)
1. Open https://supabase.com → Your project
2. Go to **SQL Editor** → **New Query**
3. Copy entire contents of `DATABASE_SCHEMA.sql`
4. Paste and click **Run**
5. Verify all 3 tables created

### Your Tasks (4-5 hours total)

| # | Task | Time | Status |
|---|------|------|--------|
| 1 | Create 3 database tables | 1.5h | ⬜ |
| 2 | Set up RLS security | 1.5h | ⬜ |
| 3 | Test queries & document | 1-1.5h | ⬜ |

### Files You Need
- 📄 `DATABASE_SCHEMA.sql` - Copy/paste this into Supabase SQL Editor

### Files You'll Create
- 📝 `PERSON_1_DELIVERABLES.md` - Document everything

### Success Checklist
```
✓ pets table created with 15+ fields
✓ missing_pets table created
✓ pet_sightings table created
✓ All indexes created
✓ RLS policies applied
✓ Test data inserted
✓ PERSON_1_DELIVERABLES.md written
```

### Key SQL to Run
```sql
-- All in DATABASE_SCHEMA.sql
-- Just copy the ENTIRE file and run it!

-- Verify with these queries:
SELECT * FROM pets LIMIT 1;
SELECT * FROM missing_pets LIMIT 1;
SELECT * FROM pet_sightings LIMIT 1;
```

### When You're Done
→ Tell **Person 3** the database is ready
→ Share connection details
→ Create PERSON_1_DELIVERABLES.md

---

## 👤 PERSON 2: Frontend Developer - START HERE

### Your Mission 🎨
Make everything beautiful with CSS and responsive design.

### Quick Start (5 minutes)
1. Open `index.html` in VS Code
2. Look for existing CSS between `<style>` tags
3. You're adding CSS (NOT HTML - HTML is already there!)
4. Focus on these selectors:
   - `.missing-pet-container`
   - `.map-filters`
   - `.missing-pet-card`
   - `.pet-popup`

### Your Tasks (5-6 hours total)

| # | Task | Time | Status |
|---|------|------|--------|
| 1 | Style Report Missing Form | 2h | ⬜ |
| 2 | Style Map Section | 2h | ⬜ |
| 3 | Style Cards & Markers | 1.5h | ⬜ |
| 4 | Test Responsive Design | 1.5h | ⬜ |

### Files You Need
- 📄 `index.html` - Add CSS to `<style>` section (lines ~588+)

### Files You'll Create
- 📝 `PERSON_2_DELIVERABLES.md` - Document styling work

### Success Checklist
```
✓ Report form looks professional
✓ Map section styled nicely
✓ Cards have red borders & emojis
✓ Mobile responsive (375px width)
✓ Tablet responsive (768px width)
✓ Desktop beautiful (1200px+ width)
✓ No console errors
✓ PERSON_2_DELIVERABLES.md written
```

### CSS Classes to Style
```css
.missing-pet-container     /* Container for form */
.missing-form              /* The form itself */
.missing-pet-card          /* Red card with pet info */
.missing-alert             /* Yellow alert box */
.map-filters               /* Filter controls */
.map-container             /* Map wrapper */
.pet-popup                 /* Popup on map */
.contact-btn               /* Contact buttons */
```

### When You're Done
→ Test on mobile device
→ Test on desktop
→ Create PERSON_2_DELIVERABLES.md

---

## 👤 PERSON 3: JavaScript Developer - START HERE

### Your Mission ⚙️
Make the app work! All the JavaScript logic and Supabase integration.

### Quick Start (5 minutes)
1. Person 1 must finish database FIRST
2. Get database connection from Person 1
3. Open `app.js` - code is already added!
4. Test each function one by one

### Your Tasks (5-6 hours total)

| # | Task | Time | Status |
|---|------|------|--------|
| 1 | Test Report Missing Logic | 1.5h | ⬜ |
| 2 | Test Map Display | 2h | ⬜ |
| 3 | Test Sighting Reports | 1.5h | ⬜ |
| 4 | Test Filters | 1h | ⬜ |
| 5 | Integration Test | 1h | ⬜ |

### Files You Need
- 📄 `app.js` - All code already added (lines ~1244-1621)

### Files You'll Create
- 📝 `PERSON_3_DELIVERABLES.md` - Document testing & results

### Success Checklist
```
✓ initReportMissing() works
✓ handleReportMissing() inserts data
✓ initMap() loads map centered on Beirut
✓ getUserLocation() gets GPS
✓ loadMissingPetsOnMap() shows markers
✓ reportSighting() captures sighting
✓ filterMissingPets() filters work
✓ All console errors fixed
✓ Mobile testing passed
✓ Desktop testing passed
✓ PERSON_3_DELIVERABLES.md written
```

### JavaScript Functions to Test

1. **Report Missing Pet**
   ```javascript
   initReportMissing()        // Initialize form
   handleReportMissing()      // Handle submission
   loadActiveMissingPets()    // Show user's missing pets
   ```

2. **Map**
   ```javascript
   initMap()                  // Start map
   getUserLocation()          // Get user GPS
   loadMissingPetsOnMap()     // Display markers
   ```

3. **Sightings**
   ```javascript
   reportSighting()           // Report sighting
   displayMissingPetsList()   // Show pets list
   ```

4. **Filters**
   ```javascript
   filterMissingPets()        // Apply filters
   ```

### Testing Steps
```
1. Add a test pet (use existing form)
2. Mark it as missing (test form works)
3. Check map (missing pet should appear)
4. Report sighting (test GPS capture)
5. Check map again (sighting should show)
6. Mark pet as found (status should update)
7. All console errors should be ZERO
```

### When You're Done
→ Create comprehensive test report
→ Document any bugs found
→ Create PERSON_3_DELIVERABLES.md

---

## 🤝 Dependencies Between People

```
PERSON 1 (Database) 
    ↓ must finish first
    ↓ provides: connection info, table structure
PERSON 3 (Logic)
    ↓ needs person 1 done
    ↓ will test queries
    ↓ provides: working API functions
PERSON 2 (UI)
    ↓ can work in parallel with person 3
    ↓ uses: existing HTML
    ↓ provides: beautiful styling
ALL TOGETHER
    ↓ integration testing
    ↓ bug fixes
    → DONE! 🎉
```

---

## 📋 Daily Check-In Questions

### Each Morning:
1. **Person 1**: "Database ready? Any blockers?"
2. **Person 2**: "Got questions on form structure?"
3. **Person 3**: "Need database updated?"

### Each Evening:
1. **Person 1**: "What's your test results?"
2. **Person 2**: "Does CSS work on all devices?"
3. **Person 3**: "Any bugs to report?"

---

## 🚨 If You Get Stuck

### Person 1 (Database)
- Run the SQL query one piece at a time
- Check Supabase logs for errors
- Verify table created in Table Editor
- Ask: "Are all columns correct?"

### Person 2 (UI)
- Open browser DevTools (F12)
- Check Elements tab to see actual HTML
- Test in mobile view (375px)
- Ask: "Does it look professional?"

### Person 3 (Logic)
- Open browser Console (F12)
- Look for error messages
- Test functions individually
- Ask: "Does the data appear in the database?"

---

## 📚 Key Files Reference

### Person 1 Needs
```
DATABASE_SCHEMA.sql
  ↓
Supabase Dashboard
  ↓
SQL Editor
  ↓
Run = Tables created ✓
```

### Person 2 Needs
```
index.html
  ↓
<style> section
  ↓
Add CSS
  ↓
Browser refresh = See changes ✓
```

### Person 3 Needs
```
app.js
  ↓
Functions already written (test them!)
  ↓
Browser Console
  ↓
No errors = Success ✓
```

---

## ✅ Before You Hand Off Your Work

### Person 1 → Person 3
- [ ] All 3 tables created
- [ ] RLS policies working
- [ ] Can insert test data
- [ ] Share connection details

### Person 3 → Everyone
- [ ] All functions tested
- [ ] No console errors
- [ ] Data saves to database
- [ ] Ready for styling

### Person 2 → Everyone
- [ ] Mobile looks good
- [ ] Desktop looks great
- [ ] All colors consistent
- [ ] Ready to use

---

## 🎯 Success = All 3 Complete + Integrated

### What Success Looks Like:
```
1. User logs in ✓
2. User adds a pet ✓
3. User marks pet as missing ✓
4. Missing pet appears on map with red pin ✓
5. Anyone can see the map ✓
6. Anyone can report sighting ✓
7. Sighting appears on map with green pin ✓
8. Owner can mark pet as found ✓
9. No console errors ✓
10. Works on mobile AND desktop ✓
```

---

## 🚀 Ready to Start?

### Person 1: Go to Supabase NOW
- Start DATABASE setup (4-5 hours)

### Person 2: Open index.html NOW
- Start CSS styling (5-6 hours)
- Can work while Person 1 is setting up

### Person 3: Prepare NOW
- Read the JavaScript code (1 hour)
- Wait for Person 1 to finish database
- Then test all functions (5-6 hours)

---

**Let's build this! You've got this! 🐾**
