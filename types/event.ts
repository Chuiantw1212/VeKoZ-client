import type { ITemplateDesign } from "./eventTemplate"

export interface IEventCreation {
    date: string,
}

/**
 * 參考Schema，便於SEO使用
 * https://schema.org/Event
 */
export interface IEventFromList {
    id?: string,
    startDate?: Date,
    endDate?: Date,
    isPublic?: boolean,
    offerCategoryIds?: string[],
    dateDesignId?: string,
    name?: string,
    eventStatus?: 'cancelled' | 'movedOnline' | 'postponed' | 'rescheduled' | 'scheduled' | 'ended' // 暫定
}

export interface IEventSingle {
    id?: string,
    name?: string,
    description?: string,
    organizerId?: string,
    organizerName?: string,
    organizerLogo?: string,
    actorIds?: string[],
}

/**
 * 太雜了，要整理取代
 * @deprecated
 */
export interface IEvent extends IEventQuery {
    id?: string,
    name?: string,
    description?: string,
    lastmod?: any,
    banner?: string,
    organizerId?: string,
    organizerName?: string,
    organizerLogo?: string,
    designs?: ITemplateDesign[]
    // 便於更新用
    dateDesignId?: string,
    offerCategoryIds?: string[]
}

export interface IEventQuery {
    startDate?: Date,
    endDate?: Date,
    startHour?: string,
    locationAddressRegion?: string,
    hasVirtualLocation?: boolean,
    keywords?: string,
    isPublic?: boolean,
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