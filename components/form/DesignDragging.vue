<template>
    <el-form label-width="auto">
        <!-- 這一個檔案要跟後端配合，全端工程師的含金量大概就在這邊了 -->
        <el-divider content-position="left">限一個的高階欄位</el-divider>
        <OrganismDesignBanner class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'banner', formField: 'image' })" @mouseout="cancelDragging()"
            :disabled="true" :isDesigning="false">
        </OrganismDesignBanner>
        <OrganismDesignHeader1 class="eventTemplate__draggable" :disabled="true" draggable="true" :isDesigning="false"
            @mouseenter="setTemplateItem({ type: 'header1', formField: 'name' })" @mouseout="cancelDragging()">
        </OrganismDesignHeader1>
        <OrganismDesignTextarea class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'textarea', formField: 'descriptioin' })" @mouseout="cancelDragging()"
            :disabled="true" :isDesigning="false">
        </OrganismDesignTextarea>
        <OrganismDesignUrl v-if="isDesignTypeAvailable('virtualLocation')" class="eventTemplate__draggable"
            draggable="true" @mouseenter="setTemplateItem({ type: 'url', formField: 'virtualLocation' })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignEventGroup v-if="isDesignTypeAvailable('eventGroup')" class="eventTemplate__draggable"
            draggable="true" @mouseenter="setTemplateItem({ type: 'eventGroup', })" @mouseout="cancelDragging()"
            :disabled="true" :isDesigning="false">
        </OrganismDesignEventGroup>
        <OrganismDesignOrganization v-if="isDesignTypeAvailable('organization')" class="eventTemplate__draggable"
            draggable="true" @mouseenter="setTemplateItem({ type: 'organization', formField: 'organizer' })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignOrganization>
        <OrganismDesignOrganizationMember v-if="isDesignTypeAvailable('organizationMember')"
            class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'organizationMember', formField: 'performers' })"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignOrganizationMember>
        <OrganismDesignPlace v-if="isDesignTypeAvailable('place')" class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'place', formField: 'location' })" @mouseout="cancelDragging()"
            :disabled="true" :isDesigning="false">
        </OrganismDesignPlace>
        <el-divider content-position="left">無限量供應欄位</el-divider>
        <OrganismDesignInput class="eventTemplate__draggable" :disabled="true" draggable="true" :isDesigning="false"
            @mouseenter="setTemplateItem({ type: 'input', })" @mouseout="cancelDragging()"></OrganismDesignInput>
        <OrganismDesignNumber class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'number', })" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false"></OrganismDesignNumber>
        <OrganismDesignDateTimeRange class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'dateTimeRange', })" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignDateTimeRange>
        <OrganismDesignUrl class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'url', })" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignDivider class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'divider', })" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignDivider>
        <OrganismDesignEditor class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'editor', })" @mouseout="cancelDragging()" :isDesigning="false"
            :disabled="true" placeholder="限制一個，內文上限2000字">
        </OrganismDesignEditor>
        <OrganismDesignOffer class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateItem({ type: 'offer', })" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignOffer>
    </el-form>
</template>
<script setup lang="ts">
import type { ITemplateDesign } from '~/types/eventTemplate'
const emit = defineEmits(['mouseout', 'mouseenter'])

const props = defineProps({
    designs: {
        type: Array as PropType<ITemplateDesign[]>,
        default: () => {
            return []
        }
    }
})

function isDesignTypeAvailable(type: string = '') {
    const isAvailable = props.designs.every((design) => {
        return design.type !== type
    })
    return isAvailable
}

function cancelDragging() {
    emit('mouseout')
}
function setTemplateItem(event: any) {
    emit('mouseenter', event)
}
</script>
<style lang="scss" scoped>
.eventTemplate__draggable {
    * {
        cursor: grab !important;
    }

    &:hover {
        outline: 1px dashed red;
    }
}
</style>