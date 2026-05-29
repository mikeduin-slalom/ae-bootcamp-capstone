export function detectDeviceType(userAgent = '') {
  const normalized = userAgent.toLowerCase();

  if (!normalized) {
    return 'unknown';
  }

  if (/ipad|tablet|playbook|silk/.test(normalized)) {
    return 'tablet';
  }

  if (/mobile|iphone|ipod|android/.test(normalized)) {
    return 'mobile';
  }

  if (/macintosh|windows nt|linux/.test(normalized)) {
    return 'desktop';
  }

  return 'unknown';
}

export function getCurrentDeviceType() {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  return detectDeviceType(navigator.userAgent || '');
}
