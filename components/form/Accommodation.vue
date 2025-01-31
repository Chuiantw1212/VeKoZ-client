<template>
    <el-form :model="form" label-width="auto">
        <el-form-item label="名稱">
            <el-input v-model="form.name" placeholder="請輸入" :maxlength="30" :show-word-limit="true" />
        </el-form-item>
        <el-form-item label="地址">
            <el-input v-model="form.address" placeholder="請輸入" :show-word-limit="true" />
        </el-form-item>
        <el-form-item label="描述">
            <el-input v-model="form.description" placeholder="請輸入" :show-word-limit="true" />
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import type { IAccommodation } from '~/types/accommodation'
const emit = defineEmits(['update:modelValue'])
const repoAccommodation = useRepoAccommodation()
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

const accommodationList = ref<IAccommodation[]>([])

// methods
async function getAccommodationList() {
    const result = await repoAccommodation.getAccommodationList()
    accommodationList.value = result
}

onMounted(() => {
    getAccommodationList()
})
</script>