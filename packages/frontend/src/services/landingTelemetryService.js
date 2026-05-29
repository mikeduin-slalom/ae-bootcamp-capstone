import { getCurrentDeviceType } from './deviceType';
import { CTA_IDS, EVENT_NAMES, validateLandingTelemetryEvent } from './landingTelemetryContract';

const CTA_EVENT_BY_ID = {
  login: EVENT_NAMES.login,
  browse_leagues: EVENT_NAMES.browseLeagues,
  how_to_play: EVENT_NAMES.howToPlay
};

function defaultSink(event) {
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(event);
    return;
  }

  if (typeof window !== 'undefined') {
    window.__landingTelemetryQueue = window.__landingTelemetryQueue || [];
    window.__landingTelemetryQueue.push(event);
  }
}

export function buildLandingTelemetryEvent({ eventName, pageRoute, ctaId = null, timestamp }) {
  const event = {
    event_name: eventName,
    timestamp: timestamp || new Date().toISOString(),
    page_route: pageRoute,
    device_type: getCurrentDeviceType(),
    cta_id: ctaId
  };

  const validation = validateLandingTelemetryEvent(event);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  return event;
}

export function emitLandingTelemetryEvent(event, sink = defaultSink) {
  const validation = validateLandingTelemetryEvent(event);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  sink(event);
  return event;
}

export function trackLandingPageView(pageRoute, sink) {
  const event = buildLandingTelemetryEvent({
    eventName: EVENT_NAMES.pageView,
    pageRoute,
    ctaId: null
  });

  return emitLandingTelemetryEvent(event, sink);
}

export function trackLandingCtaClick({ pageRoute, ctaId }, sink) {
  const mappedEventName = CTA_EVENT_BY_ID[ctaId];

  if (!mappedEventName) {
    throw new Error(`Unsupported CTA id: ${ctaId}`);
  }

  const event = buildLandingTelemetryEvent({
    eventName: mappedEventName,
    pageRoute,
    ctaId
  });

  return emitLandingTelemetryEvent(event, sink);
}

export { CTA_EVENT_BY_ID, CTA_IDS, EVENT_NAMES };
