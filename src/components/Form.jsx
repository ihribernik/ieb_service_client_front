import { Button, Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ReadyState } from 'react-use-websocket';

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
          <Controller
            name="id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                multiline={false}
                rows={1}
                size="small"
                label={field.name}
                {...field}
                disabled={readyState !== ReadyState.OPEN}
              />
            )}
          />
        </Grid>

        <Grid item>
          <Button
            type="submit"
            color="primary"
            disabled={!(readyState === ReadyState.OPEN) || !isValid}
            variant="contained"
          >
            search the id
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
