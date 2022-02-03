/**
 * @vitest-environment jsdom
 */

import { render, cleanup, fireEvent } from '@testing-library/svelte';
import DarkmodeToggle from '../components/DarkmodeToggle.svelte';
import { beforeEach, describe, test, expect } from 'vitest';
import { theme } from '$lib/store';
import { get } from 'svelte/store';

beforeEach(cleanup);

describe('DarmkodeToggle', () => {
	test('should have a theme variable to use', () => {
		expect.hasAssertions();
		expect(get(theme)).toEqual('dark' || 'light');
	})
	test('should render DarkmodeToggle.svelte', () => {
		render(DarkmodeToggle);
	})
	test(`should toggle the theme`, async () => {
		const { getByTestId } = render(DarkmodeToggle);
		const initialTheme = get(theme);
		const oppositeTheme = (initialTheme === 'light') ? 'dark' : 'light';
		const button = getByTestId('darkmode-toggle');
		await fireEvent.click(button);
		expect(get(theme)).toEqual(oppositeTheme);
	})
});
