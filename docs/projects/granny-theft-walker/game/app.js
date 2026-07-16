(function bootstrapGameMenu() {
  "use strict";

  // ============================================================
  // Menu Shell Constants & DOM
  // ============================================================

  const SAVE_KEY = "gtw.save.v1";
  const SAVE_VERSION = 1;
  const DEMO_LEVEL_ID = "demo-hospital-wing";
  const LEVEL_ONE_ID = "level-1-hospital";
  const LEVEL_TWO_ID = "level-2-lunch";
  const LEVEL_THREE_ID = "level-3-hell";

  const menuStage = document.querySelector(".menu-stage");
  const levelSelectStage = document.querySelector("#levelSelectStage");
  const playStage  = document.querySelector("#playStage");
  const startButton = document.querySelector("#startButton");
  const loadButton  = document.querySelector("#loadButton");
  const controlsButton = document.querySelector("#controlsButton");
  const levelOneButton = document.querySelector("#levelOneButton");
  const levelTwoButton = document.querySelector("#levelTwoButton");
  const levelThreeButton = document.querySelector("#levelThreeButton");
  const levelBackButton = document.querySelector("#levelBackButton");
  const optionsButton = document.querySelector("#optionsButton");
  const optionsOverlay = document.querySelector("#optionsOverlay");
  const optionsHeading = document.querySelector("#optionsHeading");
  const resumeButton = document.querySelector("#resumeButton");
  const optionsMainMenuButton = document.querySelector("#optionsMainMenuButton");
  const gameCompleteOverlay = document.querySelector("#gameCompleteOverlay");
  const victoryMainMenuButton = document.querySelector("#victoryMainMenuButton");
  const gameOverOverlay = document.querySelector("#gameOverOverlay");
  const restartLevelButton = document.querySelector("#restartLevelButton");
  const menuStatus = document.querySelector("#menuStatus");
  const gameStatus = document.querySelector("#gameStatus");

  const DEMO_LEVEL = {
    id: DEMO_LEVEL_ID,
    title: "Campaign Prototype",
    scenes: [
      {
        id: "bedroom",
        title: "Ward Bedroom",
        background: "./game/assets/ward-bedroom-background.png",
        backgroundFit: "cover",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 140 },
        clearCondition: { type: "reach-exit", x: 880 },
        instructions: "Walk to the right to leave the bedroom.",
      },
      {
        id: "hallway-1",
        title: "Hallway — First Encounter",
        background: "./game/assets/ward-hallway-background.png",
        backgroundFit: "cover",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 140 },
        maxEnemies: 4,
        encounters: [
          { type: "Nurse", count: 2, spawnX: [690, 810], requiredForClear: true, aiMode: "wander-until-near", aggroRange: 100 },
          { type: "Nurse", count: 2, spawnX: [1050, 1180], requiredForClear: true, facing: -1, offscreenEntry: true, offscreenMargin: 220, trigger: { type: "after-required-defeated", requiredDefeated: 2 } },
        ],
        clearCondition: { type: "defeat-then-exit", x: 880 },
        instructions: "Defeat the nurses, then walk right. J attacks, K throws.",
      },
      {
        id: "hallway-2",
        title: "Hallway — Reinforcements",
        background: "./game/assets/ward-hallway-background.png",
        backgroundFit: "cover",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 140 },
        maxEnemies: 7,
        encounters: [
          { type: "Nurse", count: 2, spawnX: [680, 820], requiredForClear: true, aiMode: "wander-until-near", aggroRange: 100, group: "hallway-2-wander" },
          { type: "Nurse", count: 2, spawnX: [-90, -220], requiredForClear: true, facing: 1, offscreenEntry: true, offscreenMargin: 220, trigger: { type: "on-group-alerted", group: "hallway-2-wander" } },
        ],
        clearCondition: { type: "defeat-then-exit", x: 880 },
        instructions: "More nurses incoming. Clear them all, then advance.",
      },
      {
        id: "ward-boss",
        title: "Ward Office — Boss Fight",
        background: "./game/assets/ward-office-background.png",
        backgroundFit: "cover",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 150 },
        maxEnemies: 5,
        encounters: [
          { type: "Ward", spawnX: 760, requiredForClear: true, boss: true, forcedPointActions: 2 },
        ],
        clearCondition: { type: "defeat-all-then-exit", x: 880 },
        instructions: "Defeat the Ward to reach the cafeteria wing.",
      },
      {
        id: "lunch-hallway",
        title: "Lunch Hallway",
        background: "./game/assets/lunch-hallway.png",
        backgroundFit: "cover",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 120 },
        clearCondition: { type: "reach-exit", x: 880 },
        instructions: "Head through the cafeteria doors.",
      },
      {
        id: "cafeteria-lunch-lady-s1",
        title: "Cafeteria — Lunch Lady",
        background: "./game/assets/cafeteria-background.png",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 120 },
        maxEnemies: 8,
        encounters: [
          { type: "LunchLadyS1", spawnX: 460 },
        ],
        clearCondition: { type: "meatball-kills-then-exit", count: 7, x: 880 },
        instructions: "Defeat 7 Meatball Monsters, then enter the kitchen.",
      },
      {
        id: "kitchen-lunch-lady-s2",
        title: "Kitchen — Lunch Lady Stage 2",
        background: "./game/assets/lunch-kitchen.png",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 120 },
        maxEnemies: 8,
        encounters: [
          { type: "LunchLadyS2", spawnX: 760, requiredForClear: true, boss: true },
        ],
        potPizzaRequiredForClear: true,
        clearCondition: { type: "defeat-required-then-door", x: 545, radius: 55 },
        instructions: "Defeat Lunch Lady and the Pizza Monster, then enter the kitchen door.",
      },
      {
        id: "ward-entrance-hell-hole",
        title: "Ward Entrance",
        background: "./game/assets/ward-entrance.png",
        backgroundFit: "cover",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 120 },
        hellHoleSequence: { triggerScreenRatio: 0.4 },
        instructions: "Head toward the Ward Entrance.",
      },
      {
        id: "hell-hallway",
        title: "Hell Hallway",
        background: "./game/assets/hell-hallway.png",
        backgroundFit: "cover",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 120 },
        maxEnemies: 5,
        encounters: [
          { type: "Demon", count: 2, spawnX: [580, 740], requiredForClear: true },
          { type: "DemonRanged", count: 1, spawnX: 850, requiredForClear: true },
          { type: "DemonRanged", count: 2, spawnX: [700, 860], requiredForClear: true, trigger: { type: "after-required-defeated", requiredDefeated: 3 } },
        ],
        clearCondition: { type: "defeat-all-then-exit", x: 880 },
        instructions: "Defeat the demons, then reach the throne room.",
      },
      {
        id: "hell-throne-room",
        title: "Hell Throne Room — Satan",
        background: "./game/assets/hell-throne-room.png",
        backgroundFit: "cover",
        worldWidth: 960,
        floorPath: { nearX: 92, nearY: 528, farX: 868, farY: 516 },
        playerSpawn: { x: 120 },
        maxEnemies: 4,
        encounters: [
          { type: "Satan", spawnX: 605, requiredForClear: true, boss: true },
        ],
        clearCondition: { type: "defeat-required" },
        completesLevel: true,
        instructions: "Defeat Satan and his evolved form.",
      },
    ],
  };

  const LEVEL_ONE = {
    id: LEVEL_ONE_ID,
    title: "Level 1 — Hospital Escape",
    scenes: DEMO_LEVEL.scenes.slice(1, 4),
  };

  const LEVEL_TWO = {
    id: LEVEL_TWO_ID,
    title: "Level 2 — Lunch Wing",
    scenes: DEMO_LEVEL.scenes.slice(4, 7),
  };

  const LEVEL_THREE = {
    id: LEVEL_THREE_ID,
    title: "Level 3 — Hell Descent",
    scenes: DEMO_LEVEL.scenes.slice(7),
  };

  let loadingGame = false;
  let queuedLevelTransition = 0;
  let optionsOverlayOpen = false;
  let optionsPriorPaused = false;
  let optionsOverlayContext = "game";
  let gameCompleteShown = false;
  let gameOverShown = false;

  initMenu();

  // ============================================================
  // Menu Functions
  // ============================================================

  function initMenu() {
    startButton?.addEventListener("click", () => void startDemoLevel());
    loadButton?.addEventListener("click", showLevelSelect);
    levelOneButton?.addEventListener("click", () => void startSelectedLevel(LEVEL_ONE));
    levelTwoButton?.addEventListener("click", () => void startSelectedLevel(LEVEL_TWO));
    levelThreeButton?.addEventListener("click", () => void startSelectedLevel(LEVEL_THREE));
    levelBackButton?.addEventListener("click", showMenu);
    controlsButton?.addEventListener("click", openMenuControls);
    optionsButton?.addEventListener("click", () => openOptionsOverlay("game"));
    resumeButton?.addEventListener("click", closeOptionsOverlay);
    optionsMainMenuButton?.addEventListener("click", confirmReturnToMainMenu);
    victoryMainMenuButton?.addEventListener("click", showMenu);
    restartLevelButton?.addEventListener("click", restartCurrentLevel);
    updateLoadLevelButton();
  }

  async function startDemoLevel() {
    await showPlayableDemo({
      levelConfig: DEMO_LEVEL,
      status: "Starting campaign prototype...",
      menuMessage: "Campaign prototype running.",
    });
  }

  function showLevelSelect() {
    stopEngine();
    menuStage?.classList.add("is-hidden");
    playStage?.classList.add("is-hidden");
    levelSelectStage?.classList.remove("is-hidden");
    setMenuStatus("Select Level");
  }

  async function startSelectedLevel(levelConfig) {
    await showPlayableDemo({
      levelConfig,
      status: `Starting ${levelConfig.title}...`,
      menuMessage: `${levelConfig.title} running.`,
    });
  }

  async function showPlayableDemo({ levelConfig, status, menuMessage }) {
    if (loadingGame) return;
    clearQueuedLevelTransition();
    loadingGame = true;
    setGameStatus(status);
    menuStage?.classList.add("is-hidden");
    levelSelectStage?.classList.add("is-hidden");
    playStage?.classList.remove("is-hidden");
    resetGameOverlays();

    try {
      await initEngine({
        onStatus: setGameStatus,
        onSceneComplete: (_scene, nextScene) => setGameStatus(`Moving to ${nextScene.title}...`),
        onLevelComplete: handleLevelComplete,
      });
      await loadLevel(levelConfig);
      setMenuStatus(menuMessage);
    } catch (error) {
      console.error(error);
      setGameStatus(`Unable to start level: ${error.message}`);
      setMenuStatus("Level failed to load. Check the console for details.");
    } finally {
      loadingGame = false;
    }
  }

  function handleLevelComplete(level) {
    writeCompletedLevelSave(level);
    updateLoadLevelButton();
    if (level.id === LEVEL_ONE_ID) {
      setGameStatus("Level 1 complete. Loading Level 2...");
      setMenuStatus("Level 1 complete. Level 2 loading.");
      queuedLevelTransition = window.setTimeout(() => {
        queuedLevelTransition = 0;
        void startSelectedLevel(LEVEL_TWO);
      }, 900);
      return;
    }
    if (level.id === LEVEL_TWO_ID) {
      setGameStatus("Level 2 complete. Loading Level 3...");
      setMenuStatus("Level 2 complete. Level 3 loading.");
      queuedLevelTransition = window.setTimeout(() => {
        queuedLevelTransition = 0;
        void startSelectedLevel(LEVEL_THREE);
      }, 900);
      return;
    }
    setGameStatus(`${level.title} complete. Autosaved progress.`);
    if (level.id === LEVEL_THREE_ID || level.id === DEMO_LEVEL_ID) {
      showGameCompleteOverlay();
    }
  }

  function showMenu() {
    clearQueuedLevelTransition();
    stopEngine();
    playStage?.classList.add("is-hidden");
    levelSelectStage?.classList.add("is-hidden");
    menuStage?.classList.remove("is-hidden");
    resetGameOverlays();
    updateLoadLevelButton();
    setMenuStatus("Main Menu Prototype");
  }

  function openMenuControls() {
    openOptionsOverlay("menu");
  }

  function openOptionsOverlay(context = "game") {
    if (optionsOverlayOpen || gameCompleteShown || gameOverShown) return;
    if (context === "game" && !engineRunning) return;
    optionsOverlayOpen = true;
    optionsOverlayContext = context;
    if (context === "menu") {
      menuStage?.append(optionsOverlay);
      optionsOverlay?.classList.add("game-overlay-menu");
      if (optionsHeading) optionsHeading.textContent = "Controls";
      if (resumeButton) resumeButton.textContent = "Back";
      optionsMainMenuButton?.classList.add("is-hidden");
    } else {
      playStage?.append(optionsOverlay);
      optionsOverlay?.classList.remove("game-overlay-menu");
      if (optionsHeading) optionsHeading.textContent = "Options";
      if (resumeButton) resumeButton.textContent = "Resume";
      optionsMainMenuButton?.classList.remove("is-hidden");
      optionsPriorPaused = paused;
      paused = true;
    }
    optionsOverlay?.classList.remove("is-hidden");
    resumeButton?.focus();
  }

  function closeOptionsOverlay() {
    if (!optionsOverlayOpen) return;
    const context = optionsOverlayContext;
    optionsOverlayOpen = false;
    optionsOverlay?.classList.add("is-hidden");
    if (context === "game") {
      paused = optionsPriorPaused;
      optionsButton?.focus();
    } else {
      controlsButton?.focus();
    }
  }

  function confirmReturnToMainMenu() {
    if (!window.confirm("Return to the main menu and abandon the current run?")) return;
    showMenu();
  }

  function showGameCompleteOverlay() {
    optionsOverlayOpen = false;
    gameCompleteShown = true;
    paused = true;
    optionsOverlay?.classList.add("is-hidden");
    gameCompleteOverlay?.classList.remove("is-hidden");
    victoryMainMenuButton?.focus();
  }

  function showGameOverOverlay() {
    if (gameOverShown || gameCompleteShown) return;
    optionsOverlayOpen = false;
    gameOverShown = true;
    paused = true;
    optionsOverlay?.classList.add("is-hidden");
    gameOverOverlay?.classList.remove("is-hidden");
    restartLevelButton?.focus();
  }

  function restartCurrentLevel() {
    if (!currentLevel || loadingGame) return;
    void startSelectedLevel(getRestartLevelForScene(currentScene?.id));
  }

  function getRestartLevelForScene(sceneId) {
    if (LEVEL_ONE.scenes.some((scene) => scene.id === sceneId)) return LEVEL_ONE;
    if (LEVEL_TWO.scenes.some((scene) => scene.id === sceneId)) return LEVEL_TWO;
    if (LEVEL_THREE.scenes.some((scene) => scene.id === sceneId)) return LEVEL_THREE;
    return currentLevel;
  }

  function resetGameOverlays() {
    optionsOverlayOpen = false;
    optionsPriorPaused = false;
    optionsOverlayContext = "game";
    gameCompleteShown = false;
    gameOverShown = false;
    optionsOverlay?.classList.add("is-hidden");
    optionsOverlay?.classList.remove("game-overlay-menu");
    if (optionsHeading) optionsHeading.textContent = "Options";
    if (resumeButton) resumeButton.textContent = "Resume";
    optionsMainMenuButton?.classList.remove("is-hidden");
    playStage?.append(optionsOverlay);
    gameCompleteOverlay?.classList.add("is-hidden");
    gameOverOverlay?.classList.add("is-hidden");
  }

  function clearQueuedLevelTransition() {
    if (!queuedLevelTransition) return;
    window.clearTimeout(queuedLevelTransition);
    queuedLevelTransition = 0;
  }

  function readSave() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      const save = JSON.parse(raw);
      if (
        save?.version !== SAVE_VERSION ||
        !Array.isArray(save.completedLevels) ||
        typeof save.currentUnlockedLevel !== "string"
      ) throw new Error("Invalid save shape.");
      return save;
    } catch (error) {
      console.warn("Ignoring corrupted save file.", error);
      localStorage.removeItem(SAVE_KEY);
      return null;
    }
  }

  function writeSave(save) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }

  function writeCompletedLevelSave(level) {
    const previousSave = readSave();
    const completedLevels = new Set(previousSave?.completedLevels ?? []);
    completedLevels.add(level.id);
    if (level.id === DEMO_LEVEL_ID) {
      completedLevels.add(LEVEL_ONE_ID);
      completedLevels.add(LEVEL_TWO_ID);
      completedLevels.add(LEVEL_THREE_ID);
    }
    writeSave({
      version: SAVE_VERSION,
      completedLevels: [...completedLevels],
      currentUnlockedLevel: level.id === LEVEL_ONE_ID ? LEVEL_TWO_ID : LEVEL_THREE_ID,
      updatedAt: new Date().toISOString(),
    });
  }

  function updateLoadLevelButton() {
    if (!loadButton) return;
    loadButton.disabled = false;
    loadButton.setAttribute("aria-disabled", "false");
    loadButton.title = "Select a level";
  }

  function setMenuStatus(message) {
    if (menuStatus) menuStatus.textContent = message;
  }

  function setGameStatus(message) {
    if (gameStatus) gameStatus.textContent = message;
  }

  // ============================================================
  // Engine Canvas & Sprite Bounds
  // ============================================================

  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const spriteBoundsCanvas = document.createElement("canvas");
  const spriteBoundsCtx = spriteBoundsCanvas.getContext("2d", { willReadFrequently: true });

  // ============================================================
  // Engine Constants
  // ============================================================

  const VIEWPORT_WIDTH  = canvas.width;
  const VIEWPORT_HEIGHT = canvas.height;
  const GRAVITY         = 1700;
  const MOVE_SPEED      = GTW.GrannyPlayer.MOVE_SPEED;
  const JUMP_VELOCITY   = GTW.GrannyPlayer.JUMP_VELOCITY;
  const EXPECTED_JUMP_DURATION  = (Math.abs(JUMP_VELOCITY) * 2) / GRAVITY;
  const JUMP_START_FRAME        = GTW.GrannyPlayer.JUMP_START_FRAME;
  const JUMP_LAUNCH_FRAME       = GTW.GrannyPlayer.JUMP_LAUNCH_FRAME;
  const JUMP_RECOVERY_FRAME     = GTW.GrannyPlayer.JUMP_RECOVERY_FRAME;
  const COLOSTOMY_SPLAT_DURATION = GTW.GrannyPlayer.COLOSTOMY_SPLAT_DURATION;
  const COMBAT = GTW.CombatBalance;
  const GRANNY_SCALE            = GTW.GrannyPlayer.SCALE;
  const NURSE_SCALE             = 1.5;
  const WARD_SCALE              = 2.25;
  const MEATBALL_CANONICAL_SCALE_HEIGHT = 430;
  const PIZZA_MONSTER_CANONICAL_SCALE_HEIGHT = 77;
  const PIZZA_MONSTER_SIZE_MULTIPLIER = 1.5;
  const PIZZA_MONSTER_SPAWN_SIZE_MULTIPLIER = 0.5;
  const DEMON_CANONICAL_SCALE_HEIGHT = 470;
  const DEMON_RANGED_CANONICAL_SCALE_HEIGHT = 400;
  const DEMON_SIZE_MULTIPLIER = 0.75;
  const DEMON_RANGED_SIZE_MULTIPLIER = 0.6;
  const DEMON_RANGED_ATTACK_BODY_GAP = 100;
  const DEMON_RANGED_EDGE_RESET_DISTANCE = 400;
  const DEMON_RANGED_BOW_HOLD_FRAME = 8;
  const DEMON_RANGED_BOW_HOLD_DURATION = 1;
  const DEMON_RANGED_ARROW_SOURCE_POINT = { x: 660, y: 399 };
  const DEMON_RANGED_ARROW_TARGET_HEIGHT = 16;
  const DEMON_RANGED_HEALTH_BAR_GAP = 20;
  const SATAN_SIZE_MULTIPLIER = 1.75;
  const SATAN_CANONICAL_SCALE_HEIGHT = 301;
  const SATAN_JUMP_GROUND_ANCHOR_Y = 905;
  const SATAN_EVOLUTION_CANONICAL_SCALE_HEIGHT = 400;
  const SATAN_THROW_VELOCITY_X = 2600;
  const SATAN_THROW_VELOCITY_Y = -230;
  const SATAN_THROW_EDGE_MARGIN = 40;
  const SATAN_HEAL_RATIO = 0.2;
  const SATAN_HEAL_FRAME = 6;
  const SATAN_THRONE_X = 605;
  const SATAN_THRONE_Y = 352;
  const SATAN_THRONE_SEATED_FRAME = 5;
  const SATAN_THRONE_SEATED_HOLD = 2;
  const SATAN_THRONE_PRE_JUMP_IDLE = 0.5;
  const SATAN_THRONE_LANDING_IDLE = 1;
  const SATAN_EVOLUTION_MELEE_ACTIVE_START = 9;
  const SATAN_EVOLUTION_MELEE_ACTIVE_END = 12;
  const SATAN_EVOLUTION_SLAM_IMPACT_FRAME = 6;
  const SATAN_EVOLUTION_SLAM_LANDING_FRAME = 7;
  const SATAN_EVOLUTION_SUMMON_FRAME = 12;
  const SATAN_EVOLUTION_GROUND_SLAM_IMPACT_FRAME = 13;
  const SATAN_EVOLUTION_SLAM_RADIUS = 150;
  const SATAN_EVOLUTION_GROUNDED_STATES = new Set([
    "GroundedRecover", "GroundedRunAcquire", "GroundedRunCommit", "GroundedTurn", "GroundSlam",
  ]);
  const SATAN_COMBAT = COMBAT.enemies.Satan;
  const SATAN_EVOLUTION_COMBAT = COMBAT.enemies.SatanEvolution;
  const PIZZA_RANGED_MELEE_VISUAL_OFFSETS_X = [0, -3, -6.5, -5.5, 76.5, 66, 67.5, 65.5, 59.5, 46, 44.5, 44, 43, 44, 15];
  const BASIC_ENEMY_HEALTH_BAR_COLOR = "#c2410c";
  const BOSS_HEALTH_BAR_COLOR = "#b91c1c";
  const NURSE_VISUAL_WIDTH_MULTIPLIER  = 1.5;
  const NURSE_VISUAL_HEIGHT_MULTIPLIER = 1.25;
  const GRANNY_IDLE_SIZE_MULTIPLIER          = 1.9;
  const GRANNY_JUMP_SIZE_MULTIPLIER          = 1.9;
  const GRANNY_WALK_SIZE_MULTIPLIER          = 1.915;
  const GRANNY_MELEE_SIZE_MULTIPLIER         = 1.882;
  const GRANNY_KNOCKBACK_SIZE_MULTIPLIER     = 1.169;
  const GRANNY_THROW_SIZE_MULTIPLIER         = 1.09;
  const GRANNY_CROUCH_FOOT_BASELINES         = [972, 975, 975, 969, 977];
  const NURSE_IDLE_SIZE_MULTIPLIER           = 1.46;
  const NURSE_WALK_SIZE_MULTIPLIER           = 1.07;
  const NURSE_MELEE_SIZE_MULTIPLIER          = 1.5;
  const NURSE_KNOCKDOWN_SIZE_MULTIPLIER      = 1.5;
  const WARD_POINT_TARGET_MULTIPLIER         = 1.18;
  const WARD_KNOCKBACK_TARGET_MULTIPLIER     = 1.23;
  const GRANNY_JUMP_ATTACK_OPAQUE_TOP_Y = [501, 528, 552, 584, 591, 579, 149, 129, 106, 57, 481, 563, 572, 563];
  const NURSE_OFFSCREEN_SPAWN_MARGIN = 90;
  const LUNCH_LADY_WALK_SPEED = COMBAT.enemies.LunchLady.walkSpeed;
  const LUNCH_LADY_STRIDE_LENGTH = 50;
  const CHAR = {
    Granny: {
      targetHeight: Math.round((VIEWPORT_HEIGHT / 5) * GRANNY_SCALE),
      healthBarWidth: 92,
      barColor: "#2dd4bf",
      idleFallback: "Idle",
      strideLength: GTW.GrannyPlayer.WALK_STRIDE_LENGTH,
    },
    Nurse: {
      targetHeight: Math.round((VIEWPORT_HEIGHT / 4.8) * NURSE_SCALE),
      healthBarWidth: 78,
      barColor: BASIC_ENEMY_HEALTH_BAR_COLOR,
      idleFallback: "Idle",
      strideLength: 60,
      visualRange: 200,
    },
    Ward: {
      targetHeight: Math.round((VIEWPORT_HEIGHT / 3.7) * WARD_SCALE),
      healthBarWidth: 136,
      barColor: BOSS_HEALTH_BAR_COLOR,
      idleFallback: "Walk",
      strideLength: 46,
      visualRange: 250,
    },
    MeatballMonster: {
      targetHeight: Math.round(VIEWPORT_HEIGHT / 4.6),
      healthBarWidth: 112,
      barColor: BASIC_ENEMY_HEALTH_BAR_COLOR,
      idleFallback: "Idle",
      strideLength: 70,
    },
    LunchLady: {
      targetHeight: Math.round((VIEWPORT_HEIGHT / 3.8) * 1.15),
      healthBarWidth: 128,
      barColor: BOSS_HEALTH_BAR_COLOR,
      idleFallback: "Idle",
      strideLength: LUNCH_LADY_STRIDE_LENGTH,
      visualRange: 260,
    },
    PizzaMonster: {
      targetHeight: Math.round((VIEWPORT_HEIGHT / 4.2) * 1.1),
      healthBarWidth: 110,
      barColor: BOSS_HEALTH_BAR_COLOR,
      idleFallback: "Idle",
    },
    Demon: {
      targetHeight: Math.round(VIEWPORT_HEIGHT / 3.4),
      healthBarWidth: 86,
      barColor: BASIC_ENEMY_HEALTH_BAR_COLOR,
      idleFallback: "FlyIdle",
      strideLength: 70,
    },
    DemonRanged: {
      targetHeight: Math.round(VIEWPORT_HEIGHT / 3.4),
      healthBarWidth: 86,
      barColor: BASIC_ENEMY_HEALTH_BAR_COLOR,
      idleFallback: "FlyIdle",
      strideLength: 70,
    },
    Satan: {
      targetHeight: Math.round((VIEWPORT_HEIGHT / 3.2) * SATAN_SIZE_MULTIPLIER),
      healthBarWidth: 150,
      barColor: BOSS_HEALTH_BAR_COLOR,
      idleFallback: "Idle",
      strideLength: 200,
    },
    SatanEvolution: {
      targetHeight: Math.round((VIEWPORT_HEIGHT / 3.2) * SATAN_SIZE_MULTIPLIER),
      healthBarWidth: 150,
      barColor: BOSS_HEALTH_BAR_COLOR,
      idleFallback: "FlyIdle",
      strideLength: COMBAT.enemies.SatanEvolution.groundedRunStride,
    },
  };
  const COLOSTOMY_EXPLOSION_TARGET_HEIGHT = Math.round(CHAR.Granny.targetHeight * 1.1);
  const JUMP_MIN_SCALE_HEIGHT_RATIO       = GTW.GrannyPlayer.JUMP_MIN_SCALE_HEIGHT_RATIO;
  const JUMP_TARGET_HEIGHT_MULTIPLIER     = GTW.GrannyPlayer.JUMP_TARGET_HEIGHT_MULTIPLIER;
  const GRANNY_UPRIGHT_CANONICAL_SCALE_HEIGHT   = GTW.GrannyPlayer.UPRIGHT_CANONICAL_SCALE_HEIGHT;
  const GRANNY_KNOCKDOWN_TARGET_HEIGHT_MULTIPLIER = GTW.GrannyPlayer.KNOCKDOWN_TARGET_HEIGHT_MULTIPLIER;
  const WARD_CANONICAL_SCALE_HEIGHT       = 215;
  const WARD_ENTRANCE_GROUND_ANCHOR_Y     = 854;
  const WARD_HEALTH_BAR_RAISE_Y           = 15;
  const WARD_ENTRANCE_FALL_START_Y        = Math.round(VIEWPORT_HEIGHT * 0.08);
  const WARD_ENTRANCE_TARGET_MULTIPLIER   = 0.375;
  const WARD_SLAM_TARGET_MULTIPLIER       = 0.364;
  const WARD_KNOCKDOWN_TARGET_MULTIPLIER  = 1.8;
  const NURSE_DEATH_KNOCKDOWN_FRAME_INDEX = 5;
  const WARD_DEATH_KNOCKDOWN_FRAME_INDEX  = 4;
  const WARD_DEATH_TARGET_MULTIPLIER      = 2.0;
  const MEATBALL_CAPTURE_GRANNY_SCALE = 0.92;
  const MEATBALL_CAPTURE_GRANNY_FRAME = 3;
  const MEATBALL_CAPTURE_GRANNY_TILT = Math.PI / 10;
  const LUNCH_LADY_THROW_LIMIT = 7;
  const LUNCH_LADY_MAX_ACTIVE_MEATBALL_MONSTERS = 3;
  const LUNCH_LADY_THROW_INTERVAL = 3;
  const LUNCH_LADY_THROW_FACING_LOCK_TIME = 0.35;
  const LUNCH_LADY_THROW_RELEASE_FRAME = 23;
  const LUNCH_LADY_THROW_RELEASE_SOURCE_POINT = { x: 548, y: 683 };
  const LUNCH_LADY_MEATBALL_TRAVEL_TIME = 0.9;
  const LUNCH_LADY_MEATBALL_GRAVITY = 900;
  const LUNCH_LADY_MEATBALL_SIZE_MULTIPLIER = 2.5;
  const LUNCH_LADY_MEATBALL_TARGET_HEIGHT = Math.round(
    CHAR.LunchLady.targetHeight * 0.23 * LUNCH_LADY_MEATBALL_SIZE_MULTIPLIER
  );
  const LUNCH_LADY_MEATBALL_HIT_RADIUS = Math.round(LUNCH_LADY_MEATBALL_TARGET_HEIGHT * 0.34);
  const LUNCH_LADY_MEATBALL_FLIGHT_SCALE_X = 1.08;
  const LUNCH_LADY_MEATBALL_FLIGHT_SCALE_Y = 0.94;
  const MEATBALL_HEALTH_BAR_GAP = 14;
  const LUNCH_LADY_SPAWN = { x: 460, y: 375 };
  const LUNCH_LADY_COUNTER_FOREGROUND = { x: 326, y: 282, width: 268, height: 315 };

  // --- Kitchen Pot Explosion Prop ---
  const POT_SPRITE_COLUMNS = 4;
  const POT_SPRITE_ROWS = 13;
  const POT_TOTAL_FRAMES = 51;
  const POT_FPS = 14;
  const POT_INTRO_LOOP_FRAME_COUNT = 8;
  const POT_INTRO_LOOP_DURATION = 5;
  const POT_START_DELAY_AFTER_LUNCH_LADY_DEATH = 1;
  const POT_VIEWPORT_X = 185;
  const POT_VIEWPORT_Y = 368;
  const POT_DRAW_HEIGHT = 80;
  const POT_SCALE = 0.55;
  const POT_SIZE_MULTIPLIER = 2.5;
  const PIZZA_POT_LAUNCH_Y = POT_VIEWPORT_Y - Math.round(POT_DRAW_HEIGHT * POT_SCALE * POT_SIZE_MULTIPLIER);
  const PIZZA_GOO_SPOTS_X = [150, 480, 810];
  const PIZZA_GOO_WIDTH = 225;
  const PIZZA_GOO_LEFT_EXTEND = 25;
  const PIZZA_GOO_SCREEN_CROP_RATIO = 0.35;
  const PIZZA_GOO_TRAVEL_TIME = 0.4;
  const PIZZA_GOO_GRAVITY = 900;
  const PIZZA_LEAP_SPAWN_FRAME = 26;
  const HELL_HOLE_FRAME_COUNT = 49;
  const HELL_HOLE_FPS = 12;
  const HELL_HOLE_SLOW_SOURCE_DURATION = 1;
  const HELL_HOLE_SLOW_PLAY_DURATION = 5;
  const HELL_HOLE_FALL_START_TIME = 4.65;
  const HELL_HOLE_FALL_DURATION = 1.35;
  const HELL_HOLE_FADE_DURATION = 2;
  const HELL_HOLE_FALL_DISTANCE = 118;
  const HELL_HOLE_FALL_SCALE_END = 0.44;
  const HELL_HOLE_FALL_ROTATION = Math.PI / 13;
  const HELL_HALLWAY_ENTRY_FALL_DURATION = 1.15;
  const HELL_HALLWAY_ENTRY_STAND_DURATION = 0.75;
  const HELL_HALLWAY_ENTRY_START_SCREEN_X = Math.round(VIEWPORT_WIDTH * 0.48);
  const HELL_HALLWAY_ENTRY_START_Y = -44;
  const HELL_HALLWAY_ENTRY_STAND_START_RATIO = 0.58;
  const LUNCH_LADY_THROW_DRAW_BOUNDS = { x: 156, y: 401, width: 713, height: 610 };
  const LUNCH_LADY_STAGE2_CANONICAL_SCALE_HEIGHT = 490;
  const LUNCH_LADY_STAGE2_DRAW_BOUNDS = {
    Idle: { x: 367, y: 518, width: 290, height: 490 },
    Walk: { x: 330, y: 514, width: 363, height: 493 },
    KnockBack: { x: 314, y: 534, width: 374, height: 472 },
    KnockDown: { x: 269, y: 491, width: 487, height: 513 },
    MeleeAttack: { x: 152, y: 373, width: 722, height: 635 },
    Death: { x: 128, y: 484, width: 769, height: 519 },
  };
  const LUNCH_LADY_STAGE2_CANONICAL_SCALE_STATES = new Set(["Idle", "Walk", "KnockBack", "KnockDown", "MeleeAttack", "Slam", "Death"]);
  const LUNCH_LADY_STAGE2_SLAM_OPAQUE_BOTTOM_Y = [
    921, 920, 917, 915, 918, 920, 928, 927, 935, 932, 926, 851, 929,
    920, 936, 940, 936, 932, 941, 972, 982, 995, 942, 942, 943, 942,
  ];
  const LUNCH_LADY_STAGE2_MELEE_ANCHOR_FOOT_CENTER_X = 480.5;
  const LUNCH_LADY_STAGE2_MELEE_FOOT_CENTERS_X = [406,396,366.5,365,359,377,382,382,382,382,381.5,381.5,398,400.5,397.5,396.5,396,396,396];
  const LUNCH_LADY_STAGE2_SLAM_ANCHOR_CENTER_X = 400;
  const LUNCH_LADY_STAGE2_SLAM_BODY_CENTERS_X = [
    400, 403, 407, 399, 376, 369, 362, 361, 361, 364, 379, 379, 381,
    382, 384, 387, 391, 401, 423, 417, 418, 416, 415, 405, 394, 385,
  ];
  const LUNCH_LADY_THROW_ANCHOR_FOOT_CENTER_X = 389;
  const LUNCH_LADY_THROW_VISUAL_OFFSET_X = 25;
  const LUNCH_LADY_THROW_FOOT_CENTERS_X = [389,394.5,389,394.5,379,381.5,384.5,379,390,370.5,371.5,375.5,371.5,374.5,368,371,368,368.5,372,380,385,387.5,400.5,395.5,397.5,392.5,392.5];
  const LUNCH_LADY_SIZE_MULTIPLIER = 1.08;
  const LUNCH_LADY_STAGE1_IDLE_SIZE_MULTIPLIER = 2.25;
  const LUNCH_LADY_STAGE2_SIZE_MULTIPLIER = 1.5;
  const LUNCH_LADY_STAGE2_MELEE_SIZE_MULTIPLIER = 1;
  const LUNCH_LADY_STAGE2_SLAM_SIZE_MULTIPLIER = 1;
  const LUNCH_LADY_STAGE2_THROW_SIZE_MULTIPLIER = 1.25;
  const LUNCH_LADY_STAGE2_KNOCKDOWN_SIZE_MULTIPLIER = 1;
  const LUNCH_LADY_HEALTH_BAR_HEAD_GAP = 5;
  const LUNCH_LADY_THROW_SIZE_MULTIPLIER = 1.25;
  const LUNCH_LADY_MEATBALL_MIN_TARGET_GAP = 200;
  const LUNCH_LADY_MEATBALL_TARGETS = [250, 360, 500, 620, 730];
  const MEATBALL_MONSTER_ALLOWED_OVERLAP_X = 50;
  const ANIMATION_TARGET_MULTIPLIERS = {
    Granny: {
      ...GTW.GrannyPlayer.ANIMATION_TARGET_MULTIPLIERS,
      Idle: GRANNY_IDLE_SIZE_MULTIPLIER,
      Walk: GRANNY_WALK_SIZE_MULTIPLIER,
      MeleeAttack: GRANNY_MELEE_SIZE_MULTIPLIER,
      KnockBack: GRANNY_KNOCKBACK_SIZE_MULTIPLIER,
      ThrowColostomy: GRANNY_THROW_SIZE_MULTIPLIER,
    },
    Nurse: {
      Idle: NURSE_IDLE_SIZE_MULTIPLIER,
      Walk: NURSE_WALK_SIZE_MULTIPLIER,
      MeleeAttack: NURSE_MELEE_SIZE_MULTIPLIER,
      KnockDown: NURSE_KNOCKDOWN_SIZE_MULTIPLIER,
      Death: 1.6,
    },
    Ward: {
      Entrance:    WARD_ENTRANCE_TARGET_MULTIPLIER,
      Slam:        WARD_SLAM_TARGET_MULTIPLIER,
      KnockDown:   WARD_KNOCKDOWN_TARGET_MULTIPLIER,
      Walk:        1.2,
      Point:       WARD_POINT_TARGET_MULTIPLIER,
      MeleeAttack: 0.387,
      KnockBack:   WARD_KNOCKBACK_TARGET_MULTIPLIER,
      Death:       WARD_DEATH_TARGET_MULTIPLIER,
    },
  };
  const ENEMY_DEATH_HOLD_DURATION    = 3;
  const ENEMY_DEATH_FADE_DURATION    = 2;
  const ENEMY_DEATH_END_SCALE        = 0.18;
  const PLAYER_MAX_HEALTH = COMBAT.player.maxHealth;
  const PLAYER_MELEE_DAMAGE = COMBAT.player.attacks.meleeDamage;
  const PLAYER_KICK_DAMAGE = COMBAT.player.attacks.kickDamage;
  const PLAYER_JUMP_ATTACK_DAMAGE = COMBAT.player.attacks.jumpAttackDamage;
  const KICK_ACTIVE = GTW.GrannyPlayer.KICK_ACTIVE;
  const JUMP_ATTACK_ACTIVE = GTW.GrannyPlayer.JUMP_ATTACK_ACTIVE;
  const CROUCH_HOLD_FRAME = GTW.GrannyPlayer.CROUCH_HOLD_FRAME;
  const PLAYER_MELEE_HITBOX_WIDTH_REDUCTION = COMBAT.player.attacks.meleeHitboxWidthReduction;
  const PLAYER_COLOSTOMY_DIRECT_DAMAGE = COMBAT.player.attacks.colostomyDirectDamage;
  const PLAYER_COLOSTOMY_COOLDOWN = COMBAT.player.attacks.colostomyCooldown;
  const PLAYER_DAMAGE_COOLDOWN = COMBAT.player.damageCooldown;
  const PLAYER_HIT_FLASH_DURATION = COMBAT.player.hitFlashDuration;
  const NURSE_MELEE_DAMAGE = COMBAT.enemies.Nurse.meleeDamage;
  const WARD_MELEE_DAMAGE  = COMBAT.enemies.Ward.meleeDamage;
  const WARD_SLAM_DAMAGE   = COMBAT.enemies.Ward.slamDamage;
  const MEATBALL_GRAB_DAMAGE = COMBAT.enemies.MeatballMonster.grabDamage;
  const MEATBALL_WALK_SPEED = COMBAT.enemies.MeatballMonster.walkSpeed;
  const MEATBALL_GRAB_RANGE_X = COMBAT.enemies.MeatballMonster.grabRangeX;
  const MEATBALL_GRAB_RANGE_Y = COMBAT.enemies.MeatballMonster.grabRangeY;
  const PIZZA_COMBAT = COMBAT.enemies.PizzaMonster;
  const LUNCH_LADY_MELEE_DAMAGE = COMBAT.enemies.LunchLady.meleeDamage;
  const LUNCH_LADY_SLAM_DAMAGE = COMBAT.enemies.LunchLady.slamDamage;
  const LUNCH_LADY_THROW_DAMAGE = COMBAT.enemies.LunchLady.throwDamage;
  const LUNCH_LADY_SLAM_INTERVAL = COMBAT.enemies.LunchLady.slamInterval;
  const WARD_POINT_INTERVAL = COMBAT.enemies.Ward.pointInterval;
  const WARD_SLAM_INTERVAL  = COMBAT.enemies.Ward.slamInterval;
  const WARD_ATTACK_READY_GRACE = COMBAT.enemies.Ward.attackReadyGrace;
  const PLAYER_LOCKED_STATES = GTW.GrannyPlayer.PLAYER_LOCKED_STATES;
  const BODY_SEPARATION_GAP  = 4;
  const GRANNY_BODY_EXTRA_WIDTH = 40;
  const GRANNY_BODY_EXTRA_HEIGHT_TOP = 25;
  const ATTACK_EVENTS = {
    nurseMelee: { activeStartFrame: 4, impactFrame: 9, activeEndFrame: 12 },
    wardMelee:  { impactFrame: 11 },
    wardSlam:   { impactFrame: 10 },
    lunchLadyMelee: { impactFrame: 14 },
    lunchLadySlam: { impactFrame: 19 },
    meatballGrab: { activeStartFrame: 6, activeEndFrame: 8, releaseFrame: 17 },
    pizzaRangedMelee: { activeStartFrame: 4, activeEndFrame: 13 },
    demonMelee: { activeStartFrame: 7, activeEndFrame: 11 },
    demonRangedArrow: { releaseFrame: 9 },
  };

  const ANIMATION_DEFS = (() => {
    const granny = JSON.parse(JSON.stringify(GTW.GrannyPlayer.ANIMATION_DEF));
    // Reconcile Granny frameCount values to match frames on disk.
    granny.Idle.frameCount              = 13; // max index _12
    granny.Walk.frameCount              = 21; // max index _20
    granny.Jump.frameCount              = 23; // max index _22
    granny.MeleeAttack.frameCount       = 11; // max index _10
    granny.ThrowColostomy.frameCount    = 16; // max index _15
    granny.ColostomyExplosion.frameCount = 14; // max index _13
    granny.KnockBack.frameCount         = 4;  // max index _03
    granny.KnockDown.frameCount         = 20; // max index _19
    granny.Death.frameCount             = 11; // max index _10
    granny.Kick.frameCount              = 15; // max index _14
    granny.JumpAttack.frameCount        = 14; // max index _13
    return {
      Granny: granny,
      Nurse: {
        Idle:        { fps: 6,  loop: true,  frameCount: 22 }, // max index _21
        Walk:        { fps: 10, loop: true,  frameCount: 18 }, // max index _17
        MeleeAttack: { fps: 14, loop: false, frameCount: 7  }, // max index _06
        KnockDown:   { fps: 18, loop: false, offsetY: 8, frameCount: 18 }, // max index _17
        Death:       { fps: 1,  loop: false, offsetY: 8, frameCount: 1  },
      },
      Ward: {
        Entrance:    { fps: 14, loop: false, frameCount: 28 }, // max index _27
        Walk:        { fps: 14, loop: true,  frameCount: 13 }, // max index _12
        Point:       { fps: 12, loop: false, frameCount: 14 }, // max index _13
        MeleeAttack: { fps: 14, loop: false, frameCount: 23 }, // max index _22
        Slam:        { fps: 13, loop: false, frameCount: 11 }, // max index _10
        KnockBack:   { fps: 16, loop: false, frameCount: 7  }, // max index _06
        KnockDown:   { fps: 14, loop: false, offsetY: 8, frameCount: 20 }, // max index _19
        Death:       { fps: 1,  loop: false, offsetY: 8, frameCount: 1  },
      },
      MeatballMonster: {
        Spawn:     { fps: 14, loop: false, frameCount: 25 },
        Idle:      { fps: 8,  loop: true,  frameCount: 21 },
        Walk:      { fps: 12, loop: true,  frameCount: 19 },
        Grab:      { fps: 14, loop: false, frameCount: 20 },
        KnockBack: { fps: 16, loop: false, frameCount: 6 },
        Death:     { fps: 14, loop: false, frameCount: 26 },
      },
      LunchLady: {
        Idle:          { fps: 8,  loop: true,  frameCount: 18 },
        Walk:          { fps: 12, loop: true,  frameCount: 14 },
        MeleeAttack:   { fps: 13, loop: false, frameCount: 19 },
        Slam:          { fps: 13, loop: false, frameCount: 26 },
        ThrowMeatball: { fps: 14, loop: false, frameCount: 27 },
        KnockBack:     { fps: 12, loop: false, frameCount: 8 },
        KnockDown:     { fps: 12, loop: false, frameCount: 8 },
        Death:         { fps: 10, loop: false, frameCount: 10 },
      },
      PizzaMonster: {
        Idle:            { fps: 8,  loop: true,  frameCount: 7 },
        GroundLeapStart: { fps: 16, loop: false, frameCount: 17 },
        Leap:            { fps: 14, loop: true,  frameCount: 6 },
        LeapLand:        { fps: 16, loop: false, frameCount: 12 },
        Grab:            { fps: 12, loop: false, frameCount: 8 },
        GrabEnd:         { fps: 12, loop: false, frameCount: 6 },
        RangedMelee:     { fps: 12, loop: false, frameCount: 15 },
        Hitstun:         { fps: 28, loop: false, frameCount: 9 },
        Dazed:           { fps: 8,  loop: true,  frameCount: 8 },
        Death:           { fps: 12, loop: false, frameCount: 15 },
      },
      Demon: {
        GroundedToFly:  { fps: 14, loop: false, frameCount: 23 },
        FlyIdle:        { fps: 8,  loop: true,  frameCount: 12 },
        FlyForward:     { fps: 12, loop: true,  frameCount: 8 },
        FlyMeleeAttack: { fps: 14, loop: false, frameCount: 15 },
        KnockBack:      { fps: 14, loop: false, frameCount: 7 },
        Death:          { fps: 12, loop: false, frameCount: 16 },
      },
      DemonRanged: {
        GroundedToFly:   { fps: 14, loop: false, frameCount: 23 },
        FlyIdle:         { fps: 8,  loop: true,  frameCount: 12 },
        FlyForward:      { fps: 12, loop: true,  frameCount: 15 },
        FlyRangedAttack: { fps: 14, loop: false, frameCount: 13 },
        KnockBack:       { fps: 14, loop: false, frameCount: 10 },
        Death:           { fps: 12, loop: false, frameCount: 13 },
      },
      Satan: {
        Idle:        { fps: 5.33, loop: true,  frameCount: 11 },
        Walk:        { fps: 10, loop: true,  frameCount: 8 },
        Run:         { fps: 14, loop: true,  frameCount: 18 },
        MeleeAttack: { fps: 16, loop: false, frameCount: 14 },
        Grab:        { fps: 14, loop: false, frameCount: 19 },
        Jump:        { fps: 14, loop: false, frameCount: 21 },
        KnockBack:   { fps: 12, loop: false, frameCount: 9 },
        KnockDown:   { fps: 7.5, loop: false, frameCount: 9 },
      },
      SatanEvolution: {
        Cutscene:          { fps: 12, loop: false, frameCount: 62 },
        GroundedToFly:     { fps: 14, loop: false, frameCount: 18 },
        FlyIdle:           { fps: 8,  loop: true,  frameCount: 16 },
        FlyForward:        { fps: 12, loop: true,  frameCount: 19 },
        FlyMeleeAttack:    { fps: 14, loop: false, frameCount: 20 },
        JumpSlam:          { fps: 14, loop: false, frameCount: 22 },
        Summon:            { fps: 12, loop: false, frameCount: 21 },
        Run:               { fps: 14, loop: true,  frameCount: 14 },
        GroundSlam:        { fps: 14, loop: false, frameCount: 20 },
        GroundedKnockBack: { fps: 12, loop: false, frameCount: 7 },
        GroundedKnockDown: { fps: 10, loop: false, frameCount: 7 },
        Death:             { fps: 12, loop: false, frameCount: 30 },
      },
    };
  })();

  // Legacy Granny, Nurse, and Ward sets intentionally retain gaps in their
  // source numbering. Loading the known indices preserves their animation
  // order without issuing a failed request for every gap on each game boot.
  const SPARSE_FRAME_INDICES = {
    Granny: {
      Jump: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 20, 21, 22],
      MeleeAttack: [0, 1, 2, 6, 7, 8, 9, 10],
      KnockDown: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 18, 19],
    },
    Nurse: {
      Idle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      Walk: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17],
      KnockDown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17],
    },
    Ward: {
      Entrance: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      Point: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      MeleeAttack: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      Slam: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      KnockBack: [0, 4, 5, 6],
      KnockDown: [0, 1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    },
  };

  // ============================================================
  // Engine State — per-scene variables (reset each loadScene)
  // ============================================================

  let worldWidth    = VIEWPORT_WIDTH;
  let floorPath     = { nearX: 92, nearY: 528, farX: VIEWPORT_WIDTH - 92, farY: 516 };
  let maxEnemies    = 3;
  let sceneBackground = null;

  let sceneRequiredCount    = 0;
  let sceneRequiredDefeated = 0;
  let sceneMeatballDefeated = 0;
  let currentLevel  = null;
  let currentScene  = null;
  let sceneIndex    = 0;
  let sceneCompleted = false;
  let delayedEncounters     = [];  // { timer, encounter } — spawns after delay elapses
  let triggeredEncounters   = [];  // { encounter } — spawns once when trigger condition is met

  // Kitchen pot explosion state
  let potFrames     = null;
  let potState      = "hidden";   // "hidden" | "idle" | "exploding" | "exploded"
  let potAnimTime   = 0;
  let potIntroLoopTime = 0;
  let potFinishTime = 0;
  let potFrameIndex = 0;
  let potStartDelay = 0;
  let pizzaGooFrame = null;
  let pizzaMonsterSpawnedFromPot = false;
  let pizzaGooActive = [false, false, false];
  const pizzaGooProjectiles = [];
  let hellHoleFrames = null;
  let wardEntranceSequence = null;
  let hellHallwayEntrySequence = null;
  let sceneFade = null;

  let onStatusCallback        = () => {};
  let onSceneCompleteCallback = () => {};
  let onLevelCompleteCallback = () => {};
  let rafId = 0;
  let engineRunning = false;

  // ============================================================
  // Engine State — persistent across scenes
  // ============================================================

  const keys        = Object.create(null);
  const justPressed = new Set();

  const player = {
    type: "Granny",
    x: 260,
    y: 0,
    vx: 0,
    vy: 0,
    width:  Math.round(32 * GRANNY_SCALE),
    height: Math.round(82 * GRANNY_SCALE),
    facing: 1,
    onGround: true,
    state: "Idle",
    animTime: 0,
    frameIndex: 0,
    jumpTime: 0,
    jumpLaunched: false,
    projectileThrown: false,
    colostomyCooldown: 0,
    colostomyReadyFlash: 0,
    recentHitIds: new Set(),
    damageCooldown: 0,
    hitFlash: 0,
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
    alive: true,
    walkDistance: 0,
    meleeCooldown: 0,
    capture: null,
  };

  const camera      = { x: 0 };
  const projectiles = [];
  const lunchLadyMeatballs = [];
  const demonRangedArrows = [];
  const effects     = [];
  const enemies     = [];

  let animations      = null;
  let previousTimestamp = 0;
  let nextEnemyId     = 1;
  let paused          = false;
  let screenShakeTime     = 0;
  let screenShakeStrength = 0;

  // ============================================================
  // Engine Lifecycle
  // ============================================================

  async function initEngine(callbacks = {}) {
    onStatusCallback        = callbacks.onStatus        ?? (() => {});
    onSceneCompleteCallback = callbacks.onSceneComplete ?? (() => {});
    onLevelCompleteCallback = callbacks.onLevelComplete ?? (() => {});

    if (!animations) {
      animations = await loadAnimations();
    }
    // Crouch reuses the JumpAttack frames (held crouch pose); alias frames + def.
    if (animations?.Granny?.JumpAttack && !animations.Granny.Crouch) {
      animations.Granny.Crouch = animations.Granny.JumpAttack;
      ANIMATION_DEFS.Granny.Crouch = ANIMATION_DEFS.Granny.JumpAttack;
    }
    if (!potFrames) {
      potFrames = await loadPotExplosionFrames();
    }
    if (!pizzaGooFrame) {
      pizzaGooFrame = await loadPizzaGooFrame();
    }
    if (!hellHoleFrames) {
      hellHoleFrames = await loadHellHoleFrames();
    }

    if (!engineRunning) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup",   handleKeyUp);
      previousTimestamp = 0;
      rafId = requestAnimationFrame(loop);
      engineRunning = true;
    }
  }

  function stopEngine() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup",   handleKeyUp);
    enemies.length     = 0;
    projectiles.length = 0;
    effects.length     = 0;
    lunchLadyMeatballs.length = 0;
    demonRangedArrows.length = 0;
    pizzaGooProjectiles.length = 0;
    pizzaGooActive = [false, false, false];
    pizzaMonsterSpawnedFromPot = false;
    wardEntranceSequence = null;
    hellHallwayEntrySequence = null;
    sceneFade = null;
    delayedEncounters.length = 0;
    triggeredEncounters.length = 0;
    currentLevel  = null;
    currentScene  = null;
    paused        = false;
    resetGameOverlays();
    engineRunning = false;
  }

  async function loadLevel(levelConfig) {
    currentLevel = levelConfig;
    await loadScene(0);
  }

  async function loadScene(idx, options = {}) {
    resetGameOverlays();
    paused = false;
    sceneIndex   = idx;
    currentScene = currentLevel.scenes[idx];

    enemies.length     = 0;
    projectiles.length = 0;
    effects.length     = 0;
    lunchLadyMeatballs.length = 0;
    demonRangedArrows.length = 0;
    pizzaGooProjectiles.length = 0;
    delayedEncounters.length = 0;
    triggeredEncounters.length = 0;
    wardEntranceSequence = null;
    hellHallwayEntrySequence = null;
    sceneFade = options.fadeInFromBlack
      ? { mode: "fadeIn", time: 0, duration: HELL_HOLE_FADE_DURATION, alpha: 1 }
      : null;
    screenShakeTime     = 0;
    screenShakeStrength = 0;
    camera.x            = 0;
    sceneCompleted      = false;
    sceneMeatballDefeated = 0;

    worldWidth  = currentScene.worldWidth  ?? VIEWPORT_WIDTH;
    floorPath   = currentScene.floorPath   ?? { nearX: 92, nearY: 528, farX: VIEWPORT_WIDTH - 92, farY: 516 };
    maxEnemies  = currentScene.maxEnemies  ?? 3;

    const spawnX = currentScene.playerSpawn?.x ?? 260;
    player.x    = spawnX;
    player.y    = getGroundYAtX(spawnX);
    player.vx   = 0;
    player.vy   = 0;
    player.onGround   = true;
    player.facing     = 1;
    player.state      = "Idle";
    player.animTime   = 0;
    player.frameIndex = 0;
    player.jumpTime   = 0;
    player.jumpLaunched    = false;
    player.projectileThrown = false;
    player.colostomyCooldown = 0;
    player.colostomyReadyFlash = 0;
    player.recentHitIds.clear();
    player.damageCooldown = 0;
    player.hitFlash = 0;
    player.health = player.maxHealth;
    player.alive  = true;
    player.walkDistance = 0;
    player.capture = null;

    if (options.hellDropIn) {
      hellHallwayEntrySequence = {
        phase: "waitingFadeIn",
        time: 0,
        startX: camera.x + HELL_HALLWAY_ENTRY_START_SCREEN_X,
        startY: HELL_HALLWAY_ENTRY_START_Y,
        targetX: player.x,
        targetY: player.y,
        facing: 1,
      };
    }

    sceneBackground = await loadBackground(currentScene.background);

    if (currentScene.id === "kitchen-lunch-lady-s2" && potFrames) {
      resetPotState();
    } else {
      potState = "hidden";
      pizzaGooActive = [false, false, false];
      pizzaMonsterSpawnedFromPot = false;
    }

    if (currentScene.hellHoleSequence) {
      resetWardEntranceSequence();
    }

    spawnSceneEncounters(currentScene);
    onStatusCallback(currentScene.instructions ?? "");
  }

  function spawnSceneEncounters(scene) {
    sceneRequiredCount    = scene.potPizzaRequiredForClear ? 1 : 0;
    sceneRequiredDefeated = 0;

    for (const encounter of scene.encounters ?? []) {
      sceneRequiredCount += getRequiredEnemyCount(encounter);
      if (encounter.delay > 0) {
        delayedEncounters.push({ timer: encounter.delay, encounter });
        continue;
      }
      if (encounter.trigger) {
        triggeredEncounters.push({ encounter });
        continue;
      }
      spawnEncounter(encounter);
    }
  }

  function getRequiredEnemyCount(encounter) {
    if (!encounter.requiredForClear) return 0;
    if (encounter.type === "LunchLadyS1") return 0;
    return encounter.count ?? 1;
  }

  function spawnEncounter(encounter) {
    if (encounter.type === "Nurse") {
      const count      = encounter.count ?? 1;
      const spawnXList = Array.isArray(encounter.spawnX) ? encounter.spawnX : [encounter.spawnX ?? 690];
      for (let i = 0; i < count; i++) {
        const x = spawnXList[i] ?? spawnXList[spawnXList.length - 1];
        spawnNurse(x, {
          health:           encounter.health ?? COMBAT.enemies.Nurse.maxHealth,
          requiredForClear: encounter.requiredForClear ?? false,
          aiMode:           encounter.aiMode ?? "chase",
          aggroRange:       encounter.aggroRange ?? 100,
          group:            encounter.group ?? null,
          facing:           encounter.facing,
          offscreenEntry:   encounter.offscreenEntry,
          offscreenMargin:  encounter.offscreenMargin,
        });
      }
    } else if (encounter.type === "Ward") {
      spawnWardBoss({
        spawnX:            encounter.spawnX ?? 760,
        health:            encounter.health ?? COMBAT.enemies.Ward.maxHealth,
        requiredForClear:  encounter.requiredForClear ?? false,
        forcedPointActions: encounter.forcedPointActions ?? 0,
      });
    } else if (encounter.type === "LunchLadyS1") {
      spawnLunchLadyBoss({ x: encounter.spawnX ?? LUNCH_LADY_SPAWN.x });
    } else if (encounter.type === "LunchLadyS2") {
      spawnLunchLadyStage2Boss({
        spawnX: encounter.spawnX ?? 760,
        requiredForClear: encounter.requiredForClear ?? false,
      });
    } else if (encounter.type === "Demon" || encounter.type === "DemonRanged") {
      const count = encounter.count ?? 1;
      const spawnXList = Array.isArray(encounter.spawnX) ? encounter.spawnX : [encounter.spawnX ?? 720];
      for (let i = 0; i < count; i += 1) {
        const spawnX = spawnXList[i] ?? spawnXList[spawnXList.length - 1];
        const options = {
          requiredForClear: encounter.requiredForClear ?? false,
          facing: encounter.facing,
          summonedBySatanEvolutionId: encounter.summonedBySatanEvolutionId ?? null,
        };
        if (encounter.type === "Demon") spawnDemon(spawnX, options);
        else spawnDemonRanged(spawnX, options);
      }
    } else if (encounter.type === "Satan") {
      spawnSatanBoss({
        spawnX: encounter.spawnX ?? SATAN_THRONE_X,
        y: encounter.y ?? SATAN_THRONE_Y,
        requiredForClear: encounter.requiredForClear ?? false,
        throneEntrance: currentScene?.id === "hell-throne-room",
      });
    }
  }

  function updateTriggeredEncounters() {
    for (let i = triggeredEncounters.length - 1; i >= 0; i -= 1) {
      const { encounter } = triggeredEncounters[i];
      if (!shouldTriggerEncounter(encounter)) continue;
      spawnEncounter(encounter);
      triggeredEncounters.splice(i, 1);
    }
  }

  function shouldTriggerEncounter(encounter) {
    const trigger = encounter.trigger;
    if (!trigger) return false;

    if (trigger.type === "after-required-defeated") {
      return sceneRequiredDefeated >= (trigger.requiredDefeated ?? 0);
    }

    if (trigger.type === "on-group-alerted") {
      return enemies.some((enemy) => (
        enemy.type === "Nurse" &&
        enemy.group === trigger.group &&
        enemy.alerted
      ));
    }

    return false;
  }

  function updateDelayedEncounters(dt) {
    for (let i = delayedEncounters.length - 1; i >= 0; i--) {
      delayedEncounters[i].timer -= dt;
      if (delayedEncounters[i].timer <= 0) {
        spawnEncounter(delayedEncounters[i].encounter);
        delayedEncounters.splice(i, 1);
      }
    }
  }

  function registerEnemyKill(enemy) {
    if (!enemy.killCounted) {
      enemy.killCounted = true;
      if (enemy.requiredForClear) sceneRequiredDefeated += 1;
      if (enemy.type === "MeatballMonster") sceneMeatballDefeated += 1;
    }
  }

  function hasActiveHostileEnemies() {
    return enemies.some((enemy) => !enemy.removed && enemy.alive && !enemy.nonHostile);
  }

  function checkSceneCompletion() {
    if (sceneCompleted || !currentScene?.clearCondition) return;
    const cond = currentScene.clearCondition;
    if (cond.type === "reach-exit") {
      if (player.alive && player.x >= cond.x) completeScene();
    } else if (cond.type === "defeat-required") {
      if (sceneRequiredCount > 0 && sceneRequiredDefeated >= sceneRequiredCount) completeScene();
    } else if (cond.type === "defeat-required-then-door") {
      const allDefeated =
        sceneRequiredCount > 0 &&
        sceneRequiredDefeated >= sceneRequiredCount &&
        delayedEncounters.length === 0 &&
        triggeredEncounters.length === 0;
      const atDoor = Math.abs(player.x - cond.x) <= (cond.radius ?? 45);
      if (player.alive && allDefeated && atDoor) completeScene();
    } else if (cond.type === "defeat-then-exit") {
      const allDefeated = sceneRequiredCount > 0 && sceneRequiredDefeated >= sceneRequiredCount && delayedEncounters.length === 0 && triggeredEncounters.length === 0;
      if (player.alive && allDefeated && player.x >= cond.x) completeScene();
    } else if (cond.type === "defeat-all-then-exit") {
      const allDefeated =
        sceneRequiredCount > 0 &&
        sceneRequiredDefeated >= sceneRequiredCount &&
        delayedEncounters.length === 0 &&
        triggeredEncounters.length === 0 &&
        !hasActiveHostileEnemies();
      if (player.alive && allDefeated && player.x >= cond.x) completeScene();
    } else if (cond.type === "meatball-kills-then-exit") {
      if (player.alive && sceneMeatballDefeated >= (cond.count ?? 0) && player.x >= cond.x) completeScene();
    }
  }

  function completeScene() {
    if (sceneCompleted) return;
    sceneCompleted = true;
    const isLast = sceneIndex >= currentLevel.scenes.length - 1;
    if (currentScene.completesLevel || isLast) {
      window.setTimeout(() => onLevelCompleteCallback(currentLevel), 1200);
    } else {
      const nextScene = currentLevel.scenes[sceneIndex + 1];
      onSceneCompleteCallback(currentScene, nextScene);
      window.setTimeout(() => void loadScene(sceneIndex + 1), 700);
    }
  }

  // ============================================================
  // Asset Loading
  // ============================================================

  async function loadAnimations() {
    const result = {};
    const assets = [
      { label: "Granny", folder: "granny", root: "character_variants", frameDirectory: "Granny" },
      { label: "Nurse", folder: "nurse", root: "enemy_variants", frameDirectory: "Nurse" },
      { label: "Ward", folder: "ward", root: "enemy_variants", frameDirectory: "Ward" },
      { label: "MeatballMonster", folder: "meatball_monster", root: "enemy_variants", frameDirectory: "MeatballMonster" },
      { label: "LunchLady", folder: "lunch_lady", root: "enemy_variants", frameDirectory: "LunchLady" },
      { label: "PizzaMonster", folder: "pizza_monster", root: "enemy_variants", frameDirectory: "" },
      { label: "Demon", folder: "demon", root: "enemy_variants", frameDirectory: "Demon" },
      { label: "DemonRanged", folder: "demon_ranged", root: "enemy_variants", frameDirectory: "DemonRanged" },
      { label: "Satan", folder: "satan", root: "enemy_variants", frameDirectory: "Satan" },
      { label: "SatanEvolution", folder: "satan_evolution", root: "enemy_variants", frameDirectory: "SatanEvolution" },
    ];
    for (const asset of assets) {
      result[asset.label] = {};
      for (const animName of Object.keys(ANIMATION_DEFS[asset.label])) {
        result[asset.label][animName] = await loadAnimationSequence(
          asset.folder, asset.label, animName, ANIMATION_DEFS[asset.label][animName], asset,
        );
      }
    }
    result.LunchLadyProjectile = {
      Meatball: [await loadFrame("./enemy_variants/lunch_lady/frames/LunchLadyProjectile/Meatball_00.png", "Meatball_00")],
    };
    result.DemonRangedProjectile = {
      Arrow: [await loadFrame("./enemy_variants/demon_ranged/frames/DemonRangedProjectile/Arrow_00.png", "Arrow_00")],
    };
    return result;
  }

  async function loadAnimationSequence(folderName, characterName, animationName, def, asset = null) {
    const frames = await loadSequence(folderName, characterName, animationName, def.frameCount, asset);
    def.frameCount = frames.length;
    return frames;
  }

  async function loadSequence(folderName, characterName, animationName, maxFrames = 64, asset = null) {
    const frames = [];
    const root = asset?.root ?? "character_variants";
    const frameDirectory = asset?.frameDirectory ?? characterName;
    const frameDirectorySegment = frameDirectory ? `${frameDirectory}/` : "";
    const frameIndices = SPARSE_FRAME_INDICES[characterName]?.[animationName]
      ?? Array.from({ length: maxFrames }, (_, index) => index);
    for (const index of frameIndices) {
      const url = `./${root}/${folderName}/frames/${frameDirectorySegment}${animationName}_${String(index).padStart(2, "0")}.png`;
      try {
        frames.push(await loadFrame(url, `${animationName}_${String(index).padStart(2, "0")}`));
      } catch (_) {
        // Gap in sequence — skip and continue to next index
      }
    }
    if (!frames.length) {
      console.warn(`${characterName}/${animationName} — no frames found on disk.`);
    }
    return frames;
  }

  async function loadFrame(url, name) {
    const image = await loadImage(url);
    return {
      image,
      name,
      bounds: getImageOpaqueBounds(image),
      origin: "built-in",
    };
  }

  async function loadSequenceFromDataUrls(frames) {
    const loaded = [];
    for (const frame of frames) {
      const image = await loadImage(frame.dataUrl);
      loaded.push({
        image,
        name: frame.name,
        bounds: getImageOpaqueBounds(image),
        origin: "local-override",
      });
    }
    return loaded;
  }

  function getImageOpaqueBounds(image) {
    spriteBoundsCanvas.width  = image.naturalWidth  || image.width;
    spriteBoundsCanvas.height = image.naturalHeight || image.height;
    spriteBoundsCtx.clearRect(0, 0, spriteBoundsCanvas.width, spriteBoundsCanvas.height);
    spriteBoundsCtx.drawImage(image, 0, 0);

    let imageData;
    try {
      imageData = spriteBoundsCtx.getImageData(0, 0, spriteBoundsCanvas.width, spriteBoundsCanvas.height);
    } catch (_) {
      return { x: 0, y: 0, width: spriteBoundsCanvas.width, height: spriteBoundsCanvas.height };
    }

    const { data, width, height } = imageData;
    let minX = width, minY = height, maxX = -1, maxY = -1, opaquePixels = 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha <= 8) continue;
        opaquePixels += 1;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }

    if (maxX < minX || maxY < minY) return { x: 0, y: 0, width, height };
    return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1, opaquePixels };
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload  = () => resolve(image);
      image.onerror = () => reject(new Error(`Unable to load ${url}`));
      const direct = /^(?:data:|blob:)/.test(url);
      const forceReload = new URLSearchParams(window.location.search).get("reloadAssets") === "1";
      image.src = direct || window.location.protocol === "file:" || !forceReload
        ? url
        : `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
    });
  }

  async function loadBackground(url) {
    if (!url) return null;
    try {
      return await loadImage(url);
    } catch (error) {
      console.warn("Scene background unavailable. Using procedural backdrop.", error);
      return null;
    }
  }

  // ============================================================
  // Kitchen Pot Explosion
  // ============================================================

  async function loadPotExplosionFrames() {
    try {
      const sheetImage = await loadImage("./game/assets/pot-explosion-sheet.png");
      const frames = [];
      const cellW = Math.round(sheetImage.width / POT_SPRITE_COLUMNS);
      const cellH = Math.round(sheetImage.height / POT_SPRITE_ROWS);

      for (let i = 0; i < POT_TOTAL_FRAMES; i++) {
        const col = i % POT_SPRITE_COLUMNS;
        const row = Math.floor(i / POT_SPRITE_COLUMNS);
        const sx = col * cellW;
        const sy = row * cellH;

        const cellCanvas = document.createElement("canvas");
        cellCanvas.width = cellW;
        cellCanvas.height = cellH;
        const cellCtx = cellCanvas.getContext("2d");
        cellCtx.drawImage(sheetImage, sx, sy, cellW, cellH, 0, 0, cellW, cellH);

        const bounds = getImageOpaqueBounds(cellCanvas);
        frames.push({ image: cellCanvas, bounds });
      }
      return frames;
    } catch (error) {
      console.warn("Pot explosion sprite sheet unavailable.", error);
      return null;
    }
  }

  async function loadPizzaGooFrame() {
    try {
      return await loadImage("./game/assets/pizza-monster-goo.png");
    } catch (error) {
      console.warn("Pizza Monster goo image unavailable.", error);
      return null;
    }
  }

  async function loadHellHoleFrames() {
    const frames = [];
    for (let i = 0; i < HELL_HOLE_FRAME_COUNT; i += 1) {
      const token = String(i).padStart(2, "0");
      try {
        frames.push(await loadImage(`./game/assets/ward-entrance-hell-hole/Opening_${token}.png`));
      } catch (error) {
        console.warn(`Ward Entrance hell-hole frame ${token} unavailable.`, error);
        break;
      }
    }
    return frames;
  }

  function resetPotState() {
    potState = "idle";
    potAnimTime = 0;
    potIntroLoopTime = 0;
    potFinishTime = 0;
    potFrameIndex = 0;
    potStartDelay = 0;
    pizzaMonsterSpawnedFromPot = false;
    pizzaGooActive = [false, false, false];
    pizzaGooProjectiles.length = 0;
  }

  function triggerPotExplosion() {
    if (potState !== "idle" || !potFrames) return;
    potStartDelay = 0;
    potState = "exploding";
    potAnimTime = 0;
    potIntroLoopTime = 0;
    potFinishTime = 0;
    potFrameIndex = 0;
  }

  function updatePotExplosion(dt) {
    if (currentScene?.id !== "kitchen-lunch-lady-s2") return;
    if (potState === "idle" && potStartDelay > 0) {
      potStartDelay = Math.max(0, potStartDelay - dt);
      if (potStartDelay === 0) triggerPotExplosion();
      return;
    }
    if (potState !== "exploding") return;

    const previousFrameIndex = potFrameIndex;
    potAnimTime += dt;
    if (potIntroLoopTime < POT_INTRO_LOOP_DURATION) {
      potIntroLoopTime = Math.min(POT_INTRO_LOOP_DURATION, potIntroLoopTime + dt);
      potFrameIndex = Math.floor(potIntroLoopTime * POT_FPS) % POT_INTRO_LOOP_FRAME_COUNT;
      return;
    }

    potFinishTime += dt;
    potFrameIndex = Math.min(
      POT_INTRO_LOOP_FRAME_COUNT + Math.floor(potFinishTime * POT_FPS),
      POT_TOTAL_FRAMES - 1,
    );

    if (!pizzaMonsterSpawnedFromPot && previousFrameIndex < PIZZA_LEAP_SPAWN_FRAME && potFrameIndex >= PIZZA_LEAP_SPAWN_FRAME) {
      pizzaMonsterSpawnedFromPot = true;
      spawnPizzaGooProjectiles();
      spawnPizzaMonsterFromPot();
    }

    if (potFrameIndex >= POT_TOTAL_FRAMES - 1) {
      potState = "exploded";
      potFrameIndex = POT_TOTAL_FRAMES - 1;
    }
  }

  function drawKitchenPot() {
    if (currentScene?.id !== "kitchen-lunch-lady-s2") return;
    if (potState === "hidden" || !potFrames) return;

    const frame = potFrames[potFrameIndex];
    if (!frame?.image || !frame.bounds) return;

    const bounds = frame.bounds;
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const baseHeight = potFrames[0].bounds.height;
    const scale = (POT_DRAW_HEIGHT / baseHeight) * POT_SCALE * POT_SIZE_MULTIPLIER;
    const drawW = Math.round(bounds.width * scale);
    const drawH = Math.round(bounds.height * scale);
    const drawX = Math.round(POT_VIEWPORT_X - drawW / 2);
    const drawY = Math.round(POT_VIEWPORT_Y - drawH);

    ctx.drawImage(
      frame.image,
      bounds.x, bounds.y, bounds.width, bounds.height,
      drawX, drawY, drawW, drawH,
    );
  }

  function resetWardEntranceSequence() {
    wardEntranceSequence = {
      phase: "ready",
      time: 0,
      frameIndex: 0,
      holeX: 0,
      holeY: 0,
      playerX: 0,
      playerY: 0,
      playerFacing: player.facing || 1,
      loadingNextScene: false,
    };
  }

  function isWardEntranceSetPieceActive() {
    return Boolean(wardEntranceSequence && wardEntranceSequence.phase !== "ready" && wardEntranceSequence.phase !== "done");
  }

  function shouldDrawWardEntrancePlayerProxy() {
    return Boolean(wardEntranceSequence && ["playing", "fadeOut", "loading"].includes(wardEntranceSequence.phase));
  }

  function isHellHallwayEntryActive() {
    return Boolean(hellHallwayEntrySequence && hellHallwayEntrySequence.phase !== "done");
  }

  function shouldHideNormalPlayer() {
    return shouldDrawWardEntrancePlayerProxy() || isHellHallwayEntryActive();
  }

  function updateWardEntranceSequence(dt) {
    if (!currentScene?.hellHoleSequence || !wardEntranceSequence) return;

    if (wardEntranceSequence.phase === "ready") {
      const playerScreenX = player.x - camera.x;
      const triggerScreenX = (canvas.width || VIEWPORT_WIDTH) * (currentScene.hellHoleSequence.triggerScreenRatio ?? 0.4);
      if (player.alive && playerScreenX >= triggerScreenX) startWardEntranceSequence();
      return;
    }

    if (wardEntranceSequence.phase === "playing") {
      wardEntranceSequence.time += dt;
      const frameCount = Math.max(hellHoleFrames?.length ?? 0, 1);
      const sourceTime = getHellHoleSourceTime(wardEntranceSequence.time);
      wardEntranceSequence.frameIndex = Math.min(
        Math.floor(sourceTime * HELL_HOLE_FPS),
        frameCount - 1,
      );
      applyWardEntranceScreenShake();
      if (wardEntranceSequence.time >= getHellHolePlaybackDuration(frameCount)) {
        wardEntranceSequence.phase = "fadeOut";
        wardEntranceSequence.time = 0;
        sceneFade = { mode: "fadeOut", time: 0, duration: HELL_HOLE_FADE_DURATION, alpha: 0 };
      }
    }
  }

  function getHellHoleSourceTime(playbackTime) {
    if (playbackTime <= HELL_HOLE_SLOW_PLAY_DURATION) {
      const progress = HELL_HOLE_SLOW_PLAY_DURATION > 0 ? playbackTime / HELL_HOLE_SLOW_PLAY_DURATION : 1;
      return progress * HELL_HOLE_SLOW_SOURCE_DURATION;
    }
    return HELL_HOLE_SLOW_SOURCE_DURATION + (playbackTime - HELL_HOLE_SLOW_PLAY_DURATION);
  }

  function getHellHolePlaybackDuration(frameCount) {
    const sourceDuration = frameCount / HELL_HOLE_FPS;
    return HELL_HOLE_SLOW_PLAY_DURATION + Math.max(0, sourceDuration - HELL_HOLE_SLOW_SOURCE_DURATION);
  }

  function applyWardEntranceScreenShake() {
    const fallProgress = getWardEntranceFallProgress();
    if (fallProgress <= 0) {
      triggerScreenShake(0.08, 1.6);
      return;
    }
    if (!wardEntranceSequence.fallShakeTriggered) {
      wardEntranceSequence.fallShakeTriggered = true;
      triggerScreenShake(0.42, 7);
      return;
    }
    triggerScreenShake(0.08, 3.2 + fallProgress * 2.2);
  }

  function startWardEntranceSequence() {
    wardEntranceSequence.phase = "playing";
    wardEntranceSequence.time = 0;
    wardEntranceSequence.frameIndex = 0;
    wardEntranceSequence.holeX = player.x;
    wardEntranceSequence.holeY = player.y + 8;
    wardEntranceSequence.playerX = player.x;
    wardEntranceSequence.playerY = player.y;
    wardEntranceSequence.playerFacing = player.facing || 1;
    wardEntranceSequence.fallShakeTriggered = false;
    player.vx = 0;
    player.vy = 0;
    setPlayerAnimationState("Idle", 0);
    screenShakeTime = 0.32;
    screenShakeStrength = 5;
    onStatusCallback("The floor gives way...");
  }

  function updateSceneFade(dt) {
    if (!sceneFade) return;
    sceneFade.time = Math.min(sceneFade.duration, sceneFade.time + dt);
    const progress = sceneFade.duration > 0 ? sceneFade.time / sceneFade.duration : 1;
    sceneFade.alpha = sceneFade.mode === "fadeIn" ? 1 - progress : progress;

    if (sceneFade.time < sceneFade.duration) return;

    if (sceneFade.mode === "fadeOut" && wardEntranceSequence?.phase === "fadeOut") {
      wardEntranceSequence.phase = "loading";
      void loadHellHallwayAfterWardEntrance();
      return;
    }

    if (sceneFade.mode === "fadeIn") {
      sceneFade = null;
      if (hellHallwayEntrySequence?.phase === "waitingFadeIn") {
        hellHallwayEntrySequence.phase = "falling";
        hellHallwayEntrySequence.time = 0;
        triggerScreenShake(0.18, 4);
      }
    }
  }

  async function loadHellHallwayAfterWardEntrance() {
    if (!wardEntranceSequence || wardEntranceSequence.loadingNextScene) return;
    wardEntranceSequence.loadingNextScene = true;
    const nextSceneIndex = sceneIndex + 1;
    if (nextSceneIndex >= currentLevel.scenes.length) {
      onLevelCompleteCallback(currentLevel);
      return;
    }
    await loadScene(nextSceneIndex, { fadeInFromBlack: true, hellDropIn: true });
  }

  function updateHellHallwayEntrySequence(dt) {
    if (!hellHallwayEntrySequence) return;
    if (hellHallwayEntrySequence.phase === "waitingFadeIn") {
      player.vx = 0;
      player.vy = 0;
      return;
    }
    if (hellHallwayEntrySequence.phase === "falling") {
      hellHallwayEntrySequence.time += dt;
      const progress = clamp(hellHallwayEntrySequence.time / HELL_HALLWAY_ENTRY_FALL_DURATION, 0, 1);
      triggerScreenShake(0.08, 2.2 + progress * 2.5);
      if (progress >= 1) {
        hellHallwayEntrySequence.phase = "standing";
        hellHallwayEntrySequence.time = 0;
        triggerScreenShake(0.22, 5);
      }
      return;
    }
    if (hellHallwayEntrySequence.phase === "standing") {
      hellHallwayEntrySequence.time += dt;
      if (hellHallwayEntrySequence.time >= HELL_HALLWAY_ENTRY_STAND_DURATION) {
        hellHallwayEntrySequence.phase = "done";
        hellHallwayEntrySequence = null;
        player.state = "Idle";
        player.animTime = 0;
        player.frameIndex = 0;
        player.vx = 0;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }

  function spawnPizzaGooProjectiles() {
    if (!pizzaGooFrame) return;
    const startX = POT_VIEWPORT_X;
    const startY = PIZZA_POT_LAUNCH_Y;
    const travelTime = PIZZA_GOO_TRAVEL_TIME;
    const gravity = PIZZA_GOO_GRAVITY;
    PIZZA_GOO_SPOTS_X.forEach((spotX, index) => {
      const targetY = getGroundYAtX(spotX);
      pizzaGooProjectiles.push({
        x: startX,
        y: startY,
        vx: (spotX - startX) / travelTime,
        vy: (targetY - startY - 0.5 * gravity * travelTime * travelTime) / travelTime,
        gravity,
        targetIndex: index,
        targetX: spotX,
        targetY,
        elapsed: 0,
        travelTime,
        alive: true,
      });
    });
  }

  function updatePizzaGooProjectiles(dt) {
    for (const projectile of pizzaGooProjectiles) {
      if (!projectile.alive) continue;
      projectile.elapsed += dt;
      projectile.vy += projectile.gravity * dt;
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;

      if (projectile.y >= projectile.targetY || projectile.elapsed >= projectile.travelTime) {
        projectile.alive = false;
        pizzaGooActive[projectile.targetIndex] = true;
      }
    }
    for (let i = pizzaGooProjectiles.length - 1; i >= 0; i -= 1) {
      if (!pizzaGooProjectiles[i].alive) pizzaGooProjectiles.splice(i, 1);
    }
  }

  function drawPizzaGoo() {
    if (!pizzaGooFrame || currentScene?.id !== "kitchen-lunch-lady-s2") return;
    const aspect = pizzaGooFrame.naturalHeight / pizzaGooFrame.naturalWidth;
    const drawW = PIZZA_GOO_WIDTH;
    const drawH = Math.round(drawW * aspect);
    PIZZA_GOO_SPOTS_X.forEach((spotX, index) => {
      if (!pizzaGooActive[index]) return;
      const drawX = Math.round(spotX - camera.x - drawW / 2 - PIZZA_GOO_LEFT_EXTEND);
      const drawY = Math.round(VIEWPORT_HEIGHT - drawH * (1 - PIZZA_GOO_SCREEN_CROP_RATIO));
      ctx.drawImage(pizzaGooFrame, drawX, drawY, drawW + PIZZA_GOO_LEFT_EXTEND, drawH);
    });
  }

  function drawPizzaGooProjectiles() {
    if (!pizzaGooFrame || currentScene?.id !== "kitchen-lunch-lady-s2") return;
    const aspect = pizzaGooFrame.naturalHeight / pizzaGooFrame.naturalWidth;
    const drawW = 34;
    const drawH = Math.round(drawW * aspect);
    for (const projectile of pizzaGooProjectiles) {
      if (!projectile.alive) continue;
      const drawX = Math.round(projectile.x - camera.x - drawW / 2);
      const drawY = Math.round(projectile.y - drawH / 2);
      ctx.drawImage(pizzaGooFrame, drawX, drawY, drawW, drawH);
    }
  }

  // ============================================================
  // Input
  // ============================================================

  function handleKeyDown(event) {
    if (event.code === "Escape" && optionsOverlayOpen) {
      event.preventDefault();
      closeOptionsOverlay();
      return;
    }
    if (event.code === "KeyP" && event.repeat) return;
    if (!keys[event.code]) justPressed.add(event.code);
    keys[event.code] = true;

    if (event.code === "KeyP" && !optionsOverlayOpen && !gameCompleteShown && !gameOverShown) {
      paused = !paused;
      onStatusCallback(paused ? "Paused. Press P to resume." : (currentScene?.instructions ?? ""));
    }

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) {
      event.preventDefault();
    }
  }

  function handleKeyUp(event) {
    keys[event.code] = false;
  }

  // ============================================================
  // Main Loop
  // ============================================================

  function loop(timestamp) {
    const dt = paused ? 0 : Math.min((timestamp - previousTimestamp) / 1000 || 0, 1 / 30);
    previousTimestamp = timestamp;
    if (!paused) update(dt);
    draw();
    justPressed.clear();
    rafId = requestAnimationFrame(loop);
  }

  function update(dt) {
    if (!animations || !currentScene) return;

    screenShakeTime     = Math.max(0, screenShakeTime     - dt);
    screenShakeStrength = Math.max(0, screenShakeStrength - dt * 22);

    updatePlayerState(dt);
    updateDelayedEncounters(dt);
    updateEnemies(dt);
    updateProjectiles(dt);
    updateDemonRangedArrows(dt);
    updateLunchLadyMeatballs(dt);
    updateEffects(dt);
    updateTriggeredEncounters();
    updateCamera();
    updatePotExplosion(dt);
    updatePizzaGooProjectiles(dt);
    updateWardEntranceSequence(dt);
    updateSceneFade(dt);
    updateHellHallwayEntrySequence(dt);
    checkSceneCompletion();
  }

  // ============================================================
  // Player
  // ============================================================

  function updatePlayerState(dt) {
    player.damageCooldown = Math.max(0, player.damageCooldown - dt);
    player.meleeCooldown  = Math.max(0, player.meleeCooldown  - dt);
    player.hitFlash       = Math.max(0, player.hitFlash       - dt);
    updatePlayerCooldowns(dt);

    if (justPressed.has("KeyR")) {
      void loadScene(sceneIndex);
      return;
    }

    if (isWardEntranceSetPieceActive() || isHellHallwayEntryActive()) {
      player.vx = 0;
      player.vy = 0;
      return;
    }

    const actionLocked = isPlayerActionLocked();

    if (player.capture) {
      const captor = getCapturingEnemy();
      if (captor) syncCapturedPlayer(captor);
      else clearPlayerCapture();
      return;
    }

    if (!player.alive) {
      if (player.state === "Death") {
        updatePlayerDeath(dt);
        return;
      }
      if (player.state === "KnockBack") {
        updatePlayerKnockBack(dt, true);
        return;
      }
      updatePlayerKnockDown(dt, true);
      return;
    }

    const holdingDown = Boolean(keys.KeyS || keys.ArrowDown);

    if (!actionLocked && player.onGround) {
      if (justPressed.has("KeyJ") && player.meleeCooldown <= 0) {
        if (holdingDown) {
          startJumpAttack();
        } else {
          startPlayerAction("MeleeAttack");
        }
      } else if (justPressed.has("KeyL") && player.meleeCooldown <= 0) {
        startKick(player.facing);
      } else if (justPressed.has("KeyK") && player.colostomyCooldown <= 0) {
        startPlayerAction("ThrowColostomy");
        player.colostomyCooldown = PLAYER_COLOSTOMY_COOLDOWN;
        player.colostomyReadyFlash = 0;
      }
    }

    const stillLocked = isPlayerActionLocked();
    let inputDirection = 0;

    if (!stillLocked && holdingDown && player.onGround) {
      // Crouching: hold the pose, no walking or jumping.
      player.vx = 0;
      if (player.state !== "Crouch") {
        player.state = "Crouch";
        player.animTime = 0;
        player.frameIndex = 0;
      }
    } else if (!stillLocked) {
      if (player.state === "Crouch") {
        player.state = "Idle";
        player.animTime = 0;
        player.frameIndex = 0;
      }
      const movingLeft  = Boolean(keys.KeyA || keys.ArrowLeft);
      const movingRight = Boolean(keys.KeyD || keys.ArrowRight);
      inputDirection = Number(movingRight) - Number(movingLeft);
      player.vx = inputDirection * MOVE_SPEED;
      if (inputDirection !== 0) player.facing = inputDirection;

      if (
        player.onGround &&
        (justPressed.has("Space") || justPressed.has("KeyW") || justPressed.has("ArrowUp"))
      ) {
        startJump();
      }
    } else {
      player.vx *= 0.82;
    }

    // Freeze horizontal movement during jump wind-up.
    if (player.state === "Jump" && !player.jumpLaunched && player.frameIndex < JUMP_START_FRAME + 2) {
      player.vx = 0;
    }

    player.x += player.vx * dt;

    if (!(player.state === "Jump" && !player.jumpLaunched)) {
      player.vy += GRAVITY * dt;
      player.y  += player.vy * dt;
    }

    resolveEntityCollisions(player);

    if (player.state === "MeleeAttack" || player.state === "ThrowColostomy" || player.state === "Kick") {
      updatePlayerAction(dt);
    } else if (player.state === "JumpAttack") {
      updatePlayerJumpAttack(dt);
    } else if (player.state === "Crouch") {
      updatePlayerCrouch(dt);
    } else if (player.state === "KnockBack") {
      updatePlayerKnockBack(dt, !player.alive);
    } else if (player.state === "KnockDown") {
      updatePlayerKnockDown(dt, !player.alive);
    } else if (player.state === "Jump" || !player.onGround) {
      updateJumpAnimation(dt);
    } else if (inputDirection !== 0 && player.onGround) {
      setPlayerAnimationState("Walk", dt);
    } else {
      setPlayerAnimationState("Idle", dt);
      player.jumpTime = 0;
    }

    player.x = clamp(player.x, 40, worldWidth - 40);
  }

  function isPlayerActionLocked() {
    return PLAYER_LOCKED_STATES.has(player.state);
  }

  function updatePlayerCooldowns(dt) {
    const wasCoolingDown = player.colostomyCooldown > 0;
    player.colostomyCooldown = Math.max(0, player.colostomyCooldown - dt);
    if (wasCoolingDown && player.colostomyCooldown <= 0) {
      player.colostomyReadyFlash = 0.3;
    } else {
      player.colostomyReadyFlash = Math.max(0, player.colostomyReadyFlash - dt);
    }
  }

  function startPlayerAction(animationName) {
    player.state      = animationName;
    player.animTime   = 0;
    player.frameIndex = 0;
    player.vx         = 0;
    player.jumpLaunched     = false;
    player.projectileThrown = false;
    player.recentHitIds.clear();
  }

  function startJump() {
    player.state      = "Jump";
    player.animTime   = 0;
    player.jumpTime   = JUMP_START_FRAME / ANIMATION_DEFS.Granny.Jump.fps;
    player.frameIndex = JUMP_START_FRAME;
    player.jumpLaunched = false;
    player.vy = 0;
  }

  function startKick(dir) {
    player.state      = "Kick";
    player.animTime   = 0;
    player.frameIndex = 0;
    player.vx         = 0;
    player.facing     = dir;
    player.recentHitIds.clear();
  }

  // Crouch hold: play the jump-attack crouch frames (0..CROUCH_HOLD_FRAME) then hold.
  function updatePlayerCrouch(dt) {
    const def = ANIMATION_DEFS.Granny.JumpAttack;
    player.vx = 0;
    player.animTime  += dt;
    player.frameIndex = Math.min(Math.floor(player.animTime * def.fps), CROUCH_HOLD_FRAME);
  }

  // Grounded crouch -> rear-up -> overhead smash. Plays the full clip from the rear-up.
  function startJumpAttack() {
    const def = ANIMATION_DEFS.Granny.JumpAttack;
    player.state      = "JumpAttack";
    player.animTime   = CROUCH_HOLD_FRAME / def.fps;
    player.frameIndex = CROUCH_HOLD_FRAME;
    player.vx         = 0;
    player.recentHitIds.clear();
  }

  function updatePlayerJumpAttack(dt) {
    const frames = animations?.Granny?.JumpAttack ?? [];
    const def    = ANIMATION_DEFS.Granny.JumpAttack;
    player.animTime  += dt;
    player.frameIndex = Math.min(Math.floor(player.animTime * def.fps), Math.max(frames.length - 1, 0));

    if (player.frameIndex >= JUMP_ATTACK_ACTIVE.start && player.frameIndex <= JUMP_ATTACK_ACTIVE.end) {
      checkPlayerJumpAttackHits();
    }

    const duration = frames.length / def.fps;
    if (player.animTime >= duration) {
      player.state      = Math.abs(player.vx) > 8 && player.onGround ? "Walk" : "Idle";
      player.animTime   = 0;
      player.frameIndex = 0;
      player.recentHitIds.clear();
    }
  }

  function startPlayerKnock(state, fromHit, pushDirection = 0) {
    const velocity = state === "KnockDown" ? 75 : 90;
    player.state      = state;
    player.animTime   = 0;
    player.frameIndex = 0;
    player.jumpTime   = 0;
    player.jumpLaunched     = false;
    player.projectileThrown = false;
    player.recentHitIds.clear();
    player.vx = fromHit ? pushDirection * velocity : 0;
  }

  function setPlayerAnimationState(animationName, dt) {
    if (player.state !== animationName) {
      player.state      = animationName;
      player.animTime   = 0;
      player.frameIndex = 0;
      if (animationName !== "Walk") player.walkDistance = 0;
      return;
    }
    const frames = animations?.Granny?.[animationName] ?? [];
    if (animationName === "Walk" && frames.length > 0) {
      player.walkDistance += Math.abs(player.vx * dt);
      player.frameIndex = Math.floor((player.walkDistance / CHAR.Granny.strideLength) * frames.length) % frames.length;
    } else {
      const def = ANIMATION_DEFS.Granny[animationName];
      player.animTime   += dt;
      player.frameIndex  = Math.floor(player.animTime * def.fps) % Math.max(frames.length, 1);
    }
  }

  function updatePlayerAction(dt) {
    const frames   = animations?.Granny?.[player.state] ?? [];
    const def      = ANIMATION_DEFS.Granny[player.state];
    const duration = frames.length / def.fps;

    player.animTime   += dt;
    player.frameIndex  = Math.min(Math.floor(player.animTime * def.fps), frames.length - 1);

    if (player.state === "ThrowColostomy" && !player.projectileThrown && player.frameIndex >= 6) {
      spawnProjectile();
      player.projectileThrown = true;
    }

    if (player.state === "MeleeAttack" && player.frameIndex >= 5 && player.frameIndex <= 9) {
      checkPlayerMeleeHits();
    }

    if (player.state === "Kick" && player.frameIndex >= KICK_ACTIVE.start && player.frameIndex <= KICK_ACTIVE.end) {
      checkPlayerKickHits();
    }

    if (player.animTime >= duration) {
      if (player.state === "MeleeAttack" || player.state === "Kick") {
        player.meleeCooldown = 1.0 - duration;
      }
      player.state      = Math.abs(player.vx) > 8 && player.onGround ? "Walk" : "Idle";
      player.animTime   = 0;
      player.frameIndex = 0;
      player.jumpTime   = 0;
      player.jumpLaunched     = false;
      player.projectileThrown = false;
      player.recentHitIds.clear();
    }
  }

  function updatePlayerKnockDown(dt, stayDown) {
    const frames   = animations?.Granny?.KnockDown ?? [];
    const duration = frames.length / ANIMATION_DEFS.Granny.KnockDown.fps;

    player.animTime   += dt;
    player.frameIndex  = Math.min(Math.floor(player.animTime * ANIMATION_DEFS.Granny.KnockDown.fps), frames.length - 1);
    player.vx *= 0.92;

    if (stayDown && player.animTime >= duration) {
      player.state      = "Death";
      player.animTime   = 0;
      player.frameIndex = 0;
      player.vx = 0;
      player.vy = 0;
      player.onGround = true;
      return;
    }
    if (!stayDown && player.animTime >= duration) {
      player.state      = "Idle";
      player.animTime   = 0;
      player.frameIndex = 0;
      player.vx = 0;
    }
  }

  function updatePlayerKnockBack(dt, stayDown) {
    const frames = animations?.Granny?.KnockBack ?? [];
    if (!frames.length) { updatePlayerKnockDown(dt, stayDown); return; }

    const duration = frames.length / ANIMATION_DEFS.Granny.KnockBack.fps;
    player.animTime   += dt;
    player.frameIndex  = Math.min(Math.floor(player.animTime * ANIMATION_DEFS.Granny.KnockBack.fps), frames.length - 1);
    player.vx *= 0.9;

    if (stayDown && player.animTime >= duration) {
      player.state      = "Death";
      player.animTime   = 0;
      player.frameIndex = 0;
      player.vx = 0;
      player.vy = 0;
      player.onGround = true;
      return;
    }
    if (!stayDown && player.animTime >= duration) {
      player.state      = "Idle";
      player.animTime   = 0;
      player.frameIndex = 0;
      player.vx = 0;
    }
  }

  function updatePlayerDeath(dt) {
    const frames = animations?.Granny?.Death ?? [];
    GTW.GrannyPlayer.updatePlayerDeath(player, frames, ANIMATION_DEFS.Granny, dt);
    const def = ANIMATION_DEFS.Granny.Death;
    const frameCount = Math.max(frames.length || def.frameCount, 1);
    const overlayDelay = frameCount / def.fps + ENEMY_DEATH_HOLD_DURATION + ENEMY_DEATH_FADE_DURATION;
    if (!gameOverShown && player.animTime >= overlayDelay) showGameOverOverlay();
  }

  function updateJumpAnimation(dt) {
    const frames = animations?.Granny?.Jump ?? [];
    if (!frames.length) { player.state = "Idle"; player.frameIndex = 0; return; }

    player.state      = "Jump";
    player.jumpTime  += dt;
    player.frameIndex = Math.min(
      Math.max(JUMP_START_FRAME, Math.floor(player.jumpTime * ANIMATION_DEFS.Granny.Jump.fps)),
      frames.length - 1,
    );

    if (!player.jumpLaunched && player.frameIndex >= JUMP_LAUNCH_FRAME) {
      player.jumpLaunched = true;
      player.onGround     = false;
      player.vy           = JUMP_VELOCITY;
      player.jumpTime     = Math.max(player.jumpTime, JUMP_LAUNCH_FRAME / ANIMATION_DEFS.Granny.Jump.fps);
    }

    if (player.jumpLaunched && !player.onGround) {
      const airProgress = clamp(
        (player.jumpTime - JUMP_LAUNCH_FRAME / ANIMATION_DEFS.Granny.Jump.fps) / EXPECTED_JUMP_DURATION,
        0, 1,
      );
      const airFrameIndex = JUMP_LAUNCH_FRAME + Math.floor(airProgress * (frames.length - 1 - JUMP_LAUNCH_FRAME));
      player.frameIndex   = Math.min(Math.max(player.frameIndex, airFrameIndex), frames.length - 1);
    }

    if (player.jumpLaunched && player.onGround && player.frameIndex >= JUMP_RECOVERY_FRAME) {
      player.state        = Math.abs(player.vx) > 8 ? "Walk" : "Idle";
      player.animTime     = 0;
      player.frameIndex   = 0;
      player.jumpTime     = 0;
      player.jumpLaunched = false;
    }
  }

  // ============================================================
  // Enemies
  // ============================================================

  function canSpawnMoreHostiles(extraCount = 1) {
    return enemies.filter((e) => !e.removed && !e.nonHostile).length + extraCount <= maxEnemies;
  }

  function spawnNurse(customX = null, options = {}) {
    const spawnX = customX ?? clamp(camera.x + VIEWPORT_WIDTH + 120, 680, worldWidth - 80);
    const hp = options.health ?? COMBAT.enemies.Nurse.maxHealth;
    enemies.push({
      id: nextEnemyId,
      type: "Nurse",
      x: spawnX,
      y: getGroundYAtX(spawnX),
      vx: 0,
      vy: 0,
      width:  Math.round(34 * NURSE_SCALE * NURSE_VISUAL_WIDTH_MULTIPLIER),
      height: Math.round(84 * NURSE_SCALE * NURSE_VISUAL_HEIGHT_MULTIPLIER),
      facing: options.facing ?? -1,
      onGround: true,
      state: "Idle",
      animTime: 0,
      frameIndex: 0,
      attackCooldown: COMBAT.enemies.Nurse.initialAttackCooldown,
      attackResolved: false,
      health: hp,
      maxHealth: hp,
      damageCooldown: 0,
      hitFlash: 0,
      stunTime: 0,
      alive: true,
      defeated: false,
      removed: false,
      deathTimer: 0,
      killCounted: false,
      requiredForClear: options.requiredForClear ?? false,
      offscreenEntry: Boolean(options.offscreenEntry),
      offscreenMargin: options.offscreenMargin ?? null,
      aiMode: options.aiMode ?? "chase",
      aggroRange: options.aggroRange ?? 100,
      group: options.group ?? null,
      aggroed: options.aiMode !== "wander-until-near",
      alerted: options.alerted ?? (options.aiMode !== "wander-until-near"),
      walkDistance: 0,
    });
    nextEnemyId += 1;
  }

  function spawnWardBoss(options = {}) {
    const spawnX  = options.spawnX ?? clamp(camera.x + VIEWPORT_WIDTH - 120, 760, worldWidth - 120);
    const groundY = getGroundYAtX(spawnX);
    const hp      = options.health ?? COMBAT.enemies.Ward.maxHealth;
    enemies.push({
      id: nextEnemyId,
      type: "Ward",
      x: spawnX,
      y: WARD_ENTRANCE_FALL_START_Y,
      vx: 0,
      vy: 0,
      width: 56,
      height: 118,
      facing: -1,
      onGround: false,
      state: "Entrance",
      animTime: 0,
      frameIndex: 0,
      attackCooldown: COMBAT.enemies.Ward.initialAttackCooldown,
      attackResolved: false,
      summonResolved: false,
      pointCooldown: WARD_POINT_INTERVAL,
      slamCooldown: COMBAT.enemies.Ward.initialSlamCooldown,
      health: hp,
      maxHealth: hp,
      damageCooldown: 0,
      hitFlash: 0,
      stunTime: 0,
      alive: true,
      defeated: false,
      removed: false,
      deathTimer: 0,
      knockDownMilestones: new Set(),
      entranceImpactTriggered: false,
      entranceLanded: false,
      entranceGroundY: groundY,
      killCounted: false,
      requiredForClear: options.requiredForClear ?? false,
      forcedPointActions: options.forcedPointActions ?? 0,
      alerted: true,
      walkDistance: 0,
      hitCounter: 0,
      superArmor: 0,
    });
    nextEnemyId += 1;
  }

  function spawnMeatballMonster(customX = null, customY = null, options = {}) {
    const spawnX = customX ?? clamp(player.x + player.facing * 150, 80, worldWidth - 80);
    const groundY = customY ?? getGroundYAtX(spawnX);
    enemies.push({
      id: nextEnemyId,
      type: "MeatballMonster",
      x: spawnX,
      y: groundY,
      vx: 0,
      vy: 0,
      width: 126,
      height: 62,
      facing: options.facing ?? (spawnX < player.x ? 1 : -1),
      onGround: true,
      state: "Spawn",
      animTime: 0,
      frameIndex: 0,
      attackCooldown: COMBAT.enemies.MeatballMonster.initialGrabCooldown,
      attackResolved: false,
      captureReleased: false,
      health: COMBAT.enemies.MeatballMonster.maxHealth,
      maxHealth: COMBAT.enemies.MeatballMonster.maxHealth,
      damageCooldown: 0,
      hitFlash: 0,
      stunTime: 0,
      alive: true,
      defeated: false,
      removed: false,
      deathTimer: 0,
      killCounted: false,
      requiredForClear: options.requiredForClear ?? false,
      walkDistance: 0,
      alerted: true,
    });
    nextEnemyId += 1;
  }

  function spawnLunchLadyBoss(options = {}) {
    const spawnX = options.x ?? LUNCH_LADY_SPAWN.x;
    const spawnY = options.y ?? LUNCH_LADY_SPAWN.y;
    enemies.push({
      id: nextEnemyId,
      type: "LunchLady",
      x: spawnX,
      y: spawnY,
      spawnY,
      vx: 0,
      vy: 0,
      width: 68,
      height: 132,
      facing: options.facing ?? (spawnX < player.x ? 1 : -1),
      onGround: true,
      state: "Idle",
      animTime: 0,
      frameIndex: 0,
      attackCooldown: 0,
      attackResolved: false,
      health: 9999,
      maxHealth: 9999,
      damageCooldown: 0,
      hitFlash: 0,
      stunTime: 0,
      alive: true,
      defeated: false,
      removed: false,
      deathTimer: 0,
      killCounted: false,
      walkDistance: 0,
      alerted: true,
      stage: 1,
      invincible: true,
      nonColliding: true,
      nonHostile: true,
      throwsCompleted: 0,
      throwTimer: options.throwDelay ?? LUNCH_LADY_THROW_INTERVAL,
      throwFacing: null,
      throwResolved: false,
      pendingMeatballTargetX: null,
      lastMeatballTargetX: null,
    });
    nextEnemyId += 1;
  }

  function spawnLunchLadyStage2Boss(options = {}) {
    const spawnX = options.spawnX ?? clamp(player.x + player.facing * 190, 90, worldWidth - 90);
    const spawnY = options.y ?? getGroundYAtX(spawnX);
    enemies.push({
      id: nextEnemyId,
      type: "LunchLady",
      x: spawnX,
      y: spawnY,
      spawnY,
      vx: 0,
      vy: 0,
      width: 68,
      height: 132,
      facing: options.facing ?? (spawnX < player.x ? 1 : -1),
      onGround: true,
      state: "Walk",
      animTime: 0,
      frameIndex: 0,
      attackCooldown: COMBAT.enemies.LunchLady.initialAttackCooldown,
      attackResolved: false,
      slamCooldown: COMBAT.enemies.LunchLady.initialSlamCooldown,
      throwCooldown: COMBAT.enemies.LunchLady.initialThrowCooldown,
      throwResolved: false,
      throwFacing: null,
      pendingMeatballTargetX: null,
      lastMeatballTargetX: null,
      health: COMBAT.enemies.LunchLady.maxHealth,
      maxHealth: COMBAT.enemies.LunchLady.maxHealth,
      damageCooldown: 0,
      hitFlash: 0,
      stunTime: 0,
      alive: true,
      defeated: false,
      removed: false,
      deathTimer: 0,
      killCounted: false,
      requiredForClear: options.requiredForClear ?? false,
      walkDistance: 0,
      alerted: true,
      stage: 2,
      hitCounter: 0,
      superArmor: 0,
    });
    nextEnemyId += 1;
  }

  function spawnDemon(customX = null, options = {}) {
    const spawnX = customX ?? clamp(player.x + player.facing * 210, 90, worldWidth - 90);
    const groundY = getGroundYAtX(spawnX);
    const enemy = {
      id: nextEnemyId++, type: "Demon", x: spawnX, y: groundY, groundY,
      hoverY: groundY - COMBAT.enemies.Demon.hoverHeight,
      vx: 0, vy: 0, width: 56, height: 92,
      facing: options.facing ?? (spawnX < player.x ? 1 : -1),
      onGround: true, airborne: false, state: "GroundedToFly",
      animTime: 0, frameIndex: 0, walkDistance: 0,
      attackCooldown: COMBAT.enemies.Demon.initialAttackCooldown, attackResolved: false,
      health: COMBAT.enemies.Demon.maxHealth, maxHealth: COMBAT.enemies.Demon.maxHealth,
      damageCooldown: 0, hitFlash: 0, stunTime: 0,
      alive: true, defeated: false, removed: false, deathTimer: 0,
      killCounted: false, requiredForClear: options.requiredForClear ?? false,
      alerted: true, summonedBySatanEvolutionId: options.summonedBySatanEvolutionId ?? null,
    };
    enemies.push(enemy);
    return enemy;
  }

  function spawnDemonRanged(customX = null, options = {}) {
    const balance = COMBAT.enemies.DemonRanged;
    const spawnX = customX ?? clamp(player.x + player.facing * 260, 90, worldWidth - 90);
    const groundY = getGroundYAtX(spawnX);
    const enemy = {
      id: nextEnemyId++, type: "DemonRanged", x: spawnX, y: groundY, groundY,
      hoverY: groundY - balance.hoverHeight,
      vx: 0, vy: 0, width: 54, height: 90,
      facing: options.facing ?? (spawnX < player.x ? 1 : -1),
      onGround: true, airborne: false, state: "GroundedToFly",
      animTime: 0, frameIndex: 0, walkDistance: 0,
      attackCooldown: balance.initialAttackCooldown, attackResolved: false,
      arrowLaunched: false, attackFacing: null, aimTarget: null,
      bowHoldTime: 0, bowHoldComplete: false,
      edgeResetDirection: 0, edgeResetTargetX: null,
      health: balance.maxHealth, maxHealth: balance.maxHealth,
      damageCooldown: 0, hitFlash: 0, stunTime: 0,
      alive: true, defeated: false, removed: false, deathTimer: 0,
      killCounted: false, requiredForClear: options.requiredForClear ?? false,
      alerted: true, summonedBySatanEvolutionId: options.summonedBySatanEvolutionId ?? null,
    };
    enemies.push(enemy);
    return enemy;
  }

  function spawnSatanBoss(options = {}) {
    const inThrone = currentScene?.id === "hell-throne-room";
    const x = inThrone ? SATAN_THRONE_X : (options.spawnX ?? clamp(player.x + 260, 90, worldWidth - 90));
    const y = inThrone ? SATAN_THRONE_Y : getGroundYAtX(x);
    const enemy = {
      id: nextEnemyId++, type: "Satan", x, y, vx: 0, vy: 0, width: 88, height: 145,
      facing: x < player.x ? 1 : -1, onGround: !inThrone,
      state: inThrone ? "KnockDown" : "Idle", animTime: 0,
      frameIndex: inThrone ? SATAN_THRONE_SEATED_FRAME : 0, walkDistance: 0,
      attackCooldown: SATAN_COMBAT.initialAttackCooldown, attackResolved: false,
      health: SATAN_COMBAT.maxHealth, maxHealth: SATAN_COMBAT.maxHealth,
      damageCooldown: 0, hitFlash: 0, alive: true, defeated: false, removed: false,
      deathTimer: 0, killCounted: false, requiredForClear: options.requiredForClear ?? false,
      hitCounter: 0, halfHealJumpUsed: false, quarterHealJumpUsed: false,
      healJumpActive: false, healApplied: false, entranceActive: inThrone,
      entrancePhase: inThrone ? "seated-hold" : null, entranceTimer: 0,
    };
    enemies.push(enemy);
    return enemy;
  }

  function spawnSatanEvolutionBoss(options = {}) {
    const x = options.x ?? clamp(player.x + 240, 90, worldWidth - 90);
    const y = options.y ?? getGroundYAtX(x);
    const enemy = {
      id: options.id ?? nextEnemyId++, type: "SatanEvolution", x, y, vx: 0, vy: 0,
      width: 104, height: 160, facing: options.facing ?? (x < player.x ? 1 : -1),
      onGround: true, airborne: false, state: "Cutscene", animTime: 0, frameIndex: 0,
      health: SATAN_EVOLUTION_COMBAT.maxHealth, maxHealth: SATAN_EVOLUTION_COMBAT.maxHealth,
      damageCooldown: 0, hitFlash: 0, alive: true, defeated: false, removed: false,
      deathTimer: 0, killCounted: false, requiredForClear: options.requiredForClear ?? false,
      invincible: true, transitionActive: true, attackCooldown: 0, attackResolved: false,
      jumpSlamCooldown: SATAN_EVOLUTION_COMBAT.jumpSlamCooldown,
      summonCooldown: SATAN_EVOLUTION_COMBAT.initialSummonCooldown,
      summonResolved: false, summonedEnemyIds: [], hitCounter: 0,
      groundedPhase: false, groundedPasses: 0, groundedContactResolved: false,
      groundedState: null, healthBarDisplayY: null,
    };
    enemies.push(enemy);
    return enemy;
  }

  function getPizzaSizeMultiplier(enemy) {
    return enemy.entranceComplete ? PIZZA_MONSTER_SIZE_MULTIPLIER : PIZZA_MONSTER_SPAWN_SIZE_MULTIPLIER;
  }

  function spawnPizzaMonsterFromPot() {
    if (!animations?.PizzaMonster) return;
    if (enemies.some((enemy) => enemy.type === "PizzaMonster" && !enemy.removed)) return;
    const entranceGooIndex = 0;
    const leapTargetX = PIZZA_GOO_SPOTS_X[entranceGooIndex];
    enemies.push({
      id: nextEnemyId,
      type: "PizzaMonster",
      x: POT_VIEWPORT_X,
      y: PIZZA_POT_LAUNCH_Y,
      vx: 0,
      vy: 0,
      width: 40,
      height: 60,
      facing: 1,
      onGround: true,
      state: "GroundLeapStart",
      animTime: 0,
      frameIndex: 0,
      attackCooldown: 0,
      attackResolved: false,
      health: COMBAT.enemies.PizzaMonster.maxHealth,
      maxHealth: COMBAT.enemies.PizzaMonster.maxHealth,
      damageCooldown: 0,
      hitFlash: 0,
      stunTime: 0,
      alive: true,
      defeated: false,
      removed: false,
      deathTimer: 0,
      killCounted: false,
      requiredForClear: true,
      hitCounter: 0,
      dazeTimer: 0,
      idlePause: 0,
      leapStartX: POT_VIEWPORT_X,
      leapStartY: PIZZA_POT_LAUNCH_Y,
      leapTargetX,
      leapTargetY: getGroundYAtX(leapTargetX),
      gooIndex: entranceGooIndex,
      justLanded: false,
      entranceLeap: true,
      entranceComplete: false,
    });
    nextEnemyId += 1;
  }

  function updateEnemies(dt) {
    for (const enemy of enemies) {
      if (enemy.removed) continue;
      enemy.damageCooldown  = Math.max(0, enemy.damageCooldown  - dt);
      enemy.hitFlash        = Math.max(0, enemy.hitFlash        - dt);
      enemy.attackCooldown  = Math.max(0, enemy.attackCooldown  - dt);
      enemy.stunTime        = Math.max(0, enemy.stunTime        - dt);
      if (enemy.type === "Ward") updateWardEnemy(enemy, dt);
      else if (enemy.type === "MeatballMonster") updateMeatballEnemy(enemy, dt);
      else if (enemy.type === "LunchLady") updateLunchLadyBoss(enemy, dt);
      else if (enemy.type === "PizzaMonster") updatePizzaMonster(enemy, dt);
      else if (enemy.type === "Demon") updateDemonEnemy(enemy, dt);
      else if (enemy.type === "DemonRanged") updateDemonRangedEnemy(enemy, dt);
      else if (enemy.type === "Satan") updateSatanBoss(enemy, dt);
      else if (enemy.type === "SatanEvolution") updateSatanEvolutionBoss(enemy, dt);
      else updateNurseEnemy(enemy, dt);
    }
    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      if (enemies[i].removed) enemies.splice(i, 1);
    }
  }

  function updateDemonEnemy(enemy, dt) {
    if (enemy.state === "Death") { updateFlyingEnemyDeath(enemy, dt); return; }
    if (enemy.state === "GroundedToFly") { updateDemonTakeoff(enemy, dt); return; }
    if (enemy.state === "KnockBack") { updateDemonKnockBack(enemy, dt); return; }
    if (enemy.state === "FlyMeleeAttack") { updateDemonMeleeAttack(enemy, dt); return; }

    const balance = COMBAT.enemies.Demon;
    enemy.airborne = true;
    enemy.onGround = false;
    enemy.groundY = getGroundYAtX(enemy.x);
    enemy.hoverY = enemy.groundY - balance.hoverHeight;
    const dist = player.x - enemy.x;
    enemy.facing = dist === 0 ? enemy.facing : Math.sign(dist);

    if (!player.alive) {
      enemy.vx = Math.sin(performance.now() / 600 + enemy.id) * 12;
      enemy.x = clamp(enemy.x + enemy.vx * dt, 55, worldWidth - 55);
      enemy.y += (enemy.hoverY - enemy.y) * Math.min(1, dt * 4);
      setEnemyAnimationState(enemy, "FlyIdle", dt);
      return;
    }

    if (canEnemyAttackPlayer(enemy, "demon-melee")) {
      enemy.state = "FlyMeleeAttack";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.attackResolved = false;
      enemy.vx = 0;
      return;
    }

    enemy.vx = clamp(dist / 60, -1, 1) * balance.flySpeed;
    enemy.x = clamp(enemy.x + enemy.vx * dt, 55, worldWidth - 55);
    enemy.groundY = getGroundYAtX(enemy.x);
    enemy.hoverY = enemy.groundY - balance.hoverHeight;
    enemy.y += (enemy.hoverY - enemy.y) * Math.min(1, dt * 5);
    setEnemyAnimationState(enemy, Math.abs(enemy.vx) > 1 ? "FlyForward" : "FlyIdle", dt);
  }

  function updateDemonTakeoff(enemy, dt) {
    const frames = animations?.Demon?.GroundedToFly ?? [];
    const defs = ANIMATION_DEFS.Demon.GroundedToFly;
    const duration = Math.max(frames.length, defs.frameCount) / defs.fps;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * defs.fps), Math.max(frames.length - 1, 0));
    enemy.vx = 0;
    enemy.groundY = getGroundYAtX(enemy.x);
    enemy.hoverY = enemy.groundY - COMBAT.enemies.Demon.hoverHeight;
    const progress = duration > 0 ? clamp(enemy.animTime / duration, 0, 1) : 1;
    enemy.y = Math.round(enemy.groundY - COMBAT.enemies.Demon.hoverHeight * (1 - Math.pow(1 - progress, 2)));
    enemy.onGround = progress < 0.15;
    if (enemy.animTime >= duration) {
      enemy.airborne = true;
      enemy.onGround = false;
      enemy.y = enemy.hoverY;
      enemy.state = "FlyIdle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
    }
  }

  function updateDemonMeleeAttack(enemy, dt) {
    const frames = animations?.Demon?.FlyMeleeAttack ?? [];
    const defs = ANIMATION_DEFS.Demon.FlyMeleeAttack;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * defs.fps), Math.max(frames.length - 1, 0));
    enemy.vx = 0;
    if (!enemy.attackResolved && enemy.frameIndex >= ATTACK_EVENTS.demonMelee.activeStartFrame && enemy.frameIndex <= ATTACK_EVENTS.demonMelee.activeEndFrame) {
      const result = tryDamagePlayerFromAttack(enemy, "demon-melee", COMBAT.enemies.Demon.meleeDamage, "KnockBack");
      enemy.attackResolved = result.landed;
    }
    if (enemy.animTime >= Math.max(frames.length, defs.frameCount) / defs.fps) {
      enemy.state = "FlyIdle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.attackCooldown = COMBAT.enemies.Demon.attackRecoveryCooldown;
    }
  }

  function updateDemonKnockBack(enemy, dt) {
    if (advanceEnemyAnimation(enemy, "Demon", "KnockBack", dt)) {
      enemy.state = "FlyIdle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.Demon.knockBackRecoveryCooldown);
    }
    enemy.x = clamp(enemy.x + enemy.vx * dt, 55, worldWidth - 55);
    enemy.vx *= Math.pow(0.12, dt);
    enemy.hoverY = getGroundYAtX(enemy.x) - COMBAT.enemies.Demon.hoverHeight;
    enemy.y += (enemy.hoverY - enemy.y) * Math.min(1, dt * 3);
  }

  function updateDemonRangedEnemy(enemy, dt) {
    if (enemy.state === "Death") { updateFlyingEnemyDeath(enemy, dt); return; }
    if (enemy.state === "GroundedToFly") { updateDemonRangedTakeoff(enemy, dt); return; }
    if (enemy.state === "KnockBack") { updateDemonRangedKnockBack(enemy, dt); return; }
    if (enemy.state === "FlyRangedAttack") { updateDemonRangedAttack(enemy, dt); return; }

    const balance = COMBAT.enemies.DemonRanged;
    enemy.airborne = true;
    enemy.onGround = false;
    enemy.hoverY = getGroundYAtX(enemy.x) - balance.hoverHeight;
    const target = getPlayerBodyCenter();
    const dist = target.x - enemy.x;
    enemy.facing = dist === 0 ? enemy.facing : Math.sign(dist);

    if (!player.alive) {
      enemy.vx = Math.sin(performance.now() / 700 + enemy.id) * 10;
      enemy.x = clamp(enemy.x + enemy.vx * dt, 55, worldWidth - 55);
      enemy.y += (enemy.hoverY - enemy.y) * Math.min(1, dt * 4);
      setEnemyAnimationState(enemy, "FlyIdle", dt);
      return;
    }
    if (enemy.edgeResetDirection) { updateDemonRangedEdgeReset(enemy, dt); return; }

    updateDemonRangedAimHeight(enemy, dt);
    if (canDemonRangedAttack(enemy)) { startDemonRangedAttack(enemy); return; }

    const retreatDirection = -Math.sign(dist || enemy.facing || 1);
    enemy.vx = retreatDirection * balance.flySpeed;
    const previousX = enemy.x;
    enemy.x = clamp(enemy.x + enemy.vx * dt, 55, worldWidth - 55);
    enemy.hoverY = getGroundYAtX(enemy.x) - balance.hoverHeight;
    const atLeft = enemy.x <= 55 && enemy.vx < 0 && previousX === enemy.x;
    const atRight = enemy.x >= worldWidth - 55 && enemy.vx > 0 && previousX === enemy.x;
    if (atLeft || atRight) {
      enemy.edgeResetDirection = atLeft ? 1 : -1;
      enemy.edgeResetTargetX = clamp(enemy.x + enemy.edgeResetDirection * DEMON_RANGED_EDGE_RESET_DISTANCE, 55, worldWidth - 55);
      return;
    }
    enemy.facing = Math.sign(enemy.vx) || enemy.facing;
    setEnemyAnimationState(enemy, "FlyForward", dt);
  }

  function updateDemonRangedTakeoff(enemy, dt) {
    const frames = animations?.DemonRanged?.GroundedToFly ?? [];
    const defs = ANIMATION_DEFS.DemonRanged.GroundedToFly;
    const duration = Math.max(frames.length, defs.frameCount) / defs.fps;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * defs.fps), Math.max(frames.length - 1, 0));
    enemy.hoverY = getGroundYAtX(enemy.x) - COMBAT.enemies.DemonRanged.hoverHeight;
    const progress = duration > 0 ? clamp(enemy.animTime / duration, 0, 1) : 1;
    enemy.y = Math.round(enemy.groundY + (enemy.hoverY - enemy.groundY) * (1 - Math.pow(1 - progress, 2)));
    if (enemy.animTime >= duration) {
      enemy.airborne = true;
      enemy.onGround = false;
      enemy.y = enemy.hoverY;
      enemy.state = "FlyIdle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
    }
  }

  function updateDemonRangedEdgeReset(enemy, dt) {
    const direction = enemy.edgeResetDirection;
    enemy.vx = direction * COMBAT.enemies.DemonRanged.flySpeed;
    enemy.facing = direction;
    enemy.x = clamp(enemy.x + enemy.vx * dt, 55, worldWidth - 55);
    updateDemonRangedAimHeight(enemy, dt);
    setEnemyAnimationState(enemy, "FlyForward", dt);
    if ((direction > 0 && enemy.x >= enemy.edgeResetTargetX) || (direction < 0 && enemy.x <= enemy.edgeResetTargetX)) {
      enemy.edgeResetDirection = 0;
      enemy.edgeResetTargetX = null;
    }
  }

  function updateDemonRangedAimHeight(enemy, dt) {
    const target = getPlayerBodyCenter();
    const release = getDemonRangedAimReleasePosition(enemy);
    const desiredY = clamp(enemy.y + target.y - release.y, 80, getGroundYAtX(enemy.x) - 64);
    const speed = COMBAT.enemies.DemonRanged.flySpeed * 1.45;
    enemy.y += clamp(desiredY - enemy.y, -speed * dt, speed * dt);
  }

  function canDemonRangedAttack(enemy) {
    if (!player.alive || player.capture || enemy.attackCooldown > 0 || enemy.edgeResetDirection) return false;
    const body = getBodyBox(player);
    const outside = enemy.x <= body.x - DEMON_RANGED_ATTACK_BODY_GAP || enemy.x >= body.x + body.width + DEMON_RANGED_ATTACK_BODY_GAP;
    if (!outside || Math.abs(getPlayerBodyCenter().x - enemy.x) > COMBAT.enemies.DemonRanged.maxRangeX) return false;
    return Math.abs(getPlayerBodyCenter().y - getDemonRangedAimReleasePosition(enemy).y) <= COMBAT.enemies.DemonRanged.aimToleranceY;
  }

  function getDemonRangedAimReleasePosition(enemy) {
    return getDemonRangedArrowReleasePosition({
      ...enemy,
      state: "FlyRangedAttack",
      frameIndex: DEMON_RANGED_BOW_HOLD_FRAME,
    });
  }

  function startDemonRangedAttack(enemy) {
    enemy.state = "FlyRangedAttack";
    enemy.animTime = 0;
    enemy.frameIndex = 0;
    enemy.vx = 0;
    enemy.arrowLaunched = false;
    enemy.aimTarget = getPlayerBodyCenter();
    enemy.attackFacing = Math.sign(enemy.aimTarget.x - enemy.x) || enemy.facing || 1;
    enemy.facing = enemy.attackFacing;
    enemy.bowHoldTime = 0;
    enemy.bowHoldComplete = false;
  }

  function updateDemonRangedAttack(enemy, dt) {
    const frames = animations?.DemonRanged?.FlyRangedAttack ?? [];
    const defs = ANIMATION_DEFS.DemonRanged.FlyRangedAttack;
    const holdStart = DEMON_RANGED_BOW_HOLD_FRAME / defs.fps;
    const previous = enemy.frameIndex;
    enemy.facing = enemy.attackFacing || enemy.facing;
    if (!enemy.bowHoldComplete && enemy.animTime + dt >= holdStart) {
      enemy.bowHoldTime += dt;
      enemy.animTime = holdStart;
      enemy.frameIndex = DEMON_RANGED_BOW_HOLD_FRAME;
      if (enemy.bowHoldTime < DEMON_RANGED_BOW_HOLD_DURATION) return;
      enemy.bowHoldComplete = true;
    }
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * defs.fps), Math.max(frames.length - 1, 0));
    if (!enemy.arrowLaunched && didCrossAnimationFrame(previous, enemy.frameIndex, ATTACK_EVENTS.demonRangedArrow.releaseFrame)) {
      launchDemonRangedArrow(enemy);
      enemy.arrowLaunched = true;
      enemy.attackCooldown = COMBAT.enemies.DemonRanged.postShotCooldown;
    }
    if (enemy.animTime >= Math.max(frames.length, defs.frameCount) / defs.fps) {
      enemy.state = "FlyIdle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.attackFacing = null;
      enemy.aimTarget = null;
    }
  }

  function launchDemonRangedArrow(enemy) {
    const start = getDemonRangedArrowReleasePosition(enemy);
    const target = enemy.aimTarget ?? getPlayerBodyCenter();
    const distance = Math.max(1, Math.hypot(target.x - start.x, target.y - start.y));
    const speed = COMBAT.enemies.DemonRanged.arrowSpeed;
    demonRangedArrows.push({
      x: start.x, y: start.y,
      vx: (target.x - start.x) / distance * speed,
      vy: (target.y - start.y) / distance * speed,
      ownerId: enemy.id, damage: COMBAT.enemies.DemonRanged.arrowDamage,
      elapsed: 0, maxLife: COMBAT.enemies.DemonRanged.arrowMaxLife, alive: true,
    });
  }

  function getPlayerBodyCenter() {
    const body = getBodyBox(player);
    return { x: body.x + body.width / 2, y: body.y + body.height / 2 };
  }

  function getDemonRangedArrowReleasePosition(enemy) {
    const metrics = getDrawMetrics(enemy, animations.DemonRanged, ANIMATION_DEFS.DemonRanged, CHAR.DemonRanged.idleFallback, CHAR.DemonRanged.targetHeight);
    if (!metrics) return { x: enemy.x + (enemy.facing || 1) * 54, y: enemy.y - 65 };
    const sx = metrics.width / metrics.sourceWidth;
    const sy = metrics.height / metrics.sourceHeight;
    const localX = (DEMON_RANGED_ARROW_SOURCE_POINT.x - metrics.sourceX) * sx;
    const localY = (DEMON_RANGED_ARROW_SOURCE_POINT.y - metrics.sourceY) * sy;
    return {
      x: (shouldFlipSpriteForFacing(enemy) ? metrics.anchorX - (metrics.flippedScreenX + localX) : metrics.screenX + localX) + camera.x,
      y: metrics.screenY + localY,
    };
  }

  function updateDemonRangedArrows(dt) {
    const playerBox = getBodyBox(player);
    for (const arrow of demonRangedArrows) {
      if (!arrow.alive) continue;
      arrow.elapsed += dt;
      arrow.x += arrow.vx * dt;
      arrow.y += arrow.vy * dt;
      arrow.angle = Math.atan2(arrow.vy, arrow.vx);
      const arrowBox = { x: arrow.x - 10, y: arrow.y - 5, width: 20, height: 10 };
      if (player.alive && intersects(arrowBox, playerBox)) {
        const owner = enemies.find((enemy) => enemy.id === arrow.ownerId);
        const push = Math.sign(player.x - (owner?.x ?? arrow.x)) || Math.sign(arrow.vx) || 1;
        damagePlayer(arrow.damage, push, "KnockBack");
        arrow.alive = false;
      }
      if (arrow.elapsed >= arrow.maxLife || arrow.x < -80 || arrow.x > worldWidth + 80 || arrow.y < -80 || arrow.y > VIEWPORT_HEIGHT + 80) {
        arrow.alive = false;
      }
    }
    for (let i = demonRangedArrows.length - 1; i >= 0; i--) {
      if (!demonRangedArrows[i].alive) demonRangedArrows.splice(i, 1);
    }
  }

  function drawDemonRangedArrows() {
    const frame = animations?.DemonRangedProjectile?.Arrow?.[0];
    if (!frame?.image) return;
    const bounds = frame.bounds?.width ? frame.bounds : { x: 0, y: 0, width: frame.image.width, height: frame.image.height };
    const scale = DEMON_RANGED_ARROW_TARGET_HEIGHT / Math.max(1, bounds.height);
    const width = Math.round(bounds.width * scale);
    const height = Math.round(bounds.height * scale);
    for (const arrow of demonRangedArrows) {
      ctx.save();
      ctx.translate(Math.round(arrow.x - camera.x), Math.round(arrow.y));
      ctx.rotate(arrow.angle || 0);
      ctx.drawImage(frame.image, bounds.x, bounds.y, bounds.width, bounds.height, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
  }

  function updateDemonRangedKnockBack(enemy, dt) {
    if (advanceEnemyAnimation(enemy, "DemonRanged", "KnockBack", dt)) {
      enemy.state = "FlyIdle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.DemonRanged.knockBackRecoveryCooldown);
    }
    enemy.x = clamp(enemy.x + enemy.vx * dt, 55, worldWidth - 55);
    enemy.vx *= Math.pow(0.12, dt);
    enemy.hoverY = getGroundYAtX(enemy.x) - COMBAT.enemies.DemonRanged.hoverHeight;
    enemy.y += (enemy.hoverY - enemy.y) * Math.min(1, dt * 3);
  }

  function advanceEnemyAnimation(enemy, type, stateName, dt) {
    const frames = animations?.[type]?.[stateName] ?? [];
    const defs = ANIMATION_DEFS[type][stateName];
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * defs.fps), Math.max(frames.length - 1, 0));
    return enemy.animTime >= Math.max(frames.length, defs.frameCount) / defs.fps;
  }

  function updateFlyingEnemyDeath(enemy, dt) {
    const type = enemy.type;
    const frames = animations?.[type]?.Death ?? [];
    const defs = ANIMATION_DEFS[type].Death;
    if (!enemy.deathGrounded) {
      enemy.y += (getGroundYAtX(enemy.x) - enemy.y) * Math.min(1, dt * 5);
      enemy.deathGrounded = Math.abs(getGroundYAtX(enemy.x) - enemy.y) < 2;
      if (!enemy.deathGrounded) return;
      enemy.y = getGroundYAtX(enemy.x);
    }
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * defs.fps), Math.max(frames.length - 1, 0));
    if (enemy.animTime >= Math.max(frames.length, defs.frameCount) / defs.fps) {
      enemy.deathTimer += dt;
      if (enemy.deathTimer >= ENEMY_DEATH_HOLD_DURATION + ENEMY_DEATH_FADE_DURATION) enemy.removed = true;
    }
  }

  function updateSatanBoss(enemy, dt) {
    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
    if (enemy.entranceActive) { updateSatanEntrance(enemy, dt); return; }
    if (enemy.state === "KnockBack" || enemy.state === "KnockDown") { updateSatanReaction(enemy, dt); return; }
    if (enemy.state === "MeleeAttack") { updateSatanMelee(enemy, dt); return; }
    if (enemy.state === "Grab") { updateSatanGrab(enemy, dt); return; }
    if (enemy.state === "Jump") { updateSatanJump(enemy, dt); return; }
    if (!player.alive) { enemy.vx = 0; setLoopingEnemyState(enemy, "Idle", dt); return; }
    const dx = player.x - enemy.x;
    enemy.facing = Math.sign(dx) || enemy.facing;
    if (enemy.attackCooldown <= 0 && Math.abs(dx) <= SATAN_COMBAT.grabRange && Math.random() < 0.32) { startSatanGrab(enemy); return; }
    if (enemy.attackCooldown <= 0 && Math.abs(dx) <= SATAN_COMBAT.meleeRange) { startSatanMelee(enemy); return; }
    enemy.vx = Math.sign(dx) * SATAN_COMBAT.runSpeed;
    enemy.x = clamp(enemy.x + enemy.vx * dt, 70, worldWidth - 70);
    enemy.y = getGroundYAtX(enemy.x);
    setDistanceDrivenEnemyState(enemy, "Run", dt, CHAR.Satan.strideLength);
  }

  function updateSatanEntrance(enemy, dt) {
    enemy.vx = 0;
    enemy.entranceTimer += dt;
    if (enemy.entrancePhase === "seated-hold") {
      enemy.state = "KnockDown"; enemy.frameIndex = SATAN_THRONE_SEATED_FRAME;
      enemy.scriptedDrawOffsetY = Math.sin(enemy.entranceTimer * Math.PI * 2) * 2;
      if (enemy.entranceTimer >= SATAN_THRONE_SEATED_HOLD) { enemy.entrancePhase = "seated-reverse"; enemy.entranceTimer = 0; }
      return;
    }
    enemy.scriptedDrawOffsetY = 0;
    if (enemy.entrancePhase === "seated-reverse") {
      enemy.state = "KnockDown";
      enemy.frameIndex = Math.max(0, SATAN_THRONE_SEATED_FRAME - Math.floor(enemy.entranceTimer * SATAN_COMBAT.spawn.seatedReverseFps));
      if (enemy.frameIndex === 0) { enemy.entrancePhase = "pre-jump-idle"; enemy.entranceTimer = 0; enemy.state = "Idle"; enemy.frameIndex = 0; }
      return;
    }
    if (enemy.entrancePhase === "pre-jump-idle") {
      setLoopingEnemyState(enemy, "Idle", dt);
      if (enemy.entranceTimer >= SATAN_THRONE_PRE_JUMP_IDLE) {
        enemy.entrancePhase = "jump"; startSatanJump(enemy, true);
      }
      return;
    }
    if (enemy.entrancePhase === "jump") {
      updateSatanJump(enemy, dt);
      return;
    }
    setLoopingEnemyState(enemy, "Idle", dt);
    if (enemy.entranceTimer >= SATAN_THRONE_LANDING_IDLE) {
      enemy.entranceActive = false; enemy.entrancePhase = null; enemy.attackCooldown = 0.5;
    }
  }

  function startSatanMelee(enemy) { enemy.state = "MeleeAttack"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.vx = 0; }
  function updateSatanMelee(enemy, dt) {
    const prev = enemy.frameIndex;
    const done = advanceEnemyAnimation(enemy, "Satan", "MeleeAttack", dt);
    if (!enemy.attackResolved && didCrossAnimationFrame(prev, enemy.frameIndex, 8)) {
      enemy.attackResolved = true; tryDamagePlayerFromAttack(enemy, "satan-melee", SATAN_COMBAT.meleeDamage, "KnockBack");
    }
    if (done) { enemy.state = "Idle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackCooldown = SATAN_COMBAT.meleeRecoveryCooldown; }
  }

  function startSatanGrab(enemy) { enemy.state = "Grab"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.captureReleased = false; enemy.vx = 0; }
  function updateSatanGrab(enemy, dt) {
    const prev = enemy.frameIndex;
    const done = advanceEnemyAnimation(enemy, "Satan", "Grab", dt);
    if (!enemy.attackResolved && enemy.frameIndex >= 4 && enemy.frameIndex <= 7 && !player.capture && intersects(getAttackBox(enemy, "satan-grab"), getBodyBox(player))) {
      enemy.attackResolved = true; player.capture = { enemyId: enemy.id, frameIndex: enemy.frameIndex }; syncCapturedPlayer(enemy);
    }
    if (!enemy.captureReleased && player.capture?.enemyId === enemy.id && didCrossAnimationFrame(prev, enemy.frameIndex, 12)) releaseSatanGrab(enemy);
    if (done) {
      if (player.capture?.enemyId === enemy.id) releaseSatanGrab(enemy);
      enemy.state = "Idle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackCooldown = SATAN_COMBAT.grabRecoveryCooldown;
    }
  }

  function getSatanGrabPose(enemy) {
    const held = enemy.frameIndex < 8;
    return {
      x: enemy.x + enemy.facing * (held ? 48 : 72),
      y: enemy.y - (held ? 30 : 56),
      facing: -enemy.facing,
      frameIndex: 1,
      targetHeight: CHAR.Granny.targetHeight,
      rotation: -enemy.facing * 0.2,
    };
  }
  function releaseSatanGrab(enemy) {
    const direction = enemy.facing || 1;
    const targetX = direction > 0 ? worldWidth - SATAN_THROW_EDGE_MARGIN : SATAN_THROW_EDGE_MARGIN;
    const distance = Math.max(1, Math.abs(targetX - player.x));
    const flightTime = Math.max(0.35, distance / SATAN_THROW_VELOCITY_X);
    clearPlayerCapture(enemy); enemy.captureReleased = true;
    player.damageCooldown = 0; damagePlayer(SATAN_COMBAT.grabThrowDamage, direction, "KnockDown");
    player.vx = (targetX - player.x) / flightTime; player.vy = SATAN_THROW_VELOCITY_Y; player.onGround = false;
  }

  function maybeStartSatanHealJump(enemy, previousHealth) {
    const half = enemy.maxHealth * 0.5, quarter = enemy.maxHealth * 0.25;
    if (!enemy.halfHealJumpUsed && previousHealth > half && enemy.health <= half) { enemy.halfHealJumpUsed = true; startSatanJump(enemy, false, true); return true; }
    if (!enemy.quarterHealJumpUsed && previousHealth > quarter && enemy.health <= quarter) { enemy.quarterHealJumpUsed = true; startSatanJump(enemy, false, true); return true; }
    return false;
  }
  function startSatanJump(enemy, entrance = false, heal = false) {
    const left = 90, right = worldWidth - 90;
    const targetX = entrance ? clamp(player.x + 220, 120, worldWidth - 120) : (Math.abs(player.x - left) > Math.abs(player.x - right) ? left : right);
    enemy.state = "Jump"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.vx = 0;
    enemy.leapStartX = enemy.x; enemy.leapStartY = enemy.y; enemy.leapTargetX = targetX; enemy.leapTargetY = getGroundYAtX(targetX);
    enemy.healJumpActive = heal; enemy.healApplied = false; enemy.entranceJump = entrance;
  }
  function updateSatanJump(enemy, dt) {
    const prev = enemy.frameIndex;
    const frames = animations.Satan.Jump; const def = ANIMATION_DEFS.Satan.Jump;
    enemy.animTime += dt; enemy.frameIndex = Math.min(Math.floor(enemy.animTime * def.fps), frames.length - 1);
    const p = clamp(enemy.animTime / (frames.length / def.fps), 0, 1);
    enemy.x = enemy.leapStartX + (enemy.leapTargetX - enemy.leapStartX) * p;
    enemy.y = enemy.leapStartY + (enemy.leapTargetY - enemy.leapStartY) * p - Math.sin(Math.PI * p) * 150;
    if (enemy.healJumpActive && !enemy.healApplied && didCrossAnimationFrame(prev, enemy.frameIndex, SATAN_HEAL_FRAME)) {
      enemy.healApplied = true; enemy.health = Math.min(enemy.maxHealth, enemy.health + Math.round(enemy.maxHealth * SATAN_HEAL_RATIO));
    }
    if (p >= 1) {
      enemy.x = enemy.leapTargetX; enemy.y = enemy.leapTargetY; enemy.onGround = true;
      if (enemy.entranceJump) {
        triggerScreenShake(SATAN_COMBAT.spawn.landingShakeDuration, SATAN_COMBAT.spawn.landingShakeStrength);
        enemy.entrancePhase = "landed-hold"; enemy.entranceTimer = 0;
      } else { enemy.attackCooldown = SATAN_COMBAT.jumpRecoveryCooldown; }
      enemy.state = "Idle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.healJumpActive = false;
    }
  }

  function startSatanReaction(enemy, state, push = 0) { clearPlayerCapture(enemy); enemy.state = state; enemy.animTime = 0; enemy.frameIndex = 0; enemy.vx = push * 100; }
  function updateSatanReaction(enemy, dt) {
    const state = enemy.state; const done = advanceEnemyAnimation(enemy, "Satan", state, dt);
    enemy.x = clamp(enemy.x + enemy.vx * dt, 70, worldWidth - 70); enemy.vx *= Math.pow(0.1, dt); enemy.y = getGroundYAtX(enemy.x);
    if (done) { enemy.state = "Idle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackCooldown = 0.6; }
  }

  function startSatanEvolutionTransition(enemy) {
    clearPlayerCapture(enemy);
    const index = enemies.indexOf(enemy); if (index < 0) return;
    enemies.splice(index, 1);
    const evolved = spawnSatanEvolutionBoss({ id: enemy.id, x: enemy.x, y: getGroundYAtX(enemy.x), facing: enemy.facing, requiredForClear: enemy.requiredForClear });
    const newIndex = enemies.indexOf(evolved); enemies.splice(newIndex, 1); enemies.splice(index, 0, evolved);
  }

  function updateSatanEvolutionBoss(enemy, dt) {
    enemy.damageCooldown = Math.max(0, enemy.damageCooldown - dt);
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    if (enemy.state === "Death") { updateSatanEvolutionDeath(enemy, dt); return; }
    if (enemy.state === "Cutscene") { if (advanceEnemyAnimation(enemy, "SatanEvolution", "Cutscene", dt)) startEvolutionTakeoff(enemy); return; }
    if (enemy.state === "GroundedToFly") { updateEvolutionTakeoff(enemy, dt); return; }
    if (enemy.state === "FlyMeleeAttack") { updateEvolutionMelee(enemy, dt); return; }
    if (enemy.state === "JumpSlam") { updateEvolutionJumpSlam(enemy, dt); return; }
    if (enemy.state === "Summon") { updateEvolutionSummon(enemy, dt); return; }
    if (enemy.state === "GroundSlam") { updateEvolutionGroundSlam(enemy, dt); return; }
    if (enemy.state === "GroundedKnockBack" || enemy.state === "GroundedKnockDown") { updateEvolutionReaction(enemy, dt); return; }
    if (enemy.groundedPhase) { updateEvolutionGroundedCycle(enemy, dt); return; }
    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
    enemy.jumpSlamCooldown = Math.max(0, enemy.jumpSlamCooldown - dt);
    enemy.summonCooldown = Math.max(0, enemy.summonCooldown - dt);
    if (!player.alive) { enemy.vx = 0; setLoopingEnemyState(enemy, "FlyIdle", dt); return; }
    const ownedAlive = enemies.some((other) => other.summonedBySatanEvolutionId === enemy.id && other.alive && !other.removed);
    if (enemy.summonCooldown <= 0 && !ownedAlive) { startEvolutionSummon(enemy); return; }
    const dx = player.x - enemy.x;
    if (enemy.attackCooldown <= 0 && Math.abs(dx) <= 145) { startEvolutionMelee(enemy); return; }
    if (enemy.jumpSlamCooldown <= 0 && Math.abs(dx) > 145) { startEvolutionJumpSlam(enemy, "stay-grounded"); return; }
    enemy.facing = Math.sign(dx) || enemy.facing; enemy.vx = Math.sign(dx) * SATAN_EVOLUTION_COMBAT.flySpeed;
    enemy.x = clamp(enemy.x + enemy.vx * dt, 70, worldWidth - 70); enemy.y += ((getGroundYAtX(enemy.x) - SATAN_EVOLUTION_COMBAT.hoverHeight) - enemy.y) * Math.min(1, dt * 4);
    setLoopingEnemyState(enemy, Math.abs(enemy.vx) > 1 ? "FlyForward" : "FlyIdle", dt);
  }

  function startEvolutionTakeoff(enemy) { enemy.state = "GroundedToFly"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.invincible = true; }
  function updateEvolutionTakeoff(enemy, dt) {
    if (!advanceEnemyAnimation(enemy, "SatanEvolution", "GroundedToFly", dt)) return;
    enemy.state = "FlyIdle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.airborne = true; enemy.onGround = false; enemy.invincible = false; enemy.transitionActive = false;
    enemy.y = getGroundYAtX(enemy.x) - SATAN_EVOLUTION_COMBAT.hoverHeight; enemy.attackCooldown = 0.8;
  }
  function startEvolutionMelee(enemy) {
    enemy.state = "FlyMeleeAttack"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false;
    enemy.attackFacing = Math.sign(player.x - enemy.x) || enemy.facing; enemy.facing = enemy.attackFacing;
    enemy.attackStartX = enemy.x; enemy.attackStartY = enemy.y; enemy.attackTargetX = player.x; enemy.attackTargetY = player.y - 70;
  }
  function updateEvolutionMelee(enemy, dt) {
    const prev = enemy.frameIndex; const done = advanceEnemyAnimation(enemy, "SatanEvolution", "FlyMeleeAttack", dt);
    const p = clamp(enemy.animTime / (ANIMATION_DEFS.SatanEvolution.FlyMeleeAttack.frameCount / ANIMATION_DEFS.SatanEvolution.FlyMeleeAttack.fps), 0, 1);
    const arc = Math.sin(Math.PI * p); enemy.x = enemy.attackStartX + (enemy.attackTargetX - enemy.attackStartX) * arc; enemy.y = enemy.attackStartY + (enemy.attackTargetY - enemy.attackStartY) * arc;
    if (!enemy.attackResolved && enemy.frameIndex >= SATAN_EVOLUTION_MELEE_ACTIVE_START && enemy.frameIndex <= SATAN_EVOLUTION_MELEE_ACTIVE_END) {
      enemy.attackResolved = tryDamagePlayerFromAttack(enemy, "satan-evolution-melee", SATAN_EVOLUTION_COMBAT.flyMeleeDamage, "KnockBack").landed;
    }
    if (done) { enemy.state = "FlyIdle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackCooldown = SATAN_EVOLUTION_COMBAT.meleeRecoveryCooldown; }
  }

  function startEvolutionJumpSlam(enemy, exitMode) {
    enemy.state = "JumpSlam"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.jumpSlamExitMode = exitMode; enemy.slamTrackedX = player.x;
    enemy.slamLandingShakeResolved = false;
    enemy.slamGroundY = getGroundYAtX(enemy.x);
  }
  function updateEvolutionJumpSlam(enemy, dt) {
    const prev = enemy.frameIndex; const done = advanceEnemyAnimation(enemy, "SatanEvolution", "JumpSlam", dt);
    if (!enemy.attackResolved) {
      const maxMove = SATAN_EVOLUTION_COMBAT.flySpeed * 1.35 * dt;
      enemy.x += clamp(player.x - enemy.x, -maxMove, maxMove); enemy.slamTrackedX = player.x;
      enemy.slamGroundY = getGroundYAtX(enemy.x);
      if (enemy.frameIndex < SATAN_EVOLUTION_SLAM_IMPACT_FRAME) enemy.y += (enemy.slamGroundY - enemy.y) * Math.min(1, dt * 8);
    }
    if (!enemy.attackResolved && didCrossAnimationFrame(prev, enemy.frameIndex, SATAN_EVOLUTION_SLAM_IMPACT_FRAME)) {
      enemy.attackResolved = true; enemy.y = getGroundYAtX(enemy.x); enemy.onGround = true;
      if (intersectsCircleRect({ x: enemy.x, y: enemy.y, radius: SATAN_EVOLUTION_SLAM_RADIUS }, getBodyBox(player))) damagePlayer(SATAN_EVOLUTION_COMBAT.jumpSlamDamage, Math.sign(player.x - enemy.x) || 1, "KnockDown");
    }
    if (enemy.attackResolved) {
      enemy.y = getGroundYAtX(enemy.x);
      enemy.onGround = true;
    }
    if (!enemy.slamLandingShakeResolved && didCrossAnimationFrame(prev, enemy.frameIndex, SATAN_EVOLUTION_SLAM_LANDING_FRAME)) {
      enemy.slamLandingShakeResolved = true;
      enemy.y = getGroundYAtX(enemy.x);
      enemy.onGround = true;
      triggerScreenShake(0.45, 11);
    }
    if (done) {
      if (enemy.jumpSlamExitMode === "return-to-air") { enemy.groundedPhase = false; startEvolutionTakeoff(enemy); }
      else { enemy.state = "GroundedRecover"; enemy.groundedPhase = true; enemy.groundedTimer = SATAN_EVOLUTION_COMBAT.groundedRecoverDuration; enemy.groundedPasses = 0; enemy.groundedContactResolved = false; }
    }
  }

  function updateEvolutionGroundedCycle(enemy, dt) {
    if (!player.alive) { enemy.vx = 0; return; }
    if (enemy.state === "GroundedRecover" || enemy.state === "GroundedTurn") {
      enemy.groundedTimer -= dt; enemy.vx = 0; setLoopingEnemyState(enemy, "Run", dt);
      if (enemy.groundedTimer <= 0) { enemy.state = "GroundedRunAcquire"; enemy.groundedContactResolved = false; }
      return;
    }
    const dx = player.x - enemy.x;
    if (enemy.state === "GroundedRunAcquire" && Math.abs(dx) <= SATAN_EVOLUTION_COMBAT.groundedCommitDistance) {
      enemy.state = "GroundedRunCommit"; enemy.commitDirection = Math.sign(dx) || enemy.facing; enemy.passTargetX = clamp(player.x + enemy.commitDirection * SATAN_EVOLUTION_COMBAT.groundedPassDistance, SATAN_EVOLUTION_COMBAT.groundedArenaMargin, worldWidth - SATAN_EVOLUTION_COMBAT.groundedArenaMargin);
    }
    const direction = enemy.state === "GroundedRunCommit" ? enemy.commitDirection : (Math.sign(dx) || enemy.facing);
    enemy.facing = direction; enemy.vx = direction * SATAN_EVOLUTION_COMBAT.groundedRunSpeed; enemy.x = clamp(enemy.x + enemy.vx * dt, SATAN_EVOLUTION_COMBAT.groundedArenaMargin, worldWidth - SATAN_EVOLUTION_COMBAT.groundedArenaMargin); enemy.y = getGroundYAtX(enemy.x);
    setDistanceDrivenEnemyState(enemy, "Run", dt, SATAN_EVOLUTION_COMBAT.groundedRunStride);
    if (enemy.state === "GroundedRunCommit" && !enemy.groundedContactResolved && player.onGround && intersects(getBodyBox(enemy), getBodyBox(player))) {
      enemy.groundedContactResolved = true; player.damageCooldown = 0; damagePlayer(0, direction, "KnockDown"); triggerScreenShake(0.12, 4);
    }
    if (enemy.state === "GroundedRunCommit" && ((direction > 0 && enemy.x >= enemy.passTargetX) || (direction < 0 && enemy.x <= enemy.passTargetX))) {
      enemy.groundedPasses += 1; enemy.vx = 0;
      if (enemy.groundedPasses === 1) startEvolutionGroundSlam(enemy);
      else startEvolutionJumpSlam(enemy, "return-to-air");
    }
  }

  function startEvolutionGroundSlam(enemy) { enemy.state = "GroundSlam"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.vx = 0; }
  function updateEvolutionGroundSlam(enemy, dt) {
    const prev = enemy.frameIndex; const done = advanceEnemyAnimation(enemy, "SatanEvolution", "GroundSlam", dt);
    if (!enemy.attackResolved && didCrossAnimationFrame(prev, enemy.frameIndex, SATAN_EVOLUTION_GROUND_SLAM_IMPACT_FRAME)) {
      enemy.attackResolved = true;
      if (intersectsCircleRect({ x: enemy.x, y: enemy.y, radius: SATAN_EVOLUTION_COMBAT.groundSlamRadius }, getBodyBox(player))) damagePlayer(SATAN_EVOLUTION_COMBAT.groundSlamDamage, Math.sign(player.x - enemy.x) || 1, "KnockDown");
      triggerScreenShake(0.35, 9);
    }
    if (done) { enemy.state = "GroundedTurn"; enemy.groundedTimer = SATAN_EVOLUTION_COMBAT.groundedTurnPause; enemy.animTime = 0; enemy.frameIndex = 0; }
  }

  function startEvolutionSummon(enemy) { enemy.state = "Summon"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.summonResolved = false; enemy.vx = 0; }
  function updateEvolutionSummon(enemy, dt) {
    const prev = enemy.frameIndex; const done = advanceEnemyAnimation(enemy, "SatanEvolution", "Summon", dt);
    if (!enemy.summonResolved && didCrossAnimationFrame(prev, enemy.frameIndex, SATAN_EVOLUTION_SUMMON_FRAME)) {
      enemy.summonResolved = true;
      const left = spawnDemon(170, { summonedBySatanEvolutionId: enemy.id }); const right = spawnDemonRanged(worldWidth - 170, { summonedBySatanEvolutionId: enemy.id });
      enemy.summonedEnemyIds = [left.id, right.id];
    }
    if (done) { enemy.state = "FlyIdle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.summonCooldown = SATAN_EVOLUTION_COMBAT.summonCooldown; enemy.attackCooldown = 0.8; }
  }

  function startEvolutionReaction(enemy) {
    enemy.state = "GroundedKnockBack";
    enemy.animTime = 0;
    enemy.frameIndex = 0;
    enemy.vx = 0;
    enemy.reactionResumeGrounded = enemy.groundedPhase;
    enemy.reactionLanding = Math.abs(enemy.y - getGroundYAtX(enemy.x)) > 2;
    enemy.reactionLandingTime = 0;
    enemy.reactionLandingStartY = enemy.y;
  }
  function updateEvolutionReaction(enemy, dt) {
    if (enemy.reactionLanding) {
      enemy.reactionLandingTime += dt;
      const progress = clamp(enemy.reactionLandingTime / 0.18, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const groundY = getGroundYAtX(enemy.x);
      enemy.y = enemy.reactionLandingStartY + (groundY - enemy.reactionLandingStartY) * eased;
      enemy.frameIndex = 0;
      if (progress < 1) return;
      enemy.y = getGroundYAtX(enemy.x);
      enemy.reactionLanding = false;
      enemy.animTime = 0;
    }
    if (enemy.state === "GroundedKnockBack" && advanceEnemyAnimation(enemy, "SatanEvolution", "GroundedKnockBack", dt)) { enemy.state = "GroundedKnockDown"; enemy.animTime = 0; enemy.frameIndex = 0; return; }
    if (enemy.state === "GroundedKnockDown" && advanceEnemyAnimation(enemy, "SatanEvolution", "GroundedKnockDown", dt)) {
      if (enemy.reactionResumeGrounded) { enemy.groundedPhase = true; enemy.state = "GroundedTurn"; enemy.groundedTimer = 0.25; }
      else startEvolutionTakeoff(enemy);
    }
  }
  function startSatanEvolutionDeath(enemy) {
    enemy.health = 0; enemy.alive = false; enemy.defeated = true; enemy.state = "Death"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.deathTimer = 0; enemy.invincible = false; enemy.groundedPhase = false;
    for (const other of enemies) if (other.summonedBySatanEvolutionId === enemy.id) other.removed = true;
  }
  function updateSatanEvolutionDeath(enemy, dt) {
    const ground = getGroundYAtX(enemy.x);
    if (Math.abs(enemy.y - ground) > 2) { enemy.y += (ground - enemy.y) * Math.min(1, dt * 5); return; }
    enemy.y = ground;
    if (!advanceEnemyAnimation(enemy, "SatanEvolution", "Death", dt)) return;
    enemy.deathTimer += dt;
    if (enemy.deathTimer >= ENEMY_DEATH_HOLD_DURATION + ENEMY_DEATH_FADE_DURATION) { registerEnemyKill(enemy); enemy.removed = true; }
  }

  function setLoopingEnemyState(enemy, state, dt) {
    if (enemy.state !== state) { enemy.state = state; enemy.animTime = 0; enemy.frameIndex = 0; }
    const def = ANIMATION_DEFS[enemy.type][state]; const count = Math.max(1, animations?.[enemy.type]?.[state]?.length || def.frameCount);
    enemy.animTime += dt; enemy.frameIndex = Math.floor(enemy.animTime * def.fps) % count;
  }
  function setDistanceDrivenEnemyState(enemy, state, dt, stride) {
    if (enemy.state !== state) { enemy.state = state; enemy.walkDistance = 0; }
    enemy.walkDistance = (enemy.walkDistance || 0) + Math.abs(enemy.vx * dt);
    const count = Math.max(1, animations?.[enemy.type]?.[state]?.length || ANIMATION_DEFS[enemy.type][state].frameCount);
    enemy.frameIndex = Math.floor((enemy.walkDistance / Math.max(1, stride)) * count) % count;
  }

  function updateNurseEnemy(enemy, dt) {
    if (enemy.state === "Death")     { updateEnemyDeath(enemy, dt);     return; }
    if (enemy.state === "KnockDown") { updateEnemyKnockDown(enemy, dt); return; }

    const dist = player.x - enemy.x;
    enemy.facing = dist === 0 ? enemy.facing : Math.sign(dist);

    // Visual range / aggro gating
    if (!player.alive) {
      enemy.alerted = false;
      enemy.aggroed = false;
    } else if (!enemy.alerted) {
      if (Math.abs(dist) <= (CHAR.Nurse.visualRange ?? enemy.aggroRange)) {
        enemy.alerted = true;
        enemy.aggroed = true;
      }
    }

    if (enemy.state === "MeleeAttack") {
      updateEnemyAttack(enemy, dt);
    } else if (enemy.stunTime > 0) {
      enemy.vx *= 0.84;
      enemy.animTime   = 0;
      enemy.frameIndex = 0;
      enemy.state      = "Idle";
    } else if (canEnemyAttackPlayer(enemy, "nurse-melee")) {
      startEnemyAttack(enemy);
    } else if (!player.alive || !enemy.alerted) {
      updateEnemyWander(enemy, dt, 38);
    } else {
      const targetSpeed = clamp(dist, -1, 1) * 38;
      enemy.vx = targetSpeed;
      if (Math.abs(targetSpeed) > 0.01) setEnemyAnimationState(enemy, "Walk", dt);
      else { enemy.state = "Idle"; enemy.animTime = 0; enemy.frameIndex = 0; }
    }

    applyEnemyPhysics(enemy, dt, 40);
  }

  function updateEnemyWander(enemy, dt, speed) {
    if (!enemy.wanderTimer || enemy.wanderTimer <= 0) {
      enemy.wanderDir   = Math.random() < 0.5 ? -1 : 1;
      enemy.wanderTimer = 1.5 + Math.random() * 2.5;
    }
    enemy.wanderTimer -= dt;
    enemy.isWandering = true;
    enemy.facing = enemy.wanderDir;
    enemy.vx     = enemy.wanderDir * speed;
    setEnemyAnimationState(enemy, "Walk", dt);
  }

  function applyEnemyPhysics(enemy, dt, clampMargin) {
    const wasWandering = Boolean(enemy.isWandering);
    enemy.x  += enemy.vx * dt;
    enemy.vy += GRAVITY * dt;
    enemy.y  += enemy.vy * dt;
    resolveEntityCollisions(enemy);
    const offscreenMargin = enemy.offscreenMargin ?? enemy.width;
    const minX = enemy.offscreenEntry ? -offscreenMargin          : clampMargin;
    const maxX = enemy.offscreenEntry ? worldWidth + offscreenMargin : worldWidth - clampMargin;
    const unclampedX = enemy.x;
    enemy.x = clamp(enemy.x, minX, maxX);
    if (enemy.offscreenEntry && enemy.x >= clampMargin && enemy.x <= worldWidth - clampMargin) {
      enemy.offscreenEntry = false;
    }
    if (wasWandering && !enemy.offscreenEntry) {
      const hitLeftWall = unclampedX <= minX && enemy.wanderDir < 0;
      const hitRightWall = unclampedX >= maxX && enemy.wanderDir > 0;
      if (hitLeftWall || hitRightWall) {
        enemy.wanderDir = hitLeftWall ? 1 : -1;
        enemy.facing = enemy.wanderDir;
        enemy.vx = enemy.wanderDir * Math.max(1, Math.abs(enemy.vx));
        enemy.wanderTimer = Math.max(enemy.wanderTimer || 0, 0.75);
      }
    }
    enemy.isWandering = false;
  }

  function updateWardEnemy(enemy, dt) {
    enemy.pointCooldown = Math.max(0, enemy.pointCooldown - dt);
    enemy.slamCooldown  = Math.max(0, enemy.slamCooldown  - dt);
    enemy.superArmor    = Math.max(0, (enemy.superArmor || 0) - dt);

    if (enemy.state === "Death")       { updateEnemyDeath(enemy, dt);         return; }
    if (enemy.state === "Entrance")    { updateWardEntrance(enemy, dt);        return; }
    if (enemy.state === "KnockBack")   { updateWardKnockBack(enemy, dt);       return; }
    if (enemy.state === "KnockDown")   { updateWardKnockDown(enemy, dt);       return; }
    if (enemy.state === "MeleeAttack") { updateWardMeleeAttack(enemy, dt);     return; }
    if (enemy.state === "Slam")        { updateWardSlam(enemy, dt);            return; }
    if (enemy.state === "Point")       { updateWardPoint(enemy, dt);           return; }

    const dist = player.x - enemy.x;
    enemy.facing = dist === 0 ? enemy.facing : Math.sign(dist);

    // Visual range gating
    if (!player.alive) {
      enemy.alerted = false;
      updateEnemyWander(enemy, dt, 28);
      applyEnemyPhysics(enemy, dt, 80);
      return;
    } else if (!enemy.alerted) {
      if (Math.abs(dist) <= (CHAR.Ward.visualRange ?? 250)) {
        enemy.alerted = true;
      } else {
        updateEnemyWander(enemy, dt, 28);
        applyEnemyPhysics(enemy, dt, 80);
        return;
      }
    }

    // Forced Point actions take priority (e.g. first 2 actions after entrance)
    if (enemy.forcedPointActions > 0 && enemy.attackCooldown <= WARD_ATTACK_READY_GRACE) {
      startWardPoint(enemy);
      enemy.forcedPointActions -= 1;
      return;
    }

    if (enemy.pointCooldown <= 0 && canSpawnMoreHostiles() && enemy.attackCooldown <= WARD_ATTACK_READY_GRACE) {
      startWardPoint(enemy);
      return;
    }

    if (Math.abs(dist) <= 176 && Math.abs(enemy.y - player.y) < 64 && enemy.attackCooldown <= 0) {
      if (enemy.slamCooldown <= 0) startWardSlam(enemy);
      else startWardMeleeAttack(enemy);
      return;
    }

    const targetSpeed = clamp(dist, -1, 1) * 28;
    enemy.vx = targetSpeed;
    if (Math.abs(targetSpeed) > 0.01) setEnemyAnimationState(enemy, "Walk", dt);
    else { enemy.state = "Walk"; enemy.animTime = 0; enemy.frameIndex = 0; }

    applyEnemyPhysics(enemy, dt, 80);
  }

  function updateLunchLadyBoss(enemy, dt) {
    if (enemy.stage === 2) updateLunchLadyStage2Boss(enemy, dt);
    else updateLunchLadyStage1Boss(enemy, dt);
  }

  function updateLunchLadyStage1Boss(enemy, dt) {
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.y = enemy.spawnY ?? LUNCH_LADY_SPAWN.y;
    enemy.onGround = true;
    if (enemy.state === "ThrowMeatball") {
      lockLunchLadyThrowFacing(enemy);
      updateLunchLadyThrow(enemy, dt);
      return;
    }
    setEnemyAnimationState(enemy, "Idle", dt);
    const throwsComplete = (enemy.throwsCompleted || 0) >= LUNCH_LADY_THROW_LIMIT;
    const capReached = isLunchLadyMeatballCapReached();
    const throwTimer = enemy.throwTimer ?? LUNCH_LADY_THROW_INTERVAL;
    if (throwsComplete || capReached || throwTimer > LUNCH_LADY_THROW_FACING_LOCK_TIME) updateLunchLadyTrackingFacing(enemy);
    else prepareLunchLadyThrowLock(enemy);
    if (throwsComplete) return;
    if (capReached) {
      enemy.throwTimer = 0;
      enemy.throwFacing = null;
      return;
    }
    enemy.throwTimer = Math.max(0, throwTimer - dt);
    if (enemy.throwTimer <= 0) startLunchLadyThrow(enemy);
  }

  function updateLunchLadyTrackingFacing(enemy) {
    enemy.facing = player.x < enemy.x ? -1 : 1;
  }

  function prepareLunchLadyThrowLock(enemy) {
    if (!Number.isFinite(enemy.pendingMeatballTargetX)) enemy.pendingMeatballTargetX = chooseLunchLadyMeatballTargetX(enemy);
    enemy.throwFacing = getLunchLadyThrowFacingForTarget(enemy.pendingMeatballTargetX);
    enemy.facing = enemy.throwFacing;
  }

  function getLunchLadyThrowFacingForTarget(targetX) {
    return (targetX - camera.x) < VIEWPORT_WIDTH / 2 ? -1 : 1;
  }

  function lockLunchLadyThrowFacing(enemy) {
    const lockedFacing = enemy.throwFacing || enemy.facing || (player.x < enemy.x ? -1 : 1);
    enemy.throwFacing = lockedFacing;
    enemy.facing = lockedFacing;
  }

  function countActiveMeatballMonsters() {
    return enemies.filter((enemy) => enemy.type === "MeatballMonster" && enemy.alive && !enemy.defeated && !enemy.removed).length;
  }

  function isLunchLadyMeatballCapReached() {
    return countActiveMeatballMonsters() >= LUNCH_LADY_MAX_ACTIVE_MEATBALL_MONSTERS;
  }

  function chooseLunchLadyMeatballTargetX(enemy) {
    const lastTargetX = enemy.lastMeatballTargetX;
    const targetPool = Number.isFinite(lastTargetX)
      ? LUNCH_LADY_MEATBALL_TARGETS.filter((targetX) => Math.abs(targetX - lastTargetX) >= LUNCH_LADY_MEATBALL_MIN_TARGET_GAP)
      : LUNCH_LADY_MEATBALL_TARGETS;
    const candidates = targetPool.length ? targetPool : LUNCH_LADY_MEATBALL_TARGETS;
    const targetX = candidates[Math.floor(Math.random() * candidates.length)];
    enemy.lastMeatballTargetX = targetX;
    return targetX;
  }

  function chooseLunchLadyStage2MeatballTargetX(enemy) {
    const jitter = Math.round(Math.random() * 70 - 35);
    const targetX = clamp(player.x + jitter, floorPath.nearX, floorPath.farX);
    enemy.lastMeatballTargetX = targetX;
    return targetX;
  }

  function startLunchLadyThrow(enemy) {
    enemy.state = "ThrowMeatball";
    enemy.animTime = 0;
    enemy.frameIndex = 0;
    enemy.vx = 0;
    enemy.vy = 0;
    if (!Number.isFinite(enemy.pendingMeatballTargetX)) {
      enemy.pendingMeatballTargetX = enemy.stage === 2 ? chooseLunchLadyStage2MeatballTargetX(enemy) : chooseLunchLadyMeatballTargetX(enemy);
    }
    enemy.throwFacing = getLunchLadyThrowFacingForTarget(enemy.pendingMeatballTargetX);
    enemy.facing = enemy.throwFacing;
    enemy.throwResolved = false;
  }

  function updateLunchLadyThrow(enemy, dt) {
    const frames = animations?.LunchLady?.ThrowMeatball ?? [];
    const frameCount = Math.max(frames.length, ANIMATION_DEFS.LunchLady.ThrowMeatball.frameCount, 1);
    const duration = frameCount / ANIMATION_DEFS.LunchLady.ThrowMeatball.fps;
    const previousFrameIndex = enemy.frameIndex;
    lockLunchLadyThrowFacing(enemy);
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.LunchLady.ThrowMeatball.fps), frameCount - 1);
    if (!enemy.throwResolved && didCrossAnimationFrame(previousFrameIndex, enemy.frameIndex, LUNCH_LADY_THROW_RELEASE_FRAME)) {
      launchLunchLadyMeatballProjectile(enemy, { sourceStage: enemy.stage ?? 1 });
      enemy.throwResolved = true;
      if (enemy.stage !== 2) enemy.throwsCompleted = Math.min(LUNCH_LADY_THROW_LIMIT, (enemy.throwsCompleted || 0) + 1);
    }
    if (enemy.animTime >= duration) {
      enemy.state = "Idle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.throwResolved = false;
      enemy.throwFacing = null;
      enemy.pendingMeatballTargetX = null;
      if (enemy.stage === 2) {
        enemy.attackCooldown = Math.max(enemy.attackCooldown || 0, COMBAT.enemies.LunchLady.throwRecoveryCooldown);
        enemy.throwCooldown = COMBAT.enemies.LunchLady.throwCooldown;
      } else {
        enemy.throwTimer = (enemy.throwsCompleted || 0) >= LUNCH_LADY_THROW_LIMIT ? Number.POSITIVE_INFINITY : Math.max(0, LUNCH_LADY_THROW_INTERVAL - duration);
      }
    }
  }

  function updateLunchLadyStage2Boss(enemy, dt) {
    enemy.slamCooldown = Math.max(0, enemy.slamCooldown - dt);
    enemy.throwCooldown = Math.max(0, (enemy.throwCooldown ?? 0) - dt);
    enemy.superArmor = Math.max(0, (enemy.superArmor || 0) - dt);
    if (enemy.state === "Death") { updateEnemyDeath(enemy, dt); return; }
    if (enemy.state === "KnockBack") { updateLunchLadyKnockBack(enemy, dt); return; }
    if (enemy.state === "KnockDown") { updateLunchLadyKnockDown(enemy, dt); return; }
    if (enemy.state === "MeleeAttack") { updateLunchLadyMeleeAttack(enemy, dt); return; }
    if (enemy.state === "Slam") { updateLunchLadySlam(enemy, dt); return; }
    if (enemy.state === "ThrowMeatball") { lockLunchLadyThrowFacing(enemy); updateLunchLadyThrow(enemy, dt); return; }
    const distanceToPlayer = player.x - enemy.x;
    enemy.facing = distanceToPlayer === 0 ? enemy.facing : Math.sign(distanceToPlayer);
    if (!player.alive) {
      enemy.alerted = false;
      updateEnemyWander(enemy, dt, LUNCH_LADY_WALK_SPEED * 0.75);
      applyEnemyPhysics(enemy, dt, 70);
      return;
    }
    enemy.alerted = true;
    if (enemy.slamCooldown <= 0 && canEnemyAttackPlayer(enemy, "lunch-lady-slam")) { startLunchLadySlam(enemy); return; }
    if (canEnemyAttackPlayer(enemy, "lunch-lady-melee")) { startLunchLadyMeleeAttack(enemy); return; }
    if (canLunchLadyStage2Throw(enemy)) {
      enemy.pendingMeatballTargetX = chooseLunchLadyStage2MeatballTargetX(enemy);
      enemy.throwFacing = getLunchLadyThrowFacingForTarget(enemy.pendingMeatballTargetX);
      enemy.facing = enemy.throwFacing;
      startLunchLadyThrow(enemy);
      return;
    }
    const targetSpeed = clamp(distanceToPlayer, -1, 1) * LUNCH_LADY_WALK_SPEED;
    enemy.vx = targetSpeed;
    if (Math.abs(targetSpeed) > 0.01) setEnemyAnimationState(enemy, "Walk", dt);
    else setEnemyAnimationState(enemy, "Idle", dt);
    applyEnemyPhysics(enemy, dt, 70);
  }

  function canLunchLadyStage2Throw(enemy) {
    return player.alive && !player.capture && enemy.throwCooldown <= 0 && !isLunchLadyMeatballCapReached() &&
      !intersects(getAttackBox(enemy, "lunch-lady-slam"), getBodyBox(player)) &&
      !intersects(getAttackBox(enemy, "lunch-lady-melee"), getBodyBox(player));
  }

  function updateMeatballEnemy(enemy, dt) {
    if (enemy.state === "Death") { updateEnemyDeath(enemy, dt); return; }
    if (enemy.state === "Spawn") { updateMeatballSpawn(enemy, dt); return; }
    if (enemy.state === "KnockBack") { updateMeatballKnockBack(enemy, dt); return; }
    if (enemy.state === "Grab") { updateMeatballGrab(enemy, dt); return; }
    const distanceToPlayer = player.x - enemy.x;
    enemy.facing = distanceToPlayer === 0 ? enemy.facing : Math.sign(distanceToPlayer);
    if (!player.alive) {
      updateEnemyWander(enemy, dt, 24);
      applyEnemyPhysics(enemy, dt, 60);
      return;
    }
    if (Math.abs(distanceToPlayer) <= MEATBALL_GRAB_RANGE_X && Math.abs(enemy.y - player.y) < MEATBALL_GRAB_RANGE_Y && enemy.attackCooldown <= 0) {
      startMeatballGrab(enemy);
      return;
    }
    const targetSpeed = clamp(distanceToPlayer, -1, 1) * MEATBALL_WALK_SPEED;
    enemy.vx = targetSpeed;
    if (Math.abs(targetSpeed) > 0.01) setEnemyAnimationState(enemy, "Walk", dt);
    else setEnemyAnimationState(enemy, "Idle", dt);
    applyEnemyPhysics(enemy, dt, 60);
  }

  function updateMeatballSpawn(enemy, dt) {
    const frames = animations?.MeatballMonster?.Spawn ?? [];
    const duration = frames.length / ANIMATION_DEFS.MeatballMonster.Spawn.fps;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.MeatballMonster.Spawn.fps), frames.length - 1);
    enemy.vx = 0; enemy.vy = 0; enemy.y = getGroundYAtX(enemy.x); enemy.onGround = true;
    if (enemy.animTime >= duration) {
      enemy.state = "Idle"; enemy.animTime = 0; enemy.frameIndex = 0;
      enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.MeatballMonster.initialGrabCooldown);
    }
  }

  function updatePizzaMonster(enemy, dt) {
    if (enemy.state === "Death") { updateEnemyDeath(enemy, dt); return; }
    if (enemy.state === "Dazed") { updatePizzaDazed(enemy, dt); return; }
    if (enemy.state === "Hitstun") { updatePizzaHitstun(enemy, dt); return; }
    if (enemy.state === "GroundLeapStart") { updatePizzaLeapStart(enemy, dt); return; }
    if (enemy.state === "Leap") { updatePizzaLeap(enemy, dt); return; }
    if (enemy.state === "LeapLand") { updatePizzaLeapLand(enemy, dt); return; }
    if (enemy.state === "Grab") { updatePizzaGrab(enemy, dt); return; }
    if (enemy.state === "GrabEnd") { updatePizzaGrabEnd(enemy, dt); return; }
    if (enemy.state === "RangedMelee") { updatePizzaRangedMelee(enemy, dt); return; }

    const distanceToPlayer = player.x - enemy.x;
    enemy.facing = distanceToPlayer === 0 ? enemy.facing : Math.sign(distanceToPlayer);
    enemy.animTime += dt;
    const idleFrames = animations?.PizzaMonster?.Idle ?? [];
    const idleDef = ANIMATION_DEFS.PizzaMonster.Idle;
    enemy.frameIndex = Math.floor(enemy.animTime * idleDef.fps) % Math.max(idleFrames.length, 1);

    if (enemy.justLanded) {
      enemy.justLanded = false;
      const absDist = getPizzaPlayerHorizontalGap(enemy);
      const grabRange = PIZZA_COMBAT.grabRange ?? 80;
      const rangedMeleeRange = PIZZA_COMBAT.rangedMeleeRange ?? 200;
      if (player.alive && absDist <= grabRange) {
        startPizzaGrab(enemy);
        return;
      }
      if (player.alive && absDist > grabRange && absDist <= rangedMeleeRange) {
        startPizzaRangedMelee(enemy);
        return;
      }
    }

    enemy.idlePause -= dt;
    if (enemy.idlePause <= 0 && player.alive) startPizzaLeap(enemy);
    applyEnemyPhysics(enemy, dt, 40);
  }

  function getPizzaPlayerHorizontalGap(enemy) {
    const enemyBox = getBodyBox(enemy);
    const playerBox = getBodyBox(player);
    if (enemyBox.x + enemyBox.width < playerBox.x) return playerBox.x - (enemyBox.x + enemyBox.width);
    if (playerBox.x + playerBox.width < enemyBox.x) return enemyBox.x - (playerBox.x + playerBox.width);
    return 0;
  }

  function updatePizzaDazed(enemy, dt) {
    enemy.dazeTimer -= dt;
    enemy.animTime += dt;
    const def = ANIMATION_DEFS.PizzaMonster.Dazed;
    enemy.frameIndex = Math.floor(enemy.animTime * def.fps) % Math.max((animations?.PizzaMonster?.Dazed?.length ?? 1), 1);
    if (enemy.dazeTimer <= 0) {
      enemy.state = "Idle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.hitCounter = 0;
      enemy.idlePause = PIZZA_COMBAT.idlePauseDuration ?? 0.7;
    }
    applyEnemyPhysics(enemy, dt, 40);
  }

  function updatePizzaHitstun(enemy, dt) {
    const frames = animations?.PizzaMonster?.Hitstun ?? [];
    const def = ANIMATION_DEFS.PizzaMonster.Hitstun;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * def.fps), Math.max(frames.length - 1, 0));
    enemy.vx *= 0.84;
    if (enemy.animTime >= frames.length / def.fps) {
      enemy.state = "Idle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.idlePause = PIZZA_COMBAT.idlePauseDuration ?? 0.7;
    }
    applyEnemyPhysics(enemy, dt, 40);
  }

  function startPizzaLeap(enemy) {
    enemy.state = "GroundLeapStart";
    enemy.animTime = 0;
    enemy.frameIndex = 0;
    enemy.vx = 0;
    const distanceToPlayer = player.x - enemy.x;
    enemy.facing = distanceToPlayer === 0 ? enemy.facing : Math.sign(distanceToPlayer);
    enemy.leapStartX = enemy.x;
    enemy.leapStartY = enemy.y;
    const current = enemy.gooIndex ?? 0;
    const choices = [0, 1, 2].filter((index) => index !== current);
    const next = choices[Math.floor(Math.random() * choices.length)];
    enemy.gooIndex = next;
    enemy.leapTargetX = PIZZA_GOO_SPOTS_X[next];
    enemy.leapTargetY = getGroundYAtX(enemy.leapTargetX);
    enemy.entranceLeap = false;
  }

  function updatePizzaLeapStart(enemy, dt) {
    const frames = animations?.PizzaMonster?.GroundLeapStart ?? [];
    const def = ANIMATION_DEFS.PizzaMonster.GroundLeapStart;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * def.fps), Math.max(frames.length - 1, 0));
    if (enemy.animTime >= frames.length / def.fps) {
      enemy.state = "Leap";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.onGround = false;
    }
  }

  function updatePizzaLeap(enemy, dt) {
    const frames = animations?.PizzaMonster?.Leap ?? [];
    const def = ANIMATION_DEFS.PizzaMonster.Leap;
    const duration = frames.length / def.fps;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * def.fps), Math.max(frames.length - 1, 0));

    const progress = clamp(enemy.animTime / duration, 0, 1);
    enemy.x = enemy.leapStartX + (enemy.leapTargetX - enemy.leapStartX) * progress;
    const baseY = enemy.leapStartY + (enemy.leapTargetY - enemy.leapStartY) * progress;
    enemy.y = baseY - 120 * 4 * progress * (1 - progress);
    enemy.facing = enemy.leapTargetX > enemy.leapStartX ? 1 : -1;

    if (enemy.animTime >= duration) {
      enemy.state = "LeapLand";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.x = enemy.leapTargetX;
      enemy.y = enemy.leapTargetY;
      enemy.onGround = true;
      enemy.vx = 0;
      enemy.vy = 0;
    }
  }

  function updatePizzaLeapLand(enemy, dt) {
    const frames = animations?.PizzaMonster?.LeapLand ?? [];
    const def = ANIMATION_DEFS.PizzaMonster.LeapLand;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * def.fps), Math.max(frames.length - 1, 0));
    if (enemy.animTime >= frames.length / def.fps) {
      enemy.state = "Idle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.justLanded = true;
      enemy.entranceComplete = true;
      enemy.idlePause = PIZZA_COMBAT.idlePauseDuration ?? 0.7;
    }
    applyEnemyPhysics(enemy, dt, 40);
  }

  function startPizzaGrab(enemy) {
    enemy.state = "Grab";
    enemy.animTime = 0;
    enemy.frameIndex = 0;
    enemy.attackResolved = false;
    enemy.vx = 0;
  }

  function updatePizzaGrab(enemy, dt) {
    const frames = animations?.PizzaMonster?.Grab ?? [];
    const def = ANIMATION_DEFS.PizzaMonster.Grab;
    const previousFrameIndex = enemy.frameIndex;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * def.fps), Math.max(frames.length - 1, 0));
    if (!enemy.attackResolved && previousFrameIndex < 4 && enemy.frameIndex >= 4) {
      enemy.attackResolved = true;
      tryDamagePlayerFromAttack(enemy, "pizza-grab", PIZZA_COMBAT.grabDamage ?? 25, "KnockBack");
    }
    if (enemy.animTime >= frames.length / def.fps) {
      enemy.state = "GrabEnd";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
    }
    applyEnemyPhysics(enemy, dt, 40);
  }

  function updatePizzaGrabEnd(enemy, dt) {
    const frames = animations?.PizzaMonster?.GrabEnd ?? [];
    const def = ANIMATION_DEFS.PizzaMonster.GrabEnd;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * def.fps), Math.max(frames.length - 1, 0));
    if (enemy.animTime >= frames.length / def.fps) {
      enemy.state = "Idle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.idlePause = PIZZA_COMBAT.idlePauseDuration ?? 0.7;
    }
    applyEnemyPhysics(enemy, dt, 40);
  }

  function startPizzaRangedMelee(enemy) {
    enemy.state = "RangedMelee";
    enemy.animTime = 0;
    enemy.frameIndex = 0;
    enemy.attackResolved = false;
    enemy.vx = 0;
  }

  function updatePizzaRangedMelee(enemy, dt) {
    const frames = animations?.PizzaMonster?.RangedMelee ?? [];
    const def = ANIMATION_DEFS.PizzaMonster.RangedMelee;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * def.fps), Math.max(frames.length - 1, 0));
    if (
      !enemy.attackResolved &&
      enemy.frameIndex >= ATTACK_EVENTS.pizzaRangedMelee.activeStartFrame &&
      enemy.frameIndex <= ATTACK_EVENTS.pizzaRangedMelee.activeEndFrame
    ) {
      const result = tryDamagePlayerFromAttack(enemy, "pizza-ranged-melee", PIZZA_COMBAT.rangedMeleeDamage ?? 30, "KnockBack");
      if (result.landed) enemy.attackResolved = true;
    }
    if (enemy.animTime >= frames.length / def.fps) {
      enemy.state = "Idle";
      enemy.animTime = 0;
      enemy.frameIndex = 0;
      enemy.idlePause = PIZZA_COMBAT.idlePauseDuration ?? 0.7;
    }
    applyEnemyPhysics(enemy, dt, 40);
  }

  function setEnemyAnimationState(enemy, animationName, dt) {
    if (enemy.state !== animationName) {
      enemy.state      = animationName;
      enemy.animTime   = 0;
      enemy.frameIndex = 0;
      if (animationName !== "Walk") enemy.walkDistance = 0;
      return;
    }
    const frames = animations?.[enemy.type]?.[animationName] ?? [];
    const defs = ANIMATION_DEFS[enemy.type];
    const def = defs?.[animationName];
    if (animationName === "Walk" && frames.length > 0) {
      enemy.walkDistance += Math.abs(enemy.vx * dt);
      enemy.frameIndex = Math.floor((enemy.walkDistance / CHAR[enemy.type].strideLength) * frames.length) % frames.length;
    } else if (def) {
      enemy.animTime  += dt;
      enemy.frameIndex = Math.floor(enemy.animTime * def.fps) % Math.max(frames.length, 1);
    }
  }

  function startEnemyAttack(enemy) {
    enemy.state          = "MeleeAttack";
    enemy.animTime       = 0;
    enemy.frameIndex     = 0;
    enemy.attackResolved = false;
    enemy.vx             = 0;
  }

  function updateEnemyAttack(enemy, dt) {
    const frames   = animations?.Nurse?.MeleeAttack ?? [];
    const duration = frames.length / ANIMATION_DEFS.Nurse.MeleeAttack.fps;
    const prevIdx  = enemy.frameIndex;

    enemy.animTime  += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.Nurse.MeleeAttack.fps), frames.length - 1);

    if (!enemy.attackResolved && isNurseMeleeDamageFrame(prevIdx, enemy.frameIndex)) {
      const result = tryDamagePlayerFromAttack(enemy, "nurse-melee", NURSE_MELEE_DAMAGE, "KnockBack");
      enemy.attackResolved = result.landed;
    }

    if (enemy.animTime >= duration) {
      enemy.state          = "Idle";
      enemy.animTime       = 0;
      enemy.frameIndex     = 0;
      enemy.attackResolved = false;
      enemy.attackCooldown = COMBAT.enemies.Nurse.attackRecoveryCooldown;
    }
  }

  function isNurseMeleeDamageFrame(previousFrameIndex, currentFrameIndex) {
    const { activeStartFrame, activeEndFrame } = ATTACK_EVENTS.nurseMelee;
    return (
      (currentFrameIndex >= activeStartFrame && currentFrameIndex <= activeEndFrame) ||
      (previousFrameIndex < activeStartFrame && currentFrameIndex >= activeStartFrame)
    );
  }

  function startKnockDown(enemy, pushDirection, defeated = false) {
    const isWard = enemy.type === "Ward";
    enemy.defeated       = defeated;
    enemy.alive          = !defeated;
    enemy.state          = "KnockDown";
    enemy.animTime       = 0;
    enemy.frameIndex     = 0;
    enemy.attackResolved = false;
    enemy.attackCooldown = isWard ? COMBAT.enemies.Ward.knockDownAttackCooldown : COMBAT.enemies.Nurse.knockDownAttackCooldown;
    enemy.vx             = pushDirection * (isWard ? 90 : 110);
    enemy.vy             = isWard ? -110 : -80;
    enemy.onGround       = false;
    enemy.deathTimer     = 0;
    if (isWard) enemy.summonResolved = false;
    else        enemy.stunTime       = 0;
  }

  function updateEnemyKnockDown(enemy, dt) {
    const frames = animations?.Nurse?.KnockDown ?? [];
    if (!frames.length) { enemy.removed = true; return; }

    enemy.animTime  += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.Nurse.KnockDown.fps), frames.length - 1);
    enemy.vx *= 0.9;
    enemy.vy += GRAVITY * dt;
    enemy.x  += enemy.vx * dt;
    enemy.y  += enemy.vy * dt;
    resolveEntityCollisions(enemy);
    enemy.x = clamp(enemy.x, 40, worldWidth - 40);

    if ((enemy.defeated || enemy.health <= 0) && enemy.frameIndex >= NURSE_DEATH_KNOCKDOWN_FRAME_INDEX) {
      startNurseDeath(enemy);
      return;
    }

    const duration = frames.length / ANIMATION_DEFS.Nurse.KnockDown.fps;
    if (enemy.animTime >= duration) {
      if (enemy.defeated || enemy.health <= 0) { startNurseDeath(enemy); return; }
      enemy.state          = "Idle";
      enemy.animTime       = 0;
      enemy.frameIndex     = 0;
      enemy.vx             = 0;
      enemy.vy             = 0;
      enemy.onGround       = true;
      enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.Nurse.standUpAttackCooldown);
    }
  }

  function startNurseDeath(enemy) {
    enemy.deathFrameIndex = NURSE_DEATH_KNOCKDOWN_FRAME_INDEX;
    enemy.state           = "Death";
    enemy.animTime        = 0;
    enemy.frameIndex      = 0;
    enemy.vx              = 0;
    enemy.vy              = 0;
    enemy.onGround        = true;
    enemy.deathTimer      = 0;
  }

  function startWardMeleeAttack(enemy) {
    enemy.state          = "MeleeAttack";
    enemy.animTime       = 0;
    enemy.frameIndex     = 0;
    enemy.attackResolved = false;
    enemy.vx             = 0;
  }

  function updateWardMeleeAttack(enemy, dt) {
    const frames   = animations?.Ward?.MeleeAttack ?? [];
    const duration = frames.length / ANIMATION_DEFS.Ward.MeleeAttack.fps;
    const prevIdx  = enemy.frameIndex;

    enemy.animTime  += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.Ward.MeleeAttack.fps), frames.length - 1);

    if (!enemy.attackResolved && didCrossAnimationFrame(prevIdx, enemy.frameIndex, ATTACK_EVENTS.wardMelee.impactFrame)) {
      const result = tryDamagePlayerFromAttack(enemy, "ward-melee", WARD_MELEE_DAMAGE, "KnockBack");
      enemy.attackResolved = result.landed;
    }

    if (enemy.animTime >= duration) {
      enemy.state          = "Walk";
      enemy.animTime       = 0;
      enemy.frameIndex     = 0;
      enemy.attackResolved = false;
      enemy.attackCooldown = COMBAT.enemies.Ward.meleeRecoveryCooldown;
    }
  }

  function startWardSlam(enemy) {
    enemy.state          = "Slam";
    enemy.animTime       = 0;
    enemy.frameIndex     = 0;
    enemy.attackResolved = false;
    enemy.vx             = 0;
  }

  function updateWardSlam(enemy, dt) {
    const frames   = animations?.Ward?.Slam ?? [];
    const duration = frames.length / ANIMATION_DEFS.Ward.Slam.fps;
    const prevIdx  = enemy.frameIndex;

    enemy.animTime  += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.Ward.Slam.fps), frames.length - 1);

    if (!enemy.attackResolved && didCrossAnimationFrame(prevIdx, enemy.frameIndex, ATTACK_EVENTS.wardSlam.impactFrame)) {
      const result = tryDamagePlayerFromAttack(enemy, "ward-slam", WARD_SLAM_DAMAGE, "KnockDown");
      enemy.attackResolved = result.landed;
      triggerScreenShake(0.22, 8);
    }

    if (enemy.animTime >= duration) {
      enemy.state          = "Walk";
      enemy.animTime       = 0;
      enemy.frameIndex     = 0;
      enemy.attackResolved = false;
      enemy.attackCooldown = COMBAT.enemies.Ward.slamRecoveryCooldown;
      enemy.slamCooldown   = WARD_SLAM_INTERVAL;
    }
  }



  function startMeatballGrab(enemy) {
    enemy.state = "Grab";
    enemy.animTime = 0;
    enemy.frameIndex = 0;
    enemy.attackResolved = false;
    enemy.captureReleased = false;
    enemy.vx = 0;
  }

  function updateMeatballGrab(enemy, dt) {
    const frames = animations?.MeatballMonster?.Grab ?? [];
    const duration = frames.length / ANIMATION_DEFS.MeatballMonster.Grab.fps;
    const previousFrameIndex = enemy.frameIndex;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.MeatballMonster.Grab.fps), frames.length - 1);
    if (!enemy.attackResolved && isMeatballGrabCaptureFrameActive(previousFrameIndex, enemy.frameIndex)) enemy.attackResolved = tryCapturePlayerFromMeatballGrab(enemy);
    if (!enemy.captureReleased && player.capture?.enemyId === enemy.id && didCrossAnimationFrame(previousFrameIndex, enemy.frameIndex, ATTACK_EVENTS.meatballGrab.releaseFrame)) releaseMeatballCapturedPlayer(enemy, true);
    if (enemy.animTime >= duration) {
      if (player.capture?.enemyId === enemy.id) releaseMeatballCapturedPlayer(enemy, true);
      enemy.state = "Idle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.captureReleased = false;
      enemy.attackCooldown = COMBAT.enemies.MeatballMonster.grabCooldown;
    }
  }

  function isMeatballGrabCaptureFrameActive(previousFrameIndex, currentFrameIndex) {
    const { activeStartFrame, activeEndFrame } = ATTACK_EVENTS.meatballGrab;
    return (currentFrameIndex >= activeStartFrame && currentFrameIndex <= activeEndFrame) || (previousFrameIndex < activeStartFrame && currentFrameIndex >= activeStartFrame);
  }

  function tryCapturePlayerFromMeatballGrab(enemy) {
    if (!player.alive || player.capture) return false;
    if (!intersects(getAttackBox(enemy, "meatball-grab"), getBodyBox(player))) return false;
    player.capture = { enemyId: enemy.id, frameIndex: enemy.frameIndex };
    syncCapturedPlayer(enemy);
    return true;
  }

  function releaseMeatballCapturedPlayer(enemy, applyDamage) {
    if (player.capture?.enemyId !== enemy.id) return false;
    const pose = getMeatballGrabCapturePose(enemy);
    player.x = pose.x; player.y = pose.y; player.facing = pose.facing; player.capture = null; enemy.captureReleased = true;
    if (applyDamage && player.alive) {
      player.damageCooldown = 0;
      const damaged = damagePlayer(MEATBALL_GRAB_DAMAGE, enemy.facing || 1, "KnockBack");
      if (damaged) { player.y = pose.y; player.vy = -150; player.onGround = false; }
      return damaged;
    }
    player.vx = 0; player.vy = 0; player.onGround = false;
    return true;
  }

  function getMeatballGrabCapturePose(enemy) {
    const frameIndex = clamp(enemy.frameIndex ?? 0, 0, ANIMATION_DEFS.MeatballMonster.Grab.frameCount - 1);
    let offsetX = 5; let offsetY = -3;
    if (frameIndex <= 8) { offsetX = 39; offsetY = -7; }
    else if (frameIndex <= 12) { offsetX = 31; offsetY = 13; }
    else if (frameIndex <= 15) { offsetX = 23; offsetY = 17; }
    else if (frameIndex === 16) { offsetX = 13; offsetY = 7; }
    const facing = enemy.facing || -1;
    const knockBackFrames = animations?.Granny?.KnockBack ?? [];
    return {
      x: enemy.x + facing * offsetX,
      y: enemy.y - offsetY,
      facing: -facing,
      frameIndex: Math.min(MEATBALL_CAPTURE_GRANNY_FRAME, Math.max(0, knockBackFrames.length - 1)),
      targetHeight: Math.round(CHAR.Granny.targetHeight * MEATBALL_CAPTURE_GRANNY_SCALE),
      rotation: -facing * MEATBALL_CAPTURE_GRANNY_TILT,
    };
  }

  function syncCapturedPlayerToMeatball(enemy) {
    const pose = getMeatballGrabCapturePose(enemy);
    player.x = pose.x; player.y = pose.y; player.facing = pose.facing; player.vx = 0; player.vy = 0; player.onGround = false;
    if (player.capture) player.capture.frameIndex = enemy.frameIndex;
  }

  function syncCapturedPlayer(enemy) {
    if (enemy.type === "Satan") {
      const pose = getSatanGrabPose(enemy);
      player.x = pose.x;
      player.y = pose.y;
      player.facing = pose.facing;
      player.vx = 0;
      player.vy = 0;
      player.onGround = false;
      if (player.capture) player.capture.frameIndex = enemy.frameIndex;
      return;
    }
    syncCapturedPlayerToMeatball(enemy);
  }

  function clearPlayerCapture(enemy = null) {
    if (!player.capture) return;
    if (enemy && player.capture.enemyId !== enemy.id) return;
    player.capture = null;
  }

  function getCapturingEnemy() {
    if (!player.capture) return null;
    return enemies.find((enemy) => enemy.id === player.capture.enemyId && !enemy.removed && enemy.state === "Grab") ?? null;
  }

  function startMeatballKnockBack(enemy, pushDirection) {
    clearPlayerCapture(enemy);
    enemy.state = "KnockBack"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.vx = pushDirection * 92; enemy.vy = 0;
  }

  function updateMeatballKnockBack(enemy, dt) {
    const frames = animations?.MeatballMonster?.KnockBack ?? [];
    const duration = frames.length / ANIMATION_DEFS.MeatballMonster.KnockBack.fps;
    if (enemy.defeated || enemy.health <= 0) { startMeatballDeath(enemy); return; }
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.MeatballMonster.KnockBack.fps), frames.length - 1);
    enemy.vx *= 0.86; enemy.x += enemy.vx * dt; enemy.y += enemy.vy * dt; resolveEntityCollisions(enemy); enemy.x = clamp(enemy.x, 60, worldWidth - 60);
    if (enemy.animTime >= duration) { enemy.state = "Idle"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.vx = 0; enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.MeatballMonster.knockBackRecoveryCooldown); }
  }

  function startMeatballDeath(enemy) {
    clearPlayerCapture(enemy);
    enemy.defeated = true; enemy.alive = false; enemy.state = "Death"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.vx = 0; enemy.vy = 0; enemy.onGround = true; enemy.deathTimer = 0;
  }


  function startWardPoint(enemy) {
    enemy.state          = "Point";
    enemy.animTime       = 0;
    enemy.frameIndex     = 0;
    enemy.summonResolved = false;
    enemy.vx             = 0;
  }

  function updateWardPoint(enemy, dt) {
    const frames   = animations?.Ward?.Point ?? [];
    const duration = frames.length / ANIMATION_DEFS.Ward.Point.fps;

    enemy.animTime  += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.Ward.Point.fps), frames.length - 1);

    if (!enemy.summonResolved && enemy.frameIndex >= 7) {
      if (canSpawnMoreHostiles()) summonNurseFromWard(enemy);
      enemy.summonResolved = true;
    }

    if (enemy.animTime >= duration) {
      enemy.state          = "Walk";
      enemy.animTime       = 0;
      enemy.frameIndex     = 0;
      // Short cooldown between forced Point actions, normal 20s otherwise
      enemy.pointCooldown  = enemy.forcedPointActions > 0 ? 0 : WARD_POINT_INTERVAL;
      enemy.attackCooldown = enemy.forcedPointActions > 0 ? COMBAT.enemies.Ward.forcedPointRecoveryCooldown : COMBAT.enemies.Ward.pointRecoveryCooldown;
      enemy.summonResolved = false;
    }
  }

  function summonNurseFromWard(source) {
    const spawnFromLeft = source.facing > 0;
    const spawnX = spawnFromLeft
      ? -NURSE_OFFSCREEN_SPAWN_MARGIN
      : worldWidth + NURSE_OFFSCREEN_SPAWN_MARGIN;
    spawnNurse(spawnX, {
      facing:        spawnFromLeft ? 1 : -1,
      offscreenEntry: true,
      requiredForClear: false,
    });
  }

  function updateWardEntrance(enemy, dt) {
    const frames   = animations?.Ward?.Entrance ?? [];
    const duration = frames.length / ANIMATION_DEFS.Ward.Entrance.fps;
    const groundY  = enemy.entranceGroundY ?? getGroundYAtX(enemy.x);

    enemy.animTime  += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.Ward.Entrance.fps), frames.length - 1);
    enemy.vx         = 0;
    enemy.vy        += GRAVITY * dt;
    enemy.y         += enemy.vy * dt;
    enemy.onGround   = false;

    if (enemy.y >= groundY) {
      enemy.y        = groundY;
      enemy.vy       = 0;
      enemy.onGround = true;
      enemy.entranceLanded = true;
    }

    if (enemy.entranceLanded && !enemy.entranceImpactTriggered) {
      enemy.entranceImpactTriggered = true;
      triggerScreenShake(0.55, 14);
    }

    if (enemy.entranceLanded && enemy.animTime >= duration) {
      enemy.state          = "Walk";
      enemy.animTime       = 0;
      enemy.frameIndex     = 0;
      // Short cooldown after entrance; immediate if forced Point actions are queued
      enemy.attackCooldown = enemy.forcedPointActions > 0 ? COMBAT.enemies.Ward.forcedEntranceRecoveryCooldown : COMBAT.enemies.Ward.entranceRecoveryCooldown;
    }
  }

  function startWardKnockBack(enemy, pushDirection) {
    enemy.state          = "KnockBack";
    enemy.animTime       = 0;
    enemy.frameIndex     = 0;
    enemy.attackResolved = false;
    enemy.vx             = pushDirection * 78;
    enemy.vy             = 0;
  }

  function updateWardKnockBack(enemy, dt) {
    const frames   = animations?.Ward?.KnockBack ?? [];
    const duration = frames.length / ANIMATION_DEFS.Ward.KnockBack.fps;

    if (enemy.defeated || enemy.health <= 0) { startWardDeath(enemy); return; }

    enemy.animTime  += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.Ward.KnockBack.fps), frames.length - 1);
    enemy.vx *= 0.88;
    enemy.x  += enemy.vx * dt;
    enemy.y  += enemy.vy * dt;
    resolveEntityCollisions(enemy);
    enemy.x = clamp(enemy.x, 80, worldWidth - 80);

    if (enemy.animTime >= duration) {
      enemy.state          = "Walk";
      enemy.animTime       = 0;
      enemy.frameIndex     = 0;
      enemy.vx             = 0;
      enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.Ward.knockBackRecoveryCooldown);
    }
  }

  function updateWardKnockDown(enemy, dt) {
    const frames = animations?.Ward?.KnockDown ?? [];
    if (!frames.length) { enemy.removed = true; return; }

    enemy.animTime  += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.Ward.KnockDown.fps), frames.length - 1);
    enemy.vx *= 0.9;
    enemy.vy += GRAVITY * dt;
    enemy.x  += enemy.vx * dt;
    enemy.y  += enemy.vy * dt;
    resolveEntityCollisions(enemy);
    enemy.x = clamp(enemy.x, 80, worldWidth - 80);

    if ((enemy.defeated || enemy.health <= 0) && enemy.frameIndex >= WARD_DEATH_KNOCKDOWN_FRAME_INDEX) {
      startWardDeath(enemy);
      return;
    }

    const duration = frames.length / ANIMATION_DEFS.Ward.KnockDown.fps;
    if (enemy.animTime >= duration) {
      if (enemy.defeated || enemy.health <= 0) { startWardDeath(enemy); return; }
      enemy.state          = "Walk";
      enemy.animTime       = 0;
      enemy.frameIndex     = 0;
      enemy.vx             = 0;
      enemy.vy             = 0;
      enemy.onGround       = true;
      enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.Ward.standUpAttackCooldown);
    }
  }

  function startWardDeath(enemy) {
    enemy.deathFrameIndex = WARD_DEATH_KNOCKDOWN_FRAME_INDEX;
    enemy.state           = "Death";
    enemy.animTime        = 0;
    enemy.frameIndex      = 0;
    enemy.vx              = 0;
    enemy.vy              = 0;
    enemy.onGround        = true;
    enemy.deathTimer      = 0;
  }



  function startLunchLadyMeleeAttack(enemy) {
    enemy.state = "MeleeAttack"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.vx = 0;
  }

  function updateLunchLadyMeleeAttack(enemy, dt) {
    const frames = animations?.LunchLady?.MeleeAttack ?? [];
    const duration = frames.length / ANIMATION_DEFS.LunchLady.MeleeAttack.fps;
    const previousFrameIndex = enemy.frameIndex;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.LunchLady.MeleeAttack.fps), frames.length - 1);
    if (!enemy.attackResolved && didCrossAnimationFrame(previousFrameIndex, enemy.frameIndex, ATTACK_EVENTS.lunchLadyMelee.impactFrame)) {
      enemy.attackResolved = true;
      tryDamagePlayerFromAttack(enemy, "lunch-lady-melee", LUNCH_LADY_MELEE_DAMAGE, "KnockBack");
    }
    if (enemy.animTime >= duration) {
      enemy.state = "Walk"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.attackCooldown = COMBAT.enemies.LunchLady.meleeRecoveryCooldown;
    }
  }

  function startLunchLadySlam(enemy) {
    enemy.state = "Slam"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.vx = 0;
  }

  function updateLunchLadySlam(enemy, dt) {
    const frames = animations?.LunchLady?.Slam ?? [];
    const duration = frames.length / ANIMATION_DEFS.LunchLady.Slam.fps;
    const previousFrameIndex = enemy.frameIndex;
    enemy.animTime += dt;
    enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.LunchLady.Slam.fps), frames.length - 1);
    if (!enemy.attackResolved && didCrossAnimationFrame(previousFrameIndex, enemy.frameIndex, ATTACK_EVENTS.lunchLadySlam.impactFrame)) {
      enemy.attackResolved = true;
      tryDamagePlayerFromAttack(enemy, "lunch-lady-slam", LUNCH_LADY_SLAM_DAMAGE, "KnockDown");
      triggerScreenShake(0.2, 7);
    }
    if (enemy.animTime >= duration) {
      enemy.state = "Walk"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.attackCooldown = COMBAT.enemies.LunchLady.slamRecoveryCooldown; enemy.slamCooldown = LUNCH_LADY_SLAM_INTERVAL;
    }
  }

  function startLunchLadyKnockBack(enemy, pushDirection) {
    enemy.state = "KnockBack"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.vx = pushDirection * 84; enemy.vy = 0;
  }

  function updateLunchLadyKnockBack(enemy, dt) {
    const frames = animations?.LunchLady?.KnockBack ?? [];
    const duration = frames.length / ANIMATION_DEFS.LunchLady.KnockBack.fps;
    if (enemy.defeated || enemy.health <= 0) { startLunchLadyDeath(enemy); return; }
    enemy.animTime += dt; enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.LunchLady.KnockBack.fps), frames.length - 1);
    enemy.vx *= 0.88; enemy.x += enemy.vx * dt; enemy.y += enemy.vy * dt; resolveEntityCollisions(enemy); enemy.x = clamp(enemy.x, 70, worldWidth - 70);
    if (enemy.animTime >= duration) { enemy.state = "Walk"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.vx = 0; enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.LunchLady.knockBackRecoveryCooldown); }
  }

  function startLunchLadyKnockDown(enemy, pushDirection) {
    enemy.state = "KnockDown"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.attackResolved = false; enemy.attackCooldown = COMBAT.enemies.LunchLady.knockDownAttackCooldown; enemy.vx = pushDirection * 92; enemy.vy = -100; enemy.onGround = false; enemy.deathTimer = 0;
  }

  function updateLunchLadyKnockDown(enemy, dt) {
    const frames = animations?.LunchLady?.KnockDown ?? [];
    if (!frames.length) { enemy.removed = true; return; }
    enemy.animTime += dt; enemy.frameIndex = Math.min(Math.floor(enemy.animTime * ANIMATION_DEFS.LunchLady.KnockDown.fps), frames.length - 1);
    enemy.vx *= 0.9; enemy.vy += GRAVITY * dt; enemy.x += enemy.vx * dt; enemy.y += enemy.vy * dt; resolveEntityCollisions(enemy); enemy.x = clamp(enemy.x, 70, worldWidth - 70);
    const duration = frames.length / ANIMATION_DEFS.LunchLady.KnockDown.fps;
    if (enemy.animTime >= duration) { enemy.state = "Walk"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.vx = 0; enemy.vy = 0; enemy.onGround = true; enemy.hitCounter = 0; enemy.attackCooldown = Math.max(enemy.attackCooldown, COMBAT.enemies.LunchLady.standUpAttackCooldown); }
  }

  function startLunchLadyDeath(enemy) {
    enemy.defeated = true; enemy.alive = false; enemy.state = "Death"; enemy.animTime = 0; enemy.frameIndex = 0; enemy.vx = 0; enemy.vy = 0; enemy.onGround = true; enemy.deathTimer = 0;
    if (enemy.stage === 2 && potState === "idle" && potStartDelay <= 0) {
      potStartDelay = POT_START_DELAY_AFTER_LUNCH_LADY_DEATH;
    }
  }


  function updateEnemyDeath(enemy, dt) {
    const frames = animations?.[enemy.type]?.Death ?? [];
    if (!frames.length) { enemy.removed = true; return; }

    enemy.deathTimer += dt;
    enemy.animTime   += dt;
    enemy.vx          = 0;
    enemy.vy          = 0;
    enemy.onGround    = true;
    enemy.frameIndex  = Math.min(
      Math.floor(enemy.animTime * ANIMATION_DEFS[enemy.type].Death.fps),
      frames.length - 1,
    );

    if (enemy.deathTimer >= ENEMY_DEATH_HOLD_DURATION + ENEMY_DEATH_FADE_DURATION) {
      enemy.removed = true;
    }
  }

  // ============================================================
  // Combat
  // ============================================================

  function triggerScreenShake(duration, strength) {
    screenShakeTime     = Math.max(screenShakeTime,     duration);
    screenShakeStrength = Math.max(screenShakeStrength, strength);
  }

  function damagePlayer(amount, pushDirection, reaction = "KnockBack") {
    if (!player.alive || player.damageCooldown > 0) return false;

    player.health         = Math.max(0, player.health - amount);
    player.damageCooldown = PLAYER_DAMAGE_COOLDOWN;
    player.hitFlash       = PLAYER_HIT_FLASH_DURATION;

    if (player.health <= 0) player.alive = false;

    if (reaction === "KnockDown") { startPlayerKnock("KnockDown", true, pushDirection); return true; }
    startPlayerKnock("KnockBack", true, pushDirection);
    return true;
  }

  function didCrossAnimationFrame(prevIdx, currIdx, targetIdx) {
    return prevIdx < targetIdx && currIdx >= targetIdx;
  }

  function tryDamagePlayerFromAttack(enemy, attackKind, amount, reaction) {
    if (!player.alive) return { landed: false, reason: "invalid-target" };
    const attackBox = getAttackBox(enemy, attackKind);
    if (!intersects(attackBox, getBodyBox(player))) return { landed: false, reason: "missed-overlap" };
    const pushDirection = Math.sign(player.x - enemy.x) || -enemy.facing || 1;
    const landed = damagePlayer(amount, pushDirection, reaction);
    return {
      landed,
      reason: landed ? "landed" : "blocked-cooldown",
    };
  }

  function damageEnemy(enemy, amount, pushDirection) {
    if (
      enemy.removed ||
      enemy.damageCooldown > 0 ||
      enemy.state === "KnockDown" ||
      enemy.state === "GroundedKnockDown" ||
      enemy.state === "Death" ||
      enemy.state === "Entrance"
    ) return;

    if (isBossAttackProtectedFromPlayerHit(enemy)) return;

    // Boss super armor: immune to damage, absorb the hit.
    if (
      (enemy.type === "Ward" && enemy.superArmor > 0) ||
      (enemy.type === "LunchLady" && enemy.stage === 2 && enemy.superArmor > 0)
    ) {
      const balance = COMBAT.enemies[enemy.type];
      enemy.damageCooldown = balance.superArmorDamageCooldown ?? balance.damageCooldown;
      return;
    }

    if (enemy.invincible) return;

    if (enemy.type === "PizzaMonster") {
      damagePizzaMonster(enemy);
      return;
    }

    if (enemy.type === "Satan") {
      damageSatan(enemy, amount, pushDirection);
      return;
    }

    if (enemy.type === "SatanEvolution") {
      damageSatanEvolution(enemy, amount);
      return;
    }

    const previousHealth  = enemy.health;
    const balance         = COMBAT.enemies[enemy.type] ?? {};
    enemy.health          = Math.max(0, enemy.health - amount);
    enemy.damageCooldown  = balance.damageCooldown ?? 0.2;
    enemy.hitFlash        = balance.hitFlashDuration ?? 0.18;
    enemy.stunTime        = 0;
    enemy.attackCooldown  = Math.max(enemy.attackCooldown ?? 0, balance.interruptAttackCooldown ?? 0);

    if (enemy.type === "Ward") {
      enemy.hitCounter = (enemy.hitCounter || 0) + 1;

      const crossedMilestone =
        COMBAT.getWardKnockdownThresholds(enemy.maxHealth)
          .some((threshold) => previousHealth > threshold && enemy.health <= threshold);

      if (enemy.health <= 0 || crossedMilestone) {
        if (enemy.health <= 0) registerEnemyKill(enemy);
        startKnockDown(enemy, pushDirection, enemy.health <= 0);
      } else if (enemy.hitCounter >= 3) {
        enemy.hitCounter = 0;
        enemy.superArmor = 1.0;
        enemy.slamCooldown = 0;
        startWardSlam(enemy);
        screenShakeTime = 0.15;
        screenShakeStrength = 4;
      } else {
        startWardKnockBack(enemy, pushDirection);
      }
      return;
    }

    if (enemy.type === "MeatballMonster") {
      if (enemy.health <= 0) {
        registerEnemyKill(enemy);
        startMeatballDeath(enemy);
      } else {
        startMeatballKnockBack(enemy, pushDirection);
      }
      return;
    }

    if (enemy.type === "LunchLady" && enemy.stage === 2) {
      enemy.hitCounter = (enemy.hitCounter || 0) + 1;
      if (enemy.health <= 0) {
        registerEnemyKill(enemy);
        startLunchLadyDeath(enemy);
      } else if (enemy.hitCounter >= 3) {
        enemy.hitCounter = 0;
        enemy.superArmor = COMBAT.enemies.LunchLady.superArmorDuration;
        enemy.slamCooldown = 0;
        startLunchLadySlam(enemy);
        triggerScreenShake(COMBAT.enemies.LunchLady.counterSlamShakeDuration, COMBAT.enemies.LunchLady.counterSlamShakeStrength);
      } else {
        startLunchLadyKnockBack(enemy, pushDirection);
      }
      return;
    }


    if (enemy.type === "Demon" || enemy.type === "DemonRanged") {
      if (enemy.health <= 0) {
        registerEnemyKill(enemy);
        enemy.alive = false;
        enemy.defeated = true;
        enemy.state = "Death";
        enemy.animTime = 0;
        enemy.frameIndex = 0;
        enemy.deathTimer = 0;
        enemy.deathGrounded = false;
        enemy.vx = 0;
        enemy.vy = 0;
      } else {
        enemy.state = "KnockBack";
        enemy.animTime = 0;
        enemy.frameIndex = 0;
        enemy.vx = pushDirection * 90;
        enemy.edgeResetDirection = 0;
      }
      return;
    }

    // Nurse
    if (enemy.health <= 0) registerEnemyKill(enemy);
    startKnockDown(enemy, pushDirection, enemy.health <= 0);
  }

  function damageSatan(enemy, amount, pushDirection) {
    if (enemy.entranceActive || enemy.healJumpActive) return;
    const previousHealth = enemy.health;
    enemy.health = Math.max(0, enemy.health - amount);
    enemy.damageCooldown = SATAN_COMBAT.damageCooldown ?? 0.2;
    enemy.hitFlash = SATAN_COMBAT.hitFlashDuration ?? 0.18;

    if (enemy.health <= 0) {
      startSatanEvolutionTransition(enemy);
      return;
    }
    if (maybeStartSatanHealJump(enemy, previousHealth)) return;

    enemy.hitCounter = (enemy.hitCounter || 0) + 1;
    if (enemy.hitCounter >= 3) {
      enemy.hitCounter = 0;
      startSatanReaction(enemy, "KnockDown", pushDirection);
    } else {
      startSatanReaction(enemy, "KnockBack", pushDirection);
    }
  }

  function damageSatanEvolution(enemy, amount) {
    if (enemy.invincible || enemy.transitionActive || enemy.state === "Cutscene" || enemy.state === "GroundedToFly") return;
    enemy.health = Math.max(0, enemy.health - amount);
    enemy.damageCooldown = SATAN_EVOLUTION_COMBAT.damageCooldown ?? 0.2;
    enemy.hitFlash = SATAN_EVOLUTION_COMBAT.hitFlashDuration ?? 0.18;

    if (enemy.health <= 0) {
      startSatanEvolutionDeath(enemy);
      return;
    }

    enemy.hitCounter = (enemy.hitCounter || 0) + 1;
    if (enemy.hitCounter >= (SATAN_EVOLUTION_COMBAT.knockDownHitThreshold ?? 3)) {
      enemy.hitCounter = 0;
      startEvolutionReaction(enemy);
    }
  }

  function isBossAttackProtectedFromPlayerHit(enemy) {
    if (!isBossAttackState(enemy)) return false;

    const totalFrames = getBossAttackTotalFrames(enemy);
    const interruptibleFrames = Math.max(1, Math.ceil(totalFrames * 0.25));
    return (enemy.frameIndex ?? 0) >= interruptibleFrames;
  }

  function isBossAttackState(enemy) {
    if (enemy.type === "Ward") {
      return enemy.state === "MeleeAttack" || enemy.state === "Slam";
    }

    if (enemy.type === "LunchLady" && enemy.stage === 2) {
      return (
        enemy.state === "MeleeAttack" ||
        enemy.state === "Slam" ||
        enemy.state === "ThrowMeatball"
      );
    }

    if (enemy.type === "PizzaMonster") {
      return enemy.state === "Grab" || enemy.state === "RangedMelee";
    }

    if (enemy.type === "Satan") {
      return enemy.state === "MeleeAttack" || enemy.state === "Grab";
    }

    if (enemy.type === "SatanEvolution") {
      return ["FlyMeleeAttack", "JumpSlam", "Summon", "GroundSlam"].includes(enemy.state);
    }

    return false;
  }

  function getBossAttackTotalFrames(enemy) {
    const animationFrames = animations?.[enemy.type]?.[enemy.state]?.length ?? 0;
    const definedFrames = ANIMATION_DEFS?.[enemy.type]?.[enemy.state]?.frameCount ?? 0;
    return Math.max(animationFrames, definedFrames, 1);
  }

  function damagePizzaMonster(enemy) {
    if (!enemy.alive || enemy.damageCooldown > 0) return;
    if (enemy.state === "Dazed") {
      enemy.health -= PIZZA_COMBAT.damageWhileDazed ?? 20;
      enemy.damageCooldown = PIZZA_COMBAT.damageCooldown ?? 0.2;
      enemy.hitFlash = PIZZA_COMBAT.hitFlashDuration ?? 0.18;
    } else {
      enemy.health -= PIZZA_COMBAT.damageWhileActive ?? 5;
      enemy.damageCooldown = PIZZA_COMBAT.damageCooldown ?? 0.2;
      enemy.hitFlash = PIZZA_COMBAT.hitFlashDuration ?? 0.18;
      enemy.hitCounter += 1;

      if (enemy.hitCounter >= (PIZZA_COMBAT.dazeHitThreshold ?? 5)) {
        enemy.state = "Dazed";
        enemy.animTime = 0;
        enemy.frameIndex = 0;
        enemy.dazeTimer = PIZZA_COMBAT.dazeDuration ?? 4.0;
        enemy.vx = 0;
      } else if (enemy.state === "Idle") {
        enemy.state = "Hitstun";
        enemy.animTime = 0;
        enemy.frameIndex = 0;
        enemy.vx = 0;
      }
    }

    if (enemy.health <= 0) {
      enemy.health = 0;
      startPizzaMonsterDeath(enemy);
    }
  }

  function startPizzaMonsterDeath(enemy) {
    registerEnemyKill(enemy);
    enemy.defeated = true;
    enemy.alive = false;
    enemy.state = "Death";
    enemy.animTime = 0;
    enemy.frameIndex = 0;
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.onGround = true;
    enemy.deathTimer = 0;
  }

  function checkPlayerMeleeHits() {
    if (player.recentHitIds.size > 0) return; // already hit one enemy this swing

    const attackBox = getAttackBox(player, "player");
    let closestEnemy = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.alive || enemy.state === "KnockDown" || enemy.removed || enemy.invincible) continue;
      if (intersects(attackBox, getBodyBox(enemy))) {
        const dist = Math.abs(enemy.x - player.x);
        if (dist < closestDist) {
          closestDist = dist;
          closestEnemy = enemy;
        }
      }
    }

    if (closestEnemy) {
      player.recentHitIds.add(closestEnemy.id);
      damageEnemy(closestEnemy, PLAYER_MELEE_DAMAGE, player.facing);
    }
  }

  function checkPlayerKickHits() {
    if (player.recentHitIds.size > 0) return; // single strong hit per kick

    const attackBox = getAttackBox(player, "player-kick");
    let closestEnemy = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.alive || enemy.state === "KnockDown" || enemy.removed || enemy.invincible) continue;
      if (intersects(attackBox, getBodyBox(enemy))) {
        const dist = Math.abs(enemy.x - player.x);
        if (dist < closestDist) {
          closestDist = dist;
          closestEnemy = enemy;
        }
      }
    }

    if (closestEnemy) {
      player.recentHitIds.add(closestEnemy.id);
      damageEnemy(closestEnemy, PLAYER_KICK_DAMAGE, player.facing);
    }
  }

  function checkPlayerJumpAttackHits() {
    // Sweep the whole cane arc: hit every enemy along the path, once each per swing.
    const attackBox = getAttackBox(player, "player-jump-attack");
    for (const enemy of enemies) {
      if (!enemy.alive || enemy.state === "KnockDown" || enemy.removed || enemy.invincible) continue;
      if (player.recentHitIds.has(enemy.id)) continue;
      if (intersects(attackBox, getBodyBox(enemy))) {
        player.recentHitIds.add(enemy.id);
        damageEnemy(enemy, PLAYER_JUMP_ATTACK_DAMAGE, player.facing);
      }
    }
  }

  // ============================================================
  // Projectiles & Effects
  // ============================================================

  function spawnProjectile() {
    projectiles.push({
      x: player.x + player.facing * 24,
      y: player.y - 58,
      vx: player.facing * 360,
      vy: -160,
      radius: 10,
      alive: true,
    });
  }

  function spawnColostomyExplosion(x, y) {
    effects.push({
      type:          "ColostomyExplosion",
      x, y,
      animTime:      0,
      frameIndex:    0,
      lingerTime:    0,
      slipTriggered: false,
      removed:       false,
    });
  }

  function updateProjectiles(dt) {
    for (const proj of projectiles) {
      if (!proj.alive) continue;
      proj.vy += GRAVITY * 0.65 * dt;
      proj.x  += proj.vx * dt;
      proj.y  += proj.vy * dt;

      const groundY = getGroundYAtX(proj.x);
      if (proj.y >= groundY - 4) {
        proj.alive = false;
        spawnColostomyExplosion(proj.x, groundY + 20);
        continue;
      }

      for (const enemy of enemies) {
        if (!enemy.alive || enemy.state === "KnockDown" || enemy.removed || enemy.invincible) continue;
        if (intersectsCircleRect(proj, getBodyBox(enemy))) {
          proj.alive = false;
          damageEnemy(enemy, PLAYER_COLOSTOMY_DIRECT_DAMAGE, player.facing);
        }
      }
    }
  }

  function launchLunchLadyMeatballProjectile(enemy, options = {}) {
    const sourceStage = options.sourceStage ?? enemy.stage ?? 1;
    const targetX = enemy.pendingMeatballTargetX ?? (sourceStage === 2 ? chooseLunchLadyStage2MeatballTargetX(enemy) : chooseLunchLadyMeatballTargetX(enemy));
    const targetY = getGroundYAtX(targetX);
    const start = getLunchLadyMeatballReleasePosition(enemy);
    const travelTime = LUNCH_LADY_MEATBALL_TRAVEL_TIME;
    const vx = (targetX - start.x) / travelTime;
    const vy = (targetY - start.y - 0.5 * LUNCH_LADY_MEATBALL_GRAVITY * travelTime * travelTime) / travelTime;
    lunchLadyMeatballs.push({
      x: start.x, y: start.y, vx, vy, angle: Math.atan2(vy, vx), targetX, targetY,
      gravity: LUNCH_LADY_MEATBALL_GRAVITY, radius: LUNCH_LADY_MEATBALL_HIT_RADIUS,
      ownerId: enemy.id, sourceStage, damage: sourceStage === 2 ? LUNCH_LADY_THROW_DAMAGE : 0,
      alive: true, elapsed: 0, travelTime,
    });
  }

  function getLunchLadyMeatballReleasePosition(enemy) {
    const metrics = getDrawMetrics(enemy, animations.LunchLady, ANIMATION_DEFS.LunchLady, CHAR.LunchLady.idleFallback, CHAR.LunchLady.targetHeight);
    if (!metrics) return { x: enemy.x, y: enemy.y - CHAR.LunchLady.targetHeight * 0.55 };
    const scaleX = metrics.width / metrics.sourceWidth;
    const scaleY = metrics.height / metrics.sourceHeight;
    const localX = (LUNCH_LADY_THROW_RELEASE_SOURCE_POINT.x - metrics.sourceX) * scaleX;
    const localY = (LUNCH_LADY_THROW_RELEASE_SOURCE_POINT.y - metrics.sourceY) * scaleY;
    const screenX = shouldFlipSpriteForFacing(enemy) ? metrics.anchorX - (metrics.flippedScreenX + localX) : metrics.screenX + localX;
    return { x: screenX + camera.x, y: metrics.screenY + localY };
  }

  function updateLunchLadyMeatballs(dt) {
    for (const projectile of lunchLadyMeatballs) {
      if (!projectile.alive) continue;
      projectile.elapsed += dt;
      projectile.vy += projectile.gravity * dt;
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.angle = Math.atan2(projectile.vy, projectile.vx);
      if (projectile.sourceStage === 2 && tryDamagePlayerFromLunchLadyMeatball(projectile)) {
        projectile.alive = false;
        continue;
      }
      if (projectile.y >= projectile.targetY || projectile.elapsed >= projectile.travelTime) {
        projectile.alive = false;
        spawnMeatballMonster(projectile.targetX, projectile.targetY, { facing: projectile.targetX < player.x ? 1 : -1 });
      }
    }
    for (let i = lunchLadyMeatballs.length - 1; i >= 0; i -= 1) {
      if (!lunchLadyMeatballs[i].alive) lunchLadyMeatballs.splice(i, 1);
    }
  }

  function tryDamagePlayerFromLunchLadyMeatball(projectile) {
    if (!player.alive || player.capture || !projectile.damage) return false;
    const hitCircle = { x: projectile.x, y: projectile.y, radius: projectile.radius ?? LUNCH_LADY_MEATBALL_HIT_RADIUS };
    if (!intersectsCircleRect(hitCircle, getBodyBox(player))) return false;
    const owner = enemies.find((enemy) => enemy.id === projectile.ownerId);
    const ownerX = owner?.x ?? projectile.x;
    const pushDirection = Math.sign(player.x - ownerX) || Math.sign(projectile.vx) || 1;
    return damagePlayer(projectile.damage, pushDirection, "KnockBack");
  }

  function updateEffects(dt) {
    const frames = animations?.Granny?.ColostomyExplosion ?? [];
    if (!frames.length) { effects.length = 0; return; }

    const def      = ANIMATION_DEFS.Granny.ColostomyExplosion;
    const duration = frames.length / def.fps;

    for (const effect of effects) {
      if (effect.removed || effect.type !== "ColostomyExplosion") continue;

      if (effect.animTime < duration) {
        effect.animTime  += dt;
        effect.frameIndex = Math.min(Math.floor(effect.animTime * def.fps), frames.length - 1);
        continue;
      }

      effect.frameIndex = frames.length - 1;
      if (!effect.slipTriggered) {
        const slipBox = getColostomySlipBox(effect, frames[frames.length - 1]);
        for (const enemy of enemies) {
          if (enemy.removed || !enemy.alive || enemy.invincible || enemy.state === "KnockDown" || enemy.state === "Death" || enemy.state === "Entrance") continue;
          if (!intersects(slipBox, getBodyBox(enemy))) continue;
          if (enemy.type === "SatanEvolution") {
            startEvolutionReaction(enemy);
          } else if (enemy.type === "Satan") {
            startSatanReaction(enemy, "KnockDown", enemy.facing || -1);
          } else if (enemy.type === "Demon" || enemy.type === "DemonRanged") {
            enemy.state = "KnockBack";
            enemy.animTime = 0;
            enemy.frameIndex = 0;
            enemy.vx = 0;
            enemy.attackCooldown = Math.max(enemy.attackCooldown || 0, 0.45);
          } else {
            startKnockDown(enemy, enemy.facing || -1, false);
          }
          effect.slipTriggered = true;
          effect.removed       = true;
          break;
        }
      }

      if (effect.removed) continue;
      effect.lingerTime += dt;
      if (effect.lingerTime >= COLOSTOMY_SPLAT_DURATION) effect.removed = true;
    }

    for (let i = effects.length - 1; i >= 0; i -= 1) {
      if (effects[i]?.removed) effects.splice(i, 1);
    }
  }

  function getColostomySlipBox(effect, frame) {
    const scale       = COLOSTOMY_EXPLOSION_TARGET_HEIGHT / frame.image.height;
    const width       = Math.round(frame.image.width * scale);
    const puddleWidth = Math.max(28, Math.round(width * 0.72));
    const puddleHeight = 22;
    return { x: effect.x - puddleWidth / 2, y: effect.y - puddleHeight, width: puddleWidth, height: puddleHeight };
  }

  // ============================================================
  // Physics & Collision
  // ============================================================

  function getRenderedSpriteBox(entity) {
    const drawable = getEnemyDrawable(entity);
    if (!drawable) return null;
    const metrics = getDrawMetrics(
      drawable.entity,
      drawable.animations,
      drawable.defs,
      drawable.idleFallback,
      drawable.targetHeight,
    );
    if (!metrics) return null;
    const screenX = shouldFlipSpriteForFacing(entity)
      ? metrics.anchorX - metrics.flippedScreenX - metrics.width
      : metrics.screenX;
    return {
      x: screenX + camera.x,
      y: metrics.screenY,
      width: metrics.width,
      height: metrics.height,
    };
  }

  function getPizzaRangedMeleeAttackBox(enemy) {
    const spriteBox = getRenderedSpriteBox(enemy);
    if (!spriteBox) return { x: enemy.x, y: enemy.y - enemy.height, width: 1, height: enemy.height };
    if (enemy.facing > 0) {
      const x = enemy.x;
      return {
        x,
        y: spriteBox.y,
        width: Math.max(1, spriteBox.x + spriteBox.width - x),
        height: spriteBox.height,
      };
    }
    const right = enemy.x;
    return {
      x: spriteBox.x,
      y: spriteBox.y,
      width: Math.max(1, right - spriteBox.x),
      height: spriteBox.height,
    };
  }

  function getAttackBox(entity, kind) {
    if (kind === "pizza-ranged-melee") return getPizzaRangedMeleeAttackBox(entity);

    if (kind === "player-kick") {
      const scale = GRANNY_SCALE;
      const width = Math.round(96 * scale);
      const height = Math.round(64 * scale);
      const x = entity.facing > 0
        ? entity.x + Math.round(20 * scale)
        : entity.x - Math.round(20 * scale) - width;
      const y = entity.y - height - Math.round(10 * scale);
      return { x, y, width, height };
    }

    if (kind === "player-jump-attack") {
      const scale = GRANNY_SCALE;
      const reach = Math.round(120 * scale);
      const overhead = Math.round(20 * scale);
      const top = entity.y - Math.round(entity.height * 1.7);
      const x = entity.facing > 0 ? entity.x - overhead : entity.x - reach;
      return { x, y: top, width: reach + overhead, height: entity.y - top };
    }

    let width = kind === "player" ? 52 : 48;
    let height = kind === "player" ? 44 : 42;
    let xOffset = 18;
    let yOffset = 20;

    if (kind === "ward-melee") { width = 78;  height = 58; xOffset = 24; yOffset = 26; }
    else if (kind === "ward-slam") { width = 112; height = 74; xOffset = 28; yOffset = 32; }
    else if (kind === "nurse-melee") { width = 36; height = 54; xOffset = 10; yOffset = 12; }
    else if (kind === "lunch-lady-melee") { width = 78; height = 58; xOffset = 24; yOffset = 26; }
    else if (kind === "lunch-lady-slam") { width = 112; height = 74; xOffset = 28; yOffset = 32; }
    else if (kind === "meatball-grab") { width = 72; height = 48; xOffset = 22; yOffset = 0; }
    else if (kind === "demon-melee") { width = 92; height = 82; xOffset = 18; yOffset = 14; }
    else if (kind === "satan-melee") { width = 110; height = 96; xOffset = 30; yOffset = 18; }
    else if (kind === "satan-grab") { width = 92; height = 105; xOffset = 18; yOffset = 8; }
    else if (kind === "satan-evolution-melee") { width = 132; height = 112; xOffset = 24; yOffset = 12; }

    if (kind === "player") {
      width   = Math.round(width   * GRANNY_SCALE);
      height  = Math.round(height  * GRANNY_SCALE);
      xOffset = Math.round(xOffset * GRANNY_SCALE);
      yOffset = Math.round(yOffset * GRANNY_SCALE);
      width   = Math.max(1, width - PLAYER_MELEE_HITBOX_WIDTH_REDUCTION);
    } else if (kind === "enemy" || kind === "nurse-melee") {
      width   = Math.round(width   * NURSE_SCALE * NURSE_VISUAL_WIDTH_MULTIPLIER);
      height  = Math.round(height  * NURSE_SCALE * NURSE_VISUAL_HEIGHT_MULTIPLIER);
      xOffset = Math.round(xOffset * NURSE_SCALE * NURSE_VISUAL_WIDTH_MULTIPLIER);
      yOffset = Math.round(yOffset * NURSE_SCALE * NURSE_VISUAL_HEIGHT_MULTIPLIER);
    }

    const x = entity.facing > 0 ? entity.x + xOffset : entity.x - xOffset - width;
    return { x, y: entity.y - entity.height + yOffset, width, height };
  }

  function getBodyBox(entity) {
    if (entity.type === "Granny") {
      return {
        x: entity.x - entity.width / 2 - GRANNY_BODY_EXTRA_WIDTH / 2,
        y: entity.y - entity.height - GRANNY_BODY_EXTRA_HEIGHT_TOP,
        width: entity.width + GRANNY_BODY_EXTRA_WIDTH,
        height: entity.height + GRANNY_BODY_EXTRA_HEIGHT_TOP,
      };
    }

    if (entity.type === "Ward") {
      const width = entity.width + 30;
      const height = entity.height * 2.5;
      return {
        x: entity.x - width / 2,
        y: entity.y - height,
        width,
        height,
      };
    }

    if (entity.type === "MeatballMonster") {
      return {
        x: entity.x - entity.width / 2 + 20,
        y: entity.y - entity.height,
        width: Math.max(1, entity.width - 20),
        height: entity.height,
      };
    }

    if (entity.type === "PizzaMonster") {
      const m = getPizzaSizeMultiplier(entity);
      const width = entity.width * m * 2;
      const height = entity.height * m * 2;
      return { x: entity.x - width / 2, y: entity.y - height, width, height };
    }

    if (entity.type === "Demon" || entity.type === "DemonRanged") {
      const width = entity.width * 1.2;
      const height = entity.height * 1.35;
      return { x: entity.x - width / 2, y: entity.y - height * 0.82, width, height };
    }

    if (entity.type === "Satan") {
      const width = entity.width * 1.55;
      const height = entity.height * 1.75;
      return { x: entity.x - width / 2, y: entity.y - height, width, height };
    }

    if (entity.type === "SatanEvolution") {
      const width = entity.width * 1.9;
      const height = entity.height * 2.15;
      return { x: entity.x - width / 2, y: entity.y - height * 0.92, width, height };
    }

    return { x: entity.x - entity.width / 2, y: entity.y - entity.height, width: entity.width, height: entity.height };
  }

  function canEnemyAttackPlayer(enemy, attackKind) {
    if (!player.alive || player.capture || enemy.attackCooldown > 0) return false;

    const attackBox = getAttackBox(enemy, attackKind);
    const playerBody = getBodyBox(player);
    const verticalOverlap = Math.min(attackBox.y + attackBox.height, playerBody.y + playerBody.height) -
      Math.max(attackBox.y, playerBody.y);

    return verticalOverlap > 0 && intersects(attackBox, playerBody);
  }

  function resolveEntityCollisions(entity) {
    const groundY      = getGroundYAtX(entity.x);
    const closeToGround = Math.abs(entity.y - groundY) <= 18;
    entity.onGround = false;

    if (entity.vy >= 0 && (entity.y >= groundY || closeToGround)) {
      entity.y        = groundY;
      entity.vy       = 0;
      entity.onGround = true;
    }

    resolveBodyOverlaps(entity);
  }

  function resolveBodyOverlaps(entity) {
    if (entity.removed || !entity.alive) return;

    for (const other of getCollisionPeers(entity)) {
      if (other.removed || !other.alive || entity.nonColliding || other.nonColliding) continue;
      if (shouldSkipBodyCollision(entity, other)) continue;

      const box      = getBodyBox(entity);
      const otherBox = getBodyBox(other);
      if (!intersects(box, otherBox)) continue;

      const overlapLeft  = box.x + box.width - otherBox.x;
      const overlapRight = otherBox.x + otherBox.width - box.x;
      const overlapX     = Math.min(overlapLeft, overlapRight);
      const direction    = box.x + box.width / 2 < otherBox.x + otherBox.width / 2 ? -1 : 1;
      const allowedOverlap = entity.type === "MeatballMonster" && other.type === "MeatballMonster"
        ? MEATBALL_MONSTER_ALLOWED_OVERLAP_X
        : 0;
      if (overlapX <= allowedOverlap) continue;
      const push         = overlapX - allowedOverlap + BODY_SEPARATION_GAP;

      if (shouldRedirectForwardPlayerPushToEnemy(entity, other, direction)) {
        other.x -= direction * push;
        if (other.vx * direction > 0) other.vx = 0;
        continue;
      }

      entity.x += direction * push;
      if (entity.vx * direction < 0) entity.vx = 0;
    }
  }

  function shouldRedirectForwardPlayerPushToEnemy(entity, other, direction) {
    return entity === player && direction > 0 && !isBossCollisionMover(other);
  }

  function isBossCollisionMover(entity) {
    return (
      entity?.type === "Ward" ||
      (entity?.type === "LunchLady" && entity.stage === 2) ||
      entity?.type === "PizzaMonster" ||
      entity?.type === "Satan" ||
      entity?.type === "SatanEvolution"
    );
  }

  function shouldSkipBodyCollision(entity, other) {
    const enemy = entity === player ? other : other === player ? entity : null;
    if (enemy?.type === "Demon" || enemy?.type === "DemonRanged") return true;
    if (enemy?.type === "SatanEvolution" && (
      enemy.airborne ||
      enemy.state === "FlyMeleeAttack" ||
      enemy.state === "JumpSlam" ||
      enemy.state === "GroundedRunCommit"
    )) return true;
    if ((entity === player || other === player) && isPizzaMonsterLeaping(entity === player ? other : entity)) return true;
    return (entity === player || other === player) && canPlayerClipThroughEnemies();
  }

  function isPizzaMonsterLeaping(entity) {
    return entity?.type === "PizzaMonster" && (
      entity.state === "GroundLeapStart" ||
      entity.state === "Leap" ||
      entity.state === "LeapLand"
    );
  }

  function canPlayerClipThroughEnemies() {
    return player.state === "Jump" && !player.onGround;
  }

  function getCollisionPeers(entity) {
    if (entity === player) return enemies;
    if (entity.type === "MeatballMonster") return [player, ...enemies.filter((other) => other !== entity && other.type === "MeatballMonster")];
    return [player];
  }

  function getGroundYAtX(x) {
    const progress = clamp(
      (x - floorPath.nearX) / (floorPath.farX - floorPath.nearX),
      0, 1,
    );
    return Math.round(floorPath.nearY + (floorPath.farY - floorPath.nearY) * progress);
  }

  function updateCamera() {
    camera.x = 0;
  }

  // ============================================================
  // Rendering
  // ============================================================

  function draw() {
    ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    const shake = getScreenShakeOffset();
    ctx.save();
    ctx.translate(shake.x, shake.y);
    drawBackdrop();
    drawWardEntranceHellHoleFrame();
    drawKitchenPot();
    drawPizzaGoo();
    drawPizzaGooProjectiles();
    drawProjectiles();
    drawDemonRangedArrows();
    drawEffects();
    drawCharacters();
    drawWardEntranceFallingGranny();
    drawWardEntranceHoleForeground();
    drawHellHallwayEntryGranny();
    drawLunchLadyMeatballs();
    drawHud();
    ctx.restore();
    drawSceneFadeOverlay();
  }

  function getScreenShakeOffset() {
    if (screenShakeTime <= 0 || screenShakeStrength <= 0) return { x: 0, y: 0 };
    return {
      x: Math.round((Math.random() * 2 - 1) * screenShakeStrength),
      y: Math.round((Math.random() * 2 - 1) * screenShakeStrength),
    };
  }

  function drawBackdrop() {
    if (sceneBackground) {
      if (currentScene?.backgroundFit === "cover") {
        drawCoverBackground(sceneBackground);
        return;
      }
      ctx.drawImage(sceneBackground, 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
      return;
    }
    const fallback = ctx.createLinearGradient(0, 0, 0, VIEWPORT_HEIGHT);
    fallback.addColorStop(0,    "#4c7fd4");
    fallback.addColorStop(0.55, "#8bb2f0");
    fallback.addColorStop(1,    "#d6e5ff");
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }

  function drawCoverBackground(image) {
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const scale = Math.max(VIEWPORT_WIDTH / sourceWidth, VIEWPORT_HEIGHT / sourceHeight);
    const croppedWidth = VIEWPORT_WIDTH / scale;
    const croppedHeight = VIEWPORT_HEIGHT / scale;
    const sourceX = (sourceWidth - croppedWidth) / 2;
    const sourceY = (sourceHeight - croppedHeight) / 2;
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      croppedWidth,
      croppedHeight,
      0,
      0,
      VIEWPORT_WIDTH,
      VIEWPORT_HEIGHT,
    );
  }

  function drawWardEntranceHellHoleFrame() {
    if (!shouldDrawWardEntrancePlayerProxy()) return;
    const frame = hellHoleFrames?.[wardEntranceSequence.frameIndex] ?? hellHoleFrames?.[hellHoleFrames.length - 1];
    if (!frame) return;
    ctx.drawImage(frame, 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }

  function drawWardEntranceFallingGranny() {
    if (!shouldDrawWardEntrancePlayerProxy()) return;

    const fallProgress = getWardEntranceFallProgress();
    const eased = fallProgress * fallProgress;
    const proxyState = fallProgress > 0.08 ? "KnockDown" : "Idle";
    const proxyFrames = animations?.Granny?.[proxyState] ?? [];
    const proxyFrameIndex = proxyState === "KnockDown"
      ? Math.min(Math.floor(fallProgress * Math.max(proxyFrames.length, 1)), Math.max(proxyFrames.length - 1, 0))
      : 0;
    const alpha = 1 - clamp((fallProgress - 0.48) / 0.52, 0, 1);
    const proxy = {
      ...player,
      x: wardEntranceSequence.playerX + Math.sin(eased * Math.PI) * 8,
      y: wardEntranceSequence.playerY + eased * HELL_HOLE_FALL_DISTANCE,
      vx: 0,
      vy: 0,
      facing: wardEntranceSequence.playerFacing,
      state: proxyState,
      frameIndex: proxyFrameIndex,
      animTime: 0,
      scriptedDrawAlpha: alpha,
      removed: false,
    };

    drawEntity({
      entity: proxy,
      label: "Granny",
      animations: animations.Granny,
      defs: ANIMATION_DEFS.Granny,
      idleFallback: CHAR.Granny.idleFallback,
      targetHeight: CHAR.Granny.targetHeight * (1 - (1 - HELL_HOLE_FALL_SCALE_END) * eased),
      rotation: proxy.facing * HELL_HOLE_FALL_ROTATION * eased,
    });
  }

  function drawWardEntranceHoleForeground() {
    if (!shouldDrawWardEntrancePlayerProxy()) return;
    const fallProgress = getWardEntranceFallProgress();
    if (fallProgress <= 0.12) return;
    const x = Math.round(wardEntranceSequence.holeX - camera.x);
    const y = Math.round(wardEntranceSequence.holeY + 12);
    ctx.save();
    ctx.globalAlpha = clamp((fallProgress - 0.12) / 0.24, 0, 1) * 0.82;
    ctx.fillStyle = "rgba(6, 5, 8, 0.95)";
    ctx.beginPath();
    ctx.ellipse(x, y, 86, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function getWardEntranceFallProgress() {
    if (!wardEntranceSequence) return 0;
    if (wardEntranceSequence.phase === "fadeOut" || wardEntranceSequence.phase === "loading") return 1;
    return clamp(
      (wardEntranceSequence.time - HELL_HOLE_FALL_START_TIME) / HELL_HOLE_FALL_DURATION,
      0,
      1,
    );
  }

  function drawHellHallwayEntryGranny() {
    if (!hellHallwayEntrySequence || hellHallwayEntrySequence.phase === "waitingFadeIn") return;

    const knockDownFrames = animations?.Granny?.KnockDown ?? [];
    const frameCount = Math.max(knockDownFrames.length, 1);
    let progress = 0;
    let x = hellHallwayEntrySequence.targetX;
    let y = hellHallwayEntrySequence.targetY;
    let frameRatio = HELL_HALLWAY_ENTRY_STAND_START_RATIO;
    let scaleMultiplier = 0.92;
    let rotation = HELL_HOLE_FALL_ROTATION;

    if (hellHallwayEntrySequence.phase === "falling") {
      progress = clamp(hellHallwayEntrySequence.time / HELL_HALLWAY_ENTRY_FALL_DURATION, 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      x = hellHallwayEntrySequence.startX + (hellHallwayEntrySequence.targetX - hellHallwayEntrySequence.startX) * eased;
      y = hellHallwayEntrySequence.startY + (hellHallwayEntrySequence.targetY - hellHallwayEntrySequence.startY) * eased;
      frameRatio = HELL_HALLWAY_ENTRY_STAND_START_RATIO * eased;
      scaleMultiplier = 0.72 + 0.28 * eased;
      rotation = HELL_HOLE_FALL_ROTATION * (1 - eased * 0.4);
    } else if (hellHallwayEntrySequence.phase === "standing") {
      progress = clamp(hellHallwayEntrySequence.time / HELL_HALLWAY_ENTRY_STAND_DURATION, 0, 1);
      x = hellHallwayEntrySequence.targetX;
      y = hellHallwayEntrySequence.targetY;
      frameRatio = HELL_HALLWAY_ENTRY_STAND_START_RATIO + (1 - HELL_HALLWAY_ENTRY_STAND_START_RATIO) * progress;
      scaleMultiplier = 1;
      rotation = HELL_HOLE_FALL_ROTATION * (1 - progress);
    }

    const proxy = {
      ...player,
      x,
      y,
      vx: 0,
      vy: 0,
      facing: hellHallwayEntrySequence.facing,
      state: "KnockDown",
      frameIndex: Math.min(Math.floor(frameRatio * (frameCount - 1)), frameCount - 1),
      animTime: 0,
      scriptedDrawAlpha: 1,
      removed: false,
    };

    drawEntity({
      entity: proxy,
      label: "Granny",
      animations: animations.Granny,
      defs: ANIMATION_DEFS.Granny,
      idleFallback: CHAR.Granny.idleFallback,
      targetHeight: CHAR.Granny.targetHeight * scaleMultiplier,
      rotation: proxy.facing * rotation,
    });
  }

  function drawSceneFadeOverlay() {
    if (!sceneFade || sceneFade.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = clamp(sceneFade.alpha, 0, 1);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    ctx.restore();
  }

  function drawProjectiles() {
    for (const proj of projectiles) {
      if (!proj.alive) continue;
      const x = Math.round(proj.x - camera.x);
      const y = Math.round(proj.y);
      ctx.fillStyle   = "#f3e8a6";
      ctx.beginPath();
      ctx.arc(x, y, proj.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#9a7d33";
      ctx.lineWidth   = 2;
      ctx.stroke();
    }
  }

  function drawEffects() {
    const frames = animations?.Granny?.ColostomyExplosion;
    if (!frames?.length) return;

    for (const effect of effects) {
      if (effect.removed || effect.type !== "ColostomyExplosion") continue;
      const frame = frames[effect.frameIndex] ?? frames[frames.length - 1];
      if (!frame?.image) continue;
      const scale   = COLOSTOMY_EXPLOSION_TARGET_HEIGHT / frame.image.height;
      const width   = Math.round(frame.image.width  * scale);
      const height  = Math.round(frame.image.height * scale);
      const screenX = Math.round(effect.x - camera.x - width / 2);
      const screenY = Math.round(effect.y - height);
      ctx.drawImage(frame.image, screenX, screenY, width, height);
    }
  }

  function drawCharacters() {
    const capturingEnemy = getCapturingEnemy();
    const drawPlayerNormally = (!player.capture || !capturingEnemy) && !shouldHideNormalPlayer();
    const drawables = [
      ...(drawPlayerNormally ? [{
        entity:       player,
        label:        "Granny",
        animations:   animations.Granny,
        defs:         ANIMATION_DEFS.Granny,
        idleFallback: CHAR.Granny.idleFallback,
        targetHeight: CHAR.Granny.targetHeight,
        barColor:     CHAR.Granny.barColor,
        healthBarWidth: CHAR.Granny.healthBarWidth,
      }] : []),
      ...enemies.map(getEnemyDrawable),
    ];

    drawables.sort((a, b) => a.entity.y - b.entity.y);

    for (const drawable of drawables) {
      if (drawable.entity.removed) continue;
      const metrics = drawEntity(drawable);
      if (drawable.entity.type === "LunchLady" && drawable.entity.stage !== 2) drawCafeteriaCounterForeground();
      if (capturingEnemy && drawable.entity === capturingEnemy) drawCapturedGranny(capturingEnemy);
      if (shouldDrawHealthBar(drawable.entity)) {
        drawHealthBar(drawable.entity, metrics, drawable.barColor, drawable.healthBarWidth);
      }
    }
  }

  function drawCapturedGranny(enemy) {
    const pose = enemy.type === "Satan" ? getSatanGrabPose(enemy) : getMeatballGrabCapturePose(enemy);
    const captureScale = pose.targetHeight / CHAR.Granny.targetHeight;
    const proxy = {
      ...player,
      x: pose.x,
      y: pose.y,
      vx: 0,
      vy: 0,
      width: Math.round(player.width * captureScale),
      height: Math.round(player.height * captureScale),
      facing: pose.facing,
      state: "KnockBack",
      frameIndex: pose.frameIndex,
      animTime: 0,
      removed: false,
    };
    drawEntity({
      entity: proxy,
      label: "Granny",
      animations: animations.Granny,
      defs: ANIMATION_DEFS.Granny,
      idleFallback: CHAR.Granny.idleFallback,
      targetHeight: pose.targetHeight,
      rotation: pose.rotation,
    });
  }

  function shouldDrawHealthBar(entity) {
    if (entity === player && entity.state === "Death") return false;
    if (entity.type === "LunchLady" && entity.stage !== 2) return false;
    if (entity.type === "MeatballMonster" && entity.state === "Spawn") return false;
    if (entity.type === "SatanEvolution" && entity.state === "Cutscene") return false;
    return !(entity.type === "Ward" && entity.state === "Entrance" && !entity.entranceLanded);
  }

  function getEnemyDrawable(enemy) {
    const label = enemy.type;
    return {
      entity:       enemy,
      label,
      animations:   animations[label],
      defs:         ANIMATION_DEFS[label],
      idleFallback: CHAR[label].idleFallback,
      targetHeight: CHAR[label].targetHeight,
      barColor:     CHAR[label].barColor,
      healthBarWidth: CHAR[label].healthBarWidth,
    };
  }

  function drawEntity({ entity, animations: animationSet, defs, idleFallback, targetHeight, rotation = 0 }) {
    const metrics = getDrawMetrics(entity, animationSet, defs, idleFallback, targetHeight);
    if (!metrics) return null;

    ctx.save();
    ctx.globalAlpha *= metrics.alpha;

    if (rotation) {
      ctx.translate(metrics.anchorX, metrics.screenY + metrics.height / 2);
      ctx.rotate(rotation);
      ctx.translate(-metrics.anchorX, -(metrics.screenY + metrics.height / 2));
    }

    // Gold-tint flashing during boss super armor (alternates every ~100ms)
    const superArmorActive = (
      ((entity.type === "Ward" || (entity.type === "LunchLady" && entity.stage === 2)) &&
        (entity.superArmor || 0) > 0) ||
      (entity.type === "Satan" && entity.healJumpActive)
    );
    const wardGoldFrame = superArmorActive && Math.floor(performance.now() / 100) % 2 === 0;

    if (entity.hitFlash > 0) {
      ctx.globalAlpha = 0.88;
      ctx.filter = "brightness(1.18)";
    } else if (wardGoldFrame) {
      ctx.filter = "sepia(0.8) saturate(2.5) brightness(1.2)";
    }

    if (shouldFlipSpriteForFacing(entity)) {
      ctx.translate(metrics.anchorX, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(metrics.frame.image, metrics.sourceX, metrics.sourceY, metrics.sourceWidth, metrics.sourceHeight,
        metrics.flippedScreenX, metrics.screenY, metrics.width, metrics.height);
    } else {
      ctx.drawImage(metrics.frame.image, metrics.sourceX, metrics.sourceY, metrics.sourceWidth, metrics.sourceHeight,
        metrics.screenX, metrics.screenY, metrics.width, metrics.height);
    }

    ctx.restore();
    return metrics;
  }

  function drawCafeteriaCounterForeground() {
    if (!sceneBackground || currentScene?.id !== "cafeteria-lunch-lady-s1") return;
    const sourceX = LUNCH_LADY_COUNTER_FOREGROUND.x * (sceneBackground.width / VIEWPORT_WIDTH);
    const sourceY = LUNCH_LADY_COUNTER_FOREGROUND.y * (sceneBackground.height / VIEWPORT_HEIGHT);
    const sourceWidth = LUNCH_LADY_COUNTER_FOREGROUND.width * (sceneBackground.width / VIEWPORT_WIDTH);
    const sourceHeight = LUNCH_LADY_COUNTER_FOREGROUND.height * (sceneBackground.height / VIEWPORT_HEIGHT);
    ctx.drawImage(
      sceneBackground,
      sourceX, sourceY, sourceWidth, sourceHeight,
      LUNCH_LADY_COUNTER_FOREGROUND.x, LUNCH_LADY_COUNTER_FOREGROUND.y,
      LUNCH_LADY_COUNTER_FOREGROUND.width, LUNCH_LADY_COUNTER_FOREGROUND.height,
    );
  }

  function drawLunchLadyMeatballs() {
    const frame = animations?.LunchLadyProjectile?.Meatball?.[0];
    if (!frame?.image) return;
    for (const projectile of lunchLadyMeatballs) {
      if (!projectile.alive) continue;
      const bounds = frame.bounds?.width ? frame.bounds : { x: 0, y: 0, width: frame.image.width, height: frame.image.height };
      const scale = LUNCH_LADY_MEATBALL_TARGET_HEIGHT / bounds.height;
      const width = Math.round(bounds.width * scale);
      const height = Math.round(bounds.height * scale);
      const screenX = Math.round(projectile.x - camera.x);
      const screenY = Math.round(projectile.y);
      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate(projectile.angle || 0);
      ctx.scale(LUNCH_LADY_MEATBALL_FLIGHT_SCALE_X, LUNCH_LADY_MEATBALL_FLIGHT_SCALE_Y);
      ctx.drawImage(frame.image, bounds.x, bounds.y, bounds.width, bounds.height, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
  }

  function drawHealthBar(entity, metrics, color, fixedBarWidth) {
    if (!metrics || entity.removed || (!entity.alive && entity !== player)) return;
    const barWidth  = fixedBarWidth;
    const barHeight = 7;
    const barX      = Math.round(metrics.anchorX - barWidth / 2);
    const barY      = metrics.healthBarY;
    const ratio     = clamp(entity.health / entity.maxHealth, 0, 1);

    ctx.fillStyle = "rgba(8, 12, 20, 0.75)";
    ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = color;
    ctx.fillRect(barX, barY, Math.max(0, Math.round(barWidth * ratio)), barHeight);
  }

  function drawHud() {
    if (isWardEntranceSetPieceActive() || isHellHallwayEntryActive()) return;

    drawThrowCooldownChip(22, 18);

    if (paused && !optionsOverlayOpen && !gameCompleteShown && !gameOverShown) {
      ctx.fillStyle = "rgba(5, 10, 18, 0.56)";
      ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
      ctx.fillStyle = "#edf4ff";
      ctx.font      = "bold 34px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Paused", VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 - 6);
      ctx.font      = "16px sans-serif";
      ctx.fillStyle = "#b7c7dd";
      ctx.fillText("Press P to resume", VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 + 24);
      ctx.textAlign = "start";
    }
  }

  function drawThrowCooldownChip(x, y) {
    const width = 154;
    const height = 42;
    const pad = 8;
    const cooldown = player.colostomyCooldown;
    const ready = cooldown <= 0;
    const progress = ready ? 1 : 1 - clamp(cooldown / PLAYER_COLOSTOMY_COOLDOWN, 0, 1);

    ctx.save();
    ctx.fillStyle = player.colostomyReadyFlash > 0 ? "rgba(70, 52, 18, 0.9)" : "rgba(6, 12, 21, 0.76)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = ready ? "#facc15" : "rgba(148, 163, 184, 0.62)";
    ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

    ctx.fillStyle = ready ? "#fff7ad" : "#94a3b8";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(ready ? "K THROW READY" : `K THROW ${cooldown.toFixed(1)}s`, x + pad, y + 17);

    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(x + pad, y + height - 14, width - pad * 2, 6);
    ctx.fillStyle = ready ? "#facc15" : "#38bdf8";
    ctx.fillRect(x + pad, y + height - 14, Math.round((width - pad * 2) * progress), 6);
    ctx.restore();
  }

  // ============================================================
  // Draw Metrics Helpers
  // ============================================================

  function getDrawMetrics(entity, animationSet, defs, idleFallback, targetHeight) {
    const { frame, stateName } = getEntityFrame(entity, animationSet, idleFallback);
    if (!frame) return null;

    const def              = defs[stateName] || defs[idleFallback];
    const sourceBounds     = getFrameDrawBounds(entity, frame, stateName);
    const targetScaleHeight = getFrameTargetHeight(entity, targetHeight, stateName);
    const scaleHeight      = getFrameScaleHeight(entity, frame, stateName, sourceBounds);
    const scale            = targetScaleHeight / scaleHeight;
    const visualScale      = getCharacterVisualScale(entity);
    const baseSourceWidth  = Math.round(sourceBounds.width  * scale);
    const baseSourceHeight = Math.round(sourceBounds.height * scale);
    const baseWidth        = Math.round(baseSourceWidth  * visualScale.x);
    const baseHeight       = Math.round(baseSourceHeight * visualScale.y);
    const anchorX          = Math.round(entity.x - camera.x + (def.offsetX ?? 0) * scale);
    const visualOffsetX    = getFrameVisualOffsetX(entity, stateName, scale);
    const baseScreenX      = getAnchoredFrameX(anchorX, frame, sourceBounds, scale) - (baseWidth - baseSourceWidth) / 2 + visualOffsetX;
    const baseFlippedScreenX = getFlippedFrameX(frame, sourceBounds, scale) - (baseWidth - baseSourceWidth) / 2 - visualOffsetX;
    const anchorHeight     = getFrameAnchorHeight(entity, frame, stateName, sourceBounds);
    const scriptedDrawOffsetY = Number.isFinite(entity.scriptedDrawOffsetY) ? entity.scriptedDrawOffsetY : 0;
    const baseScreenY      = entity.y - anchorHeight * scale * visualScale.y + (def.offsetY ?? 0) * scale + scriptedDrawOffsetY;
    const poseEffect       = getFramePoseDrawEffect(entity, frame, stateName);
    const deathEffect      = getEnemyDeathDrawEffect(entity);
    const scriptedAlpha    = Number.isFinite(entity.scriptedDrawAlpha) ? entity.scriptedDrawAlpha : 1;
    const drawScale        = poseEffect.scale * deathEffect.scale;
    const width            = Math.round(baseWidth  * drawScale);
    const height           = Math.round(baseHeight * drawScale);
    const screenX          = Math.round(baseScreenX          + (baseWidth - width) / 2);
    const flippedScreenX   = Math.round(baseFlippedScreenX   + (baseWidth - width) / 2);
    const screenY          = Math.round(baseScreenY          + (baseHeight - height));
    const opaqueTopY       = baseScreenY + (((frame.bounds?.y ?? sourceBounds.y) - sourceBounds.y) * scale * visualScale.y);
    const healthBarY       = getHealthBarY(entity, { baseScreenY, opaqueTopY, targetHeight, visualScale, screenY, scale });

    return {
      frame,
      stateName,
      sourceX:       sourceBounds.x,
      sourceY:       sourceBounds.y,
      sourceWidth:   sourceBounds.width,
      sourceHeight:  sourceBounds.height,
      width, height,
      screenX, flippedScreenX, screenY,
      anchorX, healthBarY,
      alpha: deathEffect.alpha * scriptedAlpha,
    };
  }

  function getHealthBarY(entity, metrics) {
    if (entity.type === "SatanEvolution") {
      const targetY = Math.round(entity.y - CHAR.SatanEvolution.targetHeight - 14);
      if (!Number.isFinite(entity.healthBarDisplayY) || Math.abs(entity.healthBarDisplayY - targetY) > 80) {
        entity.healthBarDisplayY = targetY;
      } else {
        entity.healthBarDisplayY += (targetY - entity.healthBarDisplayY) * (1 - Math.exp(-18 / 60));
      }
      return Math.round(entity.healthBarDisplayY);
    }
    if (entity.type === "DemonRanged") {
      return Math.round(metrics.opaqueTopY - DEMON_RANGED_HEALTH_BAR_GAP - 7);
    }
    if (entity.type === "LunchLady" && entity.stage === 2) {
      const referenceHeight = getLunchLadyStage2HealthBarReferenceHeight(metrics.targetHeight, metrics.visualScale);
      return Math.round(entity.y - referenceHeight - LUNCH_LADY_HEALTH_BAR_HEAD_GAP - 7);
    }
    if (entity.type === "MeatballMonster") return Math.round(entity.y - CHAR.MeatballMonster.targetHeight - MEATBALL_HEALTH_BAR_GAP);
    if (entity.type === "PizzaMonster") return Math.round(entity.y - metrics.targetHeight * getPizzaSizeMultiplier(entity) - 16);
    if (entity.type === "Ward") return Math.round(entity.y - metrics.targetHeight * metrics.visualScale.y - 16 - WARD_HEALTH_BAR_RAISE_Y);
    if (entity.type === "Granny" && entity.state === "JumpAttack") {
      const opaqueTop = GRANNY_JUMP_ATTACK_OPAQUE_TOP_Y[entity.frameIndex] ?? GRANNY_JUMP_ATTACK_OPAQUE_TOP_Y[0];
      return Math.round(metrics.screenY + opaqueTop * metrics.scale - 14);
    }
    return Math.round(entity.y - metrics.targetHeight * metrics.visualScale.y - 16);
  }

  function getLunchLadyStage2HealthBarReferenceHeight(targetHeight, visualScale) {
    const walkBounds = LUNCH_LADY_STAGE2_DRAW_BOUNDS.Walk;
    const walkTargetHeight = targetHeight * LUNCH_LADY_STAGE2_SIZE_MULTIPLIER;
    const walkScale = walkTargetHeight / LUNCH_LADY_STAGE2_CANONICAL_SCALE_HEIGHT;
    return walkBounds.height * walkScale * visualScale.y;
  }

  function getFramePoseDrawEffect(entity, frame, stateName) {
    if (entity.type === "Satan" && entity.entranceActive) {
      if (entity.entrancePhase === "jump" && stateName === "Jump") {
        const frameCount = Math.max(ANIMATION_DEFS.Satan.Jump.frameCount - 1, 1);
        const progress = clamp(entity.frameIndex / frameCount, 0, 1);
        const eased = progress * progress * (3 - 2 * progress);
        return { scale: 0.58 + eased * 0.42 };
      }
      if (["seated-hold", "seated-reverse", "pre-jump-idle"].includes(entity.entrancePhase)) return { scale: 0.58 };
    }
    return { scale: 1 };
  }

  function getCharacterVisualScale(entity) {
    if (entity.type === "Nurse") return { x: NURSE_VISUAL_WIDTH_MULTIPLIER, y: NURSE_VISUAL_HEIGHT_MULTIPLIER };
    return { x: 1, y: 1 };
  }

  function getEnemyDeathDrawEffect(entity) {
    if (entity === player && entity.state === "Death") {
      const deathFrames = animations?.Granny?.Death ?? [];
      const deathFrameCount = Math.max(deathFrames.length || ANIMATION_DEFS.Granny.Death.frameCount, 1);
      const deathDuration = deathFrameCount / ANIMATION_DEFS.Granny.Death.fps;
      const fadeProgress = clamp((entity.animTime - deathDuration - ENEMY_DEATH_HOLD_DURATION) / ENEMY_DEATH_FADE_DURATION, 0, 1);
      return { scale: 1 - fadeProgress * (1 - ENEMY_DEATH_END_SCALE), alpha: 1 - fadeProgress };
    }
    if (entity.state !== "Death") return { scale: 1, alpha: 1 };
    const fadeProgress = clamp((entity.deathTimer - ENEMY_DEATH_HOLD_DURATION) / ENEMY_DEATH_FADE_DURATION, 0, 1);
    return { scale: 1 - fadeProgress * (1 - ENEMY_DEATH_END_SCALE), alpha: 1 - fadeProgress };
  }

  function getFrameVisualOffsetX(entity, stateName, scale) {
    if (entity.type === "Granny" && stateName === "MeleeAttack") return GTW.GrannyPlayer.getMeleeVisualOffsetX(entity.facing);
    if (entity.type === "Granny" && stateName === "ThrowColostomy") return GTW.GrannyPlayer.getThrowColostomyVisualOffsetX(entity.facing);
    if (entity.type === "LunchLady" && entity.stage === 2 && stateName === "MeleeAttack") return getLunchLadyStage2MeleeVisualOffsetX(entity, scale);
    if (entity.type === "LunchLady" && entity.stage === 2 && stateName === "Slam") return getLunchLadyStage2SlamVisualOffsetX(entity, scale);
    if (entity.type === "LunchLady" && stateName === "ThrowMeatball") return getLunchLadyThrowVisualOffsetX(entity, scale);
    if (entity.type === "PizzaMonster" && stateName === "RangedMelee") return getPizzaRangedMeleeVisualOffsetX(entity, scale);
    return 0;
  }

  function getLunchLadyStage2MeleeVisualOffsetX(entity, scale) {
    const footCenter = LUNCH_LADY_STAGE2_MELEE_FOOT_CENTERS_X[entity.frameIndex];
    if (!Number.isFinite(footCenter)) return 0;
    const offset = (LUNCH_LADY_STAGE2_MELEE_ANCHOR_FOOT_CENTER_X - footCenter) * scale;
    return entity.facing < 0 ? -offset : offset;
  }

  function getLunchLadyStage2SlamVisualOffsetX(entity, scale) {
    const bodyCenter = LUNCH_LADY_STAGE2_SLAM_BODY_CENTERS_X[entity.frameIndex];
    if (!Number.isFinite(bodyCenter)) return 0;
    const offset = (LUNCH_LADY_STAGE2_SLAM_ANCHOR_CENTER_X - bodyCenter) * scale;
    return entity.facing < 0 ? -offset : offset;
  }

  function getLunchLadyThrowVisualOffsetX(entity, scale) {
    const footCenter = LUNCH_LADY_THROW_FOOT_CENTERS_X[entity.frameIndex];
    if (!Number.isFinite(footCenter)) return 0;
    const offset = (LUNCH_LADY_THROW_ANCHOR_FOOT_CENTER_X - footCenter) * scale;
    const facingSign = entity.facing < 0 ? -1 : 1;
    return facingSign * (offset + LUNCH_LADY_THROW_VISUAL_OFFSET_X);
  }

  function getPizzaRangedMeleeVisualOffsetX(entity, scale) {
    const offset = PIZZA_RANGED_MELEE_VISUAL_OFFSETS_X[entity.frameIndex];
    if (!Number.isFinite(offset)) return 0;
    return (entity.facing < 0 ? -1 : 1) * offset * scale;
  }

  function getAnchoredFrameX(anchorX, frame, sourceBounds, scale) {
    const imageWidth = frame.image.naturalWidth || frame.image.width;
    const fullWidth  = imageWidth * scale;
    return anchorX - fullWidth / 2 + sourceBounds.x * scale;
  }

  function getFlippedFrameX(frame, sourceBounds, scale) {
    const imageWidth = frame.image.naturalWidth || frame.image.width;
    const fullWidth  = imageWidth * scale;
    return fullWidth / 2 - (sourceBounds.x + sourceBounds.width) * scale;
  }

  function getFrameDrawBounds(entity, frame, stateName) {
    const imageWidth  = frame.image.naturalWidth  || frame.image.width;
    const imageHeight = frame.image.naturalHeight || frame.image.height;
    const fullBounds  = { x: 0, y: 0, width: imageWidth, height: imageHeight };
    if (entity.type === "LunchLady" && stateName === "ThrowMeatball") return LUNCH_LADY_THROW_DRAW_BOUNDS;
    if (entity.type === "LunchLady" && entity.stage === 2) {
      const lunchLadyBounds = LUNCH_LADY_STAGE2_DRAW_BOUNDS[stateName];
      if (lunchLadyBounds) return lunchLadyBounds;
    }
    if (!shouldScaleToVisibleBounds(entity, stateName)) return fullBounds;
    const bounds = frame.bounds;
    if (!bounds?.width || !bounds?.height) return fullBounds;
    return bounds;
  }

  function shouldScaleToVisibleBounds(entity, stateName) {
    if (["Demon", "DemonRanged", "Satan", "SatanEvolution"].includes(entity.type)) return false;
    // These legacy sets are calibrated against their full 1024px cells. This
    // also keeps file:// and HTTP rendering identical when canvas pixel reads
    // are unavailable for local images.
    if (["Granny", "Nurse", "Ward"].includes(entity.type)) return false;
    if (entity !== player && entity.type !== "MeatballMonster" && stateName === "Death") return false;
    return ["Idle","Walk","Jump","MeleeAttack","ThrowColostomy","KnockBack","KnockDown","Death","Point","Slam"].includes(stateName);
  }

  function getFrameAnchorHeight(entity, frame, stateName, sourceBounds) {
    if (entity.type === "Demon" || entity.type === "DemonRanged") return 1000;
    if (entity.type === "Satan") return stateName === "Jump" ? SATAN_JUMP_GROUND_ANCHOR_Y : 1008;
    if (entity.type === "SatanEvolution") {
      if (stateName === "JumpSlam") return 1011;
      if (stateName === "Summon") return 1007;
      if (stateName === "FlyMeleeAttack") return 1009;
      if (["FlyIdle", "FlyForward"].includes(stateName)) return 1000;
      return 1008;
    }
    if (entity.type === "Granny" && stateName === "Crouch") {
      return GRANNY_CROUCH_FOOT_BASELINES[entity.frameIndex] ?? GRANNY_CROUCH_FOOT_BASELINES[CROUCH_HOLD_FRAME];
    }
    if (entity.type === "Ward" && stateName === "Entrance") return WARD_ENTRANCE_GROUND_ANCHOR_Y;
    if (entity.type === "LunchLady" && stateName === "ThrowMeatball") return LUNCH_LADY_THROW_DRAW_BOUNDS.height;
    if (entity.type === "LunchLady" && entity.stage === 2 && stateName === "Slam") {
      const opaqueBottomY = LUNCH_LADY_STAGE2_SLAM_OPAQUE_BOTTOM_Y[entity.frameIndex];
      if (Number.isFinite(opaqueBottomY)) return opaqueBottomY - sourceBounds.y;
    }
    if (entity.type === "LunchLady" && entity.stage === 2) {
      const lunchLadyBounds = LUNCH_LADY_STAGE2_DRAW_BOUNDS[stateName];
      if (lunchLadyBounds) return lunchLadyBounds.height;
    }
    const bounds = frame.bounds;
    if (!bounds?.height) return sourceBounds.height;
    return bounds.y + bounds.height - sourceBounds.y;
  }

  function getFrameScaleHeight(entity, frame, stateName, sourceBounds) {
    if (entity.type === "Granny") {
      const grannySH = GTW.GrannyPlayer.getFrameScaleHeight(frame, stateName, sourceBounds);
      if (grannySH !== null) return grannySH;
    }
    if (entity.type === "Ward" && ["Entrance","MeleeAttack","Slam"].includes(stateName)) {
      return WARD_CANONICAL_SCALE_HEIGHT;
    }
    if (entity.type === "LunchLady" && entity.stage === 2 && LUNCH_LADY_STAGE2_CANONICAL_SCALE_STATES.has(stateName)) {
      return LUNCH_LADY_STAGE2_CANONICAL_SCALE_HEIGHT;
    }
    if (entity.type === "MeatballMonster") return MEATBALL_CANONICAL_SCALE_HEIGHT;
    if (entity.type === "PizzaMonster") return PIZZA_MONSTER_CANONICAL_SCALE_HEIGHT;
    if (entity.type === "Demon") return DEMON_CANONICAL_SCALE_HEIGHT;
    if (entity.type === "DemonRanged") return DEMON_RANGED_CANONICAL_SCALE_HEIGHT;
    if (entity.type === "Satan") return SATAN_CANONICAL_SCALE_HEIGHT;
    if (entity.type === "SatanEvolution") return SATAN_EVOLUTION_CANONICAL_SCALE_HEIGHT;
    if (stateName !== "Jump") return sourceBounds.height;
    const imageHeight = frame.image.naturalHeight || frame.image.height;
    return Math.max(sourceBounds.height, Math.round(imageHeight * JUMP_MIN_SCALE_HEIGHT_RATIO));
  }

  function getFrameTargetHeight(entity, targetHeight, stateName) {
    if (entity.type === "Satan") return targetHeight;
    if (entity.type === "SatanEvolution") return targetHeight;
    if (entity.type === "Demon") return targetHeight * DEMON_SIZE_MULTIPLIER;
    if (entity.type === "DemonRanged") return targetHeight * DEMON_RANGED_SIZE_MULTIPLIER;
    if (entity.type === "Granny" && stateName === "Jump") return targetHeight * GRANNY_JUMP_SIZE_MULTIPLIER;
    if (stateName === "Jump") return targetHeight * JUMP_TARGET_HEIGHT_MULTIPLIER;
    if (entity.type === "PizzaMonster") return targetHeight * getPizzaSizeMultiplier(entity);
    if (entity.type === "LunchLady" && entity.stage === 2 && stateName === "ThrowMeatball") return targetHeight * LUNCH_LADY_STAGE2_SIZE_MULTIPLIER * LUNCH_LADY_STAGE2_THROW_SIZE_MULTIPLIER;
    if (entity.type === "LunchLady" && stateName === "ThrowMeatball") return targetHeight * LUNCH_LADY_SIZE_MULTIPLIER * LUNCH_LADY_THROW_SIZE_MULTIPLIER;
    if (entity.type === "LunchLady" && entity.stage === 2 && stateName === "MeleeAttack") return targetHeight * LUNCH_LADY_STAGE2_SIZE_MULTIPLIER * LUNCH_LADY_STAGE2_MELEE_SIZE_MULTIPLIER;
    if (entity.type === "LunchLady" && entity.stage === 2 && stateName === "Slam") return targetHeight * LUNCH_LADY_STAGE2_SIZE_MULTIPLIER * LUNCH_LADY_STAGE2_SLAM_SIZE_MULTIPLIER;
    if (entity.type === "LunchLady" && entity.stage === 2 && stateName === "KnockDown") return targetHeight * LUNCH_LADY_STAGE2_SIZE_MULTIPLIER * LUNCH_LADY_STAGE2_KNOCKDOWN_SIZE_MULTIPLIER;
    if (entity.type === "LunchLady" && entity.stage === 2) return targetHeight * LUNCH_LADY_STAGE2_SIZE_MULTIPLIER;
    if (entity.type === "LunchLady" && stateName === "Idle") return targetHeight * LUNCH_LADY_STAGE1_IDLE_SIZE_MULTIPLIER;
    if (entity.type === "LunchLady") return targetHeight * LUNCH_LADY_SIZE_MULTIPLIER;
    const multiplier = ANIMATION_TARGET_MULTIPLIERS[entity.type]?.[stateName];
    return multiplier !== undefined ? targetHeight * multiplier : targetHeight;
  }

  function getEntityFrame(entity, animationSet, idleFallback) {
    const stateName = animationSet[entity.state] ? entity.state : idleFallback;
    const frames    = animationSet[stateName] ?? animationSet[idleFallback] ?? [];
    return { stateName, frame: frames[entity.frameIndex] ?? frames[0] ?? null };
  }

  // ============================================================
  // Utilities
  // ============================================================

  function shouldFlipSpriteForFacing(entity) {
    if (entity.type === "DemonRanged") {
      const sourceFacesLeft = entity.state === "FlyForward";
      return sourceFacesLeft ? entity.facing > 0 : entity.facing < 0;
    }

    const sourceFacesLeft = ["MeatballMonster", "Demon", "Satan", "SatanEvolution"].includes(entity.type);
    return sourceFacesLeft ? entity.facing > 0 : entity.facing < 0;
  }

  function intersects(left, right) {
    return (
      left.x < right.x + right.width  &&
      left.x + left.width  > right.x  &&
      left.y < right.y + right.height &&
      left.y + left.height > right.y
    );
  }

  function intersectsCircleRect(circle, rect) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

})();
