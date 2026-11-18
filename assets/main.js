/* Qmin 官网交互：复制、进场、导航高亮。没有依赖。 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 复制 ─────────────────────────────────────────────────────────── */

  function readTarget(el) {
    var clone = el.cloneNode(true);
    // 代码标本里的行号是装饰，复制时去掉
    Array.prototype.forEach.call(clone.querySelectorAll(".ln"), function (n) {
      n.remove();
    });
    return clone.textContent.replace(/\n{3,}/g, "\n\n").trim();
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function flash(button) {
    var original = button.textContent;
    button.textContent = "已复制";
    button.classList.add("is-done");
    window.setTimeout(function () {
      button.textContent = original;
      button.classList.remove("is-done");
    }, 1600);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-copy-target]"), function (button) {
    button.addEventListener("click", function () {
      var target = document.getElementById(button.getAttribute("data-copy-target"));
      if (!target) return;
      var text = readTarget(target);

      var done = function () {
        flash(button);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {
          if (fallbackCopy(text)) done();
        });
      } else if (fallbackCopy(text)) {
        done();
      }
    });
  });

  /* ── 进场 ─────────────────────────────────────────────────────────── */

  if (!reduceMotion && "IntersectionObserver" in window) {
    var groups = [
      ".sec__head",
      ".item",
      ".step",
      ".toc__row",
      ".links li",
      ".notes li",
      ".aside",
      "details"
    ];
    var targets = document.querySelectorAll(groups.join(","));
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    // 同一区块内的元素错开一点；首屏内的直接显示，避免加载后一片空白
    var counters = new Map();
    Array.prototype.forEach.call(targets, function (el) {
      var section = el.closest("section, footer") || document.body;
      var index = counters.get(section) || 0;
      counters.set(section, index + 1);
      el.classList.add("reveal");
      el.style.setProperty("--d", Math.min(index, 5) * 60 + "ms");

      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.02) {
        el.classList.add("is-in");
      } else {
        observer.observe(el);
      }
    });
  }

  /* ── 导航高亮 ─────────────────────────────────────────────────────── */

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          links.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      navObserver.observe(s);
    });
  }

  /* ── 年份 ─────────────────────────────────────────────────────────── */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
