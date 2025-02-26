<template>
    <el-form class="placeForm" :model="form" label-width="auto">
        <el-form-item label="連動既存地點">
            <el-input placeholder="TODO搜尋現有地址" :maxlength="30" :show-word-limit="true" :disabled="true" :prefix-icon="Search">
            </el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="名稱">
            <el-input v-model="form.name" placeholder="請輸入" :maxlength="30" :show-word-limit="true" />
        </el-form-item>
        <el-form-item label="描述">
            <el-input v-model="form.description" placeholder="請輸入" maxlength=" 150" type="textarea"
            :show-word-limit="true"></el-input>
        </el-form-item>
        <el-form-item label="所在城市">
            <el-select v-model="form.addressRegion" placeholder="請選擇">
                <el-option v-for="(item, index) in taiwanPlaces" :key="index" :label="`${item.label}`"
                    :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="詳細地址">
            <el-input v-model="form.address" placeholder="輸入GoolgeMap可用地址" :show-word-limit="true"
                :maxlength="90"></el-input>
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
import type { IPlace } from '~/types/place'
const embedApiKey = ref<string>('AIzaSyAb9Vd0fh6OvobZfp0NQEupj3LV_-KW0gc')
const emit = defineEmits(['update:modelValue'])
const repoPlace = useRepoPlace()
const repoMeta = useRepoMeta()
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => { }
    }
})
const form = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

const placeList = ref<IPlace[]>([])
const taiwanPlaces = ref<any[]>([])

onMounted(() => {
    getPlaceList()
    getMetaTaiwanCities()
})

// methods
function getMapSrc() {
    const apiKey = embedApiKey.value
    const address = form.value.address
    const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${address}`
    return src
}

async function getPlaceList() {
    const result = await repoPlace.getPlaceList()
    placeList.value = result
}

async function getMetaTaiwanCities() {
    const result = await repoMeta.getMetaSelectById('taiwan')
    taiwanPlaces.value = result
}


</script>
<style lang="scss" scoped>
.placeForm__iframe {
    width: 100%;
    height: 450px;
}
</style>