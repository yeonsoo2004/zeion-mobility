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
