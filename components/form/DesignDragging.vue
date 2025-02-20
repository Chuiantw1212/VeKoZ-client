<template>
    <el-form label-width="auto">
        <!-- 這一個檔案要跟後端配合，全端工程師的含金量大概就在這邊了 -->
        <el-divider class="mt-0" content-position="left">必填且限量的欄位</el-divider>
        <OrganismDesignHeader1 v-if="isTypeLimited('header1')" class="eventTemplate__draggable" :disabled="true"
            draggable="true" :isDesigning="false"
            @dragstart="setOnDrag({ type: 'header1', formField: 'name', required: true, })"
            @mouseenter="setOnEnter({ type: 'header1', formField: 'name', required: true, })"
            @mouseout="cancelDragging()">
        </OrganismDesignHeader1>
        <OrganismDesignTextarea v-if="isFormFieldLimited('description')" class="eventTemplate__draggable"
            draggable="true" @dragstart="setOnDrag({ type: 'textarea', formField: 'description', required: true, })"
            @mouseenter="setOnEnter({ type: 'textarea', formField: 'description', required: true, })"
            placeholder="請輸入SEO描述" @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignTextarea>
        <OrganismDesignDateTimeRange v-if="isFormFieldLimited('date')" class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'dateTimeRange', formField: 'date', required: true, })"
            @mouseenter="setOnEnter({ type: 'dateTimeRange', formField: 'date', required: true, })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignDateTimeRange>
        <OrganismDesignOrganization v-if="isTypeLimited('organization')" class="eventTemplate__draggable"
            draggable="true" @dragstart="setOnDrag({ type: 'organization', formField: 'organizer', required: true, })"
            @mouseenter="setOnEnter({ type: 'organization', formField: 'organizer', required: true, })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignOrganization>
        <OrganismDesignOrganizationMember v-if="isTypeLimited('organizationMember')" class="eventTemplate__draggable"
            draggable="true"
            @dragstart="setOnDrag({ type: 'organizationMember', formField: 'performers', required: true, })"
            @mouseenter="setOnEnter({ type: 'organizationMember', formField: 'performers', required: true, })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignOrganizationMember>

        <el-divider class="mt-0" content-position="left">限量的欄位</el-divider>
        <OrganismDesignBanner v-if="isTypeLimited('banner')" class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'banner', formField: 'banner', })"
            @mouseenter="setOnEnter({ type: 'banner', formField: 'banner', })" @mouseout="cancelDragging()"
            :disabled="true" :isDesigning="false">
        </OrganismDesignBanner>
        <OrganismDesignPlace v-if="isTypeLimited('place')" class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'place', formField: 'location', })"
            @mouseenter="setOnEnter({ type: 'place', formField: 'location', })" @mouseout="cancelDragging()"
            :disabled="true" :isDesigning="false">
        </OrganismDesignPlace>
        <OrganismDesignUrl v-if="isFormFieldLimited('virtualLocation')" class="eventTemplate__draggable"
            :model-value="virtualLocation" namePlaceholder="視訊會議連結" valuePlaceHolder="https://meet.google.com/ve-ko-ss"
            draggable="true" @dragstart="setOnDrag({ type: 'url', formField: 'virtualLocation', })"
            @mouseenter="setOnEnter({ type: 'url', formField: 'virtualLocation', })" @mouseout="cancelDragging()"
            :disabled="true" :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignEventGroup v-if="isTypeLimited('eventGroup')" class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'eventGroup', })" @mouseenter="setOnEnter({ type: 'eventGroup', })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignEventGroup>
        <el-divider content-position="left">無限量供應欄位</el-divider>
        <OrganismDesignDateTimeRange class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'dateTimeRange', })" @mouseenter="setOnEnter({ type: 'dateTimeRange', })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignDateTimeRange>
        <OrganismDesignInput class="eventTemplate__draggable" :disabled="true" draggable="true" :isDesigning="false"
            @dragstart="setOnDrag({ type: 'input', })" @mouseenter="setOnEnter({ type: 'input', })"
            @mouseout="cancelDragging()"></OrganismDesignInput>
        <OrganismDesignUrl class="eventTemplate__draggable" draggable="true" @dragstart="setOnDrag({ type: 'url', })"
            @mouseenter="setOnEnter({ type: 'url', })" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignDivider class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'divider', })" @mouseenter="setOnEnter({ type: 'divider', })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignDivider>
        <OrganismDesignEditor class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'editor', })" @mouseenter="setOnEnter({ type: 'editor', })"
            @mouseout="cancelDragging()" :isDesigning="false" :disabled="true" placeholder="限制一個，內文上限2000字">
        </OrganismDesignEditor>
        <OrganismDesignOffer class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'offer', })" @mouseenter="setOnEnter({ type: 'offer', })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignOffer>
        <OrganismDesignNumber class="eventTemplate__draggable" draggable="true"
            @dragstart="setOnDrag({ type: 'number', })" @mouseenter="setOnEnter({ type: 'number', })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false"></OrganismDesignNumber>
    </el-form>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['mouseout', 'mouseenter', 'dragstart'])
//
const header1 = ref<ITemplateDesign>({
    type: 'input',
    formField: 'name',
    mutable: {
        label: '視訊連結',
    }
})

const virtualLocation = ref<ITemplateDesign>({
    type: 'url',
    formField: 'virtualLocation',
    mutable: {
        label: '視訊連結',
    }
})

const props = defineProps({
    designs: {
        type: Array as PropType<ITemplateDesign[]>,
        default: () => {
            return []
        }
    }
})
//
function isTypeLimited(type: string = '') {
    const isAvailable = props.designs.every((design) => {
        return design.type !== type
    })
    return isAvailable
}

function isFormFieldLimited(formField: string = '') {
    const isAvailable = props.designs.every((design) => {
        return design.formField !== formField
    })
    return isAvailable
}

function cancelDragging() {
    emit('mouseout')
}
function setOnEnter(event: any) {
    emit('mouseenter', event)
}
function setOnDrag(event: any) {
    console.log('setOnDrag', event)
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