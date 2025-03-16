<template>
    <!-- <el-form-item class="mt-20" label="連動既存地點">
    </el-form-item>
    <el-divider>地點詳細資料</el-divider> -->
    <el-alert type="info" show-icon :closable="false">
        連動空間管理夥伴的既存地點。比如：X樹屋。
        <!-- <ol>
            <li>
            </li>
            <li>
                未來連動既存地點，可以將沒有管理權限的地點加入常用地點
            </li>
        </ol> -->
        <!-- 
        1. 連動後的地點，uid將為自己，但是要被原屬的地點透過sourceId更新
        -->
    </el-alert>
    <el-form class="placeForm" :model="searchForm" label-width="auto" :rules="searchFormRules">
        <el-form-item label="空間管理組織" prop="organizationId">
            <el-input placeholder="搜尋現有組織" :maxlength="30" :show-word-limit="true" :prefix-icon="Search">
            </el-input>
            <!-- <el-select v-model="form.organizationId" placeholder="請選擇" @change="handleOrganizationChanged($event)">
                <el-option v-for="(item, index) in membershipList" :key="index" :label="`${item.organizationName}`"
                    :value="String(item.organizationId)" />
            </el-select> -->
        </el-form-item>
        <el-form-item label="組織所屬空間" prop="name">
            <el-input v-model="form.name" placeholder="請輸入" :maxlength="30" :show-word-limit="true" :disabled="true" />
        </el-form-item>
    </el-form>
    <el-form class="placeForm" :model="form" label-width="auto" :rules="formRules">
        <!--  -->
        <el-form-item label="地點名稱" prop="name">
            <el-input v-model="form.name" placeholder="請輸入" :maxlength="30" :show-word-limit="true" :disabled="true" />
        </el-form-item>
        <el-form-item label="地點描述" prop="description">
            <el-input v-model="form.description" :disabled="true" placeholder="請輸入描述、附近地標、接駁資訊等等" maxlength=" 150"
                type="textarea" :show-word-limit="true"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="addressRegion">
            <el-select v-model="form.addressRegion" :disabled="true" placeholder="請選擇">
                <el-option v-for="(item, index) in taiwanRegions" :key="index" :label="`${item.label}`"
                    :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="詳細地址" prop="address">
            <el-input v-model="form.address" :disabled="true" placeholder="輸入GoolgeMap可用地址" :show-word-limit="true"
                :maxlength="120"></el-input>
        </el-form-item>
        <!-- <el-col>
            <el-form-item :span="12" label="地址能見度">
                <el-switch v-model="form.publicAccess" inline-prompt active-text="購票前可見" inactive-text="購票後可見" />
            </el-form-item>
        </el-col> -->
    </el-form>
    <iframe class="placeForm__iframe" :src="getMapSrc()" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import type { IOrganizationMember } from '~/types/organization'
import type { IPlace, IPlaceQuery } from '~/types/place'

const emit = defineEmits(['update:modelValue'])
const embedApiKey = ref<string>('AIzaSyAb9Vd0fh6OvobZfp0NQEupj3LV_-KW0gc')
const repoPlace = useRepoPlace()
const repoMeta = useRepoMeta()
const repoOrganizationMember = useRepoOrganizationMember()
const repoUser = useRepoUser()

const searchForm = ref<IPlaceQuery>()
// const searchForm = defineModel<IPlaceQuery>('modelValue', {
//     default: {}
// })

const form = defineModel<IPlace>('modelValue', {
    default: {
        organizationId: 'public',
    }
})

const membershipList = ref<IOrganizationMember[]>([])

// const placeList = ref<IPlace[]>([])
const taiwanRegions = ref<any[]>([])

// Hooks
onMounted(async () => {
    // 每次開窗觸發
    getMetaTaiwanCities()
    getMemberOrganizationList()
})

const searchFormRules = {}

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