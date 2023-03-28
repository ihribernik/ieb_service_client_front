import { Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import CustomNoRowsOverlay from '../components/CustomNoRowsOverlay';
import Form from '../components/Form';
import Header from '../components/Header';
import { WS_URL } from '../constants';
import { getConnectionStatus } from '../utils';

const columnSettings = [
  { field: 'id', header: 'id' },
  { field: 'buy_price', header: 'buy_price' },
  { field: 'sell_price', header: 'sell_price' },
  { field: 'description', header: 'description' },
];

function PrincipalLayout() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    WS_URL,
    {
      shouldReconnect: () => true,
    },
    isOpen,
  );

  useEffect(() => {
    setColumns(columnSettings);
    return () => {};
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      const { data } = lastMessage;
      if (data) {
        const { message, type } = JSON.parse(data);
        if (Array.isArray(message)) {
          if (message.length === 0) {
            if (type === 'start') {
              sendMessage(
                JSON.stringify({
                  type: 'get_info',
                }),
              );
            } else if (type === 'error') {
              setRows([]);
              console.log('Error: ', message);
            }
          } else {
            setRows([...message]);
          }
        } else {
          setRows([{ ...message }]);
        }
      }
    }
  }, [lastMessage, setRows]);

  const connectionStatus = getConnectionStatus(readyState);

  const startDataChange = (id) => {
    const finalMessage = {
      type: 'get_info',
      action: 'start',
      id,
    };
    sendMessage(JSON.stringify(finalMessage));
  };

  const onSubmit = ({ id }) => {
    if (id !== '') {
      startDataChange(id);
    }
  };

  const handleToogleConection = () => setIsOpen((current) => !current);

  return (
    <>
      <Header
        status={connectionStatus}
        readyState={readyState}
        onClick={handleToogleConection}
      />

      <main>
        <Grid
          container
          sx={{ marginY: 1 }}
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Form onSubmit={onSubmit} readyState={readyState} />
          </Grid>

          <Grid item>
            <DataGrid
              rows={rows}
              columns={columns}
              disableSelectionOnClick
              autoHeight
              autoWidht
              disableColumnMenu
              rowCount={rows.length}
              loading={readyState === ReadyState.CONNECTING}
              pagination
              paginationMode="server"
              rowsPerPageOptions={[5, 10, 20]}
              sortingMode="server"
              components={{
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
              componentsProps={{
                pagination: { labelRowsPerPage: 'Filas por página' },
              }}
              autoPageSize
              hideFooterSelectedRowCount
            />
          </Grid>
        </Grid>
      </main>
    </>
  );
}

PrincipalLayout.propTypes = {};

export default PrincipalLayout;
