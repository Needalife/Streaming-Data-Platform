import React from 'react';

const FunctionButton = ({ cloudFunctionNames, selectedFunction, setSelectedFunction }) => {
  return (
    <div className="mb-4">
      {cloudFunctionNames.map((funcName) => (
        <button
          key={funcName}
          onClick={() => setSelectedFunction(funcName)}
          className={`ml-8 mr-8 p-4 border rounded ${
            selectedFunction === funcName ? 'text-white' : 'text-blue-500'
          }`}
          style={
            selectedFunction === funcName
              ? { background: 'linear-gradient(to left, #a65ffc, #679cf6)' }
              : {}
          }
        >
          {funcName}
        </button>
      ))}
    </div>
  );
};

export default FunctionButton;
