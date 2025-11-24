# JIRA Sprint 2 - Subtasks

## Copy these tasks into JIRA as subtasks under Sprint 2

---

## PERSON 1: Database Developer

### Subtask 1.1: Create Database Tables
**Summary**: Create missing_pets and pet_sightings tables in Supabase
**Description**: 
- Run DATABASE_SCHEMA.sql in Supabase SQL Editor
- Create pets table (updated with new fields)
- Create missing_pets table with all required fields
- Create pet_sightings table with all required fields
- Verify all indexes are created
**Assignee**: Person 1
**Time Estimate**: 1.5 hours
**Priority**: Highest

### Subtask 1.2: Configure Row-Level Security (RLS)
**Summary**: Set up RLS policies for all tables
**Description**:
- Create RLS policies for pets table
- Create RLS policies for missing_pets table
- Create RLS policies for pet_sightings table
- Test with 2 test accounts to verify access control
- Verify users can only see their own data
- Verify anyone can view missing pets
- Verify anyone can insert sightings
**Assignee**: Person 1
**Time Estimate**: 1.5 hours
**Priority**: Highest

### Subtask 1.3: Test Database & Documentation
**Summary**: Test all queries and document setup
**Description**:
- Create test users and test data
- Verify all queries execute correctly
- Test relationships between tables
- Document database connection info
- Document table schemas
- Document RLS policies
- Create PERSON_1_DELIVERABLES.md with all findings
**Assignee**: Person 1
**Time Estimate**: 1-1.5 hours
**Priority**: High

---

## PERSON 2: Frontend Developer

### Subtask 2.1: Style Report Missing Pet Form
**Summary**: Create professional CSS for missing pet report form
**Description**:
- Review existing form structure in index.html (lines 1869-1945)
- Add CSS for form container styling
- Style all input fields with proper focus states
- Style select dropdown
- Style buttons with hover effects
- Add alert box styling (yellow background)
- Test on mobile (375px width)
- Test on tablet (768px width)
- Test on desktop (1200px width)
**Assignee**: Person 2
**Time Estimate**: 2 hours
**Priority**: High

### Subtask 2.2: Style Map Section & Filters
**Summary**: Create CSS for map interface and filter controls
**Description**:
- Review map section in index.html (lines 1949-2003)
- Style filter controls (city, pet type, distance)
- Style map container (600px height, rounded corners)
- Style missing pets grid below map
- Add hover effects on filter cards
- Ensure responsive layout on all screen sizes
- Test mobile responsiveness
- Test tablet responsiveness
- Test desktop layout
**Assignee**: Person 2
**Time Estimate**: 2 hours
**Priority**: High

### Subtask 2.3: Style Missing Pet Cards & Popups
**Summary**: Create CSS for missing pet cards and map popups
**Description**:
- Style missing-pet-card component
- Add red border with emoji styling
- Style pet name, location, date display
- Style reward information
- Add card hover animations
- Style map popup designs
- Style contact buttons
- Add smooth transitions between states
**Assignee**: Person 2
**Time Estimate**: 1.5 hours
**Priority**: High

### Subtask 2.4: Test Responsive Design & Create Documentation
**Summary**: Verify responsive design on all devices and document
**Description**:
- Test on mobile (375px and 425px)
- Test portrait and landscape orientations
- Test on tablet (768px and 1024px)
- Test on desktop (1200px+)
- Verify all forms stack properly on mobile
- Verify map is readable on all sizes
- Check all images are responsive
- Verify all text is readable
- Document any issues found
- Create PERSON_2_DELIVERABLES.md
**Assignee**: Person 2
**Time Estimate**: 1.5 hours
**Priority**: High

---

## PERSON 3: JavaScript Developer

### Subtask 3.1: Test Report Missing Pet Logic
**Summary**: Verify report missing pet form functionality
**Description**:
- Test initReportMissing() function
- Verify pet dropdown is populated
- Test handleReportMissing() form submission
- Verify GPS permission is requested
- Verify data is inserted to missing_pets table
- Verify pet status changes to 'lost'
- Verify success message displays
- Verify form resets after submission
- Test on mobile device
- Test on desktop
**Assignee**: Person 3
**Time Estimate**: 1.5 hours
**Priority**: Highest

### Subtask 3.2: Test Map Initialization & Display
**Summary**: Verify Leaflet.js map works with missing pets
**Description**:
- Test initMap() function
- Verify map loads centered on Beirut
- Test getUserLocation() GPS capture
- Verify user location marked with green dot
- Test loadMissingPetsOnMap() function
- Verify missing pets appear as markers
- Verify marker colors are correct (red/orange based on days lost)
- Test popup functionality on marker click
- Verify popup shows correct pet details
- Test contact buttons in popups
- Test call owner functionality
- Verify no console errors
**Assignee**: Person 3
**Time Estimate**: 2 hours
**Priority**: Highest

