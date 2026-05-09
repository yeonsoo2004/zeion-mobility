/**
 * ZEION — 서브페이지 (브랜드 KV + About + Philosophy + History)
 * - KV: 슬로우 줌, 패럴랙스, Stagger Fade-up
 * - About / Philosophy: ScrollTrigger Rise (stagger)
 * - History: pin-height 스크롤, 이미지 축소 + 타임라인·이미지 동기화 (scrub)
 * - Media: 탭 필터 + GSAP opacity/scale (0.4s)
 */
(function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var kvSection = document.querySelector(".sub-kv-section");
  var kvBg = document.querySelector(".kv-bg-img");

  if (!reducedMotion && kvSection && kvBg) {
    gsap.fromTo(
      kvBg,
      { scale: 1 },
      {
        scale: 1.15,
        duration: 10,
        ease: "power1.out",
      }
    );

    gsap.fromTo(
      kvBg,
      { yPercent: 10 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: kvSection,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    var kvCopyEls = gsap.utils.toArray(
      ".sub-kv-section .breadcrumb, .sub-kv-section .kv-desc, .sub-kv-section .kv-title"
    );
    if (kvCopyEls.length) {
      gsap.fromTo(
        kvCopyEls,
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: "power2.out",
          stagger: 0.14,
          delay: 0.35,
        }
      );
    }
  }

  var aboutSection = document.querySelector(".brand-about-section");
  var aboutGroups = gsap.utils.toArray(
    ".brand-about-section .about-title-group, .brand-about-section .about-desc-group, .brand-about-section .about-stats-group"
  );

  if (aboutSection && aboutGroups.length && !reducedMotion) {
    gsap.from(aboutGroups, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.3,
      immediateRender: false,
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
  }

  var philosophySection = document.querySelector(".brand-philosophy-section");
  var philosophyTargets = gsap.utils.toArray(
    ".brand-philosophy-section .philosophy-header, .brand-philosophy-section .philosophy-cards .card-item"
  );

  if (philosophySection && philosophyTargets.length && !reducedMotion) {
    gsap.from(philosophyTargets, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: philosophySection,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }

  var historySection = document.querySelector(".brand-history-section");
  if (historySection) {
    var historyPin = historySection.querySelector(".history-pin-wrapper");
    var animImageBox = historySection.querySelector("#animImageBox");
    var visualTarget = historySection.querySelector("#visualTarget");
    var imgOverlay = historySection.querySelector("#animImageBox .img-overlay");
    var historyTextArea = historySection.querySelector(".history-text-area");
    var historyItems = historySection.querySelectorAll(".timeline-item");
    var historyImgs = historySection.querySelectorAll("#animImageBox .hist-img");

    function setHistoryActive(index) {
      historyItems.forEach(function (li) {
        var i = Number(li.getAttribute("data-index"));
        li.classList.toggle("active", i === index);
      });
      historyImgs.forEach(function (img) {
        var i = Number(img.getAttribute("data-index"));
        img.classList.toggle("active", i === index);
      });
    }

    function updateHistoryFromProgress(p) {
      if (p < 0.25) {
        setHistoryActive(0);
        return;
      }
      var u = (p - 0.25) / 0.75;
      var idx = Math.min(3, Math.max(0, Math.floor(u * 4)));
      setHistoryActive(idx);
    }

    function getHistoryTargetBox() {
      if (!historyPin || !visualTarget) return { top: 0, left: 0, width: 0, height: 0 };
      var pr = historyPin.getBoundingClientRect();
      var vr = visualTarget.getBoundingClientRect();
      return {
        top: vr.top - pr.top,
        left: vr.left - pr.left,
        width: vr.width,
        height: vr.height,
      };
    }

    if (reducedMotion) {
      historySection.classList.add("brand-history-section--reduced");
      function applyHistoryReducedLayout() {
        if (animImageBox && historyPin && visualTarget) {
          var rb = getHistoryTargetBox();
          gsap.set(animImageBox, {
            top: rb.top,
            left: rb.left,
            width: rb.width,
            height: rb.height,
            borderRadius: 20,
          });
        }
      }
      applyHistoryReducedLayout();
      window.addEventListener("load", applyHistoryReducedLayout, { once: true });
      if (imgOverlay) gsap.set(imgOverlay, { opacity: 0 });
      if (historyTextArea) historyTextArea.style.opacity = "1";
      setHistoryActive(0);
    } else if (
      animImageBox &&
      historyPin &&
      visualTarget &&
      historyTextArea &&
      historyItems.length &&
      historyImgs.length
    ) {
      var historyTl = gsap.timeline({
        scrollTrigger: {
          trigger: historySection,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            updateHistoryFromProgress(self.progress);
          },
        },
      });

      historyTl.fromTo(
        animImageBox,
        {
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 0,
        },
        {
          top: function () {
            return getHistoryTargetBox().top;
          },
          left: function () {
            return getHistoryTargetBox().left;
          },
          width: function () {
            return getHistoryTargetBox().width;
          },
          height: function () {
            return getHistoryTargetBox().height;
          },
          borderRadius: 20,
          ease: "none",
          duration: 0.25,
        },
        0
      );

      if (imgOverlay) {
        historyTl.fromTo(
          imgOverlay,
          { opacity: 1 },
          { opacity: 0, ease: "none", duration: 0.25 },
          0
        );
      }

      historyTl.fromTo(
        historyTextArea,
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: 0.25 },
        0
      );

      historyTl.to({}, { duration: 0.75 }, 0.25);
    }
  }

  function initBrandMediaFilter() {
    var section = document.querySelector(".brand-media-section");
    if (!section) return;

    var tabLis = section.querySelectorAll(".tab-item");
    var mediaItems = section.querySelectorAll(".media-item");
    if (!tabLis.length || !mediaItems.length) return;

    function syncTabAria(filter) {
      tabLis.forEach(function (li) {
        var btn = li.querySelector("button");
        var isOn = li.getAttribute("data-filter") === filter;
        li.classList.toggle("active", isOn);
        if (btn) btn.setAttribute("aria-selected", isOn ? "true" : "false");
      });
    }

    function applyFilter(filter) {
      syncTabAria(filter);

      mediaItems.forEach(function (el) {
        var t = el.getAttribute("data-type") || "";
        var show = filter === "all" || filter === t;

        gsap.killTweensOf(el);

        if (reducedMotion) {
          el.style.display = show ? "" : "none";
          gsap.set(el, { clearProps: "opacity,scale" });
          return;
        }

        if (show) {
          var wasHidden = window.getComputedStyle(el).display === "none";
          el.style.display = "";
          if (wasHidden) {
            gsap.fromTo(
              el,
              { opacity: 0, scale: 0.92 },
              { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
            );
          } else {
            gsap.to(el, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
          }
        } else {
          gsap.to(el, {
            opacity: 0,
            scale: 0.92,
            duration: 0.4,
            ease: "power2.in",
            onComplete: function () {
              el.style.display = "none";
            },
          });
        }
      });
    }

    tabLis.forEach(function (li) {
      var btn = li.querySelector("button");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var f = li.getAttribute("data-filter");
        if (!f) return;
        applyFilter(f);
      });
    });
  }

  initBrandMediaFilter();

  window.addEventListener(
    "load",
    function () {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
})();

(function () {
  var modal = document.getElementById("videoModal");
  var modalVideo = document.getElementById("modalVideo");
  if (!modal || !modalVideo) return;

  var dim = modal.querySelector(".modal-dimmed");
  var closeBtn = modal.querySelector(".btn-modal-close");
  var transitionMs = 300;
  var clearSrcTimer = null;

  function bodyScrollLock(on) {
    document.body.style.overflow = on ? "hidden" : "";
  }

  function scheduleClearSrc() {
    if (clearSrcTimer) window.clearTimeout(clearSrcTimer);
    clearSrcTimer = window.setTimeout(function () {
      clearSrcTimer = null;
      if (!modal.classList.contains("active")) {
        modalVideo.removeAttribute("src");
        modalVideo.load();
      }
    }, transitionMs);
  }

  function openModal(src) {
    if (!src) return;
    if (clearSrcTimer) {
      window.clearTimeout(clearSrcTimer);
      clearSrcTimer = null;
    }
    modalVideo.src = src;
    modal.classList.add("active");
    bodyScrollLock(true);
    var playPromise = modalVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function closeModal() {
    modal.classList.remove("active");
    modalVideo.pause();
    modalVideo.currentTime = 0;
    bodyScrollLock(false);
    scheduleClearSrc();
  }

  document.querySelectorAll('.media-item[data-type="video"]').forEach(function (item) {
    item.addEventListener("click", function () {
      var thumbVideo = item.querySelector(".item-thumb video, video");
      if (!thumbVideo) return;
      var src = thumbVideo.getAttribute("src") || thumbVideo.src;
      openModal(src);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeModal();
    });
  }

  if (dim) {
    dim.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
})();
