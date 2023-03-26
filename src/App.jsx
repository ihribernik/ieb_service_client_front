import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { Button } from '@mui/material';
import './App.css';
import CustomNoRowsOverlay from './components/CustomNoRowsOverlay';

const columnSettings = [
  { field: 'id', header: 'id' },
  { field: 'buy_price', header: 'buy_price' },
  { field: 'sell_price', header: 'sell_price' },
  { field: 'description', header: 'description' },
];

function App() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState(columnSettings);
  const [pageSize, setPageSize] = useState(5);
  const changeIntervalRef = React.useRef(null);
  const [pausedTimer, setPausedTimer] = React.useState(true);
  const [buttonLabel, setButtonLabel] = React.useState('Start');

  const [rowsState, setRowsState] = useState({
    page: 0,
    pageSize,
  });

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    'ws://127.0.0.1:8001/ws/',
  );

  useEffect(() => {
    if (lastMessage !== null) {
      const { data } = lastMessage;
      if (data) {
        const parsedData = JSON.parse(data);
        setRows([...parsedData.message]);
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

  const startDataChange = () => {
    clearInterval(changeIntervalRef.current);
    changeIntervalRef.current = setInterval(() => {
      const finalMessage = {
        type: 'get_info',
        message: {
          type: 'algo',
        },
      };
      sendMessage(JSON.stringify(finalMessage));
    }, 1000);
  };

  // Pauses the data being updated
  const pauseDataChange = () => {
    clearInterval(changeIntervalRef.current);
  };

  const updateButtonLabel = () => {
    if (pausedTimer) {
      setButtonLabel('Stop');
    } else {
      setButtonLabel('Start');
    }
  };

  const onStartStopClick = () => {
    updateButtonLabel();

    if (pausedTimer) {
      startDataChange();
      setPausedTimer(!pausedTimer);
    } else {
      pauseDataChange();
      setPausedTimer(!pausedTimer);
    }
  };

  return (
    <div>
      <Button onClick={onStartStopClick}>{buttonLabel}</Button>
      <span>{`The WebSocket is currently ${connectionStatus}`}</span>

      <DataGrid
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        autoHeight
        disableColumnMenu
        rowCount={rows.length}
        // loading={isLoading}
        pagination
        paginationMode="server"
        onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
        rowsPerPageOptions={[5, 10, 20]}
        {...rowsState}
        onPageSizeChange={(pageS) => {
          setRowsState((prev) => ({ ...prev, pageSize: pageS }));
        }}
        sortingMode="server"
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        componentsProps={{
          pagination: { labelRowsPerPage: 'Filas por página' },
        }}
      />
    </div>
  );
}

export default App;
