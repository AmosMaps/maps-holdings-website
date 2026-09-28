document.addEventListener("DOMContentLoaded", function () {
  applyAvailability();
  setupMobileNav();
  setupFooterYear();
  setupHeroSlideshow();
  setupCarousels();
  setupScrollReveal();
  setupBookingForm();
  setupTiltCards();
  setupLaundryColumnAlign();
  setupServiceDropdown();
});

function setupServiceDropdown() {
  const wrapper = document.querySelector("[data-multiselect]");
  if (!wrapper) return;

  const toggle = wrapper.querySelector("[data-multiselect-toggle]");
  const panel = wrapper.querySelector("[data-multiselect-panel]");
  const label = wrapper.querySelector("[data-multiselect-label]");
  const checkboxes = wrapper.querySelectorAll('input[type="checkbox"]');

  function updateLabel() {
    const selected = Array.from(checkboxes)
      .filter(function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });

    if (selected.length === 0) {
      label.textContent = "Select services";
      toggle.classList.remove("has-value");
    } else {
      label.textContent = selected.join(", ");
      toggle.classList.add("has-value");
    }
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = !panel.hidden;
    if (isOpen) {
      closePanel();
    } else {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", function (e) {
    if (!wrapper.contains(e.target)) closePanel();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });

  checkboxes.forEach(function (cb) {
    cb.addEventListener("change", updateLabel);
  });

  updateLabel();
}

function setupLaundryColumnAlign() {
  const layout = document.querySelector(".laundromat-layout");
  const media = document.querySelector(".laundromat-media");
  if (!layout || !media) return;

  const leftColumn = layout.firstElementChild;

  function align() {
    if (window.innerWidth <= 820) {
      media.style.height = "";
      return;
    }
    media.style.height = leftColumn.offsetHeight + "px";
  }

  align();
  window.addEventListener("resize", align);
  window.addEventListener("load", align);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(align);
  }
}

function setupTiltCards() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canHover || reduceMotion) return;

  const maxTilt = 7;
  const cards = document.querySelectorAll(".room-card, .business-card, .location-card");

  cards.forEach(function (card) {
    card.style.transformStyle = "preserve-3d";

    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;
      const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * maxTilt;
      card.style.transform =
        "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" +
        rotateY.toFixed(2) + "deg) translateY(-6px)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });
}

function setupHeroSlideshow() {
  const bg = document.querySelector("[data-hero-bg]");
  if (!bg) return;
  const slides = bg.querySelectorAll(".hero-bg-slide");
  if (slides.length < 2) return;

  let index = 0;
  setInterval(function () {
    slides[index].classList.remove("hero-bg-slide--active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("hero-bg-slide--active");
  }, 5000);
}

function setupCarousels() {
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dotsWrap = carousel.querySelector(".carousel-dots");
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;

    const dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot" + (i === 0 ? " carousel-dot--active" : "");
        dot.setAttribute("aria-label", "Show photo " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
          restart();
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function goTo(i) {
      slides[index].classList.remove("carousel-slide--active");
      if (dots[index]) dots[index].classList.remove("carousel-dot--active");
      index = i;
      slides[index].classList.add("carousel-slide--active");
      if (dots[index]) dots[index].classList.add("carousel-dot--active");
    }

    function next() {
      goTo((index + 1) % slides.length);
    }

    function start() {
      timer = setInterval(next, 4000);
    }

    function restart() {
      clearInterval(timer);
      start();
    }

    start();
    carousel.addEventListener("mouseenter", function () { clearInterval(timer); });
    carousel.addEventListener("mouseleave", start);
  });
}

function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("reveal--visible"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (el) { observer.observe(el); });
}

function applyAvailability() {
  const cards = document.querySelectorAll("[data-room-key]");
  let anyAvailable = false;

  cards.forEach(function (card) {
    const key = card.getAttribute("data-room-key");
    const info = typeof roomAvailability !== "undefined" && roomAvailability[key];
    const badge = card.querySelector("[data-availability-badge]");
    if (!info || !badge) return;

    const count = info.available;

    if (count > 0) {
      anyAvailable = true;
      badge.textContent = count === 1 ? "1 Room Available" : count + " Rooms Available";
      badge.classList.add("badge-available");
      badge.classList.remove("badge-full");
      card.classList.remove("room-card--full");
    } else {
      badge.textContent = "Fully Booked";
      badge.classList.add("badge-full");
      badge.classList.remove("badge-available");
      card.classList.add("room-card--full");
    }
  });

  const banner = document.querySelector("[data-availability-banner]");
  if (banner) {
    banner.textContent = anyAvailable
      ? "Rooms available now — enquire today!"
      : "Currently fully booked — join our waiting list.";
    banner.classList.toggle("banner-available", anyAvailable);
    banner.classList.toggle("banner-full", !anyAvailable);
  }
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("nav-menu--open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("nav-menu--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupFooterYear() {
  const el = document.querySelector("[data-year-range]");
  if (!el) return;
  const founded = 2017;
  const current = new Date().getFullYear();
  el.textContent = current > founded ? founded + "–" + current : String(founded);
}

function setupBookingForm() {
  const form = document.getElementById("laundryBookingForm");
  if (!form) return;

  const dateInput = form.querySelector('input[name="date"]');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split("T")[0];
  }

  const serviceError = form.querySelector("[data-service-error]");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const services = Array.from(form.querySelectorAll('input[name="service"]:checked')).map(
      function (el) { return el.value; }
    );

    if (services.length === 0) {
      if (serviceError) serviceError.hidden = false;
      return;
    }
    if (serviceError) serviceError.hidden = true;

    const data = new FormData(form);

    const lines = [
      "Hi Maps Laundromat, I'd like to book a laundry appointment.",
      "Name: " + data.get("name"),
      "Phone: " + data.get("phone"),
      "Service: " + services.join(", "),
      "Method: " + data.get("method"),
      "Date: " + data.get("date"),
      "Time: " + data.get("time")
    ];

    const address = data.get("address");
    if (address) lines.push("Address: " + address);

    const notes = data.get("notes");
    if (notes) lines.push("Notes: " + notes);

    const message = encodeURIComponent(lines.join("\n"));
    window.open("https://wa.me/27828492746?text=" + message, "_blank");
  });
}
