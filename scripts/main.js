/*   JavaScript Document

Tooplate 2146 Nexus Brew

https://www.tooplate.com/view/2146-nexus-brew

*/

const canvas = document.getElementById('tech-canvas');

if (canvas) {
   const ctx = canvas.getContext('2d');
   const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\[]{}();:+-*/%#@&';
   let columns = 0;
   let drops = [];

   function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      columns = Math.max(28, Math.floor(window.innerWidth / 16));
      drops = Array.from({ length: columns }, () => Math.random() * -140);
   }

   function drawCodeRain() {
      ctx.fillStyle = 'rgba(2, 11, 20, 0.24)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = '16px "Share Tech Mono", monospace';

      for (let i = 0; i < drops.length; i++) {
         const text = chars[Math.floor(Math.random() * chars.length)];
         const x = i * 16;
         const y = drops[i] * 16;
         const hue = Math.random() > 0.65 ? 195 : 170;

         ctx.fillStyle = `hsla(${hue}, 100%, 72%, 0.75)`;
         ctx.fillText(text, x, y);

         if (y > window.innerHeight && Math.random() > 0.97) {
            drops[i] = 0;
         }

         drops[i] += 0.9;
      }
   }

   resizeCanvas();
   setInterval(drawCodeRain, 45);
   window.addEventListener('resize', resizeCanvas);
}

function toggleMenu() {
   const menuToggle = document.querySelector('.menu-toggle');
   const navLinks = document.querySelector('.nav-links');

   if (menuToggle && navLinks) {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
   }
}

document.querySelectorAll('.nav-link').forEach(link => {
   link.addEventListener('click', () => {
      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');

      if (menuToggle && navLinks) {
         menuToggle.classList.remove('active');
         navLinks.classList.remove('active');
      }
   });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
         target.scrollIntoView({ behavior: 'smooth' });
      }
   });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
   let current = '';
   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 200) {
         current = section.getAttribute('id');
      }
   });

   navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
         link.classList.add('active');
      }
   });

   const scrolled = window.pageYOffset;
   const hero = document.querySelector('.hero-title');
   if (hero) hero.style.transform = `translateY(${scrolled * 0.12}px)`;
});

function showTab(tabName) {
   const tabs = document.querySelectorAll('.tab-content');
   const buttons = document.querySelectorAll('.tab-button');
   const clickedButton = event.target;

   tabs.forEach(tab => tab.classList.remove('active'));
   buttons.forEach(button => button.classList.remove('active'));

   const targetTab = document.getElementById(tabName);
   if (targetTab) targetTab.classList.add('active');
   if (clickedButton) clickedButton.classList.add('active');
}

document.querySelectorAll('.menu-list li').forEach(item => {
   item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const link = item.querySelector('a');

      if (link) {
         link.style.background = `linear-gradient(90deg, rgba(103, 232, 249, 0.08) 0%, rgba(168, 85, 247, 0.08) ${Math.min((x / rect.width) * 100, 100)}%, transparent 100%)`;
      }
   });

   item.addEventListener('mouseleave', () => {
      const link = item.querySelector('a');
      if (link) link.style.background = 'transparent';
   });
});

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
   });
}, observerOptions);

document.querySelectorAll('section, .specialty-card, .menu-category, .about-content').forEach(el => {
   el.classList.add('fade-in');
   observer.observe(el);
});

const statsObserver = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         const statNumber = entry.target.querySelector('.stat-number');
         if (!statNumber) return;

         const finalValue = statNumber.textContent.trim();
         if (finalValue.includes('.')) {
            animateDecimal(statNumber, parseFloat(finalValue));
         } else if (finalValue.includes('+')) {
            animateInteger(statNumber, parseInt(finalValue, 10));
         }

         statsObserver.unobserve(entry.target);
      }
   });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
   statsObserver.observe(stat);
});

function animateDecimal(element, target) {
   let current = 0;
   const increment = target / 50;
   const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
         element.textContent = target.toFixed(2);
         clearInterval(timer);
      } else {
         element.textContent = current.toFixed(2);
      }
   }, 20);
}

function animateInteger(element, target) {
   let current = 0;
   const increment = Math.ceil(target / 30);
   const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
         element.textContent = target + '+';
         clearInterval(timer);
      } else {
         element.textContent = current + '+';
      }
   }, 30);
}

document.addEventListener('DOMContentLoaded', () => {
   const modal = document.getElementById('image-modal');
   const modalImg = document.getElementById('image-modal-img');
   const closeBtn = document.querySelector('.image-modal-close');

   if (!modal || !modalImg || !closeBtn) return;

   const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modalImg.src = '';
      document.body.style.overflow = '';
   };

   document.querySelectorAll('.cert-card .cert-thumb img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
         modalImg.src = img.src;
         modalImg.alt = img.alt || 'Certification full view';
         modal.classList.add('open');
         modal.setAttribute('aria-hidden', 'false');
         document.body.style.overflow = 'hidden';
      });
   });

   closeBtn.addEventListener('click', closeModal);
   modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
   });
   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
   });
});