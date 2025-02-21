<template>
    <div v-if="templateDesigns.length">
        <slot :index="0">

        </slot>
    </div>
    <!-- {{ templateDesigns }} -->
    <el-form ref="formRef" class="designForm" label-width="auto" :model="formModel" :rules="formRules">
        <template v-for="(item, index) in templateDesigns">
            <!-- 必填且限量的欄位 -->
            <OrganismDesignHeader1 v-if="item.type === 'header1'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :required="item.required" :isDesigning="props.isDesigning"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignHeader1>
            <OrganismDesignDateTimeRange v-if="item.type === 'dateTimeRange'" v-model="templateDesigns[index]"
                :id="item.id" :onchange="onchange" :isDesigning="props.isDesigning" :required="item.required"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignDateTimeRange>
            <OrganismDesignOrganization v-if="item.type === 'organization'" v-model="templateDesigns[index]"
                :id="item.id" :onchange="onchange" :isDesigning="props.isDesigning" :required="item.required"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignOrganization>
            <OrganismDesignOrganizationMember v-if="item.type === 'organizationMember'" v-model="templateDesigns[index]"
                :id="item.id" :onchange="onchange" :isDesigning="props.isDesigning" :required="item.required"
                :organization-id="getOrganizationId()" @dragstart="handleDragStart(index)" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignOrganizationMember>
            <OrganismDesignTextarea v-if="item.type === 'textarea'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" :required="item.required"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignTextarea>
            <!-- 限量的欄位 -->
            <OrganismDesignBanner v-if="item.type === 'banner'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" form-field="banner" :required="item.required" :isDesigning="props.isDesigning"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignBanner>
            <OrganismDesignPlace v-if="item.type === 'place'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignPlace>
            <OrganismDesignUrl v-if="item.type === 'virtualLocation'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" form-field="virtualLocation" :isDesigning="props.isDesigning"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignUrl>
            <OrganismDesignEventGroup v-if="item.type === 'eventGroup'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignEventGroup>
            <!-- 非必填寫欄位 -->
            <OrganismDesignInput v-if="item.type === 'input'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignInput>
            <OrganismDesignNumber v-if="item.type === 'number'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignNumber>
            <OrganismDesignUrl v-if="item.type === 'url'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignUrl>
            <OrganismDesignDivider v-if="item.type === 'divider'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignDivider>
            <OrganismDesignEditor v-if="item.type === 'editor'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignEditor>
            <OrganismDesignOffer v-if="item.type === 'offer'" v-model="templateDesigns[index]" :id="item.id"
                :onchange="onchange" :isDesigning="props.isDesigning" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignOffer>
            <!-- 拖曳釋放區域 -->
            <slot :index="Number(index + 1)">

            </slot>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
import type { FormInstance } from 'element-plus'
const emit = defineEmits(['update:modelValue', 'focus', 'dragstart', 'remove', 'change', 'mouseenter', 'mouseout'])
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
            switch (design.formField) {
                case 'organizer': {
                    formModel.value[design.formField] = design.mutable?.organizationId
                    break;
                }
                case 'performers': {
                    formModel.value[design.formField] = design.mutable?.memberIds
                    break;
                }
                case 'dates':
                case 'name':
                case 'banner':
                default: {
                    formModel.value[design.formField] = design.mutable?.value
                }
            }
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
        return organization.mutable?.organizationId
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