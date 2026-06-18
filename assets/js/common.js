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

  /** 레이아웃 뷰포트 높이(주소창 등으로 innerHeight만 쓸 때와 어긋나는 경우 완화) */
  function getLayoutViewportHeight() {
    var el = document.documentElement;
    if (el && el.clientHeight) return el.clientHeight;
    return window.innerHeight || 0;
  }

  /** 푸터 진입 시 바를 뷰포트 하단이 아니라 푸터 상단에 맞춤 — 실측으로 틈·겹침 보정 */
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
    var vh = getLayoutViewportHeight();
    var footerTop = footer.getBoundingClientRect().top;
    var dock = Math.max(0, Math.round(vh - footerTop));
    bottomBar.style.setProperty("--bottom-bar-dock", dock + "px");

    var i;
    for (i = 0; i < 3; i++) {
      void bottomBar.offsetHeight;
      var barBottom = bottomBar.getBoundingClientRect().bottom;
      var ft = footer.getBoundingClientRect().top;
      var gap = ft - barBottom;
      if (Math.abs(gap) < 0.35) break;
      if (gap > 0) {
        dock = Math.max(0, dock - Math.round(gap));
      } else {
        dock = dock + Math.round(-gap);
      }
      bottomBar.style.setProperty("--bottom-bar-dock", dock + "px");
    }
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
      requestAnimationFrame(syncBottomBarDock);
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

  if (typeof ScrollTrigger !== "undefined" && typeof ScrollTrigger.addEventListener === "function") {
    ScrollTrigger.addEventListener("refresh", function () {
      syncBottomBarDock();
    });
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener(
      "resize",
      function () {
        syncBottomBarDock();
      },
      { passive: true }
    );
    window.visualViewport.addEventListener(
      "scroll",
      function () {
        syncBottomBarDock();
      },
      { passive: true }
    );
  }

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
    if (typeof window.__zeionRefreshScrollTop === "function") {
      window.__zeionRefreshScrollTop();
    }
  }

  function openMobileMenu() {
    if (!drawer || !toggle) return;
    drawer.classList.add("mobile-drawer--open");
    drawer.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "메뉴 닫기");
    document.body.classList.add("mobile-nav-open");
    if (typeof window.__zeionRefreshScrollTop === "function") {
      window.__zeionRefreshScrollTop();
    }
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

  /** [0]=ZE-1(초기), [1]=ZE-X. 왼쪽(다음)=ZE-1→ZE-X, ZE-X에서 왼쪽 막힘. 오른쪽(이전)=ZE-X→ZE-1, ZE-1에서 오른쪽 막힘. */
  function applyModelSwipeLocks(sw) {
    if (!sw || sw.destroyed) return;
    var i = sw.activeIndex;
    sw.allowSlideNext = i === 0;
    sw.allowSlidePrev = i === 1;
  }

  if (typeof Swiper !== "undefined") {
    // 슬라이드 순서: [0]=ZE-1, [1]=ZE-X — 초기 ZE-1. fade. 경계는 applyModelSwipeLocks로 고정.
    modelSwiper = new Swiper(swiperEl, {
      effect: "fade",
      fadeEffect: { crossFade: true },
      loop: false,
      speed: 650,
      grabCursor: true,
      allowTouchMove: true,
      initialSlide: 0,
      slidesPerView: 1,
      on: {
        init: function () {
          applyModelSwipeLocks(this);
        },
        slideChange: function () {
          applyModelSwipeLocks(this);
        },
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
      if (modelSwiper) {
        modelSwiper.slideTo(target === "ze-1" ? 0 : 1);
        applyModelSwipeLocks(modelSwiper);
      }
    });
  });

  if (modelSwiper) {
    modelSwiper.on("slideChange", function () {
      var idx = modelSwiper.activeIndex;
      setActiveTab(idx === 0 ? "ze-1" : "ze-x");
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
      y: 40,
      autoAlpha: 0,
      duration: 0.95,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 88%",
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

  // 박스: 블러 해제 + 살짝 커지며 등장
  tl.fromTo(
    box,
    { y: 48, opacity: 0, scale: 0.94, filter: "blur(8px)" },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.4,
      ease: "power2.out",
    },
    0
  );

  // 본문: 작은 상태에서 크게 올라오는 시네마틱 리빌 → 정착
  if (text) {
    tl.fromTo(
      text,
      {
        y: 36,
        opacity: 0,
        scale: 0.82,
        letterSpacing: "0.14em",
        filter: "blur(4px)",
        textShadow: "0 0 0 rgba(255,255,255,0)",
      },
      {
        y: 0,
        opacity: 1,
        scale: 1.08,
        letterSpacing: "0.03em",
        filter: "blur(0px)",
        textShadow: "0 0 48px rgba(255,255,255,0.22)",
        duration: 0.52,
        ease: "power3.out",
      },
      0.08
    )
      .to(
        text,
        {
          scale: 1,
          letterSpacing: "0em",
          textShadow: "0 0 28px rgba(255,255,255,0.12)",
          duration: 0.42,
          ease: "power2.inOut",
        },
        0.48
      )
      .to(text, { opacity: 0.98, scale: 1.01, duration: 0.28, ease: "sine.inOut" }, 0.82);
  }

  // 배경 딤도 함께 변주 (텍스트 가독성 강화)
  if (dim) {
    tl.fromTo(
      dim,
      { opacity: 0.55 },
      { opacity: 0.88, duration: 0.55, ease: "power1.out" },
      0.12
    ).to(dim, { opacity: 0.72, duration: 0.4, ease: "sine.inOut" }, 0.78);
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

/**
 * 맨 위로 플로팅 버튼 (전 페이지 · style.css .scroll-top-btn)
 */
(function () {
  if (document.querySelector(".scroll-top-btn")) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "scroll-top-btn";
  btn.setAttribute("aria-label", "페이지 맨 위로 이동");
  var icon = document.createElement("i");
  icon.className = "fa-solid fa-chevron-up";
  icon.setAttribute("aria-hidden", "true");
  btn.appendChild(icon);
  document.body.appendChild(btn);

  function refreshScrollTopBtn() {
    if (document.body.classList.contains("mobile-nav-open")) {
      btn.classList.remove("is-visible");
      return;
    }
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    btn.classList.toggle("is-visible", y > 320);
  }

  window.__zeionRefreshScrollTop = refreshScrollTopBtn;

  window.addEventListener("scroll", refreshScrollTopBtn, { passive: true });
  window.addEventListener("resize", refreshScrollTopBtn, { passive: true });
  window.addEventListener("load", refreshScrollTopBtn);

  btn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
})();

/**
 * 헤더 차량 아이콘 — 구매 상담 빠른 문의 모달 (전 페이지 · style.css)
 */
(function () {
  var triggers = document.querySelectorAll(".site-header__navi-car");
  if (!triggers.length) return;

  var MODAL_ID = "navi-consult-modal";
  var DIALOG_ID = "navi-consult-modal-dialog";

  function supportPageHref() {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    if (path.indexOf("/subpage/") !== -1) return "support.html";
    if (path.indexOf("subpage/") !== -1) return "support.html";
    return "subpage/support.html";
  }

  function ensureModal() {
    var existing = document.getElementById(MODAL_ID);
    if (existing) return existing;

    var wrap = document.createElement("div");
    wrap.id = MODAL_ID;
    wrap.className = "navi-consult-modal";
    wrap.setAttribute("hidden", "");
    wrap.setAttribute("aria-hidden", "true");

    wrap.innerHTML =
      '<button type="button" class="navi-consult-modal__backdrop" data-navi-consult-close aria-label="상담 창 닫기"></button>' +
      '<div id="' +
      DIALOG_ID +
      '" class="navi-consult-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="navi-consult-modal-title" tabindex="-1">' +
      '<button type="button" class="navi-consult-modal__close" data-navi-consult-close aria-label="닫기">' +
      '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
      "</button>" +
      '<h2 id="navi-consult-modal-title" class="navi-consult-modal__title">구매 상담</h2>' +
      '<p class="navi-consult-modal__lead">상담을 남겨주시면 담당자가 확인 후 연락드리겠습니다.</p>' +
      '<form class="navi-consult-modal__form" id="navi-consult-form" action="#" novalidate>' +
      '<div class="navi-consult-modal__field">' +
      '<label for="navi-consult-name">이름 <span class="req" aria-hidden="true">*</span></label>' +
      '<input type="text" id="navi-consult-name" name="name" required autocomplete="name" placeholder="이름을 입력해 주세요">' +
      "</div>" +
      '<div class="navi-consult-modal__field">' +
      '<label for="navi-consult-phone">연락처 <span class="req" aria-hidden="true">*</span></label>' +
      '<input type="tel" id="navi-consult-phone" name="phone" required inputmode="numeric" autocomplete="tel" placeholder="숫자만 입력 (예: 01012345678)">' +
      "</div>" +
      '<div class="navi-consult-modal__field">' +
      '<label for="navi-consult-email">이메일</label>' +
      '<input type="email" id="navi-consult-email" name="email" autocomplete="email" placeholder="답변 받으실 이메일 (선택)">' +
      "</div>" +
      '<div class="navi-consult-modal__field">' +
      '<label for="navi-consult-msg">문의 내용 <span class="req" aria-hidden="true">*</span></label>' +
      '<textarea id="navi-consult-msg" name="message" required rows="4" placeholder="문의 내용을 입력해 주세요"></textarea>' +
      "</div>" +
      '<label class="navi-consult-modal__agree">' +
      '<input type="checkbox" id="navi-consult-agree" name="privacy" value="1" required>' +
      "<span>개인정보 수집·이용에 동의합니다. (문의 처리 목적, 처리 완료 후 파기)</span>" +
      "</label>" +
      '<button type="submit" class="navi-consult-modal__submit">상담 요청하기</button>' +
      "</form>" +
      '<p class="navi-consult-modal__more"><a href="#">자세한 문의는 문의하기 페이지에서</a></p>' +
      "</div>";

    document.body.appendChild(wrap);

    var more = wrap.querySelector(".navi-consult-modal__more a");
    if (more) more.href = supportPageHref();

    return wrap;
  }

  var modal = ensureModal();
  var dialog = document.getElementById(DIALOG_ID);
  var form = document.getElementById("navi-consult-form");
  var lastTrigger = null;

  function isOpen() {
    return modal.classList.contains("is-open");
  }

  function openModal(trigger) {
    lastTrigger = trigger || null;
    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("navi-consult-modal-open");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    window.setTimeout(function () {
      if (dialog && typeof dialog.focus === "function") dialog.focus();
    }, 10);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("navi-consult-modal-open");
    var triggers = document.querySelectorAll(".site-header__navi-car");
    var i;
    for (i = 0; i < triggers.length; i++) {
      triggers[i].setAttribute("aria-expanded", "false");
    }
    if (form && typeof form.reset === "function") form.reset();
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  function onNaviCarClick(e) {
    var t = e.currentTarget;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openModal(t);
  }

  var k;
  for (k = 0; k < triggers.length; k++) {
    triggers[k].setAttribute("aria-haspopup", "dialog");
    triggers[k].setAttribute("aria-expanded", "false");
    triggers[k].setAttribute("aria-controls", DIALOG_ID);
    triggers[k].addEventListener("click", onNaviCarClick);
  }

  modal.addEventListener("click", function (e) {
    if (e.target.closest("[data-navi-consult-close]")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      e.preventDefault();
      closeModal();
    }
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      closeModal();
    });
  }
})();

/**
 * 푸터 — 이용약관 · 개인정보 처리방침 모달 (전 페이지)
 */
(function () {
  var MODAL_ID = "legal-modal";
  var DIALOG_ID = "legal-modal-dialog";
  var TITLE_ID = "legal-modal-title";

  var LEGAL_CONTENT = {
    terms: {
      title: "이용약관",
      updated: "시행일: 2026년 1월 1일",
      html:
        "<h3>제1조 (목적)</h3>" +
        "<p>본 약관은 ZEION MOTORS CO., LTD.(이하 \"회사\")가 운영하는 웹사이트 및 관련 서비스(이하 \"서비스\")의 이용 조건 및 절차, 회사와 이용자의 권리·의무를 규정함을 목적으로 합니다.</p>" +
        "<h3>제2조 (약관의 효력 및 변경)</h3>" +
        "<p>본 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 시행일 7일 전부터 공지합니다.</p>" +
        "<h3>제3조 (서비스의 제공)</h3>" +
        "<p>회사는 다음과 같은 서비스를 제공합니다.</p>" +
        "<ul>" +
        "<li>브랜드·모델 정보 및 카탈로그 제공</li>" +
        "<li>사전예약, 구매 상담, 고객 문의 접수</li>" +
        "<li>기타 회사가 정하는 서비스</li>" +
        "</ul>" +
        "<h3>제4조 (이용자의 의무)</h3>" +
        "<p>이용자는 관계 법령, 본 약관 및 서비스 이용 안내를 준수해야 하며, 타인의 정보를 도용하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.</p>" +
        "<h3>제5조 (면책)</h3>" +
        "<p>회사는 천재지변, 시스템 점검, 통신 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다. 단, 회사의 고의 또는 중대한 과실이 있는 경우는 예외로 합니다.</p>" +
        "<h3>제6조 (문의)</h3>" +
        "<p>서비스 이용과 관련한 문의는 support@zeion.com 으로 연락해 주시기 바랍니다.</p>",
    },
    privacy: {
      title: "개인정보 처리방침",
      updated: "시행일: 2026년 1월 1일",
      html:
        "<p>ZEION MOTORS CO., LTD.(이하 \"회사\")는 개인정보 보호법 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위해 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>" +
        "<h3>1. 수집하는 개인정보 항목</h3>" +
        "<ul>" +
        "<li>필수: 이름, 연락처, 이메일, 문의 내용</li>" +
        "<li>선택: 회사명, 문의 유형</li>" +
        "<li>자동 수집: 접속 로그, 쿠키, IP 주소(서비스 개선 목적)</li>" +
        "</ul>" +
        "<h3>2. 개인정보의 수집·이용 목적</h3>" +
        "<ul>" +
        "<li>사전예약·구매 상담·고객 문의 응대 및 처리 결과 회신</li>" +
        "<li>서비스 품질 개선 및 통계 분석</li>" +
        "<li>관련 법령에 따른 의무 이행</li>" +
        "</ul>" +
        "<h3>3. 보유 및 이용 기간</h3>" +
        "<p>수집 목적 달성 후 지체 없이 파기합니다. 다만, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>" +
        "<h3>4. 제3자 제공</h3>" +
        "<p>회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 법령에 따른 요청이 있는 경우 예외로 합니다.</p>" +
        "<h3>5. 이용자의 권리</h3>" +
        "<p>이용자는 언제든지 개인정보 열람·정정·삭제·처리 정지를 요청할 수 있으며, support@zeion.com 으로 요청하시면 지체 없이 조치합니다.</p>" +
        "<h3>6. 개인정보 보호책임자</h3>" +
        "<p>담당 부서: 고객지원팀 / 이메일: support@zeion.com</p>",
    },
  };

  function ensureModal() {
    var existing = document.getElementById(MODAL_ID);
    if (existing) return existing;

    var wrap = document.createElement("div");
    wrap.id = MODAL_ID;
    wrap.className = "legal-modal";
    wrap.setAttribute("hidden", "");
    wrap.setAttribute("aria-hidden", "true");

    wrap.innerHTML =
      '<button type="button" class="legal-modal__backdrop" data-legal-close aria-label="닫기"></button>' +
      '<div id="' +
      DIALOG_ID +
      '" class="legal-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="' +
      TITLE_ID +
      '" tabindex="-1">' +
      '<button type="button" class="legal-modal__close" data-legal-close aria-label="닫기">' +
      '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
      "</button>" +
      '<div class="legal-modal__head">' +
      '<h2 id="' +
      TITLE_ID +
      '" class="legal-modal__title"></h2>' +
      '<p class="legal-modal__updated"></p>' +
      "</div>" +
      '<div class="legal-modal__body"></div>' +
      "</div>";

    document.body.appendChild(wrap);
    return wrap;
  }

  var modal = ensureModal();
  var dialog = document.getElementById(DIALOG_ID);
  var titleEl = modal.querySelector(".legal-modal__title");
  var updatedEl = modal.querySelector(".legal-modal__updated");
  var bodyEl = modal.querySelector(".legal-modal__body");
  var lastTrigger = null;

  function isOpen() {
    return modal.classList.contains("is-open");
  }

  function openModal(type, trigger) {
    var data = LEGAL_CONTENT[type];
    if (!data) return;

    lastTrigger = trigger || null;
    titleEl.textContent = data.title;
    updatedEl.textContent = data.updated;
    bodyEl.innerHTML = data.html;

    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("legal-modal-open");
    dialog.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("legal-modal-open");
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  function linkType(link) {
    var label = (link.textContent || "").replace(/\s+/g, "").trim();
    if (label === "이용약관") return "terms";
    if (label === "개인정보처리방침") return "privacy";
    return null;
  }

  document.querySelectorAll(".footer-links a").forEach(function (link) {
    var type = linkType(link);
    if (!type) return;

    link.setAttribute("href", "#");
    link.setAttribute("role", "button");
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (isOpen()) closeModal();
      openModal(type, link);
    });
  });

  modal.addEventListener("click", function (e) {
    if (e.target.closest("[data-legal-close]")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) closeModal();
  });
})();
