import { Download } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useRef, useContext } from "react"
import { TableContext } from "..";
import { json2csvAsync } from 'json-2-csv';

export default (props) => {

    const { columns, rows, label } = useContext(TableContext);
    const downloadElem = useRef(null);

    return <>
        <IconButton onClick={async () => {
            const report = rows.map(r => {
                let mappedRow = {}
                columns.forEach(c => {
                    if (c.customStringValue) mappedRow[c.label] = c.customStringValue(r)
                    else if (typeof r[c.id] === "string") mappedRow[c.label] = r[c.id]
                    else mappedRow[c.label] = r[c.id]
                })
                return mappedRow
            })
            const csv = await json2csvAsync(report, { wrap: true })
            const blob = new Blob([csv]);
            downloadElem.current.href = URL.createObjectURL(blob)
            downloadElem.current.click()
        }}>
            <Download />
        </IconButton>
        <a style={{ display: "none" }} download={`${label}.csv`} ref={downloadElem} />
    </>
}