/**
 * Fluid Tech Pune — products.js
 * Vanilla JavaScript: Filter, Search, Modal, Sidebar Toggle, View Toggle
 */

document.addEventListener("DOMContentLoaded", () => {
  'use strict';

  /* ─────────────────────────────────────────
     1. DOM Elements
  ───────────────────────────────────────── */
  const sidebar = document.getElementById('productsSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  
  const categoryNav = document.getElementById('categoryNav');
  const catItems = categoryNav ? categoryNav.querySelectorAll('.cat-item') : [];
  
  const productSearch = document.getElementById('productSearch');
  const searchClear = document.getElementById('searchClear');
  const productsWrap = document.getElementById('productsWrap');
  const resultCount = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');
  const resetSearch = document.getElementById('resetSearch');
  
  const viewBtns = document.querySelectorAll('.view-btn');
  const productsContent = document.querySelector('.products-content');
  
  const detailsModal = document.getElementById("detailsModal");
  const modalCloseBtn = document.getElementById("detailsModalClose");
  const detailTitle = document.getElementById("detailTitle");
  const detailPrice = document.getElementById("detailPrice");
  const detailSpecs = document.getElementById("detailSpecs");
  const detailDesc = document.getElementById("detailDesc");
  const detailMainImage = document.getElementById("detailMainImage");
  const detailThumbList = document.getElementById("detailThumbList");
  const detailWhatsappBtn = document.getElementById("detailWhatsappBtn");
  const detailCatTag = document.getElementById("detailCatTag");

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const header = document.getElementById('siteHeader');

  let currentCat = 'all';
  let currentSearch = '';
  const waNumber = '918047824275'; // तुमचा WhatsApp नंबर

  /* ─────────────────────────────────────────
     2. Initial GSAP Animations
  ───────────────────────────────────────── */
  if (typeof gsap !== 'undefined') {
    gsap.from(".gs-reveal", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
  }

  /* ─────────────────────────────────────────
     3. Navbar / Mobile Menu & Header Scroll
  ───────────────────────────────────────── */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  window.addEventListener('scroll', () => {
    if (header) {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 30px rgba(0,0,0,.4)'
        : '0 2px 20px rgba(0,0,0,.3)';
    }
  }, { passive: true });

  /* ─────────────────────────────────────────
     4. Mobile Sidebar Toggle
  ───────────────────────────────────────── */
  function openSidebar() {
    if(sidebar) sidebar.classList.add('open');
    if(sidebarOverlay) sidebarOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    if(sidebar) sidebar.classList.remove('open');
    if(sidebarOverlay) sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose)  sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  /* ─────────────────────────────────────────
     5. Category Filter Logic
  ───────────────────────────────────────── */
  catItems.forEach(item => {
    const btn = item.querySelector('button');
    if(btn) {
      btn.addEventListener('click', () => {
        // Remove active class from all
        catItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked
        item.classList.add('active');
        
        currentCat = item.getAttribute('data-cat');
        applyFilters();
        
        // Auto-close sidebar on mobile after clicking
        if (window.innerWidth < 900) closeSidebar();
      });
    }
  });

  /* ─────────────────────────────────────────
     6. Search Logic
  ───────────────────────────────────────── */
  if (productSearch) {
    productSearch.addEventListener('input', () => {
      currentSearch = productSearch.value.trim().toLowerCase();
      if(searchClear) searchClear.style.display = currentSearch ? 'block' : 'none';
      applyFilters();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      productSearch.value = '';
      currentSearch = '';
      searchClear.style.display = 'none';
      applyFilters();
      productSearch.focus();
    });
  }

  if (resetSearch) {
    resetSearch.addEventListener('click', () => {
      productSearch.value = '';
      currentSearch = '';
      if(searchClear) searchClear.style.display = 'none';
      
      currentCat = 'all';
      catItems.forEach(i => i.classList.remove('active'));
      if(catItems[0]) catItems[0].classList.add('active');
      
      applyFilters();
    });
  }

  /* ─────────────────────────────────────────
     7. Core Filtering Function
  ───────────────────────────────────────── */
  function applyFilters() {
    if(!productsWrap) return;
    
    const allCards    = productsWrap.querySelectorAll('.product-card');
    const allSections = productsWrap.querySelectorAll('.product-category-section');
    let visibleCount  = 0;

    allCards.forEach(card => {
      const cardCat   = card.getAttribute('data-cat');
      const cardName  = card.getAttribute('data-name').toLowerCase();
      
      const catMatch  = (currentCat === 'all' || cardCat === currentCat);
      const searchMatch = (currentSearch === '' || cardName.includes(currentSearch));

      if (catMatch && searchMatch) {
        card.classList.remove('hidden');
        // Simple re-trigger animation for visual feedback
        card.style.animation = 'none';
        card.offsetHeight; // trigger reflow
        card.style.animation = '';
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Hide empty section headers
    allSections.forEach(section => {
      const sectionCat   = section.getAttribute('data-cat');
      const catOk        = (currentCat === 'all' || sectionCat === currentCat);
      const sectionCards = section.querySelectorAll('.product-card:not(.hidden)');
      
      if (!catOk || sectionCards.length === 0) {
        section.classList.add('all-hidden');
      } else {
        section.classList.remove('all-hidden');
      }
    });

    // Update Result Count Text
    if (resultCount) {
      resultCount.innerHTML = `Showing <strong>${visibleCount}</strong> product${visibleCount !== 1 ? 's' : ''}`;
    }

    // Show/Hide "No Results" message
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  /* ─────────────────────────────────────────
     8. Grid / List View Toggle
  ───────────────────────────────────────── */
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const view = btn.getAttribute('data-view');
      if (productsContent) {
        if (view === 'list') {
          productsContent.classList.add('list-view');
        } else {
          productsContent.classList.remove('list-view');
        }
      }
      
      try { localStorage.setItem('ft-view', view); } catch (e) {}
    });
  });

  // Restore view preference on load
  try {
    const savedView = localStorage.getItem('ft-view');
    if (savedView) {
      viewBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-view') === savedView);
      });
      if (productsContent) {
        if (savedView === 'list') {
          productsContent.classList.add('list-view');
        } else {
          productsContent.classList.remove('list-view');
        }
      }
    }
  } catch (e) {}

  /* ─────────────────────────────────────────
     9. Glassmorphism Product Modal Logic
  ───────────────────────────────────────── */
  function openProductDetails(card) {
    if(!detailsModal) return;

    // 1. Get basic data from the card
    const title = card.getAttribute("data-name");
    const catTag = card.querySelector(".card-cat-tag") ? card.querySelector(".card-cat-tag").textContent : "Product";
    
    // 2. Locate hidden template
    const template = card.querySelector(".product-data");
    if(!template) {
      console.error("Template not found for product:", title);
      return; 
    }

    // 3. Extract data from template (Using .content to access DocumentFragment)
    const priceNode = template.content.querySelector("div[data-price]");
    const price = priceNode ? priceNode.getAttribute("data-price") : "Ask for Price";

    const descNode = template.content.querySelector("div[data-desc]");
    const desc = descNode ? descNode.getAttribute("data-desc") : "";

    const images = Array.from(template.content.querySelectorAll(".data-images img")).map(img => img.src);
    
    const specsNode = template.content.querySelector(".data-specs");
    const specsHTML = specsNode ? specsNode.innerHTML : "";

    // 4. Populate Modal UI
    if(detailTitle) detailTitle.textContent = title;
    if(detailCatTag) detailCatTag.textContent = catTag;
    if(detailPrice) detailPrice.textContent = price;
    if(detailDesc) detailDesc.textContent = desc;
    if(detailSpecs) detailSpecs.innerHTML = specsHTML;
    
    // WhatsApp Link Generation
    if(detailWhatsappBtn) {
      const waMsg = encodeURIComponent(`Hi, I am interested in getting more details and the latest price for ${title}.`);
      detailWhatsappBtn.href = `https://wa.me/${waNumber}?text=${waMsg}`;
    }

    // 5. Populate Image Gallery
    if(detailThumbList) detailThumbList.innerHTML = '';
    
    if(images.length > 0 && detailMainImage) {
      detailMainImage.src = images[0];
      detailMainImage.style.display = 'block';
      
      images.forEach((src, idx) => {
        const thumb = document.createElement("img");
        thumb.src = src;
        thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
        thumb.onclick = () => {
           // Remove active from all thumbs
           document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
           thumb.classList.add('active');
           
           // Crossfade animation using GSAP
           if(typeof gsap !== 'undefined') {
             gsap.fromTo(detailMainImage, {opacity: 0.3}, {opacity: 1, duration: 0.3});
           }
           detailMainImage.src = src;
        };
        if(detailThumbList) detailThumbList.appendChild(thumb);
      });
    } else if(detailMainImage) {
       // Hide main image area if no images exist
       detailMainImage.style.display = 'none';
    }

    // 6. Open Modal with GSAP Animation
    detailsModal.classList.add("active");
    document.body.style.overflow = "hidden"; // Lock background scroll
    
    if(typeof gsap !== 'undefined') {
      gsap.fromTo(".modal-glass", 
        { scale: 0.9, opacity: 0, y: 30 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }
      );
    }
  }

  function closeProductDetails() {
    if(!detailsModal) return;

    if(typeof gsap !== 'undefined') {
      gsap.to(".modal-glass", {
        scale: 0.95, opacity: 0, y: 20, duration: 0.3, ease: "power2.in",
        onComplete: () => {
          detailsModal.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    } else {
      detailsModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Event Delegation for "View Details" or "Enquire" buttons
  document.addEventListener("click", (e) => {
    const triggerBtn = e.target.closest(".details-trigger-btn, .enquiry-btn");
    if (triggerBtn) {
      e.preventDefault();
      const card = triggerBtn.closest(".product-card");
      if (card) {
        // If the click is inside a card, open the new Modal
        openProductDetails(card);
      }
    }
  });

  // Modal Close Events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeProductDetails);
  }
  
  if (detailsModal) {
    detailsModal.addEventListener("click", (e) => {
      // Close if clicking outside the modal box
      if (e.target === detailsModal) closeProductDetails();
    });
  }

  // Escape key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && detailsModal && detailsModal.classList.contains("active")) {
      closeProductDetails();
    }
  });

  /* ─────────────────────────────────────────
     10. Run Filters on First Load
  ───────────────────────────────────────── */
  // This will check if a category is pre-selected in HTML (e.g. class="active")
  const activeCatItem = document.querySelector('.cat-item.active');
  if(activeCatItem) {
    currentCat = activeCatItem.getAttribute('data-cat');
  }
  applyFilters();

});