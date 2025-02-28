<template>
    <div class="profile">
        <section class="profile__bg"></section>
        <!-- {{ userForm }} -->
        <el-main class="profile__template">
            <FormUserTemplate v-model="userForm" :is-designing="false"></FormUserTemplate>
        </el-main>
    </div>
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
<style lang="scss" scoped>
.profile {
    .profile__bg {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        // min-height: 100vh;
        // background-image: url('@/assets/mock/background.jpg');
        background-size: cover;
        background-position: center;
        filter: brightness(50%);
        // background-repeat: no-repeat;
        // opacity: 2;
        z-index: -10;
    }

    .profile__template {
        z-index: 10;
    }
}
</style>