/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Header from '../components/Header.svelte';

describe('Header', () => {
  it('should render', () => {
    const { container } = render(Header);
    expect(container).toBeTruthy();
  })
})