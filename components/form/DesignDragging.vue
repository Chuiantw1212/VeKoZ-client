<template>
    <!-- 這一個檔案要跟後端充分配合，全端工程師的含金量大概就在這邊了 -->
    <el-form label-width="auto">
        <OrganismDesignHeader1 v-if="isTypeLimited('header1')" class="eventTemplate__draggable" :disabled="true"
            draggable="true" :isDesigning="false"
            @dragstart="setOnDrag({ type: 'header1', formField: 'name', required: true, })"
            @mouseenter="setOnEnter({ type: 'header1', formField: 'name', required: true, })" @mouseout.stop.prevent>
        </OrganismDesignHeader1>
        <OrganismDesignTextarea v-if="isFormFieldLimited('description')" class="eventTemplate__draggable"
            draggable="true" @dragstart="setOnDrag({ type: 'textarea', formField: 'description', required: true, })"
            @mouseenter="setOnEnter({ type: 'textarea', formField: 'description', required: true, })"
            placeholder="請輸入SEO描述" @mouseout.stop.prevent :disabled="true" :isDesigning="false">
        </OrganismDesignTextarea>
        <OrganismDesignDateTimeRange v-if="isFormFieldLimited('dates')" class="eventTemplate__draggable"
            draggable="true" @dragstart="setOnDrag({ type: 'dateTimeRange', formField: 'dates', required: true, })"
            @mouseenter="setOnEnter({ type: 'dateTimeRange', formField: 'dates', required: true, })"
            @mouseout.stop.prevent :disabled="true" :isDesigning="false">
        </OrganismDesignDateTimeRange>
        <OrganismDesignOrganizationMember v-if="isTypeLimited('organizationMember')" class="eventTemplate__draggable"
            draggable="true"
            @dragstart="setOnDrag({ type: 'organizationMember', formField: 'performers', required: true, })"
            @mouseenter="setOnEnter({ type: 'organizationMember', formField: 'performers', required: true, })"
            @mouseout.stop.prevent :disabled="true" :isDesigning="false">
        </OrganismDesignOrganizationMember>

        <el-divider class="mt-0" content-position="left" @mouseout.stop.prevent>限一個的欄位</el-divider>
        <OrganismDesignBanner v-if="isTypeLimited('banner')" class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'banner', formField: 'banner', })"
            @mouseenter="setOnEnter({ type: 'banner', formField: 'banner', })" @mouseout.stop.prevent :disabled="true"
            :isDesigning="false">
        </OrganismDesignBanner>
        <OrganismDesignPlace v-if="isTypeLimited('place')" class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'place', formField: 'location', })"
            @mouseenter="setOnEnter({ type: 'place', formField: 'location', })" @mouseout.stop.prevent :disabled="true"
            :isDesigning="false">
        </OrganismDesignPlace>
        <OrganismDesignUrl v-if="isFormFieldLimited('virtualLocation')" class="eventTemplate__draggable"
            :model-value="virtualLocation" namePlaceholder="視訊會議連結" valuePlaceHolder="https://meet.google.com/ve-ko-ss"
            draggable="true" @dragstart="setOnDrag({ type: 'url', formField: 'virtualLocation', })"
            @mouseenter="setOnEnter({ type: 'url', formField: 'virtualLocation', })" @mouseout.stop.prevent
            :disabled="true" :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignEventGroup v-if="isTypeLimited('eventGroup')" class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'eventGroup', })" @mouseenter="setOnEnter({ type: 'eventGroup', })"
            @mouseout.stop.prevent :disabled="true" :isDesigning="false">
        </OrganismDesignEventGroup>
        <OrganismDesignEditor class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'editor', })" @mouseenter="setOnEnter({ type: 'editor', })"
            @mouseout.stop.prevent :isDesigning="false" :disabled="true" placeholder="限制一個，內文上限2000字">
        </OrganismDesignEditor>

        <el-divider content-position="left">無限供應欄位</el-divider>
        <OrganismDesignOffer class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'offers', formField: 'offers', })"
            @mouseenter="setOnEnter({ type: 'offers', formField: 'offers', })" @mouseout.stop.prevent :disabled="true"
            :isDesigning="false">
        </OrganismDesignOffer>

        <!-- <el-divider content-position="left">無限供應且對外不可見</el-divider>
        <OrganismDesignDateTimeRange class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'dateTimeRange', })" @mouseenter="setOnEnter({ type: 'dateTimeRange', })"
            @mouseout.stop.prevent :disabled="true" :isDesigning="false">
        </OrganismDesignDateTimeRange>
        <OrganismDesignInput class="eventTemplate__draggable" :disabled="true" draggable="true" :isDesigning="false"
            @dragstart="setOnDrag({ type: 'input', })" @mouseenter="setOnEnter({ type: 'input', })"
            @mouseout.stop.prevent></OrganismDesignInput>
        <OrganismDesignUrl class="eventTemplate__draggable" draggable="true" @dragstart="setOnDrag({ type: 'url', })"
            @mouseenter="setOnEnter({ type: 'url', })" @mouseout.stop.prevent :disabled="true"
            :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignDivider class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'divider', })" @mouseenter="setOnEnter({ type: 'divider', })"
            @mouseout.stop.prevent :disabled="true" :isDesigning="false">
        </OrganismDesignDivider>
        <OrganismDesignNumber class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'number', })" @mouseenter="setOnEnter({ type: 'number', })"
            @mouseout.stop.prevent :disabled="true" :isDesigning="false"></OrganismDesignNumber> -->
    </el-form>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['mouseenter', 'dragstart'])

const virtualLocation = ref<ITemplateDesign>({
    type: 'url',
    formField: 'virtualLocation',
    label: '視訊連結',
})

const designs = defineModel<ITemplateDesign[]>('modelValue', {
    default: () => {
        return []
    }
})

// Methods
function isTypeLimited(type: string = '') {
    const isAvailable = designs.value.every((design) => {
        return design.type !== type
    })
    return isAvailable
}

function isFormFieldLimited(formField: string = '') {
    const isAvailable = designs.value.every((design) => {
        return design.formField !== formField
    })
    return isAvailable
}

function setOnEnter(event: any) {
    emit('mouseenter', event)
}
function setOnDrag(event: any) {
    // console.log('setOnDrag', event)
    emit('dragstart', event)
}
</script>
<style lang="scss" scoped>
.mt-0 {
    margin-top: 0px;
}

.eventTemplate__draggable {
    * {
        cursor: grab !important;
    }

    &:hover {
        outline: 1px dashed red;
    }
}
</style>