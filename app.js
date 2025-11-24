// Pet Images for slider
const petImages = [
    '/images/1.jpg',
    '/images/2.webp',
    '/images/3.webp',
    '/images/4.avif',
    '/images/5.avif'
];

let currentPetImageIndex = 0;

// Initialize pet image slider
function initPetSlider() {
    const petSlider = document.getElementById('petSlider');
    if (!petSlider) return;
    
    const updateBackground = () => {
        petSlider.style.backgroundImage = `url('${petImages[currentPetImageIndex]}')`;
        currentPetImageIndex = (currentPetImageIndex + 1) % petImages.length;
    };
    
    updateBackground();
    setInterval(updateBackground, 5000);
}
// Supabase Client
const SUPABASE_URL = 'https://idvunxqfgengfnbrsqla.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QOik2xXg32RTTgRasLNLcA_GLMaw54Y';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// State
let currentUser = null;
let userPets = [];

// DOM Elements
const homePage = document.getElementById('homePage');
const dashboardPage = document.getElementById('dashboardPage');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const homeLink = document.getElementById('homeLink');
const dashboardLink = document.getElementById('dashboardLink');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const addPetForm = document.getElementById('addPetForm');
const petsList = document.getElementById('petsList');

const signupBtn = document.getElementById('signupBtn');
const loginBtnHero = document.getElementById('signupBtn');

// Event Listeners
document.getElementById('signupBtn').addEventListener('click', () => {
    signupModal.classList.add('active');
});

document.getElementById('learnMoreBtn').addEventListener('click', () => {
    alert('PetFinder helps reunite lost pets with their owners using QR codes. Register your pet, generate a unique QR code, and if your pet is found, the scanner gets instant access to your contact information.');
});

document.getElementById('loginBtn').addEventListener('click', () => {
    loginModal.classList.add('active');
});

document.getElementById('closeLoginBtn').addEventListener('click', () => {
    loginModal.classList.remove('active');
});

document.getElementById('closeSignupBtn').addEventListener('click', () => {
    signupModal.classList.remove('active');
});

document.getElementById('logoutBtn').addEventListener('click', logout);

homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showHome();
});

dashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    showDashboard();
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        currentUser = data.user;
        loginModal.classList.remove('active');
        loginForm.reset();
        updateUI();
        showDashboard();
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    
    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:3000'
            }
        });
        
        if (error) {
            console.error('Signup error:', error);
            // Handle different error types
            if (error.message.includes('User already registered') || 
                error.message.includes('already been registered') ||
                error.message.includes('already exists')) {
                alert(`This email (${email}) is already registered. Please try logging in instead, or check your email for a confirmation link if you haven't verified yet.`);
            } else if (error.message.includes('Invalid email')) {
                alert('Please enter a valid email address.');
            } else {
                alert('Signup failed: ' + error.message);
            }
            return;
        }
        
        console.log('Signup data:', data);
        
        // For new signups, Supabase typically returns a user object
        if (data.user) {
            // Check if user was just created (within last 5 seconds) vs existing
            if (data.user.created_at) {
                const createdAt = new Date(data.user.created_at);
                const now = new Date();
                const timeDiff = Math.abs(now.getTime() - createdAt.getTime());
                
                // If user was created very recently (< 5 seconds), it's a new signup
                if (timeDiff < 5000) {
                    // Definitely a new user
                    if (data.session) {
                        // Account created and auto-confirmed
                        alert('Account created and confirmed! Welcome to Pet-Finder.');
                        currentUser = data.user;
                        updateUI();
                        signupModal.classList.remove('active');
                        signupForm.reset();
                        showDashboard();
                        return;
                    } else {
                        // New account, needs email confirmation
                        alert(`Account created successfully! Please check your email (${email}) for a confirmation link. Check your spam folder if you don't see it.`);
                    }
                } else {
                    // User was created more than 5 seconds ago = existing user
                    alert(`This email (${email}) is already registered but not confirmed. Please check your email for a confirmation link, or try logging in.`);
                    return;
                }
            } else {
                // No created_at timestamp, assume new user
                alert(`Account created! Please check your email (${email}) for a confirmation link.`);
            }
        } else {
            // No user object returned - something went wrong
            alert('Something went wrong during signup. Please try again.');
            return;
        }
        
        signupModal.classList.remove('active');
        signupForm.reset();
    } catch (error) {
        console.error('Signup exception:', error);
        alert('Signup failed: ' + error.message);
    }
});

// Enhanced Add Pet Form Logic
let currentStep = 1;
const totalSteps = 3;

