<template>
    <div class="profile">
        <section class="profile__bg"></section>
        <FormPublicInfoTemplate v-if="userForm.id" v-model="userForm" :is-designing="false"></FormPublicInfoTemplate>
        <el-empty v-else description="查無此人">
            <ol>
                可能的原因如下
                <li>專屬網址變更</li>
                <li>用戶非公開</li>
                <li>用戶已註銷</li>
            </ol>
            <NuxtLink to="/">回首頁</NuxtLink>
        </el-empty>
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
    title: '',
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
        title: user.seoTitle || user.name,
        subtitle: user.seoSubtitle || '',
        description: user.description,
        banner: user.banner,
        image: user.avatar,
        seoName: user.seoName,
        id: user.id ?? '',
        sameAs: user.sameAs,
        followerCount: user.followerCount,
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