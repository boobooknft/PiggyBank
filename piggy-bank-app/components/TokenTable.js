import React, { useEffect, useMemo, useState } from 'react'
import { useTable, useRowSelect } from 'react-table'
import { COLUMNS } from './Columns'
import { RadioSelect } from './RadioSelect'
import { Table, Title, Paper } from '@mantine/core'


export const TokenTable = ({finalTokenDetails, setSelectedRowId }) => {

    const [selectedRows, setSelectedRows] = useState([])   

    const columns = useMemo (() => COLUMNS, [])
    const data = useMemo (() => finalTokenDetails, [finalTokenDetails])

    const getRowId = (row, parent) => {
        return parent ? [parent.id, row.TokenID].join("") :row.TokenID;
    }

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        rows, 
        prepareRow,
        state: { selectedRowPaths }
    } = useTable(
        {
        columns,
        data,
        getRowId,
        state: { 
            selectedRowPaths: selectedRows
        },
        autoResetSelectedRows: false,
        // initialState:  { selectedRowIds }
        }, 
        useRowSelect,
        (hooks) => {
          hooks.visibleColumns.push((columns) => {
            return [
              {
              id: 'selection',
                Cell: ({ row, toggleAllRowsSelected, toggleRowSelected }) => {
                  return(
                    <div>
                      <RadioSelect 
                        {...row.getToggleRowSelectedProps()}
                        onClick={() => {
                        toggleAllRowsSelected(false)
                        toggleRowSelected(row.id, true)
                        setSelectedRowId(row.id)
                        }} 
                        />
                    </div>        
                )
            }
        },
        ...columns
        ]
        })
        }
    )

    useEffect(() => {
        setSelectedRows(selectedRowPaths);
    }, [setSelectedRows, selectedRowPaths])

    console.log('NFTTable Render')

    return (
        <Paper p="lg">
            <Title 
            order={2}
            align="center">
                NFT Table
            </Title>
            <Table 
                mt="lg"
                fontSize="md" 
                {...getTableProps()}
                highlightOnHover
                horizontalSpacing="md"
                >
                <thead>
                    {headerGroups.map((headerGroup,i) => (
                    <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                        <th key={column.Header} {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                    ))}           
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map((row,i) => {
                            prepareRow(row)
                            return (
                                <tr key={i} {...row.getRowProps()}>
                                {
                                row.cells.map( cell => {
                                return <td key={cell.TokenID} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>                   
        </Paper>
    )
}
