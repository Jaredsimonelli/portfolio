(function initLocalAnimationOverrides(global) {
  const DB_NAME = "gtw-local-animation-overrides";
  const STORE_NAME = "animation-overrides";
  const PREVIEW_KEY = "preview:sandbox";
  const PUBLISHED_PREFIX = "published";

  const TARGETS = {
    granny: {
      label: "Granny",
      animations: ["Idle", "Walk", "Jump", "MeleeAttack", "ThrowColostomy", "ColostomyExplosion", "KnockBack", "KnockDown", "Death"],
    },
    nurse: {
      label: "Nurse",
      animations: ["Idle", "Walk", "MeleeAttack", "KnockDown", "Death"],
    },
    ward: {
      label: "Ward",
      animations: ["Entrance", "Walk", "Point", "MeleeAttack", "Slam", "KnockBack", "KnockDown", "Death"],
    },
    "meatball-monster": {
      label: "Meatball Monster",
      animations: ["Spawn", "Idle", "Walk", "Grab", "KnockBack", "Death"],
    },
    "lunch-lady": {
      label: "Lunch Lady",
      animations: ["Idle", "Walk", "MeleeAttack", "Slam", "ThrowMeatball", "KnockBack", "KnockDown", "Death"],
    },
    demon: {
      label: "Demon",
      animations: ["GroundedToFly", "FlyIdle", "FlyForward", "FlyMeleeAttack", "KnockBack", "Death"],
    },
    "demon-ranged": {
      label: "Demon Ranged",
      animations: ["GroundedToFly", "FlyIdle", "FlyForward", "FlyRangedAttack", "KnockBack", "Death"],
    },
    "satan-evolution": {
      label: "Satan Evolution",
      animations: [
        "Cutscene",
        "GroundedToFly",
        "FlyIdle",
        "FlyForward",
        "FlyMeleeAttack",
        "JumpSlam",
        "Summon",
        "Run",
        "GroundSlam",
        "GroundedKnockBack",
        "GroundedKnockDown",
        "Death",
      ],
    },
  };

  let dbPromise = null;

  function openDb() {
    if (dbPromise) {
      return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
      if (!global.indexedDB) {
        reject(new Error("IndexedDB is unavailable in this browser."));
        return;
      }

      const request = global.indexedDB.open(DB_NAME, 1);
      request.onerror = () => reject(request.error || new Error("Failed to open local overrides DB."));
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "key" });
        }
      };
      request.onsuccess = () => resolve(request.result);
    });

    return dbPromise;
  }

  async function withStore(mode, run) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      let request = null;
      let value;

      tx.oncomplete = () => resolve(request ? request.result : value);
      tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed."));
      tx.onabort = () => reject(tx.error || new Error("IndexedDB transaction aborted."));

      try {
        value = run(store);
        if (value && typeof value === "object" && "result" in value) {
          request = value;
        }
      } catch (error) {
        tx.abort();
        reject(error);
      }
    });
  }

  function buildPublishedKey(characterId, animationName) {
    return `${PUBLISHED_PREFIX}:${characterId}:${animationName}`;
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function listTargets() {
    return Object.entries(TARGETS).map(([characterId, entry]) => ({
      characterId,
      label: entry.label,
      animations: entry.animations.slice(),
    }));
  }

  function getAnimationOptions(characterId) {
    return TARGETS[characterId]?.animations.slice() ?? [];
  }

  function isSupportedTarget(characterId, animationName) {
    return Boolean(TARGETS[characterId]?.animations.includes(animationName));
  }

  async function savePublishedOverride(payload) {
    assertSupportedPayload(payload);

    const record = {
      key: buildPublishedKey(payload.characterId, payload.animationName),
      kind: PUBLISHED_PREFIX,
      characterId: payload.characterId,
      characterLabel: TARGETS[payload.characterId].label,
      animationName: payload.animationName,
      sourceName: payload.sourceName || "sprite-set",
      frameRate: Number.isFinite(payload.frameRate) ? payload.frameRate : 12,
      width: payload.width || 0,
      height: payload.height || 0,
      frames: payload.frames.map((frame, index) => ({
        name: frame.name || `${payload.animationName}_${String(index).padStart(2, "0")}.png`,
        dataUrl: frame.dataUrl,
      })),
      updatedAt: new Date().toISOString(),
    };

    await withStore("readwrite", (store) => {
      store.put(record);
    });

    return record;
  }

  async function getPublishedOverride(characterId, animationName) {
    if (!isSupportedTarget(characterId, animationName)) {
      return null;
    }

    const key = buildPublishedKey(characterId, animationName);
    const record = await withStore("readonly", (store) => store.get(key));
    return record ?? null;
  }

  async function saveSandboxPreview(payload) {
    assertSupportedPayload(payload);

    const record = {
      key: PREVIEW_KEY,
      kind: "preview",
      characterId: payload.characterId,
      characterLabel: TARGETS[payload.characterId].label,
      animationName: payload.animationName,
      sourceName: payload.sourceName || "sprite-set",
      frameRate: Number.isFinite(payload.frameRate) ? payload.frameRate : 12,
      width: payload.width || 0,
      height: payload.height || 0,
      frames: payload.frames.map((frame, index) => ({
        name: frame.name || `${payload.animationName}_${String(index).padStart(2, "0")}.png`,
        dataUrl: frame.dataUrl,
      })),
      updatedAt: new Date().toISOString(),
    };

    await withStore("readwrite", (store) => {
      store.put(record);
    });

    return record;
  }

  async function getSandboxPreview() {
    const record = await withStore("readonly", (store) => store.get(PREVIEW_KEY));
    return record ?? null;
  }

  async function clearSandboxPreview() {
    await withStore("readwrite", (store) => {
      store.delete(PREVIEW_KEY);
    });
  }

  async function applyOverridesToManifest(manifest) {
    if (!manifest || !Array.isArray(manifest.files)) {
      return manifest;
    }

    const manifestClone = cloneJson(manifest);
    const overrideMap = new Map();

    for (const { characterId, animations } of listTargets()) {
      for (const animationName of animations) {
        const record = await getPublishedOverride(characterId, animationName);
        if (record) {
          overrideMap.set(`${characterId}:${animationName}`, record);
        }
      }
    }

    if (!overrideMap.size) {
      return manifestClone;
    }

    const files = [];
    const emitted = new Set();

    for (const entry of manifestClone.files) {
      const key = `${entry.enemyId}:${entry.animation}`;
      const override = overrideMap.get(key);
      if (!override) {
        files.push(entry);
        continue;
      }

      if (emitted.has(key)) {
        continue;
      }

      emitted.add(key);
      const replacementFrames = override.frames.map((frame, index) => ({
        enemyId: entry.enemyId,
        enemyLabel: entry.enemyLabel,
        path: frame.dataUrl,
        dir: entry.dir,
        displayDir: entry.displayDir,
        name: frame.name,
        stem: frame.name.replace(/\.png$/i, ""),
        animation: entry.animation,
        frameLabel: String(index).padStart(2, "0"),
        frameTokens: [index],
        origin: "local-override",
      }));

      files.push(...replacementFrames);
    }

    manifestClone.files = files;
    manifestClone.totalFiles = files.length;
    manifestClone.enemyTypes = manifestClone.enemyTypes.map((enemyType) => {
      const enemyFiles = files.filter((entry) => entry.enemyId === enemyType.id);
      const animationCount = new Set(enemyFiles.map((entry) => entry.animation)).size;
      return {
        ...enemyType,
        totalFiles: enemyFiles.length,
        animationCount,
      };
    });

    return manifestClone;
  }

  function assertSupportedPayload(payload) {
    if (!payload || !isSupportedTarget(payload.characterId, payload.animationName)) {
      throw new Error("That animation is not shared by both Sandbox and Asset Inspector.");
    }

    if (!Array.isArray(payload.frames) || !payload.frames.length) {
      throw new Error("No frames are available to publish.");
    }
  }

  global.LocalAnimationOverrides = {
    listTargets,
    getAnimationOptions,
    isSupportedTarget,
    savePublishedOverride,
    getPublishedOverride,
    saveSandboxPreview,
    getSandboxPreview,
    clearSandboxPreview,
    applyOverridesToManifest,
  };
})(window);
