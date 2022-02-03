/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import CookieBanner from '../components/CookieBanner.svelte';

describe('CookieBanner', () => {
  it('should render', () => {
    const { container } = render(CookieBanner, { cookieName: "test" });
    expect(container).toBeTruthy();
  })
})