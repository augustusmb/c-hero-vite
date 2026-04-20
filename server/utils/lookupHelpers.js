// Resolves a react-select-shaped option ({ value, label, __isNew__? }) to a
// primary-key id. Returns null when the field is missing, or inserts a new
// row within the given transaction when __isNew__ is true.
export const resolveLookupId = async (t, field, insertQuery) => {
  if (!field) return null;
  if (field.__isNew__) {
    return t.one(insertQuery, { name: field.label }, (row) => row.id);
  }
  return field.value ?? null;
};
