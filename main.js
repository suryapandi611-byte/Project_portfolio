/* Portfolio interactions: typing effect, scroll effects, project filter/modal, theme toggle, form validation */
(function () {
  "use strict";

  /* ---------- Project data (edit this to add your own projects) ---------- */
  const projects = [
    { title: "photoshop", type: "fullstack", icon: "bi-kanban", color: "linear-gradient(135deg,#6c63ff,#00d4ff)",
      desc: "It is my photoshop design and this is a creative things and creative thoughts",
      tags: ["adobe photoshop"], code: "https://github.com/", live: "https://lnkd.in/p/dwRu9XQR" },
    { title: "userinterface", type: "fullstack", icon: "bi-bag-check", color: "linear-gradient(135deg,#ff6b6b,#feca57)",
      desc: "E-commerce store with product search, cart, Stripe checkout and an admin dashboard.",
      tags: ["figma"], code: "https://github.com/", live: "https://lnkd.in/p/d4N-7_ri" },
    { title: "illustrate", type: "frontend", icon: "bi-cloud-sun", color: "linear-gradient(135deg,#1dd1a1,#54a0ff)",
      desc: "illustrate project creative thoughts and creative mind",
      tags: ["adobe illustrate with new version"], code: "https://github.com/", live: "https://lnkd.in/p/dBRsYU9T" },
    { title: "premiur pro", type: "backend", icon: "bi-journal-code", color: "linear-gradient(135deg,#a29bfe,#fd79a8)",
      desc: "used by  adobe premium pro editing ",
      tags: ["premium pro"], code: "https://github.com/", live: "https://lnkd.in/p/dKfnjEH2" },
    { title: "user experience", type: "frontend", icon: "bi-layout-text-window", color: "linear-gradient(135deg,#00b894,#55efc4)",
      desc: "user experience contain user freely and smooth used by our demo",
      tags: ["figma"], code: "https://github.com/", live: "#" },
    { title: "git hub", type: "fullstack", icon: "bi-chat-dots", color: "linear-gradient(135deg,#0984e3,#6c5ce7)",
      desc: "Real-time group chat with rooms, typing indicators and message history stored in a database.",
      tags: ["WebSockets", "Node.js", "MySQL", "JavaScript"], code: "https://github.com/", live: "#" }
  ];

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Typing effect ---------- */
  const words = ["modern web apps.", "REST APIs.", "responsive interfaces.", "scalable back ends."];
  const typedEl = $("#typed");
  let w = 0, c = 0, deleting = false;
  function type() {
    const word = words[w];
    typedEl.textContent = word.slice(0, c);
    if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1400); }
    if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
    c += deleting ? -1 : 1;
    setTimeout(type, deleting ? 40 : 80);
  }
  type();

  /* ---------- Render projects ---------- */
  const grid = $("#projectGrid");
  grid.innerHTML = projects.map((p, i) => `
    <div class="col-md-6 col-lg-4 project-item" data-type="${p.type}">
      <article class="project-card" data-index="${i}" tabindex="0" role="button" aria-label="Open ${p.title} details">
        <div class="project-thumb" style="background:${p.color}"><i class="bi ${p.icon}"></i></div>
        <div class="project-body">
          <h3 class="h5">${p.title}</h3>
          <p class="text-secondary small">${p.desc}</p>
          <div class="d-flex flex-wrap gap-1">${p.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      </article>
    </div>`).join("");

  /* ---------- Project filter ---------- */
  $("#filters").addEventListener("click", e => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    $$("#filters .btn").forEach(b => { b.classList.remove("active", "btn-primary"); b.classList.add("btn-outline-primary"); });
    btn.classList.add("active", "btn-primary");
    btn.classList.remove("btn-outline-primary");
    const f = btn.dataset.filter;
    $$(".project-item").forEach(item => item.classList.toggle("hide", f !== "all" && item.dataset.type !== f));
  });

  /* ---------- Project modal ---------- */
  const modal = new bootstrap.Modal($("#projectModal"));
  function openProject(card) {
    const p = projects[card.dataset.index];
    $("#modalTitle").textContent = p.title;
    $("#modalDesc").textContent = p.desc;
    $("#modalTags").innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join("");
    $("#modalCode").href = p.code;
    $("#modalLive").href = p.live;
    modal.show();
  }
  grid.addEventListener("click", e => { const card = e.target.closest(".project-card"); if (card) openProject(card); });
  grid.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".project-card");
    if (card) { e.preventDefault(); openProject(card); }
  });

  /* ---------- Navbar, back-to-top, scroll spy ---------- */
  const nav = $("#mainNav"), toTop = $("#toTop");
  const sections = $$("section[id], header[id]");
  const links = $$("#navMenu .nav-link");
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    toTop.style.display = y > 500 ? "block" : "none";
    let current = "home";
    sections.forEach(s => { if (y >= s.offsetTop - 120) current = s.id; });
    links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Close mobile menu after clicking a link
  links.forEach(l => l.addEventListener("click", () => {
    const menu = $("#navMenu");
    if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));

  /* ---------- Reveal, skill bars, counters ---------- */
  function animateCounter(el) {
    const target = +el.dataset.target;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const t = setInterval(() => {
      n = Math.min(target, n + step);
      el.textContent = n + "+";
      if (n >= target) clearInterval(t);
    }, 35);
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      $$(".skill", el).forEach(s => { $(".progress-bar", s).style.width = s.dataset.level + "%"; });
      $$(".counter", el).forEach(animateCounter);
      io.unobserve(el);
    });
  }, { threshold: 0.2 });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- Theme toggle (remembered) ---------- */
  const root = document.documentElement, themeBtn = $("#themeToggle");
  function setTheme(t) {
    root.setAttribute("data-bs-theme", t);
    themeBtn.innerHTML = t === "dark" ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    themeBtn.classList.toggle("btn-outline-light", t === "dark");
    themeBtn.classList.toggle("btn-outline-dark", t === "light");
    try { localStorage.setItem("theme", t); } catch (e) { /* storage unavailable */ }
  }
  let saved = "dark";
  try { saved = localStorage.getItem("theme") || "dark"; } catch (e) { /* ignore */ }
  setTheme(saved);
  themeBtn.addEventListener("click", () => setTheme(root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark"));

  /* ---------- Contact form ---------- */
  const form = $("#contactForm"), alertBox = $("#formAlert");
  form.addEventListener("submit", e => {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    // Front-end only demo. To make it "full stack", POST this data to your own API, e.g.:
    // fetch("/api/contact", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data) })
    const data = { name: $("#name").value, email: $("#email").value, subject: $("#subject").value, message: $("#message").value };
    alertBox.textContent = "Thanks " + data.name.split(" ")[0] + "! Your message has been received. I'll get back to you soon.";
    alertBox.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");
    setTimeout(() => alertBox.classList.add("d-none"), 6000);
  });

  $("#year").textContent = new Date().getFullYear();
})();
