import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

function Table({ data, columns, paginator, rows }) {
    return (
        <DataTable
            value={data}
            emptyMessage={
                <h6 className='text-xs md:text-sm font-tbPop font-medium  text-slate-600 md:text-center py-4'>
                    Data not found!
                </h6>
            }
            lazy={true}
            tableStyle={{ minWidth: '50rem' }}
            stripedRows
            resizableColumns="expand"
            paginator={paginator}
            rows={25}
            className="!font-tbPop"
            rowsPerPageOptions={[25, 50, 100]}
            sortMode="multiple"
        >
            {columns.map((col) => (
                <Column key={col.field} field={col.field} header={<h4 className='font-tbLex font-medium text-xs md:text-sm capitalize'>{col.header}</h4>} body={col.body} style={col.style ? "" : { width: '100%' }} sortable={!col.sortable} className='!font-tbPop' />
            ))}
        </DataTable>
    )
}

export default Table
