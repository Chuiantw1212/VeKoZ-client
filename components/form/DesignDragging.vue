<template>
    <el-form label-width="auto">
        <OrganismDesignInput class="eventTemplate__draggable" :disabled="true" draggable="true" :isDesigning="false"
            @mouseenter="setTemplateType('input')" @mouseleave="cancelDragging()"></OrganismDesignInput>
        <OrganismDesignNumber class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('number')"
            @mouseleave="cancelDragging()" :disabled="true" :isDesigning="false"></OrganismDesignNumber>
        <OrganismDesignDateTimeRange class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('dateTimeRange')" @mouseleave="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignDateTimeRange>
        <OrganismDesignUrl class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('url')"
            @mouseleave="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignUrl>
        <OrganismDesignTextarea class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('textarea')" @mouseleave="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignTextarea>
        <OrganismDesignDivider class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('divider')" @mouseleave="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignDivider>
        <OrganismDesignEditor class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('editor')"
            @mouseleave="cancelDragging()" :isDesigning="false" :disabled="true" placeholder="限制一個，內文上限2000字">
        </OrganismDesignEditor>
        <el-divider content-position="left">限一個的高階欄位</el-divider>
        <OrganismDesignBanner class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('banner')"
            @mouseleave="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignBanner>
        <OrganismDesignEventGroup class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('eventGroup')" @mouseleave="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignEventGroup>
        <OrganismDesignOrganization class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('organization')" @mouseleave="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignOrganization>
        <OrganismDesignOrganizationMember class="eventTemplate__draggable" draggable="true"
            @mouseenter="setTemplateType('organizationMember')" @mouseleave="cancelDragging()" :disabled="true"
            :isDesigning="false">
        </OrganismDesignOrganizationMember>
        <OrganismDesignOffer class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('offer')"
            @mouseleave="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignOffer>
        <OrganismDesignPlace class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('place')"
            @mouseleave="cancelDragging()" :disabled="true" :isDesigning="false">
        </OrganismDesignPlace>

    </el-form>
</template>
<script setup lang="ts">
const emit = defineEmits(['mouseleave', 'mouseenter'])
function cancelDragging() {
    emit('mouseleave')
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