/**
 * ZEION — GNB 스크롤 & 모바일 메뉴
 * - 최상단(scrollY === 0): 투명
 * - 아래로 스크롤: header-hidden
 * - 위로 스크롤: header-active + 상단 고정, 배경 rgba(80,80,80,0.5)
 * - 모바일(≤768px, CSS와 동일): 햄버거 토글, 모델 아코디언
 * - 반응형 중단점(style.css): 1280 / 1024 / 768 / 540
 */
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var bottomBar = document.querySelector(".bottom-bar");

  var lastScrollY = window.scrollY || 0;
  var scrollThreshold = 6;
  var scrollDownMinY = 48;
  var mqDesktopNav = window.matchMedia("(min-width: 769px)");

  /** 데스크톱 LNB: ‘모델’ 링크 중앙이 헤더 하단 패널과 맞도록 */
  function positionModelsLnb() {
    if (!mqDesktopNav.matches) return;
    var trigger = document.querySelector(
      ".site-header__item--models .site-header__dropdown > a"
    );
    var subInner = document.querySelector(".site-header__subnav-inner");
    if (!trigger || !subInner) return;
    var tr = trigger.getBoundingClientRect();
    var ir = subInner.getBoundingClientRect();
    var centerX = tr.left + tr.width / 2 - ir.left;
    subInner.style.setProperty("--lnb-left", Math.round(centerX) + "px");
  }

  /** 데스크톱 LNB: hover만으로 유지/클릭 가능하도록( :has 미지원 브라우저 대응 ) */
  var modelsTrigger = document.querySelector(
    ".site-header__item--models .site-header__dropdown"
  );
  var modelsSubnav = document.querySelector(".site-header__subnav");
  var modelsCloseTimer = null;

  function openModelsSubnav() {
    if (!mqDesktopNav.matches) return;
    if (!modelsSubnav) return;
    if (modelsCloseTimer) {
      window.clearTimeout(modelsCloseTimer);
      modelsCloseTimer = null;
    }
    header.classList.add("models-open");
    modelsSubnav.setAttribute("aria-hidden", "false");
    positionModelsLnb();
  }

  function closeModelsSubnav() {
    if (!modelsSubnav) return;
    header.classList.remove("models-open");
    modelsSubnav.setAttribute("aria-hidden", "true");
  }

  function scheduleCloseModelsSubnav() {
    if (modelsCloseTimer) window.clearTimeout(modelsCloseTimer);
    modelsCloseTimer = window.setTimeout(function () {
      closeModelsSubnav();
    }, 120);
  }

  if (modelsTrigger && modelsSubnav) {
    modelsTrigger.addEventListener("mouseenter", openModelsSubnav);
    modelsTrigger.addEventListener("mouseleave", scheduleCloseModelsSubnav);
    modelsTrigger.addEventListener("focusin", openModelsSubnav);
    modelsTrigger.addEventListener("focusout", scheduleCloseModelsSubnav);

    modelsSubnav.addEventListener("mouseenter", openModelsSubnav);
    modelsSubnav.addEventListener("mouseleave", scheduleCloseModelsSubnav);
    modelsSubnav.addEventListener("focusin", openModelsSubnav);
    modelsSubnav.addEventListener("focusout", scheduleCloseModelsSubnav);
  }

  /** 푸터 진입 시 바를 뷰포트 하단이 아니라 푸터 상단(조인~푸터 사이)에 맞춤 */
  function syncBottomBarDock() {
    if (!bottomBar) return;
    if (bottomBar.classList.contains("bottom-bar--dock-top")) {
      bottomBar.style.removeProperty("--bottom-bar-dock");
      return;
    }
    var footer = document.querySelector(".footer");
    if (!footer) {
      bottomBar.style.removeProperty("--bottom-bar-dock");
      return;
    }
    var vh = window.innerHeight;
    var footerTop = footer.getBoundingClientRect().top;
    var dock = Math.max(0, Math.round(vh - footerTop));
    bottomBar.style.setProperty("--bottom-bar-dock", dock + "px");
  }

  function syncHeaderScroll() {
    var y = window.scrollY || 0;

    if (y <= 0) {
      header.classList.remove("header-active");
      header.classList.remove("header-hidden");
    } else {
      if (y < lastScrollY - scrollThreshold) {
        header.classList.remove("header-hidden");
        header.classList.add("header-active");
      } else if (y > lastScrollY + scrollThreshold && y > scrollDownMinY) {
        header.classList.add("header-hidden");
        header.classList.remove("header-active");
      }
    }

    if (bottomBar) {
      var modelKv = document.querySelector(".sub-kv-section.model-kv");
      var lunaBottomDock =
        bottomBar.classList.contains("bottom-bar--light") && modelKv;

      if (lunaBottomDock) {
        var kvH = modelKv.offsetHeight || 0;
        var pastKv = kvH > 0 && y >= kvH - 1;
        bottomBar.classList.toggle("bottom-bar--dock-top", pastKv);
        if (pastKv) {
          bottomBar.classList.add("scrolled");
        } else {
          bottomBar.classList.remove("scrolled");
        }
      } else {
        bottomBar.classList.remove("bottom-bar--dock-top");
        if (y >= 100) bottomBar.classList.add("scrolled");
        else bottomBar.classList.remove("scrolled");
      }

      syncBottomBarDock();
    }

    lastScrollY = y;
    positionModelsLnb();
  }

  window.addEventListener("scroll", syncHeaderScroll, { passive: true });
  window.addEventListener("resize", function () {
    lastScrollY = window.scrollY || 0;
    syncHeaderScroll();
    positionModelsLnb();
    if (mqDesktopNav.matches) {
      closeMobileMenu();
    } else {
      closeModelsSubnav();
    }
  });

  syncHeaderScroll();
  positionModelsLnb();
  window.addEventListener("load", positionModelsLnb);

  /* ----- Mobile drawer ----- */
  var drawer = document.getElementById("mobile-drawer");
  var toggle = document.querySelector(".site-header__menu-toggle");
  var backdrop = document.querySelector(".mobile-drawer__backdrop");

  function closeMobileMenu() {
    if (!drawer || !toggle) return;
    drawer.classList.remove("mobile-drawer--open");
    drawer.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "메뉴 열기");
    document.body.classList.remove("mobile-nav-open");
    closeAccordion();
  }

  function openMobileMenu() {
    if (!drawer || !toggle) return;
    drawer.classList.add("mobile-drawer--open");
    drawer.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "메뉴 닫기");
    document.body.classList.add("mobile-nav-open");
  }

  function closeAccordion() {
    var accItem = document.querySelector(".mobile-drawer__item--accordion");
    var btn = document.querySelector(".mobile-drawer__accordion-btn");
    if (accItem) accItem.classList.remove("mobile-drawer__item--open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      if (drawer.classList.contains("mobile-drawer--open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMobileMenu);
  }

  var accBtn = document.querySelector(".mobile-drawer__accordion-btn");
  var accItem = document.querySelector(".mobile-drawer__item--accordion");

  if (accBtn && accItem) {
    accBtn.addEventListener("click", function () {
      var open = accItem.classList.toggle("mobile-drawer__item--open");
      accBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var drawerNav = document.querySelector(".mobile-drawer__nav");
  if (drawerNav) {
    drawerNav.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      if (a.classList.contains("mobile-drawer__link") || a.classList.contains("mobile-drawer__lnb-link")) {
        closeMobileMenu();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("mobile-drawer--open")) {
      closeMobileMenu();
      if (toggle) toggle.focus();
    }
  });
})();

