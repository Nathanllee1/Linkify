<script>
    import Search from "./Search.svelte";
    let active = false;
    let root = '';
    let link = '';

    async function submit_form() {
        console.log("submitting", root.id, link.id)
        await fetch(`${BACKEND_URL}/linksubmit?root=${root.id}&link=${link.id}&id=${localStorage.getItem("id")}`, {method: "POST"});
        window.location = window.location;
    }
</script>

<div id="form_container" class="link_container">
    <h3>Create a Link</h3>
    <div id=forms>
        <Search bind:selected_value={root}/>
        <h1> 🔗 </h1>
        <Search bind:selected_value={link}/>
    </div>
    {#if root && link}
    <br>
    <button on:click={submit_form}>Submit</button>
    {/if}
    
</div>

<style>
    #forms {
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: space-around;
        
    }
</style>