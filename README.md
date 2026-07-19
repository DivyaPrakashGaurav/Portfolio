# Premium Portfolio Website

A highly interactive, powerful, and visually stunning personal portfolio built for modern creatives and developers. This template features a sleek dark mode, a dynamic 3D background using Three.js, a color switcher, and real-time GitHub integration.

## Features
- **3D Tech Constellation**: An interactive data orb background built with Three.js.
- **Color Switcher**: Toggle between Classic White/Gold, Electric Cyan, and Soft Cream accents.
- **Dynamic Projects**: Auto-syncs with your public GitHub repositories using the GitHub REST API.
- **Custom Projects Section**: Beautifully designed static cards for highlighting your best work.
- **Skills Section**: Glass-morphism inspired grid for displaying your technical skills.
- **Fully Responsive**: Carefully crafted for a seamless experience on both desktop and mobile devices.

## Tech Stack
- **HTML5 & CSS3** (Vanilla)
- **JavaScript** (ES6+)
- **Three.js** (WebGL 3D graphics)
- **Vite** (Next Generation Frontend Tooling)
- **Lucide Icons**

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Running Locally

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173/`).

### Building for Production
To build the site for deployment:
```bash
npm run build
```
The output will be in the `dist` directory, which you can host on platforms like Vercel, Netlify, or GitHub Pages.

---

## Customizing Your Portfolio

### 1. Updating the GitHub Username (Dynamic Projects)
To display your own GitHub repositories in the "My Projects" section:
1. Open `src/main.js`.
2. Locate line 127:
   ```javascript
   const GITHUB_USERNAME = 'INSERT_GITHUB_USERNAME';
   ```
3. Replace `'INSERT_GITHUB_USERNAME'` with your actual GitHub handle (e.g., `'DivyaPrakashGaurav'`).

### 2. Changing the About Section Profile Image
By default, the About section uses a glowing placeholder icon. To replace it with your own image:
1. Add your image file (e.g., `profile.jpg`) to the `public/` directory.
2. Open `index.html`.
3. Locate the `.about-image-placeholder` div (around line 64):
   ```html
   <div class="about-image-placeholder">
     <!-- PLACEHOLDER FOR PROFILE IMAGE -->
     <i data-lucide="user" class="placeholder-icon"></i>
   </div>
   ```
4. Replace the `<i>` icon with an `<img>` tag pointing to your file:
   ```html
   <div class="about-image-placeholder" style="overflow: hidden;">
     <img src="/profile.jpg" alt="Profile Image" style="width: 100%; height: 100%; object-fit: cover;" />
   </div>
   ```

### 3. Editing Custom Featured Projects
The "Featured Projects" section is perfect for highlighting specific projects manually.
1. Open `index.html`.
2. Scroll to the `<!-- Custom Featured Projects Section -->`.
3. Inside `.custom-projects-grid`, you will find multiple `.custom-project-card` divs.
4. To modify a project:
   - **Title**: Edit the `<h3 class="custom-project-title">` text.
   - **Tags**: Edit or add `<span class="tag">` elements inside `.custom-project-tags`.
   - **Description**: Update the text inside `<p class="custom-project-desc">`.
   - **Link**: Change the `href="#"` in the `<a class="btn">` element.
   - **Image**: Similar to the profile image, replace the `<i data-lucide="...">` inside `.project-image-placeholder` with an `<img>` tag if you want a real image thumbnail.
