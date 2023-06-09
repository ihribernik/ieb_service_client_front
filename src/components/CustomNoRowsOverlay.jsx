import React from 'react';

function CustomNoRowsOverlay() {
  return (
    <div
      className="norows"
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '20px',
      }}
    >
      no rows fetched
    </div>
  );
}

CustomNoRowsOverlay.propTypes = {};

export default CustomNoRowsOverlay;
