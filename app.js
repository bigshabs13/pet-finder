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
        
        // Supabase sometimes returns existing users without errors
        // Check if user already exists by looking at the response
        if (data.user && !data.session) {
            // User exists but no session was created = existing unconfirmed user
            alert(`This email (${email}) is already registered but not confirmed. Please check your email for a confirmation link, or try logging in.`);
            return;
        }
        
        if (data.user && data.session) {
            // New user with immediate session = account created and confirmed
            alert('Account created and confirmed! Welcome to Pet-Finder.');
            currentUser = data.user;
            updateUI();
            signupModal.classList.remove('active');
            signupForm.reset();
            showDashboard();
            return;
        }
        
        if (data.user && data.user.created_at) {
            const createdAt = new Date(data.user.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - createdAt.getTime();
            
            // If user was created more than 30 seconds ago, it's likely existing
            if (timeDiff > 30000) {
                alert(`This email (${email}) is already registered. Please try logging in instead.`);
                return;
            }
            
            // New user created, needs email confirmation
            if (!data.user.email_confirmed_at) {
                alert(`Account created successfully! Please check your email (${email}) for a confirmation link. Check your spam folder if you don't see it.`);
            } else {
                alert('Account created and confirmed! You can now log in.');
            }
        } else {
            // Fallback
            alert('Account created! Please check your email to confirm your account.');
        }
        
        signupModal.classList.remove('active');
        signupForm.reset();
    } catch (error) {
        console.error('Signup exception:', error);
        alert('Signup failed: ' + error.message);
    }
});

addPetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const petData = {
        owner_id: currentUser.id,
        name: document.getElementById('petName').value,
        species: document.getElementById('petSpecies').value,
        breed: document.getElementById('petBreed').value,
        description: document.getElementById('petDescription').value,
        microchip_id: document.getElementById('petMicrochip').value || null
    };
    
    try {
        const { data, error } = await supabase
            .from('pets')
            .insert([petData])
            .select();
        
        if (error) throw error;
        
        addPetForm.reset();
        loadPets();
        alert('Pet added successfully!');
    } catch (error) {
        alert('Failed to add pet: ' + error.message);
    }
});

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    handleEmailConfirmation();
    checkAuthStatus();
    initPetSlider();
});
