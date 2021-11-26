<script>
    import { onMount } from 'svelte';

    import Form from "./Form.svelte";
    import LinkItem from "./LinkItem.svelte";
    let links = [];

    onMount(async() => {
        const res = await fetch(`/links?id=${localStorage.getItem("id")}`);
        
        links = (await res.json()).links
        
    })

    
</script>

<div id="app_container" >
    
    {#each links as {root, link}, i}
    
    <LinkItem root={root} link={link} />
    {/each}

    <Form/>
</div>

<style>
    #app_container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 5%;
    }
</style>