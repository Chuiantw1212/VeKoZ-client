import type { ITemplateDesign } from "./eventTemplate"

export interface IEventCreation {
    date: Date,
}

/**
 * 參考Schema，便於SEO使用
 * https://schema.org/Event
 */
export interface IEventSingle extends IEventFromList {
    id?: string,
    name?: string,
    description?: string,
    organizerName?: string,
    organizerLogo?: string,
    locationId?: string,
    locationAddress?: string,
    virtualLocationName?: string,
    virtualLocationValue?: string,
    designs?: any[],
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