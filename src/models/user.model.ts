
abstract class Persona {
    name?: string;
    user_name?:string
    id?: string;

    constructor (user?:Persona) {
        this.name = user?.name ?? '';
        this.user_name = user?.user_name ?? '';
        this.id = user?.id ?? '';
    }

}

interface IAbility {
    subject: string;
    action: string[];
}

export class AppUser extends Persona {
    _id?: string;
    role?:any;
    token:string;
    password: string;
    abilities: IAbility[];

    constructor(appUser?:AppUser) {
        super(appUser);
        this.role = appUser?.role ?? '';
        this.token = appUser?.token ?? '';
        this.password = appUser?.password ?? '';
        this.abilities = appUser?.abilities ?? [];
    }
}