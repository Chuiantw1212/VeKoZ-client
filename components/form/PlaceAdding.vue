<template>
    <el-alert type="info" show-icon :closable="false">
        <ul>
            <li>
                郊山、廣場、借來的場地，任何常用但是沒有控制權的空間，無歸屬任何組織
            </li>
            <li>這個功能主要是空間擁有者，以及早期用戶沒有連動來源時使用。</li>
        </ul>

    </el-alert>
    <el-form class="placeForm" :model="form" label-width="auto" :rules="formRules">
        <el-form-item label="所屬組織" prop="organizationId">
            <el-input v-if="disabled" :model-value="form.organizationName" :disabled="disabled">
            </el-input>
            <el-select v-else v-model="form.organizationId" placeholder="請選擇" :disabled="disabled"
                @change="handleOrganizationChanged($event)">
                <el-option v-for="(item, index) in membershipList" :key="index" :label="`${item.organizationName}`"
                    :value="String(item.organizationId)" />
            </el-select>
        </el-form-item>
        <el-form-item label="地點名稱" prop="name">
            <el-input v-model="form.name" placeholder="請輸入" :disabled="disabled" :maxlength="30"
                :show-word-limit="true" />
        </el-form-item>
        <el-form-item label="地點描述" prop="description">
            <el-input v-model="form.description" placeholder="請輸入描述、附近地標、接駁資訊等等" maxlength=" 150" type="textarea"
                :show-word-limit="true" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="addressRegion">
            <el-select v-model="form.addressRegion" :disabled="disabled" placeholder="請選擇">
                <el-option v-for="(item, index) in taiwanRegions" :key="index" :label="`${item.label}`"
                    :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="詳細地址" prop="address">
            <el-input v-model="form.address" :disabled="disabled" placeholder="輸入GoolgeMap可用地址" :show-word-limit="true"
                :maxlength="120"></el-input>
        </el-form-item>
    </el-form>
    <el-divider>用戶視角 Google Map</el-divider>
    <iframe class="placeForm__iframe" :src="getMapSrc()" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import type { IOrganizationMember } from '~/types/organization'
import type { IPlace } from '~/types/place'

const emit = defineEmits(['update:modelValue'])
const embedApiKey = ref<string>('AIzaSyAb9Vd0fh6OvobZfp0NQEupj3LV_-KW0gc')
const repoPlace = useRepoPlace()
const repoMeta = useRepoMeta()
const repoOrganizationMember = useRepoOrganizationMember()
const repoUser = useRepoUser()

const form = defineModel<IPlace>('modelValue', {
    default: {
        organizationId: 'public',
    }
})

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    }
})

const membershipList = ref<IOrganizationMember[]>([])
const taiwanRegions = ref<any[]>([])

// Hooks
onMounted(async () => {
    // 每次開窗觸發
    getMetaTaiwanCities()
    getMemberOrganizationList()
})

const formRules = {
    // organizationId: { required: true, message: '歸屬組織必填' },
    name: { required: true, message: '地點名稱必填' },
    description: { required: true, message: '地點描述必填' },
    addressRegion: { required: true, message: '所在城市必填' },
    address: { required: true, message: '詳細地址必填' },
}

// Methods
async function handleOrganizationChanged(organizationId: string) {
    repoUser.patchUserPreference('place', {
        organizationId,
    })
    const selectedMembership = membershipList.value.find(member => {
        return member.organizationId === organizationId
    })
    if (selectedMembership) {
        form.value.organizationLogo = selectedMembership.organizationLogo
        form.value.organizationName = selectedMembership.organizationName
    }
}

async function getMemberOrganizationList() {
    const result = await repoOrganizationMember.getMemberOrganizationList({
        allowMethods: ['GET'],
    })
    if (result) {
        membershipList.value = [
            {
                organizationId: 'public',
                // organizationId: 'any',
                organizationName: '無歸屬任何組織',
            },
            ...result.items
        ]
    }
}

function getMapSrc() {
    const apiKey = embedApiKey.value
    const address = form.value.address
    const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${address}`
    return src
}

// async function getPlaceList() {
//     const result = await repoPlace.getPlaceList()
//     placeList.value = result
// }

async function getMetaTaiwanCities() {
    const result = await repoMeta.getMetaSelectById('taiwan')
    taiwanRegions.value = result
}


</script>
<style lang="scss" scoped>
.placeForm {
    margin-top: 20px;
}

.placeForm__iframe {
    width: 100%;
    height: 450px;
}

.mt-20 {
    margin-top: 20px;
}
</style>