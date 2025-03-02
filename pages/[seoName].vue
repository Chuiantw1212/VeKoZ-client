<template>
    <div class="profile">
        <section class="profile__bg"></section>
        <!-- {{ userForm }} -->
        <!-- <el-main class="profile__template"> -->
        <FormUserTemplate v-model="userForm" :is-designing="false"></FormUserTemplate>
        <!-- </el-main> -->
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'profile'
})
import type { IPublicInfoCard } from '~/types/ui';
import type { IUser } from '~/types/user';
const route = useRoute()
const repoUser = useRepoUser()
const userForm = ref<IPublicInfoCard>({
    id: '',
    name: '',
    description: '',
    seoName: '',
})

// Hooks
onMounted(() => {
    getUserSeoInfoInfo()
})

// Methods
async function getUserSeoInfoInfo() {
    const { seoName } = route.params as any
    const user = await repoUser.getUserSeoInfo(seoName)
    userForm.value = {
        name: user.seoTitle,
        description: user.description,
        banner: user.banner,
        image: user.avatar,
        seoName: user.seoName,
        id: user.id,
    }
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