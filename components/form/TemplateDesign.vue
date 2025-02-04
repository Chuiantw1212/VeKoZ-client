<template>
    <div>
        <div v-if="templateDesigns.length">
            <slot :index="0">

            </slot>
        </div>
        <el-form label-width="auto">
            <template v-for="(item, index) in templateDesigns" :key="index">
                <OrganismDesignHeader1 v-if="item.type === 'header1'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignHeader1>
                <OrganismDesignInput v-if="item.type === 'input'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignInput>
                <OrganismDesignNumber v-if="item.type === 'number'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignNumber>
                <OrganismDesignOrganization v-if="item.type === 'organization'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" :allow-delete="getFirstItem('organization') < index"
                    @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignOrganization>
                <OrganismDesignOrganizationMember v-if="item.type === 'organizationMember'"
                    v-model="templateDesigns[index]" :isDesigning="isDesigning"
                    :allow-delete="getFirstItem('organizationMember') < index" :organization-id="getOrganizationId()"
                    @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignOrganizationMember>
                <OrganismDesignDateTimeRange v-if="item.type === 'dateTimeRange'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" :allow-delete="getFirstItem('dateTimeRange') < index"
                    @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignDateTimeRange>
                <OrganismDesignPlace v-if="item.type === 'place'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" @dragstart="emit('dragstart',{ ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignPlace>
                <OrganismDesignUrl v-if="item.type === 'url'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignUrl>
                <OrganismDesignDivider v-if="item.type === 'divider'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignDivider>
                <OrganismDesignEditor v-if="item.type === 'editor'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignEditor>
                <OrganismDesignTextarea v-if="item.type === 'textarea'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" :allow-delete="getFirstItem('textarea') < index"
                    @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignTextarea>
                <OrganismDesignSingleSelect v-if="item.type === 'singleSelect'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning"
                    @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignSingleSelect>
                <OrganismDesignOffer v-if="item.type === 'offer'" v-model="templateDesigns[index]"
                    :isDesigning="isDesigning" @dragstart="emit('dragstart', { ...item, index, })"
                    @remove="handleRemove(index)" @moveUp="handleUp(index)" @moveDown="handleDown(index)">
                </OrganismDesignOffer>
                <!-- 拖曳釋放區域 -->
                <slot :index="Number(index + 1)">

                </slot>
            </template>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['update:modelValue', 'focus', 'dragstart'])
const props = defineProps({
    modelValue: {
        type: Array,
        default: function () {
            return []
        }
    },
    isDesigning: {
        type: Boolean,
        default: false
    }
})
const templateDesigns = computed({
    get() {
        return props.modelValue as any
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

// methods
function getFirstItem(type: string): number {
    const index = templateDesigns.value.findIndex((design: ITemplateDesign) => {
        return design.type === type
    })
    return index
}
function getOrganizationId() {
    const organization = templateDesigns.value.find((design: ITemplateDesign) => {
        return design.type === 'organization'
    })
    if (organization) {
        return organization.mutable.value
    }
}
function handleRemove(index: number) {
    templateDesigns.value.splice(index, 1)
}
function handleUp(index: number) {
    const removedElements = templateDesigns.value.splice(index, 1)
    const target = removedElements[0]
    const newIndex = Math.max(0, index - 1)
    templateDesigns.value.splice(newIndex, 0, target)
}
function handleDown(index: number) {
    const removedElements = templateDesigns.value.splice(index, 1)
    const target = removedElements[0]
    const newIndex = Math.min(templateDesigns.value.length, index + 1)
    templateDesigns.value.splice(newIndex, 0, target)
}
</script>