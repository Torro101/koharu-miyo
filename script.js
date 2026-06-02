const header = document.querySelector(".site-header");
const wideSidebarQuery = window.matchMedia("(min-width: 1180px)");
const sidebarPreferenceKey = "miyo-sidebar-collapsed";

function updateHeader() {
  if (!header) return;
  header.dataset.elevated = String(window.scrollY > 12);
}

function readSidebarPreference() {
  try {
    return window.localStorage.getItem(sidebarPreferenceKey) === "true";
  } catch {
    return false;
  }
}

function writeSidebarPreference(value) {
  try {
    if (value) {
      window.localStorage.setItem(sidebarPreferenceKey, "true");
    } else {
      window.localStorage.removeItem(sidebarPreferenceKey);
    }
  } catch {
    // Some embedded WebViews block storage. The sidebar still works for the session.
  }
}

function getBasePath() {
  const script = document.querySelector('script[src$="script.js"]');
  return script?.getAttribute("src")?.startsWith("../") ? "../" : "";
}

function getCurrentPage() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const segment = path.split("/").pop() || "home";
  return ["features", "downloads", "docs", "credits", "github"].includes(segment) ? segment : "home";
}

function createSidebar() {
  if (!header || document.getElementById("site-sidebar")) return;

  const basePath = getBasePath();
  const currentPage = getCurrentPage();
  const pages = [
    { id: "home", label: "Home", href: basePath || "./", icon: "book" },
    { id: "features", label: "Features", href: `${basePath}features/`, icon: "layers" },
    { id: "downloads", label: "Downloads", href: `${basePath}downloads/`, icon: "download" },
    { id: "docs", label: "Docs", href: `${basePath}docs/`, icon: "code" },
    { id: "credits", label: "Credits", href: `${basePath}credits/`, icon: "branch" },
    { id: "github", label: "GitHub", href: `${basePath}github/`, icon: "github" },
  ];

  const menuButton = document.createElement("button");
  menuButton.className = "menu-button";
  menuButton.type = "button";
  menuButton.setAttribute("aria-controls", "site-sidebar");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = `
    <svg class="icon" aria-hidden="true"><use href="${basePath}assets/icons.svg#menu"></use></svg>
    <span class="sr-only">Toggle site navigation</span>
  `;
  header.insertBefore(menuButton, header.querySelector(".site-nav"));

  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  overlay.hidden = true;

  const sidebar = document.createElement("aside");
  sidebar.className = "site-sidebar";
  sidebar.id = "site-sidebar";
  sidebar.setAttribute("aria-label", "Site navigation");
  sidebar.innerHTML = `
    <div class="sidebar-head">
      <a class="sidebar-brand" href="${basePath || "./"}" aria-label="MIYO home">
        <img src="${basePath}assets/icon.png" alt="" width="34" height="34">
        <span>MIYO</span>
      </a>
      <button class="sidebar-close" type="button">
        <svg class="icon" aria-hidden="true"><use href="${basePath}assets/icons.svg#x"></use></svg>
        <span class="sr-only">Hide navigation</span>
      </button>
    </div>
    <nav class="sidebar-nav" aria-label="Sidebar navigation">
      ${pages.map((page) => `
        <a href="${page.href}" ${page.id === currentPage ? 'aria-current="page"' : ""}>
          <svg class="icon" aria-hidden="true"><use href="${basePath}assets/icons.svg#${page.icon}"></use></svg>
          <span>${page.label}</span>
        </a>
      `).join("")}
    </nav>
    <a class="sidebar-download" href="https://github.com/Torro101/MIYO/releases/download/v0.0.5/Miyo-v0.0.5-release.apk">
      <svg class="icon" aria-hidden="true"><use href="${basePath}assets/icons.svg#download"></use></svg>
      Download APK v0.0.5
    </a>
    <p class="sidebar-note">The website is project-only. MIYO does not host manga or third-party catalogs here.</p>
  `;

  document.body.prepend(overlay);
  document.body.prepend(sidebar);
  document.body.classList.add("sidebar-supported");

  const closeButton = sidebar.querySelector(".sidebar-close");

  function setSidebarOpen(open, persistWidePreference = false) {
    const isWide = wideSidebarQuery.matches;
    document.body.classList.toggle("sidebar-open", open);
    document.body.classList.toggle("sidebar-wide-open", isWide && open);
    menuButton.setAttribute("aria-expanded", String(open));
    overlay.hidden = !open || isWide;

    if (persistWidePreference && isWide) {
      writeSidebarPreference(!open);
    }
  }

  function syncSidebarWithViewport() {
    const shouldOpen = wideSidebarQuery.matches && !readSidebarPreference();
    setSidebarOpen(shouldOpen, false);
  }

  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("sidebar-open");
    setSidebarOpen(!isOpen, wideSidebarQuery.matches);
  });

  closeButton?.addEventListener("click", () => {
    setSidebarOpen(false, wideSidebarQuery.matches);
  });

  overlay.addEventListener("click", () => setSidebarOpen(false, false));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("sidebar-open")) {
      setSidebarOpen(false, wideSidebarQuery.matches);
    }
  });

  if (typeof wideSidebarQuery.addEventListener === "function") {
    wideSidebarQuery.addEventListener("change", syncSidebarWithViewport);
  } else if (typeof wideSidebarQuery.addListener === "function") {
    wideSidebarQuery.addListener(syncSidebarWithViewport);
  }
  syncSidebarWithViewport();
}

createSidebar();
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
