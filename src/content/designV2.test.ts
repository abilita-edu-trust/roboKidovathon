import { describe, expect, it } from 'vitest';
import { VFI_SITE } from '../context/SiteContext';
import { CITY_SITES } from '../components/city/citySites';

describe('the calmer type system and shorter page (designV2)', () => {
  it('is on for vfi and IBK only; Riga, Eskilstuna and Växjö keep their look', () => {
    expect(VFI_SITE.designV2).toBe(true);
    expect(CITY_SITES.ibk.site.designV2).toBe(true);
    expect(CITY_SITES.riga.site.designV2).toBeFalsy();
    expect(CITY_SITES.esk.site.designV2).toBeFalsy();
    expect(CITY_SITES.vxo.site.designV2).toBeFalsy();
  });
});
