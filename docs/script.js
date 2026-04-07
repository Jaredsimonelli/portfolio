document.body.classList.add("js-enhanced");

const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const revealNodes = document.querySelectorAll(".reveal");
const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const skillCards = document.querySelectorAll(".skill-card-skills");
const codeTypeNode = document.querySelector(".visual-code-type-text");

const startCodeTypeAnimation = (node) => {
  const words = (node.dataset.words || "")
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return;
  }

  if (!motionOk) {
    node.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const currentWord = words[wordIndex];

    if (!deleting) {
      charIndex += 1;
      node.textContent = currentWord.slice(0, charIndex);

      if (charIndex === currentWord.length) {
        deleting = true;
        window.setTimeout(tick, 1100);
        return;
      }

      window.setTimeout(tick, 90);
      return;
    }

    charIndex -= 1;
    node.textContent = currentWord.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      window.setTimeout(tick, 220);
      return;
    }

    window.setTimeout(tick, 55);
  };

  node.textContent = "";
  window.setTimeout(tick, 500);
};

const setSkillMetersToFinal = (card) => {
  const meters = card.querySelectorAll(".skill-meter");

  meters.forEach((meter) => {
    const target = Number(meter.dataset.value) || 0;
    const fill = meter.querySelector(".skill-meter-fill");
    const value = meter.querySelector(".skill-meter-value");

    if (fill) {
      fill.style.width = `${target}%`;
    }

    if (value) {
      value.textContent = `${target}%`;
    }
  });
};

const animateSkillValue = (node, target, delay) => {
  window.setTimeout(() => {
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${Math.round(target * eased)}%`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  }, delay);
};

const prepareSkillCard = (card) => {
  if (!motionOk) {
    setSkillMetersToFinal(card);
    return;
  }

  const meters = card.querySelectorAll(".skill-meter");

  meters.forEach((meter) => {
    const target = Number(meter.dataset.value) || 0;
    const fill = meter.querySelector(".skill-meter-fill");
    const value = meter.querySelector(".skill-meter-value");

    if (fill) {
      fill.style.width = `${Math.min(target, 10)}%`;
    }

    if (value) {
      value.textContent = "0%";
    }
  });
};

const animateSkillCard = (card) => {
  if (card.dataset.animated === "true") {
    return;
  }

  card.dataset.animated = "true";

  if (!motionOk) {
    setSkillMetersToFinal(card);
    return;
  }

  const meters = card.querySelectorAll(".skill-meter");

  meters.forEach((meter, index) => {
    const target = Number(meter.dataset.value) || 0;
    const fill = meter.querySelector(".skill-meter-fill");
    const value = meter.querySelector(".skill-meter-value");
    const delay = 260 + index * 75;

    window.setTimeout(() => {
      if (fill) {
        fill.style.width = `${target}%`;
        fill.classList.add("is-animated");
      }
    }, delay);

    if (value) {
      animateSkillValue(value, target, delay);
    }
  });
};

skillCards.forEach((card) => prepareSkillCard(card));
if (codeTypeNode) {
  startCodeTypeAnimation(codeTypeNode);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      if (entry.target.matches(".skill-card-skills")) {
        animateSkillCard(entry.target);
      }

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const navLinks = document.querySelectorAll(".nav a");
const navTargets = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const topbar = document.querySelector(".topbar");
const topbarShell = document.querySelector(".topbar-shell");
const heroScene = document.querySelector(".hero-scene");
const workScene = document.querySelector("#work");
const navToggle = document.querySelector("[data-mobile-nav-toggle]");
const artifactGrid = document.querySelector(".artifact-grid");
const workModal = document.querySelector("[data-work-modal]");
const workModalTitle = workModal?.querySelector("[data-work-modal-title]");
const workModalMeta = workModal?.querySelector("[data-work-modal-meta]");
const workModalImage = workModal?.querySelector("[data-work-modal-image]");
const workModalDescription = workModal?.querySelector("[data-work-modal-description]");
const workModalHighlights = workModal?.querySelector("[data-work-modal-highlights]");
const workModalNote = workModal?.querySelector("[data-work-modal-note]");
const workModalLink = workModal?.querySelector("[data-work-modal-link]");
const workModalPanel = workModal?.querySelector(".work-modal-panel");
const workModalWindow = workModal?.querySelector(".work-modal-window");
const workModalCloseChip = workModal?.querySelector(".work-modal-close-chip");
const workModalActions = workModal?.querySelector(".work-modal-actions");
const mobileNavBreakpoint = 860;
const desktopNavMorphDuration = 170;
let desktopRailActive = false;
let desktopNavMorphTimeoutId = 0;

const closeMobileNav = () => {
  if (!topbar || !navToggle) {
    return;
  }

  topbar.classList.remove("is-mobile-nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
};

const openMobileNav = () => {
  if (!topbar || !navToggle) {
    return;
  }

  topbar.classList.add("is-mobile-nav-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation menu");
};

const toggleMobileNav = () => {
  if (!topbar || window.innerWidth > mobileNavBreakpoint) {
    return;
  }

  if (topbar.classList.contains("is-mobile-nav-open")) {
    closeMobileNav();
    return;
  }

  openMobileNav();
};

const clearDesktopNavMorphTimeout = () => {
  if (desktopNavMorphTimeoutId !== 0) {
    window.clearTimeout(desktopNavMorphTimeoutId);
    desktopNavMorphTimeoutId = 0;
  }
};

const setDesktopRailVisualState = (nextRail) => {
  if (!topbar || window.innerWidth <= mobileNavBreakpoint) {
    return;
  }

  const shellActive = topbar.classList.contains("is-rail-shell");
  const layoutActive = topbar.classList.contains("is-rail");

  if (nextRail) {
    if (shellActive && layoutActive) {
      return;
    }

    clearDesktopNavMorphTimeout();
    topbar.classList.add("is-morphing", "is-rail-shell", "is-rail");
    desktopNavMorphTimeoutId = window.setTimeout(() => {
      topbar.classList.remove("is-morphing");
      desktopNavMorphTimeoutId = 0;
    }, desktopNavMorphDuration);
    return;
  }

  if (!shellActive && !layoutActive) {
    return;
  }

  clearDesktopNavMorphTimeout();
  topbar.classList.add("is-morphing");
  topbar.classList.remove("is-rail", "is-rail-shell");
  desktopNavMorphTimeoutId = window.setTimeout(() => {
    topbar.classList.remove("is-morphing");
    desktopNavMorphTimeoutId = 0;
  }, desktopNavMorphDuration);
};

const syncActiveNavState = () => {
  if (navTargets.length === 0) {
    return;
  }

  const markerY = window.innerHeight * 0.38;
  let activeTarget = navTargets[0];

  navTargets.forEach((target) => {
    if (target.getBoundingClientRect().top <= markerY) {
      activeTarget = target;
    }
  });

  const nearPageBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

  if (nearPageBottom) {
    activeTarget = navTargets[navTargets.length - 1];
  }

  const activeId = `#${activeTarget.id}`;
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === activeId);
  });
};

