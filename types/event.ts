import type { ITemplateDesign } from "./eventTemplate"
import type { IAllowMethod } from "./organization"

export interface IEventCreation {
    date: Date,
}

/**
 * 參考Schema，便於SEO使用
 * https://schema.org/Event
 */
export interface IEventSingle extends IEventFromList {
    name?: string,
    description?: string,
    organizerName?: string,
    organizerLogo?: string,
    locationId?: string,
    locationAddress?: string,
    virtualLocationName?: string,
    virtualLocationValue?: string,
    designs: ITemplateDesign[], // 避免v-model判定出錯不為選填
}

export interface IEventFromList extends IEventQuery {
    id?: string,
    banner?: string,
    offerCategoryIds?: string[],
    dateDesignId?: string,
    name?: string,
    organizerLogo?: string,
    eventStatus?: 'cancelled' | 'movedOnline' | 'postponed' | 'rescheduled' | 'scheduled' | 'ended', // 暫定
}

export interface IEventQuery {
    id?: string,
    startDate?: Date,
    endDate?: Date,
    startHour?: string,
    locationAddressRegion?: string,
    hasVirtualLocation?: boolean,
    keywords?: string,
    isPublic?: boolean,
    limit?: number,
    performerIds?: string[],
    organizerId?: string,
    allowMethods?: IAllowMethod[],
}

/**
 * 純參考用，原則上不外部引用
 * https://schema.org/Place
 */
interface IPlace {
    name: string,
    address: string,
}

/**
 * 純參考用，原則上不外部引用
 * https://schema.org/VirtualLocation
 */
interface IVirtualLocation {
    name: string,
    description: string,
    url: string,
}