<script lang="ts">
  import type { ActionData } from "./$types";

  export let form: ActionData;
  console.log(form);
</script>

<div class="h-screen w-screen flex items-center justify-center">
  <div class="flex flex-col text-center">
    <h1 class="py-5 text-lg">Please enter password</h1>
    <form method="POST" class="w-72">
      <input type="password" name="password" class="w-full py-5 px-1 my-2 border rounded-lg" />
      <button type="submit" class="text-white bg-blue-900 px-5 py-2 rounded-lg">Submit</button>
    </form>
    {#if form?.success === false}
      <div class="py-5 text-red-800 text-lg">You entered the wrong password</div>
    {/if}
  </div>
</div>
