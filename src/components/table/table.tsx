import { ReactNode } from 'react';
import './table.scss'; // Ajusta la ruta a tu archivo de estilos

type TableRowProps = {
    children: ReactNode;
    header?: boolean;
    handlerRowClick?: ()=>void;
};

const Table = ({ children }: TableRowProps) => {
  return (
    <table className="table-component">
      {children}
    </table>
  );
};


const TableRow = ({ children, header, handlerRowClick }: TableRowProps) => {
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
        <tr className={rowClassName} onClick={handlerRowClick}>
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