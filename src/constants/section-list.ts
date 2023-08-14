import { ROUTES } from "./routes";

export const sectionList = [
    {
        key: "usuarios",
        name: "Usuarios",
        path: ROUTES.USERS,
        icon: "person",
        hasChilds: false,
    },
    {
        key: "beneficiarios",
        name: "Beneficiarios",
        path: ROUTES.BENEFICIARIES,
        icon: "beneficiaries",
        hasChilds: false,
    },
    {
        key: "valoraciones",
        name: "Valoraciones",
        path: "/valoraciones",
        icon: "book",
        hasChilds: true,
        childrens: [
            {
                key: "fisio",
                name: "Fisioterapia",
                path: "/fisioterapia",
                icon: "assist",

            },
            {
                key: "odontologia",
                name: "Odontologia",
                path: "/odontologia",
                icon: "smile",
            },
            {
                key: "oftamologia",
                name: "Oftamologia",
                path: "/oftamologia",
                icon: "eye",
            }
        ]
    },
    {
        key: "inventario",
        name: "Inventario",
        path: ROUTES.INVENTORY,
        icon: "draft",
        hasChilds: false,
    },
];