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
    locationAddress?: string,
    locationName?: string,
    virtualLocationName?: string,
    virtualLocationUrl?: string,
    dateDesignId?: string,
    startDate?: string,
    endDate?: string,
    description?: string,
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