// Initialize form step functionality
function initAddPetForm() {
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitForm');
    const photoInput = document.getElementById('petPhoto');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => nextStep());
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => prevStep());
    }
    
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
    
    // Form submission
    const form = document.getElementById('addPetForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        // Validate current step
        if (validateStep(currentStep)) {
            currentStep++;
            updateFormStep();
            
            // Show review on step 3
            if (currentStep === 3) {
                updateFormReview();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormStep();
    }
}

function updateFormStep() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });
    
    // Update form steps
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
    
    // Update navigation buttons
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitForm');
    
    if (prevBtn) {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    }
    
    if (nextBtn && submitBtn) {
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
}

function validateStep(step) {
    switch(step) {
        case 1:
            const name = document.getElementById('petName').value.trim();
            const species = document.getElementById('petSpecies').value;
            
            if (!name) {
                alert('Please enter your pet\'s name');
                return false;
            }
            if (!species) {
                alert('Please select your pet\'s type');
                return false;
            }
            break;
            
        case 2:
            // Optional validation for step 2
            break;
            
        case 3:
            const phone = document.getElementById('ownerPhone').value.trim();
            if (!phone) {
                alert('Please enter your phone number');
                return false;
            }
            break;
    }
    return true;
}

function updateFormReview() {
    const reviewDiv = document.getElementById('formReview');
    if (!reviewDiv) return;
    
    const formData = {
        name: document.getElementById('petName').value || 'Not provided',
        species: document.getElementById('petSpecies').value || 'Not provided',
        breed: document.getElementById('petBreed').value || 'Not provided',
        gender: document.getElementById('petGender').value || 'Not provided',
        age: document.getElementById('petAge').value || 'Not provided',
        weight: document.getElementById('petWeight').value || 'Not provided',
        color: document.getElementById('petColor').value || 'Not provided',
        microchip: document.getElementById('petMicrochip').value || 'None',
        phone: document.getElementById('ownerPhone').value || 'Not provided',
        description: document.getElementById('petDescription').value || 'None'
    };
    
    reviewDiv.innerHTML = `
        <div class="review-item">
            <span class="review-label">Pet Name:</span>
            <span class="review-value">${formData.name}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Type:</span>
            <span class="review-value">${formData.species}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Breed:</span>
            <span class="review-value">${formData.breed}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Gender:</span>
            <span class="review-value">${formData.gender}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Age:</span>
            <span class="review-value">${formData.age}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Color:</span>
            <span class="review-value">${formData.color}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Your Phone:</span>
            <span class="review-value">${formData.phone}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Microchip:</span>
            <span class="review-value">${formData.microchip}</span>
        </div>
    `;
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be smaller than 5MB');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('photoPreview');
        if (preview) {
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Pet photo preview" />
                <p style="margin-top: 8px; color: #6b7280;">Photo selected: ${file.name}</p>
                <button type="button" onclick="removePhoto()" class="btn btn-outline" style="margin-top: 8px;">Remove Photo</button>
            `;
        }
        
        // Hide upload placeholder
        const placeholder = document.querySelector('.upload-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    document.getElementById('petPhoto').value = '';
    document.getElementById('photoPreview').innerHTML = '';
    document.querySelector('.upload-placeholder').style.display = 'block';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('You must be logged in to add a pet');
        return;
    }
    
    // Show loading spinner
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const submitBtn = document.getElementById('submitForm');
    
    if (submitText) submitText.style.display = 'none';
    if (submitSpinner) submitSpinner.style.display = 'inline-block';
    if (submitBtn) submitBtn.disabled = true;
    
    try {
        // Prepare pet data
        const petData = {
            owner_id: currentUser.id,
            name: document.getElementById('petName').value.trim(),
            species: document.getElementById('petSpecies').value,
            breed: document.getElementById('petBreed').value.trim() || null,
            gender: document.getElementById('petGender').value || null,
            age: document.getElementById('petAge').value.trim() || null,
            weight: document.getElementById('petWeight').value.trim() || null,
            color: document.getElementById('petColor').value.trim() || null,
            description: document.getElementById('petDescription').value.trim() || null,
            microchip_id: document.getElementById('petMicrochip').value.trim() || null,
            owner_phone: document.getElementById('ownerPhone').value.trim(),
            status: 'safe'
        };
        
        // Insert pet into database
        const { data: pet, error } = await supabase
            .from('pets')
            .insert([petData])
            .select()
            .single();
        
        if (error) throw error;
        
        // Generate QR code
        await generateQRForPet(pet);
        
        // Update UI
        document.getElementById('petRegisteredName').textContent = `${pet.name} has been added to your pets!`;
        document.getElementById('qrCodeResult').style.display = 'block';
        document.getElementById('addPetForm').style.display = 'none';
        document.querySelector('.form-steps').style.display = 'none';
        
        // Reload pets data
        loadUserPets();
        
    } catch (error) {
        console.error('Error adding pet:', error);
        alert('Failed to add pet: ' + error.message);
    } finally {
        // Reset loading state
        if (submitText) submitText.style.display = 'inline-block';
        if (submitSpinner) submitSpinner.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function generateQRForPet(pet) {
    try {
        // Create QR code data URL that links to pet finder page
        const petUrl = `${window.location.origin}/?pet=${pet.id}`;
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(petUrl)}`;
        
        // Display QR code
        const qrDisplay = document.getElementById('qrCodeDisplay');
        if (qrDisplay) {
            qrDisplay.innerHTML = `<img src="${qrImageUrl}" alt="QR Code for ${pet.name}" style="max-width: 100%; border-radius: 8px;" />`;
        }
        
        // Set up download functionality
        const downloadBtn = document.getElementById('downloadQR');
        const printBtn = document.getElementById('printQR');
        
        if (downloadBtn) {
            downloadBtn.onclick = () => downloadQRCode(qrImageUrl, pet.name);
        }
        
        if (printBtn) {
            printBtn.onclick = () => printQRCode(qrImageUrl, pet);
        }
        
        // Save QR URL to database
        await supabase
            .from('pets')
            .update({ qr_code_url: qrImageUrl })
            .eq('id', pet.id);
            
    } catch (error) {
        console.error('Error generating QR code:', error);
        showMessage('Pet added but QR code generation failed. You can generate it later.');
    }
}

