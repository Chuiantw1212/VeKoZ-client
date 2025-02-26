export interface IUserDesign extends IUserDesignFromList {

}

export interface IUserDesignFromList extends IUserDesignQuery {
    id?: string,
    type?: string,
    value?: string,
    required?: boolean,
    formField?: string,
    alignment?: string,
    // 社群媒體的連結群
    urls?: string[]
}

export interface IUserDesignQuery {

}