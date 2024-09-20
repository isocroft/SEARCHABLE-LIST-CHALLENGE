import * as React from "react";
import type { DataItem } from "../tests/mockDataGenerator";
import { generateMockData } from "../tests/mockDataGenerator";
import useListSorter from "./useListSorter";
import { SORT_ORDER } from "../constants";

// This is the expected return type for the useDataManagement hook
export type DataManagementResult = {
  items: DataItem[];
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  categories: string[];
  search?: string;
  currentPage: number;
  category?: string;
  sortBy?: string;
  nextPage: () => void;
  previousPage: () => void;
  setSearch: (query: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: string) => void;
};

export function useDataManagement(): DataManagementResult {
  // Implement your solution here
  const isMounted = React.useRef(false)

  const [dataState, setDataState] = React.useState<{
    items: DataItem[],
    query: string,
    loading: boolean,
    sortBy: 'name' | 'category' | 'date' | (string & {}),
    category: string,
    currentPage: number,
    categories: string[],
    error: string | null
  }>({
    items: [],
    query: "",
    loading: false,
    sortBy: "",
    category: "",
    categories: [],
    currentPage: 1,
    error: null
  });

  const [updatedItems, handleSortFor] = useListSorter(dataState.items, SORT_ORDER.ASCENDING, "")

  React.useEffect(() => {
    if (isMounted.current === false) {
      isMounted.current = true;
    }

    const getData = async () => {
      const response = await generateMockData();
      return response;
    };

    if (isMounted.current) {
      setDataState((prevDataState) => {
        return { ...prevDataState, loading: true }
      });
      getData().then((items) => {
        const categories = items.map((item) => item.category);
        setDataState((prevDataState) => {
          return { ...prevDataState, loading: false, items, categories }
        })
      });
    }

    return () => {
      isMounted.current = false;
    }
  }, []);

  return {
    items: dataState.items,
    isLoading: dataState.loading,
    totalItems: dataState.items.length,
    totalPages: 100,
    currentPage: dataState.currentPage,
    category: dataState.category,
    categories: dataState.categories,
    setSearch (query: string) {
      setDataState((prevDataState) => {
        return {...prevDataState, query }
      });
    },
    setCategory (category: string) {
      setDataState((prevDataState) => {
        return {...prevDataState, category }
      });
    },
    setSortBy (sortBy: string) {
      setDataState((prevDataState) => {
        return {...prevDataState, sortBy }
      });
    }
  };
}
