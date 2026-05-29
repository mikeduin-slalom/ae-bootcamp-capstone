const EVENT_NAMES = {
  pageView: 'page_view',
  login: 'cta_login_click',
  browseLeagues: 'cta_browse_leagues_click',
  howToPlay: 'cta_how_to_play_click'
};

const CTA_IDS = {
  login: 'login',
  browseLeagues: 'browse_leagues',
  howToPlay: 'how_to_play'
};

const DEVICE_TYPES = ['desktop', 'mobile', 'tablet', 'unknown'];

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isIsoDateTime(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

function isStringOrNull(value) {
  return typeof value === 'string' || value === null;
}

export function validateLandingTelemetryEvent(event) {
  if (!event || typeof event !== 'object') {
    return { valid: false, reason: 'Event must be an object.' };
  }

  const requiredFields = ['event_name', 'timestamp', 'page_route', 'device_type'];
  const missingField = requiredFields.find((field) => !hasOwn(event, field));

  if (missingField) {
    return { valid: false, reason: `Missing required field: ${missingField}` };
  }

  if (!Object.values(EVENT_NAMES).includes(event.event_name)) {
    return { valid: false, reason: 'event_name is not recognized.' };
  }

  if (!isIsoDateTime(event.timestamp)) {
    return { valid: false, reason: 'timestamp must be a valid ISO date-time string.' };
  }

  if (typeof event.page_route !== 'string' || event.page_route.length === 0) {
    return { valid: false, reason: 'page_route must be a non-empty string.' };
  }

  if (!DEVICE_TYPES.includes(event.device_type)) {
    return { valid: false, reason: 'device_type must be desktop, mobile, tablet, or unknown.' };
  }

  if (hasOwn(event, 'cta_id') && !isStringOrNull(event.cta_id)) {
    return { valid: false, reason: 'cta_id must be a string or null.' };
  }

  if (event.event_name === EVENT_NAMES.pageView && event.cta_id !== null) {
    return { valid: false, reason: 'page_view events require cta_id to be null.' };
  }

  if (event.event_name !== EVENT_NAMES.pageView) {
    if (!hasOwn(event, 'cta_id')) {
      return { valid: false, reason: 'CTA click events require cta_id.' };
    }

    if (!Object.values(CTA_IDS).includes(event.cta_id)) {
      return { valid: false, reason: 'cta_id is not recognized for CTA click events.' };
    }
  }

  return { valid: true };
}

export { CTA_IDS, DEVICE_TYPES, EVENT_NAMES };
