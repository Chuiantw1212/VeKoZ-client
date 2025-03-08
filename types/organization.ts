import type { IPagination } from "./ui"

export type IOrganization = {
    id?: string,
    seoName?: string,
    name?: string,
    description?: string,
    logo?: any,
    banner?: any,
    googleCalendarId?: string,
    lineId?: string,
    sameAs?: string[],
    lastmod?: string,
    designs?: any[],
    founderId?: string,
}

/**
 * 權限各自不相同
 */
export type IOrganizationMember = IOrganizationMemberQuery & {
    id?: string,
    name?: string,
    organizationName?: string,
    organizationLogo?: string,
    lastmod?: string,
    isFounder?: false,
}

export type IOrganizationMemberQuery = IPagination & {
    email?: string,
    organizationId?: string,
    allowMethods?: string[],
    allowEntities?: string[],
    canEditMember?: string[],
}