/**
 * Features Swiper — fade + autoplay + tab sync
 */
(function () {
  var section = document.querySelector(".features-section");
  var swiperEl = document.querySelector(".feature-swiper");
  if (!section || !swiperEl) return;

  if (typeof Swiper === "undefined") return;
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  var tabs = section.querySelectorAll(".feature-tabs .tab-item");
  var totalSlides = swiperEl.querySelectorAll(".swiper-slide").length;

  function setActiveTab(index) {
    tabs.forEach(function (t) {
      var on = Number(t.getAttribute("data-index")) === index;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  var featureSwiper = new Swiper(swiperEl, {
    effect: "fade",
    fadeEffect: { crossFade: true },
    // 스크롤 기반 전환(pinning)과 충돌 방지: 자동 재생 제거
    autoplay: false,
    loop: false,
    speed: 800,
    on: {
      slideChange: function () {
        setActiveTab(this.activeIndex);
      },
    },
  });

  // 이 섹션은 스크롤(핀 + scrub)로만 슬라이드가 바뀌어야 하므로,
  // 탭 UI는 표시만 하고 클릭/키보드 조작으로는 전환되지 않게 잠금 처리.
  tabs.forEach(function (tab) {
    tab.setAttribute("tabindex", "-1");
    tab.setAttribute("aria-disabled", "true");
  });

  setActiveTab(0);

  // Pin + scroll → slide 전환
  if (hasGsap && totalSlides > 1) {
    var lastIndex = -1;

    function setPinnedTabFocusLocked(locked) {
      // 핀 스크롤 중에는 키보드 Tab 포커스가 섹션 내 UI로 들어오지 않게 막음
      // (스크롤로만 슬라이드 전환되게)
      tabs.forEach(function (t) {
        if (locked) {
          if (!t.hasAttribute("data-prev-tabindex")) {
            var prev = t.getAttribute("tabindex");
            t.setAttribute("data-prev-tabindex", prev === null ? "" : prev);
          }
          t.setAttribute("tabindex", "-1");
          t.setAttribute("aria-disabled", "true");
        } else {
          var prevVal = t.getAttribute("data-prev-tabindex");
          if (prevVal === "") t.removeAttribute("tabindex");
          else if (prevVal != null) t.setAttribute("tabindex", prevVal);
          t.removeAttribute("data-prev-tabindex");
          t.removeAttribute("aria-disabled");
        }
      });
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: function () {
        // 슬라이드 개수에 비례하여 스크롤 구간 확보
        return "+=" + (window.innerHeight * (totalSlides - 1));
      },
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: function () {
        setPinnedTabFocusLocked(true);
      },
      onEnterBack: function () {
        setPinnedTabFocusLocked(true);
      },
      onLeave: function () {
        setPinnedTabFocusLocked(false);
      },
      onLeaveBack: function () {
        setPinnedTabFocusLocked(false);
      },
      onUpdate: function (self) {
        var idx = Math.round(self.progress * (totalSlides - 1));
        idx = Math.max(0, Math.min(totalSlides - 1, idx));
        if (idx === lastIndex) return;
        lastIndex = idx;
        featureSwiper.slideTo(idx);
      },
      onRefresh: function () {
        lastIndex = featureSwiper.activeIndex;
      },
    });
  }
 })();

/**
 * Main model — swiper + corner-expand (clip-path)
 */
(function () {
  var section = document.querySelector(".main-model-section");
  if (!section) return;

  var imageWrap = section.querySelector(".image-content-wrap");
  var swiperEl = section.querySelector(".main-model-swiper");
  var tabs = section.querySelectorAll(".model-tabs .tab-btn");
  if (!imageWrap || !swiperEl || tabs.length < 2) return;

  var modelSwiper = null;
  if (typeof Swiper !== "undefined") {
    modelSwiper = new Swiper(swiperEl, {
      effect: "cards",
      loop: true,
      speed: 520,
      grabCursor: true,
      allowTouchMove: true,
      cardsEffect: {
        perSlideOffset: 10,
        perSlideRotate: 0,
        slideShadows: false,
      },
    });
  }

  function setActiveTab(target) {
    tabs.forEach(function (btn) {
      var on = btn.getAttribute("data-target") === target;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-target");
      setActiveTab(target);
      if (modelSwiper) modelSwiper.slideToLoop(target === "ze-x" ? 1 : 0);
    });
  });

  if (modelSwiper) {
    modelSwiper.on("slideChange", function () {
      var idx = modelSwiper.realIndex;
      setActiveTab(idx === 1 ? "ze-x" : "ze-1");
    });

    swiperEl.addEventListener("click", function (e) {
      // 클릭하면 겹친 카드가 앞으로 나오도록 다음 슬라이드로 전환
      if (!e.target.closest(".swiper-slide")) return;
      modelSwiper.slideNext();
    });
  }
  setActiveTab("ze-1");

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  var mmInsetDesktop = {
    "--mm-inset-top": "42%",
    "--mm-inset-right": "25%",
    "--mm-inset-bottom": "12%",
    "--mm-inset-left": "25%",
  };

  var mmInsetMobile = {
    "--mm-inset-top": "48%",
    "--mm-inset-right": "10%",
    "--mm-inset-bottom": "18%",
    "--mm-inset-left": "10%",
  };

  var mmInsetFull = {
    "--mm-inset-top": "0%",
    "--mm-inset-right": "0%",
    "--mm-inset-bottom": "0%",
    "--mm-inset-left": "0%",
  };

  function mmScrollTween(fromVars) {
    return gsap.fromTo(imageWrap, fromVars, {
      "--mm-inset-top": mmInsetFull["--mm-inset-top"],
      "--mm-inset-right": mmInsetFull["--mm-inset-right"],
      "--mm-inset-bottom": mmInsetFull["--mm-inset-bottom"],
      "--mm-inset-left": mmInsetFull["--mm-inset-left"],
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 66.667%",
        end: "top 20%",
        scrub: 1.1,
        invalidateOnRefresh: true,
      },
    });
  }

  var mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", function () {
    var tween = mmScrollTween(mmInsetDesktop);
    return function () {
      var st = tween.scrollTrigger;
      if (st) st.kill();
      tween.kill();
    };
  });

  mm.add("(max-width: 768px)", function () {
    var tween = mmScrollTween(mmInsetMobile);
    return function () {
      var st = tween.scrollTrigger;
      if (st) st.kill();
      tween.kill();
    };
  });
})();

