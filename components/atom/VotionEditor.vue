<template>
    <ClientOnly>
        CKEditor測試
        
        <ckeditor v-model="data" :editor="ClassicEditor" :config="config" />
    </ClientOnly>
</template>

<script setup>
const { $ckeditorConfig } = useNuxtApp()
const data = ref('<p>Hello world!</p>');

const config = computed(() => {
    return {
        ...$ckeditorConfig
    };
});
</script>
