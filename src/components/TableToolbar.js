import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Delete, FilterList, Replay, ViewColumn } from '@mui/icons-material/';
// import FilterPanel from './FilterPanel';
import { TableContext } from '..';
import FilterPanel from './FilterPanel';
import { Badge, Card, CardContent, Collapse } from '@mui/material';
import ColumnsMenuButton from './ColumnsMenuButton';
import ExportDataButton from './exportDataButton';

const TableToolbar = (props) => {

    const [filterPanel, setFilterPanel] = useState(false)
    const { rows, columns, selected, filters, reload, label } = useContext(TableContext);

    const { selectedActions: SelectedActionsComponent } = props;
    const numSelected = selected.length

    return <>
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}>
            {numSelected > 0 ?
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">{numSelected} selected</Typography>
                : <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">{label}</Typography>}

            {!!SelectedActionsComponent && !!numSelected && <SelectedActionsComponent selectedRows={rows.filter(r => selected.some(s => s === r.id))} />}
            <ColumnsMenuButton />
            <IconButton onClick={() => setFilterPanel(!filterPanel)}>
                <Badge color="primary" badgeContent={filters.length}>
                    <FilterList />
                </Badge>
            </IconButton>
            <ExportDataButton />
            <IconButton onClick={() => { if (typeof reload === "function") reload() }}>
                <Replay />
            </IconButton>
        </Toolbar>
        <div>
            <Card>
                <Collapse in={filterPanel}>
                    <CardContent>
                        <FilterPanel />
                    </CardContent>
                </Collapse>
            </Card >
        </div>
    </>
};

export default TableToolbar