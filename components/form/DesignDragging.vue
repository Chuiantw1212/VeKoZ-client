<template>
    <el-form label-width="auto">
        <div class="eventTemplate__draggable" draggable="true" data-type="input" @mouseenter="setTemplateType($event)"
            @mouseleave="cancelDragging()">
            <OrganismDesignInput :disabled="true" :isDesigning="false"></OrganismDesignInput>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="number" @mouseenter="setTemplateType($event)"
            @mouseleave="cancelDragging()">
            <OrganismDesignNumber :disabled="true" :isDesigning="false"></OrganismDesignNumber>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="dateTimeRange"
            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
            <OrganismDesignDateTimeRange :disabled="true" :isDesigning="false">
            </OrganismDesignDateTimeRange>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="url" @mouseenter="setTemplateType($event)"
            @mouseleave="cancelDragging()">
            <OrganismDesignUrl :disabled="true" :isDesigning="false">
            </OrganismDesignUrl>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="textarea"
            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
            <OrganismDesignTextarea :disabled="true" :isDesigning="false">
            </OrganismDesignTextarea>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="divider" @mouseenter="setTemplateType($event)"
            @mouseleave="cancelDragging()">
            <OrganismDesignDivider :disabled="true" :isDesigning="false">
            </OrganismDesignDivider>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="editor" @mouseenter="setTemplateType($event)"
            @mouseleave="cancelDragging()">
            <OrganismDesignEditor :isDesigning="false" :disabled="true" placeholder="限制一個，內文上限2000字">
            </OrganismDesignEditor>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="banner" @mouseenter="setTemplateType($event)"
            @mouseleave="cancelDragging()">
            <OrganismDesignBanner :disabled="true" :isDesigning="false">
            </OrganismDesignBanner>
        </div>
        <el-divider content-position="left">高階欄位</el-divider>
        <div class="eventTemplate__draggable" draggable="true" data-type="eventGroup"
            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
            <OrganismDesignEventGroup :disabled="true" :isDesigning="false">
            </OrganismDesignEventGroup>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="organization"
            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
            <OrganismDesignOrganization :disabled="true" :isDesigning="false">
            </OrganismDesignOrganization>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="organizationMember"
            @mouseenter="setTemplateType($event)" @mouseleave="cancelDragging()">
            <OrganismDesignOrganizationMember :disabled="true" :isDesigning="false">
            </OrganismDesignOrganizationMember>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="offer" @mouseenter="setTemplateType($event)"
            @mouseleave="cancelDragging()">
            <OrganismDesignOffer :disabled="true" :isDesigning="false">
            </OrganismDesignOffer>
        </div>
        <div class="eventTemplate__draggable" draggable="true" data-type="place" @mouseenter="setTemplateType($event)"
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