syncActiveNavState();
window.addEventListener("scroll", syncActiveNavState, { passive: true });
window.addEventListener("resize", syncActiveNavState);

const syncTopbarStickyState = () => {
  if (!topbar || !heroScene) {
    return;
  }

  const isMobile = window.innerWidth <= mobileNavBreakpoint;

  if (isMobile) {
    desktopRailActive = false;
    clearDesktopNavMorphTimeout();
    topbar.classList.remove("is-pinned", "is-rail", "is-rail-shell", "is-morphing");
    topbar.classList.add("is-stuck");
    topbarShell?.style.setProperty(
      "--topbar-shell-height",
      `${Math.ceil(topbar.getBoundingClientRect().height)}px`
    );
    return;
  }

  topbar.classList.remove("is-stuck");
  topbar.classList.add("is-pinned");

  const workTop = workScene?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
  const railEnterLine = Math.max(110, window.innerHeight * 0.18);
  const railExitLine = Math.max(170, window.innerHeight * 0.28);

  if (!desktopRailActive && workTop <= railEnterLine) {
    desktopRailActive = true;
  } else if (desktopRailActive && workTop >= railExitLine) {
    desktopRailActive = false;
  }

  setDesktopRailVisualState(desktopRailActive);
  topbarShell?.style.removeProperty("--topbar-shell-height");
};

syncTopbarStickyState();
window.addEventListener("scroll", syncTopbarStickyState, { passive: true });
window.addEventListener("resize", syncTopbarStickyState);
window.addEventListener("load", syncTopbarStickyState);

if (navToggle && topbar) {
  navToggle.addEventListener("click", () => {
    toggleMobileNav();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > mobileNavBreakpoint || !topbar.classList.contains("is-mobile-nav-open")) {
      return;
    }

    if (event.target instanceof Node && topbar.contains(event.target)) {
      return;
    }

    closeMobileNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > mobileNavBreakpoint) {
      closeMobileNav();
    }
  });
}

