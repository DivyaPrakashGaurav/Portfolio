lucide.createIcons();
import './style.css'
import * as THREE from 'three'

// -------------------------------------------------------------
// 1. Initialize Global UI
// -------------------------------------------------------------
lucide.createIcons();
document.getElementById('year').textContent = new Date().getFullYear();

// Color Switcher Logic
const colorToggle = document.querySelector('.switcher-toggle');
const colorOptions = document.querySelector('.color-options');
const colorBtns = document.querySelectorAll('.color-btn');
const htmlEl = document.documentElement;

// Function to get current theme color hex
function getThemeColor(theme) {
  if (theme === 'cyan') return 0x00e5ff;
  if (theme === 'cream') return 0xf5e6d3;
  if (theme === 'green') return 0x4ade80;
  return 0xd4af37; // default gold
}

colorToggle.addEventListener('click', () => {
  colorOptions.classList.toggle('show');
});

colorBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const theme = e.target.getAttribute('data-theme');
    htmlEl.setAttribute('data-theme', theme);

    // Update active button state
    colorBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    // Close switcher
    colorOptions.classList.remove('show');

    // Update Three.js materials color
    const newColorHex = getThemeColor(theme);
    if (particleMaterial) particleMaterial.color.setHex(newColorHex);
    if (lineMaterial) lineMaterial.color.setHex(newColorHex);
  });
});

// Typing Animation
const typingText = document.querySelector('.typing-text');
const phrases = ["I am a B.Tech Student.", "I am a Creative Developer.", "Welcome to my space.", "I am a Software Developer."];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500; // Pause before new word
  }

  setTimeout(typeEffect, typeSpeed);
}
typeEffect();

// Scroll Effects
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Intersection Observer for Entrance Animations
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
  observer.observe(element);
});

// Form Submission handling
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = 'Message Sent!';
    btn.style.backgroundColor = '#4ade80';
    btn.style.color = '#12141d';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
      btn.style.color = '';
    }, 3000);
  }, 1500);
});

// -------------------------------------------------------------
// 2. GitHub REST API Integration
// -------------------------------------------------------------
const GITHUB_USERNAME = 'DivyaPrakashGaurav'; // INSERT_GITHUB_USERNAME

