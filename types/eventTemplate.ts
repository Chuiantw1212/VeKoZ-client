import type { IOffer } from "./offer"

export interface IEventTemplate {
    uid?: string,
    id?: string,
    eventId?: string, // 已創建的event才會有, 編輯中或是樣板不會有
    designs: ITemplateDesign[],
    designIds?: string[],
    name?: string,
    lastmod?: any,
    isPublic?: boolean, // 可被搜索到的活動事件
}

export interface ITemplateDesign {
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
    [key: string]: any
    // 未定義欄位使用
    label?: string,
    value?: any,
    // organization
    organizationId?: string,
    organizationName?: string,
    // organization members
    memberIds?: string[],
    memberNames?: string[],
    // 時間
    startDate?: string,
    endDate?: string,
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
    item: ITemplateDesign
}