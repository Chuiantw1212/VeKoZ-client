export type IOrganization = {
    id: string,
    name: string,
    description: string,
    logo: string | Buffer,
    googleCalendarId?: string,
}

export type IOrganizationMember = {
    id?: string,
    name: string,
    email: string,
}