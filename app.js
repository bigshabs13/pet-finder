// ========================================
// PET-FINDER - MAIN APPLICATION SCRIPT
// ========================================

// Configuration
const CONFIG = {
  SUPABASE_URL: 'https://idvunxqfgengfnbrsqla.supabase.co',
  SUPABASE_KEY: 'sb_publishable_QOik2xXg32RTTgRasLNLcA_GLMaw54Y',
  DEFAULT_LAT: 33.8547,
  DEFAULT_LNG: 35.4747,
  MAP_ZOOM: 13,
  QR_SIZE: 300
};

// Global State
const state = {
  currentUser: null,
  userPets: [],
  currentFormStep: 1,
  formTotalSteps: 3,
  map: null,
  mapMarkers: {},
  userLocation: null,
  currentPetImageIndex: 0
};

// Pet Images
const petImages = [
  '/images/1.jpg',
  '/images/2.webp',
  '/images/3.webp',
  '/images/4.avif',
  '/images/5.avif'
];

// ========================================
// SUPABASE
// ========================================

const { createClient } = window.supabase;
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// ========================================
// DOM CACHE
// ========================================

const dom = {
  homePage: document.getElementById('homePage'),
  dashboardPage: document.getElementById('dashboardPage'),
  loginModal: document.getElementById('loginModal'),
  signupModal: document.getElementById('signupModal'),
  loginBtn: document.getElementById('loginBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  homeLink: document.getElementById('homeLink'),
  dashboardLink: document.getElementById('dashboardLink'),
  loginForm: document.getElementById('loginForm'),
  signupForm: document.getElementById('signupForm'),
  addPetForm: document.getElementById('addPetForm'),
  petsList: document.getElementById('petsList')
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  handleEmailConfirmation();
  checkAuthStatus();
  initPetSlider();
  setupEventListeners();
  initChatbot();
  handlePetLink();
}

function setupEventListeners() {
  const signupBtn = document.getElementById('signupBtn');
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  const closeLoginBtn = document.getElementById('closeLoginBtn');
  const closeSignupBtn = document.getElementById('closeSignupBtn');

  signupBtn?.addEventListener('click', () => {
    if (state.currentUser) {
      alert('You are already logged in! Logout first to create a new account.');
      return;
    }
    dom.signupModal?.classList.add('active');
  });
  learnMoreBtn?.addEventListener('click', showLearnMoreInfo);
  document.getElementById('loginBtn')?.addEventListener('click', () => {
    if (state.currentUser) {
      alert('You are already logged in! Logout first to login to another account.');
      return;
    }
    dom.loginModal?.classList.add('active');
  });
  closeLoginBtn?.addEventListener('click', () => dom.loginModal?.classList.remove('active'));
  closeSignupBtn?.addEventListener('click', () => dom.signupModal?.classList.remove('active'));
  dom.logoutBtn?.addEventListener('click', logout);
  dom.homeLink?.addEventListener('click', (e) => { e.preventDefault(); showHome(); });
  dom.dashboardLink?.addEventListener('click', (e) => { e.preventDefault(); showDashboard(); });
  dom.loginForm?.addEventListener('submit', handleLogin);
  dom.signupForm?.addEventListener('submit', handleSignup);
  dom.addPetForm?.addEventListener('submit', handleFormSubmit);
}

function showLearnMoreInfo() {
  alert('PetFinder helps reunite lost pets with their owners using QR codes. Register your pet, generate a unique QR code, and if your pet is found, the scanner gets instant access to your contact information.');
}

// ========================================
// AUTHENTICATION
// ========================================

async function checkAuthStatus() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    state.currentUser = user;
    updateUI();
  } catch (error) {
    console.error('Auth check error:', error);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    state.currentUser = data.user;
    dom.loginModal?.classList.remove('active');
    dom.loginForm?.reset();
    updateUI();
    showDashboard();
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

async function handleSignup(e) {
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
      options: { emailRedirectTo: 'http://localhost:3000' }
    });

    if (error) {
      handleSignupError(error, email);
      return;
    }

    if (data.user && data.session) {
      alert('Account created and confirmed! Welcome to Pet-Finder.');
      state.currentUser = data.user;
      updateUI();
      dom.signupModal?.classList.remove('active');
      dom.signupForm?.reset();
      showDashboard();
    } else {
      alert(`Account created! Please check your email (${email}) for a confirmation link.`);
    }

    dom.signupModal?.classList.remove('active');
    dom.signupForm?.reset();
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed: ' + error.message);
  }
}

function handleSignupError(error, email) {
  const msg = error.message.toLowerCase();
  if (msg.includes('already registered') || msg.includes('already exists')) {
    alert(`This email (${email}) is already registered. Please try logging in.`);
  } else if (msg.includes('invalid email')) {
    alert('Please enter a valid email address.');
  } else {
    alert('Signup failed: ' + error.message);
  }
}

async function logout() {
  try {
    await supabase.auth.signOut();
    state.currentUser = null;
    updateUI();
    dom.loginForm?.reset();
    dom.signupForm?.reset();
  } catch (error) {
    alert('Logout failed: ' + error.message);
  }
}

// ========================================
// UI MANAGEMENT
// ========================================

function updateUI() {
  if (state.currentUser) {
    dom.loginBtn?.classList.add('hidden');
    dom.logoutBtn?.classList.remove('hidden');
    dom.dashboardLink?.classList.remove('hidden');
  } else {
    dom.loginBtn?.classList.remove('hidden');
    dom.logoutBtn?.classList.add('hidden');
    dom.dashboardLink?.classList.add('hidden');
    showHome();
  }
}

function showHome() {
  dom.homePage?.classList.remove('hidden');
  dom.dashboardPage?.classList.add('hidden');
}

function showDashboard() {
  if (!state.currentUser) {
    dom.loginModal?.classList.add('active');
    return;
  }
  dom.homePage?.classList.add('hidden');
  dom.dashboardPage?.classList.remove('hidden');
  initDashboard();
}

function showSection(sectionId) {
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

  document.querySelectorAll('.dashboard-section').forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId)?.classList.add('active');
}

// ========================================
// PET SLIDER
// ========================================

function initPetSlider() {
  const petSlider = document.getElementById('petSlider');
  if (!petSlider) return;

  const updateBackground = () => {
    petSlider.style.backgroundImage = `url('${petImages[state.currentPetImageIndex]}')`;
    state.currentPetImageIndex = (state.currentPetImageIndex + 1) % petImages.length;
  };

  updateBackground();
  setInterval(updateBackground, 5000);
}

// ========================================
// ADD PET FORM
// ========================================

function initAddPetForm() {
  document.getElementById('nextStep')?.addEventListener('click', nextFormStep);
  document.getElementById('prevStep')?.addEventListener('click', prevFormStep);
  document.getElementById('petPhoto')?.addEventListener('change', handlePhotoUpload);
}

function nextFormStep() {
  if (state.currentFormStep < state.formTotalSteps) {
    if (validateFormStep(state.currentFormStep)) {
      state.currentFormStep++;
      updateFormDisplay();
      if (state.currentFormStep === 3) updateFormReview();
    }
  }
}

