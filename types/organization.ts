import type { IPagination } from "./ui"

export interface IOrganization extends IOrganizationQuery {
    id?: string,
    seoName?: string,
    description?: string,
    logo?: any,
    banner?: any,
    googleCalendarId?: string,
    // lineId?: string,
    sameAs?: string[],
    lastmod?: string,
    designs?: any[],
    founderId?: string,
    keywords?: string[],
    followerCount?: number,
}

export interface IOrganizationQuery {
    name?: string,
    excludeIds?: string[],
    hasPlace?: boolean,
}

/**
 * 權限各自不相同
 */
export interface IMemberListRes {
    total: number,
    items: IOrganizationMember[]
}

export interface IOrganizationMember extends IOrganizationMemberQuery {
    id?: string,
    name?: string,
    organizationName?: string,
    organizationLogo?: string,
    lastmod?: string,
    isFounder?: false,
    calendarColor?: string,
}


export type IAllowMethod = 'GET' | 'PATCH' | 'POST' | 'DELETE'

export interface IOrganizationMemberQuery extends IPagination {
    email?: string,
    organizationId?: string,
    allowMethods?: IAllowMethod[],
    allowEntities?: string[],
}