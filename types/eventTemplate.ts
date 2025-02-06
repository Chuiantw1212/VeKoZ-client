export interface IEventTemplate {
    uid?: string,
    id?: string,
    eventId?: string, // 已公開的event才會有, 編輯中或是樣板不會有
    designs: ITemplateDesign[],
    designIds?: string[]
}

export interface ITemplateDesign {
    id?: string,
    eventId?: string, // 已公開的event才會有, 編輯中或是樣板不會有
    type?: string,
    mutable?: {
        label?: string,
        value?: any,
        name?: string,
        address?: string,
        url?: string,
        offers?: any[]
    },
    sqlField?: string;
}

export interface ITemplateDragSouce extends ITemplateDesign {
    index: number,
}