export const getById = (entities) => (id) =>
  entities.find((entity) => entity.id === id);

export const updateById = (entities) => (id, data) => {
  const index = entities.findIndex((entity) => entity.id === id);
  entities[index] = { ...entities[index], ...data };

  return entities[index];
};