/**
 * Stats section — ScrollTrigger + 숫자 카운트 (data-target, 소수점은 toFixed(1))
 */
(function () {
  var section = document.querySelector(".stats-section");
  if (!section) return;

  var headline = section.querySelector(".stats-headline");
  var counters = section.querySelectorAll(".counter[data-target]");
  if (!counters.length) return;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  if (headline) {
    gsap.from(headline, {
      y: 24,
      opacity: 0,
      duration: 1.25,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reset",
      },
    });
  }

  function formatCounterText(rawTarget, value) {
    var raw = String(rawTarget);
    if (raw.indexOf(".") !== -1) {
      return value.toFixed(1);
    }
    return String(Math.round(value));
  }

  var states = [];

  function resetCountersToZero() {
    states.forEach(function (item) {
      item.state.value = 0;
      item.el.textContent = formatCounterText(item.rawTarget, 0);
    });
  }

  // 초기 텍스트도 0으로 강제 (뒤로가기/새로고침 등에서도 일관성)
  counters.forEach(function (el) {
    var rawTarget = el.getAttribute("data-target");
    resetCountersToZero();
  });

  var tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out" },
  });

  counters.forEach(function (el) {
    var rawTarget = el.getAttribute("data-target");
    var target = parseFloat(rawTarget);
    if (isNaN(target)) return;

    var state = { value: 0 };
    states.push({ el: el, rawTarget: rawTarget, state: state });

    tl.to(
      state,
      {
        value: target,
        duration: 2,
        onUpdate: function () {
          el.textContent = formatCounterText(rawTarget, state.value);
        },
      },
      0
    );
  });

  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    end: "bottom 20%",
    onEnter: function () {
      tl.play(0);
    },
    onEnterBack: function () {
      tl.play(0);
    },
    onLeave: function () {
      tl.pause(0);
      resetCountersToZero();
    },
    onLeaveBack: function () {
      tl.pause(0);
      resetCountersToZero();
    },
  });
})();

