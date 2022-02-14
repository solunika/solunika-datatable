import * as React from 'react';
import { DataGrid, GridLinkOperator, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { Box } from '@mui/system';
import ListPanel from './components/listPanel';
import FilterPanel from './components/FilterPanel';

const ZenDataGrid = styled(DataGrid)(() => ({
    "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": { outline: "none !important" },
    "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus": { outline: "none !important" },
}));

export default ({ rows, columns = [], style, ...props }) => {

    const container = React.useRef(null);
    const [sortModel, setSortModel] = React.useState([]);
    const [filterModel, setFilterModel] = React.useState({ items: [] })
    const [filters, setFilters] = React.useState([])
    const columnDefaults = { flex: 1, align: "center", headerAlign: "center", disableColumnMenu: false }

    // React.useEffect(() => console.log(filterModel.items), [filterModel])

    rows = rows.map(r => {
        let customRow = { ...r }
        columns?.forEach(c => customRow[c.headerName] = _.get(r, c.field, c.defaultValue || ""))
        return customRow
    })
    const CustomToolbar = () => {
        return (
            <>
                <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end" }}>
                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                    <GridToolbarDensitySelector />
                    <GridToolbarExport />
                </GridToolbarContainer>
                <Box sx={{ p: 1, my: 1 }} ref={container} />
            </>
        );
    }

    const mapColumns = () => [{ ...GRID_CHECKBOX_SELECTION_COL_DEF, flex: 0 }, ...columns?.map(c => ({ ...columnDefaults, ...c, field: c.headerName }))]
    const columnsMaped = mapColumns()

    return (<>
        {JSON.stringify(filters)}
        <ZenDataGrid
            {...props}
            autoHeight
            columns
            rows={rows}
            columns={columnsMaped}
            sortModel={sortModel}
            filterModel={{items: filters, linkOperator: "and"}}
            // onFilterModelChange={(model) => setFilterModel(model)}
            onSortModelChange={(model) => setSortModel(model)}
            rowsPerPageOptions={[5, 50, 100]}
            components={{
                FilterPanel: () => <FilterPanel columns={columns} filterModel={filterModel} setFilters={(filters) => { setFilters(filters); setFilterModel({ items: filters, linkOperator: "and" }) }} />,
                Toolbar: CustomToolbar,
                Panel: (props) => <ListPanel {...props} container={container.current} />,
            }}
        />
    </>
    );
}
