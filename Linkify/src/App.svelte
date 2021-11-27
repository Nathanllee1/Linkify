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
	<br>
	<div id="signup_card">
		<h3>Ever feel annoyed when there's two songs in an album and meant to be played together, but shuffling messes it all up?</h3>
		<h3>Do you have songs that you always want played together?</h3>
		<br>
		<h2>Linkify solves this by connecting to your Spotify account and automatically queues up the song of your choice when a specific song is played.</h2>
		<Login />
	</div>
		
		

	{/if}
</main>

<style>
	main {
		padding: 5%;
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

	#signup_card {
		background-color: white;
		color: black;
		padding: 30px;
		width: 80%;
		border-radius: 20px;
		margin: auto;
	}

	h3 {
		color: grey;
	}
</style>