function prevFormStep() {
  if (state.currentFormStep > 1) {
    state.currentFormStep--;
    updateFormDisplay();
  }
}

function updateFormDisplay() {
  document.querySelectorAll('.step').forEach((step, i) => {
    step.classList.remove('active', 'completed');
    if (i + 1 === state.currentFormStep) step.classList.add('active');
    else if (i + 1 < state.currentFormStep) step.classList.add('completed');
  });

  document.querySelectorAll('.form-step').forEach((step, i) => {
    step.classList.toggle('active', i + 1 === state.currentFormStep);
  });

  const nextBtn = document.getElementById('nextStep');
  const prevBtn = document.getElementById('prevStep');
  const submitBtn = document.getElementById('submitForm');

  if (prevBtn) prevBtn.style.display = state.currentFormStep === 1 ? 'none' : 'block';
  if (nextBtn && submitBtn) {
    if (state.currentFormStep === state.formTotalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'block';
    } else {
      nextBtn.style.display = 'block';
      submitBtn.style.display = 'none';
    }
  }
}

function validateFormStep(step) {
  switch (step) {
    case 1:
      const name = document.getElementById('petName').value.trim();
      const species = document.getElementById('petSpecies').value;
      if (!name) { alert('Please enter pet name'); return false; }
      if (!species) { alert('Please select pet type'); return false; }
      break;
    case 3:
      const phone = document.getElementById('ownerPhone').value.trim();
      if (!phone) { alert('Please enter phone number'); return false; }
      break;
  }
  return true;
}

function updateFormReview() {
  const reviewDiv = document.getElementById('formReview');
  if (!reviewDiv) return;

  const fields = ['petName', 'petSpecies', 'petBreed', 'petGender', 'petAge', 'petWeight', 'petColor', 'petMicrochip', 'ownerPhone'];
  const labels = ['Pet Name', 'Species', 'Breed', 'Gender', 'Age', 'Weight', 'Color', 'Microchip', 'Phone'];

  reviewDiv.innerHTML = fields.map((id, i) => `
    <div class="review-item">
      <span class="review-label">${labels[i]}:</span>
      <span class="review-value">${document.getElementById(id).value || 'Not provided'}</span>
    </div>
  `).join('');
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert('Photo must be smaller than 5MB');
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const preview = document.getElementById('photoPreview');
    if (preview) {
      preview.innerHTML = `
        <img src="${event.target.result}" alt="Pet photo" />
        <p style="margin-top: 8px; color: #6b7280;">Photo: ${file.name}</p>
        <button type="button" onclick="removePhoto()" class="btn btn-outline" style="margin-top: 8px;">Remove</button>
      `;
      document.querySelector('.upload-placeholder').style.display = 'none';
    }
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  document.getElementById('petPhoto').value = '';
  document.getElementById('photoPreview').innerHTML = '';
  const placeholder = document.querySelector('.upload-placeholder');
  if (placeholder) placeholder.style.display = 'block';
}

