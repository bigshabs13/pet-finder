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
}

function setupEventListeners() {
  const signupBtn = document.getElementById('signupBtn');
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  const closeLoginBtn = document.getElementById('closeLoginBtn');
  const closeSignupBtn = document.getElementById('closeSignupBtn');

  signupBtn?.addEventListener('click', () => dom.signupModal?.classList.add('active'));
  learnMoreBtn?.addEventListener('click', showLearnMoreInfo);
  document.getElementById('loginBtn')?.addEventListener('click', () => dom.loginModal?.classList.add('active'));
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
    const petUrl = `${window.location.origin}/?pet=${pet.id}`;
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
    document.getElementById('scanner')?.appendChild(resultDiv);
  }

  resultDiv.innerHTML = `
    <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h3 style="color: #0f8f3d;">Pet Found!</h3>
      <h4>${pet.name}</h4>
      <p><strong>Type:</strong> ${pet.species}</p>
      <p><strong>Breed:</strong> ${pet.breed || 'Not specified'}</p>
      <p><strong>Email:</strong> ${pet.users?.email || 'Not available'}</p>
      <button class="btn btn-primary" onclick="contactOwner('${pet.users?.email}', '${pet.name}')">Send Email</button>
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

function initChatbot() {
  document.getElementById('send-message')?.addEventListener('click', sendMessage);
  document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });
  addBotMessage("Hello! I'm your Pet-Finder assistant. How can I help?");
}

function sendMessage(predefined) {
  const input = document.getElementById('chat-input');
  const msg = predefined || input.value.trim();
  if (!msg) return;

  addUserMessage(msg);
  if (!predefined) input.value = '';

  setTimeout(() => generateBotResponse(msg), 800);
}

function addUserMessage(msg) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'user-message';
  div.innerHTML = `<div class="message-avatar">User</div><div class="message-content"><p>${msg}</p></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addBotMessage(msg) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'bot-message';
  div.innerHTML = `<div class="message-avatar">Bot</div><div class="message-content">${msg}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function generateBotResponse(userMsg) {
  const lower = userMsg.toLowerCase();
  let response = 'I can help with adding pets, QR codes, reporting lost pets, or scanning.';

  if (lower.includes('add') || lower.includes('register')) {
    response = '<p>To add a pet:</p><ul><li>Go to Add Pet section</li><li>Fill pet info</li><li>Generate QR code</li></ul>';
  } else if (lower.includes('lost') || lower.includes('missing')) {
    response = '<p>If pet is lost:</p><ul><li>Share QR on social media</li><li>Post flyers</li><li>Contact shelters</li></ul>';
  } else if (lower.includes('qr') || lower.includes('code')) {
    response = '<p>Each pet gets a unique QR code. Attach to collar and print on flyers.</p>';
  } else if (lower.includes('scanner')) {
    response = '<p>Use scanner to scan QR codes and view pet info.</p>';
  }

  addBotMessage(response);
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
    alert('You must be logged in');
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

function reportSighting(petId) {
  const name = prompt('Your name:');
  if (!name) return;
  const phone = prompt('Your phone:');
  if (!phone) return;
  const notes = prompt('Details:');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { error } = await supabase.from('pet_sightings').insert([{
          pet_id: petId,
          reporter_name: name,
          reporter_phone: phone,
          sighting_location: 'User Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          sighting_date: new Date().toISOString().split('T')[0],
          sighting_time: new Date().toTimeString().split(' ')[0],
          notes: notes || ''
        }]);

        if (error) throw error;
        showMessage('Sighting reported!');
        loadMissingPetsOnMap();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    },
    () => alert('GPS required')
  );
}

function callOwner(phone) {
  window.open(`tel:${phone}`);
}

// ========================================
// DASHBOARD
// ========================================

function initDashboard() {
  document.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      showSection(e.target.dataset.section);
    });
  });

  showSection('overview-section');
  initQuickActions();
  initAddPetForm();
  initReportMissing();

  if (document.getElementById('scanner-section')) initScanner();
  if (document.getElementById('chat-section')) initChatbot();

  setTimeout(() => initMap(), 500);

  loadUserPets();
  loadActiveMissingPets();
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
// UTILITIES
// ========================================

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
