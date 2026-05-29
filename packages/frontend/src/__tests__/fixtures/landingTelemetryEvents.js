export const VALID_PAGE_VIEW_EVENT = {
  event_name: 'page_view',
  timestamp: '2026-05-29T15:00:00.000Z',
  page_route: '/',
  device_type: 'desktop',
  cta_id: null
};

export const VALID_CTA_LOGIN_EVENT = {
  event_name: 'cta_login_click',
  timestamp: '2026-05-29T15:01:00.000Z',
  page_route: '/',
  device_type: 'mobile',
  cta_id: 'login'
};

export const INVALID_EVENT_MISSING_DEVICE = {
  event_name: 'cta_how_to_play_click',
  timestamp: '2026-05-29T15:01:00.000Z',
  page_route: '/',
  cta_id: 'how_to_play'
};

describe.skip('landingTelemetryEvents fixtures', () => {
  it('is a shared fixture module for telemetry contract tests', () => {
    expect(VALID_PAGE_VIEW_EVENT).toBeDefined();
  });
});
