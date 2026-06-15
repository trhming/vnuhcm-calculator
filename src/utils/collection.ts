export const findById = <T extends { id: string }>(items: T[], id: string) => (
  items.find((item) => item.id === id)
);
