export interface IEventCreation {
    date: string,
}

/**
 * 參考Schema，便於SEO使用
 * https://schema.org/Event
 */
export interface IEvent {
    id?: string,
    name: string,
}

/**
 * https://schema.org/Place
 */
export interface IPlace {
    name: string,
    address: string,
}