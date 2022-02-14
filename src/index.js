import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, Checkbox, Tooltip, IconButton, TableFooter, Select, NativeSelect, MenuItem } from '@mui/material';
import { Message } from '@mui/icons-material';
import { getComparator, stableSort } from './utils';
import TableToolbar from './components/TableToolbar';
import TableHead from './components/TableHead';
import { renderRow } from './components/rowRenderer';
import { findOperator } from './components/filterUtils';
import { CustomSelect } from '..';
import FooterCalcs from './components/FooterCalcs';

export const TableContext = React.createContext("tableContext");

export default (props) => {

  const [filters, setFilters] = React.useState([])
  const [order, setOrder] = React.useState('asc');
  const [columns, setColumns] = React.useState(props.columns);
  const [orderBy, setOrderBy] = React.useState(props.columns[0]);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const [rows, setRows] = React.useState(props.rows);
  const [footerRow, setFooterRow] = React.useState({});


  const calcFooter = (newRows) => {
    let footer = {}
    columns.filter(c => !c.hide && typeof c.calcFooter === "function").forEach(c => footer[c.id] = c.calcFooter(newRows, c))
    return footer
  }
  const calcRows = () => {
    if (!filters.length) return props.rows
    return props.rows
      .filter(row => filters.every(filter => {
        let stringCellValue = ""
        const columnConfig = columns.find(col => col.id === filter.columnField)
        if (columnConfig.customRender) stringCellValue = columnConfig.customStringValue(row)
        else stringCellValue = row[filter.columnField]
        const filterOp = findOperator(columnConfig.type, filter.operatorValue)
        if (columnConfig.type === "number") return filterOp.filterFunction(parseFloat(stringCellValue), parseFloat(filter.value))
        console.log(parseFloat(stringCellValue), filter.value)
        if (columnConfig.type === "date") return filterOp.filterFunction(new Date(parseFloat(row[columnConfig.id])), new Date(filter.value))
        return filterOp.filterFunction(stringCellValue, filter.value)
      }))
  }

  React.useEffect(() => {
    const calculatedRows = calcRows()
    const footer = calcFooter(calculatedRows)
    setSelected([]);
    setRows(calculatedRows)
    setFooterRow(footer)

  }, [props.rows, filters])

  React.useEffect(() => {
    const footer = calcFooter(rows)
    setFooterRow(footer)
  }, [columns])

  const tableContextValue = { label: props.label, columns: columns, rows: rows, selected, setSelected, filters, setFilters, reload: props.reload, setColumns, footerRow };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy.id === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columns.find(c => c.id === property));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, name);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  return (
    <TableContext.Provider value={tableContextValue}>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%' }}>
          <TableToolbar selectedActions={props.selectedActions} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'small'}>
              <TableHead
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(rows || [], getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return <TableRow key={`tablerow-${index}`} hover onClick={(event) => handleClick(event, row.id)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}>
                      <TableCell key={`${row.id}-checkboxCol`} padding="checkbox"><Checkbox color="primary" checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId, }} /></TableCell>

                      {renderRow(row, columns, labelId)}
                    </TableRow>
                  })}
                {emptyRows > 0 && <TableRow key={`empty`} style={{ height: (33) * emptyRows }}><TableCell key={"asd"} colSpan={6} /></TableRow>}
              </TableBody>
              <FooterCalcs />
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box >
    </TableContext.Provider >
  );
}

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}
