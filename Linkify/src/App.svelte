<script>
	import Login from "./Login.svelte";
	import Link from "./Link.svelte";
	import Profile from "./Profile.svelte";

	let token = "";
	let id = "";

	const urlParams = new URLSearchParams(window.location.search);
	let tok = urlParams.get("token");
	id = urlParams.get("id");

	if (localStorage.getItem("spotify_token")) { // add timeout logic
		token = localStorage.getItem("spotify_token")
		id = localStorage.getItem("id");
	} else if (tok) {
		token = tok;
		localStorage.setItem("spotify_token", tok);
		localStorage.setItem("id", id);
		window.location = window.location.origin
	}
	
</script>

<main>
	{#if token}
	<Profile />
	{/if}
	<h1>Linkify</h1>
	<h2>Automatically queue a Spotify song to play after another song</h2>

	{#if token}
		
		<Link/>
	{:else}
		<Login />
	{/if}
</main>

<style>
	main {
		padding-left: 5%;
	}

	h1 {
		font-size: 4em;
		font-weight: 100;
		margin-bottom: 5px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
