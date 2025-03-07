export interface IEventCarouselCard {
    name?: string,
    link?: string,
    image?: string,
}

export interface IPublicInfoCard {
    id: string, // 太重要
    seoName?: string,
    name?: string,
    image?: any,
    banner?: any,
    description?: string,
    sameAs?: string[],
    urlPath?: string, // 瀏覽使用
}

export interface IPagination {
    pageSize?: number,
    currentPage?: number,
}