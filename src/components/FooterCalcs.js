import { MenuItem, TableCell, TableFooter, TableRow } from '@mui/material';
import React, { useContext, useState } from 'react';
import { TableContext } from '..';
import { CustomSelect } from '../components';

export default (props) => {
    const { columns, setColumns, footerRow } = useContext(TableContext);
    const FooterOptions = {
        none: (rows) => "",
        Total: (rows) => rows.length,
        Suma: (rows, col) => rows.reduce((p, c) => p + c[col.id], 0),
        Promedio: (rows, col) => rows.reduce((p, c) => p + c[col.id], 0) / rows.length,
    }

    return <TableFooter>
        <TableRow>
            <TableCell />
            {columns.filter(c => !c.hide).map((col, index) => {
                return <TableCell style={{ textAlign: "right" }} key={`footer-${col.id}`}>
                    <CustomSelect
                        onChange={(e) => {
                            const columnsCP = [...columns]
                            console.log(e)
                            columnsCP[columns.findIndex(c => c.id === col.id)].calcFooter = FooterOptions[e.target.value]
                            setColumns(columnsCP)
                        }}
                        variant="filled"
                        renderValue={(value) => `${value} ${footerRow[col.id] || ""}`}
                        style={{ width: "100%" }}
                        defaultValue={"none"}>
                        <MenuItem value="none"></MenuItem>
                        <MenuItem value="Total">Total</MenuItem>
                        <MenuItem value="Suma">Suma</MenuItem>
                        <MenuItem value="Promedio">Promedio</MenuItem>
                    </CustomSelect>
                </TableCell>
            })}
        </TableRow>
    </TableFooter>
};