async function handleFormSubmit(e) {
  e.preventDefault();

  if (!state.currentUser) {
    alert('You must be logged in');
    return;
  }

  const submitBtn = document.getElementById('submitForm');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');

  try {
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (submitSpinner) submitSpinner.style.display = 'inline-block';

    const petData = {
      owner_id: state.currentUser.id,
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

    const { data: pet, error } = await supabase.from('pets').insert([petData]).select().single();
    if (error) throw error;

    await generateQRForPet(pet);
    document.getElementById('petRegisteredName').textContent = `${pet.name} added!`;
    document.getElementById('qrCodeResult').style.display = 'block';
    document.getElementById('addPetForm').style.display = 'none';
    document.querySelector('.form-steps').style.display = 'none';

    loadUserPets();
  } catch (error) {
    console.error('Error adding pet:', error);
    alert('Failed to add pet: ' + error.message);
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (submitText) submitText.style.display = 'inline-block';
    if (submitSpinner) submitSpinner.style.display = 'none';
  }
}

async function generateQRForPet(pet) {
  try {
    const baseUrl = 'http://192.168.10.87:3000';
    const petUrl = `${baseUrl}/?pet=${pet.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${CONFIG.QR_SIZE}x${CONFIG.QR_SIZE}&data=${encodeURIComponent(petUrl)}`;

    const qrDisplay = document.getElementById('qrCodeDisplay');
    if (qrDisplay) qrDisplay.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="max-width: 100%; border-radius: 8px;" />`;

    document.getElementById('downloadQR')?.addEventListener('click', () => downloadQRCode(qrUrl, pet.name));
    document.getElementById('printQR')?.addEventListener('click', () => printQRCode(qrUrl, pet));

    await supabase.from('pets').update({ qr_code_url: qrUrl }).eq('id', pet.id);
  } catch (error) {
    console.error('Error generating QR code:', error);
    showMessage('Pet added but QR generation failed.');
  }
}

function downloadQRCode(url, petName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = `${petName.replace(/\s+/g, '_')}_QR.png`;
  link.click();
}

function printQRCode(qrUrl, pet) {
  const w = window.open('', '_blank');
  w.document.write(`
    <html><head><title>Pet QR - ${pet.name}</title><style>
    body { font-family: Arial; text-align: center; padding: 20px; }
    .container { border: 2px solid #333; padding: 20px; max-width: 400px; margin: auto; }
    h1 { color: #0f8f3d; }
    </style></head><body>
    <div class="container">
      <h1>Pet-Finder QR Code</h1>
      <img src="${qrUrl}" style="max-width: 250px;" />
      <h2>${pet.name}</h2>
      <p><strong>Type:</strong> ${pet.species}</p>
      <p><strong>Phone:</strong> ${pet.owner_phone}</p>
    </div></body></html>
  `);
  w.document.close();
  w.print();
}

// ========================================
// PETS MANAGEMENT
// ========================================

async function loadUserPets() {
  if (!state.currentUser) return;

  try {
    const { data: pets, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', state.currentUser.id);

    if (error) throw error;
    state.userPets = pets || [];
    updateStats();
    renderPetsPreview();
  } catch (error) {
    console.error('Error loading pets:', error);
  }
}

function updateStats() {
  const total = state.userPets.length;
  const active = state.userPets.filter(p => p.status !== 'lost').length;
  const lost = state.userPets.filter(p => p.status === 'lost').length;

  document.getElementById('total-pets').textContent = total;
  document.getElementById('active-pets').textContent = active;
  document.getElementById('lost-pets').textContent = lost;
}

function renderPetsPreview() {
  const container = document.getElementById('pets-preview-grid');
  if (!container) return;

  if (state.userPets.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;">No pets registered yet.</div>';
    return;
  }

  container.innerHTML = state.userPets.slice(0, 3).map(pet => `
    <div class="pet-card">
      <h4>${pet.name}</h4>
      <p>Species: ${pet.species}</p>
      <p>Breed: ${pet.breed || 'Not specified'}</p>
      <p class="status">${(pet.status || 'safe').toUpperCase()}</p>
    </div>
  `).join('');
}

// ========================================
// SCANNER FUNCTIONALITY
// ========================================

function initScanner() {
  document.getElementById('start-scanner')?.addEventListener('click', startCamera);
  document.getElementById('manual-search')?.addEventListener('click', () => {
    const qrId = document.getElementById('qr-input').value.trim();
    if (qrId) searchPetByQR(qrId);
    else alert('Please enter a QR code ID');
  });
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const placeholder = document.querySelector('.camera-placeholder');
    if (placeholder) {
      placeholder.innerHTML = `
        <video id="camera-video" width="100%" height="300" autoplay></video>
        <button class="btn btn-secondary" onclick="stopCamera()">Stop Camera</button>
      `;
      document.getElementById('camera-video').srcObject = stream;
      showMessage('Camera started.');
    }
  } catch (error) {
    console.error('Camera error:', error);
    showMessage('Camera access denied.');
  }
}

function stopCamera() {
  const video = document.getElementById('camera-video');
  if (video?.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }

  const placeholder = document.querySelector('.camera-placeholder');
  if (placeholder) {
    placeholder.innerHTML = `
      <div>Camera Icon</div>
      <p>Point your camera at a Pet-Finder QR code</p>
      <button id="start-scanner" class="btn btn-primary">Start Camera</button>
    `;
    document.getElementById('start-scanner')?.addEventListener('click', startCamera);
  }
}

async function searchPetByQR(qrId) {
  try {
    const { data: pet, error } = await supabase
      .from('pets')
      .select('*, users(email, full_name)')
      .eq('id', qrId)
      .single();

    if (error) {
      showMessage('Pet not found.');
      return;
    }

    displayFoundPet(pet);
  } catch (error) {
    console.error('Search error:', error);
    showMessage('Error searching pet.');
  }
}

function displayFoundPet(pet) {
  let resultDiv = document.getElementById('scanner-result');
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.id = 'scanner-result';
    resultDiv.style.marginTop = '20px';
    const scannerSection = document.getElementById('scanner-section');
    if (scannerSection) scannerSection.appendChild(resultDiv);
  }

  const statusBadge = pet.status === 'lost' 
    ? '<span style="background: #dc2626; color: white; padding: 6px 12px; border-radius: 20px; font-weight: 600;">MISSING</span>'
    : '<span style="background: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-weight: 600;">SAFE</span>';

  const missingInfo = pet.status === 'lost' 
    ? '<div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; margin: 16px 0; border-radius: 8px;"><p><strong>This pet is reported MISSING!</strong></p><p>If you see this pet, please report the sighting immediately.</p></div>'
    : '';

  resultDiv.innerHTML = `
    <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; color: #0f8f3d;">${pet.name}</h3>
        ${statusBadge}
      </div>
      
      <p><strong>Type:</strong> ${pet.species}</p>
      <p><strong>Breed:</strong> ${pet.breed || 'Not specified'}</p>
      <p><strong>Color:</strong> ${pet.color || 'Not specified'}</p>
      ${pet.description ? `<p><strong>Details:</strong> ${pet.description}</p>` : ''}
      ${pet.microchip_id ? `<p><strong>Microchip ID:</strong> ${pet.microchip_id}</p>` : ''}
      
      ${missingInfo}
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 16px;">
        <p><strong>Owner Contact:</strong></p>
        <p>Phone: ${pet.owner_phone}</p>
        <p>Email: ${pet.users?.email || 'Not available'}</p>
      </div>
      
      <div style="display: flex; gap: 12px; margin-top: 16px;">
        <button class="btn btn-primary" onclick="contactOwner('${pet.users?.email}', '${pet.name}')"><i class="fas fa-envelope"></i> Send Email</button>
        <button class="btn btn-success" onclick="contactWhatsApp('${pet.owner_phone}')"><i class="fab fa-whatsapp"></i> WhatsApp</button>
        <button class="btn btn-secondary" onclick="callOwner('${pet.owner_phone}')"><i class="fas fa-phone"></i> Call Owner</button>
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
  const body = `I found ${petName} using Pet-Finder QR code.`;
  window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

// ========================================
// CHATBOT
// ========================================

const chatModelConfig = {
  defaultPositivePrompt: 'Keep it calm, concise, and action-focused. Empathize and encourage contacting a vet when urgent.',
  defaultNegativePrompt: 'Avoid medical diagnoses, panic, personal data, or blaming the owner. No false guarantees.',
  useOllama: true,
  ollamaEndpoint: 'http://127.0.0.1:11434/api/generate',
  ollamaModel: 'qwen2.5:3b',
  temperature: 0.35,
  numCtx: 2048,
  repeatPenalty: 1.05
};

const syntheticChatDataset = [
  {
    user: 'My dog ran away from home',
    response: 'Start a 500m search, tell neighbors, print QR flyers, and update the pet status to missing.',
    tags: ['missing', 'community'],
    keywords: ['dog', 'ran', 'away', 'missing']
  },
  {
    user: 'Cat not eating',
    response: 'Check water intake, offer plain boiled chicken, and call a vet if more than 24h.',
    tags: ['health', 'nutrition'],
    keywords: ['cat', 'not eating', 'food']
  },
  {
    user: 'How often should I feed my puppy?',
    response: 'Small frequent meals 3-4x daily, consistent schedule, no sudden food changes.',
    tags: ['nutrition'],
    keywords: ['feed', 'puppy', 'often']
  },
  {
    user: 'Create a missing poster',
    response: 'Use a clear photo, add QR code, phone number, last location, and reward if any.',
    tags: ['missing', 'qr'],
    keywords: ['poster', 'missing', 'qr']
  },
  {
    user: 'Dog limping after walk',
    response: 'Rest 24h, check paws for debris, avoid stairs, vet visit if swelling or pain persists.',
    tags: ['health'],
    keywords: ['limping', 'walk', 'pain']
  },
  {
    user: 'House training tips',
    response: 'Take the dog out after meals, reward outside potty, keep a consistent routine, avoid punishment.',
    tags: ['behavior'],
    keywords: ['training', 'house', 'potty']
  },
  {
    user: 'What should I pack for emergency go bag',
    response: 'Water, 3-day food, leash, copy of vet records, QR tag, first-aid kit, and a recent photo.',
    tags: ['safety'],
    keywords: ['emergency', 'bag', 'kit']
  },
  {
    user: 'My cat scratched my sofa',
    response: 'Add scratching posts near the sofa, use deterrent spray, reward cat when using posts.',
    tags: ['behavior'],
    keywords: ['scratched', 'sofa', 'scratching']
  },
  {
    user: 'Lost pet search checklist',
    response: 'Search nearby hiding spots, notify shelters, share QR on social media, update microchip registry.',
    tags: ['missing', 'community'],
    keywords: ['search', 'lost', 'checklist']
  },
  {
    user: 'Puppy ate chocolate',
    response: 'Call a vet immediately, note the amount and time, and do not wait for symptoms.',
    tags: ['health', 'emergency'],
    keywords: ['chocolate', 'ate', 'puppy']
  }
];

const topicLibrary = {
  missing: {
    title: 'Missing pet recovery plan',
    keywords: ['missing', 'lost', 'run away', 'ran away', 'escape', 'escaped', 'poster', 'flyer', 'qr'],
    steps: [
      'Search your street and immediate 500m radius with a leash and treats.',
      'Mark the pet as missing in the app so QR scans show your contact.',
      'Print or share the QR code on social platforms and local groups.',
      'Call nearby shelters and vets; give them the QR link.',
      'Leave a familiar scent (bed/blanket) near your door or gate.'
    ],
    caution: 'If your pet is in danger or near traffic, ask a neighbor to help while you call local shelters.',
    tone: 'Stay calm and move quickly. Make it easy for anyone to contact you.'
  },
  nutrition: {
    title: 'Feeding and nutrition',
    keywords: ['feed', 'diet', 'food', 'eat', 'kibble', 'treats', 'schedule'],
    steps: [
      'Keep a predictable feeding schedule; puppies/kittens need 3-4 smaller meals.',
      'Use measured portions to avoid overfeeding; adjust slowly when changing food.',
      'Provide clean water at all times and log appetite changes.',
      'Introduce new foods gradually over 3-5 days to avoid stomach upset.'
    ],
    caution: 'If appetite drops for 24 hours or vomiting appears, call your vet.',
    tone: 'Balance routine with gradual changes to protect their stomach.'
  },
  health: {
    title: 'Health and first aid',
    keywords: ['sick', 'vomit', 'limp', 'hurt', 'injury', 'emergency', 'bleeding', 'fever', 'ill'],
    steps: [
      'Keep your pet warm and limit movement while you assess symptoms.',
      'Check gums, paws, and body for obvious injuries or swelling.',
      'Provide fresh water; avoid food until vomiting/diarrhea stops.',
      'Call your vet for guidance if pain, swelling, or lethargy persists.'
    ],
    caution: 'Seizures, heavy bleeding, or toxin ingestion (chocolate, xylitol) need immediate vet care.',
    tone: 'Stabilize first, then get professional help fast.'
  },
  behavior: {
    title: 'Training and behavior',
    keywords: ['train', 'behavior', 'barking', 'anxiety', 'scratch', 'biting', 'chew'],
    steps: [
      'Reward the behavior you want within 1-2 seconds of it happening.',
      'Redirect unwanted actions to an allowed option (toy, scratch post).',
      'Keep sessions short (5-10 minutes) and end on a success.',
      'Stay consistent; everyone in the home should use the same cues.'
    ],
    caution: 'Avoid punishment—it increases fear. Seek a trainer if aggression appears.',
    tone: 'Repetition, timing, and kindness build habits faster.'
  },
  qr: {
    title: 'QR code and scanner help',
    keywords: ['qr', 'code', 'scan', 'scanner', 'tag', 'badge'],
    steps: [
      'Open your pet card and generate the QR code; save it to your phone and print for tags.',
      'Test the QR in good lighting; wipe smudges and keep it flat for easier scans.',
      'Share the QR link with neighbors and shelters so they can scan it quickly.',
      'If a scan fails, share the pet link directly or reprint at higher contrast.'
    ],
    caution: 'Never post personal addresses publicly—use the QR contact info instead.',
    tone: 'Make QR access easy so finders can contact you within seconds.'
  },
  safety: {
    title: 'Emergency and preparedness',
    keywords: ['emergency', 'first aid', 'go bag', 'kit', 'storm', 'earthquake', 'fire'],
    steps: [
      'Pack a go-bag with water, 3-day food, leash, QR tag, vet records, and a recent photo.',
      'Know your closest 24/7 vet clinic and route.',
      'Keep a basic pet first-aid kit (gauze, tape, antiseptic, tweezers).',
      'Practice quick leash/harnessing so exits are smooth during emergencies.'
    ],
    caution: 'In disasters, your safety comes first—evacuate early and keep pets leashed/crated.',
    tone: 'Preparedness reduces panic when seconds matter.'
  },
  general: {
    title: 'Pet care guidance',
    keywords: [],
    steps: [
      'Share your pet\'s QR code so helpers can contact you instantly.',
      'Keep ID tags, microchip info, and photos up to date.',
      'Schedule routine vet checks and keep vaccination records handy.',
      'Use positive reinforcement for training and safety gear for outings.'
    ],
    caution: 'When in doubt about health, call a vet rather than guessing.',
    tone: 'Simple routines and fast communication keep pets safer.'
  }
};

let loraAdapter = null;

function trainSyntheticLora(dataset) {
  const topicBoosts = {};
  dataset.forEach(sample => {
    (sample.tags || []).forEach(tag => {
      topicBoosts[tag] = (topicBoosts[tag] || 0) + 1 + (sample.keywords?.length || 0) * 0.05;
    });
  });

  const max = Math.max(...Object.values(topicBoosts), 1);
  Object.keys(topicBoosts).forEach(topic => {
    topicBoosts[topic] = Number(((topicBoosts[topic] / max) + 0.35).toFixed(2));
  });

  return {
    topicBoosts,
    datasetSize: dataset.length,
    trainedAt: new Date().toISOString()
  };
}

function initChatbot() {
  const chatSendBtn = document.getElementById('chatSend');
  const chatInput = document.getElementById('chatInput');
  const positiveField = document.getElementById('positivePrompt');
  const negativeField = document.getElementById('negativePrompt');
  const modelField = document.getElementById('chatModelName');

  if (positiveField && !positiveField.value) positiveField.value = chatModelConfig.defaultPositivePrompt;
  if (negativeField && !negativeField.value) negativeField.value = chatModelConfig.defaultNegativePrompt;
  if (modelField && !modelField.value) modelField.value = chatModelConfig.ollamaModel;

  loraAdapter = trainSyntheticLora(syntheticChatDataset);
  updateLoraStatus();

  chatSendBtn?.addEventListener('click', () => sendMessage());
  chatInput?.addEventListener('keydown', handleChatEnter);
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.question || btn.textContent.trim();
      sendMessage(preset);
    });
  });

  addBotMessage("Chatbot will try local qwen2.5 via Ollama first, then fall back to the built-in synthetic LoRA playbook. Ask anything about pet care, safety, or missing pets.");
}

function handleChatEnter(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
}

function askQuestion(question) {
  sendMessage(question);
}

async function sendMessage(predefined) {
  const input = document.getElementById('chatInput');
  const msg = predefined || input?.value.trim();
  if (!msg) return;

  addUserMessage(msg);
  if (!predefined && input) input.value = '';

  const positivePrompt = document.getElementById('positivePrompt')?.value || chatModelConfig.defaultPositivePrompt;
  const negativePrompt = document.getElementById('negativePrompt')?.value || chatModelConfig.defaultNegativePrompt;
  const modelName = document.getElementById('chatModelName')?.value?.trim() || chatModelConfig.ollamaModel;
  const placeholder = addBotMessage('Thinking...');

  try {
    const reply = await generateBotResponse(msg, positivePrompt, negativePrompt, modelName);
    setBotMessageContent(placeholder, reply);
  } catch (error) {
    console.error('Chat reply failed, using synthetic fallback:', error);
    const fallback = generateSyntheticResponse(msg, positivePrompt, negativePrompt);
    setBotMessageContent(placeholder, `${fallback}<p class="prompt-hint">Local model error: ${escapeHtml(error.message || 'unknown')}</p>`);
  }
}

function addUserMessage(msg) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'user-message';
  const safeText = document.createElement('div');
  safeText.textContent = msg;
  div.innerHTML = `<div class="message-avatar">😊</div>`;
  div.appendChild(createMessageContent(safeText.textContent, true));
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addBotMessage(msg) {
  const container = document.getElementById('chatMessages');
  if (!container) return null;
  const div = document.createElement('div');
  div.className = 'bot-message';
  div.innerHTML = `<div class="message-avatar">🤖</div>`;
  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = msg;
  div.appendChild(content);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function setBotMessageContent(botMessageEl, html) {
  if (!botMessageEl) {
    addBotMessage(html);
    return;
  }
  const content = botMessageEl.querySelector('.message-content');
  if (!content) return;
  content.innerHTML = html;
  botMessageEl.scrollIntoView({ block: 'end', behavior: 'smooth' });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createMessageContent(text, isUser) {
  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = text;
  if (isUser) content.style.whiteSpace = 'pre-wrap';
  return content;
}

async function generateBotResponse(userMsg, positivePrompt, negativePrompt, modelName) {
  const selectedModel = modelName || chatModelConfig.ollamaModel;
  if (chatModelConfig.useOllama && selectedModel) {
    const ollamaReply = await generateWithOllama(selectedModel, userMsg, positivePrompt, negativePrompt);
    if (ollamaReply) {
      const sanitizedNegative = sanitizeNegativePrompt(negativePrompt);
      const positiveLine = positivePrompt || chatModelConfig.defaultPositivePrompt;
      return `
        <p><strong>${escapeHtml(selectedModel)}</strong> (local via Ollama)</p>
        <p>${escapeHtml(ollamaReply).replace(/\n/g, '<br>')}</p>
        <p class="prompt-hint">Style: ${escapeHtml(positiveLine)} · Avoid: ${escapeHtml(sanitizedNegative)}</p>
      `;
    }
  }

  return generateSyntheticResponse(userMsg, positivePrompt, negativePrompt);
}

async function generateWithOllama(modelName, userMsg, positivePrompt, negativePrompt) {
  if (!chatModelConfig.ollamaEndpoint) throw new Error('Ollama endpoint missing.');
  const payload = {
    model: modelName,
    prompt: buildOllamaPrompt(userMsg, positivePrompt, negativePrompt),
    stream: false,
    options: {
      temperature: chatModelConfig.temperature,
      num_ctx: chatModelConfig.numCtx,
      repeat_penalty: chatModelConfig.repeatPenalty
    }
  };

  const res = await fetch(chatModelConfig.ollamaEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Ollama responded ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data?.error) throw new Error(data.error);
  return data?.response?.trim();
}

function buildOllamaPrompt(userMsg, positivePrompt, negativePrompt) {
  const positiveLine = positivePrompt || chatModelConfig.defaultPositivePrompt;
  const sanitizedNegative = sanitizeNegativePrompt(negativePrompt);
  return [
    'You are PetBot, a concise, calm assistant for pet care, safety, and missing pet recovery.',
    `Keep answers short, actionable, and local-friendly.`,
    `Style focus: ${positiveLine}`,
    `Avoid: ${sanitizedNegative}`,
    '',
    `User: ${userMsg}`,
    'Assistant:'
  ].join('\n');
}

function generateSyntheticResponse(userMsg, positivePrompt, negativePrompt) {
  const topic = detectTopic(userMsg);
  const template = topicLibrary[topic] || topicLibrary.general;
  const adapterBoost = loraAdapter?.topicBoosts?.[topic] || 0.35;
  const fewShot = getFewShotExample(userMsg, topic);

  const steps = template.steps.slice(0, Math.min(template.steps.length, 3 + Math.round(adapterBoost)));
  if (fewShot && !steps.includes(fewShot.response)) steps.push(fewShot.response);

  const sanitizedNegative = sanitizeNegativePrompt(negativePrompt);
  const positiveLine = positivePrompt || chatModelConfig.defaultPositivePrompt;

  return `
    <p><strong>${template.title}</strong> — tuned with a free synthetic model.</p>
    <p>${template.tone}</p>
    <ul>${steps.map(step => `<li>${step}</li>`).join('')}</ul>
    <p style="color:#047857;"><strong>Style:</strong> ${positiveLine}</p>
    <p style="color:#b45309;"><strong>Avoid:</strong> ${sanitizedNegative}</p>
    <p class="prompt-hint">Adapter boost ${adapterBoost.toFixed(2)} · LoRA on ${loraAdapter?.datasetSize || 0} synthetic samples · Topic: ${topic}</p>
    <p class="prompt-hint">Last trained: ${formatTimestamp(loraAdapter?.trainedAt)}</p>
  `;
}

function detectTopic(msg) {
  const text = msg.toLowerCase();
  const scores = {};

  Object.keys(topicLibrary).forEach(topic => {
    const cfg = topicLibrary[topic];
    scores[topic] = (loraAdapter?.topicBoosts?.[topic] || 0);
    cfg.keywords.forEach(keyword => {
      if (text.includes(keyword)) scores[topic] += 1;
    });
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || 'general';
}

function getFewShotExample(msg, topic) {
  const tokens = msg.toLowerCase().split(/\W+/).filter(Boolean);
  let best = null;
  let bestScore = 0;

  syntheticChatDataset.forEach(sample => {
    const tags = sample.tags || [];
    if (topic && !tags.includes(topic)) return;
    const overlap = sample.keywords?.reduce((score, kw) => score + (tokens.includes(kw.replace(/\s+/g, '')) ? 1 : textContains(tokens, kw)), 0) || 0;
    if (overlap > bestScore) {
      best = sample;
      bestScore = overlap;
    }
  });

  return best || syntheticChatDataset[0];
}

function textContains(tokens, phrase) {
  const cleaned = phrase.toLowerCase().split(/\W+/).filter(Boolean);
  return cleaned.every(part => tokens.includes(part)) ? 1 : 0;
}

function sanitizeNegativePrompt(negativePrompt) {
  const fallback = chatModelConfig.defaultNegativePrompt;
  const sanitized = (negativePrompt || fallback).replace(/[^a-z0-9 ,.-]/gi, '');
  return sanitized || fallback;
}

function updateLoraStatus() {
  const statusEl = document.getElementById('loraStatus');
  if (!statusEl || !loraAdapter) return;
  const topics = Object.entries(loraAdapter.topicBoosts || {})
    .sort((a, b) => b[1] - a[1])
    .map(([topic, weight]) => `${topic}: ${weight.toFixed(2)}`)
    .join(' · ');
  const modelName = document.getElementById('chatModelName')?.value?.trim() || chatModelConfig.ollamaModel;
  statusEl.textContent = `Primary model: ${modelName || 'qwen2.5:3b'} via Ollama (127.0.0.1). Fallback: synthetic LoRA on ${loraAdapter.datasetSize} samples • Topic boosts ${topics}`;
}

function formatTimestamp(ts) {
  if (!ts) return 'unknown';
  const date = new Date(ts);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

// ========================================
// MISSING PET FUNCTIONALITY
// ========================================

function initReportMissing() {
  const form = document.getElementById('reportMissingForm');
  if (form) form.addEventListener('submit', handleReportMissing);

  const petSelect = document.getElementById('missingPetSelect');
  if (petSelect && state.userPets) {
    petSelect.innerHTML = '<option value="">Choose a pet...</option>';
    state.userPets.forEach(pet => {
      const option = document.createElement('option');
      option.value = pet.id;
      option.textContent = pet.name;
      petSelect.appendChild(option);
    });
  }
}

async function handleReportMissing(e) {
  e.preventDefault();

  if (!state.currentUser) {
    alert('You must be logged in to report a missing pet. Please login or create an account first.');
    dom.loginModal?.classList.add('active');
    return;
  }

  const petId = document.getElementById('missingPetSelect').value;
  const lostDate = document.getElementById('lostDate').value;
  const lostTime = document.getElementById('lostTime').value;
  const lostLocation = document.getElementById('lostLocation').value;
  const description = document.getElementById('missingDescription').value;
  const rewardAmount = document.getElementById('rewardAmount').value || null;

  let latitude = null, longitude = null;

  try {
    const coords = await new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve(pos.coords),
        () => resolve(null)
      );
    });
    if (coords) {
      latitude = coords.latitude;
      longitude = coords.longitude;
    }
  } catch (e) {
    console.log('GPS unavailable');
  }

  try {
    const { error } = await supabase.from('missing_pets').insert([{
      pet_id: petId,
      owner_id: state.currentUser.id,
      lost_date: lostDate,
      lost_time: lostTime || null,
      lost_location: lostLocation,
      latitude,
      longitude,
      additional_description: description,
      reward_amount: rewardAmount,
      status: 'active'
    }]);

    if (error) throw error;

    await supabase.from('pets').update({ status: 'lost' }).eq('id', petId);

    showMessage('Pet marked as missing! Shared with community.');
    document.getElementById('reportMissingForm').reset();
    loadActiveMissingPets();
    setTimeout(() => showSection('map-section'), 1500);
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  }
}

async function loadActiveMissingPets() {
  if (!state.currentUser) return;

  try {
    const { data: missingPets, error } = await supabase
      .from('missing_pets')
      .select('*')
      .eq('owner_id', state.currentUser.id)
      .eq('status', 'active');

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
      const pet = state.userPets.find(p => p.id === mp.pet_id);
      const daysLost = Math.floor((new Date() - new Date(mp.created_at)) / (1000 * 60 * 60 * 24));
      return `
        <div class="missing-pet-card">
          <h4>${pet?.name || 'Unknown'}</h4>
          <p>Last seen: ${mp.lost_location}</p>
          <p>Date: ${mp.lost_date}</p>
          ${mp.reward_amount ? `<p>Reward: ${mp.reward_amount} LBP</p>` : ''}
          <p>${daysLost} days ago</p>
          <button class="btn btn-secondary" onclick="markPetAsFound('${mp.id}')" style="width: 100%; margin-top: 12px;">Mark Found</button>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading missing pets:', error);
  }
}

async function markPetAsFound(missingPetId) {
  try {
    const { data: missingPet, error } = await supabase
      .from('missing_pets')
      .select('pet_id')
      .eq('id', missingPetId)
      .single();

    if (error) throw error;

    await supabase.from('missing_pets').update({ status: 'found' }).eq('id', missingPetId);
    await supabase.from('pets').update({ status: 'safe' }).eq('id', missingPet.pet_id);

    showMessage('Pet marked as found!');
    loadActiveMissingPets();
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  }
}

// ========================================
// MAP AND GPS
// ========================================

async function initMap() {
  const mapContainer = document.getElementById('petMap');
  if (!mapContainer) return;

  state.map = L.map(mapContainer).setView([CONFIG.DEFAULT_LAT, CONFIG.DEFAULT_LNG], CONFIG.MAP_ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(state.map);

  await getUserLocation();
  await loadMissingPetsOnMap();
}

function getUserLocation() {
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (state.map) {
          L.circleMarker([state.userLocation.lat, state.userLocation.lng], {
            radius: 8,
            fillColor: '#0f8f3d',
            color: '#0f8f3d',
            weight: 2,
            fillOpacity: 0.8
          }).addTo(state.map).bindPopup('Your Location');

          state.map.setView([state.userLocation.lat, state.userLocation.lng], CONFIG.MAP_ZOOM);
        }
      },
      () => console.log('GPS unavailable')
    );
    resolve();
  });
}

async function loadMissingPetsOnMap() {
  try {
    const { data: missingPets, error } = await supabase
      .from('missing_pets')
      .select('*, pets(id, name, species, owner_phone, description)')
      .eq('status', 'active');

    if (error) throw error;

    Object.values(state.mapMarkers).forEach(marker => {
      if (state.map) state.map.removeLayer(marker);
    });
    state.mapMarkers = {};

    missingPets.forEach(mp => {
      if (mp.latitude && mp.longitude && state.map) {
        const daysLost = Math.floor((new Date() - new Date(mp.created_at)) / (1000 * 60 * 60 * 24));
        const color = daysLost > 7 ? '#dc2626' : '#f97316';

        const marker = L.circleMarker([mp.latitude, mp.longitude], {
          radius: 12,
          fillColor: color,
          color: color,
          weight: 2,
          fillOpacity: 0.8
        }).addTo(state.map);

        const popup = `
          <div class="pet-popup">
            <h3>${mp.pets.name}</h3>
            <p><strong>${mp.pets.species.toUpperCase()}</strong></p>
            <p>MISSING - Last seen: ${mp.lost_location}</p>
            <p>Date: ${mp.lost_date}</p>
            <p>Lost for: ${daysLost} days</p>
        <button class="contact-btn" onclick="reportSighting('${mp.pet_id}')">Report Sighting</button>
        <button class="contact-btn" onclick="contactWhatsApp('${mp.pets.owner_phone}')">WhatsApp</button>
        <button class="contact-btn" onclick="callOwner('${mp.pets.owner_phone}')">Call Owner</button>
          </div>
        `;

        marker.bindPopup(popup);
        state.mapMarkers[mp.id] = marker;
      }
    });

    displayMissingPetsList(missingPets);
  } catch (error) {
    console.error('Map error:', error);
  }
}

function displayMissingPetsList(missingPets) {
  const container = document.getElementById('missingPetsGrid');
  if (!container) return;

  if (missingPets.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No missing pets</p>';
    return;
  }

  container.innerHTML = missingPets.map(mp => {
    const daysLost = Math.floor((new Date() - new Date(mp.created_at)) / (1000 * 60 * 60 * 24));
    return `
      <div class="missing-pet-card">
        <h4>${mp.pets.name}</h4>
        <p>${mp.pets.species}: ${mp.pets.description || 'No description'}</p>
        <p>Location: ${mp.lost_location}</p>
        <p>Lost: ${mp.lost_date} (${daysLost} days ago)</p>
        ${mp.reward_amount ? `<p>Reward: ${mp.reward_amount} LBP</p>` : ''}
        <button class="btn btn-primary" onclick="reportSighting('${mp.pet_id}')" style="width: 100%; margin-top: 12px;">Report Sighting</button>
      </div>
    `;
  }).join('');
}

async function reportSighting(petId) {
  if (!state.currentUser) {
    alert('You must be logged in to report a sighting. Please login first.');
    dom.loginModal?.classList.add('active');
    return;
  }
  
  // Get the pet to check owner
  const { data: petData } = await supabase.from('pets').select('owner_id').eq('id', petId).single();
  
  // Prevent owner from reporting their own pet
  if (petData && state.currentUser.id === petData.owner_id) {
    alert('You cannot report a sighting for your own pet.');
    return;
  }
  
  const userName = state.currentUser.email || 'Anonymous';
  const lostLocation = prompt('Where did you see this pet?');
  if (!lostLocation) return;
  
  const lostTime = prompt('What time? (HH:MM)');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      await submitSighting(petId, userName, state.currentUser.phone || 'Not provided', lostLocation, lostTime, position.coords.latitude, position.coords.longitude);
    },
    () => {
      // Allow without GPS
      submitSighting(petId, userName, state.currentUser.phone || 'Not provided', lostLocation, lostTime, null, null);
    }
  );
}

async function submitSighting(petId, name, phone, location, time, lat, lng) {
  try {
    const { error } = await supabase.from('pet_sightings').insert([{
      pet_id: petId,
      reporter_name: name,
      reporter_phone: phone,
      sighting_location: location,
      latitude: lat,
      longitude: lng,
      sighting_date: new Date().toISOString().split('T')[0],
      sighting_time: time || new Date().toTimeString().split(' ')[0],
      notes: ''
    }]);

    if (error) throw error;
    showMessage('Sighting reported!');
    loadMissingPetsOnMap();
    loadSightingNotifications();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function showQRModal(petId, petName) {
  const baseUrl = 'http://192.168.10.87:3000';
  const petUrl = `${baseUrl}/?pet=${petId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(petUrl)}`;
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
    z-index: 2000;
  `;
  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; max-width: 400px;">
      <h2>${petName}'s QR Code</h2>
      <img src="${qrUrl}" style="max-width: 250px; margin: 20px 0; border-radius: 8px;" />
      <p style="color: #6b7280; margin-bottom: 20px;">Scan this code to view ${petName}'s profile</p>
      <div style="display: flex; gap: 10px;">
        <button onclick="downloadQRCode('${qrUrl}', '${petName}')" style="flex: 1; padding: 10px; background: #0f8f3d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Download</button>
        <button onclick="printQRCode('${qrUrl}', '${petName}')" style="flex: 1; padding: 10px; background: #ff8c00; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Print</button>
        <button onclick="this.closest('div').parentElement.remove()" style="flex: 1; padding: 10px; background: #ccc; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function downloadQRCode(url, name) {
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name.replace(/\s+/g, '_')}_QR.png`;
  link.click();
}

function printQRCode(url, name) {
  const w = window.open('', '_blank');
  w.document.write(`
    <html><head><title>${name} QR</title></head>
    <body style="text-align: center; padding: 40px;">
      <h1>${name}</h1>
      <img src="${url}" style="max-width: 400px; margin: 20px 0;" />
      <p>Scan to view ${name}'s profile</p>
    </body></html>
  `);
  w.document.close();
  w.print();
}

function contactWhatsApp(phone) {
  if (!phone) {
    showMessage('Owner phone number not available');
    return;
  }
  const digits = ('' + phone).replace(/\D/g, '');
  const text = encodeURIComponent('Hi! I found your pet via PetFinder QR.');
  const url = `https://wa.me/${digits}?text=${text}`;
  window.open(url, '_blank');
}

// ========================================
// DASHBOARD
// ========================================

function initDashboard() {
  document.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sectionId = e.currentTarget.dataset.section;
      showSection(sectionId);
      
      if (sectionId === 'feed-section') loadFeed();
      if (sectionId === 'my-pets-section') { renderMyPets(); loadSightingNotifications(); }
      if (sectionId === 'map-section') setTimeout(() => initMap(), 300);
    });
  });

  showSection('feed-section');
  initAddPetForm();
  initReportMissing();

  if (document.getElementById('scanner-section')) initScanner();
  
  loadUserPets().then(() => loadSightingNotifications());
  loadFeed();
  // periodically refresh notifications while on dashboard
  setInterval(loadSightingNotifications, 30000);
}

