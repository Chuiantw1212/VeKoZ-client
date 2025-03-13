<template>
    <div v-if="template.designs.length">
        <slot :index="0">

        </slot>
    </div>
    <!-- {{ template.designs }} -->
    <el-form ref="formRef" class="designForm" label-width="auto" :model="formModel" :rules="formRules">
        <template v-for="(item, index) in template.designs">
            <!-- 必填且限量的欄位 -->
            <OrganismDesignHeader1 v-if="item.type === 'header1'" v-model="template.designs[index]" :onchange="onchange"
                :required="item.required" :isDesigning="props.isDesigning" :disabled="props.disabled"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignHeader1>
            <OrganismDesignDateTimeRange v-if="item.type === 'dateTimeRange'" v-model="template.designs[index]"
                :onchange="dateOnChanged" :isDesigning="props.isDesigning" :disabled="props.disabled"
                :required="item.required" @dragstart="handleDragStart(index)" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignDateTimeRange>
            <OrganismDesignOrganization v-if="item.type === 'organization'" v-model="template.designs[index]"
                :onchange="onchange" :isDesigning="props.isDesigning" :disabled="props.disabled"
                :required="item.required" @dragstart="handleDragStart(index)" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignOrganization>
            <OrganismDesignOrganizationMember v-if="item.type === 'organizationMember'"
                v-model="template.designs[index]" :onchange="onchange" :isDesigning="props.isDesigning"
                :disabled="props.disabled" :required="item.required" :organization-id="template.organizerId"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignOrganizationMember>
            <OrganismDesignTextarea v-if="item.type === 'textarea'" v-model="template.designs[index]"
                :onchange="onchange" :isDesigning="props.isDesigning" :disabled="props.disabled"
                :required="item.required" @dragstart="handleDragStart(index)" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignTextarea>

            <!-- 限量的欄位 -->
            <OrganismDesignBanner v-if="item.type === 'banner'" v-model="template.designs[index]" :onchange="onchange"
                form-field="banner" :required="item.required" :isDesigning="props.isDesigning"
                :disabled="props.disabled" @dragstart="handleDragStart(index)" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignBanner>
            <OrganismDesignPlace v-if="item.type === 'place'" v-model="template.designs[index]" :onchange="onchange"
                :isDesigning="props.isDesigning" :disabled="props.disabled" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignPlace>
            <OrganismDesignUrl v-if="item.type === 'virtualLocation'" v-model="template.designs[index]"
                :onchange="onchange" form-field="virtualLocation" :isDesigning="props.isDesigning"
                :disabled="props.disabled" @dragstart="handleDragStart(index)" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignUrl>
            <OrganismDesignEventGroup v-if="item.type === 'eventGroup'" v-model="template.designs[index]"
                :onchange="onchange" :isDesigning="props.isDesigning" :disabled="props.disabled"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignEventGroup>

            <!-- 非必填寫欄位 -->
            <OrganismDesignInput v-if="item.type === 'input'" v-model="template.designs[index]" :onchange="onchange"
                :isDesigning="props.isDesigning" :disabled="props.disabled" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignInput>
            <OrganismDesignNumber v-if="item.type === 'number'" v-model="template.designs[index]" :onchange="onchange"
                :isDesigning="props.isDesigning" :disabled="props.disabled" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignNumber>
            <OrganismDesignUrl v-if="item.type === 'url'" v-model="template.designs[index]" :onchange="onchange"
                :isDesigning="props.isDesigning" :disabled="props.disabled" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignUrl>
            <OrganismDesignDivider v-if="item.type === 'divider'" v-model="template.designs[index]" :onchange="onchange"
                :isDesigning="props.isDesigning" :disabled="props.disabled" @dragstart="handleDragStart(index)"
                @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)"
                @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignDivider>
            <OrganismDesignEditor v-if="item.type === 'editor'" v-model="template.designs[index]" :onchange="onchange"
                :isDesigning="props.isDesigning" :disabled="props.disabled" :required="item.required"
                placeholder="請輸入活動詳細內容" @dragstart="handleDragStart(index)" @remove="handleRemove(index)"
                @moveUp="handleUp(index)" @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)"
                @mouseout="emit('mouseout')">
            </OrganismDesignEditor>
            <OrganismDesignOffer v-if="item.type === 'offers'" v-model="template.designs[index]" ref="offerRef"
                :onchange="onchange" :isDesigning="props.isDesigning" :disabled="props.disabled"
                :required="item.required" :startDate="template.startDate" :end-date="template.endDate"
                @dragstart="handleDragStart(index)" @remove="handleRemove(index)" @moveUp="handleUp(index)"
                @moveDown="handleDown(index)" @mouseenter="emit('mouseenter', item.type)" @mouseout="emit('mouseout')">
            </OrganismDesignOffer>

            <!-- 拖曳釋放區域 -->
            <slot :index="Number(index + 1)">

            </slot>
        </template>
    </el-form>
</template>
<script setup lang="ts">
import type { IEventTemplate, ITemplateDesign } from '~/types/eventTemplate'
import type { FormInstance } from 'element-plus'
const emit = defineEmits(['update:modelValue', 'focus', 'dragstart', 'remove', 'change', 'mouseenter', 'mouseout'])
const offerRefs = useTemplateRef('offerRef')

const template = defineModel<IEventTemplate>('modelValue', {
    required: true,
    default: function () {
        return {}
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
    disabled: {
        type: Boolean,
        default: false,
    },
})
const formRef = ref<FormInstance>()
const formModel = ref<{ [key: string]: any }>({})
const formRules = ref<{ [key: string]: any }>({})

// Hooks
watch(() => template.value.designs, () => {
    // 設定檢核
    template.value.designs.forEach(design => {
        if (design.formField) {
            switch (design.formField) {
                case 'organizer': {
                    formModel.value[design.formField] = design.organizationId
                    break;
                }
                case 'performers': {
                    formModel.value[design.formField] = design.memberIds
                    break;
                }
                case 'dates':
                case 'name':
                case 'banner':
                default: {
                    formModel.value[design.formField] = design.value
                }
            }
            formRules.value[design.formField] = {
                required: true,
                message: `${design.label}為必填`
            }
        }
    })
}, { immediate: true, deep: true })

// methods
function dateOnChanged(item: ITemplateDesign) {
    props.onchange(item)
    console.log('executed', item)
    // if (item.formField === 'dates') {
    const startDate = item.startDate
    offerRefs.value.forEach((offerComponent: any) => {
        offerComponent.setDate(startDate)
    })
    const endDate = item.endDate

    template.value.startDate = startDate
    template.value.endDate = endDate
    // }
}

async function validate() {
    return await formRef.value?.validate()
}

function handleRemove(index: number) {
    const item = template.value.designs[index]
    emit('remove', {
        item,
        index,
    })
}
function handleDragStart(index: number) {
    const item = template.value.designs[index]
    emit('dragstart', {
        item: JSON.parse(JSON.stringify(item)),
        index,
    })
}
function handleUp(index: number) {
    const removedElements = template.value.designs.splice(index, 1)
    const target = removedElements[0]
    if (target) {
        const newIndex = Math.max(0, index - 1)
        template.value.designs.splice(newIndex, 0, target)
    }
}
function handleDown(index: number) {
    const removedElements = template.value.designs.splice(index, 1)
    const target = removedElements[0]
    if (target) {
        const newIndex = Math.min(template.value.designs.length, index + 1)
        template.value.designs.splice(newIndex, 0, target)
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