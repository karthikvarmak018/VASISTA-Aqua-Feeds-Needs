/**
 * VASISTA AQUA FEEDS & NEEDS - AQUACULTURE MOLASSES CONTROLLER
 * Order processing with Cash on Delivery & UPI, package selection, and WhatsApp integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initOrderForm();
  initScrollTop();
});

/* -------------------------------------------------------------------------- */
/* 1. NAVBAR & HEADER CONTROLS                                                */
/* -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Active section spy
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 2. NUMBER COUNTERS                                                         */
/* -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0;
      
      let count = 0;
      const speed = 35;
      const increment = target / speed;

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = prefix + (isDecimal ? count.toFixed(1) : Math.ceil(count)) + suffix;
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
        }
      };

      updateCount();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* -------------------------------------------------------------------------- */
/* 3. PACKAGE SELECTION HELPER                                                */
/* -------------------------------------------------------------------------- */
window.selectPackageAndOrder = function(packageName) {
  const pkgDropdown = document.getElementById('order-package');
  const orderSection = document.getElementById('order');

  if (pkgDropdown) {
    for (let i = 0; i < pkgDropdown.options.length; i++) {
      if (pkgDropdown.options[i].value.includes(packageName) || packageName.includes(pkgDropdown.options[i].value)) {
        pkgDropdown.selectedIndex = i;
        break;
      }
    }
  }

  if (orderSection) {
    orderSection.scrollIntoView({ behavior: 'smooth' });
    const nameInput = document.getElementById('order-name');
    if (nameInput) setTimeout(() => nameInput.focus(), 600);
  }
};

/* -------------------------------------------------------------------------- */
/* 4. MOLASSES ORDER FORM (CASH ON DELIVERY & UPI)                            */
/* -------------------------------------------------------------------------- */
function initOrderForm() {
  const form = document.getElementById('molasses-order-form');
  const alertBox = document.getElementById('order-alert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const pkg = document.getElementById('order-package').value;
      const qty = document.getElementById('order-qty').value;
      const name = document.getElementById('order-name').value;
      const phone = document.getElementById('order-phone').value;
      const address = document.getElementById('order-address').value;
      
      const paymentMethodRadio = document.querySelector('input[name="payment_method"]:checked');
      const paymentMethod = paymentMethodRadio ? paymentMethodRadio.value : 'Cash on Delivery (COD)';

      // Format WhatsApp order text for Madhu Varma
      const waText = `*New Aquaculture Molasses Order - Vasista Aqua*%0A` +
        `----------------------------------------%0A` +
        `*Package:* ${pkg}%0A` +
        `*Quantity:* ${qty}%0A` +
        `*Farmer / Client:* ${name}%0A` +
        `*Contact Phone:* ${phone}%0A` +
        `*Delivery Address:* ${address}%0A` +
        `*Payment Method:* ${paymentMethod}%0A` +
        `----------------------------------------%0A` +
        `Please confirm delivery timeline and total invoice.`;

      const waUrl = `https://wa.me/918686586777?text=${waText}`;

      // Display clean confirmation message
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `
          <div style="padding: 1.2rem; background: rgba(0, 212, 200, 0.15); border: 1px solid var(--aqua-accent); border-radius: 10px; color: #fff; margin-bottom: 1.5rem;">
            <h4 style="color: var(--aqua-accent); font-size: 1.1rem; margin-bottom: 0.4rem;">
              <i class="fa-solid fa-circle-check"></i> Order Details Prepared!
            </h4>
            <p style="font-size: 0.92rem; color: #cbd5e1; margin-bottom: 0.6rem;">
              <strong>Summary:</strong> ${qty} x ${pkg} for <strong>${name}</strong> (${paymentMethod})
            </p>
            ${paymentMethod.includes('UPI') ? `
              <div style="padding: 0.8rem; background: rgba(7, 17, 30, 0.8); border: 1px solid var(--gold-border); border-radius: 8px; margin-bottom: 0.8rem; font-size: 0.88rem;">
                <strong style="color: var(--gold-light);">UPI Payment Details:</strong><br>
                UPI Number / ID: <span style="color: #fff; font-family: monospace;">8686586777</span> (Madhu Varma)<br>
                Accepts: Google Pay, PhonePe, Paytm, BHIM
              </div>
            ` : `
              <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.8rem;">
                Cash on Delivery selected. You will pay directly upon doorstep delivery at your pond.
              </p>
            `}
            <a href="${waUrl}" target="_blank" class="btn btn-primary" style="width: 100%; text-align: center;">
              <i class="fa-brands fa-whatsapp"></i> Send Order to Madhu Varma (+91 86865 86777)
            </a>
          </div>
        `;

        // Automatically open WhatsApp in new tab
        window.open(waUrl, '_blank');
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 5. SCROLL TO TOP                                                           */
/* -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
