import type { IPagination } from "./ui"

export interface IOrganization {
    id?: string,
    seoName?: string,
    name?: string,
    description?: string,
    logo?: any,
    banner?: any,
    googleCalendarId?: string,
    // lineId?: string,
    sameAs?: string[],
    lastmod?: string,
    designs?: any[],
    founderId?: string,
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