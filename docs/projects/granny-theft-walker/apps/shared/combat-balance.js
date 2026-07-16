(function initCombatBalance(window) {
  "use strict";

  const GTW = window.GTW || (window.GTW = {});

  const PLAYER = {
    maxHealth: 180,
    damageCooldown: 0.65,
    hitFlashDuration: 0.2,
    attacks: {
      meleeDamage: 47,
      meleeHitboxWidthReduction: 25,
      kickDamage: 34,
      jumpAttackDamage: 44,
      colostomyDirectDamage: 40,
      colostomyCooldown: 3,
    },
    // Poke recovery is opt-in from the sandbox Advanced Mechanics toggle.
    recovery: {
      meleeHit: 0.12,
      meleeWhiff: 0.22,
      meleeWhiffCooldown: 0.18,
    },
    dodge: {
      duration: 0.3,
      invuln: 0.2,
      cooldown: 0.4,
      speed: 480,
    },
    parry: {
      window: 0.18,
      duration: 0.42,
      cooldown: 0.25,
      counterDamage: 30,
      enemyStagger: 1.2,
    },
  };

  const ENEMY_DAMAGE_REACTION = {
    damageCooldown: 0.2,
    hitFlashDuration: 0.18,
    interruptAttackCooldown: 0.35,
  };

  const NURSE = {
    maxHealth: 140,
    meleeDamage: 24,
    initialAttackCooldown: 0,
    attackRecoveryCooldown: 1.3,
    knockDownAttackCooldown: 1.5,
    standUpAttackCooldown: 0.7,
    ...ENEMY_DAMAGE_REACTION,
    interruptAttackCooldownAdvanced: 0.22,
  };

  const WARD = {
    maxHealth: 420,
    meleeDamage: 30,
    slamDamage: 54,
    initialAttackCooldown: 0.6,
    initialSlamCooldown: 2.5,
    pointInterval: 20,
    slamInterval: 4,
    attackReadyGrace: 0.1,
    meleeRecoveryCooldown: 0.15,
    slamRecoveryCooldown: 0.75,
    pointRecoveryCooldown: 1.1,
    forcedPointRecoveryCooldown: 0.5,
    entranceRecoveryCooldown: 1.1,
    forcedEntranceRecoveryCooldown: 0.3,
    knockDownAttackCooldown: 1.1,
    knockBackRecoveryCooldown: 0.65,
    standUpAttackCooldown: 1.2,
    phaseKnockdownThresholdRatios: [2 / 3, 1 / 3],
    ...ENEMY_DAMAGE_REACTION,
  };

  const MEATBALL_MONSTER = {
    maxHealth: 160,
    grabDamage: 20,
    walkSpeed: 44,
    grabRangeX: 120,
    grabRangeY: 44,
    initialGrabCooldown: 0.25,
    grabCooldown: 1,
    knockBackRecoveryCooldown: 0.5,
    ...ENEMY_DAMAGE_REACTION,
  };

  const LUNCH_LADY = {
    maxHealth: 360,
    meleeDamage: 28,
    slamDamage: 48,
    walkSpeed: 34,
    throwDamage: 22,
    throwCooldown: 5,
    initialAttackCooldown: 0.45,
    initialSlamCooldown: 2.2,
    initialThrowCooldown: 2,
    slamInterval: 4.5,
    meleeRecoveryCooldown: 0.25,
    slamRecoveryCooldown: 0.85,
    throwRecoveryCooldown: 0.8,
    knockBackRecoveryCooldown: 0.6,
    knockDownAttackCooldown: 1.15,
    standUpAttackCooldown: 1.2,
    superArmorDuration: 2,
    superArmorDamageCooldown: 0.2,
    counterSlamShakeDuration: 0.15,
    counterSlamShakeStrength: 4,
    ...ENEMY_DAMAGE_REACTION,
  };

  const PIZZA_MONSTER = {
    maxHealth: 300,
    grabDamage: 25,
    rangedMeleeDamage: 30,
    damageWhileActive: 5,
    damageWhileDazed: 50,
    leapSpeed: 400,
    grabRange: 80,
    rangedMeleeRange: 200,
    leapRange: 300,
    grabCooldown: 1.5,
    rangedMeleeCooldown: 2.0,
    leapCooldown: 4.0,
    idlePauseDuration: 0.7,
    dazeHitThreshold: 5,
    dazeDuration: 4.0,
    ...ENEMY_DAMAGE_REACTION,
  };

  const SATAN = {
    maxHealth: 520,
    meleeDamage: 26,
    grabThrowDamage: 40,
    jumpSlamDamage: 44,
    walkSpeed: 30,
    runSpeed: 110,
    meleeRange: 150,
    grabRange: 130,
    jumpSlamRadius: 130,
    initialAttackCooldown: 0.6,
    meleeRecoveryCooldown: 1.0,
    grabRecoveryCooldown: 2.4,
    jumpRecoveryCooldown: 1.1,
    runTriggerDistance: 260,
    superArmorHitThreshold: 4,
    superArmorDuration: 1.0,
    spawn: {
      seatedReverseFps: 8,
      preJumpIdle: 0.5,
      rotationMode: "lean",
      rotationMax: 0.16,
      impactFrame: 16,
      landingShakeDuration: 0.6,
      landingShakeStrength: 18,
    },
    ...ENEMY_DAMAGE_REACTION,
  };

  const SATAN_EVOLUTION = {
    maxHealth: 520,
    flySpeed: 78,
    hoverHeight: 220,
    flyMeleeDamage: 32,
    jumpSlamDamage: 56,
    initialSummonCooldown: 20,
    summonCooldown: 20,
    meleeRecoveryCooldown: 1.1,
    jumpSlamCooldown: 5,
    damageCooldown: 0.2,
    hitFlashDuration: 0.18,
    knockDownHitThreshold: 3,
    groundedRunSpeed: 150,
    groundedRunStride: 165,
    groundedRecoverDuration: 0.45,
    groundedCommitDistance: 90,
    groundedPassDistance: 190,
    groundedTurnPause: 0.3,
    groundedArenaMargin: 70,
    groundedPassCount: 2,
    groundSlamDamage: 44,
    groundSlamRadius: 205,
    postGroundAttackCooldown: 1.0,
    postGroundSummonCooldown: 2.5,
  };

  const DEMON = {
    maxHealth: 180,
    meleeDamage: 22,
    flySpeed: 72,
    hoverHeight: 155,
    meleeRangeX: 70,
    meleeRangeY: 58,
    initialAttackCooldown: 0.5,
    attackRecoveryCooldown: 1.1,
    knockBackRecoveryCooldown: 0.45,
    ...ENEMY_DAMAGE_REACTION,
    interruptAttackCooldownAdvanced: 0.22,
  };

  const DEMON_RANGED = {
    maxHealth: 160,
    arrowDamage: 18,
    flySpeed: 66,
    hoverHeight: 170,
    preferredRangeX: 240,
    minRangeX: 135,
    maxRangeX: 430,
    aimToleranceY: 60,
    initialAttackCooldown: 0.75,
    attackRecoveryCooldown: 1.6,
    postShotCooldown: 1.25,
    knockBackRecoveryCooldown: 0.5,
    arrowSpeed: 390,
    arrowMaxLife: 1.8,
    ...ENEMY_DAMAGE_REACTION,
    interruptAttackCooldownAdvanced: 0.22,
  };

  function getWardKnockdownThresholds(maxHealth = WARD.maxHealth) {
    return WARD.phaseKnockdownThresholdRatios.map((ratio) => Math.round(maxHealth * ratio));
  }

  GTW.CombatBalance = Object.freeze({
    player: PLAYER,
    enemies: Object.freeze({
      Nurse: NURSE,
      Ward: WARD,
      MeatballMonster: MEATBALL_MONSTER,
      LunchLady: LUNCH_LADY,
      PizzaMonster: PIZZA_MONSTER,
      Satan: SATAN,
      SatanEvolution: SATAN_EVOLUTION,
      Demon: DEMON,
      DemonRanged: DEMON_RANGED,
    }),
    getWardKnockdownThresholds,
  });
})(window);
