<script>
  import { useChat } from "ai/svelte";
  const { input, handleSubmit, messages, setMessages } = useChat({ api: "/api" });

  function clear() {
    setMessages([]);
  }
</script>

<svelte:head>
  <title>LSEGatron</title>
  <meta name="description" content="The LSEG focussed chatbot & virtual assistant" />
</svelte:head>

<div class="flex flex-col md:flex-row w-full min-h-screen p-2">
  <div class="order-2 md:order-1 w-full md:w-2/3 flex flex-col overflow-y-auto">
    {#if $messages.length < 1}
      <div class="border rounded-lg h-96 text-gray-500">Your chat will appear here</div>
    {:else}
      <ul class="border rounded-lg h-96">
        {#each $messages as message}
          <li><span class="capitalize text-blue-900">{message.role}</span>: {message.content}</li>
        {/each}
      </ul>
    {/if}

    <form on:submit={handleSubmit} class="py-2">
      <input
        bind:value={$input}
        class="w-full py-5 px-1 my-2 border rounded-lg"
        placeholder="Ask LSEGatron something"
      />
      <div class="flex justify-between">
        <button type="submit" class="text-white bg-blue-900 px-5 py-2 rounded-lg">Submit</button>
        <button on:click={clear} class="text-white bg-gray-500 px-5 py-2 rounded-lg">Clear</button>
      </div>
    </form>
  </div>
  <div class="order-1 md:order-2 w-full md:w-1/3 px-2">
    <h1 class="text-3xl py-2 text-blue-900">LSEGatron</h1>
    <p class="py-1">Welcome to the custom LSEG virtual assistant, called LSEGatron.</p>
    <p class="py-1">
      LSEGatron should only answer questions about about LSEG and should be expected to refuse to answer
      questions about any other topic.
    </p>
  </div>
</div>
