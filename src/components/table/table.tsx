import { ReactNode } from 'react';
import './table.scss'; // Ajusta la ruta a tu archivo de estilos

type TableRowProps = {
    children: ReactNode;
    header?: boolean;
};

const Table = ({ children }: TableRowProps) => {
  return (
    <table className="table-component">
      {children}
    </table>
  );
};

const TableRow = ({ children, header }: TableRowProps) => {
  const rowClassName = header ? 'table-header-row' : 'table-data-row';
  return (
    header ?
    <thead>
        <tr className={rowClassName}>
            {children}
        </tr>
    </thead>
    :
    <tbody>
        <tr className={rowClassName}>
            {children}
        </tr>
    </tbody>
  );
};

const TableCell = ({ children }: TableRowProps) => {
  return (
    <td>
      {children}
    </td>
  );
};

export { Table, TableRow, TableCell };