function scrollToPortfolio() {
  var target = document.getElementById("portfolio");
  if (!target) return;

  var smoothAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: smoothAllowed ? "smooth" : "auto" });
}

var projectModal = document.getElementById("projectModal");
var projectCards = document.querySelectorAll(".projects .card");
var modalType = document.getElementById("projectModalType");
var modalTitle = document.getElementById("projectModalTitle");
var modalSummary = document.getElementById("projectModalSummary");
var modalGallery = document.getElementById("projectModalGallery");
var modalHighlights = document.getElementById("projectModalHighlights");
var modalStack = document.getElementById("projectModalStack");
var modalRole = document.getElementById("projectModalRole");
var modalOutcome = document.getElementById("projectModalOutcome");
var imageLightbox = document.getElementById("imageLightbox");
var imageLightboxPreview = document.getElementById("imageLightboxPreview");
var lastActiveElement = null;
var lastLightboxTrigger = null;

function openImageLightbox(src, altText, triggerEl) {
  if (!imageLightbox || !imageLightboxPreview) return;

  imageLightboxPreview.src = src;
  imageLightboxPreview.alt = altText || "Expanded project preview";
  lastLightboxTrigger = triggerEl || null;
  imageLightbox.hidden = false;

  var closeButton = imageLightbox.querySelector(".image-lightbox__close");
  if (closeButton) closeButton.focus();
}

function closeImageLightbox() {
  if (!imageLightbox || imageLightbox.hidden) return;

  imageLightbox.hidden = true;
  if (imageLightboxPreview) {
    imageLightboxPreview.src = "";
  }

  if (lastLightboxTrigger && typeof lastLightboxTrigger.focus === "function") {
    lastLightboxTrigger.focus();
  }
}

function getCardSummary(card) {
  if (card.dataset.projectSummary) return card.dataset.projectSummary;
  var paragraphs = card.querySelectorAll("p:not(.placeholder-tag)");
  return paragraphs.length > 0 ? paragraphs[0].textContent.trim() : "Add your project summary here.";
}

function getCardType(card) {
  var container = card.closest(".projects");
  if (container && container.id === "web") return "Web Development Project";
  return "Project";
}

function buildProjectData(card) {
  var titleNode = card.querySelector("h3");
  var captionNode = card.querySelector("figcaption");
  var title = card.dataset.projectTitle || (titleNode ? titleNode.textContent.trim() : captionNode ? captionNode.textContent.trim() : "Project");
  var summary = getCardSummary(card);
  var highlightsRaw = card.dataset.highlights || "";
  var mediaImagesRaw = card.dataset.mediaImages || "";
  var highlights = highlightsRaw
    .split("|")
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean);
  var mediaImages = mediaImagesRaw
    .split("|")
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean);

  if (highlights.length === 0) {
    highlights = [
      "Add 2-3 highlights that explain your implementation choices.",
      "Include one concrete technical challenge you solved."
    ];
  }

  return {
    type: card.dataset.projectType || getCardType(card),
    title: title,
    summary: summary,
    highlights: highlights,
    mediaImages: mediaImages,
    stack: card.dataset.stack || "Add stack details (e.g., WordPress, Unity, C#).",
    role: card.dataset.role || "Add your role for this project.",
    outcome: card.dataset.outcome || "Add the result or impact of this project."
  };
}

function openProjectModal(card) {
  if (!projectModal) return;

  var data = buildProjectData(card);
  modalType.textContent = data.type;
  modalTitle.textContent = data.title;
  modalSummary.textContent = data.summary;
  modalStack.textContent = data.stack;
  modalRole.textContent = data.role;
  modalOutcome.textContent = data.outcome;

  if (modalGallery) {
    modalGallery.innerHTML = "";
    data.mediaImages.forEach(function (src) {
      var image = document.createElement("img");
      image.src = src;
      image.alt = data.title + " screenshot";
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
      image.setAttribute("aria-label", "Preview " + data.title + " image");
      modalGallery.appendChild(image);
    });
  }

  modalHighlights.innerHTML = "";
  data.highlights.forEach(function (item) {
    var li = document.createElement("li");
    li.textContent = item;
    modalHighlights.appendChild(li);
  });

  lastActiveElement = document.activeElement;
  projectModal.hidden = false;
  document.body.classList.add("modal-open");

  var closeButton = projectModal.querySelector(".project-modal__close");
  if (closeButton) closeButton.focus();
}

function closeProjectModal() {
  if (!projectModal || projectModal.hidden) return;

  projectModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastActiveElement && typeof lastActiveElement.focus === "function") {
    lastActiveElement.focus();
  }
}

projectCards.forEach(function (card) {
  card.classList.add("project-card");
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-haspopup", "dialog");

  card.addEventListener("click", function () {
    openProjectModal(card);
  });

  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(card);
    }
  });
});

if (projectModal) {
  projectModal.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-close-modal")) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (imageLightbox && !imageLightbox.hidden) {
        closeImageLightbox();
        return;
      }
      closeProjectModal();
    }
  });
}

if (modalGallery) {
  modalGallery.addEventListener("click", function (event) {
    var target = event.target;
    if (target && target.tagName === "IMG") {
      openImageLightbox(target.src, target.alt, target);
    }
  });

  modalGallery.addEventListener("keydown", function (event) {
    var target = event.target;
    if (target && target.tagName === "IMG" && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openImageLightbox(target.src, target.alt, target);
    }
  });
}

if (imageLightbox) {
  imageLightbox.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-close-lightbox")) {
      closeImageLightbox();
    }
  });
}

var toggle = document.getElementById("themeToggle");
if (toggle) {
  toggle.addEventListener("click", function () {
    document.body.classList.toggle("light");
    toggle.innerHTML = document.body.classList.contains("light") ? "&#9728;" : "&#127769;";
  });
}

var hamburger = document.getElementById("hamburger");
var navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  function toggleMenu() {
    navLinks.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", navLinks.classList.contains("active") ? "true" : "false");
  }

  hamburger.addEventListener("click", toggleMenu);
  hamburger.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

var progressBar = document.getElementById("scrollProgress");
if (progressBar) {
  window.addEventListener("scroll", function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  });
}

var sections = document.querySelectorAll(".section");
if ("IntersectionObserver" in window) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

var canvas = document.getElementById("particles");
if (canvas) {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");

  if (ctx && !reducedMotion) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var particles = [];
    var rafId = null;

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
    }

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    };

    Particle.prototype.draw = function () {
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    };

    function initParticles() {
      particles = [];
      for (var i = 0; i < 80; i += 1) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (particle) {
        particle.update();
        particle.draw();
      });
      rafId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener("resize", function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && rafId === null) {
        animateParticles();
      }
    });
  }
}
