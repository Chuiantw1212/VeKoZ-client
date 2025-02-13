<template>
    <el-form :model="form" label-width="auto">
        <p>Todo：改成用縣市行政區，以利搜索</p>
        <el-form-item label="名稱">
            <el-input v-model="form.name" placeholder="請輸入" :maxlength="30" :show-word-limit="true" />
        </el-form-item>
        <el-form-item label="地址">
            <el-input v-model="form.address" placeholder="請輸入" :show-word-limit="true" :maxlength="150" />
        </el-form-item>
        <el-form-item label="描述">
            <el-mention v-model="form.description" placeholder="請輸入" maxlength=" 150" type="textarea"
                :show-word-limit="true"></el-mention>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import type { IPlace } from '~/types/place'
const emit = defineEmits(['update:modelValue'])
const repoPlace = useRepoPlace()
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

// methods
async function getPlaceList() {
    const result = await repoPlace.getPlaceList()
    placeList.value = result
}

onMounted(() => {
    getPlaceList()
})
</script>