if (artifactGrid && workModal) {
  let activeWorkTrigger = null;
  let closeWorkModalTimeoutId = 0;

  const getWorkModalFocusableElements = () => {
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ];

    return [...workModal.querySelectorAll(selectors.join(","))].filter((node) => {
      if (!(node instanceof HTMLElement)) {
        return false;
      }

      return !node.hidden && node.offsetParent !== null;
    });
  };

  const populateWorkModal = (trigger) => {
    const {
      workTitle = "",
      workMeta = "",
      workImage = "",
      workDescription = "",
      workHighlights = "",
      workNote = "",
      workLink = "",
      workLinkLabel = "Visit site",
      workWindow = ""
    } = trigger.dataset;

    if (workModalTitle) {
      workModalTitle.textContent = workTitle;
    }

    if (workModalMeta) {
      workModalMeta.textContent = workMeta;
    }

    if (workModalDescription) {
      workModalDescription.textContent = workDescription;
    }

    if (workModalImage) {
      workModalImage.className = "artifact-image work-modal-image";

      if (workImage) {
        workModalImage.classList.add(workImage);
      }
    }

    if (workModalWindow) {
      workModalWindow.className = "artifact-window work-modal-window";

      if (workWindow === "prism") {
        workModalWindow.classList.add("artifact-window-prism", "is-prism");
      }
    }

    if (workModalHighlights) {
      workModalHighlights.replaceChildren();

      workHighlights
        .split("||")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => {
          const bullet = document.createElement("li");
          bullet.textContent = item;
          workModalHighlights.append(bullet);
        });
    }

    if (workModalNote) {
      if (workNote) {
        workModalNote.hidden = false;
        workModalNote.textContent = workNote;
      } else {
        workModalNote.hidden = true;
        workModalNote.textContent = "";
      }
    }

    if (workModalLink) {
      if (workLink) {
        workModalLink.hidden = false;
        workModalLink.href = workLink;
        workModalLink.textContent = workLinkLabel;
      } else {
        workModalLink.hidden = true;
        workModalLink.removeAttribute("href");
        workModalLink.textContent = "";
      }
    }

    if (workModalActions) {
      workModalActions.hidden = !workLink;
    }
  };

  const openWorkModal = (trigger) => {
    activeWorkTrigger?.classList.remove("is-work-selected");
    activeWorkTrigger = trigger;
    activeWorkTrigger.classList.add("is-work-selected");
    populateWorkModal(trigger);

    if (closeWorkModalTimeoutId !== 0) {
      window.clearTimeout(closeWorkModalTimeoutId);
      closeWorkModalTimeoutId = 0;
    }

    workModal.hidden = false;
    document.body.classList.add("is-work-modal-open");

    window.requestAnimationFrame(() => {
      workModal.classList.add("is-open");
    });

    window.setTimeout(() => {
      const [firstFocusable] = getWorkModalFocusableElements();
      (firstFocusable || workModalPanel || workModal).focus();
    }, motionOk ? 140 : 0);
  };

  const closeWorkModal = () => {
    if (workModal.hidden) {
      return;
    }

    workModal.classList.remove("is-open");
    document.body.classList.remove("is-work-modal-open");

    const finishClose = () => {
      workModal.hidden = true;
      closeWorkModalTimeoutId = 0;
      activeWorkTrigger?.classList.remove("is-work-selected");
      activeWorkTrigger?.focus();
    };

    if (!motionOk) {
      finishClose();
      return;
    }

    closeWorkModalTimeoutId = window.setTimeout(finishClose, 220);
  };

  artifactGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-work-modal]");

    if (trigger) {
      openWorkModal(trigger);
    }
  });

  artifactGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const trigger = event.target.closest("[data-open-work-modal]");

    if (!trigger) {
      return;
    }

    event.preventDefault();
    openWorkModal(trigger);
  });

  workModal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-work-modal]")) {
      closeWorkModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && !workModal.hidden) {
      const focusableElements = getWorkModalFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        (workModalPanel || workModal).focus();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }

    if (event.key === "Escape" && !workModal.hidden) {
      closeWorkModal();
    }
  });
}

const depthNodes = document.querySelectorAll("[data-depth]");
const parallaxRoot = document.querySelector("[data-parallax-root]");
const footerScene = document.querySelector("[data-footer-scene]");
const footerSceneStatus = footerScene?.querySelector("[data-scene-status]");
const footerSceneHint = footerScene?.querySelector("[data-scene-hint]");
const footerSceneHintToggle = footerScene?.querySelector("[data-scene-hint-toggle]");
const footerSceneReset = footerScene?.querySelector("[data-scene-reset]");
const rainSources = footerScene ? [...footerScene.querySelectorAll(".sky-rain-source")] : [];
const plantNode = footerScene?.querySelector("[data-plant-stage]");
const sunNode = footerScene?.querySelector(".sun-glow");
const cloudNode = footerScene?.querySelector(".sky-cloud-main");
const animalStageNode = footerScene?.querySelector("[data-animal-stage]");
const parallaxStrength = 1.65;
const treeGrowthDelay = 1000;
const footerGrowthDuration = 7500;
const fruitGrowthDuration = 4000;
const rainTriggerDelay = 2000;
const sunReturnDelay = 1000;
const footerSceneCopy = {
  idle: "Click to start the sky interaction",
  calm: "Cover the sun with the cloud to start rain",
  rain: "Keep the cloud over the sun to keep rain going and grow the tree",
  rainReady: "The tree is ready. Move the cloud away to bring the sun back",
  sunWait: "The rain stopped. Wait for the sun to return",
  fruitGrowing: "The light is back. Let the apple grow on the tree",
  fruitReady: "Shake the cloud quickly to create wind and drop the apple",
  wind: "Wind is building. The apple is starting to shake",
  animal: "The apple fell. Something is coming to eat it",
  victory: "Victory!"
};
let setFooterHintCollapsed = () => {};
let setFooterResetVisible = () => {};

