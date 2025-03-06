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
export type IOrganizationMember = {
    id?: string,
    name?: string,
    email?: string,
    organizationId?: string,
    organizationName?: string,
    organizationFounderId?: string,
    lastmod?: string,
    allowMethods?: string[],
}