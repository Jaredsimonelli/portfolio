(function initGrannyPlayer(global) {
  "use strict";
  const GTW = (global.GTW = global.GTW || {});

  // ── Constants ────────────────────────────────────────────────────────────────

  const SCALE = 1.75;
  const MOVE_SPEED = Math.round(190 * 0.85);
  const WALK_STRIDE_LENGTH = 229;
  const JUMP_VELOCITY = -540;
  const MELEE_SCREEN_OFFSET_X = 40;
  const THROW_COLOSTOMY_SCREEN_OFFSET_X = 15;
  const UPRIGHT_CANONICAL_SCALE_HEIGHT = 226;
  const KNOCKDOWN_TARGET_HEIGHT_MULTIPLIER = 2.0;
  const DEATH_TARGET_MULTIPLIER = 2.0;
  const JUMP_MIN_SCALE_HEIGHT_RATIO = 0.68;
  const JUMP_TARGET_HEIGHT_MULTIPLIER = 1.26;
  const JUMP_START_FRAME = 4;
  const JUMP_LAUNCH_FRAME = 7;
  const JUMP_RECOVERY_FRAME = 11;
  const COLOSTOMY_SPLAT_DURATION = 4;
  const KICK_ACTIVE = { start: 10, end: 12 };
  const JUMP_ATTACK_ACTIVE = { start: 10, end: 13 };
  const CROUCH_HOLD_FRAME = 4;
  const PLAYER_LOCKED_STATES = new Set([
    "MeleeAttack",
    "ThrowColostomy",
    "Kick",
    "JumpAttack",
    "Dodge",
    "Parry",
    "KnockBack",
    "KnockDown",
    "Death",
  ]);

  const ANIMATION_DEF = {
    Idle:              { fps: 8,  loop: true,  frameCount: 13 },
    Walk:              { fps: 15, loop: true,  frameCount: 21 },
    Jump:              { fps: 18, loop: false, frameCount: 17 },
    MeleeAttack:       { fps: 16, loop: false, frameCount: 13 },
    Kick:              { fps: 18, loop: false, frameCount: 15 },
    JumpAttack:        { fps: 9,  loop: false, frameCount: 14 },
    ThrowColostomy:    { fps: 16, loop: false, frameCount: 16 },
    ColostomyExplosion:{ fps: 18, loop: false, frameCount: 14 },
    KnockBack:         { fps: 16, loop: false, frameCount: 12 },
    KnockDown:         { fps: 24, loop: false, frameCount: 14 },
    Death:             { fps: 12, loop: false, offsetY: 8, frameCount: 11 },
  };

  const ANIMATION_TARGET_MULTIPLIERS = {
    Walk: 2,
    MeleeAttack: 2,
    Kick: 2,
    JumpAttack: 2,
    Crouch: 2,
    Dodge: 2,
    Parry: 2,
    ThrowColostomy: 1.14,
    KnockDown: KNOCKDOWN_TARGET_HEIGHT_MULTIPLIER,
    Death: DEATH_TARGET_MULTIPLIER,
  };

  // ── State transitions ────────────────────────────────────────────────────────

  function startPlayerAction(player, animationName) {
    player.state = animationName;
    player.animTime = 0;
    player.frameIndex = 0;
    player.vx = 0;
    player.jumpLaunched = false;
    player.projectileThrown = false;
    player.recentHitIds.clear();
  }

  function startJump(player, defs) {
    player.state = "Jump";
    player.animTime = 0;
    player.jumpTime = JUMP_START_FRAME / defs.Jump.fps;
    player.frameIndex = JUMP_START_FRAME;
    player.jumpLaunched = false;
    player.vy = 0;
  }

  function startPlayerKnock(player, state, fromHit, pushDirection = 0) {
    const velocity = state === "KnockDown" ? 75 : 90;
    player.state = state;
    player.animTime = 0;
    player.frameIndex = 0;
    player.jumpTime = 0;
    player.jumpLaunched = false;
    player.projectileThrown = false;
    player.recentHitIds.clear();
    player.vx = fromHit ? pushDirection * velocity : 0;
  }

  // ── Animation updates ────────────────────────────────────────────────────────

  function setPlayerAnimationState(player, animationName, frames, defs, dt) {
    if (player.state !== animationName) {
      player.state = animationName;
      player.animTime = 0;
      player.frameIndex = 0;
      return;
    }
    const def = defs[animationName];
    player.animTime += dt;
    player.frameIndex = Math.floor(player.animTime * def.fps) % Math.max(frames.length, 1);
  }

  // callbacks: { onProjectile, onMeleeHit }
  function updatePlayerAction(player, frames, defs, dt, callbacks = {}) {
    const def = defs[player.state];
    const duration = frames.length / def.fps;

    player.animTime += dt;
    player.frameIndex = Math.min(Math.floor(player.animTime * def.fps), frames.length - 1);

    if (player.state === "ThrowColostomy" && !player.projectileThrown && player.frameIndex >= 6) {
      callbacks.onProjectile?.();
      player.projectileThrown = true;
    }

    if (player.state === "MeleeAttack" && player.frameIndex >= 5 && player.frameIndex <= 9) {
      callbacks.onMeleeHit?.();
    }

    if (player.animTime >= duration) {
      player.state = Math.abs(player.vx) > 8 && player.onGround ? "Walk" : "Idle";
      player.animTime = 0;
      player.frameIndex = 0;
      player.jumpTime = 0;
      player.jumpLaunched = false;
      player.projectileThrown = false;
      player.recentHitIds.clear();
    }
  }

  function updatePlayerKnockDown(player, frames, defs, dt, stayDown) {
    const duration = frames.length / defs.KnockDown.fps;
    player.animTime += dt;
    player.frameIndex = Math.min(Math.floor(player.animTime * defs.KnockDown.fps), frames.length - 1);
    player.vx *= 0.92;

    if (stayDown && player.animTime >= duration) {
      player.state = "Death";
      player.animTime = 0;
      player.frameIndex = 0;
      player.vx = 0;
      player.vy = 0;
      player.onGround = true;
    } else if (!stayDown && player.animTime >= duration) {
      player.state = "Idle";
      player.animTime = 0;
      player.frameIndex = 0;
      player.vx = 0;
    }
  }

  function updatePlayerKnockBack(player, frames, knockDownFrames, defs, dt, stayDown) {
    if (!frames.length) {
      updatePlayerKnockDown(player, knockDownFrames, defs, dt, stayDown);
      return;
    }

    const duration = frames.length / defs.KnockBack.fps;
    player.animTime += dt;
    player.frameIndex = Math.min(Math.floor(player.animTime * defs.KnockBack.fps), frames.length - 1);
    player.vx *= 0.9;

    if (stayDown && player.animTime >= duration) {
      player.state = "Death";
      player.animTime = 0;
      player.frameIndex = 0;
      player.vx = 0;
      player.vy = 0;
      player.onGround = true;
    } else if (!stayDown && player.animTime >= duration) {
      player.state = "Idle";
      player.animTime = 0;
      player.frameIndex = 0;
      player.vx = 0;
    }
  }

  function updatePlayerDeath(player, frames, defs, dt) {
    const def = defs.Death;
    player.animTime += dt;
    player.frameIndex = Math.min(Math.floor(player.animTime * def.fps), Math.max(frames.length - 1, 0));
    player.vx = 0;
    player.vy = 0;
    player.onGround = true;
  }

  function updateJumpAnimation(player, frames, defs, dt, gravity) {
    if (!frames.length) {
      player.state = "Idle";
      player.frameIndex = 0;
      return;
    }

    const expectedJumpDuration = (Math.abs(JUMP_VELOCITY) * 2) / gravity;

    player.state = "Jump";
    player.jumpTime += dt;
    player.frameIndex = Math.min(
      Math.max(JUMP_START_FRAME, Math.floor(player.jumpTime * defs.Jump.fps)),
      frames.length - 1,
    );

    if (!player.jumpLaunched && player.frameIndex >= JUMP_LAUNCH_FRAME) {
      player.jumpLaunched = true;
      player.onGround = false;
      player.vy = JUMP_VELOCITY;
      player.jumpTime = Math.max(player.jumpTime, JUMP_LAUNCH_FRAME / defs.Jump.fps);
    }

    if (player.jumpLaunched && !player.onGround) {
      const airProgress = Math.min(Math.max(
        (player.jumpTime - JUMP_LAUNCH_FRAME / defs.Jump.fps) / expectedJumpDuration,
        0), 1);
      const airFrameIndex = JUMP_LAUNCH_FRAME + Math.floor(airProgress * (frames.length - 1 - JUMP_LAUNCH_FRAME));
      player.frameIndex = Math.min(Math.max(player.frameIndex, airFrameIndex), frames.length - 1);
    }

    if (player.jumpLaunched && player.onGround && player.frameIndex >= JUMP_RECOVERY_FRAME) {
      player.state = Math.abs(player.vx) > 8 ? "Walk" : "Idle";
      player.animTime = 0;
      player.frameIndex = 0;
      player.jumpTime = 0;
      player.jumpLaunched = false;
    }
  }

  // ── Drawing helpers ──────────────────────────────────────────────────────────

  // Returns null for states that are not Granny-specific — caller handles the default.
  function getFrameScaleHeight(frame, stateName, sourceBounds) {
    if (stateName === "KnockDown") {
      return frame.image.naturalHeight || frame.image.height;
    }
    return null; // all upright states use sourceBounds.height via the caller
  }

  function getMeleeVisualOffsetX(facing) {
    return facing < 0 ? -MELEE_SCREEN_OFFSET_X : MELEE_SCREEN_OFFSET_X;
  }

  function getThrowColostomyVisualOffsetX(facing) {
    return facing < 0 ? -THROW_COLOSTOMY_SCREEN_OFFSET_X : THROW_COLOSTOMY_SCREEN_OFFSET_X;
  }

  // ── Export ───────────────────────────────────────────────────────────────────

  GTW.GrannyPlayer = {
    SCALE,
    MOVE_SPEED,
    WALK_STRIDE_LENGTH,
    JUMP_VELOCITY,
    MELEE_SCREEN_OFFSET_X,
    THROW_COLOSTOMY_SCREEN_OFFSET_X,
    UPRIGHT_CANONICAL_SCALE_HEIGHT,
    KNOCKDOWN_TARGET_HEIGHT_MULTIPLIER,
    DEATH_TARGET_MULTIPLIER,
    JUMP_MIN_SCALE_HEIGHT_RATIO,
    JUMP_TARGET_HEIGHT_MULTIPLIER,
    JUMP_START_FRAME,
    JUMP_LAUNCH_FRAME,
    JUMP_RECOVERY_FRAME,
    COLOSTOMY_SPLAT_DURATION,
    KICK_ACTIVE,
    JUMP_ATTACK_ACTIVE,
    CROUCH_HOLD_FRAME,
    PLAYER_LOCKED_STATES,
    ANIMATION_DEF,
    ANIMATION_TARGET_MULTIPLIERS,
    startPlayerAction,
    startJump,
    startPlayerKnock,
    setPlayerAnimationState,
    updatePlayerAction,
    updatePlayerKnockDown,
    updatePlayerKnockBack,
    updatePlayerDeath,
    updateJumpAnimation,
    getFrameScaleHeight,
    getMeleeVisualOffsetX,
    getThrowColostomyVisualOffsetX,
  };
})(window);
