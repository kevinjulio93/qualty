import { ReactNode } from 'react';
import './Table.scss'; // Ajusta la ruta a tu archivo de estilos

type TableRowProps = {
    children: ReactNode;
    header?: boolean;
};

const Table = ({ children }: TableRowProps) => {
  return (
    <table className="table">
      {children}
    </table>
  );
};

const TableRow = ({ children, header }: TableRowProps) => {
  const rowClassName = header ? 'table-header-row' : 'table-data-row';
  return (
    <tr className={rowClassName}>
      {children}
    </tr>
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