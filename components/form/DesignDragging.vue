<template>
    <el-form label-width="auto">
        <OrganismDesignInput class="eventTemplate__draggable" :disabled="true" draggable="true" :isDesigning="false"
            @mouseenter="setTemplateType('input')" @mouseleave="cancelDragging()"></OrganismDesignInput>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('number')"
            @mouseleave="cancelDragging()">
            <OrganismDesignNumber :disabled="true" :isDesigning="false"></OrganismDesignNumber>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('dateTimeRange')"
            @mouseleave="cancelDragging()">
            <OrganismDesignDateTimeRange :disabled="true" :isDesigning="false">
            </OrganismDesignDateTimeRange>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('url')"
            @mouseleave="cancelDragging()">
            <OrganismDesignUrl :disabled="true" :isDesigning="false">
            </OrganismDesignUrl>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('textarea')"
            @mouseleave="cancelDragging()">
            <OrganismDesignTextarea :disabled="true" :isDesigning="false">
            </OrganismDesignTextarea>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('divider')"
            @mouseleave="cancelDragging()">
            <OrganismDesignDivider :disabled="true" :isDesigning="false">
            </OrganismDesignDivider>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('editor')"
            @mouseleave="cancelDragging()">
            <OrganismDesignEditor :isDesigning="false" :disabled="true" placeholder="限制一個，內文上限2000字">
            </OrganismDesignEditor>
        </div>
        <el-divider content-position="left">限一個的高階欄位</el-divider>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('banner')"
            @mouseleave="cancelDragging()">
            <OrganismDesignBanner :disabled="true" :isDesigning="false">
            </OrganismDesignBanner>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('eventGroup')"
            @mouseleave="cancelDragging()">
            <OrganismDesignEventGroup :disabled="true" :isDesigning="false">
            </OrganismDesignEventGroup>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('organization')"
            @mouseleave="cancelDragging()">
            <OrganismDesignOrganization :disabled="true" :isDesigning="false">
            </OrganismDesignOrganization>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('organizationMember')"
            @mouseleave="cancelDragging()">
            <OrganismDesignOrganizationMember :disabled="true" :isDesigning="false">
            </OrganismDesignOrganizationMember>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('offer')"
            @mouseleave="cancelDragging()">
            <OrganismDesignOffer :disabled="true" :isDesigning="false">
            </OrganismDesignOffer>
        </div>
        <div class="eventTemplate__draggable" draggable="true" @mouseenter="setTemplateType('place')"
            @mouseleave="cancelDragging()">
            <OrganismDesignPlace :disabled="true" :isDesigning="false">
            </OrganismDesignPlace>
        </div>
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