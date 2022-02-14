import { isSameDay, isBefore, isAfter, isDate } from "date-fns"

export const StringOperators = [
    { id: "string-contains", label: "Contiene", filterFunction: (cellStringValue, filterStringValue) => RegExp(filterStringValue, "i").test(cellStringValue) },
    { id: "string-equals", label: "Es igual", filterFunction: (cellStringValue, filterStringValue) => RegExp(`^${filterStringValue}$`, "i").test(cellStringValue) },
    { id: "string-startsWith", label: "Empieza con", filterFunction: (cellStringValue, filterStringValue) => RegExp(`^${filterStringValue}`, "i").test(cellStringValue) },
    { id: "string-endsWith", label: "Termina con", filterFunction: (cellStringValue, filterStringValue) => RegExp(`${filterStringValue}$`, "i").test(cellStringValue) },
    { id: "string-isEmpty", label: "Es vacio", filterFunction: cellStringValue => !cellStringValue, disableValue: true },
    { id: "string-notEmpty", label: "No es vacio", filterFunction: cellStringValue => !!cellStringValue, disableValue: true },
]

export const DateOperators = [
    { id: "date-is", label: "Es", filterFunction: isSameDay },
    { id: "date-notIs", label: "No es", filterFunction: (cellDateValue, filterDateValue) => !isSameDay(cellDateValue, filterDateValue) },
    { id: "date-isBefore", label: "Es antes", filterFunction: isBefore },
    { id: "date-isAfter", label: "Es despues", filterFunction: isAfter },
    { id: "date-isEmpty", label: "Es vacio", filterFunction: isDate, disableValue: true },
    { id: "date-notEmpty", label: "No es vacio", filterFunction: cellDateValue => !isDate(cellDateValue), disableValue: true },
]

export const NumberOperators = [
    { id: "number-eq", label: "Es igual", filterFunction: (cellNumberValue, filterNumberValue) => cellNumberValue === filterNumberValue },
    { id: "number-neq", label: "No es igual", filterFunction: (cellNumberValue, filterNumberValue) => cellNumberValue !== filterNumberValue },
    { id: "number-gt", label: "Mayor que", filterFunction: (cellNumberValue, filterNumberValue) => cellNumberValue > filterNumberValue },
    { id: "number-gte", label: "Mayor o igual que", filterFunction: (cellNumberValue, filterNumberValue) => cellNumberValue >= filterNumberValue },
    { id: "number-lt", label: "Menor que", filterFunction: (cellNumberValue, filterNumberValue) => cellNumberValue < filterNumberValue },
    { id: "number-lte", label: "Menor o igual que", filterFunction: (cellNumberValue, filterNumberValue) => cellNumberValue <= filterNumberValue },
    { id: "string-empty", label: "Es vacio", filterFunction: cellNumberValue => !cellNumberValue && isNaN(cellNumberValue), disableValue: true },
    { id: "number-notEmpty", label: "No es vacio", filterFunction: cellNumberValue => !isNaN(cellNumberValue), disableValue: true },
]

export const getOperators = (columnType = "string") => {
    let operators
    // if (columnType === "string") operators = StringOperators
    if (columnType === "date") operators = DateOperators
    else if (columnType === "number") operators = NumberOperators
    else operators = StringOperators
    // if (columnType === "boolean") operators = getGridBooleanOperators()
    // if (columnType === "date") operators = getGridDateOperators()
    // if (columnType === "number") operators = getGridNumericColumnOperators()
    return operators
}

export const findOperator = (columnType, operatorId) => getOperators(columnType).find(op => op.id === operatorId) || getOperators(columnType)[0]