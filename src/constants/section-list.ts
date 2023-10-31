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
    path: ROUTES.RATING_LIST,
    icon: "book",
    hasChilds: false,
    permission: {
      subject: SECTIONS.RATINGS,
      action: [PERMISSIONS.READ]
    }
  },
  {
    key: "actividades",
    name: "Actividades",
    path: ROUTES.ACTIVITIES_LIST,
    icon: "activity",
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
    icon: "role",
    hasChilds: false,
    permission: {
      subject: SECTIONS.ROLE,
      action: [PERMISSIONS.READ]
    }
  },
  {
    key: "inventario",
    name: "Articulos",
    path: ROUTES.INVENTORY,
    icon: "draft",
    hasChilds: false,
    permission: {
      subject: SECTIONS.INVENTORY,
      action: [PERMISSIONS.READ]
    }
  },
  {
    key: "talleres",
    name: "Talleres",
    path: ROUTES.WORKSHOP,
    icon: "checklist",
    hasChilds: false,
    permission: {
      subject: SECTIONS.ASSISTANCE,
      action: [PERMISSIONS.READ],
    },
  },
  {
    key: "asociaciones",
    name: "Asociaciones",
    path: ROUTES.ASSOCIATIONS,
    icon: "groups",
    hasChilds: false,
    permission: {
      subject: SECTIONS.ASSOCIATIONS,
      action: [PERMISSIONS.CREATE],
    },
  },
  {
    key: "entregas",
    name: "Entregas",
    path: ROUTES.ASSOCIATIONS,
    icon: "groups",
    hasChilds: false,
    permission: {
      subject: SECTIONS.ASSOCIATIONS,
      action: [PERMISSIONS.CREATE],
    },
  },
  {
    key: "bodegas",
    name: "Bodegas",
    path: ROUTES.WINERIES_LIST,
    icon: "storage",
    hasChilds: false,
    permission: {
      subject: SECTIONS.WINERIES,
      action: [PERMISSIONS.READ],
    },
  },
  {
    key: "representantes",
    name: "Representantes",
    path: ROUTES.REPRESENTATIVES,
    icon: "storage",
    hasChilds: false,
    permission: {
      subject: SECTIONS.REPRESENTATIVE,
      action: [PERMISSIONS.READ],
    },
  },
];
// import AssistWalkerIcon from '@mui/icons-material/AssistWalker';