<script>
    function logout() {
        localStorage.clear();
        window.location = window.location; //refresh
    }
</script>

<div id="profile">
    <div>Nathan</div>
    <button on:click={logout}>Logout</button>
</div>

<style>
    button {
        width: 100px;
    }

    #profile {
        padding-right: 20px;
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        align-items: center;
    }
</style>