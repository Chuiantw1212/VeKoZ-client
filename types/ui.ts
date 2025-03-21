export interface IEventCarouselCard {
    name?: string,
    link?: string,
    image?: string,
    followerCount?: number,
}

export interface IPublicInfoCard {
    id: string, // 太重要
    seoName?: string,
    title?: string,
    subtitle?: string,
    image?: any,
    banner?: any,
    entity?: string,
    description?: string,
    sameAs?: string[],
    urlPath?: string, // 瀏覽使用
    followerCount?: number,
}

export interface IPagination {
    pageSize?: number,
    currentPage?: number,
}