### Subtask 3.3: Test Sighting Report System
**Summary**: Verify sighting report functionality
**Description**:
- Test reportSighting() function
- Verify reporter name prompt appears
- Verify reporter phone prompt appears
- Verify notes prompt appears
- Test GPS capture for sighting location
- Verify sighting data is inserted to database
- Verify success message displays
- Verify map updates with new sighting
- Test on mobile with GPS enabled
- Test on desktop
- Verify no console errors
**Assignee**: Person 3
**Time Estimate**: 1.5 hours
**Priority**: High

### Subtask 3.4: Test Filtering System
**Summary**: Verify location and pet type filters work
**Description**:
- Test filterMissingPets() function
- Test location filter (city dropdown)
- Verify map updates on location change
- Test pet type filter (Dog/Cat/Bird/Other)
- Verify pet type filtering applies correctly
- Test distance radius filter (5km, 10km, 25km, 50km)
- Verify multiple filters work together
- Test clearing all filters shows all pets
- Verify map updates in real-time
- Verify no console errors
**Assignee**: Person 3
**Time Estimate**: 1 hour
**Priority**: High

### Subtask 3.5: Integration Testing & Documentation
**Summary**: Complete end-to-end testing and document results
**Description**:
- Complete workflow: Add pet → Mark missing → Appears on map
- Test: Another user sees map with missing pet
- Test: User reports sighting → Appears on map
- Test: Owner marks pet as found → Disappears from map
- Verify data persists in database
- Test complete workflow on mobile
- Test complete workflow on desktop
- Verify all console errors are fixed
- Document all test results
- Document any bugs found
- Create PERSON_3_DELIVERABLES.md
**Assignee**: Person 3
**Time Estimate**: 1 hour
**Priority**: High

---

## SUMMARY FOR JIRA

**Total Subtasks**: 12
**Total Estimated Time**: 15-17 hours

**By Person**:
- Person 1: 3 subtasks (4-5 hours)
- Person 2: 4 subtasks (5-6 hours)
- Person 3: 5 subtasks (5-6 hours)

**Dependencies**:
- Subtask 1.3 depends on 1.1 and 1.2
- Subtask 3.1 depends on Subtask 1.1, 1.2, 1.3
- Subtask 3.2 depends on Subtask 1.1, 1.2, 1.3
- Subtask 3.3 depends on Subtask 1.1, 1.2, 1.3
- Subtask 3.4 depends on Subtask 1.1, 1.2, 1.3
- Subtask 3.5 depends on all Person 1 and Person 3 subtasks
- All subtasks from Person 2 can be done in parallel

---

## HOW TO ADD TO JIRA

1. Go to your Sprint 2 epic/story
2. Click "Add sub-task"
3. Copy the information from each subtask above:
   - **Summary** → Task name
   - **Description** → Description field
   - **Assignee** → Assign to person
   - **Time Estimate** → Set in time estimation field
   - **Priority** → Set priority

4. Link subtasks with dependencies:
   - Go to Subtask Details
   - Click "Link Issue"
   - Select "depends on" or "blocks" relationship

5. Mark tasks with labels: `person-1`, `person-2`, `person-3` for filtering

---

## CSV FORMAT (for bulk import if supported)

If your Jira supports CSV import, here's the format:

```
Summary,Description,Assignee,Time Estimate,Priority,Labels
"Create Database Tables","Run DATABASE_SCHEMA.sql...",Person 1,"1.5h",Highest,person-1
"Configure Row-Level Security (RLS)","Create RLS policies...",Person 1,"1.5h",Highest,person-1
"Test Database & Documentation","Create test data...",Person 1,"1-1.5h",High,person-1
"Style Report Missing Pet Form","Review form structure...",Person 2,"2h",High,person-2
"Style Map Section & Filters","Review map section...",Person 2,"2h",High,person-2
"Style Missing Pet Cards & Popups","Style pet cards...",Person 2,"1.5h",High,person-2
"Test Responsive Design & Documentation","Test on mobile/tablet...",Person 2,"1.5h",High,person-2
"Test Report Missing Pet Logic","Verify form functionality...",Person 3,"1.5h",Highest,person-3
"Test Map Initialization & Display","Verify Leaflet.js map...",Person 3,"2h",Highest,person-3
"Test Sighting Report System","Verify sighting reports...",Person 3,"1.5h",High,person-3
"Test Filtering System","Verify filters work...",Person 3,"1h",High,person-3
"Integration Testing & Documentation","Complete end-to-end test...",Person 3,"1h",High,person-3
```
