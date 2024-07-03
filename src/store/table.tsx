import { create } from "zustand";

export enum TableType {
  approved = "Approved",
  proposed = "Proposed",
}

export const fromStringToTableType = (value: string | null): TableType => {
  return (
    Object.values(TableType).find(
      (target) => target.toLowerCase() === value?.toLowerCase()
    ) ?? TableType.approved
  );
};

export const useTableStore = create<{
  tableType: TableType;
  setTable: (param: TableType) => void;
}>((set) => ({
  tableType: TableType.approved,
  setTable: (tableType: TableType) => set((state) => ({ ...state, tableType })),
}));
