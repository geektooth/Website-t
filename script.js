// Dark mode toggle functionality
function setupDarkMode() {
  // Create the toggle button
  const toggle = document.createElement('button');
  toggle.id = 'dark-mode-toggle';
  toggle.innerHTML = '<i class="bx bx-moon"></i>';
  toggle.setAttribute('aria-label', 'Toggle dark mode');
  toggle.title = 'Toggle dark mode';

  // Add the button to the page
  document.body.appendChild(toggle);

  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggle.innerHTML = '<i class="bx bx-sun"></i>';
  }

  // Toggle functionality
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Update the icon
    if (document.body.classList.contains('dark-mode')) {
      toggle.innerHTML = '<i class="bx bx-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      toggle.innerHTML = '<i class="bx bx-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
  });
}

function setupScrollAnimations() {
  const sections = document.querySelectorAll('.section');
  const timelineItems = document.querySelectorAll('.timeline-item'); // NEW: Timeline animations

  sections.forEach(section => {
    section.classList.add('fade-in-section');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Specific class for timeline items to trigger their CSS transforms
        if (entry.target.classList.contains('timeline-item')) {
          entry.target.classList.add('in-view');
        }
      }
    });
  }, {
    threshold: 0.15
  });

  sections.forEach(section => {
    observer.observe(section);
  });

  timelineItems.forEach(item => {
    observer.observe(item);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDarkMode();
  setupScrollAnimations();
  setupNetworkBackground();
  setupTiltCards();
  setupGlitchText();
  setupRadarChart(); // NEW: Initialize Chart.js
  setupTerminal(); // NEW: Initialize Terminal
  setupDashboardPolish(); // NEW: Custom Cursor & Scroll Progress
});

function setupNetworkBackground() {
  const canvas = document.getElementById('network-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];

  // Interaction distance for drawing connections
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resizeCanvas);

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1; // Faster moving molecules
      this.vy = (Math.random() - 0.5) * 1;
      this.radius = Math.random() * 2 + 1; // Small dots
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#38bdf8' : '#0284c7';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    // Adjust density based on screen size
    const numParticles = Math.floor((width * height) / 10000);
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Check distance between particles to draw connecting lines
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          // Fade line based on distance
          const opacity = 1 - (dist / 100);
          ctx.strokeStyle = document.body.classList.contains('dark-mode') ? `rgba(56, 189, 248, ${opacity * 0.5})` : `rgba(2, 132, 199, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Check distance to mouse to draw interaction lines
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          ctx.beginPath();
          const opacity = 1 - (dist / mouse.radius);
          ctx.strokeStyle = document.body.classList.contains('dark-mode') ? `rgba(56, 189, 248, ${opacity * 0.8})` : `rgba(2, 132, 199, ${opacity * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  resizeCanvas();
  animate();
}

function setupTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

function setupGlitchText() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  const elements = document.querySelectorAll('.glitch-hover');

  elements.forEach(el => {
    let interval = null;
    const iconHTML = el.querySelector('i') ? el.querySelector('i').outerHTML + ' ' : '';

    el.addEventListener('mouseover', event => {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        el.innerHTML = iconHTML + event.target.dataset.value.split("")
          .map((letter, index) => {
            if (index < iteration) {
              return event.target.dataset.value[index];
            }
            // Preserve spaces
            if (event.target.dataset.value[index] === ' ') return ' ';
            return letters[Math.floor(Math.random() * 43)];
          })
          .join("");

        if (iteration >= event.target.dataset.value.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    });
  });
}

function setupRadarChart() {
  const ctx = document.getElementById('skillsRadarChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const isDarkMode = document.body.classList.contains('dark-mode');
  const textColor = isDarkMode ? '#f1f5f9' : '#0f172a';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const accentColor = '#0284c7'; // Vibrant Data Blue
  const accentLight = 'rgba(2, 132, 199, 0.2)';

  const data = {
    labels: [
      'Python',
      'SQL / Databases',
      'Machine Learning',
      'Data Visualization',
      'Financial Modeling',
      'Analytics & BI'
    ],
    datasets: [{
      label: 'Proficiency Level',
      data: [90, 85, 80, 85, 75, 80],
      backgroundColor: accentLight,
      borderColor: accentColor,
      pointBackgroundColor: accentColor,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: accentColor,
      borderWidth: 2,
    }]
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: {
            color: textColor,
            font: { family: "'Roboto Mono', monospace", size: window.innerWidth < 600 ? 10 : 13 }
          },
          ticks: {
            display: false, // Hide the numerical tick marks for a cleaner look
            min: 0,
            max: 100
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDarkMode ? '#1e293b' : '#fff',
          titleColor: isDarkMode ? '#f1f5f9' : '#0f172a',
          bodyColor: isDarkMode ? '#cbd5e1' : '#475569',
          bodyFont: { family: "'Roboto Mono', monospace" },
          titleFont: { family: "'Outfit', sans-serif", size: 14 },
          borderColor: accentColor,
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return context.raw + '% Proficiency';
            }
          }
        }
      }
    }
  };

  // Store chart instance to update on theme toggle
  window.skillsChart = new Chart(ctx, config);

  // Re-render chart text colors when dark mode changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const dark = document.body.classList.contains('dark-mode');
        const color = dark ? '#f1f5f9' : '#0f172a';
        const grid = dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const tooltipBg = dark ? '#1e293b' : '#fff';
        const tooltipTitle = dark ? '#f1f5f9' : '#0f172a';
        const tooltipBody = dark ? '#cbd5e1' : '#475569';

        window.skillsChart.options.scales.r.pointLabels.color = color;
        window.skillsChart.options.scales.r.angleLines.color = grid;
        window.skillsChart.options.scales.r.grid.color = grid;
        window.skillsChart.options.plugins.tooltip.backgroundColor = tooltipBg;
        window.skillsChart.options.plugins.tooltip.titleColor = tooltipTitle;
        window.skillsChart.options.plugins.tooltip.bodyColor = tooltipBody;
        window.skillsChart.update();
      }
    });
  });

  observer.observe(document.body, { attributes: true });
}

function setupTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const quickCommands = document.querySelectorAll('.cmd-btn');

  if (!terminalInput || !terminalOutput) return;

  const responses = {
    'help': 'Available commands: \n- whoami \n- skills \n- contact \n- clear',
    'whoami': 'Vedant Ishwar Mohurley. Data Scientist & Information Systems Graduate building intelligent data pipelines and user interfaces.',
    'skills': 'Languages: Python, SQL, R, JavaScript, C.\nFrameworks: TensorFlow, PyTorch, Chart.js, Pandas.\nTools: Tableau, PowerBI, Excel.',
    'contact': 'Email: meetvedantm@gmail.com\nLinkedIn: linkedin.com/in/vedantmohurley\nGitHub: github.com/geektooth',
    'sudo': 'Nice try. This incident will be reported to santa.',
    'ls': 'projects/  skills/  experience/  about.txt'
  };

  function printLine(text, isCommand = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    if (isCommand) {
      line.innerHTML = `<span class="prompt">vedant@portfolio:~$</span> <span class="command-text">${text}</span>`;
    } else {
      // Small delay for realism if it's an output
      line.style.opacity = '0';
      line.innerText = text;
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transition = 'opacity 0.2s';
      }, 50);
    }

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function handleCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();

    if (cleanCmd === '') return;

    printLine(cleanCmd, true);

    if (cleanCmd === 'clear') {
      setTimeout(() => {
        terminalOutput.innerHTML = '';
      }, 100);
      return;
    }

    const response = responses[cleanCmd] || `bash: ${cleanCmd}: command not found`;

    // Slight artificial delay for simulated processing
    setTimeout(() => {
      // Split multi-line responses
      const lines = response.split('\n');
      lines.forEach(l => printLine(l));
    }, 200);
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(terminalInput.value);
      terminalInput.value = '';
    }
  });

  // Focus input when clicking anywhere on the terminal body
  terminalOutput.addEventListener('click', () => {
    terminalInput.focus();
  });

  // Bind quick command buttons
  quickCommands.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      handleCommand(cmd);
      terminalInput.focus();
    });
  });
}

function setupDashboardPolish() {
  /* --- 1. Top Scroll Progress Bar --- */
  const progressBar = document.getElementById('scroll-progress');

  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTotal = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = (scrollTotal / height) * 100;
      progressBar.style.width = `${scrollPosition}%`;
    });
  }

  /* --- 2. Custom Neon Cursor --- */
  const cursorDot = document.querySelector('[data-cursor-dot]');
  const cursorOutline = document.querySelector('[data-cursor-outline]');

  // Only activate if not on a strictly touch-only device (simplistic check)
  if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Animate the outline trailing slightly behind
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    });

    // Expand outline when hovering over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card, input');

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover-active');
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover-active');
      });
    });
  }
}