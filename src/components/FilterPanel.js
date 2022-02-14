import React, { useContext, useEffect } from 'react';
import { Button, MenuItem, TextField, Box, Portal } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { CustomDatePicker, CustomSelect } from '../components';
import { TableContext } from '..';
import { findOperator, getOperators } from './filterUtils';

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    button: {
        margin: 1
    },
    field: {
        margin: 1
    }
}));

export default (props) => {

    const { columns, filters, setFilters } = useContext(TableContext);

    const classes = useStyles()
    const getColumnConfig = (colId) => columns.find(c => c.id === colId)
    const container = React.useRef(null);



    return <Formik
        initialValues={{ filters }}
        onSubmit={async (values) => {
            const mappedValues = values.filters.map(({ columnField, value, operatorValue }, index) => ({ columnField, operatorValue, id: 1, value }))
            setFilters(mappedValues)
        }}>
        {({ values, touched, errors, handleChange, handleBlur, isValid, isSubmitting, handleSubmit }) => (
            <Form>
                <div style={{ width: "100%", display: "inline-flex", justifyContent: "flex-end", alignItems: 'center', }}>
                    <Box sx={{ p: 1 }} ref={container} />
                    <Button size="large" type="submit" variant="contained">Aplicar</Button>
                </div>
                <FieldArray name="filters">
                    {({ insert, remove, push }) => {
                        const addFilterRow = () => {
                            const defaultColumn = columns.find(c => !c.hide)
                            push({ columnField: defaultColumn.id, operatorValue: getOperators(defaultColumn.type)[0].id, value: "" })
                        }
                        return <div style={{ alignItems: 'center', }}>
                            <Portal container={container.current}>
                                <Button type="button" variant="outlined" onClick={addFilterRow}>Agregar Filtro</Button>
                            </Portal>
                            {values.filters.map((filter, index) => {
                                const nameColumn = `filters[${index}].columnField`;
                                const nameOperator = `filters[${index}].operatorValue`;
                                const nameValue = `filters[${index}].value`;
                                const nameDateValue = `filters[${index}].dateValue`;
                                const filterColumn = getColumnConfig(filter.columnField || columns[0].id)
                                // console.log(getOperators(filter.operatorValue, filterColumn.type)[0].id)

                                const getFilterValueComponent = (columnType = "string") => {
                                    // console.log(filter.value)
                                    if (columnType === "date") return <CustomDatePicker className={classes.field} label="Fecha" name={nameValue} value={filter.value || ""} required onChange={handleChange} onBlur={handleBlur} />
                                    return <TextField className={classes.field} label="Valor" name={nameValue} value={filter.value || ""} required onChange={handleChange} onBlur={handleBlur} />
                                }

                                return <div style={{ padding: "10px 0px" }} key={index}>
                                    <CustomSelect
                                        required
                                        className={classes.field}
                                        name={nameColumn}
                                        label="Columna"
                                        value={filter.columnField || columns[0].id}
                                        onChange={handleChange}
                                        onBlur={handleBlur}>
                                        {columns.filter(c => c.filtrable !== false).map((col, index) => <MenuItem key={index} value={col.id}>{col.label}</MenuItem>)}
                                    </CustomSelect>
                                    {/* {JSON.stringify(filterColumn)} */}
                                    <CustomSelect
                                        required
                                        className={classes.field}
                                        name={nameOperator}
                                        label="Operador"
                                        value={filter.operatorValue || getOperators(filterColumn.type)[0].id}
                                        onChange={handleChange}
                                        onBlur={handleBlur}>
                                        {getOperators(filterColumn.type).map((op, index) => <MenuItem key={index} value={op.id}>{op.label}</MenuItem>)}
                                    </CustomSelect>
                                    {!findOperator(filterColumn.type, filter.operatorValue).disableValue && getFilterValueComponent(filterColumn.type)}
                                    <Button className={classes.button} type="button" color="error" variant="outlined" onClick={() => remove(index)}>X</Button>
                                </div>
                            })}
                        </div>
                    }}
                </FieldArray>


            </Form>
        )}
    </Formik >
}




























// import * as React from 'react';
// import { GridAddIcon, GridApiContext, GridFilterForm, GridPanelContent, GridPanelFooter, GridPanelWrapper, useGridApiContext, useGridSelector, useGridState } from '@mui/x-data-grid';
// import { Button } from '@mui/material';
// // import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
// // import { useGridState } from '../../../hooks/features/core/useGridState';
// // import { optionsSelector } from '../../../hooks/utils/optionsSelector';
// // import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
// // import { GridApiContext } from '../../GridApiContext';
// // import { GridAddIcon } from '../../icons/index';
// // import { GridPanelContent } from '../GridPanelContent';
// // import { GridPanelFooter } from '../GridPanelFooter';
// // import { GridPanelWrapper } from '../GridPanelWrapper';
// // import { GridFilterForm } from './GridFilterForm';

// export default () => {
//     const apiRef = React.useContext(GridApiContext);
//     const gridState = apiRef.current.state
//     const { disableMultipleColumnsFiltering } = useGridSelector(apiRef, (state)=> state.options);

//     const hasMultipleFilters = React.useMemo(() => gridState.filter.items.length > 1, [
//         gridState.filter.items.length,
//     ]);

//     const applyFilter = React.useCallback(
//         (item) => {
//             apiRef.current.upsertFilter(item);
//         },
//         [apiRef],
//     );

//     const applyFilterLinkOperator = React.useCallback(
//         (operator) => {
//             apiRef.current.applyFilterLinkOperator(operator);
//         },
//         [apiRef],
//     );

//     const addNewFilter = React.useCallback(() => {
//         apiRef.current.upsertFilter({});
//     }, [apiRef]);

//     const deleteFilter = React.useCallback(
//         (item) => {
//             apiRef.current.deleteFilter(item);
//         },
//         [apiRef],
//     );

//     React.useEffect(() => {
//         if (gridState.filter.items.length === 0) {
//             addNewFilter();
//         }
//     }, [addNewFilter, gridState.filter.items.length]);

//     return (
//         <GridPanelWrapper>
//             <GridPanelContent>
//                 {gridState.filter.items.map((item, index) => (
//                     <GridFilterForm
//                         key={item.id}
//                         item={item}
//                         applyFilterChanges={applyFilter}
//                         deleteFilter={deleteFilter}
//                         hasMultipleFilters={hasMultipleFilters}
//                         showMultiFilterOperators={index > 0}
//                         multiFilterOperator={gridState.filter.linkOperator}
//                         disableMultiFilterOperator={index !== 1}
//                         applyMultiFilterOperatorChanges={applyFilterLinkOperator}
//                     />
//                 ))}
//             </GridPanelContent>
//             {!disableMultipleColumnsFiltering && (
//                 <GridPanelFooter>
//                     <Button onClick={addNewFilter} startIcon={<GridAddIcon />} color="primary">
//                         {apiRef.current.getLocaleText('filterPanelAddFilter')}
//                     </Button>
//                 </GridPanelFooter>
//             )}
//         </GridPanelWrapper>
//     );
// }