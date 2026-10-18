(function () {
  const root = document.documentElement;
  root.classList.add("js");

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Theme toggle: flips between light and dark and remembers the choice
  const isDark = () =>
    root.dataset.theme === "dark" ||
    (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked */ }
  });

  // Mobile menu
  const menuBtn = document.getElementById("menu-btn");
  const links = document.getElementById("nav-links");
  const closeMenu = () => {
    links.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };
  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  // Nav border once the page scrolls
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal sections and highlight the current nav link
  const reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -60px 0px" });
  reveals.forEach((el) => revealObserver.observe(el));

  const navLinks = links.querySelectorAll("a");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));
})();
