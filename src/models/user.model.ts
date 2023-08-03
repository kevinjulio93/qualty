
abstract class Persona {
    name?: string;
    email?:string
    id?: string;

    constructor (user?:Persona) {
        this.name = user?.name ?? '';
        this.email = user?.email ?? '';
        this.id = user?.id ?? '';
    }

}

export class AppUser extends Persona {
    role?:string;
    token:string;

    constructor(appUser?:AppUser) {
        super(appUser);
        this.role = appUser?.role ?? '';
        this.token = appUser?.token ?? '';
    }
}