if (motionOk && parallaxRoot && depthNodes.length > 0) {
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    depthNodes.forEach((node) => {
      const depth = Number(node.getAttribute("data-depth")) || 0;
      const tx = x * depth * parallaxStrength;
      const ty = y * depth * parallaxStrength;

      node.style.setProperty("--tx", `${tx}px`);
      node.style.setProperty("--ty", `${ty}px`);
    });
  });
}

const setFooterSceneState = (scene, x, y) => {
  const dx = (x - 0.5) * 52;
  const dy = (y - 0.32) * 36;
  const cloudLeft = 8 + (x * 84);
  const cloudY = (y - 0.24) * 88;

  scene.style.setProperty("--scene-x", `${Math.round(x * 100)}%`);
  scene.style.setProperty("--scene-y", `${Math.round(y * 100)}%`);
  scene.style.setProperty("--scene-dx", `${dx.toFixed(2)}px`);
  scene.style.setProperty("--scene-dy", `${dy.toFixed(2)}px`);
  scene.style.setProperty("--scene-tilt-x", `${(x - 0.5) * -4}deg`);
  scene.style.setProperty("--scene-tilt-y", `${(y - 0.35) * 3}deg`);
  scene.style.setProperty("--scene-rotate", `${(x - 0.5) * 10}deg`);
  scene.style.setProperty("--cloud-left", `${cloudLeft.toFixed(2)}%`);
  scene.style.setProperty("--cloud-y", `${cloudY.toFixed(2)}px`);
};

const setPlantGrowthProgress = (plant, progress) => {
  const clamped = Math.min(Math.max(progress, 0), 1);
  plant.style.setProperty("--plant-progress", clamped.toFixed(4));
};

const setFruitGrowthProgress = (plant, progress) => {
  const clamped = Math.min(Math.max(progress, 0), 1);
  plant.style.setProperty("--fruit-progress", clamped.toFixed(4));
};

if (footerScene) {
  setFooterSceneState(footerScene, 0.5, 0.26);

  if (plantNode) {
    setPlantGrowthProgress(plantNode, 0);
    setFruitGrowthProgress(plantNode, 0);
  }
}

if (footerScene) {
  setFooterHintCollapsed = (collapsed) => {
    if (!footerSceneHint || !footerSceneHintToggle) {
      return;
    }

    footerSceneHint.classList.toggle("is-collapsed", collapsed);
    footerSceneHintToggle.textContent = collapsed ? "Show hint" : "Hide hint";
    footerSceneHintToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    footerSceneHintToggle.setAttribute(
      "aria-label",
      collapsed ? "Show interactive sky hints" : "Hide interactive sky hints"
    );
  };

  setFooterResetVisible = (visible) => {
    if (!footerSceneReset) {
      return;
    }

    footerSceneReset.hidden = !visible;
  };

  const createRainDrops = (sources) => {
    if (!sources.length || sources.some((source) => source.childElementCount > 0)) {
      return;
    }

    sources.forEach((source) => {
      for (let index = 0; index < 18; index += 1) {
        const drop = document.createElement("span");
        drop.className = "rain-drop";
        drop.style.setProperty("--drop-left", `${4 + Math.random() * 92}%`);
        drop.style.setProperty("--drop-length", `${70 + Math.random() * 84}px`);
        drop.style.setProperty("--drop-duration", `${0.58 + Math.random() * 0.44}s`);
        drop.style.setProperty("--drop-delay", `${Math.random() * -1.15}s`);
        source.append(drop);
      }
    });
  };

  createRainDrops(rainSources);
  footerScene.dataset.sceneMode = "idle";
  footerScene.classList.add("is-clouds-active");

  if (footerSceneStatus) {
    footerSceneStatus.textContent = footerSceneCopy.idle;
  }

  setFooterHintCollapsed(false);
  setFooterResetVisible(false);

  if (!motionOk) {
    footerScene.setAttribute("aria-disabled", "true");
    footerScene.setAttribute("tabindex", "-1");

    if (footerSceneStatus) {
      footerSceneStatus.textContent = "Motion reduced. Scene stays calm";
    }
  }

  [footerSceneHintToggle, footerSceneReset].forEach((node) => {
    if (!node) {
      return;
    }

    ["pointerdown", "click"].forEach((eventName) => {
      node.addEventListener(eventName, (event) => {
        event.stopPropagation();
      });
    });
  });

  if (footerSceneHintToggle) {
    footerSceneHintToggle.addEventListener("click", () => {
      if (!footerSceneHint) {
        return;
      }

      setFooterHintCollapsed(!footerSceneHint.classList.contains("is-collapsed"));
    });
  }
}

