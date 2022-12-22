"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapValues = void 0;
const mapValues = (obj, mapper) => {
    const entries = Object.entries(obj);
    return entries.reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: mapper(value) })), {});
};
exports.mapValues = mapValues;
