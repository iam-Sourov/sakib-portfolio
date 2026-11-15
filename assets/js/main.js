/* ============================================================
   Portfolio interactions — vanilla JS, no dependencies
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Stagger delays for reveals ---------- */
  $$("[data-reveal][data-delay]").forEach(function (el) {
    el.style.setProperty("--d", el.getAttribute("data-delay"));
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Header state + scroll progress ---------- */
  var header = $("#siteHeader");
  var progress = $("#scrollProgress");
  var toTop = $("#toTop");
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (progress) progress.style.width = (height > 0 ? (y / height) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("is-visible", y > 600);

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = $("#navToggle");
  var nav = $("#primaryNav");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    $$(".nav a", nav).forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------- Active nav link while scrolling ---------- */
  var sections = $$("main section[id]");
  var navLinks = $$(".nav-link");

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Rotating hero headline ---------- */
  var words = $$(".rotator-word");
  if (words.length > 1 && !reduceMotion) {
    var index = 0;
    setInterval(function () {
      words[index].classList.remove("is-active");
      words[index].classList.add("is-leaving");

      var leaving = words[index];
      setTimeout(function () { leaving.classList.remove("is-leaving"); }, 800);

      index = (index + 1) % words.length;
      words[index].classList.add("is-active");
    }, 3200);
  }

  /* ---------- Cursor glow (fine pointers only) ---------- */
  var glow = $("#cursorGlow");
  if (glow && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    var cx = gx, cy = gy;

    document.addEventListener("mousemove", function (e) {
      gx = e.clientX;
      gy = e.clientY;
      document.body.classList.add("has-cursor");
    });

    (function loop() {
      cx += (gx - cx) * 0.09;
      cy += (gy - cy) * 0.09;
      glow.style.transform = "translate(" + cx + "px, " + cy + "px) translate(-50%, -50%)";
      window.requestAnimationFrame(loop);
    })();
  }

  /* ---------- Card tilt ---------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    $$("[data-tilt]").forEach(function (card) {
      var max = card.classList.contains("visual-card") ? 9 : 4;

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * max) + "deg) rotateY(" + (px * max) + "deg) translateZ(0)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    $$(".btn-magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
        var dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
        btn.style.transform = "translate(" + dx * 7 + "px, " + dy * 6 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Contact form (mailto handoff, no backend needed) ---------- */
  var form = $("#contactForm");
  var note = $("#formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      $$(".field", form).forEach(function (f) { f.classList.remove("has-error"); });
      note.classList.remove("is-error", "is-success");

      var f = form.elements;
      var name = f.name.value.trim();
      var email = f.email.value.trim();
      var subject = f.subject.value;
      var message = f.message.value.trim();
      var valid = true;

      if (!name) { markError(f.name); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { markError(f.email); valid = false; }
      if (!message) { markError(f.message); valid = false; }

      if (!valid) {
        note.textContent = "Please complete the highlighted fields.";
        note.classList.add("is-error");
        return;
      }

      var body = "Name: " + name + "\nEmail: " + email + "\nService: " + subject + "\n\n" + message;
      var href =
        "mailto:mdkalamsakib@gmail.com?subject=" +
        encodeURIComponent("Project enquiry — " + subject) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = href;
      note.textContent = "Opening your email app… if nothing happens, write to mdkalamsakib@gmail.com.";
      note.classList.add("is-success");
    });

    function markError(input) {
      var field = input.closest(".field");
      if (field) field.classList.add("has-error");
      input.focus();
    }

    $$("input, textarea", form).forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });
  }

  /* ---------- Project category filter ---------- */
  var filterBtns = $$(".filter-btn");
  var miniCards = $$(".mini-project");
  var filterNote = $("#filterNote");
  var filterLabels = {
    all: "Showing all " + miniCards.length + " projects.",
    wordpress: "Showing WordPress development projects.",
    ecommerce: "Showing e-commerce development projects.",
    seo: "Showing SEO optimization projects."
  };

  if (filterBtns.length && miniCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        filterBtns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });

        miniCards.forEach(function (card) {
          var show = filter === "all" || card.getAttribute("data-cat") === filter;
          card.classList.toggle("is-hidden", !show);
          if (show) card.classList.add("is-in");
        });

        if (filterNote) filterNote.textContent = filterLabels[filter] || "";
      });
    });
  }

  /* ---------- Footer year ---------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
