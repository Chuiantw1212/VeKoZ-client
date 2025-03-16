<template>
    <el-alert type="info" show-icon :closable="false">
        連動空間管理夥伴的既存地點。比如：X樹屋。
    </el-alert>
    <el-form class="placeForm" label-width="auto">
        <!-- https://element-plus.org/en-US/component/select.html#remote-search -->
        <el-form-item label="空間管理組織" prop="organizationId">
            <el-select v-model="searchForm.name" filterable remote reserve-keyword :remote-method="getOrganizationList"
                placeholder="請選擇">
                <el-option v-for="(item, index) in organizationList" :key="index" :label="`${item.name}`"
                    :value="String(item.name)" @click="selectOrganization(item)" />
            </el-select>
        </el-form-item>
        <el-form-item label="組織所屬空間">
            <el-select v-model="selectedPlaceId" placeholder="請選擇" @change="onPlaceChanged($event)">
                <el-option v-for="(item, index) in placeList" :key="index" :label="`${item.name}`"
                    :value="String(item.id)" />
            </el-select>
        </el-form-item>
    </el-form>
    <el-divider>空間資訊</el-divider>
    <el-form class="placeForm" label-width="auto">
        <el-form-item label="地點名稱" prop="name">
            <el-input v-model="currentPlace.name" placeholder="請輸入" :maxlength="30" :show-word-limit="true"
                :disabled="true" />
        </el-form-item>
        <el-form-item label="地點描述" prop="description">
            <el-input v-model="currentPlace.description" :disabled="true" placeholder="請輸入描述、附近地標、接駁資訊等等"
                maxlength=" 150" type="textarea" :show-word-limit="true"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="addressRegion">
            <el-select v-model="currentPlace.addressRegion" :disabled="true" placeholder="請選擇">
                <el-option v-for="(item, index) in taiwanRegions" :key="index" :label="`${item.label}`"
                    :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="詳細地址" prop="address">
            <el-input v-model="currentPlace.address" :disabled="true" placeholder="輸入GoolgeMap可用地址"
                :show-word-limit="true" :maxlength="120"></el-input>
        </el-form-item>
    </el-form>
    <iframe class="placeForm__iframe" :src="getMapSrc()" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
</template>
<script setup lang="ts">
import type { IOrganization, IOrganizationMember, IOrganizationQuery } from '~/types/organization'
import type { IPlace } from '~/types/place'
const emit = defineEmits(['update:modelValue'])
const id = ref<string>(crypto.randomUUID())
const embedApiKey = ref<string>('AIzaSyAb9Vd0fh6OvobZfp0NQEupj3LV_-KW0gc')
const repoPlace = useRepoPlace()
const repoMeta = useRepoMeta()
const repoOrganization = useRepoOrganization()
const repoOrganizationMember = useRepoOrganizationMember()
const repoUI = useRepoUI()
const searchForm = ref<IOrganizationQuery>({
    name: '',
})
const selectedPlaceId = ref<string>()
const currentPlace = ref<IPlace>({})
const organizationList = ref<IOrganization[]>([])
const placeList = ref<IPlace[]>([])
const isLoading = ref<boolean>(false)
const membershipList = ref<IOrganizationMember[]>([])
const taiwanRegions = ref<any[]>([])

// Hooks
onMounted(async () => {
    // 每次開窗觸發
    getMetaTaiwanCities()
    getMemberOrganizationList()
})

// Methods
async function onPlaceChanged(placeId: string) {
    const selectedPlace = placeList.value.find(place => {
        return place.id === placeId
    })
    if (selectedPlace) {
        currentPlace.value = selectedPlace
    }
}

async function selectOrganization(organization: IOrganization) {
    const result = await repoPlace.getPlaceList({
        organizationId: organization.id
    })
    placeList.value = result
}

async function getMemberOrganizationList() {
    const result = await repoOrganizationMember.getMemberOrganizationList({
        allowMethods: ['GET'],
    })
    if (result) {
        membershipList.value = [
            {
                organizationId: 'public',
                organizationName: '無歸屬任何組織',
            },
            ...result.items
        ]
    }
}

function getMapSrc() {
    const apiKey = embedApiKey.value
    const address = currentPlace.value.address
    const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${address}`
    return src
}

async function getMetaTaiwanCities() {
    const result = await repoMeta.getMetaSelectById('taiwan')
    taiwanRegions.value = result
}

async function getOrganizationList(name: string) {
    if (!String(name).trim()) {
        return
    }
    isLoading.value = true
    repoUI.debounce(id.value, async () => {
        const result = await repoOrganization.getOrganizationList({
            name,
        })
        organizationList.value = result
        isLoading.value = false
    })
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