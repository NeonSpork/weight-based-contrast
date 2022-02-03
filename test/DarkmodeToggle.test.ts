import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import DarkmodeToggle from './../src/lib/components/DarkmodeToggle.svelte';
import { expect } from 'chai';

describe('DarmkodeToggle.svelte', () => {
	afterEach(() => cleanup());
	it('should render DarmodeToggle.svelte', async () => {
		const dm = render(DarkmodeToggle);
		expect(dm).to.be.a('element');
	})
});
