import type { IOffer } from "./offer"

export interface IEventTemplate extends IEventTemplateQuery {
    uid?: string,
    eventId?: string, // 已創建的event才會有, 編輯中或是樣板不會有
    designs: ITemplateDesign[], // 簡化前端 FromEventTemplate if
    designIds?: string[],
    name?: string,
    lastmod?: any,
    startDate?: Date,
    endDate?: Date,
    organizerLogo?: string,
    organizerName?: string,
}

export interface IEventTemplateQuery {
    id?: string,
    organizerId?: string,
}

export interface ITemplateDesign {
    // 權限識別用
    organizerId?: string,
    // 社群媒體連結
    urls?: string[],
    id?: string,
    // 連動用id
    eventId?: string, // 已公開的event才會有, 編輯中或是樣板不會有
    templateId?: string,
    // 其他欄位
    type?: string,
    required?: boolean,
    lastmod?: any,
    // 未定義欄位使用
    label?: string,
    value?: any,
    // organization
    organizationId?: string, // 元件保持organization，樣板從屬採用organizer
    organizationName?: string,
    // organization members
    memberIds?: string[],
    memberNames?: string[],
    // 時間
    startDate?: Date | string,
    endDate?: Date | string,
    // 線下地點
    placeId?: string, // entities
    placeName?: string,
    placeAddressRegion?: string, // 第一級行政區
    placeAddress?: string,
    placePublicAccess?: boolean,
    // 票券
    offers?: IOffer[]
    formField?: string,
    // 線上地點
    urlName?: string,
    urlValue?: string,
}



export interface ITemplateDragSouce {
    index: number,
    item: ITemplateDesign,
}