<template>
    <el-card class="profile">
        <template #header>
            <div class="profile__header">
                <div>
                    <el-button :icon="Share" text circle :disabled="true">
                    </el-button>
                    <el-button text circle :disabled="true" :icon="Menu">
                    </el-button>
                </div>
                <el-button :icon="CollectionTag" :disabled="true">
                    訂閱
                </el-button>
            </div>
        </template>
        <div v-if="user.designs">
            <template v-for="(design, index) in user.designs">
                <!-- <OrganismDesignBanner v-if="design.type === 'banner'" v-model="user.designs[index]" :isDesigning="true"
                    :show-label="false"></OrganismDesignBanner> -->
                <OrganismDesignEventHistory v-if="design.type === 'eventHostHistory'">

                </OrganismDesignEventHistory>
                <OrganismDesignAvatarUploader v-if="design.type === 'avatar'" v-model="user.designs[index]"
                    :isDesigning="true" :show-label="false">
                </OrganismDesignAvatarUploader>
                <OrganismDesignHeader1 v-if="design.type === 'header1'" v-model="user.designs[index]"
                    :isDesigning="true" :show-label="false">

                </OrganismDesignHeader1>
                <OrganismDesignTextarea v-if="design.type === 'textarea'" v-model="user.designs[index]"
                    :isDesigning="true" :show-label="false">
                </OrganismDesignTextarea>
                <OrganismDesignSocialMedia v-if="design.type === 'socialMedia'" :model-value="user.designs[index]"
                    :isDesigning="true" :show-label="false">
                </OrganismDesignSocialMedia>
            </template>
        </div>
    </el-card>
</template>
<script setup lang="ts">
import { Menu, Share, CollectionTag } from '@element-plus/icons-vue';
import type { IUser } from '~/types/user';
const user = defineModel<IUser>('modelValue', {
    type: Object,
    default: {
        seoName: '',
        designs: [],
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
}
</style>