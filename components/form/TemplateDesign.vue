<template>
    <div v-if="templateDesigns.length">
        <slot :index="0">

        </slot>
    </div>
    <el-form ref="formRef" class="designForm" label-width="auto" :model="formModel" :rules="formRules">
        <template v-for="(item, index) in templateDesigns">
            <!-- 必填寫欄位 -->
            <OrganismDesignHeader1 v-if="item.type === 'header1'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :required="item.required" :isDesigning="props.isDesigning"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)">
            </OrganismDesignHeader1>
            <OrganismDesignDateTimeRange v-if="item.type === 'dateTimeRange'" v-model="templateDesigns[index]"
                :id="item.id" :onchange="onchange" :isDesigning="props.isDesigning" :required="item.required"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)">
            </OrganismDesignDateTimeRange>
            <OrganismDesignOrganization v-if="item.type === 'organization'" v-model="templateDesigns[index]"
                :id="item.id" :onchange="onchange" :isDesigning="props.isDesigning" :required="item.required"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)">
            </OrganismDesignOrganization>
            <OrganismDesignOrganizationMember v-if="item.type === 'organizationMember'" v-model="templateDesigns[index]"
                :id="item.id" :onchange="onchange" :isDesigning="props.isDesigning" :required="item.required"
                :organization-id="getOrganizationId()" @dragstart="handleDragStart(index)" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignOrganizationMember>
            <OrganismDesignTextarea v-if="item.type === 'textarea'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" :required="item.required"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)">
            </OrganismDesignTextarea>
            <!-- 非必填寫欄位 -->
            <OrganismDesignInput v-if="item.type === 'input'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignInput>
            <OrganismDesignNumber v-if="item.type === 'number'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignNumber>
            <OrganismDesignPlace v-if="item.type === 'place'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignPlace>
            <OrganismDesignUrl v-if="item.type === 'url'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignUrl>
            <OrganismDesignDivider v-if="item.type === 'divider'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignDivider>
            <OrganismDesignEditor v-if="item.type === 'editor'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignEditor>
            <OrganismDesignSingleSelect v-if="item.type === 'singleSelect'" v-model="templateDesigns[index]"
                :id="item.id" :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignSingleSelect>
            <OrganismDesignOffer v-if="item.type === 'offer'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
            </OrganismDesignOffer>
            <OrganismDesignBanner v-if="item.type === 'banner'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :required="item.required" :isDesigning="props.isDesigning"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)">
            </OrganismDesignBanner>
            <!-- 拖曳釋放區域 -->
            <slot :index="Number(index + 1)">

            </slot>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { FormInstance } from 'element-plus'
const emit = defineEmits(['update:modelValue', 'focus', 'dragstart', 'remove', 'change'])
const templateDesigns = defineModel<ITemplateDesign[]>('modelValue', {
    type: Array,
    default: function () {
        return []
    }
})
const props = defineProps({
    isDesigning: {
        type: Boolean,
        default: false
    },
    onchange: {
        type: Function,
        default: () => { }
    },
})
const formRef = ref<FormInstance>()
const formModel = ref<{ [key: string]: any }>({})
const formRules = ref<{ [key: string]: any }>({})
// Hooks
watch(() => templateDesigns.value, () => {
    templateDesigns.value.forEach(design => {
        if (design.formField) {
            formModel.value[design.formField] = design.mutable?.value
            formRules.value[design.formField] = {
                required: true,
                message: `${design.mutable?.label}為必填`
            }
        }
    })
}, { immediate: true, deep: true })

// methods
async function validate() {
    return await formRef.value?.validate()
}

function getOrganizationId() {
    const organization = templateDesigns.value.find((design: ITemplateDesign) => {
        return design.type === 'organization'
    })
    if (organization) {
        return organization.mutable?.value
    }
}
function handleRemove(index: number) {
    const item = templateDesigns.value[index]
    emit('remove', {
        item,
        index,
    })
}
function handleDragStart(index: number) {
    const item = templateDesigns.value[index]
    emit('dragstart', {
        item: JSON.parse(JSON.stringify(item)),
        index,
    })
}
function handleUp(index: number) {
    const removedElements = templateDesigns.value.splice(index, 1)
    const target = removedElements[0]
    if (target) {
        const newIndex = Math.max(0, index - 1)
        templateDesigns.value.splice(newIndex, 0, target)
    }
}
function handleDown(index: number) {
    const removedElements = templateDesigns.value.splice(index, 1)
    const target = removedElements[0]
    if (target) {
        const newIndex = Math.min(templateDesigns.value.length, index + 1)
        templateDesigns.value.splice(newIndex, 0, target)
    }
}
defineExpose({
    validate,
})
</script>
<style lang="scss" scoped>
.designForm {
    width: 100%;
}
</style>