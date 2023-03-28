import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WS_URL } from '../constants';
import { getConnectionStatus } from '../utils';

function Form({ readyState, onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      id: '',
    },
  });

  const [selectValues, setSelectValues] = useState([]);

  const ws = useWebSocket(WS_URL, { shouldReconnect: () => true }, true);

  const connectionStatus = getConnectionStatus(ws.readyState);

  async function retriveInfo() {
    if (ws.readyState !== ReadyState.OPEN) return;
    const finalMessage = JSON.stringify({
      type: 'get_info_all',
      message: {
        id: 1,
      },
    });
    ws.sendMessage(finalMessage);
  }

  useEffect(() => {
    if (ws.lastMessage !== null) {
      const { data } = ws.lastMessage;
      if (data) {
        const { message, type } = JSON.parse(data);
        if (Array.isArray(message)) {
          if (message.length === 0) {
            if (type === 'start') {
              retriveInfo();
            } else if (type === 'error') {
              setSelectValues([]);
              console.log('Error: ', message);
            }
          } else {
            const parsedSelect = message.map((currData) => ({
              label: currData.id,
              value: currData.id,
            }));
            setSelectValues(parsedSelect);
          }
        } else {
          const parsedSelect = [{ label: message.id, value: message.id }];
          setSelectValues(parsedSelect);
        }
      }
    }
  }, [ws.lastMessage, setSelectValues]);

  useEffect(() => {
    retriveInfo();
  }, [connectionStatus]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="center"
        spacing={2}
      >
        <Grid item>
          {selectValues && (
            <Controller
              name="id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl sx={{ minWidth: 80, minHeight: 80 }}>
                  <InputLabel id={`select-${field.name}`}>
                    {field.name}
                  </InputLabel>

                  <Select
                    labelId={`select-${field.name}`}
                    size="small"
                    label={field.name}
                    disabled={readyState !== ReadyState.OPEN}
                    autoWidth
                    {...field}
                  >
                    {selectValues.map((currValue) => (
                      <MenuItem key={currValue.value} value={currValue.value}>
                        {currValue.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          )}
        </Grid>

        <Grid item>
          <Button
            type="submit"
            color="primary"
            disabled={!(readyState === ReadyState.OPEN) || !isValid}
            variant="contained"
          >
            Buscar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

Form.propTypes = {
  readyState: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form;
