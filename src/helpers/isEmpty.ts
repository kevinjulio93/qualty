export function isEmpty<T = any>(variable: T, includeFalsy = false): boolean {
    return (
      variable == null ||
      (typeof variable == "number" &&
        includeFalsy &&
        (Number(variable) === 0 || Object.is(variable, -0) || isNaN(variable))) ||
      (typeof variable == "string" && variable.length === 0) ||
      (typeof variable == "boolean" && includeFalsy && variable === false) ||
      (Array.isArray(variable) && variable.length === 0) ||
      ((getTag(variable) === "[object Map]" ||
        getTag(variable) === "[object Set]") &&
        (variable as any | Set<T>).size === 0) ||
      (variable instanceof Date && isNaN(variable.valueOf())) ||
      (typeof variable === "function" &&
        Object.prototype.toString.call(variable).indexOf("Function") === 0) ||
      (!(variable instanceof Date) &&
        typeof variable !== "function" &&
        isObject(variable) &&
        Object.entries(variable).length === 0) ||
      (getTag(variable) === "[object NodeList]" &&
        Object.entries(variable).length === 0)
    );


}

function getTag(value: any): string {
    if (value == null) {
      return value === undefined ? "[object Undefined]" : "[object Null]";
    }
    return Object.prototype.toString.call(value);
}

function isObject(obj: any): boolean {
    return (
      !Array.isArray(obj) &&
      obj === Object(obj) &&
      getTag(obj) !== "[object Function]" &&
      (getTag(obj) === "[object Object]" || getTag(obj) === "[object Date]")
    );
}