async function fetchGitHubRepos() {
  const container = document.getElementById('github-repos');
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if (!response.ok) throw new Error('Failed to fetch repositories');

    const repos = await response.json();
    container.innerHTML = '';

    if (repos.length === 0) {
      container.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No public repositories found.</p>';
      return;
    }

    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'project-card fade-in';
      const langColor = getLanguageColor(repo.language);

      card.innerHTML = `
        <div class="project-title">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <i data-lucide="external-link" style="width: 20px; height: 20px; color: var(--accent-primary);"></i>
        </div>
        <p class="project-desc">${repo.description || 'No description provided.'}</p>
        <div class="project-footer">
          <div class="project-lang">
            <span class="lang-dot" style="background-color: ${langColor}"></span>
            ${repo.language || 'Unknown'}
          </div>
          <div class="project-stats">
            <div class="stat" title="Stars">
              <i data-lucide="star" style="width: 14px; height: 14px;"></i> ${repo.stargazers_count}
            </div>
            <div class="stat" title="Forks">
              <i data-lucide="git-fork" style="width: 14px; height: 14px;"></i> ${repo.forks_count}
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
      observer.observe(card);
    });
    lucide.createIcons();

  } catch (error) {
    console.error('GitHub API Error:', error);
    container.innerHTML = `<p style="color: #ef4444; grid-column: 1/-1;">Error loading repositories. Please try again later.</p>`;
  }
}

function getLanguageColor(language) {
  const colors = {
    'JavaScript': '#f1e05a', 'HTML': '#e34c26', 'CSS': '#563d7c',
    'Python': '#3572A5', 'TypeScript': '#3178c6', 'Vue': '#41b883',
    'Java': '#b07219', 'C++': '#f34b7d', 'C#': '#178600', 'PHP': '#4F5D95'
  };
  return colors[language] || 'var(--accent-primary)';
}

fetchGitHubRepos();


// -------------------------------------------------------------
// 3. Three.js - Tech Constellation / Data Orb (Strictly Bounded)
// -------------------------------------------------------------
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
// Camera positioned to view orb
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 18; // Pulled back slightly for better framing

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

// Create the Data Orb Group to manage all elements together
const orbGroup = new THREE.Group();
scene.add(orbGroup);

const particleCount = 200;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const originalPositions = new Float32Array(particleCount * 3);
const particlePhases = new Float32Array(particleCount); // For subtle pulsing/distortion

// Spherical distribution for the orb
const radius = 6.5;
for (let i = 0; i < particleCount; i++) {
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos((Math.random() * 2) - 1);
  const r = radius + (Math.random() - 0.5) * 1.5; // slight variance

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);

  particlePositions[i * 3] = x;
  particlePositions[i * 3 + 1] = y;
  particlePositions[i * 3 + 2] = z;

  originalPositions[i * 3] = x;
  originalPositions[i * 3 + 1] = y;
  originalPositions[i * 3 + 2] = z;

  particlePhases[i] = Math.random() * Math.PI * 2;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

// Default gold color
let particleMaterial = new THREE.PointsMaterial({
  color: 0xd4af37,
  size: 0.12,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
orbGroup.add(particles);

// Setup Line Segments for Connections
const lineGeometry = new THREE.BufferGeometry();
// Max lines = N * (N-1) / 2. We'll allocate a large enough buffer.
const maxLines = 1500;
const linePositions = new Float32Array(maxLines * 6); // 2 vertices per line, 3 coords per vertex
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
lineGeometry.setDrawRange(0, 0);

let lineMaterial = new THREE.LineBasicMaterial({
  color: 0xd4af37,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending
});
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
orbGroup.add(lines);

// Interactivity
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  // 1. Orb Self-Rotation
  orbGroup.rotation.y += 0.001;
  orbGroup.rotation.x += 0.0005;

  // 2. Mouse Interaction (Strictly Bounded)
  // Max deviation of the group center is clamped to avoid going off-screen
  targetX = mouseX * 0.003;
  targetY = mouseY * 0.003;

  // Clamp boundaries to ensure it never drifts off screen
  const maxDeviationX = 2.5;
  const maxDeviationY = 1.5;
  targetX = Math.max(-maxDeviationX, Math.min(maxDeviationX, targetX));
  targetY = Math.max(-maxDeviationY, Math.min(maxDeviationY, targetY));

  orbGroup.position.x += (targetX - orbGroup.position.x) * 0.05;
  orbGroup.position.y += (-targetY - orbGroup.position.y) * 0.05;

  // 3. Subtle Distortion / Pulsating of points
  const positions = particleGeometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const ox = originalPositions[i * 3];
    const oy = originalPositions[i * 3 + 1];
    const oz = originalPositions[i * 3 + 2];

    // Create a pulsating noise effect
    const noise = Math.sin(time * 0.5 + particlePhases[i]) * 0.2;

    // Normalize vector to push outwards/inwards
    const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
    const nx = ox / dist;
    const ny = oy / dist;
    const nz = oz / dist;

    positions[i * 3] = ox + nx * noise;
    positions[i * 3 + 1] = oy + ny * noise;
    positions[i * 3 + 2] = oz + nz * noise;
  }
  particleGeometry.attributes.position.needsUpdate = true;

  // 4. Calculate Connections (Lines)
  let vertexIndex = 0;
  let numConnected = 0;

  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const distSq = dx * dx + dy * dy + dz * dz;

      // Connect if within threshold distance
      if (distSq < 10) {
        if (numConnected < maxLines) {
          linePositions[vertexIndex++] = positions[i * 3];
          linePositions[vertexIndex++] = positions[i * 3 + 1];
          linePositions[vertexIndex++] = positions[i * 3 + 2];

          linePositions[vertexIndex++] = positions[j * 3];
          linePositions[vertexIndex++] = positions[j * 3 + 1];
          linePositions[vertexIndex++] = positions[j * 3 + 2];

          numConnected++;
        }
      }
    }
  }
  lineGeometry.setDrawRange(0, numConnected * 2);
  lineGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
