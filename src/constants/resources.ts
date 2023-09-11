import { PERMISSIONS } from "./permissions";
import { SECTIONS } from "./sections";

export const arraySections = [
    {key: SECTIONS.BENEFICIARY, value: "Beneficiarios"},
    {key: SECTIONS.ACTIVITY, value: "Talleres"},
    {key: SECTIONS.USER, value: "Usuarios"},
    {key: SECTIONS.ROLE, value: "Roles"},
    {key: SECTIONS.ASSISTANCE, value: "Asistencia"},
    {key: SECTIONS.RATINGS, value: "Valoraciones"},
    {key: SECTIONS.EVENTS, value: "Eventos"},
    {key: SECTIONS.INVENTORY, value: "Inventario"}
];

export const arrayPermissions = [
    {key: PERMISSIONS.CREATE, value: "Crear"},
    {key: PERMISSIONS.READ, value: "Visualizar"},
    {key: PERMISSIONS.UPDATE, value: "Editar"},
    {key: PERMISSIONS.DELETE, value: "Eliminar"}
];