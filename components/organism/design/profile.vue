<template>
    <el-card class="profile">
        <template #header>
            <div class="profile__header">
                <div>
                    <el-button :icon="Share" text circle :disabled="true">

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
        <p>EN Chu</p>
    </el-card>
</template>
<script setup lang="ts">
import QrCode from '@/assets/icon/qr-code-sharp.svg'
import { Share, CollectionTag } from '@element-plus/icons-vue';
</script>
<style lang="scss" scoped>
.icon {
    height: 1em;
    width: 1em;
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
}
</style>