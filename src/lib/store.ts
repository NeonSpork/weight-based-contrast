import { browser } from '$app/env';
import { writable } from 'svelte/store';

let canWrite = false;
if (browser) {
  canWrite = localStorage.cookieAccepted;
}

let theme = writable("dark");
if (browser && canWrite) {
  theme = writable(localStorage.theme);
  theme.subscribe((value) => {
    localStorage.setItem('theme', value === 'dark' ? 'dark' : 'light');
  });
}

export { theme };