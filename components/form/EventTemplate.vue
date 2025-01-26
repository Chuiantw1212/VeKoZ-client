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
                <!-- <el-space fill> -->
                <el-alert :closable="false">
                    請先用組織管理新增主辦單位
                </el-alert>
                <!-- </el-space> -->
            </el-col>
        </el-row>
        <el-divider>
            活動描述
        </el-divider>
        <el-form-item>
            <AtomVenoniaEditor v-model="organization.descrption"></AtomVenoniaEditor>
        </el-form-item>
        <!-- 那些很重要，但是參加者不需要知道的幕後 -->
        <el-divider>
            待辦事項
        </el-divider>
        <p>TODO: 未來會用更複雜的介面，讓樣板的欄位可以自選。</p>
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