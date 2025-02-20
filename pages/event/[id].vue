<template>
    <div v-if="event" class="event">
        活動表單的呈現頁面，要可以被iFrame完美鑲嵌。
        <img :src="event.banner">
        <!-- <row></row> -->
    </div>
</template>
<script setup lang="ts">
import type { IEvent } from '~/types/event'

const repoEvent = useRepoEvent()
const route = useRoute()

const event = ref<IEvent>()

onMounted(() => {
    getEvent()
})
// Methods
async function getEvent() {
    const { id } = route.params
    if (id) {
        const result = await repoEvent.getEvent(String(id))
        console.log({
            result
        })
    }
}
</script>
<style lang="scss" scoped>
.event {}
</style>