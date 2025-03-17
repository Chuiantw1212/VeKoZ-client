<template>
    <!-- 檢視與編輯用 -->
    <el-form-item v-if="!props.isDesigning" :label="customDesign.label" @dragstart="emit('dragstart')">
        <el-select v-if="customDesign" v-model="customDesign.placeId" :placeholder="placeholder" :clearable="true"
            :disabled="disabled" @change="setLocationValues($event)">
            <el-option v-for="(item, index) in placeList" :key="index" :label="item.name" :value="String(item.id)" />
        </el-select>
        <el-input v-if="customDesign" class="design__mt" placeholder="地址" :model-value="customDesign.placeAddress"
            :disabled="true"></el-input>
        <!-- <el-form-item label="詳細地址能見度"> -->
        <!-- 購票前可見 -->
        <el-switch v-if="customDesign" v-model="customDesign.placePublicAccess" inline-prompt active-text="購票前可見"
            inactive-text="購票前可見" />
        <!-- </el-form-item> -->
    </el-form-item>
    <!-- 樣板編輯專用 -->
    <MoleculeDesignToolbar v-else-if="customDesign" :loading="isLoading" :required="required"
        @dragstart="emit('dragstart')" @remove="emit('remove')" @moveUp="emit('moveUp')" @moveDown="emit('moveDown')">
        <template v-slot:label>
            <el-input v-model="customDesign.label" :maxlength="8" :show-word-limit="true" placeholder="欄位名稱"></el-input>
        </template>
        <template v-slot:default>
            <el-select v-model="customDesign.placeId" :placeholder="placeholder" :clearable="true" :disabled="disabled"
                @change="setLocationValues($event)">
                <el-option v-for="(item, index) in placeList" :key="index" :label="item.name"
                    :value="String(item.id)" />
            </el-select>
            <el-input class="design__mt" placeholder="地址" :model-value="customDesign.placeAddress"
                :disabled="true"></el-input>
            <!-- <el-form-item label="詳細地址能見度"> -->
            <!-- 購票前可見詳細地址 -->
            <el-switch v-model="customDesign.placePublicAccess" inline-prompt active-text="購票前可見"
                inactive-text="購票前可見" />
            <!-- </el-form-item> -->
        </template>
    </MoleculeDesignToolbar>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { IOrganizationMember } from '~/types/organization'
import type { IPlace } from '~/types/place'

const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown', 'dragstart',])
const repoPlace = useRepoPlace()
const isLoading = ref(false)
const repoUI = useRepoUI()
const repoUser = useRepoUser()
const repoOrganizationMember = useRepoOrganizationMember()
const membershipList = ref<IOrganizationMember[]>([])

const customDesign = defineModel<ITemplateDesign>('modelValue', {
    default: {
        type: 'place',
        label: '空間地點',
        placeId: '',
        placeName: '',
        placeAddressRegion: '', // 第一級行政區
        placeAddress: '',
    }
})
const props = defineProps({
    id: {
        type: String,
        default: crypto.randomUUID()
    },
    isDesigning: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '請選擇空間地點'
    },
    onchange: {
        type: Function,
        default: async () => { }
    },
    formField: {
        type: String,
        default: '',
    },
})
const placeList = ref<IPlace[]>([])

// Hooks
onMounted(() => {
    setDefaultValue()
})
watch(() => customDesign.value, (newValue) => {
    setDefaultValue()
    handleChange(newValue)
}, { deep: true })
watch(() => repoUser.userInfo, async () => {
    isLoading.value = true
    repoUI.debounce(props.id, async () => {
        await getMemberOrganizationList()
        getPlaceList()
        isLoading.value = false
    }, 1000)
}, { immediate: true })

// methods
function setDefaultValue() {
    if (customDesign.value.hasOwnProperty('placeId')) {
        return
    }
    const defaultValue: ITemplateDesign = {
        type: 'place',
        label: '空間地點',
        placeId: '',
        placeName: '',
        placeAddressRegion: '', // 第一級行政區
        placeAddress: '',
        placePublicAccess: false,
    }
    if (props.formField) {
        defaultValue.formField = props.formField
    }
    const mergedItem = Object.assign(defaultValue, customDesign.value)
    customDesign.value = mergedItem
}

async function handleChange(templateDesign: any) {
    isLoading.value = true // 增強體驗
    repoUI.debounce(props.id, async function () {
        await props.onchange(templateDesign)
        isLoading.value = false
    })
}

function setLocationValues(placeId: string) {
    if (!placeId) {
        return
    }
    const selectedItem = placeList.value.find(item => {
        return item.id === placeId
    })
    if (selectedItem && customDesign.value) {
        customDesign.value.placeName = selectedItem.name
        customDesign.value.placeAddress = selectedItem.address
        customDesign.value.placeAddressRegion = selectedItem.addressRegion
        customDesign.value.placeId = selectedItem.id
    }
}

async function getPlaceList() {
    const results = await Promise.all([
        getConnectedPlaces(),
        getCreatedPlaceList(),
    ])
    const items = results.reduce((pre, current) => {
        return [...pre, ...current]
    }, [])
    placeList.value = items
}

async function getMemberOrganizationList() {
    const result = await repoOrganizationMember.getMemberOrganizationList({
        allowMethods: ['GET'],
    })
    if (result) {
        membershipList.value = result.items
    }
}

async function getConnectedPlaces() {
    const items = await repoPlace.getPlaceList({
        email: repoUser.userInfo.email,
    })
    return items
}

async function getCreatedPlaceList() {
    const organizationIds = membershipList.value.map(member => {
        return member.organizationId ?? ''
    })
    if (organizationIds) {
        const items = await repoPlace.getPlaceList({
            organizationIds: [...organizationIds, 'public'],
        })
        return items
    }
    return []
}
</script>
<style lang="scss" scoped>
.design__mt {
    margin-top: 4px;
}
</style>