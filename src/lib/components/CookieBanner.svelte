<script>
	import Cookies from 'js-cookie';
	import { fade } from 'svelte/transition';
	import { onMount, createEventDispatcher } from 'svelte';

	function validate(choice, cookieChoices) {
		const choices = Object.keys(choice);
		const chosen = Object.keys(cookieChoices);

		if (chosen.length !== choices.length) {
			return false;
		}

		return chosen.every((c) => choices.includes(c));
	}

	const dispatch = createEventDispatcher();

	export let cookieName = null;

	let shown = false;
	let settingsShown = false;

	export let heading = 'GDPR Notice';
	export let description =
		'We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.';

	export let categories = {
		analytics: function () {},
		tracking: function () {},
		marketing: function () {},
		necessary: function () {}
	};

	export let cookieConfig = {};

	const defaults = {
		sameSite: `'strict'`
	};

	export let choices = {};
	const choicesDefaults = {
		necessary: {
			label: 'Necessary cookies',
			description: "Necessary for this site to function as intended. Can't be turned off.",
			value: true
		}
		// tracking: {
		//   label: 'Tracking cookies',
		//   description: 'Used for advertising purposes.',
		//   value: true,
		// },
		// analytics: {
		//   label: 'Analytics cookies',
		//   description:
		//     'Used to control Google Analytics, a 3rd party tool offered by Google to track user behavior.',
		//   value: true,
		// },
		// marketing: {
		//   label: 'Marketing cookies',
		//   description: 'Used for marketing data.',
		//   value: true,
		// },
	};

	$: choicesMerged = Object.assign({}, choicesDefaults, choices);

	$: choicesArr = Object.values(choicesMerged).map((item, index) => {
		return Object.assign({}, item, { id: Object.keys(choicesMerged)[index] });
	});

	$: cookieChoices = choicesArr.reduce((result, item, index, array) => {
		result[item.id] = item.value ? item.value : false;
		return result;
	}, {});

	export let acceptLabel = 'Accept cookies';
	export let settingsLabel = 'Cookie settings';
	export let closeLabel = 'Close settings';

	export function show() {
		shown = true;
	}

	onMount(() => {
		if (!cookieName) {
			throw new Error('You must set gdpr cookie name');
		}

		const cookie = Cookies.get(cookieName);
		if (!cookie) {
			show();
		}

		try {
			const { choices } = JSON.parse(cookie);
			const valid = validate(cookieChoices, choices);

			if (!valid) {
				throw new Error('cookie consent has changed');
			}

			execute(choices);
		} catch (e) {
			removeCookie();
			show();
		}
	});

	function setCookie(choices) {
		const expires = new Date();
		expires.setDate(expires.getDate() + 365);

		const options = Object.assign({}, defaults.sameSite, cookieConfig, {
			expires
		});
		Cookies.set(cookieName, JSON.stringify({ choices }), options);
	}

	function removeCookie() {
		const { path } = cookieConfig;
		Cookies.remove(cookieName, Object.assign({}, path ? { path } : {}));
	}

	function execute(chosen) {
		const types = Object.keys(cookieChoices);

		types.forEach((t) => {
			const agreed = chosen[t];
			if (choicesMerged[t]) {
				choicesMerged[t].value = agreed;
			}
			if (agreed) {
				categories[t] && categories[t]();
				dispatch(`${t}`);
			}
		});
		shown = false;
	}

	function choose() {
		setCookie(cookieChoices);
		execute(cookieChoices);
	}
</script>

