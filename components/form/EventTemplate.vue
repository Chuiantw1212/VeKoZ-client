<template>
    <el-form class="form">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="主辦單位">
                    <el-select v-model="organization.organizer" placeholder="請選擇現有組織">
                        <el-option v-for="(item, index) in organizationList" :key="index" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="">
                    <el-input v-model="organization.organizer" placeholder="或直接輸入單位名稱"></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="描述">
            <AtomVenoniaEditor class="form__item" v-model="organization.descrption"></AtomVenoniaEditor>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import type { IOrganization } from '~/types/organization'
const emit = defineEmits(['update:modelValue'])
const repoOrganization = useRepoOrganization()

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const organization = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

const organizationList = ref<IOrganization[]>([])

// methods
async function getOrganizationList() {
    const result = await repoOrganization.getOrganizationList()
    organizationList.value = result
}

onMounted(() => {
    getOrganizationList()
})
</script>
<style lang="scss" scoped>
.form {
    .form__item {
        width: 100%;
    }
}
</style>