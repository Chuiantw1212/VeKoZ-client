/**
 * https://schema.org/Organization
 */

export interface IPlace extends IPlaceQuery {
    name?: string;
    uid?: string;
    description?: string,
    addressRegion?: string, // 第一級行政區
    address?: string,
}

export interface IPlaceQuery {
    id?: string; // doc id
    organizationId?: string,
    organizationIds?: string[] // 集合多個組織的地點一起做分頁查詢
    organizationName?: string,
    organizationLogo?: string,
}