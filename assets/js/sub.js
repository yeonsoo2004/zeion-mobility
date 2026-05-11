/**
 * ZEION — 서브페이지 (브랜드 KV + About + Philosophy + History)
 * - KV(브랜드·모델): 동일한 느린 배경 줌(scale 1→1.09, 18s) + 모델은 텍스트 Fade-up
 * - Model feature & interior (luna): ScrollTrigger 아래→위(y)·페이드(더 긴 duration·큰 y)
 * - Model custom video (luna): .model-custom-video-section .video-container.anim-rise ScrollTrigger + #customVideo API
 * - Model spec (luna): .model-spec-section .anim-rise 순차(stagger 0.2) 페이드업
 * - ESG KV (esg.html): .sub-kv-section.esg-kv .anim-rise y:100, duration 1.2s
 * - ESG Core (esg.html): .esg-core-section .anim-rise 스크롤 등장
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

  /* luna 등 모델 페이지 스크롤 등장: 이동량·시간을 키워 체감되게 */
  var modelScrollRiseY = 88;
  var modelScrollRiseDuration = 1.5;
  var modelScrollRiseEase = "power3.out";
  var modelScrollRiseStart = "top 88%";

  var kvSection = document.querySelector(".sub-kv-section");
  var kvBg = document.querySelector(".kv-bg-img");
  var isModelKv = kvSection && kvSection.classList.contains("model-kv");

  if (!reducedMotion && kvSection && kvBg) {
    /* 브랜드·모델 KV 공통: luna와 동일한 아주 느린 줌 */
    gsap.fromTo(
      kvBg,
      { scale: 1 },
      {
        scale: 1.09,
        duration: 18,
        ease: "power1.out",
      }
    );

    var kvCopyEls = isModelKv
      ? gsap.utils.toArray(
          ".sub-kv-section.model-kv .breadcrumb, .sub-kv-section.model-kv .model-title-group, .sub-kv-section.model-kv .model-stats-grid"
        )
      : gsap.utils.toArray(
          ".sub-kv-section .breadcrumb, .sub-kv-section .kv-desc, .sub-kv-section .kv-title"
        );

    if (kvCopyEls.length) {
      gsap.fromTo(
        kvCopyEls,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: "power2.out",
          stagger: isModelKv ? 0.2 : 0.14,
          delay: 0.35,
        }
      );
    }
  }

  var featureItems = gsap.utils.toArray(
    ".model-feature-section .feature-item.anim-rise"
  );

  if (featureItems.length && !reducedMotion) {
    featureItems.forEach(function (item) {
      gsap.from(item, {
        y: modelScrollRiseY,
        opacity: 0,
        duration: modelScrollRiseDuration,
        ease: modelScrollRiseEase,
        immediateRender: false,
        scrollTrigger: {
          trigger: item,
          start: modelScrollRiseStart,
          toggleActions: "play none none none",
        },
      });
    });
  }

  var interiorSection = document.querySelector(".model-interior-section");
  var interiorRiseEls = gsap.utils.toArray(
    ".model-interior-section .interior-header.anim-rise, .model-interior-section .interior-swiper.anim-rise"
  );
  if (interiorSection && interiorRiseEls.length && !reducedMotion) {
    gsap.from(interiorRiseEls, {
      y: modelScrollRiseY,
      opacity: 0,
      duration: modelScrollRiseDuration,
      ease: modelScrollRiseEase,
      stagger: 0.24,
      immediateRender: false,
      scrollTrigger: {
        trigger: interiorSection,
        start: modelScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var modelVideoWrap = document.querySelector(
    ".model-custom-video-section .video-container.anim-rise"
  );
  if (modelVideoWrap && !reducedMotion) {
    gsap.from(modelVideoWrap, {
      y: modelScrollRiseY,
      opacity: 0,
      duration: modelScrollRiseDuration,
      ease: modelScrollRiseEase,
      immediateRender: false,
      scrollTrigger: {
        trigger: modelVideoWrap,
        start: modelScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var specSection = document.querySelector(".model-spec-section");
  var specRiseEls = gsap.utils.toArray(".model-spec-section .anim-rise");
  if (specSection && specRiseEls.length && !reducedMotion) {
    gsap.from(specRiseEls, {
      y: modelScrollRiseY,
      opacity: 0,
      duration: modelScrollRiseDuration,
      ease: modelScrollRiseEase,
      stagger: 0.24,
      immediateRender: false,
      scrollTrigger: {
        trigger: specSection,
        start: modelScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var esgKvSection = document.querySelector(".sub-kv-section.esg-kv");
  var esgKvRiseEls = gsap.utils.toArray(".sub-kv-section.esg-kv .anim-rise");
  if (esgKvSection && esgKvRiseEls.length && !reducedMotion) {
    gsap.from(esgKvRiseEls, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.18,
      immediateRender: false,
      scrollTrigger: {
        trigger: esgKvSection,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  }

  var esgCoreSection = document.querySelector(".esg-core-section");
  var esgCoreRiseEls = gsap.utils.toArray(".esg-core-section .anim-rise");
  if (esgCoreSection && esgCoreRiseEls.length && !reducedMotion) {
    gsap.from(esgCoreRiseEls, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.18,
      immediateRender: false,
      scrollTrigger: {
        trigger: esgCoreSection,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
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

/* ZE-1 Interior — Swiper (2-up grid, scrollbar drag 50% desktop / auto mobile) */
(function () {
  if (typeof Swiper === "undefined") return;

  var el = document.querySelector(".interior-swiper");
  if (!el) return;

  var scrollbarEl = el.querySelector(".swiper-scrollbar");
  if (!scrollbarEl) return;

  /* true면 모바일에서도 트랙 너비의 50% 고정 드래그(기본 false = auto → 슬라이드 1/4 노출 시 약 25%) */
  var INTERIOR_SCROLLBAR_MOBILE_DRAG_HALF = false;

  function applyInteriorScrollbarDragSize(swiper) {
    if (!swiper || !swiper.scrollbar) return;
    var tw = scrollbarEl.clientWidth || scrollbarEl.offsetWidth;
    if (!tw) return;

    var isMobile = window.matchMedia("(max-width: 767px)").matches;
    var drag;

    if (isMobile) {
      drag = INTERIOR_SCROLLBAR_MOBILE_DRAG_HALF
        ? Math.max(1, Math.round(tw * 0.5))
        : "auto";
    } else {
      drag = Math.max(1, Math.round(tw * 0.5));
    }

    swiper.params.scrollbar.dragSize = drag;
    swiper.scrollbar.updateSize();
  }

  var interiorSwiper = new Swiper(el, {
    speed: 800,
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    grabCursor: true,
    scrollbar: {
      el: scrollbarEl,
      draggable: true,
      dragSize: "auto",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 24,
      },
    },
    on: {
      init: function (swiper) {
        requestAnimationFrame(function () {
          applyInteriorScrollbarDragSize(swiper);
          if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
          }
        });
      },
      resize: function (swiper) {
        applyInteriorScrollbarDragSize(swiper);
      },
      breakpoint: function (swiper) {
        requestAnimationFrame(function () {
          applyInteriorScrollbarDragSize(swiper);
        });
      },
    },
  });

  window.addEventListener(
    "load",
    function () {
      applyInteriorScrollbarDragSize(interiorSwiper);
    },
    { once: true }
  );
})();

/* ZE-1 — 커스텀 인라인 비디오 (#customVideo) */
(function () {
  var video = document.getElementById("customVideo");
  var container = document.getElementById("videoContainer");
  if (!video || !container) return;

  var playPauseBtn = document.getElementById("playPauseBtn");
  var progressWrap = document.getElementById("progressBarWrapper");
  var progressFill = document.getElementById("progressBarFill");
  var currentTimeEl = document.getElementById("currentTime");
  var totalDurationEl = document.getElementById("totalDuration");

  if (!playPauseBtn || !progressWrap || !progressFill || !currentTimeEl || !totalDurationEl) {
    return;
  }

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function updateProgressFill() {
    var d = video.duration;
    if (!isFinite(d) || d <= 0) {
      progressFill.style.width = "0%";
      return;
    }
    progressFill.style.width = (video.currentTime / d) * 100 + "%";
  }

  function updateTimeLabels() {
    currentTimeEl.textContent = formatTime(video.currentTime);
    totalDurationEl.textContent = formatTime(video.duration);
  }

  function syncPlayingClass() {
    container.classList.toggle("is-playing", !video.paused);
    playPauseBtn.setAttribute("aria-label", video.paused ? "재생" : "일시정지");
  }

  function togglePlay() {
    if (video.paused) {
      var p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {});
      }
    } else {
      video.pause();
    }
  }

  container.addEventListener("click", function (e) {
    if (e.target.closest(".video-controls")) return;
    togglePlay();
  });

  playPauseBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    togglePlay();
  });

  progressWrap.addEventListener("click", function (e) {
    e.stopPropagation();
    var d = video.duration;
    if (!isFinite(d) || d <= 0) return;
    var rect = progressWrap.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var ratio = Math.min(1, Math.max(0, x / rect.width));
    video.currentTime = ratio * d;
    updateProgressFill();
    updateTimeLabels();
  });

  video.addEventListener("timeupdate", function () {
    updateProgressFill();
    currentTimeEl.textContent = formatTime(video.currentTime);
  });

  video.addEventListener("loadedmetadata", function () {
    updateTimeLabels();
    updateProgressFill();
  });

  video.addEventListener("play", syncPlayingClass);
  video.addEventListener("pause", syncPlayingClass);
  video.addEventListener("ended", syncPlayingClass);

  syncPlayingClass();
  updateTimeLabels();
  updateProgressFill();

  var customVideoSection = document.querySelector(".model-custom-video-section");
  function playWhenSectionVisible() {
    if (!customVideoSection) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    function attemptPlay() {
      var p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {
          video.muted = true;
          var p2 = video.play();
          if (p2 && typeof p2.catch === "function") {
            p2.catch(function () {});
          }
        });
      }
    }
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: customVideoSection,
        start: "top 85%",
        once: true,
        onEnter: attemptPlay,
      });
    } else if (typeof IntersectionObserver !== "undefined") {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              attemptPlay();
              io.disconnect();
            }
          });
        },
        { root: null, rootMargin: "0px", threshold: 0.12 }
      );
      io.observe(customVideoSection);
    }
  }
  playWhenSectionVisible();
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
