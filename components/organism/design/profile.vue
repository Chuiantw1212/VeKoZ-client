<template>
    <el-card class="profile">
        <template #header>
            <div class="profile__header">
                <div>
                    <el-button :icon="Share" text circle :disabled="true">
                        <!-- <el-icon size="32">
                            <Share />
                        </el-icon> -->
                    </el-button>
                    <el-button text circle :disabled="true">
                        <img class="icon" :src="QrCode">
                    </el-button>
                </div>
                <el-button :icon="CollectionTag" :disabled="true">
                    訂閱
                </el-button>
            </div>
        </template>
        <img class="profile__avatar" src="@/assets/mock/user.jpg">
        <h1 class="profile__name">EN Chu</h1>
        <div>
            <OrganismDesignTextarea v-model="user.descriptionDesign" :isDesigning="true" :show-label="false">
            </OrganismDesignTextarea>
        </div>
        <div class="profile__socialLinks">
            <el-button class="socialLinks__icon" text circle>
                <img class="link__icon" src="@/assets/icon/email.svg">
            </el-button>
            <el-button class="socialLinks__icon" text circle>
                <img class="link__icon" src="@/assets/icon/facebook-circle.svg">
            </el-button>
            <el-button class="socialLinks__icon" text circle>
                <img class="link__icon" src="@/assets/icon/instagram.svg">
            </el-button>
            <el-button class="socialLinks__icon" text circle>
                <img class="link__icon" src="@/assets/icon/line-logo.svg">
            </el-button>
            <el-button class="socialLinks__icon" text circle>
                <img class="link__icon" src="@/assets/icon/youtube.svg">
            </el-button>
            <el-button class="socialLinks__icon" text circle>
                <img class="link__icon" src="@/assets/icon/web.svg">
            </el-button>
        </div>
    </el-card>
</template>
<script setup lang="ts">
import QrCode from '@/assets/icon/qr-code-sharp.svg'
import { Share, CollectionTag } from '@element-plus/icons-vue';
import type { IUser } from '~/types/user';
const user = defineModel('modelValue', {
    type: Object,
    default: {
        seoName: '',
        descriptionDesign: {
            type: 'textarea',
            value: '',
            alignment: 'center',
        },
    }
})

</script>
<style lang="scss" scoped>
.icon {
    height: 24px;
    width: 24px;
}

.profile {
    :deep(.el-card__header) {
        border-bottom: 0px;

    }

    .profile__header {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        height: 32px; // template共同高度

        >* {
            margin-bottom: 0px; // 除掉form-item的maargon-bottom
        }
    }

    .profile__avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: auto;
        display: block;
    }

    .profile__name {
        text-align: center;
        margin: 1.25rem 0px;
    }

    .profile__socialLinks {
        display: flex;
        margin: auto;
        gap: 8px;
        justify-content: center;

        .socialLinks__icon {
            width: 40px;
            height: 40px;
        }

        .link__icon {
            width: 24px;
            height: 24px;
            // border-radius: 50%;
            margin: auto;
            display: block;
        }
    }
}
</style>