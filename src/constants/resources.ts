import { PERMISSIONS } from "./permissions";
import { SECTIONS } from "./sections";

export const arraySections = [
    {key: SECTIONS.BENEFICIARY, value: "Beneficiarios"},
    {key: SECTIONS.ACTIVITY, value: "Actividades"},
    {key: SECTIONS.USER, value: "Usuarios"},
    {key: SECTIONS.ROLE, value: "Roles"},
    {key: SECTIONS.ASSISTANCE, value: "Talleres"},
    {key: SECTIONS.RATINGS, value: "Valoraciones"},
    {key: SECTIONS.EVENTS, value: "Eventos"},
    {key: SECTIONS.INVENTORY, value: "Articulos"},
    {key: SECTIONS.ASSOCIATIONS, value: "Asociaciones"},
    {key: SECTIONS.WINERIES, value: "Bodegas"}
];

export const arrayPermissions = [
    {key: PERMISSIONS.CREATE, value: "Crear"},
    {key: PERMISSIONS.READ, value: "Visualizar"},
    {key: PERMISSIONS.UPDATE, value: "Editar"},
    {key: PERMISSIONS.DELETE, value: "Eliminar"}
];