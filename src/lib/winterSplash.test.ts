import { describe, expect, it } from 'vitest';

// The routes read the browser location; any site address works (as in frame.test.ts).
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://indiskbarnklubb.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
const { WS_BLANK, wsAttendees, wsDateTime, wsErrorText, wsPayload, wsPriceAt, wsProblem, wsTierText, WS_PRICES } = await import('./winterSplash');
const { routeFromPath, pathForRoute, isSubPageRoute } = await import('./routes');
const { cityPageFor } = await import('../components/city/citySites');

const EN = (en: string) => en;
const SV = (_en: string, sv: string) => sv;

describe('Winter Splash 2026 prices (Swedish time, the same as the database)', () => {
  it('is 50 SEK until 25 November, 75 SEK from 26 November to 9 December, 100 SEK from 10 December', () => {
    expect(wsPriceAt(new Date('2026-11-19T12:00:00Z'))).toEqual({ band: 'until_25_november', price: 50 });
    expect(wsPriceAt(new Date('2026-11-25T22:59:59Z'))).toEqual({ band: 'until_25_november', price: 50 }); // 23:59:59 on 25 Nov
    expect(wsPriceAt(new Date('2026-11-25T23:00:00Z'))).toEqual({ band: '26_november_9_december', price: 75 }); // 00:00 on 26 Nov
    expect(wsPriceAt(new Date('2026-12-09T22:59:59Z'))).toEqual({ band: '26_november_9_december', price: 75 });
    expect(wsPriceAt(new Date('2026-12-09T23:00:00Z'))).toEqual({ band: '10_12_december', price: 100 });
    expect(wsPriceAt(new Date('2026-12-12T16:00:00Z'))).toEqual({ band: '10_12_december', price: 100 });
  });
  it('lists the periods in English and Swedish', () => {
    expect(WS_PRICES.map((p) => wsTierText(p, EN))).toEqual(['Until 25 November: 50 SEK', '26 November – 9 December: 75 SEK', '10–12 December: 100 SEK']);
    expect(WS_PRICES.map((p) => wsTierText(p, SV))).toEqual(['Till och med 25 november: 50 kr', '26 november – 9 december: 75 kr', '10–12 december: 100 kr']);
  });
});

const general = { ...WS_BLANK, kind: 'general' as const, name: 'Anna Andersson', email: 'anna@example.org', phone: '+46 70 123 45 67', adults: '2', children: '1', privacy: true };
const performer = {
  ...WS_BLANK, kind: 'performer' as const, name: 'Ravi K', email: 'ravi@example.org', phone: '0701234567', people: '6', groupName: 'Dance group',
  perfType: 'dance', perfDescription: 'A Bollywood dance', perfMinutes: '5', privacy: true,
};

describe('the form checks (the same rules as the database)', () => {
  it('accepts a complete General Admission or performer registration', () => {
    expect(wsProblem(general, EN)).toBe('');
    expect(wsProblem(performer, EN)).toBe('');
    expect(wsProblem({ ...performer, kind: 'guest', perfType: '', perfDescription: '', perfMinutes: '' }, EN)).toBe('');
    expect(wsAttendees(general)).toBe(3);
    expect(wsAttendees(performer)).toBe(6);
  });
  it('asks for what is missing, in the visitor’s language', () => {
    expect(wsProblem({ ...general, privacy: false }, EN)).toBe('Please confirm that you have read the privacy notice.');
    expect(wsProblem({ ...general, privacy: false }, SV)).toBe('Bekräfta att du har läst integritetsmeddelandet.');
    expect(wsProblem({ ...general, email: 'anna@' }, EN)).toBe('Check your email address.');
    expect(wsProblem({ ...general, phone: '12' }, EN)).toBe('Check your phone number.');
    expect(wsProblem({ ...general, adults: '0' }, EN)).toMatch(/At least 1 adult/);
    expect(wsProblem({ ...general, adults: '21' }, EN)).toMatch(/up to 20 adults/);
    expect(wsProblem({ ...general, children: '-1' }, EN)).toMatch(/20 children/);
    expect(wsProblem({ ...performer, perfType: '' }, EN)).toBe('Choose the type of performance.');
    expect(wsProblem({ ...performer, perfMinutes: '90' }, EN)).toMatch(/1 to 60/);
    expect(wsProblem({ ...WS_BLANK }, EN)).toBe('Choose how you are coming.');
  });
  it('sends what submit_ibk_winter_splash reads, and never a price (the database sets it)', () => {
    expect(wsPayload({ ...general, name: '  Anna   Andersson ', photo: true }, 'sv')).toEqual({
      kind: 'general', name: 'Anna Andersson', email: 'anna@example.org', phone: '+46 70 123 45 67', language: 'sv',
      consent: { privacy: true, photo: true }, adults: 2, children: 1,
    });
    const p = wsPayload(performer, 'en');
    expect(p).toMatchObject({ kind: 'performer', people: 6, group_name: 'Dance group', performance: { type: 'dance', description: 'A Bollywood dance', minutes: 5, technical: '' } });
    expect(JSON.stringify(p)).not.toMatch(/price|amount/);
    expect(wsPayload({ ...performer, kind: 'guest' }, 'en')).not.toHaveProperty('performance');
  });
  it('explains the database’s refusals', () => {
    expect(wsErrorText({ hint: 'closed' }, SV)).toBe('Anmälan till Winter Splash 2026 är stängd.');
    expect(wsErrorText({ hint: 'rate_limited' }, EN)).toMatch(/Too many tries/);
    expect(wsErrorText({ hint: 'invalid', message: 'Winter Splash 2026: give your name, email address and phone number.' }, EN)).toBe('Give your name, email address and phone number.');
    expect(wsErrorText(new Error('network'), EN)).toMatch(/Something went wrong/);
  });
  it('writes the payment deadline in Swedish time', () => {
    expect(wsDateTime('2026-11-21T17:30:00Z', false)).toBe('21 November 2026, 18:30');
    expect(wsDateTime('2026-11-21T17:30:00Z', true)).toBe('21 november 2026 kl. 18.30');
  });
});

describe('the Winter Splash addresses on indiskbarnklubb.se', () => {
  it('opens the registration and its privacy notice', () => {
    expect(routeFromPath('/ibk/winter-splash')).toBe('ibk-winter-splash');
    expect(routeFromPath('/ibk/winter-splash/privacy')).toBe('ibk-winter-splash-privacy');
    expect(pathForRoute('ibk-winter-splash')).toBe('/ibk/winter-splash');
    expect(cityPageFor('ibk-winter-splash')).toMatchObject({ city: { route: 'ibk' }, page: 'winter-splash' });
    expect(cityPageFor('ibk-winter-splash-privacy')).toMatchObject({ city: { route: 'ibk' }, page: 'winter-splash-privacy' });
    // A Site CMS page can't take the address.
    expect(isSubPageRoute('ibk/winter-splash')).toBe(false);
  });
  it('leaves the other IBK pages as they were', () => {
    expect(cityPageFor('ibk-privacy')).toMatchObject({ page: 'privacy' });
    expect(cityPageFor('ibk-register')).toMatchObject({ page: 'register' });
    expect(cityPageFor('ibk')).toMatchObject({ page: 'home' });
    expect(isSubPageRoute('ibk/about')).toBe(true);
  });
});
