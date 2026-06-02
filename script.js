(function () {
  var header = document.querySelector(".site-header");
  var wideSidebarQuery = window.matchMedia ? window.matchMedia("(min-width: 1180px)") : { matches: false };
  var sidebarPreferenceKey = "miyo-sidebar-collapsed";
  var themePreferenceKey = "miyo-site-theme";

  var navPages = [
    { id: "home", label: "Home", href: "", icon: "book" },
    { id: "features", label: "Features", href: "features/", icon: "layers" },
    { id: "downloads", label: "Downloads", href: "downloads/", icon: "download" },
    { id: "docs", label: "Docs", href: "docs/", icon: "code" },
    { id: "credits", label: "Credits", href: "credits/", icon: "branch" },
    { id: "github", label: "GitHub", href: "github/", icon: "github" },
  ];

  function forEachNode(nodes, callback) {
    Array.prototype.forEach.call(nodes, callback);
  }

  function updateHeader() {
    if (!header) return;
    header.setAttribute("data-elevated", String(window.scrollY > 12));
  }

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function safeStorageRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      return;
    }
  }

  function getBasePath() {
    var script = document.querySelector('script[src$="script.js"]');
    var src = script ? script.getAttribute("src") || "" : "";
    return src.indexOf("../") === 0 ? "../" : "";
  }

  function getCurrentPage() {
    var path = window.location.pathname.replace(/\/+$/, "");
    var parts = path.split("/");
    var segment = parts[parts.length - 1] || "home";
    for (var i = 0; i < navPages.length; i += 1) {
      if (navPages[i].id === segment) return segment;
    }
    return "home";
  }

  function iconUse(basePath, name) {
    return '<svg class="icon" aria-hidden="true"><use href="' + basePath + "assets/icons.svg#" + name + '"></use></svg>';
  }

  function applyTheme(theme) {
    var nextTheme = theme === "light" ? "light" : "dark";
    var basePath = getBasePath();
    var label = nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    var icon = nextTheme === "dark" ? "sun" : "moon";
    document.documentElement.setAttribute("data-theme", nextTheme);
    forEachNode(document.querySelectorAll(".theme-button"), function (button) {
      button.setAttribute("aria-label", label);
      button.innerHTML = iconUse(basePath, icon) + '<span class="sr-only">' + label + "</span>";
    });
  }

  function initTheme() {
    var saved = safeStorageGet(themePreferenceKey);
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
  }

  function createThemeButton() {
    if (!header || header.querySelector(".theme-button")) return;
    var button = document.createElement("button");
    button.className = "theme-button";
    button.type = "button";
    button.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      safeStorageSet(themePreferenceKey, next);
      applyTheme(next);
    });
    header.appendChild(button);
  }

  function readSidebarPreference() {
    return safeStorageGet(sidebarPreferenceKey) === "true";
  }

  function writeSidebarPreference(value) {
    if (value) {
      safeStorageSet(sidebarPreferenceKey, "true");
    } else {
      safeStorageRemove(sidebarPreferenceKey);
    }
  }

  function createSidebar() {
    if (!header || document.getElementById("site-sidebar")) return;

    var basePath = getBasePath();
    var currentPage = getCurrentPage();
    var primaryNav = header.querySelector(".site-nav");

    if (primaryNav) {
      forEachNode(primaryNav.querySelectorAll("a"), function (link) {
        var href = link.getAttribute("href") || "";
        var target = href.replace("../", "").replace("/", "") || "home";
        if (target === currentPage) link.setAttribute("aria-current", "page");
      });
    }

    var menuButton = document.createElement("button");
    menuButton.className = "menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-controls", "site-sidebar");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = iconUse(basePath, "menu") + '<span class="sr-only">Toggle site navigation</span>';
    header.appendChild(menuButton);

    var overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    overlay.hidden = true;

    var sidebar = document.createElement("aside");
    sidebar.className = "site-sidebar";
    sidebar.id = "site-sidebar";
    sidebar.setAttribute("aria-label", "Site navigation");

    var navHtml = "";
    for (var i = 0; i < navPages.length; i += 1) {
      var page = navPages[i];
      var href = page.id === "home" ? basePath || "./" : basePath + page.href;
      navHtml += '<a href="' + href + '"' + (page.id === currentPage ? ' aria-current="page"' : "") + ">";
      navHtml += iconUse(basePath, page.icon) + "<span>" + page.label + "</span></a>";
    }

    sidebar.innerHTML =
      '<div class="sidebar-head">' +
      '<a class="sidebar-brand" href="' + (basePath || "./") + '" aria-label="MIYO home">' +
      '<img src="' + basePath + 'assets/icon.png" alt="" width="34" height="34"><span>MIYO</span></a>' +
      '<button class="sidebar-close" type="button">' + iconUse(basePath, "x") + '<span class="sr-only">Hide navigation</span></button>' +
      "</div>" +
      '<nav class="sidebar-nav" aria-label="Sidebar navigation">' + navHtml + "</nav>" +
      '<a class="sidebar-download" href="https://github.com/Torro101/MIYO/releases/download/v0.0.5/Miyo-v0.0.5-release.apk">' +
      iconUse(basePath, "download") + "Download APK v0.0.5</a>" +
      '<p class="sidebar-note">Project site only. No manga, mirrors, or source catalogs are hosted here.</p>';

    document.body.insertBefore(overlay, document.body.firstChild);
    document.body.insertBefore(sidebar, document.body.firstChild);
    document.body.classList.add("sidebar-supported");

    var closeButton = sidebar.querySelector(".sidebar-close");

    function setSidebarOpen(open, persistWidePreference) {
      var isWide = !!wideSidebarQuery.matches;
      document.body.classList.toggle("sidebar-open", open);
      document.body.classList.toggle("sidebar-wide-open", isWide && open);
      menuButton.setAttribute("aria-expanded", String(open));
      overlay.hidden = !open || isWide;

      if (persistWidePreference && isWide) {
        writeSidebarPreference(!open);
      }
    }

    function syncSidebarWithViewport() {
      setSidebarOpen(!!wideSidebarQuery.matches && !readSidebarPreference(), false);
    }

    menuButton.addEventListener("click", function () {
      var isOpen = document.body.classList.contains("sidebar-open");
      setSidebarOpen(!isOpen, !!wideSidebarQuery.matches);
    });

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        setSidebarOpen(false, !!wideSidebarQuery.matches);
      });
    }

    overlay.addEventListener("click", function () {
      setSidebarOpen(false, false);
    });

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("sidebar-open")) {
        setSidebarOpen(false, !!wideSidebarQuery.matches);
      }
    });

    if (typeof wideSidebarQuery.addEventListener === "function") {
      wideSidebarQuery.addEventListener("change", syncSidebarWithViewport);
    } else if (typeof wideSidebarQuery.addListener === "function") {
      wideSidebarQuery.addListener(syncSidebarWithViewport);
    }
    syncSidebarWithViewport();
  }

  function initCarousels() {
    forEachNode(document.querySelectorAll(".app-gallery"), function (gallery, index) {
      if (gallery.getAttribute("data-carousel-ready") === "true") return;
      gallery.setAttribute("data-carousel-ready", "true");

      var basePath = getBasePath();
      var shell = document.createElement("div");
      shell.className = "carousel-shell";
      gallery.parentNode.insertBefore(shell, gallery);
      shell.appendChild(gallery);

      var toolbar = document.createElement("div");
      toolbar.className = "carousel-toolbar";
      toolbar.innerHTML =
        '<button class="carousel-button" type="button" aria-label="Previous screenshots" data-carousel-prev="' + index + '">' +
        iconUse(basePath, "chevron-left") + "</button>" +
        '<button class="carousel-button" type="button" aria-label="Next screenshots" data-carousel-next="' + index + '">' +
        iconUse(basePath, "chevron-right") + "</button>";
      shell.insertBefore(toolbar, gallery);

      function scrollByPage(direction) {
        var amount = Math.round(gallery.clientWidth * 0.82) * direction;
        if (gallery.scrollBy) {
          try {
            gallery.scrollBy({ left: amount, behavior: "smooth" });
          } catch (error) {
            gallery.scrollLeft += amount;
          }
        } else {
          gallery.scrollLeft += amount;
        }
      }

      var prev = toolbar.querySelector("[data-carousel-prev]");
      var next = toolbar.querySelector("[data-carousel-next]");
      if (prev) prev.addEventListener("click", function () { scrollByPage(-1); });
      if (next) next.addEventListener("click", function () { scrollByPage(1); });
    });
  }

  initTheme();
  createThemeButton();
  createSidebar();
  initCarousels();
  applyTheme(document.documentElement.getAttribute("data-theme"));
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}());
