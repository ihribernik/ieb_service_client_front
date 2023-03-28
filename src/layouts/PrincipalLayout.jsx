import { Button, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import CustomNoRowsOverlay from '../components/CustomNoRowsOverlay';
import Form from '../components/Form';
import Header from '../components/Header';

const columnSettings = [
  { field: 'id', header: 'id' },
  { field: 'buy_price', header: 'buy_price' },
  { field: 'sell_price', header: 'sell_price' },
  { field: 'description', header: 'description' },
];

const WS_URL = 'ws://127.0.0.1:8001/ws/';

function PrincipalLayout() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [url, setUrl] = useState(WS_URL);
  const [isOpen, setIsOpen] = useState(true);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    url,
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
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData.message)) {
          setRows([...parsedData.message]);
        } else {
          setRows([{ ...parsedData.message }]);
        }
      }
    }
  }, [lastMessage, setRows]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

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
              disableColumnMenu
              rowCount={rows.length}
              loading={readyState === ReadyState.CONNECTING}
              pagination
              paginationMode="client"
              rowsPerPageOptions={[5, 10, 20]}
              sortingMode="client"
              components={{
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
              componentsProps={{
                pagination: { labelRowsPerPage: 'Filas por página' },
              }}
              autoPageSize
            />
          </Grid>
        </Grid>
      </main>
    </>
  );
}

export default PrincipalLayout;
