
abstract class Persona {
    name: string;
    email:string
    password?: string;
    id: string;

    constructor (user?:Persona) {
        this.name = user?.name ?? '';
        this.password = user?.password ?? '';
        this.email = user?.email ?? '';
        this.id = user?.id ?? '';
    }

}

export class AppUser extends Persona {
    rol:string;

    constructor(appUser?:AppUser) {
        super(appUser);
        this.rol = appUser?.rol ?? '';
    }
}