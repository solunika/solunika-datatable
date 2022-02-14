import { TableCell } from "@mui/material"
import { get } from 'lodash';

export const renderRow = (row, columns, labelId) => {
    const checkboxProps = { component: "th", id: labelId, scope: "row", padding: "none" }
    return columns.filter(c => !c.hide).map((col, index) => {
        let rowProps = {  }
        if (index === 0) rowProps = { ...rowProps, ...checkboxProps }
        let cellContent = null;
        if (typeof col.customRender === "function") cellContent = col.customRender(row)
        else cellContent = String(get(row, col.id, ""))
        return <TableCell {...rowProps} key={`${row.id}-${col.id}`}>{cellContent}</TableCell>
    })
}