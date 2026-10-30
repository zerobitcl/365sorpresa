/**
 * 365sorpresa — vanilla JS
 * Menú móvil, reveal on scroll, tracking WhatsApp / llamada
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 919px)").matches) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    }
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function trackEvent(name, label) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, {
        event_category: "conversion",
        event_label: label || name,
      });
    }
  }

  document.querySelectorAll("[data-track='whatsapp']").forEach(function (el) {
    el.addEventListener("click", function () {
      trackEvent("whatsapp_click", el.getAttribute("data-label") || el.textContent.trim());
    });
  });

  document.querySelectorAll("[data-track='call']").forEach(function (el) {
    el.addEventListener("click", function () {
      trackEvent("phone_click", el.getAttribute("data-label") || "call");
    });
  });

  if (header) {
    var onScroll = function () {
      header.style.boxShadow =
        window.scrollY > 12 ? "0 8px 24px rgba(30,23,20,0.08)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