{#if shown}
	<div class="cookieConsentWrapper" transition:fade>
		<div class="cookieConsent">
			<div class="cookieConsent__Left">
				<div class="cookieConsent__Content">
					<p class="cookieConsent__Title">{heading}</p>
					<p class="cookieConsent__Description">
						{@html description}
					</p>
				</div>
			</div>
			<div class="cookieConsent__Right">
				<button
					type="button"
					class="cookieConsent__Button"
					on:click={() => {
						settingsShown = true;
					}}
				>
					{settingsLabel}
				</button>
				<button type="submit" class="cookieConsent__Button" on:click={choose}>
					{acceptLabel}
				</button>
			</div>
		</div>
	</div>
{/if}

{#if settingsShown}
	<div class="cookieConsentOperations" transition:fade>
		<div class="cookieConsentOperations__List">
			{#each choicesArr as choice}
				{#if Object.hasOwnProperty.call(choicesMerged, choice.id) && choicesMerged[choice.id]}
					<div class="cookieConsentOperations__Item" class:disabled={choice.id === 'necessary'}>
						<input
							type="checkbox"
							id={`gdpr-check-${choice.id}`}
							bind:checked={choicesMerged[choice.id].value}
							disabled={choice.id === 'necessary'}
						/>
						<label for={`gdpr-check-${choice.id}`}>{choice.label}</label>
						<span class="cookieConsentOperations__ItemLabel">
							{choice.description}
						</span>
					</div>
				{/if}
			{/each}
			<button
				type="submit"
				class="cookieConsent__Button cookieConsent__Button--Close"
				on:click={() => {
					settingsShown = false;
				}}
			>
				{closeLabel}
			</button>
		</div>
	</div>
{/if}

<style lang="scss">
	@use 'src/lib/style/definitions' as *;

	.cookieConsentWrapper {
		z-index: 99990;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: $phthalo-blue-500;
		color: $ghost-white-500;
		padding: 20px;
		transition: 200ms;
	}

	.cookieConsent {
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.cookieConsent__Title {
		margin: 0;
		font-weight: bold;
	}

	// .cookieConsent__Description {
	//   margin: 10px 0 0;
	// }

	// .cookieConsent__Description a {
	//   color: $ghost-white-500;
	//   text-decoration: underline;
	// }

	// .cookieConsent__Description a:hover {
	//   text-decoration: none;
	// }

	.cookieConsent__Right {
		display: flex;
		justify-content: end;
		align-items: flex-end;
	}

	.cookieConsentOperations {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		transition: 300ms;
		will-change: transform;
		z-index: 99999;
	}

	.cookieConsentOperations .cookieConsentOperations__List {
		transform: scale(1);
		border-radius: 1.5rem;
		max-width: 95%;
	}

	.cookieConsentOperations__List {
		background: $phthalo-blue-500;
		color: $caribbean-green-500;
		max-width: 100%;
		@media (min-width: $sm-screen) {
			max-width: 500px;
		}
		padding: 40px;
		margin: auto;
		overflow-y: auto;
		box-sizing: border-box;
		max-height: 100vh;
		transition: 200ms transform;
		will-change: transform;
		transform: scale(0.95);
	}

	.cookieConsentOperations__Item {
		display: block;
		padding-left: 60px;
		margin-bottom: 20px;
	}

	.cookieConsentOperations__Item.disabled {
		color: $ghost-white-900;
	}

	.cookieConsentOperations__Item.disabled label::after {
		opacity: 0.3;
	}

	.cookieConsentOperations__Item input {
		display: none;
	}

	.cookieConsentOperations__Item label {
		align-items: center;
		font-size: 22px;
		font-weight: bold;
		display: block;
		position: relative;
	}

	.cookieConsentOperations__Item label::before {
		content: '';
		display: block;
		left: -60px;
		background: $ghost-white-800;
		height: 20px;
		border-radius: 20px;
		width: 40px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.cookieConsentOperations__Item label::after {
		content: '';
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: $phthalo-blue-500;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: -58px;
		transition: 200ms;
	}

	.cookieConsentOperations__Item input:checked + label::after {
		transform: translate(20px, -50%);
	}

	.cookieConsent__Button {
		padding: 10px 14px;
		display: block;
		background: $tropical-gradient;
		color: $ghost-white-500;
		white-space: nowrap;
		border: 0;
		border-radius: 0.375rem;
		font-size: 16px;
		margin-left: 10px;
		cursor: pointer;
		transition: 200ms;
	}

	.cookieConsent__Button--Close {
		background: $tropical-gradient;
		color: $ghost-white-500;
		border-radius: 0.375rem;
		margin: 40px 0 0 60px;
		padding: 10px 14px;
	}

	.cookieConsent__Button:hover {
		opacity: 0.6;
	}

	@media only screen and (max-width: 900px) {
		.cookieConsent {
			display: block;
		}

		.cookieConsent__Right {
			margin-top: 20px;
		}

		.cookieConsent__Button {
			margin: 0 10px 10px 0;
		}

		.cookieConsent__Button--Close {
			margin: 40px 0 0;
		}
	}
</style>
