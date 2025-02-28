<template>
    <FormUserTemplate v-model="userForm" :is-designing="false"></FormUserTemplate>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'profile'
})
import type { IUser } from '~/types/user';
const route = useRoute()
const repoUser = useRepoUser()
const userForm = ref<IUser>({
    id: '',
    name: '',
    description: '',
    seoName: '',
    seoTitle: '',
})

// Hooks
onMounted(() => {
    getPublicUserInfo()
})

// Methods
async function getPublicUserInfo() {
    const { seoName } = route.params as any
    const user = await repoUser.getPublicUser(seoName)
    userForm.value = user
}
</script>