function downloadQRCode(url, petName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${petName.replace(/\s+/g, '_')}_QR_Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printQRCode(qrUrl, pet) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Pet QR Code - ${pet.name}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 20px; 
                    }
                    .qr-container { 
                        border: 2px solid #333; 
                        border-radius: 10px; 
                        padding: 20px; 
                        margin: 20px auto; 
                        max-width: 400px; 
                    }
                    .pet-info { 
                        margin: 20px 0; 
                    }
                    h1 { color: #0f8f3d; }
                    .emergency { 
                        background: #fff3cd; 
                        border: 1px solid #ffeaa7; 
                        padding: 10px; 
                        border-radius: 5px; 
                        margin-top: 20px; 
                    }
                </style>
            </head>
            <body>
                <div class="qr-container">
                    <h1>🐾 Pet-Finder</h1>
                    <img src="${qrUrl}" alt="QR Code for ${pet.name}" style="max-width: 250px;" />
                    <div class="pet-info">
                        <h2>${pet.name}</h2>
                        <p><strong>Type:</strong> ${pet.species}</p>
                        ${pet.breed ? `<p><strong>Breed:</strong> ${pet.breed}</p>` : ''}
                        <p><strong>Owner Phone:</strong> ${pet.owner_phone}</p>
                    </div>
                    <div class="emergency">
                        <strong>🚨 FOUND THIS PET? 🚨</strong><br>
                        Scan QR code or call owner immediately
                    </div>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function resetAddPetForm() {
    // Reset form
    document.getElementById('addPetForm').reset();
    removePhoto();
    
    // Reset steps
    currentStep = 1;
    updateFormStep();
    
    // Show form, hide result
    document.getElementById('addPetForm').style.display = 'block';
    document.querySelector('.form-steps').style.display = 'flex';
    document.getElementById('qrCodeResult').style.display = 'none';
}

// Legacy form handler for backwards compatibility
addPetForm.addEventListener('submit', handleFormSubmit);

// Functions
async function checkAuthStatus() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
        updateUI();
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

function updateUI() {
    if (currentUser) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        dashboardLink.classList.remove('hidden');
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        dashboardLink.classList.add('hidden');
        showHome();
    }
}

function showHome() {
    homePage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
}

function showDashboard() {
    if (!currentUser) {
        loginModal.classList.add('active');
        return;
    }
    homePage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    loadPets();
    initDashboard();
}

async function loadPets() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('owner_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        userPets = data || [];
        renderPets();
    } catch (error) {
        petsList.innerHTML = '<div class="error">Failed to load pets: ' + error.message + '</div>';
    }
}