if (motionOk && footerScene) {
  let sceneMode = "idle";
  let sceneStarted = false;
  let growthFrameId = 0;
  let lastGrowthTime = 0;
  let coverStartedAt = 0;
  let treeGrowthDelayTimeoutId = 0;
  let treeGrowthDelayStartedAt = 0;
  let sunMonitorRafId = 0;
  let sunReturnTimeoutId = 0;
  let windPreviewTimeoutId = 0;
  let windSequenceTimeouts = [];
  let treeComplete = false;
  let treeGrowthUnlocked = false;
  let fruitReady = false;
  let fruitFallen = false;
  let windTriggered = false;
  let animalEating = false;
  let victoryReached = false;
  let shakeEnergy = 0;
  let lastShakeX = 0;
  let lastShakeTime = 0;
  let lastShakeDirection = 0;
  let lastFooterSceneStatus = "";

  let footerRect = footerScene.getBoundingClientRect();
  let nextX = 0.5;
  let nextY = 0.26;
  let footerSceneRafId = 0;
  const plantState = {
    node: plantNode,
    progress: 0,
    target: 0
  };
  const fruitState = {
    progress: 0,
    target: 0
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const isTreeComplete = () => plantState.progress >= 0.999;
  const isFruitComplete = () => fruitState.progress >= 0.999;
  const setFooterSceneStatus = (message) => {
    if (!footerSceneStatus || message === lastFooterSceneStatus) {
      return;
    }

    footerSceneStatus.textContent = message;
    lastFooterSceneStatus = message;
  };

  const clearWindSequenceTimeouts = () => {
    windSequenceTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    windSequenceTimeouts = [];
  };

  const clearTreeGrowthDelay = (resetUnlocked = true) => {
    if (treeGrowthDelayTimeoutId !== 0) {
      window.clearTimeout(treeGrowthDelayTimeoutId);
      treeGrowthDelayTimeoutId = 0;
    }

    treeGrowthDelayStartedAt = 0;

    if (resetUnlocked) {
      treeGrowthUnlocked = false;
    }
  };

  const clearSunReturnDelay = () => {
    if (sunReturnTimeoutId !== 0) {
      window.clearTimeout(sunReturnTimeoutId);
      sunReturnTimeoutId = 0;
    }
  };

  const clearWindPreview = () => {
    if (windPreviewTimeoutId !== 0) {
      window.clearTimeout(windPreviewTimeoutId);
      windPreviewTimeoutId = 0;
    }

    if (sceneMode !== "wind") {
      footerScene.classList.remove("is-windy");
    }
  };

  const stopSunMonitor = () => {
    if (sunMonitorRafId !== 0) {
      window.cancelAnimationFrame(sunMonitorRafId);
      sunMonitorRafId = 0;
    }
  };

  const resetShakeTracker = () => {
    shakeEnergy = 0;
    lastShakeX = 0;
    lastShakeTime = 0;
    lastShakeDirection = 0;
  };

  const triggerWindPreview = () => {
    if (!sceneStarted || sceneMode === "wind" || sceneMode === "animal" || sceneMode === "victory") {
      return;
    }

    footerScene.classList.add("is-windy");

    if (windPreviewTimeoutId !== 0) {
      window.clearTimeout(windPreviewTimeoutId);
    }

    windPreviewTimeoutId = window.setTimeout(() => {
      windPreviewTimeoutId = 0;

      if (sceneMode !== "wind") {
        footerScene.classList.remove("is-windy");
      }
    }, 900);
  };

  const updateFooterSceneStatus = (now = performance.now()) => {
    if (!footerSceneStatus) {
      return;
    }

    if (!sceneStarted) {
      setFooterSceneStatus(footerSceneCopy.idle);
      return;
    }

    if (sceneMode === "rain") {
      if (!treeGrowthUnlocked) {
        setFooterSceneStatus("Rain is on. The tree is about to start growing");
        return;
      }

      setFooterSceneStatus(treeComplete ? footerSceneCopy.rainReady : footerSceneCopy.rain);
      return;
    }

    if (sceneMode === "sun-wait") {
      setFooterSceneStatus(footerSceneCopy.sunWait);
      return;
    }

    if (sceneMode === "fruit") {
      setFooterSceneStatus(
        fruitReady ? footerSceneCopy.fruitReady : footerSceneCopy.fruitGrowing
      );
      return;
    }

    if (sceneMode === "wind") {
      setFooterSceneStatus(footerSceneCopy.wind);
      return;
    }

    if (sceneMode === "animal") {
      setFooterSceneStatus(footerSceneCopy.animal);
      return;
    }

    if (sceneMode === "victory") {
      setFooterSceneStatus(footerSceneCopy.victory);
      return;
    }

    if (coverStartedAt > 0 && sceneMode === "calm") {
      setFooterSceneStatus("Keep the cloud over the sun to start rain");
      return;
    }

    setFooterSceneStatus(footerSceneCopy.calm);
  };

  const getSunCoverRatio = () => {
    if (!sunNode || !cloudNode) {
      return 0;
    }

    const sunRect = sunNode.getBoundingClientRect();
    const cloudRect = cloudNode.getBoundingClientRect();
    const overlapWidth = Math.max(
      0,
      Math.min(sunRect.right, cloudRect.right) - Math.max(sunRect.left, cloudRect.left)
    );
    const overlapHeight = Math.max(
      0,
      Math.min(sunRect.bottom, cloudRect.bottom) - Math.max(sunRect.top, cloudRect.top)
    );
    const sunArea = sunRect.width * sunRect.height || 1;

    return (overlapWidth * overlapHeight) / sunArea;
  };

  const isSunLargelyCovered = () => getSunCoverRatio() >= 0.52;

  const armTreeGrowthDelay = () => {
    if (treeGrowthUnlocked || treeGrowthDelayTimeoutId !== 0 || treeComplete) {
      return;
    }

    treeGrowthDelayStartedAt = performance.now();
    treeGrowthDelayTimeoutId = window.setTimeout(() => {
      treeGrowthDelayTimeoutId = 0;
      treeGrowthUnlocked = true;
      syncGrowthTarget();
      updateFooterSceneStatus();
    }, treeGrowthDelay);
  };

  const startFruitStage = () => {
    if (!treeComplete || fruitFallen || windTriggered || victoryReached) {
      return;
    }

    setMode("fruit");
    fruitState.target = 1;
    queueGrowth();
  };

  const beginSunReturnDelay = () => {
    clearSunReturnDelay();
    setMode("sun-wait");
    sunReturnTimeoutId = window.setTimeout(() => {
      sunReturnTimeoutId = 0;
      startFruitStage();
    }, sunReturnDelay);
  };

  const runSunMonitor = (now) => {
    sunMonitorRafId = 0;

    if (!sceneStarted || victoryReached || windTriggered) {
      coverStartedAt = 0;
      updateFooterSceneStatus(now);
      return;
    }

    const covered = isSunLargelyCovered();

    if (sceneMode === "calm") {
      if (covered) {
        if (!coverStartedAt) {
          coverStartedAt = now;
        }

        if (now - coverStartedAt >= rainTriggerDelay) {
          coverStartedAt = 0;
          setMode("rain");
          return;
        }
      } else {
        coverStartedAt = 0;
      }

      updateFooterSceneStatus(now);
      queueSunMonitor();
      return;
    }

    if (sceneMode === "rain") {
      if (!covered) {
        if (isTreeComplete()) {
          treeComplete = true;
          beginSunReturnDelay();
        } else {
          setMode("calm");
        }

        return;
      }

      updateFooterSceneStatus(now);
      queueSunMonitor();
      return;
    }

    if (sceneMode === "sun-wait") {
      if (covered) {
        clearSunReturnDelay();
        setMode("rain");
        return;
      }

      updateFooterSceneStatus(now);
      queueSunMonitor();
      return;
    }

    updateFooterSceneStatus(now);
  };

  const queueSunMonitor = () => {
    if (sunMonitorRafId !== 0) {
      return;
    }

    sunMonitorRafId = window.requestAnimationFrame(runSunMonitor);
  };

  const stepProgress = (state, duration, delta) => {
    if (Math.abs(state.target - state.progress) < 0.0001) {
      state.progress = state.target;
      return false;
    }

    const direction = Math.sign(state.target - state.progress);
    const nextProgress = state.progress + (delta / duration) * direction;

    if (
      (direction > 0 && nextProgress >= state.target) ||
      (direction < 0 && nextProgress <= state.target)
    ) {
      state.progress = state.target;
      return false;
    }

    state.progress = nextProgress;
    return true;
  };

  const stepGrowth = (now) => {
    if (!lastGrowthTime) {
      lastGrowthTime = now;
    }

    const delta = now - lastGrowthTime;
    lastGrowthTime = now;
    let hasPendingGrowth = false;

    hasPendingGrowth =
      stepProgress(plantState, footerGrowthDuration, delta) || hasPendingGrowth;
    hasPendingGrowth =
      stepProgress(fruitState, fruitGrowthDuration, delta) || hasPendingGrowth;

    setPlantGrowthProgress(plantState.node, plantState.progress);
    setFruitGrowthProgress(plantState.node, fruitState.progress);

    if (!treeComplete && isTreeComplete()) {
      treeComplete = true;
      updateFooterSceneStatus(now);
    }

    if (!fruitReady && isFruitComplete()) {
      fruitReady = true;
      updateFooterSceneStatus(now);
    }

    if (
      Math.abs(plantState.target - plantState.progress) >= 0.0001 ||
      Math.abs(fruitState.target - fruitState.progress) >= 0.0001
    ) {
      hasPendingGrowth = true;
    }

    if (!hasPendingGrowth) {
      growthFrameId = 0;
      return;
    }

    growthFrameId = window.requestAnimationFrame(stepGrowth);
  };

  const queueGrowth = () => {
    if (growthFrameId !== 0) {
      return;
    }

    lastGrowthTime = 0;
    growthFrameId = window.requestAnimationFrame(stepGrowth);
  };

  const syncGrowthTarget = () => {
    let needsAnimation = false;

    const nextTreeTarget = sceneMode === "rain" && treeGrowthUnlocked ? 1 : plantState.progress;
    const nextFruitTarget = sceneMode === "fruit" ? 1 : fruitState.progress;

    if (plantState.target !== nextTreeTarget) {
      plantState.target = nextTreeTarget;
    }

    if (fruitState.target !== nextFruitTarget) {
      fruitState.target = nextFruitTarget;
    }

    if (
      Math.abs(plantState.target - plantState.progress) >= 0.0001 ||
      Math.abs(fruitState.target - fruitState.progress) >= 0.0001
    ) {
      needsAnimation = true;
    }

    if (needsAnimation) {
      queueGrowth();
    }
  };

  const setMode = (mode) => {
    sceneMode = mode;

    footerScene.dataset.sceneMode = mode;
    footerScene.classList.add("is-clouds-active");
    footerScene.classList.toggle("is-raining", mode === "rain");
    footerScene.classList.toggle("is-sun-muted", mode === "rain" || mode === "sun-wait");
    footerScene.classList.toggle("is-fruiting", mode === "fruit");
    if (mode === "wind") {
      clearWindPreview();
      footerScene.classList.add("is-windy");
    } else if (windPreviewTimeoutId === 0) {
      footerScene.classList.remove("is-windy");
    }
    footerScene.classList.toggle("is-animal-arriving", mode === "animal" || mode === "victory");
    footerScene.classList.toggle("is-victory", mode === "victory");
    footerScene.classList.toggle("is-animal-eating", animalEating && mode !== "victory");
    setFooterResetVisible(mode === "victory");
    if (mode === "rain") {
      armTreeGrowthDelay();
    } else if (mode !== "victory") {
      clearTreeGrowthDelay(mode !== "sun-wait");
    }
    if (mode !== "calm" && mode !== "rain") {
      coverStartedAt = 0;
    }
    if (mode !== "sun-wait") {
      clearSunReturnDelay();
    }
    if (mode === "fruit" || mode === "wind" || mode === "animal" || mode === "victory") {
      stopSunMonitor();
    }
    syncGrowthTarget();
    updateFooterSceneStatus();

    if (mode === "calm" || mode === "rain" || mode === "sun-wait") {
      queueSunMonitor();
    }
  };

  const triggerWindSequence = () => {
    if (!fruitReady || windTriggered || fruitFallen || victoryReached) {
      return;
    }

    clearWindPreview();
    clearWindSequenceTimeouts();
    windTriggered = true;
    resetShakeTracker();
    setMode("wind");
    footerScene.classList.add("is-fruit-shaking");

    windSequenceTimeouts.push(
      window.setTimeout(() => {
        footerScene.classList.remove("is-fruit-shaking");
        footerScene.classList.add("is-fruit-falling");
      }, 920)
    );

    windSequenceTimeouts.push(
      window.setTimeout(() => {
        footerScene.classList.remove("is-fruit-falling");
        footerScene.classList.add("is-fruit-fallen");
        fruitFallen = true;
        setMode("animal");
      }, 1520)
    );

    windSequenceTimeouts.push(
      window.setTimeout(() => {
        animalEating = true;
        footerScene.classList.add("is-animal-eating");
        updateFooterSceneStatus();
      }, 3920)
    );

    windSequenceTimeouts.push(
      window.setTimeout(() => {
        victoryReached = true;
        setMode("victory");
      }, 6260)
    );
  };

  const trackShake = (event) => {
    if (
      !sceneStarted ||
      windTriggered ||
      sceneMode === "animal" ||
      sceneMode === "victory" ||
      typeof event.clientX !== "number"
    ) {
      return;
    }

    const now = performance.now();

    if (!lastShakeTime) {
      lastShakeTime = now;
      lastShakeX = event.clientX;
      return;
    }

    const dx = event.clientX - lastShakeX;
    const dt = Math.max(now - lastShakeTime, 1);
    const direction = Math.sign(dx);

    if (dt > 220) {
      shakeEnergy = Math.max(0, shakeEnergy - 1.2);
    }

    if (Math.abs(dx) >= 18 && dt <= 150 && direction !== 0) {
      if (lastShakeDirection && direction !== lastShakeDirection) {
        shakeEnergy += Math.min(1.65, Math.abs(dx) / 20);
      } else {
        shakeEnergy = Math.max(0, shakeEnergy - 0.2) + Math.min(0.7, Math.abs(dx) / 38);
      }

      lastShakeDirection = direction;
    } else {
      shakeEnergy = Math.max(0, shakeEnergy - dt / 360);
    }

    lastShakeX = event.clientX;
    lastShakeTime = now;

    if (shakeEnergy >= 4.2) {
      if (sceneMode === "fruit" && fruitReady) {
        triggerWindSequence();
      } else {
        triggerWindPreview();
        resetShakeTracker();
      }
    }
  };

  const commitFooterScene = () => {
    footerSceneRafId = 0;
    setFooterSceneState(footerScene, nextX, nextY);
  };

  const queueFooterScene = () => {
    if (footerSceneRafId !== 0) {
      return;
    }

    footerSceneRafId = window.requestAnimationFrame(commitFooterScene);
  };

  const syncFooterRect = () => {
    footerRect = footerScene.getBoundingClientRect();

    if (!plantNode || !animalStageNode) {
      return;
    }

    const plantRect = plantNode.getBoundingClientRect();
    const animalWidth =
      parseFloat(getComputedStyle(animalStageNode).width) ||
      animalStageNode.getBoundingClientRect().width ||
      102;
    const animalFinalLeft = parseFloat(getComputedStyle(animalStageNode).left) || 0;
    const finalXInScene = (plantRect.left - footerRect.left) + animalFinalLeft;
    const startShift = Math.max(finalXInScene + animalWidth + 28, animalWidth + 28);

    animalStageNode.style.setProperty("--animal-start-shift", `${startShift.toFixed(1)}px`);
  };

  syncFooterRect();

  const resetFooterScene = () => {
    clearTreeGrowthDelay();
    clearSunReturnDelay();
    clearWindPreview();
    clearWindSequenceTimeouts();
    stopSunMonitor();

    sceneMode = "idle";
    sceneStarted = false;
    lastGrowthTime = 0;
    coverStartedAt = 0;
    treeComplete = false;
    treeGrowthUnlocked = false;
    fruitReady = false;
    fruitFallen = false;
    windTriggered = false;
    animalEating = false;
    victoryReached = false;
    nextX = 0.5;
    nextY = 0.26;

    if (growthFrameId !== 0) {
      window.cancelAnimationFrame(growthFrameId);
      growthFrameId = 0;
    }

    if (footerSceneRafId !== 0) {
      window.cancelAnimationFrame(footerSceneRafId);
      footerSceneRafId = 0;
    }

    plantState.progress = 0;
    plantState.target = 0;
    fruitState.progress = 0;
    fruitState.target = 0;
    setPlantGrowthProgress(plantState.node, 0);
    setFruitGrowthProgress(plantState.node, 0);
    resetShakeTracker();
    setFooterSceneState(footerScene, nextX, nextY);
    footerScene.classList.remove("is-fruit-shaking", "is-fruit-falling", "is-fruit-fallen");
    setMode("idle");
    setFooterHintCollapsed(false);
    setFooterResetVisible(false);
  };

  const handleFooterPointer = (event) => {
    if (!sceneStarted) {
      return;
    }

    const width = footerRect.width || 1;
    const height = footerRect.height || 1;
    const pointerRatioX = clamp((event.clientX - footerRect.left) / width, 0, 1);
    const pointerRatioY = clamp((event.clientY - footerRect.top) / height, 0, 1);

    nextX = clamp(0.5 + ((pointerRatioX - 0.5) * 1.16), 0, 1);
    nextY = clamp(0.26 + ((pointerRatioY - 0.26) * 1.08), 0, 1);
    queueFooterScene();
    syncGrowthTarget();
    trackShake(event);
    if (sceneMode === "calm" || sceneMode === "rain" || sceneMode === "sun-wait") {
      queueSunMonitor();
    }
  };

  footerScene.addEventListener("pointerenter", (event) => {
    syncFooterRect();
    handleFooterPointer(event);
  });
  footerScene.addEventListener("pointermove", (event) => {
    handleFooterPointer(event);
  });
  footerScene.addEventListener("click", (event) => {
    if (!sceneStarted) {
      sceneStarted = true;
      setMode("calm");
      resetShakeTracker();
      setFooterHintCollapsed(true);

      if (typeof event.clientX === "number" && typeof event.clientY === "number") {
        const width = footerRect.width || 1;
        const height = footerRect.height || 1;
        const pointerRatioX = clamp((event.clientX - footerRect.left) / width, 0, 1);
        const pointerRatioY = clamp((event.clientY - footerRect.top) / height, 0, 1);

        nextX = clamp(0.5 + ((pointerRatioX - 0.5) * 1.16), 0, 1);
        nextY = clamp(0.26 + ((pointerRatioY - 0.26) * 1.08), 0, 1);
        queueFooterScene();
      }

      return;
    }

    if (typeof event.clientX === "number" && typeof event.clientY === "number") {
      handleFooterPointer(event);
    }
  });
  footerScene.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    footerScene.click();
  });

  if (footerSceneReset) {
    footerSceneReset.addEventListener("click", () => {
      resetFooterScene();
    });
  }

  window.addEventListener("resize", syncFooterRect);
  window.addEventListener("beforeunload", () => {
    clearSunReturnDelay();
    clearWindPreview();
    clearWindSequenceTimeouts();
    stopSunMonitor();
  });
}
