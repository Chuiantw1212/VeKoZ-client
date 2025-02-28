<template>
    <!-- <div> -->
    <div class="profile__socialMedia" :key="renderKey">
        <template v-for="(url, index) in socialUrls">
            <el-button v-if="url.includes('youtube.com/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/youtube.svg">
            </el-button>
            <el-button v-else-if="url.includes('facebook.com/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/facebook-circle.svg">
            </el-button>
            <el-button v-else-if="url.includes('x.com/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/x.svg">
            </el-button>
            <el-button v-else-if="url.includes('instagram.com/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/instagram.svg">
            </el-button>
            <el-button v-else-if="url.includes('pinterest.com/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/pinterest.svg">
            </el-button>
            <el-button v-else-if="url.includes('linkedin.com/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/linkedin.svg">
            </el-button>
            <el-button v-else-if="url.includes('line.me/ti/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/line-logo.svg">
            </el-button>
            <el-button v-else-if="url.includes('github.com/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/github.svg">
            </el-button>
            <el-button v-else-if="url.includes('reddit.com/')" class="socialMedia__icon" text circle
                @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/reddit.svg">
            </el-button>
            <el-button v-else-if="validateEmail(url)" class="socialMedia__icon" text circle @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/email.svg">
            </el-button>
            <el-button v-else class="socialMedia__icon" text circle @click="removeUrl(index)">
                <img class="link__icon" src="@/assets/icon/web.svg">
            </el-button>
        </template>
        <template v-if="!socialUrls.length">
            <!-- 示意圖： -->
            <el-button class="socialMedia__icon" text circle>
                <img class="link__icon" src="@/assets/icon/vekoz.svg">
            </el-button>
            <el-button class="socialMedia__icon" text circle>
                <img class="link__icon" src="@/assets/icon/vekoz.svg">
            </el-button>
            <el-button class="socialMedia__icon" text circle>
                <img class="link__icon" src="@/assets/icon/vekoz.svg">
            </el-button>
        </template>
    </div>
    <div class="socialMedia__add">
        <el-input v-model="socialMediaUrl" placeholder="請輸入連結(FB, IF, Email,......etc)">

        </el-input>
        <el-button :icon="Plus" @click="pushNewMedia()">

        </el-button>
    </div>
    <!-- </div> -->
</template>
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
const renderKey = ref<string>(crypto.randomUUID())
const socialMediaUrl = ref<string>('')
const socialUrls = defineModel<string[]>('modelValue', {
    required: true,
    default: [],
})
const props = defineProps({
    isDesigning: {
        type: Boolean,
        default: false
    }
})

// Methods
function pushNewMedia() {
    if (!socialUrls.value) {
        socialUrls.value = []
    }
    // if (socialMediaUrl.value) {
    socialUrls.value.push(socialMediaUrl.value)
    socialMediaUrl.value = ''
    renderKey.value = crypto.randomUUID()
    // }
}
function removeUrl(index: number) {
    if (socialUrls.value) {
        socialUrls.value.splice(index, 1)
        renderKey.value = crypto.randomUUID()
    }
}
function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
</script>
<style lang="scss" scoped>
.profile__socialMedia {
    display: flex;
    margin: auto 0px;
    gap: 8px;
    justify-content: center;
    min-height: 40px;
    align-items: center;

    .socialMedia__icon {
        width: 40px;
        height: 40px;
        position: relative;

        &:hover {
            ::before {
                content: 'X';
                width: 40px;
                height: 40px;
                position: absolute;
                left: 0px;
                top: 0px;
                color: lightcoral;
                font-size: 40px;
            }
        }

        .link__icon {
            width: 24px;
            height: 24px;
            display: block;
        }
    }
}

.socialMedia__add {
    display: flex;
    gap: 20px;
}
</style>