function initQuickActions() {
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]').dataset.action;
      if (action === 'add-pet' || action === 'emergency') showSection('add-pet-section');
      else if (action === 'scanner') showSection('scanner-section');
    });
  });
}

// ========================================
// FEED PAGE
// ========================================

async function loadFeed() {
  try {
    const { data: missingPets, error } = await supabase
      .from('missing_pets')
      .select('*, pets(id, name, species, color, description, owner_phone)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const feedContainer = document.getElementById('feedContainer');
    if (!feedContainer) return;

    if (missingPets.length === 0) {
      feedContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;"><p>No missing pets reported in your area</p></div>';
      return;
    }

    feedContainer.innerHTML = missingPets.map(mp => {
      const daysLost = Math.floor((new Date() - new Date(mp.created_at)) / (1000 * 60 * 60 * 24));
      return `
        <div class="feed-card">
          <div class="feed-card-header">
            <h3>${mp.pets.name}</h3>
            <span class="status-badge">MISSING</span>
          </div>
          <div class="feed-card-body">
            <p><strong>Type:</strong> ${mp.pets.species}</p>
            <p><strong>Color:</strong> ${mp.pets.color || 'Not specified'}</p>
            <p><strong>Last Seen:</strong> ${mp.lost_location}</p>
            <p><strong>Date:</strong> ${mp.lost_date} (${daysLost} days ago)</p>
            ${mp.reward_amount ? `<p><strong style="color: #dc2626;">Reward:</strong> ${mp.reward_amount} LBP</p>` : ''}
            ${mp.additional_description ? `<p><strong>Details:</strong> ${mp.additional_description}</p>` : ''}
          </div>
          <div class="feed-card-footer">
            <button class="btn btn-primary" onclick="reportSighting('${mp.pet_id}')"><i class="fas fa-info-circle"></i> Report Sighting</button>
            <button class="btn btn-success" onclick="contactWhatsApp('${mp.pets.owner_phone}')"><i class="fab fa-whatsapp"></i> WhatsApp</button>
            <button class="btn btn-secondary" onclick="callOwner('${mp.pets.owner_phone}')"><i class="fas fa-phone"></i> Call Owner</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading feed:', error);
    showMessage('Failed to load feed');
  }
}

// ========================================
// MY PETS PAGE
// ========================================

function renderMyPets() {
  const petsList = document.getElementById('petsList');
  if (!petsList) return;

  if (state.userPets.length === 0) {
    petsList.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;"><p>No pets registered. Add your first pet to get started.</p></div>';
    return;
  }

  petsList.innerHTML = state.userPets.map(pet => `
    <div class="pet-card-my-pets">
      <div class="pet-card-header">
        <h3>${pet.name}</h3>
        <span class="pet-status-label ${pet.status}">${pet.status === 'lost' ? 'MISSING' : 'SAFE'}</span>
      </div>
      <div class="pet-card-body">
        <p><strong>Type:</strong> ${pet.species}</p>
        <p><strong>Breed:</strong> ${pet.breed || 'Not specified'}</p>
        <p><strong>Color:</strong> ${pet.color || 'Not specified'}</p>
        ${pet.description ? `<p><strong>Details:</strong> ${pet.description}</p>` : ''}
      </div>
      <div class="pet-card-actions">
        <button class="btn btn-${pet.status === 'lost' ? 'success' : 'warning'}" onclick="toggleMissingStatus('${pet.id}', '${pet.status}')"><i class="fas fa-${pet.status === 'lost' ? 'check' : 'exclamation'}"></i> Mark ${pet.status === 'lost' ? 'Found' : 'Missing'}</button>
        <button class="btn btn-secondary" onclick="showQRModal('${pet.id}', '${pet.name}')"><i class="fas fa-qrcode"></i> QR Code</button>
        <button class="btn btn-danger" onclick="deletePetConfirm('${pet.id}')"><i class="fas fa-trash"></i> Delete</button>
      </div>
      <div id="qr-${pet.id}" class="qr-display"></div>
    </div>
  `).join('');
}

async function toggleMissingStatus(petId, currentStatus) {
  const newStatus = currentStatus === 'lost' ? 'safe' : 'lost';
  
  try {
    if (newStatus === 'lost') {
      const lostDate = new Date().toISOString().split('T')[0];
      const lostLocation = prompt('Where was your pet last seen?');
      if (!lostLocation) return;

      const { error } = await supabase.from('missing_pets').insert([{
        pet_id: petId,
        owner_id: state.currentUser.id,
        lost_date: lostDate,
        lost_location: lostLocation,
        status: 'active'
      }]);

      if (error) throw error;
      showMessage('Pet marked as missing!');
    } else {
      const { data: missingPet } = await supabase
        .from('missing_pets')
        .select('id')
        .eq('pet_id', petId)
        .eq('status', 'active')
        .single();

      if (missingPet) {
        await supabase.from('missing_pets').update({ status: 'found' }).eq('id', missingPet.id);
      }
      showMessage('Pet marked as found!');
    }

    await supabase.from('pets').update({ status: newStatus }).eq('id', petId);
    loadUserPets();
    renderMyPets();
  } catch (error) {
    console.error('Error toggling status:', error);
    alert('Error: ' + error.message);
  }
}

function deletePetConfirm(petId) {
  if (!confirm('Delete this pet permanently? This cannot be undone.')) return;
  deletePet(petId);
}

// ========================================
// UTILITIES
// ========================================

async function loadSightingNotifications() {
  if (!state.currentUser) return;
  const container = document.getElementById('sightsNotifications');
  const details = document.getElementById('sightsDetails');
  if (!container || !details) return;

  try {
    // get owner's pets ids
    const petIds = (state.userPets || []).map(p => p.id);
    if (petIds.length === 0) { container.style.display = 'none'; return; }

    const { data: sightings, error } = await supabase
      .from('pet_sightings')
      .select('*, pets(id, name)')
      .in('pet_id', petIds)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    if (!sightings || sightings.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    details.innerHTML = sightings.map(s => `
      <div class="sight-item">
        <p><strong>Pet:</strong> ${s.pets?.name || s.pet_id}</p>
        <p><strong>Reporter:</strong> ${s.reporter_name} (${s.reporter_phone})</p>
        <p><strong>When:</strong> ${s.sighting_date} ${s.sighting_time || ''}</p>
        <p><strong>Location:</strong> ${s.sighting_location || 'Unknown'}</p>
        ${s.notes ? `<p><strong>Notes:</strong> ${s.notes}</p>` : ''}
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load sightings', e);
  }
}

function showMessage(msg) {
  let div = document.getElementById('app-message');
  if (!div) {
    div = document.createElement('div');
    div.id = 'app-message';
    div.style.cssText = `
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
    document.body.appendChild(div);
  }

  div.textContent = msg;
  div.style.display = 'block';
  setTimeout(() => { div.style.display = 'none'; }, 5000);
}

async function handleEmailConfirmation() {
  const hash = window.location.hash;
  if (!hash.includes('access_token')) return;

  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (accessToken) {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (!error) {
        state.currentUser = data.user;
        updateUI();
        window.location.hash = '';
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  state.currentUser = session?.user || null;
  updateUI();
});

function handlePetLink() {
  const params = new URLSearchParams(window.location.search);
  const petId = params.get('pet');
  if (!petId) return;

  // Show pet profile page
  displayQRPetProfile(petId);
}

async function displayQRPetProfile(petId) {
  try {
    const { data: pet, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .single();

    if (error || !pet) {
      alert('Pet not found');
      return;
    }

    // Create a full-page pet profile view
    const profileHTML = `
      <div style="min-height: 100vh; background: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px; text-align: center;">
            <h1 style="color: #0f8f3d; font-size: 32px; margin-bottom: 10px;">${pet.name}</h1>
            <p style="color: #6b7280; font-size: 16px; margin-bottom: 30px;">Pet Profile</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: left; margin-bottom: 20px;">
              <p style="margin: 12px 0;"><strong>Type:</strong> ${pet.species}</p>
              <p style="margin: 12px 0;"><strong>Breed:</strong> ${pet.breed || 'Not specified'}</p>
              <p style="margin: 12px 0;"><strong>Color:</strong> ${pet.color || 'Not specified'}</p>
              <p style="margin: 12px 0;"><strong>Age:</strong> ${pet.age || 'Not specified'}</p>
              <p style="margin: 12px 0;"><strong>Weight:</strong> ${pet.weight || 'Not specified'}</p>
              ${pet.microchip_id ? `<p style="margin: 12px 0;"><strong>Microchip ID:</strong> ${pet.microchip_id}</p>` : ''}
              ${pet.description ? `<p style="margin: 12px 0;"><strong>Description:</strong> ${pet.description}</p>` : ''}
            </div>
            
            <div style="background: ${pet.status === 'lost' ? '#fee2e2' : '#f0fdf4'}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; font-weight: 600; color: ${pet.status === 'lost' ? '#dc2626' : '#10b981'};">
                Status: ${pet.status === 'lost' ? 'MISSING' : 'SAFE'}
              </p>
            </div>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #0f8f3d; margin-bottom: 20px;">
              <h3 style="margin: 0 0 12px 0; color: #0f8f3d;">Found this pet?</h3>
              <p style="margin: 0 0 16px 0; color: #2c3e50; font-size: 14px;">
                If you found this pet, please contact the owner immediately.
              </p>
              <button onclick="contactWhatsApp('${pet.owner_phone}')" style="background: #25d366; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-right: 10px;">
                WhatsApp Owner
              </button>
              <button onclick="callOwner('${pet.owner_phone}')" style="background: #0f8f3d; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                Call Owner
              </button>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Powered by PetFinder</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.innerHTML = profileHTML;
    document.title = `${pet.name} - PetFinder`;
  } catch (error) {
    console.error('Error displaying pet profile:', error);
    alert('Error loading pet profile');
  }
}
