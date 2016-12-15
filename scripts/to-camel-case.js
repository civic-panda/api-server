"use strict";
const _ = require("lodash");
function convertKeysToCamelCase(o) {
    const initialValue = Array.isArray(o) ? [] : {};
    if (typeof o === 'string' || o === null) {
        return o;
    }
    return Object.keys(o).reduce((prev, current) => {
        const ccKey = current.indexOf('_') > -1 ? _.camelCase(current) : current;
        if (Array.isArray(o[current])) {
            prev[ccKey] = o[current].map((el) => convertKeysToCamelCase(el));
        }
        else if (typeof o[current] === 'object') {
            prev[ccKey] = convertKeysToCamelCase(o[current]);
        }
        else {
            prev[ccKey] = o[current];
        }
        return prev;
    }, initialValue);
}
exports.convertKeysToCamelCase = convertKeysToCamelCase;