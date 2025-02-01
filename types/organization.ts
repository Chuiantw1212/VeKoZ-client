export type IOrganization = {
    id: string,
    name: string,
    description: string,
    logo: string | Buffer,
}

export type IOrganizationMember = {
    id?: string,
    name: string,
    email: string,
}