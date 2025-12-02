export  interface UserModel{
    userName?:string,
    email:string,
    password:string
}
export interface RegisterUserResponseModel{
    message?:string,
    userId?:string,
    token?:string
}