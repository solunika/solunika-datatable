import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import MUITableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { TableContext } from '..';

const TableHead = (props) => {
    const { onSelectAllClick, order, orderBy, onRequestSort } = props;

    const { columns, selected, rows, reload } = React.useContext(TableContext);
    const numSelected = selected.length,
        rowCount = rows.length
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <MUITableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }} />
                </TableCell>

                {columns.filter(c => !c.hide).map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy.id === headCell.id ? order : false}>
                        <TableSortLabel active={orderBy.id === headCell.id} direction={orderBy.id === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
                            {headCell.label}
                            {orderBy.id === headCell.id && <Box component="span" sx={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>}
                        </TableSortLabel>
                    </TableCell>
                ))}

            </TableRow>
        </MUITableHead>
    );
}

TableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.object.isRequired,
};


export default TableHead