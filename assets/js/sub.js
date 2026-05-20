/**
 * ZEION — 서브페이지 (브랜드 KV + About + Philosophy + History)
 * - KV(브랜드·모델): 느린 배경 줌(scale 1→1.09, 18s) + 텍스트 Fade-up
 * - Pre-reservation KV: scale 1.05→1.15 (17.5s) + .anim-rise (brand KV와 동일 y·duration·ease)
 * - Pre-reservation info: .pre-info-section .anim-rise ScrollTrigger
 * - FAQ (faq.html): LNB·리스트 ScrollTrigger(하단→상단) + jQuery 아코디언(slideDown/slideUp·slideToggle)
 * - Support (support.html): KV .anim-rise + 폼 ScrollTrigger + 문의유형 커스텀 셀렉트
 * - Model 360 viewer: 24프레임 드래그·터치 + 프리로드 (luna/terra)
 * - Model feature & interior 등 스크롤 등장: brand KV와 동일 (y 40, 0.95s, power2.out, autoAlpha)
 * - Model custom video (luna): .model-custom-video-section .video-container.anim-rise ScrollTrigger + #customVideo API
 * - Model spec (luna/terra): 제목 → 좌·우 컬럼 동시 등장 → 노트 (스크롤 트리거 1개)
 * - ESG KV (esg.html): KV .anim-rise 동시 등장(글·영상 stagger 없음)
 * - ESG Core: 인트로 + Environment/Social/Governance 각각 스크롤 진입 시 등장(트리거 분리)
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

  /* 스크롤 위로 등장 — brand.html KV 문구(fromTo y·duration·ease)와 동일 체감 */
  var pageScrollRiseY = 40;
  var pageScrollRiseDuration = 0.95;
  var pageScrollRiseEase = "power2.out";
  var pageScrollRiseStart = "top 88%";

  var kvSection = document.querySelector(".sub-kv-section");
  var kvBg = document.querySelector(".kv-bg-img");
  var isModelKv = kvSection && kvSection.classList.contains("model-kv");
  var isPreKv = kvSection && kvSection.classList.contains("pre-kv");

  if (!reducedMotion && kvSection && kvBg) {
    if (isPreKv) {
      /* 사전예약 KV: 초기 1.05 → 천천히 1.15 (몰입용 시네마틱 줌) */
      gsap.fromTo(
        kvBg,
        { scale: 1.05 },
        {
          scale: 1.15,
          duration: 17.5,
          ease: "power1.out",
        }
      );
      var preKvRise = gsap.utils.toArray(".sub-kv-section.pre-kv .anim-rise");
      if (preKvRise.length) {
        gsap.fromTo(
          preKvRise,
          { autoAlpha: 0, y: 40 },
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
    } else {
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
  }

  var featureItems = gsap.utils.toArray(
    ".model-feature-section .feature-item.anim-rise"
  );

  if (featureItems.length && !reducedMotion) {
    featureItems.forEach(function (item) {
      gsap.from(item, {
        y: pageScrollRiseY,
        autoAlpha: 0,
        duration: pageScrollRiseDuration,
        ease: pageScrollRiseEase,
        immediateRender: false,
        scrollTrigger: {
          trigger: item,
          start: pageScrollRiseStart,
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
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      immediateRender: false,
      scrollTrigger: {
        trigger: interiorSection,
        start: pageScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var modelVideoWrap = document.querySelector(
    ".model-custom-video-section .video-container.anim-rise"
  );
  if (modelVideoWrap && !reducedMotion) {
    gsap.from(modelVideoWrap, {
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      immediateRender: false,
      scrollTrigger: {
        trigger: modelVideoWrap,
        start: pageScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var specSection = document.querySelector(".model-spec-section");
  if (specSection && !reducedMotion) {
    var specScrollTrigger = {
      trigger: specSection,
      start: pageScrollRiseStart,
      toggleActions: "play none none none",
    };
    var specTweenDefaults = {
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      immediateRender: false,
    };
    var specTitle = specSection.querySelector(".spec-title.anim-rise");
    var specInfo = specSection.querySelector(".spec-info.anim-rise");
    var specVisual = specSection.querySelector(".spec-visual.anim-rise");
    var specNote = specSection.querySelector(".spec-note.anim-rise");
    var specCols = [];
    if (specInfo) specCols.push(specInfo);
    if (specVisual) specCols.push(specVisual);

    if (specTitle || specCols.length || specNote) {
      var specTl = gsap.timeline({
        scrollTrigger: specScrollTrigger,
        defaults: specTweenDefaults,
      });
      var specStagger = 0.14;
      var p = 0;
      if (specTitle) {
        specTl.from(specTitle, {}, p);
        p += specStagger;
      }
      if (specCols.length) {
        specTl.from(specCols, { stagger: 0 }, p);
        p += specStagger;
      }
      if (specNote) {
        specTl.from(specNote, {}, p);
      }
    }
  }

  /* ESG KV: 브레드크럼·제목·영상을 동시에 등장(stagger 없음 — 글/영상 타이밍 일치) */
  var esgKvSection = document.querySelector(".sub-kv-section.esg-kv");
  var esgKvRiseEls = gsap.utils.toArray(".sub-kv-section.esg-kv .anim-rise");
  if (esgKvSection && esgKvRiseEls.length && !reducedMotion) {
    gsap.from(esgKvRiseEls, {
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0,
      immediateRender: false,
      scrollTrigger: {
        trigger: esgKvSection,
        start: pageScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var esgCoreSection = document.querySelector(".esg-core-section");
  if (esgCoreSection && !reducedMotion) {
    var esgIntro = esgCoreSection.querySelector(".esg-intro");
    if (esgIntro) {
      gsap.from(esgIntro, {
        y: pageScrollRiseY,
        autoAlpha: 0,
        duration: pageScrollRiseDuration,
        ease: pageScrollRiseEase,
        immediateRender: false,
        scrollTrigger: {
          trigger: esgIntro,
          start: pageScrollRiseStart,
          toggleActions: "play none none none",
        },
      });
    }

    var esgInner = esgCoreSection.querySelector(".inner");
    var categoryBlocks = [];
    if (esgInner) {
      Array.prototype.forEach.call(esgInner.children, function (child) {
        if (child.classList && child.classList.contains("esg-category-block")) {
          categoryBlocks.push(child);
        }
      });
    }
    categoryBlocks.forEach(function (block) {
      var next = block.nextElementSibling;
      var targets = [block];
      if (next && next.classList && next.classList.contains("expandable-gallery")) {
        targets.push(next);
      }
      gsap.from(targets, {
        y: pageScrollRiseY,
        autoAlpha: 0,
        duration: pageScrollRiseDuration,
        ease: pageScrollRiseEase,
        stagger: 0.14,
        immediateRender: false,
        scrollTrigger: {
          trigger: block,
          start: pageScrollRiseStart,
          toggleActions: "play none none none",
        },
      });
    });
  }

  var esgRatingSection = document.querySelector(".esg-rating-section");
  var esgRatingRiseEls = gsap.utils.toArray(".esg-rating-section .anim-rise");
  if (esgRatingSection && esgRatingRiseEls.length && !reducedMotion) {
    gsap.from(esgRatingRiseEls, {
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      immediateRender: false,
      scrollTrigger: {
        trigger: esgRatingSection,
        start: pageScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var esgCertSection = document.querySelector(".esg-cert-section");
  var esgCertRiseEls = gsap.utils.toArray(".esg-cert-section .esg-cert-list.anim-rise");
  if (esgCertSection && esgCertRiseEls.length && !reducedMotion) {
    gsap.from(esgCertRiseEls, {
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      immediateRender: false,
      scrollTrigger: {
        trigger: esgCertSection,
        start: pageScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var preInfoSection = document.querySelector(".pre-info-section");
  var preInfoRiseEls = gsap.utils.toArray(".pre-info-section .anim-rise");
  if (preInfoSection && preInfoRiseEls.length && !reducedMotion) {
    gsap.from(preInfoRiseEls, {
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      immediateRender: false,
      scrollTrigger: {
        trigger: preInfoSection,
        start: pageScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var faqMain = document.querySelector(".faq-main");
  var faqSectionRiseEls = gsap.utils.toArray(
    ".faq-main .support-section .support-lnb, .faq-main .support-section .faq-wrap"
  );
  if (faqMain && faqSectionRiseEls.length && !reducedMotion) {
    gsap.from(faqSectionRiseEls, {
      y: 56,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      immediateRender: false,
      scrollTrigger: {
        trigger: ".faq-main .support-section",
        start: pageScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var showroomMain = document.querySelector(".showroom-main");
  var showroomSectionRiseEls = gsap.utils.toArray(
    ".showroom-main .support-section .support-lnb, .showroom-main .support-section .showroom-policy-area, .showroom-main .support-section .showroom-map-area"
  );
  if (showroomMain && showroomSectionRiseEls.length && !reducedMotion) {
    gsap.from(showroomSectionRiseEls, {
      y: 56,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      immediateRender: false,
      scrollTrigger: {
        trigger: ".showroom-main .support-section",
        start: pageScrollRiseStart,
        toggleActions: "play none none none",
      },
    });
  }

  var supportSection = document.querySelector(".support-section");
  var supportKvRiseEls = gsap.utils.toArray(".support-section .support-kv .anim-rise");
  if (supportSection && supportKvRiseEls.length && !reducedMotion) {
    gsap.from(supportKvRiseEls, {
      autoAlpha: 0,
      y: pageScrollRiseY,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      delay: 0.12,
    });
  }

  var supportFormRise = document.querySelector(".support-form-area .support-form.anim-rise");
  if (supportSection && supportFormRise && !reducedMotion) {
    gsap.from(supportFormRise, {
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      immediateRender: false,
      scrollTrigger: {
        trigger: supportFormRise,
        start: pageScrollRiseStart,
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
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      immediateRender: false,
      scrollTrigger: {
        trigger: aboutSection,
        start: pageScrollRiseStart,
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
      y: pageScrollRiseY,
      autoAlpha: 0,
      duration: pageScrollRiseDuration,
      ease: pageScrollRiseEase,
      stagger: 0.14,
      immediateRender: false,
      scrollTrigger: {
        trigger: philosophySection,
        start: pageScrollRiseStart,
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

/**
 * ESG Data Center — modal interactions
 */
(function () {
  var modal = document.getElementById("dataModal");
  if (!modal) return;

  var titleEl = document.getElementById("modalTitle");
  var descEl = document.getElementById("modalDesc");
  var closeBtn = modal.querySelector(".btn-modal-close");
  var backdrop = modal.querySelector(".modal-backdrop");
  var cards = document.querySelectorAll(".esg-data-center .data-card");

  function closeModal() {
    modal.classList.remove("is-active");
  }

  function openModal(title, desc) {
    if (titleEl) titleEl.textContent = title || "";
    if (descEl) descEl.textContent = desc || "";
    modal.classList.add("is-active");
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      var title = card.getAttribute("data-title") || "";
      var desc = card.getAttribute("data-desc") || "";
      openModal(title, desc);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeModal();
    }
  });
})();

/**
 * ESG — Rating accordion table (한 번에 한 행만 펼침)
 */
(function () {
  var section = document.querySelector(".esg-rating-section");
  if (!section) return;

  var rows = section.querySelectorAll(".accordion-row");

  function closeRow(r) {
    var v = r.querySelector(".tbl-row-visible");
    var h = r.querySelector(".tbl-row-hidden");
    if (!v || !h) return;
    r.classList.remove("active");
    v.setAttribute("aria-expanded", "false");
    h.setAttribute("aria-hidden", "true");
  }

  rows.forEach(function (row) {
    var visible = row.querySelector(".tbl-row-visible");
    var hidden = row.querySelector(".tbl-row-hidden");
    if (!visible || !hidden) return;

    hidden.setAttribute("aria-hidden", "true");

    function setOpen(open) {
      row.classList.toggle("active", open);
      visible.setAttribute("aria-expanded", open ? "true" : "false");
      hidden.setAttribute("aria-hidden", open ? "false" : "true");
    }

    function onActivate() {
      var isOpen = row.classList.contains("active");
      if (isOpen) {
        setOpen(false);
        return;
      }
      rows.forEach(function (other) {
        if (other !== row) closeRow(other);
      });
      setOpen(true);
    }

    visible.addEventListener("click", onActivate);

    visible.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    });
  });
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
        p.catch(function () { });
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
            p2.catch(function () { });
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
      playPromise.catch(function () { });
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

/**
 * 고객지원(support.html): 문의 유형 — 네이티브 option은 OS 스타일이라 커스텀 리스트로 대체
 * (숨긴 select는 name/type·값 동기화만 담당)
 */
(function () {
  function qs(root, sel) {
    return root.querySelector(sel);
  }

  var customSelectUid = 0;

  function setupCustomSelect(wrap) {
    var native = qs(wrap, "select");
    if (!native || wrap.getAttribute("data-custom-select-initialized") === "1") return;

    var inputGroup = wrap.closest(".input-group");
    var label = inputGroup ? qs(inputGroup, "label") : null;
    var uid = ++customSelectUid;
    var triggerId = "custom-select-trigger-" + uid;
    var listId = "custom-select-listbox-" + uid;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "custom-select__trigger";
    button.id = triggerId;
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", listId);
    if (label && label.id) {
      button.setAttribute("aria-labelledby", label.id);
    }

    var valueSpan = document.createElement("span");
    valueSpan.className = "custom-select__value";
    valueSpan.id = triggerId + "-value";

    var chevron = document.createElement("span");
    chevron.className = "custom-select__chevron";
    chevron.setAttribute("aria-hidden", "true");

    button.appendChild(valueSpan);
    button.appendChild(chevron);

    var list = document.createElement("ul");
    list.className = "custom-select__list";
    list.id = listId;
    list.setAttribute("role", "listbox");
    list.setAttribute("hidden", "");

    var options = native.querySelectorAll("option");
    var optionEls = [];
    Array.prototype.forEach.call(options, function (opt, idx) {
      var li = document.createElement("li");
      li.className = "custom-select__option";
      li.setAttribute("role", "option");
      li.setAttribute("data-index", String(idx));
      li.setAttribute("id", listId + "-opt-" + idx);
      li.textContent = opt.textContent;
      if (opt.value === "") {
        li.classList.add("custom-select__option--placeholder");
      }
      li.setAttribute("aria-selected", opt.selected ? "true" : "false");
      li.tabIndex = -1;
      list.appendChild(li);
      optionEls.push(li);
    });

    wrap.insertBefore(button, native);
    wrap.insertBefore(list, native);

    wrap.setAttribute("data-custom-select-initialized", "1");
    wrap.classList.add("is-ready");

    native.tabIndex = -1;
    if (label) {
      label.setAttribute("for", triggerId);
    }

    var isOpen = false;
    var highlightIndex = Math.max(0, native.selectedIndex);
    var docPointerDown = null;

    function getOptionCount() {
      return optionEls.length;
    }

    function syncListAriaSelected() {
      var si = native.selectedIndex;
      optionEls.forEach(function (li, j) {
        li.setAttribute("aria-selected", j === si ? "true" : "false");
      });
    }

    function updateTrigger() {
      var opt = native.options[native.selectedIndex];
      valueSpan.textContent = opt ? opt.textContent : "";
      button.classList.toggle("is-placeholder", native.value === "");
      syncListAriaSelected();
    }

    function setHighlight(i, scrollIntoView) {
      var n = getOptionCount();
      if (!n) return;
      highlightIndex = Math.max(0, Math.min(n - 1, i));
      optionEls.forEach(function (li, j) {
        li.classList.toggle("is-highlighted", j === highlightIndex);
        li.tabIndex = j === highlightIndex ? 0 : -1;
      });
      if (scrollIntoView && optionEls[highlightIndex]) {
        optionEls[highlightIndex].scrollIntoView({ block: "nearest" });
      }
    }

    function removeDocListeners() {
      if (docPointerDown) {
        document.removeEventListener("pointerdown", docPointerDown, true);
        docPointerDown = null;
      }
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      list.setAttribute("hidden", "");
      button.setAttribute("aria-expanded", "false");
      wrap.classList.remove("is-open");
      removeDocListeners();
      optionEls.forEach(function (li) {
        li.classList.remove("is-highlighted");
      });
    }

    function open() {
      if (isOpen) return;
      isOpen = true;
      list.removeAttribute("hidden");
      button.setAttribute("aria-expanded", "true");
      wrap.classList.add("is-open");
      highlightIndex = native.selectedIndex >= 0 ? native.selectedIndex : 0;
      setHighlight(highlightIndex, true);
      if (optionEls[highlightIndex]) {
        optionEls[highlightIndex].focus({ preventScroll: true });
      }

      docPointerDown = function (e) {
        if (!wrap.contains(e.target)) {
          close();
          button.focus();
        }
      };
      document.addEventListener("pointerdown", docPointerDown, true);
    }

    function toggle() {
      if (isOpen) {
        close();
        button.focus();
      } else {
        open();
      }
    }

    function commitIndex(idx) {
      if (idx < 0 || idx >= getOptionCount()) return;
      native.selectedIndex = idx;
      native.dispatchEvent(new Event("input", { bubbles: true }));
      native.dispatchEvent(new Event("change", { bubbles: true }));
      updateTrigger();
      close();
      button.focus();
    }

    updateTrigger();

    button.addEventListener("click", function (e) {
      e.preventDefault();
      toggle();
    });

    button.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) {
          open();
        } else {
          setHighlight(highlightIndex + 1, true);
          if (optionEls[highlightIndex]) optionEls[highlightIndex].focus({ preventScroll: true });
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          open();
          setHighlight(getOptionCount() - 1, true);
          if (optionEls[highlightIndex]) optionEls[highlightIndex].focus({ preventScroll: true });
        } else {
          setHighlight(highlightIndex - 1, true);
          if (optionEls[highlightIndex]) optionEls[highlightIndex].focus({ preventScroll: true });
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isOpen) {
          open();
        }
      } else if (e.key === "Escape") {
        if (isOpen) {
          e.preventDefault();
          close();
          button.focus();
        }
      } else if (e.key === "Tab" && isOpen) {
        close();
      }
    });

    list.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        button.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight(highlightIndex + 1, true);
        if (optionEls[highlightIndex]) optionEls[highlightIndex].focus({ preventScroll: true });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight(highlightIndex - 1, true);
        if (optionEls[highlightIndex]) optionEls[highlightIndex].focus({ preventScroll: true });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        commitIndex(highlightIndex);
      } else if (e.key === "Home") {
        e.preventDefault();
        setHighlight(0, true);
        if (optionEls[0]) optionEls[0].focus({ preventScroll: true });
      } else if (e.key === "End") {
        e.preventDefault();
        setHighlight(getOptionCount() - 1, true);
        if (optionEls[highlightIndex]) optionEls[highlightIndex].focus({ preventScroll: true });
      }
    });

    list.addEventListener("pointerdown", function (e) {
      var li = e.target.closest(".custom-select__option");
      if (!li || !list.contains(li)) return;
      e.preventDefault();
    });

    list.addEventListener("click", function (e) {
      var li = e.target.closest(".custom-select__option");
      if (!li || !list.contains(li)) return;
      var idx = parseInt(li.getAttribute("data-index"), 10);
      if (!isNaN(idx)) commitIndex(idx);
    });

    list.addEventListener("pointermove", function (e) {
      var li = e.target.closest(".custom-select__option");
      if (!li || !list.contains(li)) return;
      var idx = parseInt(li.getAttribute("data-index"), 10);
      if (!isNaN(idx) && idx !== highlightIndex) {
        setHighlight(idx, false);
      }
    });

    wrap.addEventListener("focusout", function (e) {
      if (!isOpen) return;
      var rt = e.relatedTarget;
      if (!rt || !wrap.contains(rt)) {
        close();
      }
    });
  }

  function init() {
    document.querySelectorAll(".support-section [data-custom-select]").forEach(setupCustomSelect);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/**
 * 사전예약(pre-reservation.html): 모델 카드 선택 + 컬러 스와치 이미지 교체
 */
(function () {
  function initPreReservationModelSelect() {
    var root = document.querySelector(".pre-form-area");
    if (!root) return;

    var cards = root.querySelectorAll(".model-card");
    var badge = document.getElementById("selectedModelBadge");

    function setBadgeFromCard(card) {
      if (!badge || !card) return;
      var name = card.getAttribute("data-model");
      badge.textContent = name ? name + " 선택 중" : "";
    }

    function syncSwatchDisabled() {
      root.querySelectorAll(".model-card").forEach(function (card) {
        var on = card.classList.contains("active");
        card.querySelectorAll(".swatch").forEach(function (sw) {
          sw.disabled = !on;
          sw.setAttribute("aria-disabled", on ? "false" : "true");
        });
      });
    }

    function activateCard(card) {
      cards.forEach(function (c) {
        c.classList.remove("active");
      });
      if (card) {
        card.classList.add("active");
        setBadgeFromCard(card);
      }
      syncSwatchDisabled();
    }

    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener("click", function () {
        activateCard(card);
      });
    });

    var initiallyActive = root.querySelector(".model-card.active");
    if (initiallyActive) {
      setBadgeFromCard(initiallyActive);
    }
    syncSwatchDisabled();

    root.querySelectorAll(".swatch").forEach(function (swatch) {
      swatch.addEventListener("click", function (e) {
        e.stopPropagation();
        if (swatch.disabled) return;
        var wraps = swatch.closest(".color-swatches");
        if (!wraps) return;
        var targetId = wraps.getAttribute("data-target");
        var prefix = wraps.getAttribute("data-prefix") || "";
        var idx = swatch.getAttribute("data-idx");
        if (!targetId || idx == null || idx === "") return;
        var img = document.getElementById(targetId);
        if (img) {
          img.src = prefix + idx + ".png";
        }
        wraps.querySelectorAll(".swatch").forEach(function (s) {
          s.classList.remove("active");
        });
        swatch.classList.add("active");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPreReservationModelSelect);
  } else {
    initPreReservationModelSelect();
  }
})();

/**
 * 사전예약·고객지원 폼: 필수 입력 검증 + 접수 완료 alert (novalidate + 커스텀 메시지)
 */
(function () {
  var REQUIRED_MSG = "필수 항목을 모두 입력해 주세요.";
  var ALERT_BY_FORM_ID = {
    preReserveForm: "사전예약 신청이 접수되었습니다.",
    "support-inquiry-form": "문의가 접수되었습니다."
  };

  function isFilled(el) {
    if (!el) return true;
    if (el.type === "checkbox") return el.checked;
    if (el.tagName === "SELECT") return el.value !== "" && el.value != null;
    var v = (el.value || "").trim();
    if (v === "") return false;
    if (el.type === "email" && typeof el.checkValidity === "function") {
      return el.checkValidity();
    }
    return true;
  }

  function firstInvalidRequired(form) {
    var list = form.querySelectorAll("[required]");
    for (var i = 0; i < list.length; i++) {
      if (!isFilled(list[i])) return list[i];
    }
    return null;
  }

  function focusEl(el) {
    if (!el) return;
    try {
      if (el.type === "hidden") return;
      if (el.tagName === "SELECT") {
        var wrap = el.closest("[data-custom-select]");
        if (wrap && wrap.classList.contains("is-ready")) {
          var tr = wrap.querySelector(".custom-select__trigger");
          if (tr) {
            tr.focus({ preventScroll: false });
            return;
          }
        }
      }
      el.focus({ preventScroll: false });
    } catch (e) {
      /* noop */
    }
  }

  function onSubmit(form, e) {
    e.preventDefault();
    var bad = firstInvalidRequired(form);
    if (bad) {
      alert(REQUIRED_MSG);
      focusEl(bad);
      return;
    }
    var msg = ALERT_BY_FORM_ID[form.id];
    if (!msg) msg = "접수되었습니다.";
    alert(msg);
  }

  function bind(form) {
    if (!form || form.getAttribute("data-form-validate-bound") === "1") return;
    form.setAttribute("data-form-validate-bound", "1");
    form.addEventListener("submit", function (e) {
      onSubmit(form, e);
    });
  }

  function init() {
    bind(document.getElementById("preReserveForm"));
    bind(document.getElementById("support-inquiry-form"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/**
 * FAQ (faq.html): jQuery — 단일 펼침 `slideDown`/`slideUp`, 다중(`exclusiveOpen: false`) `slideToggle`
 */
if (typeof jQuery !== "undefined") {
  jQuery(function ($) {
    var $root = $(".faq-main");
    if (!$root.length) return;

    var exclusiveOpen = true;

    $root.on("click", ".faq-q", function () {
      var $q = $(this);
      var $item = $q.closest(".faq-item");
      var $a = $q.next(".faq-a");

      if (exclusiveOpen && !$item.hasClass("active")) {
        $root.find(".faq-item.active").not($item).each(function () {
          var $other = $(this);
          $other.removeClass("active");
          $other.find(".faq-q").attr("aria-expanded", "false");
          $other.find(".faq-a").stop(true, true).slideUp(300);
        });
      }

      if (!exclusiveOpen) {
        $item.toggleClass("active");
        $a.stop(true, true).slideToggle(300);
        $q.attr("aria-expanded", $item.hasClass("active") ? "true" : "false");
        return;
      }

      $item.toggleClass("active");
      if ($item.hasClass("active")) {
        $a.stop(true, true).slideDown(300);
      } else {
        $a.stop(true, true).slideUp(300);
      }
      $q.attr("aria-expanded", $item.hasClass("active") ? "true" : "false");
    });

    $root.on("keydown", ".faq-q", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        $(this).trigger("click");
      }
    });
  });
}

/**
 * Model — 360° image-sequence viewer (luna / terra)
 * 차량 사이트 방식: 드래그 거리 → 프레임 인덱스 직접 매핑 (페이드 없음)
 */
(function () {
  var viewer = document.querySelector(".model-360-section .viewer-360-wrap");
  if (!viewer) return;

  var frames = viewer.querySelectorAll(".viewer-frames .frame");
  var frameCount = frames.length;
  if (!frameCount) return;

  /* 1보다 크면 같은 드래그 거리에서 더 천천히 회전 */
  var DRAG_SENSITIVITY = 1.35;
  var currentIndex = 0;
  var isDragging = false;
  var dragStartX = 0;
  var dragStartIndex = 0;

  function normalizeIndex(i) {
    return ((i % frameCount) + frameCount) % frameCount;
  }

  function pixelsPerFrame() {
    var w = viewer.offsetWidth || 1;
    return Math.max(8, (w / frameCount) * DRAG_SENSITIVITY);
  }

  function setFrame(index) {
    var next = normalizeIndex(index);
    if (next === currentIndex) return;
    currentIndex = next;
    var i;
    for (i = 0; i < frameCount; i++) {
      frames[i].classList.toggle("active", i === currentIndex);
    }
  }

  function frameFromDrag(clientX) {
    var delta = dragStartX - clientX;
    var offset = Math.round(delta / pixelsPerFrame());
    return normalizeIndex(dragStartIndex + offset);
  }

  function preloadFrames() {
    var i;
    for (i = 0; i < frameCount; i++) {
      var src = frames[i].getAttribute("src");
      if (!src) continue;
      var img = new Image();
      img.decoding = "async";
      img.src = src;
    }
  }

  function pointerX(e) {
    if (e.touches && e.touches.length) return e.touches[0].clientX;
    if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientX;
    return e.clientX;
  }

  function onPointerDown(e) {
    if (e.type === "mousedown" && e.button !== 0) return;
    isDragging = true;
    dragStartX = pointerX(e);
    dragStartIndex = currentIndex;
    viewer.classList.add("is-interacted");
    if (e.type === "touchstart") e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    setFrame(frameFromDrag(pointerX(e)));
    if (e.type === "touchmove") e.preventDefault();
  }

  function onPointerUp(e) {
    if (isDragging && e) {
      setFrame(frameFromDrag(pointerX(e)));
    }
    isDragging = false;
  }

  preloadFrames();

  var active = viewer.querySelector(".viewer-frames .frame.active");
  if (active) {
    var idx = parseInt(active.getAttribute("data-index"), 10);
    if (!isNaN(idx)) currentIndex = normalizeIndex(idx);
  }
  setFrame(currentIndex);

  viewer.addEventListener("mousedown", onPointerDown);
  viewer.addEventListener("mousemove", onPointerMove);
  viewer.addEventListener("mouseup", onPointerUp);
  viewer.addEventListener("mouseleave", onPointerUp);

  viewer.addEventListener("touchstart", onPointerDown, { passive: false });
  viewer.addEventListener("touchmove", onPointerMove, { passive: false });
  viewer.addEventListener("touchend", onPointerUp);
  viewer.addEventListener("touchcancel", onPointerUp);

  viewer.setAttribute("role", "img");
  viewer.setAttribute("aria-label", "360도 차량 뷰어. 좌우로 드래그하여 회전할 수 있습니다.");
})();

// api
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
  mapOption = {
    center: new kakao.maps.LatLng(37.452105, 126.702796), // 지도의 중심좌표
    level: 4 // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var imageSrc = 'https://www.pngarts.com/files/3/Map-Marker-Pin-PNG-Transparent-Image.png', // 마커이미지의 주소입니다    
  imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
  imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
  markerPosition = new kakao.maps.LatLng(37.452105, 126.702796); // 마커가 표시될 위치입니다

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
  position: markerPosition,
  image: markerImage // 마커이미지 설정 
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);