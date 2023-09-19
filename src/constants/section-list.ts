import { PERMISSIONS } from "./permissions";
import { SECTIONS } from "./sections";
import { ROUTES } from "./routes";

export const sectionList = [
    {
        key: "usuarios",
        name: "Usuarios",
        path: ROUTES.USERS,
        icon: "person",
        hasChilds: false,
        permission: {
            subject: SECTIONS.USER,
            action: [PERMISSIONS.READ]
        }
    },
    {
        key: "ben_list",
        name: "Beneficiarios",
        path: ROUTES.BEN_LIST,
        icon: "beneficiaries",
        hasChilds: false,
        permission: {
            subject: SECTIONS.BENEFICIARY,
            action: [PERMISSIONS.READ]
        }
    },
    {
        key: "actividades",
        name: "Actividades",
        path: ROUTES.ACTIVITIES_LIST,
        icon: "beneficiaries",
        hasChilds: false,
        permission: {
            subject: SECTIONS.ACTIVITY,
            action: [PERMISSIONS.READ]
        }
    },
    {
        key: "roles",
        name: "Roles",
        path: ROUTES.ROLES,
        icon: "beneficiaries",
        hasChilds: false,
        permission: {
            subject: SECTIONS.ROLE,
            action: [PERMISSIONS.READ]
        }
    },
    // {
    //     key: "valoraciones",
    //     name: "Valoraciones",
    //     path: "/valoraciones",
    //     icon: "book",
    //     hasChilds: true,
    //     childrens: [
    //         {
    //             key: "fisio",
    //             name: "Fisioterapia",
    //             path: "/fisioterapia",
    //             icon: "assist",

    //         },
    //         {
    //             key: "odontologia",
    //             name: "Odontologia",
    //             path: "/odontologia",
    //             icon: "smile",
    //         },
    //         {
    //             key: "oftamologia",
    //             name: "Oftamologia",
    //             path: "/oftamologia",
    //             icon: "eye",
    //         }
    //     ]
    // },
    {
        key: "inventario",
        name: "Inventario",
        path: ROUTES.INVENTORY,
        icon: "draft",
        hasChilds: false,
        permission: {
            subject: "unknown",
            action: ["read"]
        }
    },
];