import { get } from "lodash";

const getvalueForComparator = (row, column) => {
    let value = "";
    if (typeof column.customRender === "function") value = column.customStringValue(row)
    else value = get(row, column.id, "")
    return value
}

const descendingComparator = (a, b, orderBy) => {
    const aValue = getvalueForComparator(a, orderBy)
    const bValue = getvalueForComparator(b, orderBy)
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
}

export const getComparator = (order, orderBy) => {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}



// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}