import { useState, useEffect, useCallback } from "react";
import debounce from 'lodash.debounce';

export const useListFilter = ({ text = '', isLoading = false, currentPage = 1, list = [], filterUpdateCallback = () => undefined }) => {
    /* @HINT: Setup the search query controller values - values that control the processing of the text search */
	const [controller, setController] = useState(() => ({
		text,
		isLoading,
		list,
		currentPage
	}))
	

	/* @HINT: Setup function to handle `onChange` event of any <input> or <textarea> element used to enter text search query */
	const handleFilterTrigger = useCallback((event, listItemKeys = ['']) => {
        /* @HINT: Only react to `chnage` events from text inputs */
        if (
            event &&
            event.type === 'change' &&
            'value' in event.target &&
            !event.defaultPrevented
        ) {
            /* @HINT: get the search query from the <input> or <textarea> element */
            const searchTerm = event.target.value

            /* @HINT: Update the state depending on whether a 
                  search term was entered into the text input element */
            if (searchTerm !== '') {
                setController((prevController) => ({
                    ...prevController,
                    text: searchTerm,
                    isLoading: true
                }))
            } else {
                setController((prevController) => ({
                    ...prevController,
                    text: searchTerm,
                    isLoading: false,
                    list,
                    currentPage: 1
                }))
                return
            }

            const filteredList = debounce(
                (searchTerm, listItemKeys) => directFilter(searchTerm, list, listItemKeys)
            );

            /* @HINT: filtering on the client-side returned results so update state accordingly */
            setController({
                text: searchTerm,
                isLoading: false,
                list: filteredList,
                currentPage: 1
            })
        }
    }, [list]);

    useEffect(() => {
		/* @NOTE: The conditions and nested `if`s' are necessary */
		/* @NOTE: They are necessary so the `useState()` setter is not called in an infinite loop */
		if (list.length === 0) {
			if (controller.list.length !== list.length) {
				if (controller.text === '') {
					setController((prevController) => ({
						...prevController,
						list
					}))
				}
			}
			return
		}

		if (controller.text === '') {
			if (controller.list.length === 0
					|| controller.list.length !== list.length
						|| controller.list !== list) {
				setController((prevController) => ({
					...prevController,
					list
				}))
			} else {
				if (controller.currentPage !== currentPage) {
					setController((prevController) => ({
						...prevController,
						currentPage,
						list
					}))
				}
			}
		} else {
			if (controller.text === text) {
				if (controller.list !== list) {
					setController((prevController) => ({
						...prevController,
						list
					}))
				}
			}
		}
	}, [list, text, controller, currentPage])

	useEffect(() => {
		
		let shutdownCallback = function () {
			return undefined
		}


		if (controller.text !== text) {
			shutdownCallback = filterUpdateCallback(controller)

		}

		return () => {
			if (typeof shutdownCallback === "function") {
				shutdownCallback()
			}
		}
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [text, controller])

	useEffect(() => {
		if (controller.list !== list || controller.text !== text) {
		   onListChanged({ ...controller, list })
		}
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [list, text, controller])

	/* @HINT: Finally, return controller and chnage event handler factory function */
	return [controller, handleFilterTrigger.bind(null)]

}