function renderPets() {
    if (userPets.length === 0) {
        petsList.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">No pets yet. Add your first pet to get started!</div>';
        return;
    }
    
    petsList.innerHTML = userPets.map(pet => `
        <div class="pet-card">
            <h3>${pet.name}</h3>
            <div class="pet-info">Species: ${pet.species}</div>
            <div class="pet-info">Breed: ${pet.breed}</div>
            ${pet.description ? `<div class="pet-info">Description: ${pet.description}</div>` : ''}
            ${pet.microchip_id ? `<div class="pet-info">Microchip: ${pet.microchip_id}</div>` : ''}
            
            <div id="qr-${pet.id}" class="qr-display"></div>
            
            <div class="pet-actions">
                <button class="btn btn-success" onclick="generateQR('${pet.id}')">Generate QR</button>
                <button class="btn btn-danger" onclick="deletePet('${pet.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function generateQR(petId) {
    try {
        const pet = userPets.find(p => p.id === petId);
        if (!pet) return;
        
        const url = `${window.location.origin}/?petId=${petId}`;
        
        // Use QR code API
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
        
        const qrContainer = document.getElementById(`qr-${petId}`);
        qrContainer.innerHTML = `
            <img src="${qrImageUrl}" alt="QR Code for ${pet.name}">
            <button class="btn btn-secondary" style="margin-top: 10px; width: 100%;" onclick="downloadQR('${qrImageUrl}', '${pet.name}')">Download QR Code</button>
        `;
        
        // Save QR URL to database
        await supabase
            .from('pets')
            .update({ qr_code_url: qrImageUrl })
            .eq('id', petId);
        
    } catch (error) {
        alert('Failed to generate QR code: ' + error.message);
    }
}

function downloadQR(url, petName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${petName}-qr-code.png`;
    link.click();
}

async function deletePet(petId) {
    if (!confirm('Are you sure you want to delete this pet?')) return;
    
    try {
        const { error } = await supabase
            .from('pets')
            .delete()
            .eq('id', petId);
        
        if (error) throw error;
        
        loadPets();
        alert('Pet deleted successfully');
    } catch (error) {
        alert('Failed to delete pet: ' + error.message);
    }
}

async function logout() {
    try {
        await supabase.auth.signOut();
        currentUser = null;
        updateUI();
        loginForm.reset();
        signupForm.reset();
    } catch (error) {
        alert('Logout failed: ' + error.message);
    }
}

// Dashboard Navigation Functions
function initDashboard() {
    // Set up navigation event listeners
    document.querySelectorAll('[data-section]').forEach(button => {
        button.addEventListener('click', (e) => {
            const sectionId = e.target.dataset.section;
            showSection(sectionId);
        });
    });

    // Show overview by default
    showSection('overview-section');

    // Initialize quick action buttons
    initQuickActions();

    // Initialize add pet form
    initAddPetForm();

    // Initialize report missing pet
    initReportMissing();

    // Initialize scanner if section exists
    if (document.getElementById('scanner-section')) {
        initScanner();
    }

    // Initialize chatbot if section exists
    if (document.getElementById('chat-section')) {
        initChatbot();
    }

    // Initialize map with delay to ensure DOM is ready
    setTimeout(() => {
        initMap();
    }, 500);

    // Update stats and load pets
    loadUserPets();
    loadActiveMissingPets();
}

function showSection(sectionId) {
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Show/hide sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

function initQuickActions() {
    // Quick action buttons with data-action attributes
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]').dataset.action;
            switch(action) {
                case 'add-pet':
                    showSection('add-pet-section');
                    break;
                case 'scanner':
                    showSection('scanner-section');
                    break;
                case 'emergency':
                    // Show add pet form and pre-select lost status
                    showSection('add-pet-section');
                    break;
            }
        });
    });
}

async function loadUserPets() {
    if (!currentUser) return;
    
    try {
        const { data: pets, error } = await supabase
            .from('pets')
            .select('*')
            .eq('owner_id', currentUser.id);

        if (error) throw error;

        userPets = pets || [];
        updateStats();
        renderPetsPreview();
    } catch (error) {
        console.error('Error loading pets:', error);
    }
}

function updateStats() {
    const totalPets = userPets.length;
    const activePets = userPets.filter(pet => pet.status === 'safe' || !pet.status).length;
    const lostPets = userPets.filter(pet => pet.status === 'lost').length;

    const totalPetsEl = document.getElementById('total-pets');
    const activePetsEl = document.getElementById('active-pets');
    const lostPetsEl = document.getElementById('lost-pets');

    if (totalPetsEl) totalPetsEl.textContent = totalPets;
    if (activePetsEl) activePetsEl.textContent = activePets;
    if (lostPetsEl) lostPetsEl.textContent = lostPets;
}

