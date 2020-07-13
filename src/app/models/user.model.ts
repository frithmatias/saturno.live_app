export class User {
    constructor (
        public nombre: string,
        public email: string,
        public password: string,
        public empresa: string,
        public role?: string,
        public img?: string, // luego de un parámetro opcional, todos los demás parámetros también son opcionales.
        public google?: boolean,
        public createdat?: string,
        public lastlogin?: string,
        public _id?: string
    ){}
}
