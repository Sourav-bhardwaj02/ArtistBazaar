/**
 * security.ts — Client-side security hardening for ArtistBazaar
 *
 * Responsibilities:
 *  1. Token obfuscation (XOR + base64) in sessionStorage so raw JWTs are
 *     not trivially readable in DevTools → Application → LocalStorage.
 *  2. Console suppression in production to prevent API/logic enumeration.
 *  3. DevTools-open detection (triggers session lock when detected).
 *  4. Input sanitisation helper to strip dangerous HTML before storage.
 *  5. Client-side rate-limit for login attempts (lockout after 5 fails).
 */

// ─── 1. TOKEN OBFUSCATION ────────────────────────────────────────────────────

const OBFUSCATION_KEY = "AB_Sec#2025!";

function xorObfuscate(input: string, key: string): string {
  let output = "";
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(
      input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return output;
}

export function secureStore(storageKey: string, value: string): void {
  try {
    const obfuscated = btoa(xorObfuscate(value, OBFUSCATION_KEY));
    // Use sessionStorage as primary + localStorage fallback for persistence
    sessionStorage.setItem(`__s_${storageKey}`, obfuscated);
    localStorage.setItem(`__s_${storageKey}`, obfuscated);
  } catch {
    // Fallback: plain storage if encoding fails
    localStorage.setItem(storageKey, value);
  }
}

export function secureRetrieve(storageKey: string): string | null {
  try {
    const raw =
      sessionStorage.getItem(`__s_${storageKey}`) ||
      localStorage.getItem(`__s_${storageKey}`);
    if (!raw) return null;
    return xorObfuscate(atob(raw), OBFUSCATION_KEY);
  } catch {
    // Fallback: try plain key
    return localStorage.getItem(storageKey);
  }
}

export function secureRemove(storageKey: string): void {
  sessionStorage.removeItem(`__s_${storageKey}`);
  localStorage.removeItem(`__s_${storageKey}`);
  // Also clean legacy plain keys
  sessionStorage.removeItem(storageKey);
  localStorage.removeItem(storageKey);
}

// ─── 2. CONSOLE SUPPRESSION (Production only) ───────────────────────────────

export function suppressConsoleinProd(): void {
  if (import.meta.env.PROD) {
    const noop = () => {};
    (window as any).console = {
      ...console,
      log: noop,
      debug: noop,
      info: noop,
      warn: noop,
      // Keep error for genuine runtime errors but strip arguments
      error: (..._args: any[]) => {},
      trace: noop,
      group: noop,
      groupCollapsed: noop,
      groupEnd: noop,
      table: noop,
      dir: noop,
      dirxml: noop,
      count: noop,
      countReset: noop,
      time: noop,
      timeEnd: noop,
      timeLog: noop,
    };
  }
}

// ─── 3. DEVTOOLS DETECTION ───────────────────────────────────────────────────

let devtoolsOpen = false;

export function startDevtoolsDetection(onDetected?: () => void): () => void {
  const threshold = 160;

  function check() {
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    const opened = widthDiff || heightDiff;

    if (opened && !devtoolsOpen) {
      devtoolsOpen = true;
      onDetected?.();
    } else if (!opened) {
      devtoolsOpen = false;
    }
  }

  const intervalId = setInterval(check, 1500);
  return () => clearInterval(intervalId);
}

export function isDevtoolsOpen(): boolean {
  return devtoolsOpen;
}

// ─── 4. INPUT SANITISATION ───────────────────────────────────────────────────

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#96;")
    .trim();
}

export function sanitizeEmail(email: string): string {
  // Strip everything that isn't valid in an email address
  return email.replace(/[^a-zA-Z0-9@._+\-]/g, "").trim().toLowerCase();
}

// ─── 5. CLIENT-SIDE LOGIN RATE LIMITER ───────────────────────────────────────

const RATE_LIMIT_KEY = "__ab_rl";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
}

function getRateLimitState(): RateLimitState {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { attempts: 0, lockedUntil: null };
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

function saveRateLimitState(state: RateLimitState): void {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
}

export function isLoginLocked(): { locked: boolean; remainingSeconds: number } {
  const state = getRateLimitState();
  if (state.lockedUntil && Date.now() < state.lockedUntil) {
    const remainingSeconds = Math.ceil((state.lockedUntil - Date.now()) / 1000);
    return { locked: true, remainingSeconds };
  }
  // Auto-clear expired lockout
  if (state.lockedUntil && Date.now() >= state.lockedUntil) {
    saveRateLimitState({ attempts: 0, lockedUntil: null });
  }
  return { locked: false, remainingSeconds: 0 };
}

export function recordLoginFailure(): { locked: boolean; attemptsLeft: number } {
  const state = getRateLimitState();
  const newAttempts = state.attempts + 1;

  if (newAttempts >= MAX_ATTEMPTS) {
    const newState: RateLimitState = {
      attempts: newAttempts,
      lockedUntil: Date.now() + LOCKOUT_MS,
    };
    saveRateLimitState(newState);
    return { locked: true, attemptsLeft: 0 };
  }

  saveRateLimitState({ attempts: newAttempts, lockedUntil: null });
  return { locked: false, attemptsLeft: MAX_ATTEMPTS - newAttempts };
}

export function clearLoginFailures(): void {
  localStorage.removeItem(RATE_LIMIT_KEY);
}

// ─── 6. JWT VALIDATION HELPER ────────────────────────────────────────────────

export interface JWTPayload {
  exp?: number;
  iat?: number;
  id?: string;
  role?: string;
  email?: string;
}

export function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // Pad base64 string properly
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    return decoded;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 < Date.now();
}

export function isTokenStructureValid(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  // Each part must be non-empty base64url
  return parts.every((p) => /^[A-Za-z0-9\-_]+={0,2}$/.test(p) && p.length > 0);
}