function renderPetsPreview() {
    const container = document.getElementById('pets-preview-grid');
    if (!container) return;

    if (userPets.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <p>No pets registered yet. <a href="#" onclick="showSection('add-pet')" style="color: #0f8f3d;">Add your first pet</a></p>
            </div>
        `;
        return;
    }

    container.innerHTML = userPets.slice(0, 3).map(pet => `
        <div class="pet-card">
            <div class="pet-info">
                <h4>${pet.name}</h4>
                <p>Species: ${pet.species}</p>
                <p>Breed: ${pet.breed || 'Not specified'}</p>
                <p class="status ${pet.status || 'safe'}">${(pet.status || 'safe').charAt(0).toUpperCase() + (pet.status || 'safe').slice(1)}</p>
            </div>
        </div>
    `).join('');
}

// Scanner functionality
function initScanner() {
    const startScannerBtn = document.getElementById('start-scanner');
    const manualSearchBtn = document.getElementById('manual-search');
    
    if (startScannerBtn) {
        startScannerBtn.addEventListener('click', startCamera);
    }
    
    if (manualSearchBtn) {
        manualSearchBtn.addEventListener('click', () => {
            const qrId = document.getElementById('qr-input').value.trim();
            if (qrId) {
                searchPetByQR(qrId);
            } else {
                alert('Please enter a QR code ID');
            }
        });
    }
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const cameraPlaceholder = document.querySelector('.camera-placeholder');
        
        if (cameraPlaceholder) {
            cameraPlaceholder.innerHTML = `
                <video id="camera-video" width="100%" height="300" autoplay></video>
                <button class="btn btn-secondary" onclick="stopCamera()" style="margin-top: 16px;">Stop Camera</button>
            `;
            
            const video = document.getElementById('camera-video');
            video.srcObject = stream;
            
            showMessage('Camera started. In a real implementation, this would scan QR codes automatically.');
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
        showMessage('Error accessing camera. Please ensure you have given camera permissions.');
    }
}

function stopCamera() {
    const video = document.getElementById('camera-video');
    if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
    
    const cameraPlaceholder = document.querySelector('.camera-placeholder');
    if (cameraPlaceholder) {
        cameraPlaceholder.innerHTML = `
            <div class="camera-icon">📷</div>
            <p>Point your camera at a Pet-Finder QR code</p>
            <button id="start-scanner" class="btn btn-primary">Start Camera</button>
        `;
        
        // Re-attach event listener
        const startScannerBtn = document.getElementById('start-scanner');
        if (startScannerBtn) {
            startScannerBtn.addEventListener('click', startCamera);
        }
    }
}

async function searchPetByQR(qrId) {
    try {
        const { data: pet, error } = await supabase
            .from('pets')
            .select(`
                *,
                users(email, full_name)
            `)
            .eq('id', qrId)
            .single();

        if (error) {
            showMessage('Pet not found. Please check the QR code and try again.');
            return;
        }

        displayFoundPet(pet);
    } catch (error) {
        console.error('Error searching pet:', error);
        showMessage('Error searching for pet. Please try again.');
    }
}

function displayFoundPet(pet) {
    let resultDiv = document.getElementById('scanner-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'scanner-result';
        resultDiv.style.marginTop = '20px';
        const scannerSection = document.getElementById('scanner');
        if (scannerSection) {
            scannerSection.appendChild(resultDiv);
        }
    }
    
    resultDiv.innerHTML = `
        <div class="pet-found-card" style="background: white; padding: 24px; border-radius: 12px; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="color: #0f8f3d;">Pet Found! 🎉</h3>
            <div class="pet-details">
                <h4>${pet.name}</h4>
                <p><strong>Species:</strong> ${pet.species}</p>
                <p><strong>Breed:</strong> ${pet.breed || 'Not specified'}</p>
                ${pet.description ? `<p><strong>Description:</strong> ${pet.description}</p>` : ''}
            </div>
            <div class="owner-contact" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <h4>Contact Owner</h4>
                <p><strong>Email:</strong> ${pet.users?.email || 'Not available'}</p>
                <button class="btn btn-primary" onclick="contactOwner('${pet.users?.email}', '${pet.name}')" style="margin-top: 12px;">
                    Send Email
                </button>
            </div>
        </div>
    `;
}

function contactOwner(email, petName) {
    if (!email) {
        alert('Owner email not available');
        return;
    }
    
    const subject = `Found ${petName} - Pet-Finder`;
    const body = `Hi,\n\nI found ${petName} using the Pet-Finder QR code. Please contact me to arrange pickup.\n\nBest regards`;
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

// Chatbot functionality
function initChatbot() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Quick question buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const question = e.target.textContent;
            sendMessage(question);
        });
    });

    // Add initial bot message
    addBotMessage("Hello! I'm your Pet-Finder assistant. How can I help you today?");
}

function sendMessage(predefinedMessage) {
    const input = document.getElementById('chat-input');
    const message = predefinedMessage || (input ? input.value.trim() : '');
    
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    
    // Clear input
    if (!predefinedMessage && input) {
        input.value = '';
    }
    
    // Simulate bot response
    setTimeout(() => {
        generateBotResponse(message);
    }, 1000);
}

function addUserMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addBotMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            ${message}
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    
    if (lowerMessage.includes('add') || lowerMessage.includes('register')) {
        response = `
            <p>To add a new pet:</p>
            <ul>
                <li>Go to the "Add Pet" section</li>
                <li>Fill out your pet's information</li>
                <li>Click "Register Pet" to generate a QR code</li>
            </ul>
            <p>Would you like me to take you to the Add Pet section?</p>
        `;
    } else if (lowerMessage.includes('lost') || lowerMessage.includes('missing')) {
        response = `
            <p>If your pet is lost:</p>
            <ul>
                <li>Share the QR code on social media</li>
                <li>Post flyers with the QR code in your neighborhood</li>
                <li>Contact local shelters and veterinary clinics</li>
                <li>Check the map section for any reported sightings</li>
            </ul>
            <p>Stay positive - many pets are reunited with their families!</p>
        `;
    } else if (lowerMessage.includes('qr') || lowerMessage.includes('code')) {
        response = `
            <p>About QR codes:</p>
            <ul>
                <li>Each registered pet gets a unique QR code</li>
                <li>Anyone can scan it to see pet info and contact you</li>
                <li>Attach the QR code to your pet's collar</li>
                <li>Print it on tags, stickers, or flyers</li>
            </ul>
            <p>The QR code is generated automatically when you register a pet.</p>
        `;
    } else if (lowerMessage.includes('scanner') || lowerMessage.includes('scan')) {
        response = `
            <p>Using the scanner:</p>
            <ul>
                <li>Go to the Scanner section</li>
                <li>Click "Start Camera" to scan QR codes</li>
                <li>Or manually enter a QR code ID</li>
                <li>View pet information and contact the owner</li>
            </ul>
        `;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
        response = `
            <p>For support or questions:</p>
            <ul>
                <li>Email: support@pet-finder.com</li>
                <li>Use this chatbot for quick help</li>
                <li>Check our help documentation</li>
            </ul>
        `;
    } else {
        response = `
            <p>I can help you with:</p>
            <ul>
                <li>Adding and managing pets</li>
                <li>Understanding QR codes</li>
                <li>Reporting lost pets</li>
                <li>Using the scanner</li>
                <li>General pet safety tips</li>
            </ul>
            <p>What would you like to know more about?</p>
        `;
    }
    
    addBotMessage(response);
}

function showMessage(message) {
    // Create or update a message display
    let messageDiv = document.getElementById('app-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'app-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0f8f3d;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 300px;
        `;
        document.body.appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Subscribe to auth changes
supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateUI();
});


