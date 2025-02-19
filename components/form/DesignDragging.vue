<template>
    <el-form label-width="auto">
        <el-divider content-position="left">限一個的高階欄位</el-divider>
        <OrganismDesignBanner class="eventTemplate__draggable" formField="virtualLocation" draggable="true"
            @mouseenter="setTemplateType('banner')" @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignBanner>
        <OrganismDesignInput class="eventTemplate__draggable" :maxlength="30" :size="'large'" :disabled="true"
            draggable="true" :isDesigning="false" @mouseenter="setTemplateType('input')" @mouseout="cancelDragging()">
        </OrganismDesignInput>
        <OrganismDesignUrl v-if="isDesignTypeAvailable('virtualLocation')" class="eventTemplate__draggable"
            draggable="true" @mouseenter="setTemplateType('virtualLocation')" @mouseout="cancelDragging()"
            :disabled="true" :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignEventGroup v-if="isDesignTypeAvailable('eventGroup')" class="eventTemplate__draggable"
            draggable="true" @mouseenter="setTemplateType('eventGroup')" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignEventGroup>
        <OrganismDesignOrganization v-if="isDesignTypeAvailable('organization')" class="eventTemplate__draggable"
            draggable="true" @mouseenter="setTemplateType('organization')" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignOrganization>
        <OrganismDesignOrganizationMember v-if="isDesignTypeAvailable('organizationMember')"
            class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('organizationMember')"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignOrganizationMember>
        <OrganismDesignPlace v-if="isDesignTypeAvailable('place')" class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('place')" @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignPlace>
        <el-divider content-position="left">無限量供應欄位</el-divider>
        <OrganismDesignInput class="eventTemplate__draggable" :disabled="true" draggable="true" :isDesigning="false"
            @mouseenter="setTemplateType('input')" @mouseout="cancelDragging()"></OrganismDesignInput>
        <OrganismDesignNumber class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('number')"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false"></OrganismDesignNumber>
        <OrganismDesignDateTimeRange class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('dateTimeRange')" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignDateTimeRange>
        <OrganismDesignUrl class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('url')"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignTextarea class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('textarea')" @mouseout="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignTextarea>
        <OrganismDesignDivider class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('divider')" @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignDivider>
        <OrganismDesignEditor class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('editor')"
            @mouseout="cancelDragging()" :isDesigning="false" :disabled="true" placeholder="限制一個，內文上限2000字">
        </OrganismDesignEditor>
        <OrganismDesignOffer class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('offer')"
            @mouseout="cancelDragging()" :disabled="true" :isDesigning="false">
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
function setTemplateType(event: any) {
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