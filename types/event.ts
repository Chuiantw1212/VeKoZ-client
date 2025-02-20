export interface IEventCreation {
    date: string,
}

/**
 * 參考Schema，便於SEO使用
 * https://schema.org/Event
 */
export interface IEvent {
    id?: string,
    name?: string,
    addressRegion?: string, // event.location = PostalAddress
    dateDesignId?: string,
    startDate?: string | Date,
    endDate?: string | Date,
    description?: string,
    lastmod?: any,
    isPublic?: boolean,
    // 搜尋用Flag
    isMorning?: boolean,
    isAfternoon?: boolean,
    isEvening?: boolean,
    banner?: string,
    organizerName?: string,
    organizerLogo?: string,
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