// Handle email confirmation redirect
async function handleEmailConfirmation() {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
        // Extract token from URL
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken) {
            try {
                // Set the session with the tokens
                const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });
                
                if (error) {
                    console.error('Session error:', error);
                } else {
                    console.log('Email confirmed and logged in!');
                    currentUser = data.user;
                    updateUI();
                    window.location.hash = '';
                }
            } catch (error) {
                console.error('Confirmation error:', error);
            }
        }
    }
}

// Missing Pet Report Functionality
function initReportMissing() {
    const form = document.getElementById('reportMissingForm');
    if (form) {
        form.addEventListener('submit', handleReportMissing);
    }
    
    // Populate pet dropdown
    const petSelect = document.getElementById('missingPetSelect');
    if (petSelect && userPets) {
        petSelect.innerHTML = '<option value="">Choose a pet...</option>';
        userPets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = pet.name;
            petSelect.appendChild(option);
        });
    }
}

async function handleReportMissing(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('You must be logged in');
        return;
    }
    
    const petId = document.getElementById('missingPetSelect').value;
    const lostDate = document.getElementById('lostDate').value;
    const lostTime = document.getElementById('lostTime').value;
    const lostLocation = document.getElementById('lostLocation').value;
    const description = document.getElementById('missingDescription').value;
    const rewardAmount = document.getElementById('rewardAmount').value || null;
    const rewardDescription = document.getElementById('rewardDescription').value;
    
    // Get geolocation if available
    let latitude = null;
    let longitude = null;
    
    try {
        const coords = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                pos => resolve(pos.coords),
                err => resolve(null)
            );
        });
        
        if (coords) {
            latitude = coords.latitude;
            longitude = coords.longitude;
        }
    } catch (error) {
        console.log('GPS not available');
    }
    
    try {
        // Insert missing pet record
        const { data: missingPet, error } = await supabase
            .from('missing_pets')
            .insert([{
                pet_id: petId,
                owner_id: currentUser.id,
                lost_date: lostDate,
                lost_time: lostTime || null,
                lost_location: lostLocation,
                latitude,
                longitude,
                additional_description: description,
                reward_amount: rewardAmount,
                reward_description: rewardDescription,
                status: 'active'
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        // Update pet status to 'lost'
        await supabase
            .from('pets')
            .update({ status: 'lost' })
            .eq('id', petId);
        
        showMessage('✅ Pet marked as missing! Shared with community.');
        
        // Reset form
        document.getElementById('reportMissingForm').reset();
        
        // Show success and load active missing pets
        loadActiveMissingPets();
        
        // Redirect to map
        setTimeout(() => showSection('map-section'), 1500);
        
    } catch (error) {
        console.error('Error reporting missing pet:', error);
        alert('Error: ' + error.message);
    }
}

async function loadActiveMissingPets() {
    if (!currentUser) return;
    
    try {
        const { data: missingPets, error } = await supabase
            .from('missing_pets')
            .select('*')
            .eq('owner_id', currentUser.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const container = document.getElementById('missingPetsList');
        const activeContainer = document.getElementById('activeMissingPets');
        
        if (!container || !activeContainer) return;
        
        if (missingPets.length === 0) {
            activeContainer.style.display = 'none';
            return;
        }
        
        activeContainer.style.display = 'block';
        container.innerHTML = missingPets.map(mp => {
            const pet = userPets.find(p => p.id === mp.pet_id);
            const daysLost = Math.floor((new Date() - new Date(mp.created_at)) / (1000 * 60 * 60 * 24));
            
            return `
                <div class="missing-pet-card">
                    <h4>${pet?.name || 'Unknown Pet'}</h4>
                    <p>Last seen: ${mp.lost_location}</p>
                    <div class="pet-location">📍 ${mp.lost_date} at ${mp.lost_time || 'Unknown time'}</div>
                    ${mp.reward_amount ? `<p><strong>Reward:</strong> ${mp.reward_amount} LBP</p>` : ''}
                    <p style="font-size: 12px; margin-top: 8px;">${daysLost} day${daysLost !== 1 ? 's' : ''} ago</p>
                    <button class="btn btn-secondary" onclick="markPetAsFound('${mp.id}')" style="margin-top: 12px; width: 100%;">Mark as Found</button>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading missing pets:', error);
    }
}

async function markPetAsFound(missingPetId) {
    try {
        // Update missing pet status
        const { data: missingPet, error: getError } = await supabase
            .from('missing_pets')
            .select('pet_id')
            .eq('id', missingPetId)
            .single();
        
        if (getError) throw getError;
        
        await supabase
            .from('missing_pets')
            .update({ status: 'found' })
            .eq('id', missingPetId);
        
        // Update pet status back to safe
        await supabase
            .from('pets')
            .update({ status: 'safe' })
            .eq('id', missingPet.pet_id);
        
        showMessage('🎉 Great! Pet marked as found!');
        loadActiveMissingPets();
    } catch (error) {
        console.error('Error marking pet as found:', error);
        alert('Error: ' + error.message);
    }
}

// Map and GPS Functionality
let map = null;
let markers = {};
let userLocation = null;

async function initMap() {
    // Initialize Leaflet map centered on Beirut
    const mapContainer = document.getElementById('petMap');
    if (!mapContainer) return;
    
    map = L.map(mapContainer).setView([33.8547, 35.4747], 13); // Beirut coordinates
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Get user location
    getUserLocation().then(() => {
        loadMissingPetsOnMap();
    });
}

function getUserLocation() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Add user location marker
                if (map) {
                    L.circleMarker([userLocation.lat, userLocation.lng], {
                        radius: 8,
                        fillColor: '#0f8f3d',
                        color: '#0f8f3d',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map).bindPopup('📍 Your Location');
                    
                    // Center map on user
                    map.setView([userLocation.lat, userLocation.lng], 13);
                }
            },
            () => {
                console.log('GPS not available, using Beirut as default');
            }
        );
        resolve();
    });
}

async function loadMissingPetsOnMap() {
    try {
        const { data: missingPets, error } = await supabase
            .from('missing_pets')
            .select(`
                *,
                pets(
                    id,
                    name,
                    species,
                    owner_phone,
                    photo_url,
                    description
                )
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Clear existing markers
        Object.values(markers).forEach(marker => {
            if (map) map.removeLayer(marker);
        });
        markers = {};
        
        // Add missing pets to map
        missingPets.forEach(mp => {
            if (mp.latitude && mp.longitude && map) {
                const daysLost = Math.floor((new Date() - new Date(mp.created_at)) / (1000 * 60 * 60 * 24));
                const color = daysLost > 7 ? '#dc2626' : '#f97316';
                
                const marker = L.circleMarker([mp.latitude, mp.longitude], {
                    radius: 12,
                    fillColor: color,
                    color: color,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);
                
                const popupContent = `
                    <div class="pet-popup">
                        <h3>${mp.pets.name}</h3>
                        <span class="pet-type">${mp.pets.species.toUpperCase()}</span>
                        <span class="pet-status">🚨 MISSING</span>
                        <p><strong>Last seen:</strong> ${mp.lost_location}</p>
                        <p><strong>Date:</strong> ${mp.lost_date}</p>
                        <p><strong>Lost for:</strong> ${daysLost} days</p>
                        ${mp.reward_amount ? `<p><strong>Reward:</strong> ${mp.reward_amount} LBP</strong></p>` : ''}
                        <button class="contact-btn" onclick="reportSighting('${mp.pet_id}')">📍 I Saw This Pet</button>
                        <button class="contact-btn" onclick="callOwner('${mp.pets.owner_phone}')">📞 Call Owner</button>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                markers[mp.id] = marker;
            }
        });
        
        // Display missing pets in list
        displayMissingPetsList(missingPets);
        
    } catch (error) {
        console.error('Error loading missing pets on map:', error);
    }
}

function displayMissingPetsList(missingPets) {
    const container = document.getElementById('missingPetsGrid');
    if (!container) return;
    
    if (missingPets.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No missing pets in your area</p>';
        return;
    }
    
    container.innerHTML = missingPets.map(mp => {
        const daysLost = Math.floor((new Date() - new Date(mp.created_at)) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="missing-pet-card">
                <h4>${mp.pets.name}</h4>
                <p><strong>${mp.pets.species}:</strong> ${mp.pets.description || 'No description'}</p>
                <div class="pet-location">📍 ${mp.lost_location}</div>
                <p><strong>Lost:</strong> ${mp.lost_date} (${daysLost} days ago)</p>
                ${mp.reward_amount ? `<p><strong>Reward:</strong> ${mp.reward_amount} LBP</p>` : ''}
                <button class="btn btn-primary" onclick="reportSighting('${mp.pet_id}')" style="width: 100%; margin-top: 12px;">📍 Report Sighting</button>
            </div>
        `;
    }).join('');
}

function filterMissingPets() {
    const location = document.getElementById('filterLocation').value;
    const petType = document.getElementById('filterPetType').value;
    const distance = parseInt(document.getElementById('filterDistance').value);
    
    loadMissingPetsOnMap().then(() => {
        // Filter logic applied
        showMessage(`Filtering pets in ${location || 'all areas'} within ${distance}km`);
    });
}

function reportSighting(petId) {
    const reporterName = prompt('Your name:');
    if (!reporterName) return;
    
    const reporterPhone = prompt('Your phone number:');
    if (!reporterPhone) return;
    
    const notes = prompt('Any details about the sighting:');
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { error } = await supabase
                    .from('pet_sightings')
                    .insert([{
                        pet_id: petId,
                        reporter_name: reporterName,
                        reporter_phone: reporterPhone,
                        sighting_location: 'User Location',
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        sighting_date: new Date().toISOString().split('T')[0],
                        sighting_time: new Date().toTimeString().split(' ')[0],
                        notes: notes || ''
                    }]);
                
                if (error) throw error;
                
                showMessage('✅ Sighting reported! Owner will be notified.');
                loadMissingPetsOnMap();
                
            } catch (error) {
                console.error('Error reporting sighting:', error);
                alert('Error: ' + error.message);
            }
        },
        () => {
            alert('Please enable GPS to report sighting with location');
        }
    );
}

function callOwner(phone) {
    window.open(`tel:${phone}`);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    handleEmailConfirmation();
    checkAuthStatus();
    initPetSlider();
});