/**
 * ESG video section — cinematic text reveal
 */
(function () {
  var section = document.querySelector(".esg-video-section");
  if (!section) return;

  var box = section.querySelector(".esg-content-box");
  if (!box) return;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  var dim = section.querySelector(".esg-video-section__dim");
  var text = box.querySelector(".esg-main-text");

  // Pin + scrub: 시네마틱 텍스트 변주
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: function () {
        return "+=" + Math.round(window.innerHeight * 1.25);
      },
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });

  // 0 → 1: 등장/포커스
  tl.fromTo(
    box,
    { y: 40, opacity: 0, filter: "blur(6px)" },
    { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.35 },
    0
  );

  // 중반: 텍스트 살짝 확대 + 자간 미세 조정
  // 텍스트는 과한 scale/letterSpacing 변주 대신,
  // 자연스러운 페이드업 + 미세한 투명도 변화만 적용
  if (text) {
    tl.fromTo(
      text,
      { y: 18, opacity: 0, filter: "blur(2px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.45 },
      0.15
    ).to(text, { opacity: 0.92, duration: 0.35 }, 0.8);
  }

  // 배경 딤도 함께 변주 (텍스트 가독성 강화)
  if (dim) {
    tl.fromTo(
      dim,
      { opacity: 0.65 },
      { opacity: 0.85, duration: 0.6 },
      0.2
    ).to(dim, { opacity: 0.7, duration: 0.35 }, 0.85);
  }
})();

/**
 * News section — Swiper (ZEION NOW)
 */
(function () {
  var section = document.querySelector(".news-section");
  var swiperEl = document.querySelector(".news-swiper");
  if (!section || !swiperEl) return;

  if (typeof Swiper === "undefined") return;

  new Swiper(swiperEl, {
    slidesPerView: 3,
    spaceBetween: 40,
    loop: true,
    speed: 650,
    navigation: {
      nextEl: ".news-next",
      prevEl: ".news-prev",
    },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 28 },
      1024: { slidesPerView: 3, spaceBetween: 40 },
    },
  });
})();

/**
 * Index join — 배경 세로 리빌 + 콘텐츠는 y만 스크럽(opacity 미사용)
 */
(function () {
  var section = document.querySelector(".index-join-section");
  if (!section) return;

  var content = section.querySelector(".content-group");
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  /* 스크롤 시 아래쪽이 더 드러나도록 Y를 크게 이동 */
  tl.fromTo(
    section,
    { backgroundPosition: "50% 42%" },
    { backgroundPosition: "50% 100%", ease: "none", duration: 1 },
    0
  );

  if (content) {
    tl.fromTo(
      content,
      { y: 100 },
      { y: 0, ease: "none", duration: 0.88 },
      0.08
    );
  }
})();
