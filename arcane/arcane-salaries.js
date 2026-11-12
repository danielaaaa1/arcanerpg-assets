(function (window, document) {
  "use strict";

  var VERSION = "1.2.5";
  var DEFAULT_ACCENT = "#9a8452";
  var DEFAULT_IMAGE = "https://i.postimg.cc/j2qhBqj7/image.png";

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function refreshStylesheets() {
    toArray(document.querySelectorAll('link[rel~="stylesheet"]')).forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (!/arcane-salaries\.css(?:[?#]|$)/i.test(href)) return;
      try {
        var url = new URL(link.href, window.location.href);
        if (url.searchParams.get("arcane-css") === VERSION) return;
        url.searchParams.set("arcane-css", VERSION);
        link.href = url.href;
      } catch (error) {
        var separator = href.indexOf("?") === -1 ? "?" : "&";
        link.href = href + separator + "arcane-css=" + encodeURIComponent(VERSION);
      }
    });
  }

  function mount(root) {
    if (!root || root.getAttribute("data-salary-ready") === VERSION) return;

    if (!root.querySelector(".arc-sal__credit")) {
      var credit = document.createElement("a");
      credit.className = "arc-sal__credit";
      credit.href = "https://is.gd/arcanerpg";
      credit.title = "@arcane";
      credit.setAttribute("aria-label", "Arcane RPG");
      root.appendChild(credit);
    }

    var tabs = toArray(root.querySelectorAll("[data-salary-tab]"));
    var panels = toArray(root.querySelectorAll("[data-salary-panel]"));
    var content = root.querySelector(".arc-sal__content");
    var imageCache = {};
    var headerRequest = 0;
    if (!tabs.length || !panels.length) return;

    function preloadImage(source, callback) {
      if (!source) {
        if (callback) callback(false);
        return;
      }
      var cached = imageCache[source];
      if (cached) {
        if (cached.ready) {
          if (callback) callback(cached.ok);
        } else if (callback) {
          cached.callbacks.push(callback);
        }
        return;
      }
      var image = new window.Image();
      cached = imageCache[source] = { image: image, ready: false, ok: false, callbacks: callback ? [callback] : [] };
      function finish(ok) {
        if (cached.ready) return;
        cached.ready = true;
        cached.ok = ok;
        cached.callbacks.splice(0).forEach(function (done) {
          done(ok);
        });
      }
      image.onload = function () {
        if (image.decode) {
          image.decode().then(function () { finish(true); }, function () { finish(true); });
        } else {
          finish(true);
        }
      };
      image.onerror = function () { finish(false); };
      image.src = source;
    }

    tabs.forEach(function (tab) {
      preloadImage(tab.getAttribute("data-image") || DEFAULT_IMAGE);
    });

    function activate(panelId, updateHash) {
      var panel = root.querySelector('[data-salary-panel="' + panelId + '"]');
      var tab = root.querySelector('[data-salary-tab="' + panelId + '"]');
      if (!panel || !tab) return false;

      tabs.forEach(function (item) {
        var active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });

      panels.forEach(function (item) {
        item.classList.toggle("is-active", item === panel);
      });

      var accent = tab.getAttribute("data-color") || DEFAULT_ACCENT;
      root.style.setProperty("--sal-accent", accent);
      root.classList.toggle("is-neutral", panelId === (root.getAttribute("data-default-panel") || "sal-intro"));
      var image = tab.getAttribute("data-image") || DEFAULT_IMAGE;
      var headerColor = tab.getAttribute("data-header-color") || accent;
      var request = ++headerRequest;
      preloadImage(image, function (ok) {
        if (!ok || request !== headerRequest) return;
        root.style.setProperty("--sal-header-color", headerColor);
        root.style.setProperty("--sal-header-image", 'url("' + String(image).replace(/"/g, "%22") + '")');
      });
      if (content) {
        content.scrollTop = 0;
        window.requestAnimationFrame(function () {
          content.scrollTop = 0;
        });
      }

      if (updateHash && window.history && window.history.replaceState) {
        try {
          window.history.replaceState(null, "", "#" + panelId);
        } catch (error) {}
      }
      return true;
    }

    root.addEventListener("click", function (event) {
      var tab = event.target;
      while (tab && tab !== root && !tab.getAttribute("data-salary-tab")) {
        tab = tab.parentNode;
      }
      if (!tab || tab === root) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
      activate(tab.getAttribute("data-salary-tab"), true);
    }, true);

    root.classList.add("is-ready");
    root.setAttribute("data-salary-ready", VERSION);

    var initial = window.location.hash ? window.location.hash.slice(1) : "";
    if (!activate(initial, false)) {
      var preset = root.getAttribute("data-default-panel") || tabs[0].getAttribute("data-salary-tab");
      activate(preset, false);
    }
  }

  function mountAll() {
    refreshStylesheets();
    toArray(document.querySelectorAll("#arcane-salaries")).forEach(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll);
  } else {
    mountAll();
  }

  window.ArcaneSalaryTable = {
    version: VERSION,
    mount: mount,
    mountAll: mountAll,
    refreshStylesheets: refreshStylesheets
  };
})(window, document);
