import React from 'react'
import { Radio } from '@mantine/core'

export const RadioSelect = React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef
    RadioSelect.displayName = 'RadioSelect';

    React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
        <>
          <Radio color="cyan.6" size="sm" type="radio" ref={resolvedRef} {...rest} />
        </>
    )
})