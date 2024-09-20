import { useState } from "react";

import { SORT_ORDER } from "../constants"

/* @CHECK: https://stackoverflow.com/a/979325 */
const sortBy = (field: string, order = SORT_ORDER.ASCENDING, primer = (value: number | bigint | string) => value) => {
    const key = function(item: Record<string, number | bigint | string>) {
        return primer ? primer(item[field]) : item[field]
    } 
  
    const reverse = order === SORT_ORDER.ASCENDING ? 1 : -1;
  
    return function(a: Record<string, number | bigint | string>, b: Record<string, number | bigint | string>) {
      
      const $a = key(a);
      const $b = key(b); 
      //@ts-ignore
      return reverse * (($a > $b) - ($b > $a));
    }
}
  

export default function useListSorter (list: Record<string, number | bigint | string>[], defaultSortOrder = SORT_ORDER.ASCENDING, property = "") {
    const [sortedList, setSorted] = useState<Record<string, number | bigint | string>[]>(() => {
      return list.concat().sort(sortBy(property, defaultSortOrder))
    });

    const handleSortFor = (sortProp: string, sortOrder = SORT_ORDER.ASCENDING) => {
      /* eslint-disable */
      if (!sortProp || typeof sortProp !== "string") {
        setSorted((prevSortedList) => {
          return prevSortedList.concat().sort((a, b) => {
            if ((a instanceof Object)
                || (b instanceof Object)
                    || a === b) {
              return 0
            }

            if (sortOrder === SORT_ORDER.ASCENDING) {
              return a < b ? 1 : -1
            } else {
              return a > b ? -1 : 1
            }
          })
        });
        return true;
      }

      setSorted((prevSortedList) => {
        return prevSortedList.concat().sort((a, b) => {
            if (!(a instanceof Object)
                || !(b instanceof Object)) {
                return 0
            }

            if (a[sortProp] === b[sortProp]) {
                return 0
            }

            if (sortOrder === SORT_ORDER.ASCENDING) {
                return (a[sortProp] < b[sortProp])
                ? 1
                : -1
            } else {
                return a[sortProp] > b[sortProp]
                ? -1
                : 1
            }
        })
      });
    };

    return [sortedList, handleSortFor, sortBy];
}