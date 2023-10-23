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
      action: [PERMISSIONS.READ],
    },
  },
  {
    key: "ben_list",
    name: "Beneficiarios",
    path: ROUTES.BEN_LIST,
    icon: "beneficiaries",
    hasChilds: false,
    permission: {
      subject: SECTIONS.BENEFICIARY,
      action: [PERMISSIONS.READ],
    },
  },
  {
    key: "valoraciones",
    name: "Valoraciones",
    path: ROUTES.RATINGS,
    icon: "book",
    hasChilds: false,
    permission: {
      subject: SECTIONS.RATINGS,
      action: [PERMISSIONS.CREATE]
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
      subject: SECTIONS.INVENTORY,
      action: [PERMISSIONS.READ]
    }
  },
  {
    key: "bodegas",
    name: "Bodegas",
    path: ROUTES.WINERIES_LIST,
    icon: "draft",
    hasChilds: false,
    permission: {
      subject: SECTIONS.WINERIES,
      action: [PERMISSIONS.READ]
    }
  },
  {
    key: "talleres",
    name: "Talleres",
    path: ROUTES.ASSISTANCE,
    icon: "checklist",
    hasChilds: false,
    permission: {
      subject: SECTIONS.ASSISTANCE,
      action: [PERMISSIONS.CREATE],
    },
  },
  {
    key: "asociaciones",
    name: "Asociaciones",
    path: ROUTES.ASSOCIATIONS,
    icon: "AssistWalker",
    hasChilds: false,
    permission: {
      subject: SECTIONS.ASSOCIATIONS,
      action: [PERMISSIONS.CREATE],
    },
  },
];
// import AssistWalkerIcon from '@mui/icons-material/AssistWalker';