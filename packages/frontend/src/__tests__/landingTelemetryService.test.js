import {
  buildLandingTelemetryEvent,
  emitLandingTelemetryEvent,
  EVENT_NAMES,
  trackLandingCtaClick,
  trackLandingPageView
} from '../services/landingTelemetryService';
import {
  INVALID_EVENT_MISSING_DEVICE,
  VALID_CTA_LOGIN_EVENT,
  VALID_PAGE_VIEW_EVENT
} from './fixtures/landingTelemetryEvents';

describe('landingTelemetryService', () => {
  it('builds a page_view event that conforms to the landing schema', () => {
    const event = buildLandingTelemetryEvent({
      eventName: EVENT_NAMES.pageView,
      pageRoute: '/',
      ctaId: null,
      timestamp: VALID_PAGE_VIEW_EVENT.timestamp
    });

    expect(event).toMatchObject({
      ...VALID_PAGE_VIEW_EVENT,
      device_type: expect.any(String)
    });
    expect(['desktop', 'mobile', 'tablet', 'unknown']).toContain(event.device_type);
  });

  it('emits a valid CTA click event with required contract fields', () => {
    const sink = jest.fn();

    const event = trackLandingCtaClick(
      {
        pageRoute: '/',
        ctaId: 'login'
      },
      sink
    );

    expect(event.event_name).toBe(VALID_CTA_LOGIN_EVENT.event_name);
    expect(event.page_route).toBe('/');
    expect(event.cta_id).toBe('login');
    expect(['desktop', 'mobile', 'tablet', 'unknown']).toContain(event.device_type);
    expect(sink).toHaveBeenCalledWith(event);
  });

  it('emits one page_view event with null cta_id', () => {
    const sink = jest.fn();

    const event = trackLandingPageView('/', sink);

    expect(event.event_name).toBe('page_view');
    expect(event.cta_id).toBeNull();
    expect(sink).toHaveBeenCalledTimes(1);
  });

  it('rejects malformed payloads that violate required schema fields', () => {
    expect(() => emitLandingTelemetryEvent(INVALID_EVENT_MISSING_DEVICE)).toThrow(
      /missing required field/i
    );
  });

  it('rejects unsupported CTA ids', () => {
    expect(() => trackLandingCtaClick({ pageRoute: '/', ctaId: 'draft_now' })).toThrow(
      /unsupported cta id/i
    );
  });
});
