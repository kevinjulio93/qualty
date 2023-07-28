export const sectionList = [
    {
        key: "usuarios",
        name: "Usuarios",
        path: "/usuarios",
        icon: "person",
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
        path: "/inventario",
        icon: "draft",
        hasChilds: false,
    },
];